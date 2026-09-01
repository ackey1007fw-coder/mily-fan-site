import type { ReactNode } from "react";
import { ExternalLink } from "./components/ExternalLink";
import { Footer } from "./components/Footer";
import { MonthlyScheduleCalendar } from "./components/MonthlyScheduleCalendar";
import { PatonVoteGuide } from "./components/PatonVoteGuide";
import { SupportScheduleItemCard } from "./components/SupportScheduleItemCard";
import { contest } from "./data/contest";
import { events } from "./data/events";
import { supportEvents } from "./data/supportEvents";
import {
  activityRouteForSupport,
  selectSupportNow,
  selectSupportToday,
  type SupportAction,
} from "./lib/supportHub";
import {
  daysUntilEndOfNextTokyoMonth,
  tokyoDateKey,
} from "./lib/monthCalendar";
import {
  buildSupportCalendar,
  type SupportCalendarResult,
} from "./lib/supportCalendar";
import { useMilyRealtimeStatus } from "./lib/useMilyRealtimeStatus";
import { useSupportEventClock } from "./lib/useSupportEventClock";
import { useStreamSchedule } from "./lib/useStreamSchedule";
import { useTokyoNow } from "./lib/useTokyoNow";

const primaryCta =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep";
const secondaryCta =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-sage/25 bg-paper px-4 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft";

const agendaDateFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "short",
});

function formatAgendaDate(date: string): string {
  return agendaDateFormatter.format(new Date(`${date}T00:00:00+09:00`));
}

function SupportHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-sage/15 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <a href="/" className="font-semibold tracking-wide text-sage-deep">
          みりぃ ファンサイト
        </a>
        <nav aria-label="Supportページ内ナビゲーション" className="flex flex-wrap gap-2">
          <a href="/activities/" className={secondaryCta}>
            Activities
          </a>
          <a href="/" className={primaryCta}>
            ホームへ戻る
          </a>
        </nav>
      </div>
    </header>
  );
}

function SupportHero() {
  return (
    <section className="px-4 pb-8 pt-12 sm:pb-10 sm:pt-16">
      <div className="mx-auto max-w-3xl">
        <nav aria-label="パンくずリスト" className="text-xs text-ink-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li><a href="/" className="hover:text-sage-deep hover:underline">ホーム</a></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-sage-deep">Support</li>
          </ol>
        </nav>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">
          Support
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          みりぃを応援する
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
          今できる応援、今日の確認済み予定、日程発表待ちの活動をひとつに。
        </p>
        <p className="mt-3 text-xs leading-6 text-ink-muted">
          このページはファン運営の非公式ページです。本人運営ではありません。
        </p>
      </div>
    </section>
  );
}

function SectionShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function ActionLink({ action }: { action: SupportAction }) {
  return (
    <ExternalLink href={action.url} className={primaryCta}>
      {action.label}
    </ExternalLink>
  );
}

function ActivityLink({ activityId }: { activityId: Parameters<typeof activityRouteForSupport>[0] }) {
  return (
    <a href={activityRouteForSupport(activityId)} className={secondaryCta}>
      活動の詳細を見る
    </a>
  );
}

