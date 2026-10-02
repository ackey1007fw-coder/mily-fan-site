import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { prepareSocialReport, submitSocialReport, publicationState, validateReportMedia, validatePublicationLedger, sha256 } from "./social-report-quality.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse((await readFile(path.join(root, "scripts/social-report-media.json"), "utf8")).replace(/^\uFEFF/, ""));
const now = Date.parse("2026-10-02T06:00:00Z"), checkedAt = new Date(now).toISOString();
const caption = "@mily_chan36\n2026年10月2日 朝配信\nhttps://mily-fan-site.vercel.app/activities/live/#recap-2026-10-02-morning-showroom";
const fresh = () => ({
  recapId: manifest.recapId, platform: "instagram", kind: "image", provider: "upload-post", profile: "ackey", account: "ackeytan_0720",
  order: [...manifest.order], mediaUrls: manifest.items.map(item => "https://mily-fan-site.vercel.app" + item.path), caption,
  captionReview: { recapId: manifest.recapId, reviewer: "test visual-review fixture", reviewedAt: checkedAt, sha256: sha256(Buffer.from(caption)) },
  personTags: [{ username: "mily_chan36", x: 0.5, y: 0.9 }], altText: manifest.items.map((item, i) => i ? "approved source still" : "Mily morning cover"),
  scheduledDate: "2026-10-03T09:00:00+09:00", timezone: "Asia/Tokyo",
  snapshots: { scheduled: { checkedAt, responses: [{ scheduled_posts: [], total: 0 }] }, history: { checkedAt, responses: [{ history: [], in_progress: [], total: 0 }] } },
});
const context = () => ({ root, recaps: streamRecaps, manifest: structuredClone(manifest), ledger: [], now,
  fetchBytes: async url => readFile(path.join(root, "public", new URL(url).pathname)) });

function historical() {
  const p = fresh();
  p.snapshots.history.responses[0].total = 1;
  p.snapshots.history.responses[0].history = [{ request_id: "old-request", platform_post_id: "17890001", profile_username: "ackey", platform: "instagram", post_url: "https://www.instagram.com/p/olderFixture/", post_caption: "A different old post", success: true, upload_timestamp: "2026-09-29T09:00:00Z" }];
  p.snapshots.nativeMedia = { checkedAt, request: { user: "ackey", platform: "instagram", limit: 100 }, responses: [{ success: true, media: [{ id: "17890001", caption: "A different old post", media_type: "IMAGE", permalink: "https://www.instagram.com/p/olderFixture/", timestamp: "2026-09-29T08:47:31+0000" }] }] };
  return p;
}

test("native published media ID/permalink and explicit UTC time prove an older unrelated post", async () => {
  await prepareSocialReport(historical(), context());
  const p = historical(); p.snapshots.nativeMedia.responses[0].media[0].timestamp = "2026-10-01T23:59:59.999+09:00";
  await prepareSocialReport(p, context());
});

const historicalFailures = [
  ["upload timestamp is not publication evidence", p => { delete p.snapshots.nativeMedia; }],
  ["publication date missing", p => { delete p.snapshots.nativeMedia.responses[0].media[0].timestamp; }],
  ["timezone missing", p => { p.snapshots.nativeMedia.responses[0].media[0].timestamp = "2026-09-29T08:47:31"; }],
  ["invalid calendar date", p => { p.snapshots.nativeMedia.responses[0].media[0].timestamp = "2026-02-30T08:47:31Z"; }],
  ["invalid timezone", p => { p.snapshots.nativeMedia.responses[0].media[0].timestamp = "2026-09-29T08:47:31+15:00"; }],
  ["same report day JST boundary", p => { p.snapshots.nativeMedia.responses[0].media[0].timestamp = "2026-10-01T15:00:00Z"; }],
  ["UTC date earlier but JST report day", p => { p.snapshots.nativeMedia.responses[0].media[0].timestamp = "2026-10-01T18:00:00Z"; }],
  ["future publication", p => { p.snapshots.nativeMedia.responses[0].media[0].timestamp = "2026-10-03T08:00:00Z"; }],
  ["wrong native media ID", p => { p.snapshots.nativeMedia.responses[0].media[0].id = "17890002"; }],
  ["wrong native permalink", p => { p.snapshots.nativeMedia.responses[0].media[0].permalink = "https://www.instagram.com/p/other/"; }],
  ["unknown publication status", p => { p.snapshots.history.responses[0].history[0].status = null; }],
  ["queued status is not published", p => { p.snapshots.history.responses[0].history[0].status = "queued"; }],
  ["inbox delivery", p => { p.snapshots.history.responses[0].history[0].fallback_to_inbox = true; }],
];
for (const [name, change] of historicalFailures) test(`historical classification blocks ${name}`, async () => {
  const p = historical(); change(p); let calls = 0;
  await assert.rejects(() => submitSocialReport(p, context(), () => { calls++; }), /Unknown same-account/);
  assert.equal(calls, 0);
});

