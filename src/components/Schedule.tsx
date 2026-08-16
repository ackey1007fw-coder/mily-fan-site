import { events, groupEventsByYear, isUpcomingEvent } from "../data/events";
import { ExternalLink } from "./ExternalLink";

const kindLabel = {
  appearance: "出演",
  stream: "配信",
  event: "イベント",
  other: "その他",
} as const;

export function Schedule() {
  if (events.length === 0) {
    return null;
  }

  const grouped = groupEventsByYear(events);
  const upcoming = events.filter((item) => isUpcomingEvent(item));

  return (
    <section id="schedule" className="scroll-mt-24 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-ink">スケジュール</h2>
        <p className="mt-2 text-sm text-ink-muted">
          出演・配信・イベントの予定と記録。これからの予定は{upcoming.length}件。
        </p>
        <div className="mt-6 space-y-8">
          {grouped.map((group) => (
            <section key={group.year} aria-labelledby={`year-${group.year}`}>
              <h3
                id={`year-${group.year}`}
                className="text-lg font-semibold text-sage-deep"
              >
                {group.year}年
              </h3>
              <ul className="mt-3 space-y-3">
                {group.events.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card"
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-apricot-ink">
                      {kindLabel[item.kind]}
                    </p>
                    <p className="mt-1 font-semibold text-ink">{item.title}</p>
                    <p className="mt-1 text-sm text-ink-muted">
                      {item.startAt}
                      {item.endAt ? ` 〜 ${item.endAt}` : ""}
                      {item.venue ? ` / ${item.venue}` : ""}
                    </p>
                    {item.notes ? (
                      <p className="mt-2 text-sm text-ink-muted">{item.notes}</p>
                    ) : null}
                    <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                      <ExternalLink
                        href={item.source}
                        className="text-sm font-medium text-sage hover:underline"
                      >
                        出典を見る
                      </ExternalLink>
                      {item.url && item.url !== item.source ? (
                        <ExternalLink
                          href={item.url}
                          className="text-sm font-medium text-sage hover:underline"
                        >
                          詳細
                        </ExternalLink>
                      ) : null}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
