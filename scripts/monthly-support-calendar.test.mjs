import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  buildMonthGrid,
  daysUntilEndOfNextTokyoMonth,
  expandScheduleItemsByDate,
  navigableMonthBounds,
  scheduleCategory,
  shiftMonthKey,
  tokyoDateKey,
  tokyoMonthKey,
  toggleSelectedDate,
} from "../src/lib/monthCalendar.ts";
import {
  adaptRadioProgram,
  buildSupportCalendar,
} from "../src/lib/supportCalendar.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = (relative) => readFileSync(path.join(root, relative), "utf8");

function scheduleItem(overrides = {}) {
  return {
    key: "fixture",
    date: "2026-08-24",
    startTime: null,
    endTime: null,
    endDate: null,
    allDay: false,
    span: null,
    timing: "start",
    activityId: null,
    title: "fixture",
    origin: "fan-event",
    ...overrides,
  };
}

describe("monthly Support Calendar grid", () => {
  it("derives the current civil date and month in Asia/Tokyo", () => {
    const instant = Date.parse("2026-08-31T15:30:00Z");
    assert.equal(tokyoDateKey(instant), "2026-09-01");
    assert.equal(tokyoMonthKey(instant), "2026-09");
  });

  it("builds August 2026 as a Monday-first seven-column grid", () => {
    const cells = buildMonthGrid("2026-08");
    assert.equal(cells.length % 7, 0);
    assert.equal(cells.length, 42);
    assert.deepEqual(cells.slice(0, 5), Array(5).fill({ date: null, day: null }));
    assert.deepEqual(cells[5], { date: "2026-08-01", day: 1 });
    assert.deepEqual(cells[6], { date: "2026-08-02", day: 2 });
    assert.deepEqual(cells[7], { date: "2026-08-03", day: 3 });
    assert.deepEqual(cells[35], { date: "2026-08-31", day: 31 });
  });

  it("moves across month and year boundaries", () => {
    assert.equal(shiftMonthKey("2026-08", -1), "2026-07");
    assert.equal(shiftMonthKey("2026-12", 1), "2027-01");
    assert.equal(shiftMonthKey("2027-01", -1), "2026-12");
  });

  it("keeps leap-day dates in the grid", () => {
    const dates = buildMonthGrid("2028-02").map(({ date }) => date);
    assert.ok(dates.includes("2028-02-29"));
    assert.equal(dates.includes("2028-02-30"), false);
  });

  it("covers radio occurrences through the end of the next JST month", () => {
    const now = Date.parse("2026-08-24T12:00:00+09:00");
    const daysAhead = daysUntilEndOfNextTokyoMonth(now);
    const radioItems = adaptRadioProgram(now, daysAhead);
    const radioDates = radioItems.map(({ date }) => date);
    const grouped = expandScheduleItemsByDate(
      radioItems.map((item) => ({ date: item.date, items: [item] })),
    );

    assert.equal(daysAhead, 37);
    assert.deepEqual(radioDates, [
      "2026-08-02",
      "2026-08-09",
      "2026-08-16",
      "2026-08-23",
      "2026-08-30",
      "2026-09-06",
      "2026-09-13",
      "2026-09-20",
      "2026-09-27",
    ]);
    assert.equal(radioDates.some((date) => date < "2026-08-01"), false);
    assert.equal(radioDates.some((date) => date > "2026-09-30"), false);
    assert.equal(scheduleCategory(grouped.get("2026-08-02")?.[0]).label, "RADIO");
    assert.equal(scheduleCategory(grouped.get("2026-09-27")?.[0]).label, "RADIO");
  });

  it("covers the next JST month across the December to January boundary", () => {
    const now = Date.parse("2026-12-24T12:00:00+09:00");
    const daysAhead = daysUntilEndOfNextTokyoMonth(now);
    const radioDates = adaptRadioProgram(now, daysAhead).map(({ date }) => date);

    assert.equal(daysAhead, 38);
    assert.equal(radioDates[0], "2026-12-06");
    assert.equal(radioDates.at(-1), "2027-01-31");
    assert.equal(radioDates.some((date) => date > "2027-01-31"), false);
  });

  it("bounds month navigation to the generated range and later confirmed items", () => {
    assert.deepEqual(navigableMonthBounds("2026-08", []), {
      minMonth: "2026-08",
      maxMonth: "2026-09",
    });
    assert.deepEqual(
      navigableMonthBounds("2026-08", ["2026-08", "2026-09", "2026-10"]),
      { minMonth: "2026-08", maxMonth: "2026-10" },
    );
    assert.deepEqual(navigableMonthBounds("2026-12", ["2027-01"]), {
      minMonth: "2026-12",
      maxMonth: "2027-01",
    });
  });

  it("extends radio slots through every month that other confirmed items make navigable", () => {
    const now = Date.parse("2026-08-24T12:00:00+09:00");
    const result = buildSupportCalendar({
      contest: {
        contestName: "fixture",
        entryNumber: "ENTRY fixture",
        entryUrl: "https://example.com/entry",
        currentPhase: {
          name: "pending phase",
          start: null,
          end: null,
          source: "https://example.com/phase",
        },
        lastVerifiedAt: "2026-08-24",
      },
      supportEvents: [
        {
          id: "later",
          activityId: "campus-girls",
          kind: "support-campaign",
          title: "later fixture",
          schedule: {
            state: "confirmed-period",
            start: "2026-10-05",
            end: "2026-10-06",
            allDay: true,
            timezone: "Asia/Tokyo",
          },
          source: "https://example.com/later",
          verifiedAt: "2026-08-24",
        },
      ],
      fanEvents: [],
      streamSlots: [],
      streamAvailability: "unavailable",
      includeRadio: true,
      now,
      daysAhead: daysUntilEndOfNextTokyoMonth(now),
    });
    const radioDates = result.days
      .flatMap(({ items }) => items)
      .filter(({ origin }) => origin === "radio-program")
      .map(({ date }) => date);
    const itemMonths = result.days.flatMap((day) => [
      day.date.slice(0, 7),
      ...day.items
        .map((item) => item.endDate?.slice(0, 7))
        .filter((month) => Boolean(month)),
    ]);

    assert.equal(radioDates.includes("2026-08-02"), true);
    assert.equal(radioDates.includes("2026-09-27"), true);
    assert.equal(radioDates.includes("2026-10-04"), true);
    assert.equal(radioDates.includes("2026-10-25"), true);
    assert.equal(radioDates.some((date) => date > "2026-10-31"), false);
    assert.deepEqual(navigableMonthBounds("2026-08", itemMonths), {
      minMonth: "2026-08",
      maxMonth: "2026-10",
    });
  });
});

