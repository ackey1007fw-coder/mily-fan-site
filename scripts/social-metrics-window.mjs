import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const HOUR = 3_600_000;
const PLATFORMS = new Set(["youtube", "instagram", "tiktok", "x", "threads"]);
const requireValue = (condition, message) => { if (!condition) throw new Error(message); };
const text = value => typeof value === "string" && value.trim().length > 0;

// Reject local times, normalized impossible dates, and offsets outside RFC 3339's usual range.
function timestamp(value, field) {
  const m = typeof value === "string" && value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2})$/);
  requireValue(m, `Invalid timezone-aware timestamp: ${field}`);
  const zone = m[6], hours = zone === "Z" ? 0 : Number(zone.slice(1, 3));
  const minutes = zone === "Z" ? 0 : Number(zone.slice(4, 6));
  requireValue(hours <= 14 && minutes <= 59 && (hours < 14 || minutes === 0) && zone !== "-00:00", `Invalid timezone offset: ${field}`);
  const ms = Date.parse(value), offset = (zone.startsWith("-") ? -1 : 1) * (hours * 60 + minutes) * 60_000;
  requireValue(Number.isFinite(ms), `Invalid timestamp: ${field}`);
  requireValue(new Date(ms + offset).toISOString() === `${m[1]}T${m[2]}:${m[3]}:${m[4]}.${(m[5] ?? "").padEnd(3, "0")}Z`, `Invalid calendar date: ${field}`);
  return ms;
}

/**
 * Offline validation only. This does not fetch metrics, verify a remote source,
 * establish publication/rights permission, or modify posts or schedules.
 *
 * One row is one metric observation for one platform post. Required identity:
 * profile, cohortId, clipId, platform, postId, metric, definition, unit.
 * Times: actual publishedAt, retrievedAt, and (when known) source dataAsOf.
 * Values: finite non-negative numbers, or null/undefined for unavailable data.
 * Window types: bounded (windowStart/windowEnd required), cumulative, unknown.
 *
 * Eligibility requires an explicitly bounded actual-publication-to-48h interval,
 * sourceType platform_history/saved_snapshot, and coverageVerified === true.
 * The latter is the upstream reviewer's attestation of the underlying evidence,
 * NOT something this metadata validator can independently prove. saved_snapshot
 * means evidence was preserved with a verified coverage interval and dataAsOf.
 * Current cumulative totals, even retrieved near 48h, are never auto-promoted.
 * Keep real input/evidence/output outside the public repository and CI logs.
 */
export function classifyMetricObservation(row, { now = Date.now() } = {}) {
  requireValue(row && typeof row === "object" && !Array.isArray(row), "Observation must be an object");
  for (const field of ["profile", "cohortId", "clipId", "postId", "metric", "definition", "unit"]) {
    requireValue(text(row[field]) && row[field] === row[field].trim(), `Missing or padded identity: ${field}`);
  }
  requireValue(PLATFORMS.has(row.platform), "Unsupported platform");
  requireValue(Number.isFinite(now), "Invalid evaluation time");
  const published = timestamp(row.publishedAt, "publishedAt"), retrieved = timestamp(row.retrievedAt, "retrievedAt");
  requireValue(published <= retrieved && retrieved <= now, "Publication/retrieval/evaluation order invalid");
  const asOf = row.dataAsOf == null ? null : timestamp(row.dataAsOf, "dataAsOf");
  requireValue(asOf === null || (asOf >= published && asOf <= retrieved), "dataAsOf outside publication/retrieval interval");
  requireValue(["bounded", "cumulative", "unknown"].includes(row.windowType), "Unsupported window type");
  const missing = row.value == null;
  requireValue(missing || (typeof row.value === "number" && Number.isFinite(row.value) && row.value >= 0), "Metric must be a finite non-negative number or null");
  requireValue(missing || text(row.evidenceRef), "Numeric metric requires an evidence reference");
  requireValue(missing || ["platform_history", "saved_snapshot", "current_snapshot"].includes(row.sourceType), "Numeric metric requires a source type");
  let windowStart = null, windowEnd = null;
  if (row.windowType === "bounded") {
    windowStart = timestamp(row.windowStart, "windowStart");
    windowEnd = timestamp(row.windowEnd, "windowEnd");
    requireValue(windowStart >= published && windowEnd >= windowStart && windowEnd <= retrieved, "Metric window outside publication/retrieval interval");
    requireValue(asOf === null || windowEnd <= asOf, "Metric window exceeds source dataAsOf");
  } else {
    requireValue(row.windowStart == null && row.windowEnd == null, "Non-bounded metric cannot carry a bounded window");
  }
  let classification;
  if (missing) classification = "missing";
  else if (row.windowType === "unknown" || asOf === null) classification = "unknown_window";
  else if (row.windowType === "cumulative") classification = "cumulative_reference";
  else if (windowStart !== published || windowEnd !== published + 48 * HOUR) classification = "other_window";
  else if (row.coverageVerified !== true || !["platform_history", "saved_snapshot"].includes(row.sourceType) || (row.sourceType === "saved_snapshot" && asOf !== windowEnd)) classification = "unverified_window";
  else classification = "eligible_first48h";
  return {
    classification,
    ageHoursAtRetrieval: (retrieved - published) / HOUR,
    dataAgeHours: asOf === null ? null : (asOf - published) / HOUR,
    windowHours: windowStart === null ? null : (windowEnd - windowStart) / HOUR,
    value: missing ? null : row.value,
  };
}