test("native media read failure, stale snapshot or wrong account cannot excuse old history", async () => {
  for (const change of [p => { p.snapshots.nativeMedia.checkedAt = "2026-10-01T00:00:00Z"; }, p => { p.snapshots.nativeMedia.request.user = "other"; }, p => { p.snapshots.nativeMedia.responses[0].success = false; }]) {
    const p = historical(); change(p);
    await assert.rejects(() => prepareSocialReport(p, context()), /native-media|Native-media/);
  }
});

test("historical publication cannot excuse an unknown active job or scheduled row", async () => {
  const p = historical(), row = p.snapshots.history.responses[0].history[0];
  p.snapshots.history.responses[0].in_progress = [{ ...row, job_id: "active", post_caption: null, success: null }];
  await assert.rejects(() => prepareSocialReport(p, context()), /Unknown same-account/);
  p.snapshots.history.responses[0].in_progress = [];
  p.snapshots.scheduled.responses[0] = { total: 1, scheduled_posts: [{ ...row, job_id: "active", post_caption: null, success: null }] };
  await assert.rejects(() => prepareSocialReport(p, context()), /Unknown same-account/);
});

test("native caption edited to target URL remains a duplicate despite old publication date", async () => {
  const p = historical(); p.snapshots.nativeMedia.responses[0].media[0].caption = caption;
  await assert.rejects(() => prepareSocialReport(p, context()), /Existing target report/);
});

test("formal cover plus nine stills preserves all ten approved broadcast scenes and provider payload", async () => {
  const p = fresh(), c = context(), payload = await prepareSocialReport(p, c);
  assert.equal(payload.photosPathsOrUrls.length, 10);
  assert.match(payload.photosPathsOrUrls[0], /b180-11.*cover\.png$/);
  assert.equal(payload.scheduledDate, p.scheduledDate);
  assert.deepEqual(JSON.parse(payload.platformOptions.user_tags), p.personTags);
  assert.equal(new Set(c.manifest.items.map(item => item.source)).size, 10);
});