describe("monthly ScheduleItem expansion", () => {
  it("indexes one-day and multi-day items on every confirmed civil date", () => {
    const single = scheduleItem({ key: "single" });
    const week = scheduleItem({
      key: "week",
      endDate: "2026-08-30",
      span: { start: "2026-08-24", end: "2026-08-30" },
      timing: "period",
    });
    const crossMonth = scheduleItem({
      key: "cross-month",
      date: "2026-08-26",
      endDate: "2026-09-01",
      span: { start: "2026-08-26", end: "2026-09-01" },
      timing: "period",
    });
    const crossYear = scheduleItem({
      key: "cross-year",
      date: "2026-12-31",
      endDate: "2027-01-02",
      span: { start: "2026-12-31", end: "2027-01-02" },
      timing: "period",
    });
    const grouped = expandScheduleItemsByDate([
      { date: "2026-08-24", items: [single, week] },
      { date: "2026-08-26", items: [crossMonth] },
      { date: "2026-12-31", items: [crossYear] },
    ]);

    assert.deepEqual(
      [...grouped.entries()]
        .filter(([, items]) => items.includes(week))
        .map(([date]) => date),
      [
        "2026-08-24",
        "2026-08-25",
        "2026-08-26",
        "2026-08-27",
        "2026-08-28",
        "2026-08-29",
        "2026-08-30",
      ],
    );
    assert.equal(grouped.get("2026-09-01")?.includes(crossMonth), true);
    assert.equal(grouped.get("2027-01-01")?.includes(crossYear), true);
    assert.equal(grouped.get("2027-01-02")?.includes(crossYear), true);
    assert.equal(grouped.get("2026-08-23"), undefined);
  });

  it("keeps the original ScheduleItem immutable and shared by reference", () => {
    const item = scheduleItem({
      key: "shared-period",
      endDate: "2026-08-26",
      span: { start: "2026-08-24", end: "2026-08-26" },
      timing: "period",
    });
    const before = structuredClone(item);
    const grouped = expandScheduleItemsByDate([{ date: item.date, items: [item] }]);

    assert.equal(grouped.get("2026-08-24")?.[0], item);
    assert.equal(grouped.get("2026-08-25")?.[0], item);
    assert.equal(grouped.get("2026-08-26")?.[0], item);
    assert.deepEqual(item, before);
  });
});

