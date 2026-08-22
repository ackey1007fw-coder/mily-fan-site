import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { news } from "../src/data/news.ts";
import { radioProgram } from "../src/data/radio.ts";
import { secondRoundStoryVideo } from "../src/data/secondRoundStoryVideo.ts";
import { stories } from "../src/data/stories.ts";
import { tiktokRadioVideo } from "../src/data/tiktokRadioVideo.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import {
  adaptContestSchedule,
  adaptFanEvents,
  adaptRadioProgram,
  adaptStreamSlots,
  buildSupportCalendar,
  displayStatus,
  formatShortTokyoDate,
  isCrossDayTimedItem,
  liveSupportEvents,
  scheduleTimeLabel,
} from "../src/lib/supportCalendar.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const now = Date.parse("2026-08-22T12:00:00+09:00");

const contestFixture = {
  contestName: "fixture contest",
  entryNumber: "fixture entry",
  entryUrl: "https://example.com/entry",
  currentPhase: {
    name: "fixture phase",
    start: "2026-08-23",
    end: "2026-08-25",
    source: "https://example.com/phase",
  },
  lastVerifiedAt: "2026-08-22",
};

function build(overrides = {}) {
  return buildSupportCalendar({
    contest: contestFixture,
    supportEvents: [],
    fanEvents: [],
    streamSlots: [],
    streamAvailability: "ok",
    includeRadio: false,
    now,
    daysAhead: 14,
    ...overrides,
  });
}

