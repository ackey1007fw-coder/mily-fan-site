import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  isBroadcastDay,
  isInScheduledWindow,
  programNameMatches,
  radioProgram,
  scheduledFlags,
} from "../src/data/radio.ts";
import {
  buildRadioStatus,
  extractNowOnAirBlock,
  fetchRadioStatus,
  parseNowOnAir,
  programNameMatches as apiProgramNameMatches,
  resolveOnAirConfirmed,
  visibleText,
} from "../api/mily-radio-status.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

function nowOnAirHtml(heading, programInner) {
  return [
    '<div class="top-box"><div class="wrap-box">',
    '<div class="left-wrap"><div class="radio-number01">',
    `<p class="title01">${heading}<img src="/icon-wifi.png" alt="NOW ON AIR"></p>`,
    programInner,
    "</div></div>",
    '<div class="right-wrap"><p class="title01">NEXT ON AIR</p>',
    '<h4 class="onair-title">WEEKENDCRUISING</h4></div>',
    "</div></div>",
    '<div id="top-archives"><img alt="『 湘南シーサイドサークル 』　＃SSC"></div>',
  ].join("");
}

const SUNDAY_0900 = Date.parse("2026-08-16T09:00:00+09:00");
const SUNDAY_1000 = Date.parse("2026-08-16T10:00:00+09:00");
const SUNDAY_1030 = Date.parse("2026-08-16T10:30:00+09:00");
const SUNDAY_1259 = Date.parse("2026-08-16T12:59:00+09:00");
const SUNDAY_1300 = Date.parse("2026-08-16T13:00:00+09:00");
const SUNDAY_1301 = Date.parse("2026-08-16T13:01:00+09:00");
const MONDAY_1030 = Date.parse("2026-08-17T10:30:00+09:00");
const SATURDAY_1030 = Date.parse("2026-08-15T10:30:00+09:00");

