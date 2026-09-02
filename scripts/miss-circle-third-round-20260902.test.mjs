import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { contest } from "../src/data/contest.ts";
import { events } from "../src/data/events.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import {
  links,
  missCircleShowroomEventLink,
  missCircleWebVoteLink,
} from "../src/data/links.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import {
  isValidSupportEvent,
  missCircleThirdRoundShowroomReview,
  missCircleThirdRoundWebVote,
  supportEvents,
} from "../src/data/supportEvents.ts";
import {
  THIRD_ROUND_TIMETABLE_SRC,
  thirdRoundTimetableImage,
} from "../src/data/thirdRoundTimetableImage.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { contestOfficialWindowLines, contestPhaseDisplayNote } from "../src/lib/contestPhaseDisplay.ts";
import { selectHomeVoteAction, selectHomeVoteActions } from "../src/lib/homePortal.ts";
import { resolveNewsLinks } from "../src/lib/newsLinks.ts";
import {
  adaptStreamSlots,
  adaptSupportEvents,
  buildSupportCalendar,
  nextDisplayStatusBoundary,
} from "../src/lib/supportCalendar.ts";
import { nextSupportEventBoundary } from "../src/lib/useSupportEventClock.ts";
import { verifyNews } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_ID = "2026-09-02-miss-circle-third-round";
const TITLE = "ミスサー三次審査、9/3から9/13";
const BODY = `MISS CIRCLE CONTEST 2026の三次審査が、9月3日から始まります。みりぃはENTRY 734、Bブロックです。

WEB投票は9月3日12:00〜9月13日23:59、SHOWROOMの無料ギフト審査・イベント審査は9月3日5:00〜9月12日21:59です。配信予定は、本人配布のタイムテーブル画像と「応援・予定」で確認できます。予定は変更になる場合があります。`;
const WEB_VOTE_URL =
  "https://liff.line.me/1656040756-GwmBkdPY/vote/misscircle2026/N/734";
const SHOWROOM_EVENT_URL = "https://www.showroom-live.com/event/circle2026_3rd";
const SHOWROOM_ROOM_URL = "https://www.showroom-live.com/r/circle2026_0734";
const ENTRY_URL = "https://2026.misscircle.jp/entry/734";
const SCHEDULE_URL = "https://www.misscircle.jp/";
const WEB_START = Date.parse("2026-09-03T12:00:00+09:00");
const WEB_END = Date.parse("2026-09-13T23:59:00+09:00");
const SHOWROOM_START = Date.parse("2026-09-03T05:00:00+09:00");
const SHOWROOM_END = Date.parse("2026-09-12T21:59:00+09:00");
const CONTEST_END = Date.parse("2026-09-14T00:00:00+09:00");
const PATON_END = Date.parse("2026-09-01T23:59:00+09:00");
const TIMETABLE_FILE = path.join(root, "public", THIRD_ROUND_TIMETABLE_SRC.slice(1));
const TIMETABLE_SHA256 =
  "37658e9c6fd6eb4f74063414d940b29ecef13e0b4d3a7b1ed59438dea1af393f";
const EXPECTED_SLOTS = [
  { date: "2026-09-03", time: "07:30", note: "7:30-8:00" },
  { date: "2026-09-03", time: "14:40", note: "14:40-15:20" },
  { date: "2026-09-03", time: "21:00", note: "21:00-21:50" },
  { date: "2026-09-04", time: "07:00", note: "7:00-7:40" },
  { date: "2026-09-04", time: "14:50", note: "14:50-15:10" },
  { date: "2026-09-04", time: "22:30", note: "22:30-23:30" },
  { date: "2026-09-05", time: "09:00", note: "9:00-9:20" },
  { date: "2026-09-05", time: "14:30", note: "14:30-15:20" },
  { date: "2026-09-05", time: "21:00", note: "21:00-21:50" },
  { date: "2026-09-06", time: "05:30", note: "5:30-6:30" },
  { date: "2026-09-06", time: "14:40", note: "14:40-15:20" },
  { date: "2026-09-06", time: "22:30", note: "22:30-22:50" },
  { date: "2026-09-08", time: "07:00", note: "7:00-8:00" },
  {
    date: "2026-09-09",
    time: "00:00",
    note: "本人表記 24:00-25:00（9/9 0:00-1:00）",
  },
  { date: "2026-09-09", time: "10:00", note: "10:00-11:00" },
  { date: "2026-09-09", time: "14:40", note: "14:40-15:20" },
  { date: "2026-09-09", time: "21:30", note: "21:30-21:50" },
  { date: "2026-09-11", time: "10:00", note: "10:00-10:30" },
  { date: "2026-09-11", time: "14:50", note: "14:50-15:20" },
  { date: "2026-09-11", time: "21:00", note: "21:00-22:00" },
  { date: "2026-09-12", time: "08:00", note: "8:00-8:30" },
  { date: "2026-09-12", time: "14:40", note: "14:40-15:10" },
  { date: "2026-09-12", time: "21:00", note: "21:00-22:00" },
];

