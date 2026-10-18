import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { classifyMetricObservation, summarizeFirst48h } from "./social-metrics-window.mjs";

// All identities, references, dates, and values below are synthetic fixtures.
const now = Date.parse("2020-01-10T00:00:00Z");
const context = { profile: "fixture-profile", cohortId: "fixture-cohort", now };
const fixture = (overrides = {}) => ({
  profile: context.profile, cohortId: context.cohortId, clipId: "clip-a", postId: "post-a", platform: "youtube",
  metric: "views", definition: "fixture-video-views-v1", unit: "count", value: 100,
  publishedAt: "2020-01-01T12:30:00+09:00", retrievedAt: "2020-01-08T03:30:00Z", dataAsOf: "2020-01-08T03:00:00Z",
  windowType: "bounded", windowStart: "2020-01-01T03:30:00Z", windowEnd: "2020-01-03T03:30:00Z",
  sourceType: "platform_history", evidenceRef: "fixture-evidence", coverageVerified: true, ...overrides,
});
const classify = row => classifyMetricObservation(row, { now }).classification;
const cumulative = overrides => fixture({ windowType: "cumulative", windowStart: null, windowEnd: null, sourceType: "current_snapshot", ...overrides });

test("equivalent JST and UTC times produce an eligible historical first48h window", () => {
  const result = classifyMetricObservation(fixture(), { now });
  assert.equal(result.classification, "eligible_first48h");
  assert.equal(result.windowHours, 48);
  assert.equal(result.ageHoursAtRetrieval, 168);
});
test("a saved snapshot with attested coverage can qualify without fetching its evidence", () => {
  assert.equal(classify(fixture({ sourceType: "saved_snapshot", dataAsOf: "2020-01-03T03:30:00Z" })), "eligible_first48h");
});
test("a late saved cumulative snapshot cannot claim an earlier bounded 48h interval", () => {
  assert.equal(classify(fixture({ sourceType: "saved_snapshot" })), "unverified_window");
});
test("seven-day cumulative totals are not first48h", () => {
  assert.equal(classify(cumulative()), "cumulative_reference");
});
test("even cumulative totals retrieved exactly at 48h are not auto-promoted", () => {
  assert.equal(classify(cumulative({ retrievedAt: "2020-01-03T03:30:00Z", dataAsOf: "2020-01-03T03:30:00Z" })), "cumulative_reference");
});
test("a current snapshot cannot masquerade as verified historical coverage", () => {
  assert.equal(classify(fixture({ sourceType: "current_snapshot" })), "unverified_window");
});
test("48h-looking intervals require explicit true coverage attestation", () => {
  for (const coverageVerified of [false, undefined, "true"]) assert.equal(classify(fixture({ coverageVerified })), "unverified_window");
});
test("missing source dataAsOf remains unknown even for a claimed bounded window", () => {
  assert.equal(classify(fixture({ dataAsOf: null })), "unknown_window");
});
test("null and omitted values remain missing; measured zero is included", () => {
  for (const value of [null, undefined]) assert.equal(classify(fixture({ value, evidenceRef: null })), "missing");
  const result = summarizeFirst48h([fixture({ value: 0 })], context);
  assert.equal(result.groups[0].medianFirst48h, 0);
  assert.equal(result.groups[0].eligibleCount, 1);
});
test("negative, non-finite, boolean and numeric-string values are rejected", () => {
  for (const value of [-1, NaN, Infinity, true, "100"]) assert.throws(() => classify(fixture({ value })), /finite non-negative/);
});
test("timezone-less, impossible calendar dates and invalid offsets are rejected", () => {
  for (const publishedAt of ["2020-01-01T03:30:00", "2020-02-30T03:30:00Z", "2020-01-01T24:00:00Z", "2020-01-01T12:30:00+14:01", "2020-01-01T03:30:00-00:00"]) {
    assert.throws(() => classify(fixture({ publishedAt })), /timestamp|calendar|offset/);
  }
});
test("a 48h calendar-day interval not starting at actual publication is not first48h", () => {
  assert.equal(classify(fixture({ windowStart: "2020-01-02T00:00:00Z", windowEnd: "2020-01-04T00:00:00Z" })), "other_window");
});
test("near-48h observations remain separate without rounding or interpolation", () => {
  for (const windowEnd of ["2020-01-03T03:29:59Z", "2020-01-03T03:30:01Z", "2020-01-03T04:30:00Z"]) {
    assert.equal(classify(fixture({ windowEnd })), "other_window");
  }
});
test("stale source time, future retrieval and reversed windows fail closed", () => {
  assert.throws(() => classify(fixture({ dataAsOf: "2020-01-02T00:00:00Z" })), /exceeds source/);
  assert.throws(() => classify(fixture({ retrievedAt: "2020-01-11T00:00:00Z" })), /order invalid/);
  assert.throws(() => classify(fixture({ windowStart: "2020-01-04T00:00:00Z" })), /outside/);
  assert.throws(() => classify(fixture({ dataAsOf: "2020-01-09T00:00:00Z" })), /outside/);
});
test("unknown-window and missing rows produce no invented median", () => {
  const rows = [fixture({ value: null }), cumulative({ postId: "post-b", clipId: "clip-b", windowType: "unknown" })];
  const group = summarizeFirst48h(rows, context).groups[0];
  assert.equal(group.medianFirst48h, null);
  assert.equal(group.eligibleCount, 0);
  assert.equal(group.missingCount, 1);
  assert.deepEqual(group.excludedCounts, { missing: 1, unknown_window: 1 });
});
test("medians exclude late totals and missing values; even and odd groups are correct", () => {
  const rows = [0, 20, 100].map((value, i) => fixture({ value, clipId: `clip-${i}`, postId: `post-${i}` }));
  const references = [cumulative({ value: 9999, postId: "post-late", clipId: "clip-late" }), fixture({ value: null, postId: "post-missing", clipId: "clip-missing" })];
  const result = summarizeFirst48h([...rows, ...references], context);
  assert.equal(result.groups[0].medianFirst48h, 20);
  assert.equal(result.groups[0].eligibleCount, 3);
  assert.equal(result.groups[0].suppliedCount, 5);
  assert.equal(summarizeFirst48h(rows.slice(0, 2), context).groups[0].medianFirst48h, 10);
});
test("platforms, definitions and units never share a median; clips are not multiplied by platform", () => {
  const rows = [fixture(), fixture({ platform: "instagram", value: 10 }), fixture({ postId: "post-b", clipId: "clip-b", definition: "fixture-new-definition", value: 1000 }), fixture({ postId: "post-c", clipId: "clip-c", unit: "other-unit", value: 500 })];
  const result = summarizeFirst48h(rows, context);
  assert.equal(result.groups.length, 4);
  assert.equal(result.suppliedClipCount, 3);
  assert.deepEqual(result.groups.map(group => group.medianFirst48h), [100, 10, 1000, 500]);
});
test("duplicate or revised metric observations are rejected rather than summed", () => {
  assert.throws(() => summarizeFirst48h([fixture(), fixture()], context), /Duplicate post metric/);
  assert.throws(() => summarizeFirst48h([fixture(), fixture({ value: 120, definition: "changed" })], context), /Duplicate post metric/);
});
test("conflicting clip identity and possible reposts require reconciliation", () => {
  assert.throws(() => summarizeFirst48h([fixture(), fixture({ metric: "shares", clipId: "other-clip" })], context), /Conflicting clip/);
  assert.throws(() => summarizeFirst48h([fixture(), fixture({ postId: "repost" })], context), /Multiple posts/);
});
test("other profiles/cohorts, missing scope and unsupported platforms fail closed", () => {
  for (const change of [{ profile: "other" }, { cohortId: "other" }]) assert.throws(() => summarizeFirst48h([fixture(change)], context), /outside selected/);
  assert.throws(() => summarizeFirst48h([], {}), /Explicit profile/);
  assert.throws(() => classify(fixture({ platform: "unknown" })), /Unsupported platform/);
});
test("numeric evidence is mandatory, contradictory window metadata is rejected", () => {
  assert.throws(() => classify(fixture({ evidenceRef: "" })), /evidence reference/);
  assert.throws(() => classify(fixture({ windowType: "cumulative" })), /Non-bounded/);
});
test("empty input has zero supplied observations but no invented expected-post completeness", () => {
  const result = summarizeFirst48h([], context);
  assert.equal(result.suppliedRowCount, 0);
  assert.equal(result.suppliedClipCount, 0);
  assert.equal(result.evidenceValidation, "metadata_only");
  assert.deepEqual(result.groups, []);
});
test("CLI reads a synthetic private file, returns JSON, and does not echo malformed contents", async () => {
  const dir = await mkdtemp(join(tmpdir(), "metric-window-test-"));
  try {
    const filename = join(dir, "observations.json");
    const script = fileURLToPath(new URL("./social-metrics-window.mjs", import.meta.url));
    await writeFile(filename, JSON.stringify([fixture()]));
    const args = [script, filename, context.profile, context.cohortId];
    const good = spawnSync(process.execPath, args, { encoding: "utf8" });
    assert.equal(good.status, 0, good.stderr);
    assert.equal(JSON.parse(good.stdout).groups[0].medianFirst48h, 100);
    await writeFile(filename, '{"private-marker": invalid');
    const bad = spawnSync(process.execPath, args, { encoding: "utf8" });
    assert.equal(bad.status, 1);
    assert.equal(bad.stdout, "");
    assert.match(bad.stderr, /not valid JSON/);
    assert.ok(!bad.stderr.includes("private-marker"));
  } finally { await rm(dir, { recursive: true, force: true }); }
});
