import { fourthRoundStreamSchedule, fourthRoundScheduleNewsImage, FOURTH_ROUND_SCHEDULE_X_URL, OCTOBER_8_SCHEDULE_X_URL } from "../data/fourthRoundStreamSchedule";
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
  const hasPosterSlots = slots.some(slot => slot.date < "2026-10-08");
  const hasOctober8Slots = slots.some(slot => slot.date === "2026-10-08");
  if (slots.length === 0) return null;
  return (
    <section id="announced-stream" className="scroll-mt-24 px-4 py-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-sage/20 bg-paper-card p-5 shadow-card sm:p-6">
        <h2 className="text-xl font-bold text-ink">四次審査・本人告知の配信予定</h2>
        <p className="mt-2 text-sm leading-7 text-ink-muted">本人Xの告知に基づく予定（2026年・JST）で、実配信の記録ではありません。変更は本人の最新Xをご確認ください。</p>
        {hasOctober8Slots ? <p className="mt-2 text-sm leading-7 text-ink-muted">10月8日00:38の本人告知。10月8日は1.2倍DAYと案内されています。</p> : null}
        {hasPosterSlots ? <>
          <p className="mt-2 text-sm leading-7 text-ink-muted">10月3日〜7日は10月2日の本人告知画像に基づく予定です。</p>
          <NewsImage media={fourthRoundScheduleNewsImage} className="mt-4 h-auto w-full rounded-xl object-contain" />
          <p className="mt-2 text-xs text-ink-muted">画像をタップすると原寸で開きます。画像内の文字は下の予定一覧でも読めます。</p>
        </> : null}
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {slots.map(slot => <li key={`${slot.date}-${slot.time}`} className="rounded-xl bg-sage-soft/50 px-4 py-3">
            <span className="font-semibold text-ink">{formatSlotDate(slot)} {slot.time}〜{slot.endTime}</span>
            {slot.note ? <p className="mt-1 text-sm text-ink-muted">{slot.note}</p> : null}
          </li>)}
        </ul>
        <p className="mt-3 text-xs leading-6 text-ink-muted">終了予定時刻を過ぎた枠は一覧から外れます。実際の配信開始はSHOWROOMでご確認ください。</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {hasOctober8Slots ? <ExternalLink href={OCTOBER_8_SCHEDULE_X_URL} className="inline-flex min-h-11 items-center rounded-full border border-sage/30 px-4 py-2 text-sm font-semibold text-sage-deep">10月8日の本人X告知を見る</ExternalLink> : null}
          {hasPosterSlots ? <ExternalLink href={FOURTH_ROUND_SCHEDULE_X_URL} className="inline-flex min-h-11 items-center rounded-full border border-sage/30 px-4 py-2 text-sm font-semibold text-sage-deep">10月2日の本人X告知を見る</ExternalLink> : null}
          {showroomUrl ? <ExternalLink href={showroomUrl} className="inline-flex min-h-11 items-center rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white">みりぃのSHOWROOMへ</ExternalLink> : null}
          <a href="/support/" className="inline-flex min-h-11 items-center rounded-full border border-sage/30 px-4 py-2 text-sm font-semibold text-sage-deep">投票・無料ギフト・イベント審査の案内</a>
        </div>
      </div>
    </section>
  );
}

