import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contest } from "../src/data/contest.ts";
import { events } from "../src/data/events.ts";
import {
  links,
  missCircleShowroomEventLink,
  missCircleWebVoteLink,
} from "../src/data/links.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import {
  isValidSupportEvent,
  missCircleThirdRoundShowroomReview,
  missCircleThirdRoundWebVote,
  supportEvents,
} from "../src/data/supportEvents.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { selectHomeVoteAction, selectHomeVoteActions } from "../src/lib/homePortal.ts";
import { resolveNewsLinks } from "../src/lib/newsLinks.ts";
import {
  adaptSupportEvents,
  buildSupportCalendar,
  nextDisplayStatusBoundary,
} from "../src/lib/supportCalendar.ts";
import { nextSupportEventBoundary } from "../src/lib/useSupportEventClock.ts";
import { verifyNews } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_ID = "2026-09-02-miss-circle-third-round";
const TITLE = "ミスサー三次審査、9/3から9/13";
const BODY =
  "三橋莉子（ENTRY 734、Bブロック）。WEB投票は9月3日12:00から13日23:59。SHOWROOMの無料ギフト審査とイベント審査は9月3日5:00から12日21:59。";
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

function entry() {
  return news.find((item) => item.id === NEWS_ID);
}

describe("2026-09-02 MISS CIRCLE 三次審査 NEWS + calendar", () => {
  it("adds one NEWS item above the two 9/2 Story cards with the exact copy", () => {
    const item = entry();
    const ordered = sortNewsByDateDesc(news);

    assert.ok(item);
    assert.equal(item.date, "2026-09-02");
    assert.equal(item.sameDayOrder, 10);
    assert.deepEqual(item.activityIds, ["miss-circle"]);
    assert.equal(item.title, TITLE);
    assert.equal(item.body, BODY);
    assert.equal(news.filter(({ id }) => id === NEWS_ID).length, 1);
    assert.equal(news.length, 73);
    assert.equal(ordered[0], item);
    assert.equal(ordered[1]?.id, "2026-09-02-oyasumily-sr-story");
    assert.equal(ordered[2]?.id, "2026-09-02-paton-second-story");
    assert.deepEqual(verifyNews([item]), []);
    assert.doesNotMatch(`${item.title}\n${item.body}`, /JST|live|作業メモ|公式|公認/i);
  });

  it("uses confirmed organizer links only", () => {
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
    assert.equal(item.media, undefined);
    assert.equal(item.message, undefined);
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
    assert.equal(events.length, 0);
  });

  it("puts both periods on the Support calendar day axis", () => {
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

  it("keeps ContestPhase date-only and omits unpublished slots", async () => {
    assert.equal(contest.currentPhase?.name, "3次審査進出");
    assert.equal(contest.currentPhase?.start, "2026-09-03");
    assert.equal(contest.currentPhase?.end, "2026-09-13");
    assert.equal(contest.lastVerifiedAt, "2026-09-02");
    assert.equal(streamSchedule.length, 0);
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
    assert.doesNotMatch(serialized, /AGESTOCK|横浜アリーナ|通過発表|会場三次/);
    assert.doesNotMatch(serialized, /9:00/);

    const calendarCtas = adaptSupportEvents(supportEvents, WEB_START).items;
    assert.equal(
      calendarCtas.some((item) =>
        /ヘッダー|通過発表|AGESTOCK|会場三次/.test(item.title),
      ),
      false,
    );

    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const start = ops.indexOf("### 2026-09-02 ミスサー三次審査 NEWS と Calendar");
    const end = ops.indexOf("### 2026-09-02 Instagram Story おやすみりぃ・パトン2位");
    assert.notEqual(start, -1);
    assert.notEqual(end, -1);
    const section = ops.slice(start, end);
    assert.match(section, /sameDayOrder: 10/);
    assert.match(section, /supportEvents\.ts/);
    assert.match(section, /events\.ts は空のまま/);
    assert.match(section, /SHOWROOMヘッダー枠/);
    assert.doesNotMatch(section, /#133|copy-tweak|title\/body/);
  });
});