describe("Support Calendar derivation", () => {
  it("keeps ScheduleItem as a derived lib type, never stored data", async () => {
    assert.equal(existsSync(path.join(root, "src/data/schedule.ts")), false);
    const source = await readFile(path.join(root, "src/lib/supportCalendar.ts"), "utf8");
    assert.match(source, /export type ScheduleItem/);
    assert.match(source, /adaptContestSchedule\(input\.contest\)/);
  });

  it("derives MISS CIRCLE dates only from contest.currentPhase", () => {
    const result = adaptContestSchedule(contestFixture);
    assert.equal(result.pending.length, 0);
    assert.deepEqual(result.items[0].span, {
      start: contestFixture.currentPhase.start,
      end: contestFixture.currentPhase.end,
    });
    assert.equal(result.items[0].origin, "contest");
    assert.equal(result.items[0].activityId, "miss-circle");
  });

  it("keeps null contest dates off the date axis and in pending", () => {
    const result = build({
      contest: {
        ...contestFixture,
        currentPhase: { ...contestFixture.currentPhase, start: null, end: null },
      },
    });
    assert.equal(result.days.flatMap(({ items }) => items).length, 0);
    assert.deepEqual(result.pending.map(({ reason }) => reason), ["date-pending"]);
  });

  it("keeps date-pending SupportEvents out of dated days", () => {
    const result = build({
      contest: { ...contestFixture, currentPhase: null },
      supportEvents: [
        {
          id: "pending-fixture",
          activityId: "live-stream",
          kind: "stream-event",
          title: "date pending fixture",
          schedule: { state: "date-pending" },
          source: "https://example.com/pending",
          verifiedAt: "2026-08-22",
        },
      ],
    });
    assert.equal(result.days.length, 0);
    assert.equal(result.pending[0].reason, "date-pending");
  });

  it("never infers a FanEvent activity from title, venue, or kind", () => {
    const [item] = adaptFanEvents([
      {
        id: "misleading-fixture",
        title: "MISS CIRCLE RADIO SHOWROOM",
        listedAt: "2026-08-22",
        startAt: "2026-08-24T10:00:00+09:00",
        timezone: "Asia/Tokyo",
        kind: "stream",
        venue: "CAMPUS GIRLS LIVE",
        source: "https://example.com/fan-event",
      },
    ]);
    assert.equal(item.activityId, null);
    assert.equal(item.origin, "fan-event");
  });

  it("keeps ok + zero slots distinct from unavailable without hiding static items", () => {
    const empty = build({ streamSlots: [], streamAvailability: "ok" });
    const unavailable = build({
      streamSlots: [{ date: "2026-08-24", time: "20:00" }],
      streamAvailability: "unavailable",
    });
    assert.equal(empty.availability.showroomSchedule, "ok");
    assert.equal(unavailable.availability.showroomSchedule, "unavailable");
    assert.equal(
      empty.days.flatMap(({ items }) => items).filter(({ origin }) => origin === "contest")
        .length,
      1,
    );
    assert.equal(
      unavailable.days
        .flatMap(({ items }) => items)
        .filter(({ origin }) => origin === "contest").length,
      1,
    );
    assert.equal(
      unavailable.days
        .flatMap(({ items }) => items)
        .filter(({ origin }) => origin === "showroom-schedule").length,
      0,
    );
  });

  it("keeps the confirmed manual fallback while gating only fetched rows", () => {
    // 手入力fallbackは確認済み。APIが loading / unavailable でもCalendarから消さない。
    const manual = [{ date: "2026-08-24", time: "19:00", note: "手入力fallback" }];
    const fetched = { date: "2026-08-25", time: "20:00" };
    const showroom = (result) =>
      result.days
        .flatMap(({ items }) => items)
        .filter(({ origin }) => origin === "showroom-schedule");

    const ok = build({
      streamSlots: [...manual, fetched],
      manualStreamSlots: manual,
      streamAvailability: "ok",
    });
    assert.deepEqual(
      showroom(ok).map(({ date, startTime }) => `${date}T${startTime}`),
      ["2026-08-24T19:00", "2026-08-25T20:00"],
    );

    for (const availability of ["loading", "unavailable"]) {
      const degraded = build({
        streamSlots: [...manual, fetched],
        manualStreamSlots: manual,
        streamAvailability: availability,
      });
      assert.deepEqual(
        showroom(degraded).map(({ date, startTime }) => `${date}T${startTime}`),
        ["2026-08-24T19:00"],
        `manual fallback must survive ${availability}`,
      );
      // API失敗を成功へ偽装しない。warningのためのavailabilityはそのまま。
      assert.equal(degraded.availability.showroomSchedule, availability);
      assert.ok(
        degraded.days
          .flatMap(({ items }) => items)
          .some(({ origin }) => origin === "contest"),
      );
    }
  });

  it("shows no SHOWROOM row when the API is unavailable and no fallback exists", () => {
    const result = build({
      streamSlots: [{ date: "2026-08-24", time: "20:00" }],
      manualStreamSlots: [],
      streamAvailability: "unavailable",
    });
    assert.equal(
      result.days
        .flatMap(({ items }) => items)
        .filter(({ origin }) => origin === "showroom-schedule").length,
      0,
    );
    assert.equal(result.availability.showroomSchedule, "unavailable");
  });

  it("derives endDate only from confirmed ends, keeping SHOWROOM null", () => {
    const crossDayEvent = adaptFanEvents([
      {
        id: "cross-day-fan",
        title: "cross day fan event",
        listedAt: "2026-08-22",
        startAt: "2026-08-24T23:00:00+09:00",
        endAt: "2026-08-25T01:00:00+09:00",
        timezone: "Asia/Tokyo",
        kind: "appearance",
        source: "https://example.com/fan-event",
      },
    ])[0];
    assert.equal(crossDayEvent.date, "2026-08-24");
    assert.equal(crossDayEvent.startTime, "23:00");
    assert.equal(crossDayEvent.endTime, "01:00");
    assert.equal(crossDayEvent.endDate, "2026-08-25");
    assert.equal(crossDayEvent.allDay, false);

    const sameDayEvent = adaptFanEvents([
      {
        id: "same-day-fan",
        title: "same day fan event",
        listedAt: "2026-08-22",
        startAt: "2026-08-24T19:00:00+09:00",
        endAt: "2026-08-24T21:00:00+09:00",
        timezone: "Asia/Tokyo",
        kind: "appearance",
        source: "https://example.com/fan-event",
      },
    ])[0];
    assert.equal(sameDayEvent.endDate, "2026-08-24");
    assert.equal(sameDayEvent.date, sameDayEvent.endDate);

    const openEndedEvent = adaptFanEvents([
      {
        id: "open-ended-fan",
        title: "open ended fan event",
        listedAt: "2026-08-22",
        startAt: "2026-08-24T19:00:00+09:00",
        timezone: "Asia/Tokyo",
        kind: "appearance",
        source: "https://example.com/fan-event",
      },
    ])[0];
    assert.equal(openEndedEvent.endTime, null);
    assert.equal(openEndedEvent.endDate, null);

    const [slot] = adaptStreamSlots([{ date: "2026-08-24", time: "23:30" }]);
    assert.equal(slot.endTime, null);
    assert.equal(slot.endDate, null);
  });

  it("keeps the cross-day end date for a timed SupportEvent", () => {
    const result = build({
      supportEvents: [
        {
          id: "cross-day-support",
          activityId: "live-stream",
          kind: "support-campaign",
          title: "cross day support fixture",
          schedule: {
            state: "confirmed-period",
            start: "2026-08-24T23:00:00+09:00",
            end: "2026-08-25T01:00:00+09:00",
            allDay: false,
            timezone: "Asia/Tokyo",
          },
          source: "https://example.com/support",
          verifiedAt: "2026-08-22",
        },
      ],
    });
    const item = result.days
      .flatMap(({ items }) => items)
      .find(({ origin }) => origin === "support-event");
    assert.equal(item.date, "2026-08-24");
    assert.equal(item.startTime, "23:00");
    assert.equal(item.endTime, "01:00");
    assert.equal(item.endDate, "2026-08-25");
    assert.equal(item.allDay, false);
  });

  it("keeps the all-day span shape unchanged alongside endDate", () => {
    const [item] = adaptContestSchedule(contestFixture).items;
    assert.equal(item.allDay, true);
    assert.deepEqual(item.span, { start: "2026-08-23", end: "2026-08-25" });
    assert.equal(item.endDate, "2026-08-25");
    assert.equal(item.startTime, null);
    assert.equal(item.endTime, null);
  });

  it("keeps static items during loading and omits unconfirmed SHOWROOM rows", () => {
    const result = build({
      streamSlots: [{ date: "2026-08-24", time: "20:00" }],
      streamAvailability: "loading",
    });
    assert.equal(result.availability.showroomSchedule, "loading");
    assert.ok(
      result.days
        .flatMap(({ items }) => items)
        .some(({ origin }) => origin === "contest"),
    );
    assert.equal(
      result.days
        .flatMap(({ items }) => items)
        .some(({ origin }) => origin === "showroom-schedule"),
      false,
    );
  });

  it("connects the five domain sources without copying their schedules", () => {
    const result = build({
      supportEvents: [
        {
          id: "period-fixture",
          activityId: "live-stream",
          kind: "support-campaign",
          title: "support fixture",
          schedule: {
            state: "confirmed-period",
            start: "2026-08-24",
            end: "2026-08-24",
            allDay: true,
            timezone: "Asia/Tokyo",
          },
          source: "https://example.com/support",
          verifiedAt: "2026-08-22",
        },
      ],
      fanEvents: [
        {
          id: "fan-fixture",
          title: "fan event fixture",
          listedAt: "2026-08-22",
          startAt: "2026-08-25T19:00:00+09:00",
          timezone: "Asia/Tokyo",
          kind: "appearance",
          source: "https://example.com/fan-event",
        },
      ],
      streamSlots: [{ date: "2026-08-26", time: "20:00" }],
      includeRadio: true,
      daysAhead: 8,
    });
    const items = result.days.flatMap(({ items }) => items);
    assert.deepEqual(
      new Set(items.map(({ origin }) => origin)),
      new Set([
        "contest",
        "support-event",
        "fan-event",
        "showroom-schedule",
        "radio-program",
      ]),
    );
    assert.equal(
      items.find(({ origin }) => origin === "fan-event")?.activityId,
      null,
    );
  });

  it("labels cross-day timed items with the confirmed end date", () => {
    const timed = (overrides) => ({
      key: "fixture",
      date: "2026-08-24",
      startTime: "23:00",
      endTime: "01:00",
      endDate: "2026-08-25",
      allDay: false,
      span: null,
      activityId: null,
      title: "fixture",
      origin: "fan-event",
      ...overrides,
    });

    // 同日timedは従来どおり簡潔な時刻表示。
    const sameDay = timed({ startTime: "19:00", endTime: "21:00", endDate: "2026-08-24" });
    assert.equal(isCrossDayTimedItem(sameDay), false);
    assert.equal(scheduleTimeLabel(sameDay), "19:00〜21:00");

    // 日跨ぎは終了側に日付を添える。
    const crossDay = timed();
    assert.equal(isCrossDayTimedItem(crossDay), true);
    assert.equal(scheduleTimeLabel(crossDay), "23:00〜8/25 01:00");

    // 終了未確認（SHOWROOM個別枠）は終了日時を生成しない。
    const openEnded = timed({ endTime: null, endDate: null });
    assert.equal(isCrossDayTimedItem(openEnded), false);
    assert.equal(scheduleTimeLabel(openEnded), "23:00 開始");

    // all-day span の既存表示は変えない。
    const allDay = timed({
      allDay: true,
      startTime: null,
      endTime: null,
      endDate: "2026-08-25",
      span: { start: "2026-08-24", end: "2026-08-25" },
    });
    assert.equal(isCrossDayTimedItem(allDay), false);
    assert.equal(scheduleTimeLabel(allDay), "終日");

    assert.equal(scheduleTimeLabel(timed({ startTime: null })), "時刻未確認");
    assert.equal(formatShortTokyoDate("2026-08-25"), "8/25");
    assert.equal(formatShortTokyoDate("2027-01-01"), "1/1");
  });

  it("labels a cross-day timed SupportEvent and FanEvent through the built calendar", () => {
    const result = build({
      supportEvents: [
        {
          id: "cross-day-support-label",
          activityId: "live-stream",
          kind: "support-campaign",
          title: "cross day support label",
          schedule: {
            state: "confirmed-period",
            start: "2026-08-24T23:00:00+09:00",
            end: "2026-08-25T01:00:00+09:00",
            allDay: false,
            timezone: "Asia/Tokyo",
          },
          source: "https://example.com/support",
          verifiedAt: "2026-08-22",
        },
      ],
      fanEvents: [
        {
          id: "cross-day-fan-label",
          title: "cross day fan label",
          listedAt: "2026-08-22",
          startAt: "2026-08-26T22:30:00+09:00",
          endAt: "2026-08-27T00:30:00+09:00",
          timezone: "Asia/Tokyo",
          kind: "appearance",
          source: "https://example.com/fan-event",
        },
      ],
      streamSlots: [{ date: "2026-08-24", time: "23:30" }],
    });
    const items = result.days.flatMap(({ items }) => items);
    const label = (origin) =>
      scheduleTimeLabel(items.find((item) => item.origin === origin));

    assert.equal(label("support-event"), "23:00〜8/25 01:00");
    assert.equal(label("fan-event"), "22:30〜8/27 00:30");
    assert.equal(label("showroom-schedule"), "23:30 開始");
  });

  it("keeps SHOWROOM endTime null instead of inventing a duration", () => {
    const [slot] = adaptStreamSlots([
      { date: "2026-08-24", time: "20:00", note: "fixture" },
    ]);
    assert.equal(slot.origin, "showroom-schedule");
    assert.equal(slot.activityId, "live-stream");
    assert.equal(slot.endTime, null);
    assert.equal(slot.span, null);
  });

  it("derives radio occurrences from the shared program definition", () => {
    const slots = adaptRadioProgram(
      Date.parse("2026-08-22T12:00:00+09:00"),
      8,
    );
    assert.ok(slots.length > 0);
    for (const slot of slots) {
      assert.equal(slot.origin, "radio-program");
      assert.equal(slot.activityId, "radio");
      assert.equal(slot.title, radioProgram.programName);
      assert.equal(slot.startTime, radioProgram.scheduledStart);
      assert.equal(slot.endTime, radioProgram.scheduledEnd);
      assert.match(slot.note, /本人の出演時間とは限りません/);
    }
  });
});

