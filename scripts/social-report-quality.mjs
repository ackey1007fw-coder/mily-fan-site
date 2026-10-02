import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";

export const PUBLICATION_STATES = ["scheduled", "submitted", "published_unverified", "published_verified"];
export const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const requireValue = (value, message) => { if (!value) throw new Error(message); };
const text = value => typeof value === "string" && value.trim().length > 0;
const time = value => Number.isFinite(Date.parse(value));
const reportUrl = id => `https://mily-fan-site.vercel.app/activities/live/#recap-${id}`;

function publicPath(root, src) {
  requireValue(typeof src === "string" && src.startsWith("/media/") && !src.includes("..") && !src.includes("\\"), "Invalid public media path");
  return path.join(root, "public", src);
}

/** Uses the existing approved recap gallery and actual image pixels, not cover=true. */
export async function validateReportMedia(manifest, { root, recaps }) {
  const recap = recaps.find(item => item.id === manifest.recapId);
  requireValue(recap && recap.date === manifest.date, "Unknown or mismatched broadcast");
  requireValue(manifest.platform === "instagram" && manifest.kind === "image", "Unsupported automatic submission: use the existing reviewed video-cover workflow");
  requireValue(Array.isArray(manifest.order) && manifest.order.length > 0 && manifest.order.length <= 10, "Instagram media count must be 1–10");
  requireValue(manifest.coverId && manifest.order[0] === manifest.coverId, "Formal cover must be first");
  requireValue(new Set(manifest.order).size === manifest.order.length, "Repeated media item");
  requireValue(Array.isArray(manifest.items) && manifest.items.length === manifest.order.length, "Incomplete media manifest");
  const assets = [];
  let dimensions;
  for (const id of manifest.order) {
    const item = manifest.items.find(row => row.id === id);
    requireValue(item && /^mily-b\d{2,}-\d{2}-[a-z0-9-]+\.(png|jpg|jpeg)$/.test(path.basename(item.path)), "Missing or nonstandard media item");
    requireValue(recap.gallery?.some(photo => photo.src === item.source), "Source belongs to another broadcast or is unapproved");
    const bytes = await readFile(publicPath(root, item.path));
    requireValue(sha256(bytes) === item.sha256, "Media bytes changed after review");
    const info = await sharp(bytes, { failOn: "warning" }).metadata();
    requireValue(["png", "jpeg"].includes(info.format) && bytes.length <= 8_000_000 && info.width >= 320 && info.width <= 1440, "Unsupported Instagram image");
    requireValue(info.width / info.height >= 0.8 && info.width / info.height <= 1.91 && !info.exif && !info.iptc, "Image ratio or metadata is unsafe");
    if (!dimensions) dimensions = [info.width, info.height];
    requireValue(info.width === dimensions[0] && info.height === dimensions[1], "Carousel crop would change later photo framing");
    const original = await readFile(publicPath(root, item.source));
    const sourceInfo = await sharp(original).metadata();
    const bounds = item.photoBounds;
    requireValue(Array.isArray(bounds) && bounds.length === 4 && bounds.every(Number.isInteger), "Missing photo placement evidence");
    const [left, top, right, bottom] = bounds;
    requireValue(right - left === sourceInfo.width && bottom - top === sourceInfo.height, "Source photo was cropped or resized");
    const region = await sharp(bytes).extract({ left, top, width: right - left, height: bottom - top }).removeAlpha().raw().toBuffer();
    requireValue(region.equals(await sharp(original).removeAlpha().raw().toBuffer()), "Source photo pixels changed");
    assets.push(item);
  }
  const review = manifest.coverReview;
  requireValue(assets[0].path !== assets[0].source && assets[0].photoBounds[1] > 0, "Raw screenshot cannot be the formal cover");
  requireValue(review && text(review.reviewer) && time(review.reviewedAt) && review.sha256 === assets[0].sha256, "Formal cover visual inspection is missing or stale");
  requireValue(Array.isArray(review.observedText) && review.observedText.some(s => /\bMily\b/i.test(s)) && review.observedText.some(s => s.includes(manifest.date.replaceAll("-", "."))), "Cover identity/date text has not been inspected");
  requireValue(text(manifest.coverTitle) && manifest.coverTitle !== "Mily" && manifest.coverTitle !== manifest.date && review.observedText.includes(manifest.coverTitle) && review.observedText.every(text), "Cover title text has not been inspected");
  requireValue(Array.isArray(review.gridCrops) && review.gridCrops.length >= 2, "Grid crop inspection is missing");
  const validRect = bounds => Array.isArray(bounds) && bounds.length === 4 && bounds.every(Number.isInteger) && bounds[0] >= 0 && bounds[1] >= 0 && bounds[2] <= dimensions[0] && bounds[3] <= dimensions[1] && bounds[2] > bounds[0] && bounds[3] > bounds[1];
  requireValue(validRect(review.titleBounds) && validRect(review.personBounds) && review.gridCrops.every(validRect), "Invalid zero-sized or out-of-image review bounds");
  requireValue(new Set(review.gridCrops.map(c => c.join(","))).size === review.gridCrops.length, "Repeated grid crop");
  const cropRatios = review.gridCrops.map(c => (c[2] - c[0]) / (c[3] - c[1]));
  requireValue(cropRatios.some(r => Math.abs(r - 1) < 0.005) && cropRatios.some(r => Math.abs(r - 0.75) < 0.005), "Required square and portrait grid crops missing");
  for (const crop of review.gridCrops) for (const bounds of [review.titleBounds, review.personBounds]) {
    requireValue(Array.isArray(crop) && crop.length === 4 && Array.isArray(bounds) && bounds.length === 4 && [...crop, ...bounds].every(Number.isFinite), "Grid safe-region evidence is missing");
    requireValue(bounds[0] >= crop[0] && bounds[1] >= crop[1] && bounds[2] <= crop[2] && bounds[3] <= crop[3], "Title/person would be lost in grid crop");
  }
  return { recap, assets };
}

