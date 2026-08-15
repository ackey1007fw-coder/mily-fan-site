import { useEffect, useState } from "react";
import {
  streamSchedule,
  upcomingSlots,
  type StreamSlot,
} from "../data/streamSchedule";
import { ExternalLink } from "./ExternalLink";

const ENTRY_URL = "https://2026.misscircle.jp/entry/734";

const dateFmt = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  month: "numeric",
  day: "numeric",
  weekday: "short",
});

function todayKey(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(
    new Date(),
  );
}

type ScheduleResponse = {
  slots?: StreamSlot[];
  source?: { roomUrl?: string | null };
};

export function StreamSchedule() {
  const [autoSlots, setAutoSlots] = useState<StreamSlot[]>([]);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/mily-schedule")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ScheduleResponse | null) => {
        if (!active || !data) return;
        if (Array.isArray(data.slots)) setAutoSlots(data.slots);
        const url = data.source?.roomUrl;
        if (
          typeof url === "string" &&
          url.startsWith("https://www.showroom-live.com/")
        ) {
          setRoomUrl(url);
        }
      })
      .catch(() => {
        // 自動取得に失敗しても手入力リストだけで表示する（画面は壊さない）
      });
    return () => {
      active = false;
    };
  }, []);

  const slots = upcomingSlots(streamSchedule, autoSlots);

  if (slots.length === 0) {
    return null;
  }

  const today = todayKey();

  return (
    <section id="stream" className="scroll-mt-24 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-ink">配信予定</h2>
        <p className="mt-2 text-sm text-ink-muted">みりぃさんの次の配信。</p>
        <ul className="mt-6 space-y-3">
          {slots.map((slot, index) => {
            const start = new Date(`${slot.date}T${slot.time}:00+09:00`);
            const isToday = slot.date === today;
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
                    {dateFmt.format(start)}
                  </span>
                  {isToday ? (
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
            href={ENTRY_URL}
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
