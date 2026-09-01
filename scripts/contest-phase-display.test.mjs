import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { contest } from "../src/data/contest.ts";
import { links } from "../src/data/links.ts";
import { supportEvents } from "../src/data/supportEvents.ts";
import {
  appendContestOfficialWindows,
  contestOfficialWindowLines,
  contestPhaseDateRangeLabel,
  contestPhaseDisplayNote,
  contestPhaseHeading,
} from "../src/lib/contestPhaseDisplay.ts";
import { selectHomeVoteAction } from "../src/lib/homePortal.ts";
import { selectSupportToday } from "../src/lib/supportHub.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = (relative) => readFileSync(path.join(root, relative), "utf8");

const WEB_LINE = "WEB投票 9/3 12:00〜9/13 23:59";
const GIFT_LINE = "SHOWROOM無料ギフト審査 9/3 5:00〜9/12 21:59";
const EVENT_LINE = "SHOWROOMイベント審査 9/3 5:00〜9/12 21:59";
const SHOWROOM_END_LINE = "SHOWROOMは9/12 21:59終了";
const OFFICIAL_LINES = [WEB_LINE, GIFT_LINE, EVENT_LINE, SHOWROOM_END_LINE];

function assertOfficialWindows(text) {
  for (const line of OFFICIAL_LINES) {
    assert.match(text, new RegExp(line.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(text, /JST|live|作業メモ|公式|公認|投票回数|AGESTOCK|通過発表|会場三次/i);
  assert.doesNotMatch(text, /9\/2 20:00|9\/12 12:59|05:00/);
}

describe("contest phase official window display", () => {
  it("reads the three official times from supportEvents, not ContestPhase", () => {
    const phase = contest.currentPhase;
    assert.ok(phase);
    assert.equal(contestPhaseDateRangeLabel(phase), "9/3〜9/13");
    assert.equal(contestPhaseHeading(phase), "3次審査進出（9/3〜9/13）");
    assert.deepEqual(contestOfficialWindowLines(phase), OFFICIAL_LINES);
    assert.equal(
      contestPhaseDisplayNote(phase),
      ["3次審査進出（9/3〜9/13）", ...OFFICIAL_LINES].join("\n"),
    );
    assert.doesNotMatch(JSON.stringify(contest.currentPhase), /12:00|05:00|21:59|5:00/);
    assert.match(source("src/data/contest.ts"), /ContestPhase は日付のみ/);
    assert.doesNotMatch(source("src/lib/contestPhaseDisplay.ts"), /2026-09-03T12:00|2026-09-03T05:00/);
  });

  it("keeps gift and event as two labeled rows from one SHOWROOM window", () => {
    assert.equal(GIFT_LINE.replace("SHOWROOM無料ギフト審査 ", ""), EVENT_LINE.replace("SHOWROOMイベント審査 ", ""));
    assert.equal(contestOfficialWindowLines(phaseWithName("2次審査")).length, 0);
    assert.equal(contestOfficialWindowLines(null).length, 0);
    assert.equal(appendContestOfficialWindows("確認済み", phaseWithName("2次審査")), "確認済み");
  });

  it("surfaces the times on HOME contest note and Support Today", () => {
    const afterPaton = selectHomeVoteAction({
      contest,
      supportEvents,
      links,
      now: Date.parse("2026-09-02T00:00:00+09:00"),
    });
    assert.equal(afterPaton.kind, "contest");
    assertOfficialWindows(afterPaton.note ?? "");
    assert.match(afterPaton.note ?? "", /3次審査進出（9\/3〜9\/13）/);

    const today = selectSupportToday({
      contest,
      streamSlots: [],
      streamRoomUrl: null,
      liveRoomUrl: null,
      radioPhase: "idle",
      now: Date.parse("2026-09-02T12:00:00+09:00"),
    }).find((item) => item.key === "today:contest");
    assert.ok(today);
    assert.equal(today.value, "3次審査進出");
    assert.match(today.note ?? "", /9\/3〜9\/13/);
    assertOfficialWindows(today.note ?? "");
    assert.equal(today.cta?.label, "ENTRY 734を見る");
    assert.equal(today.cta?.url, contest.entryUrl);
  });

  it("renders the rows on miss-circle Current and keeps ENTRY 734", () => {
    const page = source("src/ActivitiesPage.tsx");
    assert.match(page, /contestOfficialWindowLines/);
    assert.match(page, /ENTRY 734を見る/);
    assert.match(page, /href=\{contest\.entryUrl\}/);
    assert.match(source("src/components/Support.tsx"), /whitespace-pre-line/);
    assert.match(source("src/components/TodayDashboard.tsx"), /whitespace-pre-line/);
    assert.doesNotMatch(page, /投票回数|AGESTOCK|通過発表|会場三次/);
  });
});

function phaseWithName(name) {
  return {
    name,
    start: "2026-09-03",
    end: "2026-09-13",
    source: "https://www.misscircle.jp/",
  };
}