function entry() {
  return news.find((item) => item.id === NEWS_ID);
}

describe("2026-09-02 MISS CIRCLE 三次審査 NEWS + calendar", () => {
  it("keeps one concise NEWS item above the two 9/2 Story cards", () => {
    const item = entry();
    const ordered = sortNewsByDateDesc(news);

    assert.ok(item);
    assert.equal(item.date, "2026-09-02");
    assert.equal(item.sameDayOrder, 10);
    assert.deepEqual(item.activityIds, ["miss-circle"]);
    assert.equal(item.title, TITLE);
    assert.equal(item.body, BODY);
    assert.equal(news.filter(({ id }) => id === NEWS_ID).length, 1);
    assert.equal(news.length, 74);
    assert.equal(ordered[0], item);
    assert.equal(ordered[1]?.id, "2026-09-02-oyasumily-sr-story");
    assert.equal(ordered[2]?.id, "2026-09-02-paton-second-story");
    assert.deepEqual(verifyNews([item]), []);
    assert.doesNotMatch(`${item.title}\n${item.body}`, /JST|live|作業メモ|公式|公認/i);
    assert.ok(item.body.length <= 220);
    assert.doesNotMatch(
      item.body,
      /CanCamモデル発掘|オリジナルアバター|AGESTOCK|横浜アリーナ|9\/3（木）|未定|昼枠なし/,
    );
    assert.doesNotMatch(item.body, /一票で届ける|贈れます|遊びに来て|応援よろしく/);
  });

  it("uses confirmed organizer links only and the owner-provided timetable still", async () => {
    const item = entry();
    assert.equal(item.source, SCHEDULE_URL);
    assert.equal(item.sourceLabel, "MISS CIRCLE CONTEST 2026");
    assert.deepEqual(item.additionalSources, [
      { label: "ENTRY 734", url: ENTRY_URL },
      { label: "SHOWROOMイベント", url: SHOWROOM_EVENT_URL },
    ]);
    assert.equal(item.relatedUrl, WEB_VOTE_URL);
    assert.equal(item.ctaLabel, "WEB投票する");
    assert.deepEqual(item.additionalCtas, [
      { label: "ENTRY 734", url: ENTRY_URL },
      { label: "SHOWROOMイベント", url: SHOWROOM_EVENT_URL },
      { label: "SHOWROOM", url: SHOWROOM_ROOM_URL },
    ]);
    assert.equal(item.media, thirdRoundTimetableImage);
    assert.equal(item.additionalMedia, undefined);
    assert.equal(item.message, undefined);
    assert.equal(thirdRoundTimetableImage.src, THIRD_ROUND_TIMETABLE_SRC);
    assert.equal(thirdRoundTimetableImage.width, 1206);
    assert.equal(thirdRoundTimetableImage.height, 950);
    assert.equal(
      thirdRoundTimetableImage.alt,
      "みりぃの配信タイムテーブル（ミスサークルコンテスト2026 3次審査）",
    );
    assert.equal(thirdRoundTimetableImage.published, true);
    assert.equal(thirdRoundTimetableImage.provenance, "owner-provided");
    assert.equal(thirdRoundTimetableImage.sourceUrl, null);
    assert.equal(existsSync(TIMETABLE_FILE), true, TIMETABLE_FILE);
    assert.equal(
      createHash("sha256").update(await readFile(TIMETABLE_FILE)).digest("hex"),
      TIMETABLE_SHA256,
    );
    const metadata = await sharp(TIMETABLE_FILE).metadata();
    assert.equal(metadata.format, "jpeg");
    assert.equal(metadata.width, 1206);
    assert.equal(metadata.height, 950);
    assert.ok((await stat(TIMETABLE_FILE)).size > 0);
    assert.equal(media.some((entry) => String(entry.id).includes("b49")), false);
    assert.equal(
      galleryVideos.some((entry) => String(entry.id ?? "").includes("b49")),
      false,
    );
    assert.equal(
      existsSync(
        path.join(root, "public/media/gallery/mily-b49-01-third-round-timetable-480.jpg"),
      ),
      false,
    );
    assert.equal(
      stories.some((story) => JSON.stringify(story).includes("b49")),
      false,
    );
  });

  it("surfaces the item on the miss-circle Activity only", () => {
    const missNews = selectActivityNews("miss-circle", news, news.length);
    assert.equal(missNews[0]?.id, NEWS_ID);
    for (const activityId of ["live-stream", "campus-girls", "radio"]) {
      assert.equal(
        selectActivityNews(activityId, news, news.length).some(
          (item) => item.id === NEWS_ID,
        ),
        false,
      );
    }
  });

  it("registers timed SupportEvents that the monthly calendar actually reads", () => {
    assert.equal(isValidSupportEvent(missCircleThirdRoundWebVote), true);
    assert.equal(isValidSupportEvent(missCircleThirdRoundShowroomReview), true);
    assert.equal(missCircleThirdRoundWebVote.activityId, "miss-circle");
    assert.equal(missCircleThirdRoundWebVote.kind, "vote");
    assert.deepEqual(missCircleThirdRoundWebVote.schedule, {
      state: "confirmed-period",
      start: "2026-09-03T12:00:00+09:00",
      end: "2026-09-13T23:59:00+09:00",
      allDay: false,
      timezone: "Asia/Tokyo",
    });
    assert.equal(missCircleThirdRoundWebVote.ctaLinkId, missCircleWebVoteLink.id);
    assert.equal(missCircleWebVoteLink.url, WEB_VOTE_URL);
    assert.equal(missCircleThirdRoundShowroomReview.activityId, "miss-circle");
    assert.equal(missCircleThirdRoundShowroomReview.kind, "stream-event");
    assert.deepEqual(missCircleThirdRoundShowroomReview.schedule, {
      state: "confirmed-period",
      start: "2026-09-03T05:00:00+09:00",
      end: "2026-09-12T21:59:00+09:00",
      allDay: false,
      timezone: "Asia/Tokyo",
    });
    assert.equal(
      missCircleThirdRoundShowroomReview.ctaLinkId,
      missCircleShowroomEventLink.id,
    );
    assert.equal(missCircleShowroomEventLink.url, SHOWROOM_EVENT_URL);
    assert.equal(
      supportEvents.filter((event) => event.id === missCircleThirdRoundWebVote.id)
        .length,
      1,
    );
    assert.equal(
      supportEvents.filter(
        (event) => event.id === missCircleThirdRoundShowroomReview.id,
      ).length,
      1,
    );
    assert.equal(supportEvents.filter((event) => event.kind === "vote").length, 2);
    assert.equal(events.length, 0);
  });

  it("puts both periods and the personal SHOWROOM slots on the calendar", () => {
    const calendar = buildSupportCalendar({
      contest,
      supportEvents,
      fanEvents: events,
      streamSlots: streamSchedule,
      streamAvailability: "ok",
      includeRadio: false,
      now: Date.parse("2026-09-02T12:00:00+09:00"),
      daysAhead: 14,
    });
    const items = calendar.days.flatMap((day) => day.items);
    const web = items.find((item) => item.key === "support-event:miss-circle-2026-3rd-web-vote");
    const showroom = items.find(
      (item) => item.key === "support-event:miss-circle-2026-3rd-showroom-review",
    );
    const phase = items.find((item) => item.key === "contest:current-phase");
    const showroomSlots = items.filter((item) => item.origin === "showroom-schedule");

    assert.ok(web);
    assert.equal(web.date, "2026-09-03");
    assert.equal(web.startTime, "12:00");
    assert.equal(web.endTime, "23:59");
    assert.equal(web.endDate, "2026-09-13");
    assert.equal(web.title, "WEB投票");
    assert.equal(web.activityId, "miss-circle");
    assert.ok(showroom);
    assert.equal(showroom.date, "2026-09-03");
    assert.equal(showroom.startTime, "05:00");
    assert.equal(showroom.endTime, "21:59");
    assert.equal(showroom.endDate, "2026-09-12");
    assert.equal(showroom.title, "SHOWROOM無料ギフト審査・イベント審査");
    assert.ok(phase);
    assert.equal(phase.date, "2026-09-03");
    assert.equal(phase.endDate, "2026-09-13");
    assert.equal(phase.allDay, true);
    assert.equal(showroomSlots.length, EXPECTED_SLOTS.length);
    assert.deepEqual(
      showroomSlots.map((item) => ({
        date: item.date,
        startTime: item.startTime,
        endTime: item.endTime,
        note: item.note,
      })),
      EXPECTED_SLOTS.map((slot) => ({
        date: slot.date,
        startTime: slot.time,
        endTime: null,
        note: slot.note,
      })),
    );
    assert.equal(
      items.some((item) => /AGESTOCK|横浜アリーナ|通過発表|会場三次/.test(item.title)),
      false,
    );
  });

  it("gates the WEB vote CTA to the confirmed window and keeps ENTRY 734", () => {
    const item = entry();
    const before = resolveNewsLinks(item, WEB_START - 1);
    const during = resolveNewsLinks(item, WEB_START);
    const after = resolveNewsLinks(item, WEB_END + 1);

    assert.equal(before.cta, undefined);
    assert.equal(
      (before.additionalCtas ?? []).some((cta) => cta.url === WEB_VOTE_URL),
      false,
    );
    assert.deepEqual(during.cta, { label: "WEB投票する", url: WEB_VOTE_URL });
    assert.equal(after.cta, undefined);

    const voteAt = (now) =>
      selectHomeVoteActions({ contest, supportEvents, links, now }).map(
        ({ kind, url }) => ({ kind, url }),
      );
    assert.deepEqual(voteAt(WEB_START - 1), [
      { kind: "contest", url: contest.entryUrl },
    ]);
    assert.deepEqual(voteAt(WEB_START), [
      { kind: "support-event", url: WEB_VOTE_URL },
      { kind: "contest", url: contest.entryUrl },
    ]);
    assert.deepEqual(voteAt(WEB_END + 1), [
      { kind: "contest", url: contest.entryUrl },
    ]);
    assert.equal(
      selectHomeVoteAction({
        contest,
        supportEvents,
        links,
        now: WEB_START,
      }).url,
      WEB_VOTE_URL,
    );
  });

  it("aligns the shared clock with #131 contest end and the new review bounds", () => {
    assert.equal(nextSupportEventBoundary(PATON_END + 1), SHOWROOM_START);
    assert.equal(nextDisplayStatusBoundary(missCircleThirdRoundShowroomReview.schedule, SHOWROOM_START - 1), SHOWROOM_START);
    assert.equal(nextSupportEventBoundary(SHOWROOM_START), WEB_START);
    assert.equal(nextSupportEventBoundary(WEB_START), SHOWROOM_END + 1);
    assert.equal(nextSupportEventBoundary(SHOWROOM_END + 1), WEB_END + 1);
    assert.equal(nextSupportEventBoundary(WEB_END + 1), CONTEST_END);
    assert.equal(nextSupportEventBoundary(CONTEST_END - 1), CONTEST_END);
    assert.equal(nextSupportEventBoundary(CONTEST_END), null);
  });

  it("keeps ContestPhase date-only and the confirmed personal SHOWROOM slots", async () => {
    assert.equal(contest.currentPhase?.name, "3次審査進出");
    assert.equal(contest.currentPhase?.start, "2026-09-03");
    assert.equal(contest.currentPhase?.end, "2026-09-13");
    assert.equal(contest.lastVerifiedAt, "2026-09-02");
    assert.doesNotMatch(JSON.stringify(contest.currentPhase), /12:00|05:00|21:59/);
    assert.deepEqual(contestOfficialWindowLines(contest.currentPhase), [
      "WEB投票 9/3 12:00〜9/13 23:59",
      "SHOWROOM無料ギフト審査 9/3 5:00〜9/12 21:59",
      "SHOWROOMイベント審査 9/3 5:00〜9/12 21:59",
      "SHOWROOMは9/12 21:59終了",
    ]);
    assert.match(contestPhaseDisplayNote(contest.currentPhase), /3次審査進出（9\/3〜9\/13）/);
    assert.deepEqual(streamSchedule, EXPECTED_SLOTS);
    assert.equal(
      streamSchedule.some((slot) => slot.date === "2026-09-07"),
      false,
    );
    assert.equal(
      streamSchedule.some((slot) => slot.date === "2026-09-10"),
      false,
    );
    assert.equal(
      streamSchedule.some((slot) => slot.date === "2026-09-08" && slot.time.startsWith("14")),
      false,
    );
    assert.ok(
      streamSchedule.some((slot) => slot.date === "2026-09-08" && slot.time === "07:00"),
    );
    assert.ok(
      streamSchedule.some(
        (slot) =>
          slot.date === "2026-09-09" &&
          slot.time === "00:00" &&
          slot.note === "本人表記 24:00-25:00（9/9 0:00-1:00）",
      ),
    );
    assert.equal(events.length, 0);

    const serialized = JSON.stringify({
      news: entry(),
      supportEvents: supportEvents.filter((event) =>
        event.id.startsWith("miss-circle-2026-3rd"),
      ),
      contest,
    });
    assert.doesNotMatch(serialized, /2026-09-02T20:00:00\+09:00/);
    assert.doesNotMatch(serialized, /2026-09-12T12:59/);
    assert.doesNotMatch(serialized, /通過発表|会場三次/);
    assert.doesNotMatch(serialized, /09-02T20:00|12:59:00/);
    assert.doesNotMatch(
      entry().body,
      /CanCamモデル発掘|オリジナルアバター|AGESTOCK|横浜アリーナ|MISCOLLEステージ/,
    );

    const calendarPayload = JSON.stringify({
      supportEvents: supportEvents.filter((event) =>
        event.id.startsWith("miss-circle-2026-3rd"),
      ),
      events,
      streamSchedule,
    });
    assert.doesNotMatch(calendarPayload, /AGESTOCK|横浜アリーナ|通過発表|会場三次/);
    assert.doesNotMatch(calendarPayload, /2026-09-02T20:00|2026-09-12T12:59/);

    const calendarCtas = adaptSupportEvents(supportEvents, WEB_START).items;
    assert.equal(
      calendarCtas.some((item) =>
        /ヘッダー|通過発表|AGESTOCK|会場三次/.test(item.title),
      ),
      false,
    );
    const adapted = adaptStreamSlots(streamSchedule);
    assert.equal(adapted.every((item) => item.endTime === null), true);
    assert.equal(adapted.every((item) => item.origin === "showroom-schedule"), true);

    const latest = await readFile(path.join(root, "src/components/Latest.tsx"), "utf8");
    assert.match(
      latest,
      /whitespace-pre-line text-sm leading-relaxed text-ink-muted">\{item\.body\}/,
    );

    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const start = ops.indexOf("### 2026-09-02 ミスサー三次審査 NEWS と Calendar");
    const end = ops.indexOf("### 2026-09-02 Instagram Story おやすみりぃ・パトン2位");
    assert.notEqual(start, -1);
    assert.notEqual(end, -1);
    const section = ops.slice(start, end);
    assert.match(section, /sameDayOrder: 10/);
    assert.match(section, /supportEvents\.ts/);
    assert.match(section, /events\.ts[`\s]+は空のまま/);
    assert.match(section, /SHOWROOMヘッダー枠/);
    assert.match(section, /streamSchedule\.ts/);
    assert.doesNotMatch(section, /#133|copy-tweak|title\/body/);
    assert.doesNotMatch(section, /9\/2 20:00〜9\/12 12:59 を載せる/);
  });
});
