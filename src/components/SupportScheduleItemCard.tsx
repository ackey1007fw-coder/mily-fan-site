import { activities } from "../data/activities";
import { activityRouteForSupport } from "../lib/supportHub";
import {
  formatShortTokyoDate,
  formatShortTokyoEndDate,
  isCrossDayTimedItem,
  isTimeUnconfirmedDateSpan,
  scheduleTimeLabel,
  type ScheduleItem,
} from "../lib/supportCalendar";
import { ExternalLink } from "./ExternalLink";

const primaryCta =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep";
const secondaryCta =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-sage/25 bg-paper px-4 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft";

function scheduleActivityLabel(item: ScheduleItem): string | null {
  if (item.activityId === null) return null;
  return activities.find(({ id }) => id === item.activityId)?.label ?? null;
}

export function SupportScheduleItemCard({ item }: { item: ScheduleItem }) {
  const activityLabel = scheduleActivityLabel(item);

  return (
    <li className="min-w-0 rounded-3xl border border-sage/15 bg-paper-card p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="rounded-full bg-sage-soft px-3 py-1 text-sage-deep">
          {scheduleTimeLabel(item)}
        </span>
        {activityLabel ? <span className="text-ink-muted">{activityLabel}</span> : null}
      </div>
      <p className="mt-3 break-words text-lg font-bold leading-relaxed text-ink">
        {item.title}
      </p>
      {item.allDay && item.span && item.span.start !== item.span.end ? (
        <p className="mt-2 text-xs leading-6 text-ink-muted">
          期間 {item.span.start.replace(/-/g, ".")}〜{item.span.end.replace(/-/g, ".")}
        </p>
      ) : null}
      {isCrossDayTimedItem(item) && item.endDate !== null ? (
        <p className="mt-2 text-xs leading-6 text-ink-muted">
          期間 {formatShortTokyoDate(item.date)} {item.startTime}〜
          {formatShortTokyoEndDate(item.date, item.endDate)}
          {item.endTime !== null ? ` ${item.endTime}` : ""}（日をまたぎます）
        </p>
      ) : null}
      {isTimeUnconfirmedDateSpan(item) && item.endDate !== null ? (
        <p className="mt-2 text-xs leading-6 text-ink-muted">
          期間 {formatShortTokyoDate(item.date)}〜
          {formatShortTokyoEndDate(item.date, item.endDate)}
          {item.endTime !== null ? ` ${item.endTime}` : ""}
        </p>
      ) : null}
      {item.note ? (
        <p className="mt-2 break-words text-xs leading-6 text-ink-muted">{item.note}</p>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-2">
        {item.cta ? (
          <ExternalLink href={item.cta.url} className={primaryCta}>
            {item.cta.label}
          </ExternalLink>
        ) : null}
        {item.activityId !== null ? (
          <a href={activityRouteForSupport(item.activityId)} className={secondaryCta}>
            活動の詳細を見る
          </a>
        ) : null}
      </div>
      {item.source ? (
        <p className="mt-4 break-words text-xs">
          <ExternalLink href={item.source} className="font-semibold text-sage hover:underline">
            予定の出典を見る
          </ExternalLink>
        </p>
      ) : null}
    </li>
  );
}