describe("displayStatus boundaries in Asia/Tokyo", () => {
  it("uses inclusive confirmed-period boundaries", () => {
    const schedule = {
      state: "confirmed-period",
      start: "2026-08-22T10:00:00+09:00",
      end: "2026-08-22T12:00:00+09:00",
      allDay: false,
      timezone: "Asia/Tokyo",
    };
    const start = Date.parse(schedule.start);
    const end = Date.parse(schedule.end);
    assert.equal(displayStatus(schedule, start - 1), "upcoming");
    assert.equal(displayStatus(schedule, start), "live");
    assert.equal(displayStatus(schedule, end), "live");
    assert.equal(displayStatus(schedule, end + 1), "ended");
  });

  it("never creates live for a timed confirmed-instant", () => {
    const schedule = {
      state: "confirmed-instant",
      at: "2026-08-22T12:00:00+09:00",
      allDay: false,
      timezone: "Asia/Tokyo",
    };
    const at = Date.parse(schedule.at);
    assert.equal(displayStatus(schedule, at - 1), "upcoming");
    assert.equal(displayStatus(schedule, at), "ended");
    assert.equal(displayStatus(schedule, at + 1), "ended");
  });

  it("uses the JST civil day for an all-day instant", () => {
    const schedule = {
      state: "confirmed-instant",
      at: "2026-08-22",
      allDay: true,
      timezone: "Asia/Tokyo",
    };
    assert.equal(
      displayStatus(schedule, Date.parse("2026-08-21T23:59:59.999+09:00")),
      "upcoming",
    );
    assert.equal(
      displayStatus(schedule, Date.parse("2026-08-22T00:00:00+09:00")),
      "live",
    );
    assert.equal(
      displayStatus(schedule, Date.parse("2026-08-22T23:59:59.999+09:00")),
      "live",
    );
    assert.equal(
      displayStatus(schedule, Date.parse("2026-08-23T00:00:00+09:00")),
      "ended",
    );
  });

  it("removes a passed deadline from NOW", () => {
    const deadline = {
      id: "deadline-fixture",
      activityId: "miss-circle",
      kind: "deadline",
      title: "deadline fixture",
      schedule: {
        state: "confirmed-instant",
        at: "2026-08-22T12:00:00+09:00",
        allDay: false,
        timezone: "Asia/Tokyo",
      },
      source: "https://example.com/deadline",
      verifiedAt: "2026-08-22",
    };
    assert.deepEqual(liveSupportEvents([deadline], Date.parse(deadline.schedule.at)), []);
  });
});

