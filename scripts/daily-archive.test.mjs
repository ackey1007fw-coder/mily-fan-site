import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  DAILY_STREAM_ENTRIES, groupByBroadcastDate, observationPoints, lastObservedValue, METRICS,
} from "../public/data-lab/assets/daily-archive-core.js";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const dataFor = (file) => JSON.parse(read("public/data-lab/data/" + file));

test("daily archive uses one real public snapshot per date/slot and latest-first grouping", () => {
  const pairs = DAILY_STREAM_ENTRIES.map((entry) => entry.date + "/" + entry.slot);
  assert.equal(new Set(pairs).size, pairs.length);
  const groups = groupByBroadcastDate();
  assert.deepEqual(groups.map((group) => group.date), [...groups.map((group) => group.date)].sort().reverse());
  const eighteenth = groups.find((group) => group.date === "2026-10-18");
  assert.deepEqual(eighteenth.entries.map((entry) => entry.slot), ["night", "morning"]);
  assert.ok(groups.every((group) => group.entries.every((entry) => entry.date === group.date)));
  for (const entry of DAILY_STREAM_ENTRIES) {
    const data = dataFor(entry.file);
    assert.equal(data.dateJst ?? data.date_jst, entry.date);
    assert.match(entry.section, /^(morning|noon|night)-202610\d\d$/);
    assert.match(entry.report, /^\/data-lab\//);
  }
});

test("10/20 chart reads real time-stamped points; 10/19 missing values stay null", () => {
  const morning = dataFor("mily-morning-20261020-aggregate.json");
  for (const metric of Object.keys(METRICS)) {
    const points = observationPoints(morning, metric, "2026-10-20");
    assert.equal(points.length, 35);
    assert.ok(points.every((point, index) => index === 0 || point.time > points[index - 1].time));
    assert.equal(points.at(-1).value, morning.lastValidOnline[metric]);
  }
  const unavailable = dataFor("mily-morning-20261019-aggregate.json");
  assert.equal(observationPoints(unavailable, "stars", "2026-10-19").length, 0);
  assert.equal(lastObservedValue(unavailable, "stars", "2026-10-19"), null);
  assert.equal(lastObservedValue(unavailable, "visits", "2026-10-19"), null);
  assert.equal(lastObservedValue(unavailable, "comments", "2026-10-19"), null);
});

test("valid zero is retained; missing/invalid points and imprecise window starts are excluded", () => {
  const rows = { observations: [
    { atJst: "2026-10-20T06:00:00+09:00", stars: 0, comments: null },
    { atJst: "2026-10-20T06:01:00+09:00", stars: null, comments: 0 },
    { atJst: "invalid-time", stars: 40, comments: 3 },
    { atJst: "2026-10-20T06:02:00+09:00", stars: 25, comments: 1 },
  ] };
  assert.deepEqual(observationPoints(rows, "stars", "2026-10-20").map((p) => p.value), [0, 25]);
  assert.deepEqual(observationPoints(rows, "comments", "2026-10-20").map((p) => p.value), [0, 1]);
  assert.equal(lastObservedValue({ earlyPartialObservation: { stars: 0 } }, "stars", "2026-10-20"), null);
  assert.deepEqual(observationPoints({ five_minute_window_endpoints: [{ window_start_jst: "06:00", stars: 99 }] }, "stars", "2026-10-20"), []);
});

test("crossing midnight stays on broadcast date and documented data gaps stay gaps", () => {
  const night = dataFor("mily-night-20261018-aggregate.json");
  assert.equal(night.dateJst, "2026-10-18");
  assert.ok(night.lastValidOnline.atJst.startsWith("2026-10-19T00:"));
  assert.equal(lastObservedValue(night, "stars", "2026-10-18"), 2080);
  const interrupted = dataFor("mily-morning-20261017-aggregate.json");
  const points = observationPoints(interrupted, "stars", "2026-10-17");
  assert.ok(points.some((point, index) => index > 0 && point.time - points[index - 1].time > 60 * 60 * 1000),
    "gap should remain in original observation timestamps");
});

test("date UI and graphs remain within published Lab and existing LIVE STREAM routes", () => {
  const html = read("data-lab/index.html");
  const script = read("public/data-lab/assets/daily-archive.js");
  const core = read("public/data-lab/assets/daily-archive-core.js");
  const live = read("src/ActivitiesPage.tsx");
  assert.match(html, /id="daily-archive"/);
  assert.match(html, /id="daily-stream-groups"/);
  assert.match(html, /daily-archive\.css/);
  assert.match(html, /type="module" src="\/data-lab\/assets\/daily-archive\.js"/);
  assert.match(html, /noindex,nofollow,noarchive/);
  assert.ok(html.indexOf('href="#morning-20261020"') < html.indexOf('href="#morning-20261019"'));
  assert.match(script, /credentials: "omit"/);
  assert.match(script, /createElementNS/);
  assert.doesNotMatch(script, /fetch\s*\(\s*["']https?:/);
  assert.match(core, /earlyPartialObservation/);
  assert.match(live, /aria-label="配信を日付から探す"/);
  assert.match(live, /dateGroups\.map/);
  assert.match(live, /\/data-lab\/#daily-/);
  assert.match(live, /recap-\$\{recap\.id\}/);
  const publicChanges = html + script + core;
  assert.doesNotMatch(publicChanges, /drive\.google\.com|@gmail\.com|viewer[_-]?id|chatgpt\.site|private[_-]?recording|contributor[_-]?id/i);
});
