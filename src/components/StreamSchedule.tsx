import { contest } from "../data/contest";
import { SECTION_ANCHOR_OFFSET } from "../lib/navigation";
import {
  formatSlotDate,
  slotStatus,
  useStreamSchedule,
} from "../lib/useStreamSchedule";
import { ExternalLink } from "./ExternalLink";

export function StreamSchedule() {
  const { slots, roomUrl } = useStreamSchedule();

  if (slots.length === 0) {
    return null;
  }

  return (
    <section id="stream" className={`${SECTION_ANCHOR_OFFSET} px-4 py-10`}>
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-ink">配信予定</h2>
        <p className="mt-2 text-sm text-ink-muted">みりぃさんの次の配信。</p>
        <ul className="mt-6 space-y-3">
          {slots.map((slot, index) => {
            const status = slotStatus(slot);
            const isNext = index === 0;
            return (
              <li
                key={`${slot.date}-${slot.time}`}
                className={
                  isNext
                    ? "rounded-2xl border-2 border-sage/40 bg-sage-soft/60 p-5 shadow-card"
                    : "rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card"
                }
              >
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-lg font-bold text-ink">
                    {formatSlotDate(slot)}
                  </span>
                  {status === "past-start" ? (
                    <span className="rounded-full bg-apricot-ink px-2 py-0.5 text-xs font-semibold text-white">
                      開始時刻を過ぎています
                    </span>
                  ) : status === "today" ? (
                    <span className="rounded-full bg-sage px-2 py-0.5 text-xs font-semibold text-white">
                      本日
                    </span>
                  ) : null}
                  <span className="text-sm font-semibold text-sage-deep">
                    {slot.time}〜
                  </span>
                </p>
                {slot.note ? (
                  <p className="mt-1 text-sm text-ink-muted">{slot.note}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
        <p className="mt-4 flex flex-wrap gap-3">
          {roomUrl ? (
            <ExternalLink
              href={roomUrl}
              className="inline-flex min-h-11 items-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
            >
              SHOWROOMで見る
            </ExternalLink>
          ) : null}
          <ExternalLink
            href={contest.entryUrl}
            className="inline-flex min-h-11 items-center rounded-full border border-sage/30 bg-paper-card px-5 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft"
          >
            エントリーページで応援する
          </ExternalLink>
        </p>
        <p className="mt-4 text-xs leading-relaxed text-ink-muted">
          ※配信予定は変更になる場合があります。
        </p>
      </div>
    </section>
  );
}