function unwrap(response) {
  requireValue(response && !response.isError, "Provider read failed");
  const result = response.structuredContent?.result ?? response;
  requireValue(result && !result.error_code, "Provider response unavailable");
  return result;
}

function snapshotRows(snapshot, key, now) {
  requireValue(snapshot && time(snapshot.checkedAt) && now - Date.parse(snapshot.checkedAt) >= 0 && now - Date.parse(snapshot.checkedAt) <= 300_000, "Missing or stale duplicate-check snapshot");
  const pages = snapshot.responses?.map(unwrap);
  requireValue(Array.isArray(pages) && pages.length > 0, "Missing complete provider snapshot");
  const rows = pages.flatMap(page => { requireValue(Array.isArray(page[key]), "Malformed provider snapshot"); return page[key]; });
  requireValue(rows.every(row => row && typeof row === "object" && !Array.isArray(row)), "Malformed duplicate lookup row");
  const total = pages[0].total;
  requireValue(Number.isInteger(total) && rows.length === total && pages.every(p => p.total === total), "Partial provider snapshot: fetch all pages before submission");
  const keys = rows.map(row => key === "scheduled_posts" ? row.job_id : `${row.platform}:${row.platform_post_id ?? row.request_id}:${row.upload_timestamp ?? ""}`);
  requireValue(keys.every(text) && new Set(keys).size === rows.length && rows.every(row => row.job_id || row.platform_post_id || row.request_id), "Duplicate or unidentified snapshot rows");
  return rows;
}

