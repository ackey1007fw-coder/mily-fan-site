import { fourthRoundStreamSchedule, fourthRoundScheduleNewsImage, fourthRoundScheduleChangeNotice, FOURTH_ROUND_SCHEDULE_X_URL } from "../data/fourthRoundStreamSchedule";
import { upcomingSlots } from "../data/streamSchedule";
import { formatSlotDate, useStreamSchedule } from "../lib/useStreamSchedule";
import { confirmedShowroomAction } from "../lib/homeToday";
import { useSupportEventClock } from "../lib/useSupportEventClock";
import { NewsImage } from "./NewsImage";
import { ExternalLink } from "./ExternalLink";

export function AnnouncedStreamSchedule() {
  const now = useSupportEventClock();
  const { roomUrl } = useStreamSchedule();
  const showroomUrl = roomUrl ?? confirmedShowroomAction()?.url;
  const slots = upcomingSlots(fourthRoundStreamSchedule, [], now);
  if (slots.length === 0) return null;
  return (
    <section id="announced-stream" className="scroll-mt-24 px-4 py-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-sage/20 bg-paper-card p-5 shadow-card sm:p-6">
        <h2 className="text-xl font-bold text-ink">四次審査・本人告知の配信予定</h2>
        <p className="mt-2 text-sm leading-7 text-ink-muted">10月3日〜7日の予定（2026年・JST）。10月2日の本人告知に基づく予定で、実配信の記録ではありません。変更は本人の最新Xをご確認ください。</p>
        <p className="mt-3 rounded-xl border border-sage/25 bg-sage-soft/60 px-4 py-3 text-sm leading-7 text-ink">
          {fourthRoundScheduleChangeNotice.message}{" "}
          <ExternalLink href={fourthRoundScheduleChangeNotice.sourceUrl} className="font-semibold text-sage-deep underline underline-offset-4">本人Xの変更案内を見る</ExternalLink>
        </p>
        <NewsImage media={fourthRoundScheduleNewsImage} className="mt-4 h-auto w-full rounded-xl object-contain" />
        <p className="mt-2 text-xs text-ink-muted">画像をタップすると原寸で開きます。画像内の文字は下の予定一覧でも読めます。</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {slots.map(slot => <li key={`${slot.date}-${slot.time}`} className="rounded-xl bg-sage-soft/50 px-4 py-3">
            <span className="font-semibold text-ink">{formatSlotDate(slot)} {slot.time}〜{slot.endTime}</span>
            {slot.note ? <p className="mt-1 text-sm text-ink-muted">{slot.note}</p> : null}
          </li>)}
        </ul>
        <p className="mt-3 text-xs leading-6 text-ink-muted">終了予定時刻を過ぎた枠は一覧から外れます。「きっかけ」は本人画像の表記です。10月8日の配信時刻はこの画像では未案内です。</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <ExternalLink href={FOURTH_ROUND_SCHEDULE_X_URL} className="inline-flex min-h-11 items-center rounded-full border border-sage/30 px-4 py-2 text-sm font-semibold text-sage-deep">本人Xの案内を見る</ExternalLink>
          {showroomUrl ? <ExternalLink href={showroomUrl} className="inline-flex min-h-11 items-center rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white">みりぃのSHOWROOMへ</ExternalLink> : null}
          <a href="/support/" className="inline-flex min-h-11 items-center rounded-full border border-sage/30 px-4 py-2 text-sm font-semibold text-sage-deep">投票・無料ギフト・イベント審査の案内</a>
        </div>
      </div>
    </section>
  );
}