/**
 * One observation per platform/post/metric is allowed per evaluation batch.
 * Reconcile multiple snapshots/revisions before calling; never sum them.
 * Different profiles/cohorts fail closed. Definitions and units form separate
 * groups. Output counts cover supplied rows only, not an expected-post inventory.
 */
export function summarizeFirst48h(rows, { profile, cohortId, now = Date.now() } = {}) {
  requireValue(Array.isArray(rows) && rows.length <= 10_000, "Expected at most 10000 observation rows");
  requireValue(text(profile) && text(cohortId), "Explicit profile and cohortId are required");
  const seen = new Set(), clips = new Set(), clipPosts = new Map(), postClips = new Map(), groups = new Map();
  for (const row of rows) {
    const result = classifyMetricObservation(row, { now });
    requireValue(row.profile === profile && row.cohortId === cohortId, "Observation outside selected profile/cohort");
    const observationKey = JSON.stringify([row.platform, row.postId, row.metric]);
    requireValue(!seen.has(observationKey), "Duplicate post metric: reconcile observations before analysis");
    seen.add(observationKey);
    const clipKey = JSON.stringify([row.platform, row.clipId]);
    requireValue(!clipPosts.has(clipKey) || clipPosts.get(clipKey) === row.postId, "Multiple posts for one platform clip: review possible repost");
    clipPosts.set(clipKey, row.postId);
    const postKey = JSON.stringify([row.platform, row.postId]);
    requireValue(!postClips.has(postKey) || postClips.get(postKey) === row.clipId, "Conflicting clip identity for one platform post");
    postClips.set(postKey, row.clipId);
    clips.add(row.clipId);
    const key = JSON.stringify([row.platform, row.metric, row.definition, row.unit]);
    if (!groups.has(key)) groups.set(key, {
      platform: row.platform, metric: row.metric, definition: row.definition, unit: row.unit,
      suppliedCount: 0, eligibleCount: 0, missingCount: 0, excludedCounts: {}, values: [],
    });
    const group = groups.get(key);
    group.suppliedCount++;
    if (result.classification === "eligible_first48h") {
      group.eligibleCount++;
      group.values.push(result.value);
    } else {
      group.excludedCounts[result.classification] = (group.excludedCounts[result.classification] ?? 0) + 1;
      if (result.classification === "missing") group.missingCount++;
    }
  }
  return {
    profile, cohortId, evidenceValidation: "metadata_only",
    suppliedRowCount: rows.length, suppliedClipCount: clips.size,
    groups: [...groups.values()].map(({ values, ...group }) => {
      values.sort((a, b) => a - b);
      const middle = Math.floor(values.length / 2);
      const median = values.length === 0 ? null : values.length % 2 ? values[middle] : values[middle - 1] / 2 + values[middle] / 2;
      return { ...group, medianFirst48h: median };
    }),
  };
}

// Usage: node scripts/social-metrics-window.mjs <private-input.json> <profile> <cohortId>
// Input is an array of observations; output is JSON on stdout. No output files are created.
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    requireValue(process.argv.length === 5, "Usage: social-metrics-window.mjs <private-input.json> <profile> <cohortId>");
    const [, , filename, profile, cohortId] = process.argv;
    const info = await stat(filename);
    requireValue(info.isFile() && info.size <= 1_048_576, "Input must be a regular JSON file no larger than 1 MiB");
    const bytes = await readFile(filename);
    requireValue(bytes.length <= 1_048_576, "Input grew beyond 1 MiB");
    let rows;
    try { rows = JSON.parse(bytes.toString("utf8").replace(/^\uFEFF/, "")); }
    catch { throw new Error("Input is not valid JSON"); }
    console.log(JSON.stringify(summarizeFirst48h(rows, { profile, cohortId }), null, 2));
  } catch (error) {
    // Do not echo file contents, private paths, or upstream payloads in errors.
    console.error(error?.code ? "Unable to read metrics input" : error.message);
    process.exitCode = 1;
  }
}