describe("Activity media derivation", () => {
  it("includes media reached only through related STORY slugs", () => {
    const media = selectActivityMedia("miss-circle", { newsItems: [] });
    assert.ok(media.includes(secondRoundStoryVideo));
  });

  it("deduplicates one shared manifest by id and returns the canonical object", () => {
    const media = selectActivityMedia("miss-circle", {
      newsItems: [
        {
          id: "fixture-related-news",
          date: "2026-08-22",
          title: "fixture",
          body: "fixture",
          media: secondRoundStoryVideo,
          activityIds: ["miss-circle"],
        },
      ],
      storyItems: stories,
    });
    assert.equal(
      media.filter(({ id }) => id === secondRoundStoryVideo.id).length,
      1,
    );
    assert.equal(media.find(({ id }) => id === secondRoundStoryVideo.id), secondRoundStoryVideo);
  });

  it("reuses the existing TikTok manifest object for explicitly related NEWS", () => {
    const tiktokNews = news.find(({ media }) => media === tiktokRadioVideo);
    assert.ok(tiktokNews);
    const media = selectActivityMedia("radio", {
      newsItems: [{ ...tiktokNews, activityIds: ["radio"] }],
      storyItems: [],
    });
    assert.deepEqual(media, [tiktokRadioVideo]);
    assert.equal(media[0], tiktokRadioVideo);
  });
});