describe("monthly schedule categories and safety", () => {
  it("maps only activityId and origin to visible text categories", () => {
    assert.equal(
      scheduleCategory(scheduleItem({ activityId: "miss-circle" })).label,
      "MISS CIRCLE",
    );
    assert.equal(
      scheduleCategory(scheduleItem({ activityId: "campus-girls" })).label,
      "CAMPUS GIRLS",
    );
    assert.equal(
      scheduleCategory(
        scheduleItem({ activityId: "live-stream", origin: "showroom-schedule" }),
      ).label,
      "SHOWROOM",
    );
    assert.equal(
      scheduleCategory(scheduleItem({ activityId: "live-stream" })).label,
      "LIVE",
    );
    assert.equal(scheduleCategory(scheduleItem({ activityId: "radio" })).label, "RADIO");
    assert.equal(scheduleCategory(scheduleItem({ activityId: null })).label, "EVENT");
  });

  it("keeps date-pending off the grid and static dates during SHOWROOM unavailability", () => {
    const result = buildSupportCalendar({
      contest: {
        contestName: "fixture",
        entryNumber: "ENTRY fixture",
        entryUrl: "https://example.com/entry",
        currentPhase: {
          name: "pending phase",
          start: null,
          end: null,
          source: "https://example.com/phase",
        },
        lastVerifiedAt: "2026-08-24",
      },
      supportEvents: [
        {
          id: "confirmed",
          activityId: "campus-girls",
          kind: "support-campaign",
          title: "confirmed fixture",
          schedule: {
            state: "confirmed-period",
            start: "2026-08-24",
            end: "2026-08-25",
            allDay: true,
            timezone: "Asia/Tokyo",
          },
          source: "https://example.com/confirmed",
          verifiedAt: "2026-08-24",
        },
      ],
      fanEvents: [],
      streamSlots: [{ date: "2026-08-24", time: "20:00" }],
      manualStreamSlots: [],
      streamAvailability: "unavailable",
      includeRadio: false,
      now: Date.parse("2026-08-24T12:00:00+09:00"),
      daysAhead: 14,
    });
    const grouped = expandScheduleItemsByDate(result.days);

    assert.equal(result.pending.length, 1);
    assert.equal(grouped.get("2026-08-24")?.length, 1);
    assert.equal(grouped.get("2026-08-25")?.length, 1);
    assert.equal(
      [...grouped.values()].flat().some(({ origin }) => origin === "showroom-schedule"),
      false,
    );
  });

  it("keeps radio occurrences labelled as program slots, not confirmed appearances", () => {
    const [radio] = adaptRadioProgram(
      Date.parse("2026-08-24T12:00:00+09:00"),
      7,
    );
    assert.ok(radio);
    assert.match(radio.note, /番組枠/);
    assert.match(radio.note, /本人の出演時間とは限りません/);
  });

  it("does not introduce a second schedule source of truth", () => {
    for (const relative of [
      "src/data/calendar.ts",
      "src/data/calendarEvents.ts",
      "src/data/schedule.json",
    ]) {
      assert.equal(existsSync(path.join(root, relative)), false);
    }
    const helper = source("src/lib/monthCalendar.ts");
    assert.match(helper, /SupportCalendarResult\["days"\]/);
    assert.doesNotMatch(helper, /export const (events|schedule|calendarItems)/);
  });
});

describe("monthly Support Calendar UI source", () => {
  it("toggles the selected date while keeping today and month navigation behavior", () => {
    const calendar = source("src/components/MonthlyScheduleCalendar.tsx");

    assert.equal(toggleSelectedDate(null, "2026-08-24"), "2026-08-24");
    assert.equal(toggleSelectedDate("2026-08-24", "2026-08-24"), null);
    assert.equal(
      toggleSelectedDate("2026-08-24", "2026-08-25"),
      "2026-08-25",
    );
    assert.match(
      calendar,
      /setSelectedDate\(\(current\) =>[\s\S]*?toggleSelectedDate\(current, selectableDate\)/,
    );
    assert.match(calendar, /aria-pressed=\{isSelected\}/);
    assert.match(calendar, /setSelectedDate\(today\)/);
    assert.match(calendar, /setSelectedDate\(nextMonth === todayMonth \? today : null\)/);
    assert.match(calendar, /previousTodayMonth\.current === todayMonth/);
    assert.match(calendar, /navigableMonthBounds\(todayMonth, itemMonths\)/);
    assert.match(calendar, /disabled=\{!canGoPrev\}/);
    assert.match(calendar, /disabled=\{!canGoNext\}/);
  });

  it("keeps the monthly overview, selected-day details, and Agenda together", () => {
    const page = source("src/SupportPage.tsx");
    const calendar = source("src/components/MonthlyScheduleCalendar.tsx");
    assert.match(page, /title="みりぃスケジュール"/);
    assert.match(page, /<MonthlyScheduleCalendar calendar=\{calendar\} today=\{today\}/);
    assert.match(page, /daysUntilEndOfNextTokyoMonth\(now\)/);
    assert.doesNotMatch(page, /RADIO_OCCURRENCE_DAYS_AHEAD/);
    assert.match(calendar, /grid-cols-7/);
    assert.match(calendar, /aria-label="前月を表示"/);
    assert.match(calendar, /aria-label="次月を表示"/);
    assert.match(calendar, /aria-label="今日を表示"/);
    assert.match(calendar, /disabled=\{!canGoPrev\}/);
    assert.match(calendar, /disabled=\{!canGoNext\}/);
    assert.match(calendar, /aria-pressed=\{isSelected\}/);
    assert.match(calendar, /<time[\s\S]*?dateTime=\{cell\.date\}/);
    assert.match(calendar, /この日の確認済み予定はありません/);
    assert.match(page, /確認済み予定一覧/);
    assert.match(page, /aria-label="確認済み予定の日付別一覧"/);
  });

  it("reuses one detailed card in the selected day and Agenda", () => {
    const page = source("src/SupportPage.tsx");
    const calendar = source("src/components/MonthlyScheduleCalendar.tsx");
    assert.match(page, /<SupportScheduleItemCard key=\{item\.key\} item=\{item\}/);
    assert.match(calendar, /<SupportScheduleItemCard key=\{item\.key\} item=\{item\}/);
  });
});
