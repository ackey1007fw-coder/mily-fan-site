import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  blackoutDay, blackoutPeriodState, formatClockRange, outsideNgRanges,
  streamBlackoutDays, streamBlackoutSource, STREAM_BLACKOUT_CAUTION,
} from "../src/data/streamBlackouts.ts";
import { tokyoDateKey } from "../src/lib/monthCalendar.ts";

const expected = [
  ["2026-09-26", [["09:30", "19:00"]], [["00:00", "09:30"], ["19:00", "24:00"]]],
  ["2026-09-27", [["06:40", "22:30"]], [["00:00", "06:40"], ["22:30", "24:00"]]],
  ["2026-09-28", [["06:40", "17:00"]], [["00:00", "06:40"], ["17:00", "24:00"]]],
  ["2026-09-29", [["06:40", "14:00"]], [["00:00", "06:40"], ["14:00", "24:00"]]],
  ["2026-09-30", [["10:40", "14:30"]], [["00:00", "10:40"], ["14:30", "24:00"]]],
  ["2026-10-01", [["06:40", "14:00"], ["16:30", "22:30"]], [["00:00", "06:40"], ["14:00", "16:30"], ["22:30", "24:00"]]],
  ["2026-10-02", [["06:40", "21:00"]], [["00:00", "06:40"], ["21:00", "24:00"]]],
];

test("all seven board dates and eight NG intervals match the supplied image", () => {
  assert.equal(streamBlackoutDays.length, 7);
  for (const [date, ng, outside] of expected) {
    assert.deepEqual(blackoutDay(date), { date, ng });
    assert.deepEqual(outsideNgRanges(ng), outside);
  }
  assert.equal(streamBlackoutDays.reduce((count, day) => count + day.ng.length, 0), 8);
  assert.equal(streamBlackoutSource.verifiedAt, "2026-09-26");
  assert.equal(streamBlackoutSource.publishedAt, null);
});

test("time complements merge overlaps, preserve input and reject invalid ranges", () => {
  const ranges = [["16:00", "18:00"], ["06:00", "10:00"], ["09:00", "16:00"]];
  const before = JSON.stringify(ranges);
  assert.deepEqual(outsideNgRanges(ranges), [["00:00", "06:00"], ["18:00", "24:00"]]);
  assert.equal(JSON.stringify(ranges), before);
  assert.deepEqual(outsideNgRanges([["00:00", "24:00"]]), []);
  for (const bad of [[["06:60", "19:00"]], [["25:00", "26:00"]], [["19:00", "06:40"]], [["06:40", "06:40"]]]) {
    assert.throws(() => outsideNgRanges(bad));
  }
  assert.equal(formatClockRange(["00:00", "06:40"]), "0:00〜6:40");
});

test("JST rollover expires this board without inventing availability outside its dates", () => {
  assert.equal(blackoutPeriodState("2026-09-25"), "before");
  assert.equal(blackoutPeriodState("2026-09-26"), "active");
  assert.equal(blackoutPeriodState(tokyoDateKey(Date.parse("2026-10-02T14:59:59Z"))), "active");
  assert.equal(blackoutPeriodState(tokyoDateKey(Date.parse("2026-10-02T15:00:00Z"))), "ended");
  assert.equal(blackoutDay("2026-10-03"), null);
  assert.equal(blackoutDay("2026-09-31"), null);
  assert.throws(() => blackoutPeriodState("2026-09-31"));
});

test("NG-derived ranges stay separate from confirmed schedules and radio", () => {
  for (const file of ["src/data/streamSchedule.ts", "src/data/events.ts", "src/data/supportEvents.ts", "src/lib/useStreamSchedule.ts", "src/lib/supportCalendar.ts"]) {
    assert.doesNotMatch(readFileSync(new URL(`../${file}`, import.meta.url), "utf8"), /streamBlackouts|outsideNgRanges/);
  }
  assert.match(STREAM_BLACKOUT_CAUTION, /配信予定ではありません/);
  const component = readFileSync(new URL("../src/components/StreamBlackoutNotice.tsx", import.meta.url), "utf8");
  assert.match(component, /NG時間外（配信未定）/);
  assert.match(component, /compact && phase === "ended"/);
  assert.doesNotMatch(component, /<img|<video|<iframe|https:\/\//);
});

test("home offers a compact entry and Support shows the full board", () => {
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  const support = readFileSync(new URL("../src/SupportPage.tsx", import.meta.url), "utf8");
  assert.match(app, /<StreamBlackoutNotice compact \/>/);
  assert.match(support, /<StreamBlackoutNotice \/>/);
});
