import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { news } from "./fixtures/news-before-b41.ts";
import { radioProgram } from "../src/data/radio.ts";
import { secondRoundStoryVideo } from "../src/data/secondRoundStoryVideo.ts";
import { stories } from "../src/data/stories.ts";
import { tiktokRadioVideo } from "../src/data/tiktokRadioVideo.ts";
import { selectActivityMedia } from "./fixtures/activity-media-before-b41.ts";
import {
  adaptContestSchedule,
  adaptFanEvents,
  adaptRadioProgram,
  adaptStreamSlots,
  adaptSupportEvents,
  buildSupportCalendar,
  displayStatus,
  formatShortTokyoDate,
  formatShortTokyoEndDate,
  isCrossDayTimedItem,
  isTimeUnconfirmedDateSpan,
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
      timing: "period",
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

    // 終了時刻は未確認でも、確認済みの終了日は失わない。
    const dateOnlyEnd = timed({
      startTime: "19:00",
      endTime: null,
      endDate: "2026-08-25",
    });
    assert.equal(isCrossDayTimedItem(dateOnlyEnd), true);
    assert.equal(scheduleTimeLabel(dateOnlyEnd), "19:00〜8/25");

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

    // 開始時刻未確認でも、fixture由来の確認済み終了（8/25 01:00）は落とさない。
    assert.equal(
      scheduleTimeLabel(timed({ startTime: null })),
      "時刻未確認 / 8/25 01:00 終了",
    );
    assert.equal(
      scheduleTimeLabel(timed({ startTime: null, endTime: null, endDate: null })),
      "時刻未確認",
    );
    assert.equal(formatShortTokyoDate("2026-08-25"), "8/25");
    assert.equal(formatShortTokyoDate("2027-01-01"), "1/1");
  });

  it("renders a timed start with a date-only cross-day end without inventing a time", () => {
    const [item] = adaptFanEvents([
      {
        id: "date-only-end",
        title: "date-only end fixture",
        listedAt: "2026-08-22",
        startAt: "2026-08-24T19:00:00+09:00",
        endAt: "2026-08-25",
        timezone: "Asia/Tokyo",
        kind: "appearance",
        source: "https://example.com/fan-event",
      },
    ]);
    assert.equal(item.startTime, "19:00");
    assert.equal(item.endDate, "2026-08-25");
    assert.equal(item.endTime, null);
    assert.equal(item.timing, "period");
    assert.equal(scheduleTimeLabel(item), "19:00〜8/25");
    assert.doesNotMatch(scheduleTimeLabel(item), /00:00|23:59|終日/);
  });

  it("treats date-only FanEvents as time-unconfirmed, not all-day", () => {
    const [singleDay, dateSpan] = adaptFanEvents([
      {
        id: "date-only-fan-event",
        title: "date-only fixture",
        listedAt: "2026-08-22",
        startAt: "2026-08-24",
        timezone: "Asia/Tokyo",
        kind: "appearance",
        source: "https://example.com/date-only",
      },
      {
        id: "date-only-span-fan-event",
        title: "date-only span fixture",
        listedAt: "2026-08-22",
        startAt: "2026-08-24",
        endAt: "2026-08-25",
        timezone: "Asia/Tokyo",
        kind: "appearance",
        source: "https://example.com/date-only-span",
      },
    ]);

    assert.equal(singleDay.allDay, false);
    assert.equal(singleDay.startTime, null);
    assert.equal(singleDay.endDate, null);
    assert.equal(scheduleTimeLabel(singleDay), "時刻未確認");
    assert.doesNotMatch(scheduleTimeLabel(singleDay), /終日|00:00|23:59/);

    assert.equal(dateSpan.allDay, false);
    assert.equal(dateSpan.startTime, null);
    assert.equal(dateSpan.endTime, null);
    assert.equal(dateSpan.endDate, "2026-08-25");
    assert.deepEqual(dateSpan.span, {
      start: "2026-08-24",
      end: "2026-08-25",
    });
    assert.equal(scheduleTimeLabel(dateSpan), "時刻未確認");
    assert.equal(isCrossDayTimedItem(dateSpan), false);
    assert.equal(isTimeUnconfirmedDateSpan(dateSpan), true);
    assert.doesNotMatch(scheduleTimeLabel(dateSpan), /終日|00:00|23:59/);
  });

  it("preserves confirmed end times when the start time is unknown", () => {
    const [sameDayEnd, crossDayEnd] = adaptFanEvents([
      {
        id: "date-only-start-timed-end",
        title: "same-day end-only fixture",
        listedAt: "2026-08-22",
        startAt: "2026-08-24",
        endAt: "2026-08-24T21:00:00+09:00",
        timezone: "Asia/Tokyo",
        kind: "appearance",
        source: "https://example.com/end-only",
      },
      {
        id: "date-only-start-cross-day-end",
        title: "cross-day end-only fixture",
        listedAt: "2026-08-22",
        startAt: "2026-08-24",
        endAt: "2026-08-25T01:00:00+09:00",
        timezone: "Asia/Tokyo",
        kind: "appearance",
        source: "https://example.com/end-only-cross",
      },
    ]);

    // 開始時刻は推測しない。確認済みの終了時刻だけを残す。
    assert.equal(sameDayEnd.startTime, null);
    assert.equal(sameDayEnd.endTime, "21:00");
    assert.equal(sameDayEnd.endDate, "2026-08-24");
    assert.equal(sameDayEnd.allDay, false);
    assert.equal(scheduleTimeLabel(sameDayEnd), "時刻未確認 / 21:00 終了");
    assert.doesNotMatch(scheduleTimeLabel(sameDayEnd), /終日|00:00|23:59|開始/);
    assert.equal(isCrossDayTimedItem(sameDayEnd), false);
    assert.equal(isTimeUnconfirmedDateSpan(sameDayEnd), false);

    assert.equal(crossDayEnd.startTime, null);
    assert.equal(crossDayEnd.endTime, "01:00");
    assert.equal(crossDayEnd.endDate, "2026-08-25");
    assert.equal(scheduleTimeLabel(crossDayEnd), "時刻未確認 / 8/25 01:00 終了");
    assert.doesNotMatch(scheduleTimeLabel(crossDayEnd), /終日|00:00|23:59|開始/);
    // 日跨ぎのend-onlyはUIの期間行（8/24〜8/25 01:00）にも載る。
    assert.equal(isCrossDayTimedItem(crossDayEnd), false);
    assert.equal(isTimeUnconfirmedDateSpan(crossDayEnd), true);

    // built calendar経由でも確認済み終了が失われない。
    const built = build({
      fanEvents: [
        {
          id: "built-end-only",
          title: "built end-only fixture",
          listedAt: "2026-08-22",
          startAt: "2026-08-24",
          endAt: "2026-08-24T21:00:00+09:00",
          timezone: "Asia/Tokyo",
          kind: "appearance",
          source: "https://example.com/built-end-only",
        },
      ],
    });
    const item = built.days
      .flatMap(({ items }) => items)
      .find(({ origin }) => origin === "fan-event");
    assert.equal(scheduleTimeLabel(item), "時刻未確認 / 21:00 終了");
  });

  it("keeps the FanEvent time-precision matrix free of guessed times", () => {
    const fan = (id, startAt, endAt) => ({
      id,
      title: id,
      listedAt: "2026-08-22",
      startAt,
      ...(endAt ? { endAt } : {}),
      timezone: "Asia/Tokyo",
      kind: "appearance",
      source: "https://example.com/matrix",
    });
    const labels = adaptFanEvents([
      fan("a-date-only-start", "2026-08-24"),
      fan("b-date-only-span", "2026-08-24", "2026-08-25"),
      fan("c-same-day-timed-end", "2026-08-24", "2026-08-24T21:00:00+09:00"),
      fan("d-cross-day-timed-end", "2026-08-24", "2026-08-25T01:00:00+09:00"),
      fan("e-timed-start-only", "2026-08-24T20:00:00+09:00"),
      fan("f-timed-start-date-only-end", "2026-08-24T19:00:00+09:00", "2026-08-25"),
      fan("g-same-day-timed", "2026-08-24T19:00:00+09:00", "2026-08-24T21:00:00+09:00"),
      fan("h-cross-day-timed", "2026-08-24T23:00:00+09:00", "2026-08-25T01:00:00+09:00"),
    ]).map(scheduleTimeLabel);
    assert.deepEqual(labels, [
      "時刻未確認",
      "時刻未確認",
      "時刻未確認 / 21:00 終了",
      "時刻未確認 / 8/25 01:00 終了",
      "20:00 開始",
      "19:00〜8/25",
      "19:00〜21:00",
      "23:00〜8/25 01:00",
    ]);
    // date-only FanEventはどのprecisionでも「終日」や生成時刻にならない。
    for (const label of labels) {
      assert.doesNotMatch(label, /終日|00:00 開始|23:59/);
    }

    // 本当に確認済みのall-dayは引き続き「終日」「日付指定」（FanEventのdate-onlyと混同しない）。
    const [contestItem] = adaptContestSchedule(contestFixture).items;
    assert.equal(scheduleTimeLabel(contestItem), "終日");
    const supportBase = {
      activityId: "live-stream",
      kind: "support-campaign",
      source: "https://example.com/all-day",
      verifiedAt: "2026-08-22",
    };
    const [allDayPeriod] = adaptSupportEvents([
      {
        ...supportBase,
        id: "all-day-period",
        title: "all-day period fixture",
        schedule: {
          state: "confirmed-period",
          start: "2026-08-24",
          end: "2026-08-25",
          allDay: true,
          timezone: "Asia/Tokyo",
        },
      },
    ]).items;
    assert.equal(scheduleTimeLabel(allDayPeriod), "終日");
    const [allDayInstant] = adaptSupportEvents([
      {
        ...supportBase,
        id: "all-day-instant",
        title: "all-day instant fixture",
        schedule: {
          state: "confirmed-instant",
          at: "2026-08-24",
          allDay: true,
          timezone: "Asia/Tokyo",
        },
      },
    ]).items;
    assert.equal(scheduleTimeLabel(allDayInstant), "日付指定");
  });

  it("preserves the confirmed end year in cross-year labels", () => {
    const fan = (id, startAt, endAt) => ({
      id,
      title: id,
      listedAt: "2026-08-22",
      startAt,
      ...(endAt ? { endAt } : {}),
      timezone: "Asia/Tokyo",
      kind: "appearance",
      source: "https://example.com/cross-year",
    });
    const labels = adaptFanEvents([
      fan("a-same-year-cross-day", "2026-08-24T23:00:00+09:00", "2026-08-25T01:00:00+09:00"),
      fan("b-next-year-cross-day", "2026-12-31T23:00:00+09:00", "2027-01-01T01:00:00+09:00"),
      fan("c-multi-year", "2026-12-31T23:00:00+09:00", "2028-01-01T01:00:00+09:00"),
      fan("d-cross-year-date-only-end", "2026-12-31T19:00:00+09:00", "2027-01-01"),
      fan("e-end-only-cross-year", "2026-12-31", "2027-01-01T01:00:00+09:00"),
      fan("f-date-only-cross-year-span", "2026-12-31", "2027-01-02"),
      fan("g-same-year-span", "2026-08-24", "2026-08-25"),
    ]).map(scheduleTimeLabel);
    assert.deepEqual(labels, [
      "23:00〜8/25 01:00",
      "23:00〜2027/1/1 01:00",
      "23:00〜2028/1/1 01:00",
      "19:00〜2027/1/1",
      "時刻未確認 / 2027/1/1 01:00 終了",
      "時刻未確認",
      "時刻未確認",
    ]);
    // 同一年では不要な年を出さず、開始年と異なる終了年は必ず表示する。
    assert.doesNotMatch(labels[0], /202\d/);
    for (const label of [labels[1], labels[3], labels[4]]) {
      assert.match(label, /2027\/1\/1/);
    }
    // date-only endに終了時刻を生成しない。
    assert.doesNotMatch(labels[3], /00:00|23:59/);

    // 期間行が使う終了日formatも、cross-yearだけ年を付ける。
    assert.equal(formatShortTokyoEndDate("2026-08-24", "2026-08-25"), "8/25");
    assert.equal(formatShortTokyoEndDate("2026-12-31", "2027-01-02"), "2027/1/2");
    assert.equal(formatShortTokyoEndDate("2026-12-31", "2028-01-01"), "2028/1/1");
    // leap yearでも同一年は短い表示のまま。
    assert.equal(formatShortTokyoEndDate("2028-02-28", "2028-02-29"), "2/29");

    // JST年境界: UTC 2026-12-31T15:30ZはJSTで2027-01-01 00:30。年比較はJST基準。
    const [jstBoundary] = adaptFanEvents([
      fan("jst-year-boundary", "2026-12-31T23:00:00+09:00", "2026-12-31T15:30:00Z"),
    ]);
    assert.equal(jstBoundary.endDate, "2027-01-01");
    assert.equal(scheduleTimeLabel(jstBoundary), "23:00〜2027/1/1 00:30");

    // 表示format変更でsort/groupingを壊さない（dateはYYYY-MM-DDのまま）。
    const built = build({
      fanEvents: [
        fan("built-cross-year", "2026-12-31T23:00:00+09:00", "2027-01-01T01:00:00+09:00"),
      ],
      contest: { ...contestFixture, currentPhase: null },
    });
    assert.deepEqual(built.days.map(({ date }) => date), ["2026-12-31"]);
    assert.equal(
      scheduleTimeLabel(built.days[0].items[0]),
      "23:00〜2027/1/1 01:00",
    );
  });

  it("keeps point-in-time SupportEvents distinct from interval starts", () => {
    const events = [
      { id: "deadline", kind: "deadline", title: "締切 fixture", at: "20:00" },
      { id: "result", kind: "result", title: "結果発表 fixture", at: "18:00" },
      {
        id: "generic",
        kind: "support-campaign",
        title: "時点 fixture",
        at: "19:00",
      },
    ].map(({ at, ...item }) => ({
      ...item,
      activityId: "miss-circle",
      schedule: {
        state: "confirmed-instant",
        at: `2026-08-24T${at}:00+09:00`,
        allDay: false,
        timezone: "Asia/Tokyo",
      },
      source: `https://example.com/${item.id}`,
      verifiedAt: "2026-08-22",
    }));
    const items = adaptSupportEvents(events).items;
    assert.deepEqual(items.map(({ timing }) => timing), ["instant", "instant", "instant"]);
    assert.deepEqual(items.map(scheduleTimeLabel), ["20:00", "18:00", "19:00"]);
    for (const label of items.map(scheduleTimeLabel)) {
      assert.doesNotMatch(label, /開始/);
    }

    const [period] = adaptSupportEvents([
      {
        id: "period-semantics",
        activityId: "live-stream",
        kind: "support-campaign",
        title: "period fixture",
        schedule: {
          state: "confirmed-period",
          start: "2026-08-24T19:00:00+09:00",
          end: "2026-08-24T21:00:00+09:00",
          allDay: false,
          timezone: "Asia/Tokyo",
        },
        source: "https://example.com/period",
        verifiedAt: "2026-08-22",
      },
    ]).items;
    assert.equal(period.timing, "period");
    assert.equal(scheduleTimeLabel(period), "19:00〜21:00");

    const [fanStart] = adaptFanEvents([
      {
        id: "fan-start-semantics",
        title: "fan start fixture",
        listedAt: "2026-08-22",
        startAt: "2026-08-24T19:00:00+09:00",
        timezone: "Asia/Tokyo",
        kind: "appearance",
        source: "https://example.com/fan-start",
      },
    ]);
    const [showroomStart] = adaptStreamSlots([
      { date: "2026-08-24", time: "20:00" },
    ]);
    assert.equal(fanStart.timing, "start");
    assert.equal(scheduleTimeLabel(fanStart), "19:00 開始");
    assert.equal(showroomStart.timing, "start");
    assert.equal(scheduleTimeLabel(showroomStart), "20:00 開始");
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

  it("keeps SHOWROOM endTime null when the slot has no confirmed end", () => {
    const [slot] = adaptStreamSlots([
      { date: "2026-08-24", time: "20:00", note: "fixture" },
    ]);
    assert.equal(slot.origin, "showroom-schedule");
    assert.equal(slot.activityId, "live-stream");
    assert.equal(slot.endTime, null);
    assert.equal(slot.endDate, null);
    assert.equal(slot.span, null);
    assert.equal(scheduleTimeLabel(slot), "20:00 開始");
  });

  it("puts a confirmed SHOWROOM end on the calendar instead of inventing 3 hours", () => {
    const [morning] = adaptStreamSlots([
      { date: "2026-09-03", time: "07:30", endTime: "08:00", note: "7:30-8:00" },
    ]);
    assert.equal(morning.endTime, "08:00");
    assert.equal(morning.endDate, "2026-09-03");
    assert.equal(scheduleTimeLabel(morning), "07:30〜08:00");

    const [overnight] = adaptStreamSlots([
      {
        date: "2026-09-08",
        time: "23:00",
        endTime: "01:00",
        note: "overnight fixture",
      },
    ]);
    assert.equal(overnight.endTime, "01:00");
    assert.equal(overnight.endDate, "2026-09-09");
    assert.equal(scheduleTimeLabel(overnight), "23:00〜9/9 01:00");
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