const failures = [
  ["no formal cover", (p, c) => { delete c.manifest.coverId; }, /cover must be first/i],
  ["raw screenshot first", (p, c) => { const first = c.manifest.items[0]; first.path = first.source; first.sha256 = "0".repeat(64); }, /bytes changed|Raw screenshot/],
  ["URL omitted", p => { p.caption = "@mily_chan36 2026年10月2日"; }, /report URL/],
  ["mention omitted", p => { p.caption = p.caption.replace("@mily_chan36", "Mily"); }, /mention/],
  ["zero media", (p, c) => { c.manifest.order = []; }, /media count/],
  ["eleven media", (p, c) => { c.manifest.order.push("extra"); }, /media count/],
  ["reordered photos", p => { p.order.reverse(); }, /media order/],
  ["wrong broadcast source", (p, c) => { c.manifest.items[1].source = "/media/live/mily-b179-01-20261001-night-000100.jpg"; }, /another broadcast/],
  ["stale visual inspection", (p, c) => { c.manifest.coverReview.sha256 = "0".repeat(64); }, /visual inspection/],
  ["unconfirmed grid", (p, c) => { delete c.manifest.coverReview.gridCrops; }, /Grid crop inspection/],
  ["lost title in grid", (p, c) => { c.manifest.coverReview.titleBounds = [0, 0, 500, 300]; }, /lost in grid/],
  ["no title text", (p, c) => { c.manifest.coverReview.observedText = ["Mily", "2026.10.02"]; }, /title text/],
  ["zero title and person bounds", (p, c) => { c.manifest.coverReview.titleBounds = c.manifest.coverReview.personBounds = [0, 0, 0, 0]; }, /Invalid zero/],
  ["outside image crop", (p, c) => { c.manifest.coverReview.gridCrops[0] = [0, 0, 720, 901]; }, /out-of-image/],
  ["duplicate crop", (p, c) => { c.manifest.coverReview.gridCrops[1] = c.manifest.coverReview.gridCrops[0]; }, /Repeated grid/],
  ["no portrait grid", (p, c) => { c.manifest.coverReview.gridCrops[1] = [0, 80, 720, 800]; }, /square and portrait/],
  ["caption review omitted", p => { delete p.captionReview; }, /Caption\/broadcast/],
  ["wrong stream date", p => { p.caption = p.caption.replace("2026年10月2日", "2026年10月1日"); }, /broadcast date/],
  ["person tag omitted", p => { p.personTags = []; }, /Person-tag/],
  ["stale duplicate lookup", p => { p.snapshots.scheduled.checkedAt = "2026-10-01T00:00:00Z"; }, /stale duplicate/],
  ["lookup error", p => { p.snapshots.scheduled.responses = [{ isError: true }]; }, /read failed/],
  ["partial history", p => { p.snapshots.history.responses[0].total = 359; }, /Partial provider/],
  ["existing scheduled post", p => { p.snapshots.scheduled.responses[0] = { total: 1, scheduled_posts: [{ job_id: "old", profile_username: "ackey", platforms: ["instagram"], title: caption }] }; }, /Existing scheduled/],
  ["existing published post", p => { p.snapshots.history.responses[0] = { total: 1, in_progress: [], history: [{ platform_post_id: "old", profile_username: "ackey", platform: "instagram", post_caption: caption, success: true }] }; }, /Existing scheduled\/published/],
  ["existing processing job", p => { p.snapshots.history.responses[0].in_progress = [{ job_id: "active", profile_username: "ackey", platform: "instagram", post_caption: caption }]; }, /Existing scheduled/],
  ["existing ledger post", (p, c) => { c.ledger = [{ recapId: p.recapId, account: p.account, platform: p.platform, state: "published_unverified", publishedUrl: "https://www.instagram.com/p/fixture/" }]; }, /Existing ledger/],
  ["queued real-schema null caption", p => { p.snapshots.history.responses[0].in_progress = [{ job_id: "old", request_id: "request", profile_username: "ackey", platform: "instagram", post_title: null, post_caption: null, status: "queued", success: null }]; }, /Unknown same-account/],
  ["unknown scheduled row", p => { p.snapshots.scheduled.responses[0] = { total: 1, scheduled_posts: [{ job_id: "old", profile_username: "ackey", platforms: "instagram", title: null, caption: null }] }; }, /Unknown same-account/],
  ["unknown successful history", p => { p.snapshots.history.responses[0] = { total: 1, in_progress: [], history: [{ platform_post_id: "old", profile_username: "ackey", platform: "instagram", post_caption: null, success: true }] }; }, /Unknown same-account/],
  ["processing ID missing", p => { p.snapshots.history.responses[0].in_progress = [{ profile_username: "ackey", platform: "instagram" }]; }, /Unidentified/],
  ["malformed processing destination", p => { p.snapshots.history.responses[0].in_progress = [{ job_id: "old", profile_username: "ackey", platform: { instagram: true } }]; }, /Malformed destination/],
  ["processing destination missing", p => { p.snapshots.history.responses[0].in_progress = [{ job_id: "old" }]; }, /Malformed destination/],
  ["null processing row", p => { p.snapshots.history.responses[0].in_progress = [null]; }, /Malformed duplicate/],
  ["invalid persisted verified state", (p, c) => { c.ledger = [{ state: "published_verified" }]; }, /Invalid publication/],
  ["unreadable delivery bytes", (p, c) => { c.fetchBytes = async () => Buffer.from("SPA fallback HTML"); }, /Delivery bytes/],
  ["unknown delivery host", p => { p.mediaUrls[0] = "https://example.com/cover.png"; }, /delivery origin/],
];
for (const [name, change, expected] of failures) test(`${name} blocks posting before adapter is called`, async () => {
  const p = fresh(), c = context(); change(p, c); let calls = 0;
  await assert.rejects(() => submitSocialReport(p, c, () => { calls++; }), expected);
  assert.equal(calls, 0);
});