describe("radio schedule facts (Asia/Tokyo)", () => {
  it("keeps the confirmed Sunday 10:00-13:00 window and listen URL", () => {
    assert.equal(radioProgram.programName, "湘南シーサイドサークル");
    assert.equal(radioProgram.weekday, 0);
    assert.equal(radioProgram.scheduledStart, "10:00");
    assert.equal(radioProgram.scheduledEnd, "13:00");
    assert.equal(radioProgram.listenUrl, "https://fm-smw.jp/radio");
    assert.equal(radioProgram.nowOnAirSourceUrl, "https://fm-smw.jp/");
    assert.equal(radioProgram.staffUrl, "https://fm-smw.jp/staff");
    assert.equal(radioProgram.timetableUrl, "https://fm-smw.jp/time-table");
    assert.match(radioProgram.programUrl, /^https:\/\/fm-smw\.jp\/program\//);
  });

  it("marks Sunday 9:00 as a broadcast day outside the window", () => {
    assert.equal(isBroadcastDay(SUNDAY_0900), true);
    assert.equal(isInScheduledWindow(SUNDAY_0900), false);
    assert.deepEqual(scheduledFlags(SUNDAY_0900), {
      todayScheduled: true,
      inScheduledWindow: false,
    });
  });

  it("marks Sunday 10:30 as inside the scheduled window", () => {
    assert.equal(isBroadcastDay(SUNDAY_1030), true);
    assert.equal(isInScheduledWindow(SUNDAY_1030), true);
    assert.equal(isInScheduledWindow(SUNDAY_1000), true);
    assert.equal(isInScheduledWindow(SUNDAY_1259), true);
  });

  it("marks Sunday 13:01 as outside the window", () => {
    assert.equal(isBroadcastDay(SUNDAY_1301), true);
    assert.equal(isInScheduledWindow(SUNDAY_1301), false);
    assert.equal(isInScheduledWindow(SUNDAY_1300), false);
  });

  it("marks weekdays as not scheduled even during 10:00-13:00", () => {
    assert.equal(isBroadcastDay(MONDAY_1030), false);
    assert.equal(isInScheduledWindow(MONDAY_1030), false);
    assert.equal(isBroadcastDay(SATURDAY_1030), false);
    assert.equal(isInScheduledWindow(SATURDAY_1030), false);
  });

  it("reads weekday from Asia/Tokyo, not the host timezone", () => {
    const sundayInTokyoSaturdayUtc = Date.parse("2026-08-15T16:00:00Z");
    assert.equal(isBroadcastDay(sundayInTokyoSaturdayUtc), true);
    assert.equal(isInScheduledWindow(sundayInTokyoSaturdayUtc), false);

    const sundayWindowUtc = Date.parse("2026-08-16T01:30:00Z");
    assert.equal(isBroadcastDay(sundayWindowUtc), true);
    assert.equal(isInScheduledWindow(sundayWindowUtc), true);

    const mondayInTokyoSundayUtc = Date.parse("2026-08-16T15:30:00Z");
    assert.equal(isBroadcastDay(mondayInTokyoSundayUtc), false);
    assert.equal(isInScheduledWindow(mondayInTokyoSundayUtc), false);
  });
});

describe("NOW ON AIR parsing", () => {
  it("confirms on air only when the live heading name clearly matches", () => {
    const html = nowOnAirHtml(
      "NOW ON AIR",
      '<a href="https://fm-smw.jp/program/ssc"><h4 class="onair-title">『 湘南シーサイドサークル 』　＃SSC</h4></a>',
    );
    const parsed = parseNowOnAir(html);
    assert.equal(parsed.status, "now-on-air");
    assert.equal(programNameMatches(parsed.title), true);
    assert.equal(apiProgramNameMatches(parsed.title), true);
    assert.equal(resolveOnAirConfirmed(parsed), true);
  });

  it("does not treat another live program as a match", () => {
    const html = nowOnAirHtml(
      "NOW ON AIR",
      '<a href="https://fm-smw.jp/program/weekendcruising"><h4 class="onair-title">WEEKENDCRUISING</h4></a>',
    );
    const parsed = parseNowOnAir(html);
    assert.equal(parsed.status, "now-on-air");
    assert.equal(programNameMatches(parsed.title), false);
    assert.equal(resolveOnAirConfirmed(parsed), false);
  });

  it("treats NOT ON AIR as confirmed off-air, not unavailable", () => {
    const html = nowOnAirHtml(
      "NOT ON AIR",
      '<a href="https://fm-smw.jp/program/music-bird">現在放送中の番組はありません。</h4></a>',
    );
    const parsed = parseNowOnAir(html);
    assert.equal(parsed.status, "not-on-air");
    assert.equal(resolveOnAirConfirmed(parsed), false);
  });

  it("ignores RECOMMEND / NEXT ON AIR mentions of the program", () => {
    const html = nowOnAirHtml(
      "NOT ON AIR",
      '<a href="https://fm-smw.jp/program/music-bird">現在放送中の番組はありません。</h4></a>',
    );
    assert.match(html, /湘南シーサイドサークル/);
    assert.equal(resolveOnAirConfirmed(parseNowOnAir(html)), false);
  });

  it("does not use the wifi icon alt text as the heading", () => {
    const heading = visibleText(
      'NOT ON AIR<img src="/icon-wifi.png" alt="NOW ON AIR">',
    );
    assert.equal(heading, "NOT ON AIR");
    assert.equal(visibleText('NOW ON AIR<img alt="NOW ON AIR">'), "NOW ON AIR");
  });

  it("returns unavailable when the NOW ON AIR block is missing or renamed", () => {
    assert.equal(extractNowOnAirBlock("<html>no radio box</html>"), null);
    assert.deepEqual(parseNowOnAir("<html>no radio box</html>"), {
      status: "unavailable",
      title: null,
    });
    assert.equal(resolveOnAirConfirmed(parseNowOnAir("<html>no radio box</html>")), null);

    const renamed = nowOnAirHtml(
      "ON AIR NOW",
      '<h4 class="onair-title">湘南シーサイドサークル</h4>',
    );
    assert.equal(resolveOnAirConfirmed(parseNowOnAir(renamed)), null);
  });

  it("does not treat a short or ambiguous title as a match", () => {
    assert.equal(programNameMatches("SSC"), false);
    assert.equal(programNameMatches("シーサイド"), false);
    assert.equal(programNameMatches("湘南シーサイド"), false);
    assert.equal(programNameMatches(""), false);
    assert.equal(programNameMatches(null), false);
    assert.equal(programNameMatches("湘南シーサイドサークルとWEEKENDCRUISING"), false);
    assert.equal(programNameMatches("『湘南シーサイドサークル』"), true);
    assert.equal(programNameMatches("湘南シーサイドサークル #SSC"), true);
  });
});

describe("radio status payload", () => {
  it("keeps appearance unconfirmed even inside the window", () => {
    const payload = buildRadioStatus({
      now: SUNDAY_1030,
      onAirConfirmed: true,
    });
    assert.equal(payload.ok, true);
    assert.equal(payload.todayScheduled, true);
    assert.equal(payload.inScheduledWindow, true);
    assert.equal(payload.onAirConfirmed, true);
    assert.equal(payload.milyAppearanceConfirmed, null);
    assert.equal(payload.listenUrl, "https://fm-smw.jp/radio");
    assert.equal(payload.sourceUrl, "https://fm-smw.jp/");
    assert.equal(payload.scheduledStart, "10:00");
    assert.equal(payload.scheduledEnd, "13:00");
    assert.match(payload.updatedAt, /^\d{4}-\d{2}-\d{2}T/);
  });

  it("maps Sunday 9:00 / 10:30 / 13:01 and weekdays as specified", () => {
    const morning = buildRadioStatus({ now: SUNDAY_0900 });
    assert.equal(morning.todayScheduled, true);
    assert.equal(morning.inScheduledWindow, false);

    const live = buildRadioStatus({ now: SUNDAY_1030 });
    assert.equal(live.todayScheduled, true);
    assert.equal(live.inScheduledWindow, true);

    const after = buildRadioStatus({ now: SUNDAY_1301 });
    assert.equal(after.todayScheduled, true);
    assert.equal(after.inScheduledWindow, false);

    const weekday = buildRadioStatus({ now: MONDAY_1030 });
    assert.equal(weekday.todayScheduled, false);
    assert.equal(weekday.inScheduledWindow, false);
  });

  it("returns null onAirConfirmed when the official page cannot be fetched", async () => {
    const payload = await fetchRadioStatus({
      now: SUNDAY_1030,
      fetchPage: async () => {
        throw new Error("network down");
      },
    });
    assert.equal(payload.ok, true);
    assert.equal(payload.todayScheduled, true);
    assert.equal(payload.inScheduledWindow, true);
    assert.equal(payload.onAirConfirmed, null);
    assert.equal(payload.milyAppearanceConfirmed, null);
  });

  it("returns null onAirConfirmed on HTTP failure", async () => {
    const payload = await fetchRadioStatus({
      now: SUNDAY_0900,
      fetchPage: async () => ({ ok: false, status: 503, text: async () => "" }),
    });
    assert.equal(payload.onAirConfirmed, null);
    assert.equal(payload.ok, true);
  });

  it("sets onAirConfirmed from a successful NOW ON AIR parse", async () => {
    const html = nowOnAirHtml(
      "NOW ON AIR",
      "<h4>湘南シーサイドサークル</h4>",
    );
    const payload = await fetchRadioStatus({
      now: SUNDAY_1030,
      fetchPage: async () => ({ ok: true, text: async () => html }),
    });
    assert.equal(payload.onAirConfirmed, true);
    assert.equal(payload.milyAppearanceConfirmed, null);
  });

  it("does not set onAirConfirmed true for a different live program", async () => {
    const html = nowOnAirHtml(
      "NOW ON AIR",
      "<h4>わんわん ワンダフル（再）</h4>",
    );
    const payload = await fetchRadioStatus({
      now: SUNDAY_1030,
      fetchPage: async () => ({ ok: true, text: async () => html }),
    });
    assert.equal(payload.onAirConfirmed, false);
  });
});

describe("radio API safety", () => {
  it("does not infer a personal appearance from the time window", async () => {
    const api = await read("api/mily-radio-status.js");
    const data = await read("src/data/radio.ts");
    assert.match(api, /milyAppearanceConfirmed: null/);
    assert.match(data, /milyAppearanceConfirmed: null/);
    assert.match(api, /Asia\/Tokyo/);
    assert.match(api, /s-maxage=60,stale-while-revalidate=300/);
    assert.doesNotMatch(api, /milyAppearanceConfirmed:\s*true/);
    assert.doesNotMatch(data, /milyAppearanceConfirmed:\s*true/);
  });

  it("does not wire the radio API into UI files in this change", async () => {
    for (const relative of [
      "src/App.tsx",
      "src/components/TodayDashboard.tsx",
      "src/components/StreamSchedule.tsx",
      "src/components/Hero.tsx",
      "src/components/Support.tsx",
      "src/components/MobileActionDock.tsx",
    ]) {
      const source = await read(relative);
      assert.doesNotMatch(source, /mily-radio-status/);
      assert.doesNotMatch(source, /from ["'].*radio["']/);
    }
  });
});