/** Read-only prepare: refuses unknown checks and never invokes a posting API itself. */
export async function prepareSocialReport(plan, context) {
  const { root, recaps, manifest, ledger, now = Date.now(), fetchBytes } = context;
  const { recap, assets } = await validateReportMedia(manifest, { root, recaps });
  requireValue(plan.recapId === recap.id && plan.platform === "instagram" && plan.kind === "image", "Payload and manifest do not match");
  requireValue(text(plan.profile) && text(plan.account) && plan.provider === "upload-post", "Missing destination/provider");
  requireValue(plan.profile === "ackey" && plan.account === "ackeytan_0720", "Destination is not the approved Instagram report account");
  requireValue(plan.order?.join("|") === manifest.order.join("|"), "Payload media order differs from inspected manifest");
  const url = reportUrl(recap.id);
  requireValue(text(plan.caption) && plan.caption.includes(url), "Required report URL missing from payload");
  requireValue(/(?:^|\s)@mily_chan36(?:\s|$)/.test(plan.caption), "Required Instagram person mention missing");
  const [year, month, day] = recap.date.split("-").map(Number);
  const visibleDateText = plan.caption.replace(/https?:\/\/\S+/g, "");
  requireValue(visibleDateText.includes(recap.date) || visibleDateText.includes(`${year}年${month}月${day}日`), "Caption broadcast date missing or mismatched");
  requireValue(plan.captionReview?.recapId === recap.id && text(plan.captionReview.reviewer) && time(plan.captionReview.reviewedAt) && plan.captionReview.sha256 === sha256(Buffer.from(plan.caption)), "Caption/broadcast visual review is missing or stale");
  requireValue(Array.isArray(plan.personTags) && plan.personTags.some(t => t.username === "mily_chan36" && [t.x, t.y].every(n => Number.isFinite(n) && n >= 0 && n <= 1)), "Person-tag coordinates missing");
  requireValue(Array.isArray(plan.altText) && plan.altText.length === assets.length && plan.altText.every(text), "Incomplete alt text");
  if (plan.scheduledDate) requireValue(time(plan.scheduledDate) && Date.parse(plan.scheduledDate) > now && plan.timezone === "Asia/Tokyo", "Invalid schedule/timezone");
  const scheduled = snapshotRows(plan.snapshots?.scheduled, "scheduled_posts", now);
  const history = snapshotRows(plan.snapshots?.history, "history", now);
  const inProgress = plan.snapshots.history.responses.flatMap(response => {
    const rows = unwrap(response).in_progress;
    requireValue(Array.isArray(rows), "In-progress post lookup missing");
    return rows;
  });
  requireValue(history.every(row => typeof row.success === "boolean"), "Unknown history status");
  const sourceNames = assets.flatMap(item => [path.basename(item.path), path.basename(item.source)]);
  const matches = row => (row.platform === plan.platform || row.platforms?.includes(plan.platform)) && row.profile_username === plan.profile && ([row.title, row.post_caption, row.post_title, row.caption].some(t => typeof t === "string" && t.includes(url)) || sourceNames.includes(row.source_filename));
  const platformsOf = row => {
    const value = row.platform ?? row.platforms;
    const platforms = typeof value === "string" ? [value] : value;
    requireValue(text(row.profile_username) && Array.isArray(platforms) && platforms.length > 0 && platforms.every(p => ["instagram", "x", "tiktok", "youtube", "facebook", "linkedin", "pinterest", "threads", "bluesky"].includes(p)), "Malformed destination in duplicate lookup");
    return platforms;
  };
  for (const row of [...scheduled, ...history, ...inProgress]) {
    requireValue(row && typeof row === "object", "Malformed duplicate lookup row");
    const platforms = platformsOf(row);
    if ((!inProgress.includes(row) && !scheduled.includes(row) && row.success !== true) || row.profile_username !== plan.profile || !platforms.includes(plan.platform)) continue;
    const ids = [row.job_id, row.request_id].filter(text);
    requireValue(ids.length > 0 || text(row.platform_post_id), "Unidentified processing/publication job");
    const related = [...scheduled, ...history].filter(other => [other.job_id, other.request_id].some(id => text(id) && ids.includes(id)));
    const candidates = [row, ...related];
    requireValue(!candidates.some(matches), "Existing scheduled/published processing job; do not duplicate");
    const knownOther = candidates.some(other => other.profile_username === plan.profile && platformsOf(other).includes(plan.platform) && [other.title, other.post_caption, other.post_title, other.caption].some(body => typeof body === "string" && recaps.some(r => r.id !== recap.id && body.includes(reportUrl(r.id)))));
    requireValue(knownOther, "Unknown same-account job/post: read details by job/request ID before submission");
  }
  requireValue(!scheduled.some(matches) && !inProgress.some(matches) && !history.some(row => row.success && matches(row)), "Existing scheduled/published post; do not duplicate");
  await validatePublicationLedger(ledger, { recaps, root });
  requireValue(!ledger.some(row => row.recapId === recap.id && row.platform === plan.platform && row.account === plan.account && PUBLICATION_STATES.includes(row.state)), "Existing ledger record; cancel/reconcile separately before submission");
  requireValue(Array.isArray(plan.mediaUrls) && plan.mediaUrls.length === assets.length && typeof fetchBytes === "function", "Delivery URLs not verified");
  for (let i = 0; i < assets.length; i++) {
    const delivery = new URL(plan.mediaUrls[i]);
    requireValue(delivery.protocol === "https:" && ((delivery.origin === "https://mily-fan-site.vercel.app" && delivery.pathname === assets[i].path) || /^https:\/\/raw\.githubusercontent\.com\/ackey1007fw-coder\/mily-fan-site\/[a-f0-9]{40}\/public\//.test(delivery.href) && delivery.pathname.endsWith(assets[i].path)), "Unverified delivery origin/path");
    requireValue(sha256(await fetchBytes(delivery.href)) === assets[i].sha256, "Delivery bytes differ from inspected asset");
  }
  return { user: plan.profile, platforms: ["instagram"], photosPathsOrUrls: [...plan.mediaUrls], title: plan.caption, ...(plan.scheduledDate ? { scheduledDate: plan.scheduledDate, timezone: plan.timezone } : {}), asyncUpload: true, platformOptions: { media_type: "IMAGE", user_tags: JSON.stringify(plan.personTags), instagram_alt_text: JSON.stringify(plan.altText) } };
}

/** The dispatch adapter is called only after every preflight check succeeds. */
export async function submitSocialReport(plan, context, dispatch) {
  const payload = await prepareSocialReport(plan, context);
  requireValue(typeof dispatch === "function", "No posting adapter supplied");
  const receipt = await dispatch(payload);
  const result = unwrap(receipt);
  requireValue(result.success === true && (result.job_id || result.request_id), "Submission not confirmed: read back jobs/history, do not blindly retry");
  return { payload, receipt, state: plan.scheduledDate && result.job_id ? "scheduled" : "submitted" };
}

/** Verifies review records and decodable screenshots; screen meaning/provenance needs human inspection. */
export async function publicationState(record, observation, { readEvidence = readFile } = {}) {
  if (!record.publishedUrl) return record.scheduledDate ? "scheduled" : "submitted";
  const required = ["body", "mediaOrder", "mention", "siteUrl"];
  if (record.platform === "instagram") required.push("gridCover", "personTag");
  const reviewed = observation && observation.postUrl === record.publishedUrl && text(observation.reviewer) && time(observation.checkedAt) && text(observation.evidencePath) && /^[a-f0-9]{64}$/.test(observation.evidenceSha256 ?? "") && required.every(key => observation.checks?.[key] === "verified");
  if (!reviewed) return "published_unverified";
  const capture = observation.capture;
  if (capture?.kind !== "browser-screenshot" || capture.postUrl !== record.publishedUrl || !time(capture.capturedAt) || Date.parse(capture.capturedAt) > Date.parse(observation.checkedAt)) return "published_unverified";
  const matching = text(record.caption) && observation.visibleCaption === record.caption && text(record.requiredSiteUrl) && observation.visibleCaption.includes(record.requiredSiteUrl) && text(record.personMention) && observation.visibleCaption.includes(record.personMention) && Array.isArray(record.mediaOrder) && record.mediaOrder.length > 0 && JSON.stringify(observation.mediaOrder) === JSON.stringify(record.mediaOrder);
  if (!matching || observation.screenError || (record.platform === "instagram" && (observation.gridCoverId !== record.coverId || !text(record.coverId) || !observation.personTags?.includes("mily_chan36")))) return "published_unverified";
  try {
    const bytes = await readEvidence(observation.evidencePath);
    if (sha256(bytes) !== observation.evidenceSha256) return "published_unverified";
    const screenshot = sharp(bytes, { failOn: "warning" });
    const info = await screenshot.metadata();
    if (!["png", "jpeg"].includes(info.format) || info.width < 320 || info.height < 320) return "published_unverified";
    await screenshot.raw().toBuffer();
    return "published_verified";
  }
  catch { return "published_unverified"; }
}

/** The CI/CLI and submission entry points revalidate every persisted state. */
export async function validatePublicationLedger(ledger, { recaps, root, readEvidence = readFile }) {
  requireValue(Array.isArray(ledger), "Publication ledger unavailable");
  const seen = new Set();
  for (const record of ledger) {
    requireValue(record && PUBLICATION_STATES.includes(record.state) && recaps.some(r => r.id === record.recapId) && ["instagram", "x", "tiktok", "youtube"].includes(record.platform) && text(record.account), "Invalid publication ledger identity/state");
    const key = `${record.recapId}:${record.platform}:${record.account}`;
    requireValue(!seen.has(key), "Duplicate publication ledger entry"); seen.add(key);
    if (record.state === "scheduled") requireValue(text(record.jobId) && time(record.scheduledDate), "Incomplete scheduled ledger entry");
    if (record.state === "submitted") requireValue(text(record.requestId) || text(record.jobId), "Incomplete submitted ledger entry");
    if (record.state.startsWith("published_")) {
      let url; try { url = new URL(record.publishedUrl); } catch { throw new Error("Missing publication URL"); }
      const hosts = { instagram: ["www.instagram.com", "instagram.com"], x: ["x.com", "www.x.com"], tiktok: ["www.tiktok.com", "tiktok.com"], youtube: ["www.youtube.com", "youtube.com", "youtu.be"] };
      requireValue(url.protocol === "https:" && hosts[record.platform].includes(url.hostname), "Wrong publication URL platform");
    }
    if (record.state !== "published_verified") continue;
    requireValue(record.requiredSiteUrl === reportUrl(record.recapId), "Wrong verified report URL");
    const evidencePath = record.observation?.evidencePath;
    requireValue(text(evidencePath) && !path.isAbsolute(evidencePath) && !evidencePath.includes("..") && !evidencePath.includes("\\"), "Missing or unsafe publication evidence path");
    const state = await publicationState(record, record.observation, { readEvidence: () => readEvidence(path.join(root, evidencePath)) });
    requireValue(state === "published_verified", "Published-verified ledger lacks actual-screen evidence");
  }
}