test("passing preflight dispatches once and reports scheduled rather than verified", async () => {
  let calls = 0; const result = await submitSocialReport(fresh(), context(), async () => { calls++; return { success: true, job_id: "fixture" }; });
  assert.equal(calls, 1); assert.equal(result.state, "scheduled");
});

test("ambiguous API receipt cannot confirm a reservation or trigger a retry", async () => {
  for (const receipt of [{ success: false }, { success: true }, {}]) {
    let calls = 0;
    await assert.rejects(() => submitSocialReport(fresh(), context(), async () => { calls++; return receipt; }), /Submission not confirmed/);
    assert.equal(calls, 1);
  }
});

test("registered live bytes have intact source regions; raw-image-only self declaration cannot pass", async () => {
  await validateReportMedia(manifest, { root, recaps: streamRecaps });
  const c = context(), first = c.manifest.items[0];
  const bytes = await readFile(path.join(root, "public", first.source));
  first.path = first.source; first.sha256 = sha256(bytes); first.photoBounds = [0, 0, 640, 360];
  c.manifest.order = [first.id]; c.manifest.items = [first]; c.manifest.coverReview.sha256 = first.sha256;
  await assert.rejects(() => validateReportMedia(c.manifest, c), /Raw screenshot/);
});

const publication = () => ({ platform: "instagram", publishedUrl: "https://www.instagram.com/p/test/", caption, requiredSiteUrl: caption.split("\n")[2], personMention: "@mily_chan36", mediaOrder: manifest.order, coverId: manifest.coverId });
const observation = () => ({ postUrl: "https://www.instagram.com/p/test/", reviewer: "test screen-inspection fixture", checkedAt, evidencePath: "fixture.png", evidenceSha256: sha256(Buffer.from("screen fixture")), visibleCaption: caption, mediaOrder: manifest.order, gridCoverId: manifest.coverId, personTags: ["mily_chan36"], checks: { body: "verified", mediaOrder: "verified", mention: "verified", siteUrl: "verified", gridCover: "verified", personTag: "verified" } });
// Codec fixture only: these bytes do not claim a real SNS screen inspection.
const screenshotFixture = await readFile(path.join(root, "public", manifest.items[0].path));
const screenObservation = observation;
const inspectedObservation = () => ({ ...screenObservation(), openedSiteUrl: publication().requiredSiteUrl, checks: { ...screenObservation().checks, siteClickthrough: "verified" }, evidenceSha256: sha256(screenshotFixture), capture: { kind: "browser-screenshot", postUrl: "https://www.instagram.com/p/test/", capturedAt: checkedAt } });
const evidence = { readEvidence: async () => screenshotFixture };

