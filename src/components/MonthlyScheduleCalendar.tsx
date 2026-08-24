import { useMemo, useState } from "react";
import {
  buildMonthGrid,
  expandScheduleItemsByDate,
  scheduleCategory,
  shiftMonthKey,
  toggleSelectedDate,
} from "../lib/monthCalendar";
import type { ScheduleItem, SupportCalendarResult } from "../lib/supportCalendar";
import { SupportScheduleItemCard } from "./SupportScheduleItemCard";

const WEEKDAYS = ["月", "火", "水", "木", "金", "土", "日"] as const;
const MAX_CELL_LABELS = 2;

const monthHeadingFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "long",
});

const selectedDateFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "short",
});

const accessibleDateFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
});

function monthHeading(monthKey: string): string {
  return monthHeadingFormatter.format(new Date(`${monthKey}-01T00:00:00+09:00`));
}

function formatSelectedDate(date: string): string {
  return selectedDateFormatter.format(new Date(`${date}T00:00:00+09:00`));
}

function categoryClass(item: ScheduleItem): string {
  switch (scheduleCategory(item).id) {
    case "miss-circle":
      return "border-sage/20 bg-sage-soft text-sage-deep";
    case "campus-girls":
      return "border-apricot/50 bg-apricot-soft text-apricot-ink";
    case "showroom":
      return "border-sage/25 bg-sage text-white";
    case "live":
      return "border-sage/25 bg-sage-soft/70 text-sage-deep";
    case "radio":
      return "border-apricot/50 bg-paper text-apricot-ink";
    case "event":
      return "border-ink-muted/20 bg-paper text-ink-muted";
  }
}

function dateButtonLabel(date: string, items: ScheduleItem[]): string {
  const formatted = accessibleDateFormatter.format(
    new Date(`${date}T00:00:00+09:00`),
  );
  if (items.length === 0) return `${formatted}、確認済み予定なし`;
  const categories = [...new Set(items.map((item) => scheduleCategory(item).label))];
  return `${formatted}、確認済み予定${items.length}件、${categories.join("、")}`;
}

