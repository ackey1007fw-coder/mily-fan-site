import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const dashboard = JSON.parse(read("public/data-lab/data/mily-dashboard.json"));

test("dashboard JSON is a non-official snapshot dataset", () => {
  assert.equal(dashboard.schema, "mily-dashboard-v1");
  assert.equal(dashboard.nonOfficial, true);
  assert.equal(dashboard.updatedDateJst, "2026-11-14");
});

test("profile seed matches the 2026-11-14 official profile API measurement", () => {
  assert.equal(dashboard.profile.roomId, 573253);
  assert.equal(dashboard.profile.followers, 427);
  assert.equal(dashboard.profile.showRank, "A-3");
  assert.equal(dashboard.profile.liveContinuousDays, 106);
  assert.equal(dashboard.profile.observedDateJst, "2026-11-14");
  assert.match(dashboard.profile.source, /公式プロフィールAPI/);
  assert.equal(dashboard.profile.lastStream.dateJst, "2026-11-14");
});

test("followers history starts from our own 2026-11-14 snapshot only", () => {
  const history = dashboard.followersHistory;
  assert.equal(history.length, 1);
  assert.equal(history[0].dateJst, "2026-11-14");
  assert.equal(history[0].followers, 427);
  assert.match(history[0].source, /follower_num/);
});

test("stream history is built from repo records without personal data", () => {
  const streams = dashboard.streams;
  assert.ok(streams.length >= 60, `expected >=60 streams, got ${streams.length}`);
  const allowedKeys = new Set([
    "dateJst",
    "session",
    "label",
    "liveId",
    "lastValidAtJst",
    "stars",
    "visits",
    "comments",
    "confirmedFinal",
    "metricsNote",
  ]);
  for (const s of streams) {
    for (const key of Object.keys(s)) assert.ok(allowedKeys.has(key), `unexpected key ${key}`);
    assert.match(s.dateJst, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(
      ["morning", "morning1", "morning2", "noon", "afternoon", "evening", "night"].includes(s.session),
      `unexpected session ${s.session}`,
    );
    assert.equal(s.confirmedFinal, false);
    for (const metric of ["stars", "visits", "comments"]) {
      assert.ok(s[metric] === null || typeof s[metric] === "number");
    }
  }
  assert.equal(streams[0].dateJst, "2026-11-14");
  assert.equal(streams[0].session, "noon");
  assert.equal(streams[0].liveId, 23684728);
  assert.equal(streams.at(-1).dateJst, "2026-10-14");
  const morningNov14 = streams.find(
    (s) => s.dateJst === "2026-11-14" && s.session === "morning",
  );
  assert.equal(morningNov14.stars, 11964);
});

test("current event snapshots are dated observations ending at the 2026-11-14 noon record", () => {
  const ev = dashboard.currentEvent;
  assert.equal(ev.name, "湘南PRのぼり2027年1月版応援大使決定戦！");
  assert.equal(ev.periodJst.end, "2026-11-15T21:59:59+09:00");
  const snaps = ev.snapshots;
  assert.ok(snaps.length >= 8);
  for (let i = 1; i < snaps.length; i += 1) {
    assert.ok(snaps[i - 1].atJst < snaps[i].atJst, "snapshots must be chronological");
  }
  const latest = snaps.at(-1);
  assert.equal(latest.atJst, "2026-11-14T14:12:46+09:00");
  assert.equal(latest.rank, 3);
  assert.equal(latest.point, 243556);
  assert.match(ev.note, /最終確定順位ではありません/);
});

test("song stats stay an honest placeholder until verified data exists", () => {
  assert.equal(dashboard.songs.status, "preparing");
  assert.match(dashboard.songs.note, /推測の回数は載せません/);
});

test("dashboard page keeps noindex and fan-site metadata wiring", () => {
  const page = read("data-lab/dashboard/index.html");
  assert.match(page, /noindex,nofollow,noarchive/);
  assert.match(page, /__DATA_LAB_DASHBOARD_CANONICAL__/);
  assert.match(page, /\/data-lab\/assets\/dashboard\.css/);
  assert.match(page, /\/data-lab\/assets\/dashboard\.js/);
  assert.match(page, /非公式/);
  assert.match(page, /mily-dashboard\.json/);
  const vite = read("vite.config.ts");
  assert.match(vite, /dataLabDashboard: "data-lab\/dashboard\/index\.html"/);
  assert.match(vite, /__DATA_LAB_DASHBOARD_CANONICAL__/);
  const labTop = read("data-lab/index.html");
  assert.match(labTop, /href="\/data-lab\/dashboard\/"/);
});

test("collector fails loudly instead of guessing follower counts", () => {
  const collector = read("scripts/collect-mily-followers.mjs");
  assert.match(collector, /follower_num/);
  assert.match(collector, /refusing to write a guessed value/);
  assert.match(collector, /api\/room\/profile/);
});