test("API success or inaccessible screen cannot be promoted to verified", async () => {
  assert.equal(await publicationState({ success: true }), "submitted");
  assert.equal(await publicationState({ scheduledDate: "2026-10-03", success: true }), "scheduled");
  assert.equal(await publicationState({ ...publication(), success: true }), "published_unverified");
  assert.equal(await publicationState(publication(), { ...observation(), screenError: "timeout" }, evidence), "published_unverified");
});
test("all real-screen observations plus evidence hash are required for verified", async () => {
  assert.equal(await publicationState(publication(), inspectedObservation(), evidence), "published_verified");
  for (const key of Object.keys(inspectedObservation().checks)) {
    const o = inspectedObservation(); o.checks[key] = "unknown";
    assert.equal(await publicationState(publication(), o, evidence), "published_unverified", key);
  }
  const o = inspectedObservation(); o.personTags = [];
  assert.equal(await publicationState(publication(), o, evidence), "published_unverified");
  assert.equal(await publicationState(publication(), observation(), { readEvidence: async () => { throw new Error("missing"); } }), "published_unverified");
  const wrongDestination = inspectedObservation(); wrongDestination.openedSiteUrl = "https://mily-fan-site.vercel.app/";
  assert.equal(await publicationState(publication(), wrongDestination, evidence), "published_unverified");
});
test("X payload URL and actual visible URL are independent; claimed check cannot hide stripped URL", async () => {
  const r = { ...publication(), platform: "x", personMention: "@Mily_chan36", caption: caption.replace("@mily_chan36", "@Mily_chan36") };
  const o = { ...inspectedObservation(), visibleCaption: r.caption };
  assert.equal(await publicationState(r, o, evidence), "published_verified");
  o.visibleCaption = r.caption.replace(r.requiredSiteUrl, "");
  assert.equal(await publicationState(r, o, evidence), "published_unverified");
});

test("arbitrary text, missing capture provenance and another post cannot verify publication", async () => {
  assert.equal(await publicationState(publication(), observation(), { readEvidence: async () => Buffer.from("screen fixture") }), "published_unverified");
  const o = inspectedObservation(); o.capture.postUrl = "https://www.instagram.com/p/other/";
  assert.equal(await publicationState(publication(), o, evidence), "published_unverified");
  const textCapture = inspectedObservation(); textCapture.evidenceSha256 = sha256(Buffer.from("text"));
  assert.equal(await publicationState(publication(), textCapture, { readEvidence: async () => Buffer.from("text") }), "published_unverified");
});

test("ledger entry validator rechecks identity and actual verified evidence", async () => {
  const options = { root, recaps: streamRecaps, ...evidence };
  const verified = { ...publication(), recapId: manifest.recapId, account: "ackeytan_0720", state: "published_verified", observation: inspectedObservation() };
  await validatePublicationLedger([verified], options);
  await assert.rejects(() => validatePublicationLedger([{ state: "published_verified" }], options), /Invalid publication/);
  await assert.rejects(() => validatePublicationLedger([{ ...verified, observation: undefined }], options), /evidence path/);
  await assert.rejects(() => validatePublicationLedger([verified], { ...options, readEvidence: async () => Buffer.from("garbage") }), /actual-screen evidence/);
  await validatePublicationLedger([{ recapId: manifest.recapId, account: "ackeytan_0720", platform: "instagram", state: "published_unverified", publishedUrl: verified.publishedUrl }], options);
  await assert.rejects(() => validatePublicationLedger([{ state: "scheduled" }], options), /Invalid publication/);
  await assert.rejects(() => validatePublicationLedger([{ ...verified, state: "submitted", observation: undefined }], options), /Incomplete submitted/);
});

test("queued null-caption job needs an ID-bound known other recap", async () => {
  const p = fresh();
  p.snapshots.history.responses[0].in_progress = [{ job_id: "other", request_id: "request", profile_username: "ackey", platform: "instagram", post_title: null, post_caption: null, status: "queued", success: null }];
  p.snapshots.scheduled.responses[0] = { total: 1, scheduled_posts: [{ job_id: "other", profile_username: "ackey", platforms: "instagram", title: "https://mily-fan-site.vercel.app/activities/live/#recap-2026-10-01-night-showroom" }] };
  await prepareSocialReport(p, context());
  p.snapshots.scheduled.responses[0].scheduled_posts[0].job_id = "unrelated";
  await assert.rejects(() => prepareSocialReport(p, context()), /Unknown same-account/);
});