export function MonthlyScheduleCalendar({
  calendar,
  today,
}: {
  calendar: SupportCalendarResult;
  /** Asia/Tokyoのcivil date（YYYY-MM-DD） */
  today: string;
}) {
  const todayMonth = today.slice(0, 7);
  const [visibleMonth, setVisibleMonth] = useState(todayMonth);
  const [selectedDate, setSelectedDate] = useState<string | null>(today);
  const cells = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth]);
  const itemsByDate = useMemo(
    () => expandScheduleItemsByDate(calendar.days),
    [calendar.days],
  );
  const selectedItems =
    selectedDate === null ? [] : (itemsByDate.get(selectedDate) ?? []);
  const heading = monthHeading(visibleMonth);

  const moveMonth = (offset: number) => {
    const nextMonth = shiftMonthKey(visibleMonth, offset);
    setVisibleMonth(nextMonth);
    setSelectedDate(nextMonth === todayMonth ? today : null);
  };

  const returnToToday = () => {
    setVisibleMonth(todayMonth);
    setSelectedDate(today);
  };

  return (
    <div className="mt-7 rounded-3xl border border-sage/15 bg-paper-card p-3 shadow-card sm:p-5">
      <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-start gap-2">
        <button
          type="button"
          aria-label="前月を表示"
          onClick={() => moveMonth(-1)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-sage/25 bg-paper text-xl font-bold text-sage-deep hover:bg-sage-soft"
        >
          <span aria-hidden="true">‹</span>
        </button>
        <div className="min-w-0 text-center">
          <h3 id="monthly-schedule-heading" className="text-lg font-bold text-ink sm:text-xl">
            {heading}
          </h3>
          <button
            type="button"
            aria-label="今日を表示"
            onClick={returnToToday}
            className="mt-2 inline-flex min-h-11 items-center justify-center rounded-full border border-sage/25 bg-paper px-4 text-sm font-semibold text-sage-deep hover:bg-sage-soft"
          >
            今日
          </button>
        </div>
        <button
          type="button"
          aria-label="次月を表示"
          onClick={() => moveMonth(1)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-sage/25 bg-paper text-xl font-bold text-sage-deep hover:bg-sage-soft"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div
        role="group"
        aria-label={`${heading}の月間カレンダー`}
        className="mt-5 min-w-0"
        data-testid="monthly-schedule-calendar"
      >
        <div className="grid grid-cols-7 gap-1" aria-hidden="true">
          {WEEKDAYS.map((weekday) => (
            <div
              key={weekday}
              className="py-1 text-center text-[11px] font-semibold text-ink-muted sm:text-xs"
            >
              {weekday}
            </div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((cell, index) => {
            if (cell.date === null || cell.day === null) {
              return (
                <div
                  key={`empty-${index}`}
                  aria-hidden="true"
                  className="min-h-20 rounded-xl bg-paper/45 sm:min-h-24"
                />
              );
            }

            const selectableDate = cell.date;
            const items = itemsByDate.get(cell.date) ?? [];
            const isToday = cell.date === today;
            const isSelected = cell.date === selectedDate;
            const previewItems = items.slice(0, MAX_CELL_LABELS);
            const remainingCount = items.length - previewItems.length;

            return (
              <button
                key={cell.date}
                type="button"
                aria-label={dateButtonLabel(cell.date, items)}
                aria-pressed={isSelected}
                aria-current={isToday ? "date" : undefined}
                onClick={() =>
                  setSelectedDate((current) =>
                    toggleSelectedDate(current, selectableDate),
                  )
                }
                className={`min-h-20 min-w-0 rounded-xl border p-0.5 text-left transition sm:min-h-24 sm:p-1.5 ${
                  isSelected
                    ? "border-sage bg-sage-soft/55 shadow-sm"
                    : isToday
                      ? "border-apricot bg-apricot-soft/35"
                      : "border-sage/15 bg-paper hover:border-sage/40 hover:bg-sage-soft/25"
                }`}
              >
                <span className="flex min-w-0 items-start justify-between gap-0.5">
                  <time
                    dateTime={cell.date}
                    className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-0.5 text-[11px] font-bold sm:h-6 sm:min-w-6 sm:px-1 sm:text-sm ${
                      isToday ? "bg-apricot text-ink" : "text-ink"
                    }`}
                  >
                    {cell.day}
                  </time>
                  {isToday ? (
                    <span className="shrink-0 whitespace-nowrap text-[8px] font-bold leading-5 text-apricot-ink sm:text-[9px]">
                      今日
                    </span>
                  ) : null}
                </span>
                {previewItems.length > 0 ? (
                  <span className="mt-1 flex min-w-0 flex-col gap-1">
                    {previewItems.map((item) => {
                      const category = scheduleCategory(item);
                      return (
                        <span
                          key={item.key}
                          aria-label={category.label}
                          className={`block min-w-0 overflow-hidden whitespace-nowrap rounded-md border px-0.5 py-0.5 text-center text-[7px] font-bold leading-tight sm:px-1 sm:text-[10px] ${categoryClass(item)}`}
                        >
                          <span aria-hidden="true">{category.compactLabel}</span>
                        </span>
                      );
                    })}
                    {remainingCount > 0 ? (
                      <span
                        aria-label={`ほか${remainingCount}件`}
                        className="block truncate px-1 text-[9px] font-semibold text-ink-muted sm:text-[10px]"
                      >
                        +{remainingCount}
                      </span>
                    ) : null}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <section
        aria-labelledby="selected-day-schedule-heading"
        className="mt-6 border-t border-sage/15 pt-5"
      >
        <h3 id="selected-day-schedule-heading" className="text-lg font-bold text-sage-deep">
          {selectedDate === null ? (
            "選択した日の予定"
          ) : (
            <>
              <time dateTime={selectedDate}>{formatSelectedDate(selectedDate)}</time>
              の予定
            </>
          )}
        </h3>
        {selectedDate === null ? (
          <p className="mt-3 text-sm leading-7 text-ink-muted">
            日付を選択すると、確認済み予定の詳細を表示します。
          </p>
        ) : selectedItems.length === 0 ? (
          <p className="mt-3 rounded-2xl bg-sage-soft/30 px-4 py-3 text-sm leading-7 text-ink-muted">
            この日の確認済み予定はありません。
          </p>
        ) : (
          <ul className="mt-4 space-y-4" aria-label={`${formatSelectedDate(selectedDate)}の確認済み予定`}>
            {selectedItems.map((item) => (
              <SupportScheduleItemCard key={item.key} item={item} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
