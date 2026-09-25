import {
  blackoutDay,
  blackoutPeriodState,
  formatClockRange,
  outsideNgRanges,
  STREAM_BLACKOUT_CAUTION,
  streamBlackoutDays,
  streamBlackoutSource,
  type ClockRange,
} from "../data/streamBlackouts";
import { tokyoDateKey } from "../lib/monthCalendar";
import { SECTION_ANCHOR_OFFSET } from "../lib/navigation";
import { useTokyoNow } from "../lib/useTokyoNow";

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo", month: "numeric", day: "numeric", weekday: "short",
});
const dateLabel = (date: string) => dateFormatter.format(new Date(`${date}T00:00:00+09:00`));

function RangeList({ ranges }: { ranges: readonly ClockRange[] }) {
  return <>{ranges.map((range, index) => (
    <span key={`${range[0]}-${range[1]}`} className="inline-block">
      {index > 0 ? " ／ " : ""}{formatClockRange(range)}
    </span>
  ))}</>;
}

/** NG時間は専用の案内。実配信の判定・API・予定カレンダーには渡さない。 */
export function StreamBlackoutNotice({ compact = false }: { compact?: boolean }) {
  const today = tokyoDateKey(useTokyoNow());
  const phase = blackoutPeriodState(today);
  const currentDay = blackoutDay(today);
  if (compact && phase === "ended") return null;

  if (compact) {
    return (
      <section id="stream-ng-summary" aria-labelledby="stream-ng-summary-title" className="px-4 py-4">
        <div className="mx-auto max-w-3xl rounded-3xl border border-apricot/40 bg-apricot-soft/30 p-5 sm:p-6">
          <p className="text-xs font-semibold text-apricot-ink">配信を待つ前に</p>
          <h2 id="stream-ng-summary-title" className="mt-2 text-xl font-bold text-ink">
            配信NG時間のお知らせ
          </h2>
          <p className="mt-2 text-sm text-ink-muted">{streamBlackoutSource.periodLabel}・日本時間</p>
          {currentDay ? (
            <dl className="mt-4 space-y-2 text-sm leading-7">
              <div><dt className="font-semibold text-ink">今日のNG時間</dt><dd><RangeList ranges={currentDay.ng} /></dd></div>
              <div><dt className="font-semibold text-sage-deep">NG時間外（配信未定）</dt><dd><RangeList ranges={outsideNgRanges(currentDay.ng)} /></dd></div>
            </dl>
          ) : null}
          <p className="mt-3 text-xs leading-6 text-ink-muted">NG時間外でも配信確定ではありません。</p>
          <a href="/support/#stream-ng" className="mt-4 inline-flex min-h-11 items-center rounded-full border border-sage/30 bg-paper-card px-5 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft">
            7日分のNG時間と時間外の目安を見る
          </a>
        </div>
      </section>
    );
  }

  const rows = (
    <ol className="mt-5 space-y-3" aria-label="日付別の配信NG時間">
      {streamBlackoutDays.map((day) => (
        <li key={day.date} data-ng-date={day.date} className="min-w-0 rounded-2xl border border-sage/20 bg-paper-card p-4 sm:p-5">
          <h3 className="flex flex-wrap items-center gap-2 text-base font-bold text-ink">
            <time dateTime={day.date}>{dateLabel(day.date)}</time>
            {day.date === today ? <span className="rounded-full bg-sage px-2 py-0.5 text-xs text-white">本日</span> : null}
            {day.date < today ? <span className="text-xs font-normal text-ink-muted">過去の案内</span> : null}
          </h3>
          <dl className="mt-3 grid gap-3 text-sm leading-7 sm:grid-cols-2">
            <div className="min-w-0"><dt className="font-semibold text-apricot-ink">配信NG時間</dt><dd><RangeList ranges={day.ng} /></dd></div>
            <div className="min-w-0"><dt className="font-semibold text-sage-deep">NG時間外（配信未定）</dt><dd><RangeList ranges={outsideNgRanges(day.ng)} /></dd></div>
          </dl>
        </li>
      ))}
    </ol>
  );

  return (
    <section id="stream-ng" aria-labelledby="stream-ng-title" className={`${SECTION_ANCHOR_OFFSET} px-4 py-8 sm:py-10`}>
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold tracking-wide text-apricot-ink">配信のお知らせ</p>
        <h2 id="stream-ng-title" className="mt-2 text-2xl font-bold text-ink">配信NG時間と時間外の目安</h2>
        <p className="mt-3 text-sm font-semibold text-ink">{streamBlackoutSource.periodLabel}（2026年・日本時間）</p>
        <p className="mt-4 rounded-2xl border border-apricot/40 bg-apricot-soft/30 p-4 text-sm leading-7 text-ink" data-testid="stream-ng-caution">
          {STREAM_BLACKOUT_CAUTION}
        </p>
        <p className="mt-3 text-xs leading-6 text-ink-muted">
          「NG時間外」は1日の0:00〜24:00から掲示されたNG時間を除いた目安です。確定した配信予定や、放送番組の休止・出演予定を示すものではありません。
        </p>
        {phase === "ended" ? (
          <details className="mt-5 rounded-2xl border border-sage/20 p-4">
            <summary className="min-h-11 cursor-pointer py-2 font-semibold text-ink">期間終了：9/26〜10/2の掲示を見る</summary>
            <p className="mt-2 text-sm text-ink-muted">この案内の対象期間は終了しました。10/3以降のNG時間は、この掲示では分かりません。</p>
            {rows}
          </details>
        ) : rows}
        <p className="mt-4 text-xs leading-6 text-ink-muted">出典：{streamBlackoutSource.label}。確認日：{streamBlackoutSource.verifiedAt}。掲示時刻は未確認です。</p>
      </div>
    </section>
  );
}