function SupportCalendarAgenda({
  calendar,
  today,
}: {
  calendar: SupportCalendarResult;
  today: string;
}) {
  return (
    <SectionShell eyebrow="Calendar" title="みりぃスケジュール">
      <p className="mt-4 text-sm leading-7 text-ink-muted">
        配信・ラジオ・コンテスト・出演など、確認済みの予定をまとめています。
      </p>
      {/*
        loading → unavailable は非同期に変わるため、availability feedbackだけを
        politeなstatus regionにする。agenda本体は含めない（Calendar全体をlive region化しない）。
        `ok` では何も描画せず、成功のたびに読み上げを増やさない。
      */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="min-w-0"
        data-testid="schedule-availability-status"
      >
        {calendar.availability.showroomSchedule === "loading" ? (
          <p className="mt-4 rounded-2xl bg-sage-soft/35 px-4 py-3 text-sm text-ink-muted">
            SHOWROOMの配信予定を確認しています。
          </p>
        ) : null}
        {calendar.availability.showroomSchedule === "unavailable" ? (
          <p className="mt-4 rounded-2xl border border-apricot/40 bg-apricot-soft/35 px-4 py-3 text-sm leading-6 text-ink-muted">
            SHOWROOMの配信予定を取得できませんでした。ほかの確認済み日程は引き続き表示しています。
          </p>
        ) : null}
      </div>
      <MonthlyScheduleCalendar calendar={calendar} today={today} />
      <div className="mt-10 border-t border-sage/15 pt-8">
        <h3 className="text-xl font-bold text-ink sm:text-2xl">確認済み予定一覧</h3>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          Asia/Tokyoの日付順で、予定の詳細を確認できます。
        </p>
        {calendar.days.length > 0 ? (
          <ol className="mt-6 space-y-8" aria-label="確認済み予定の日付別一覧">
            {calendar.days.map((day) => (
              <li key={day.date} className="min-w-0">
                <h3 className="border-b border-sage/20 pb-3 text-lg font-bold text-sage-deep sm:text-xl">
                  <time dateTime={day.date}>{formatAgendaDate(day.date)}</time>
                </h3>
                <ul className="mt-4 space-y-4">
                  {day.items.map((item) => (
                    <SupportScheduleItemCard key={item.key} item={item} />
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </SectionShell>
  );
}

export default function SupportPage() {
  const { live, radio, schedulePhase } = useMilyRealtimeStatus();
  const { slots, manualSlots, roomUrl, availability } = useStreamSchedule();
  // Paton CTAなどの開始・終了境界で再renderし、そのrender時点の現在時刻を使う。
  useSupportEventClock();
  const calendarClock = useTokyoNow();
  const today = tokyoDateKey(calendarClock);
  const now = Date.now();
  // radio adapter は now のJST当月1日から、この daysAhead 先まで番組枠を展開する。
  const radioOccurrenceDaysAhead = daysUntilEndOfNextTokyoMonth(now);
  const todayItems = selectSupportToday({
    contest,
    streamSlots: slots,
    streamRoomUrl: roomUrl,
    liveRoomUrl: live.roomUrl,
    radioPhase: schedulePhase,
    now,
  });
  const nowItems = selectSupportNow({ supportEvents, live, radio, now });
  const calendar = buildSupportCalendar({
    contest,
    supportEvents,
    fanEvents: events,
    streamSlots: slots,
    manualStreamSlots: manualSlots,
    streamAvailability: availability,
    includeRadio: true,
    now,
    daysAhead: radioOccurrenceDaysAhead,
  });
  const pendingItems = calendar.pending;

  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <a
        href="#support-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-sage focus:px-4 focus:py-2 focus:text-white"
      >
        本文へスキップ
      </a>
      <SupportHeader />
      <main id="support-main">
        <SupportHero />
        <PatonVoteGuide />

        {todayItems.length > 0 ? (
          <SectionShell eyebrow="Today" title="今日のみりぃ">
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {todayItems.map((item) => (
                <li key={item.key} className="rounded-3xl border border-sage/15 bg-paper-card p-5 shadow-card sm:p-6">
                  <p className="text-xs font-semibold text-sage-deep">{item.label}</p>
                  <p className="mt-2 text-xl font-bold leading-relaxed text-ink">{item.value}</p>
                  {item.note ? (
                    <p className="mt-2 whitespace-pre-line text-xs leading-6 text-ink-muted">
                      {item.note}
                    </p>
                  ) : null}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.cta ? <ActionLink action={item.cta} /> : null}
                    <ActivityLink activityId={item.activityId} />
                  </div>
                  {item.source ? (
                    <p className="mt-4 text-xs">
                      <ExternalLink href={item.source} className="font-semibold text-sage hover:underline">
                        確認済み情報の出典を見る
                      </ExternalLink>
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </SectionShell>
        ) : null}

        <div role="status" aria-live="polite" aria-atomic="true">
          {nowItems.length > 0 ? (
            <SectionShell eyebrow="Now" title="NOW — 応援中">
              <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {nowItems.map((item) => (
                  <li key={item.key} className="rounded-3xl border border-apricot/50 bg-apricot-soft/40 p-5 shadow-card sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-apricot-ink">現在進行中を確認</p>
                    <p className="mt-2 text-xl font-bold leading-relaxed text-ink">{item.title}</p>
                    {item.note ? (
                    <p className="mt-2 whitespace-pre-line text-xs leading-6 text-ink-muted">
                      {item.note}
                    </p>
                  ) : null}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.cta ? <ActionLink action={item.cta} /> : null}
                      <ActivityLink activityId={item.activityId} />
                    </div>
                    {item.source ? (
                      <p className="mt-4 text-xs">
                        <ExternalLink href={item.source} className="font-semibold text-sage hover:underline">
                          出典を見る
                        </ExternalLink>
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </SectionShell>
          ) : null}
        </div>

        <SupportCalendarAgenda calendar={calendar} today={today} />

        {pendingItems.length > 0 ? (
          <SectionShell eyebrow="Date pending" title="日程発表待ち">
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pendingItems.map((item) => (
                <li key={item.key} className="rounded-3xl border border-sage/15 bg-sage-soft/35 p-5 shadow-card sm:p-6">
                  <p className="text-xs font-semibold text-sage-deep">日程発表待ち</p>
                  <p className="mt-2 text-xl font-bold leading-relaxed text-ink">{item.title}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.cta ? <ActionLink action={item.cta} /> : null}
                    <ActivityLink activityId={item.activityId} />
                  </div>
                  <p className="mt-4 text-xs">
                    <ExternalLink href={item.source} className="font-semibold text-sage hover:underline">
                      {item.key === "contest:current-phase"
                        ? "審査段階の出典を見る"
                        : "確認済み情報の出典を見る"}
                    </ExternalLink>
                  </p>
                </li>
              ))}
            </ul>
          </SectionShell>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
