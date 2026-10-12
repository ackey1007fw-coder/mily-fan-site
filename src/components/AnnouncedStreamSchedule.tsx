import { fourthRoundStreamSchedule, fourthRoundScheduleNewsImage, FOURTH_ROUND_SCHEDULE_X_URL, OCTOBER_8_SCHEDULE_X_URL, OCTOBER_12_FINAL_STREAM_SOURCE } from "../data/fourthRoundStreamSchedule";
import { X_FINAL_DAY_PEACE_POST_URL } from "../data/xFinalDayPeaceVideo";
import { missCircleFourthRoundWebVoteLink, missCircleFourthRoundShowroomEventLink } from "../data/links";
import { finalStreamAnnouncement } from "../lib/finalStreamAnnouncement";
import { upcomingSlots } from "../data/streamSchedule";
import { formatSlotDate, useStreamSchedule } from "../lib/useStreamSchedule";
import { confirmedShowroomAction } from "../lib/homeToday";
import { useSupportEventClock } from "../lib/useSupportEventClock";
import { NewsImage } from "./NewsImage";
import { ExternalLink } from "./ExternalLink";

export function AnnouncedStreamSchedule({ showSupportLink = true }: { showSupportLink?: boolean }) {
  const now = useSupportEventClock();
  const schedule = useStreamSchedule();
  const { roomUrl } = schedule;
  const showroomUrl = roomUrl ?? confirmedShowroomAction()?.url;
  const finalSlot = finalStreamAnnouncement(schedule, now);
  const slots = upcomingSlots(fourthRoundStreamSchedule.filter(slot => slot.date !== "2026-10-12"), [], now);
  if (finalSlot) slots.push(finalSlot);
  const hasFinalSlot = finalSlot !== null;
  const hasPosterSlots = slots.some(slot => slot.date < "2026-10-08");
  const hasOctober8Slots = slots.some(slot => slot.date === "2026-10-08");
  if (slots.length === 0) return null;
  return (
    <section id="announced-stream" className="scroll-mt-24 px-4 py-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-sage/20 bg-paper-card p-5 shadow-card sm:p-6">
        <h2 className="text-xl font-bold text-ink">{hasFinalSlot && slots.length === 1 ? "10月12日・四次審査の最終配信予定" : "四次審査・本人告知の配信予定"}</h2>
        <p className="mt-2 text-sm leading-7 text-ink-muted">本人X・配信内の告知に基づく予定（2026年・JST）で、実配信の記録ではありません。変更は本人の最新X・SHOWROOMをご確認ください。</p>
        {hasFinalSlot ? <>
          <p className="mt-2 text-sm leading-7 text-ink-muted">10月12日朝に21:00〜21:59を最終枠として案内。開始が少し早まる可能性があります。最新の登録予定がある場合は、下の開始時刻に優先して表示します。</p>
          <p className="mt-2 font-semibold leading-7 text-sage-deep">SHOWROOM審査は10/12 21:59まで。WEB投票は10/12 23:59までです（JST）。</p>
        </> : null}
        {hasOctober8Slots ? <p className="mt-2 text-sm leading-7 text-ink-muted">10月8日00:38の本人告知。10月8日は1.2倍DAYと案内されています。</p> : null}
        {hasPosterSlots ? <>
          <p className="mt-2 text-sm leading-7 text-ink-muted">10月3日〜7日は10月2日の本人告知画像に基づく予定です。</p>
          <NewsImage media={fourthRoundScheduleNewsImage} className="mt-4 h-auto w-full rounded-xl object-contain" />
          <p className="mt-2 text-xs text-ink-muted">画像をタップすると原寸で開きます。画像内の文字は下の予定一覧でも読めます。</p>
        </> : null}
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {slots.map(slot => <li key={`${slot.date}-${slot.time}`} className="rounded-xl bg-sage-soft/50 px-4 py-3">
            <span className="font-semibold text-ink">{formatSlotDate(slot)} {slot.endTime ? `${slot.time}〜${slot.endTime}` : `${slot.time}開始予定`}</span>
            {slot.note ? <p className="mt-1 text-sm text-ink-muted">{slot.note}</p> : null}
          </li>)}
        </ul>
        <p className="mt-3 text-xs leading-6 text-ink-muted">終了予定時刻を過ぎた枠は一覧から外れます。実際の配信開始はSHOWROOMでご確認ください。</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {hasFinalSlot ? <>
            <a href={OCTOBER_12_FINAL_STREAM_SOURCE} className="inline-flex min-h-11 items-center rounded-full border border-sage/30 px-4 py-2 text-sm font-semibold text-sage-deep">10月12日朝の本人案内を読む</a>
            <ExternalLink href={X_FINAL_DAY_PEACE_POST_URL} className="inline-flex min-h-11 items-center rounded-full border border-sage/30 px-4 py-2 text-sm font-semibold text-sage-deep">本人Xの最終日告知を見る</ExternalLink>
            <ExternalLink href={missCircleFourthRoundWebVoteLink.url} className="inline-flex min-h-11 items-center rounded-full border border-sage/30 px-4 py-2 text-sm font-semibold text-sage-deep">ENTRY 734にWEB投票する</ExternalLink>
            <ExternalLink href={missCircleFourthRoundShowroomEventLink.url} className="inline-flex min-h-11 items-center rounded-full border border-sage/30 px-4 py-2 text-sm font-semibold text-sage-deep">SHOWROOM審査の公式案内</ExternalLink>
          </> : null}
          {hasOctober8Slots ? <ExternalLink href={OCTOBER_8_SCHEDULE_X_URL} className="inline-flex min-h-11 items-center rounded-full border border-sage/30 px-4 py-2 text-sm font-semibold text-sage-deep">10月8日の本人X告知を見る</ExternalLink> : null}
          {hasPosterSlots ? <ExternalLink href={FOURTH_ROUND_SCHEDULE_X_URL} className="inline-flex min-h-11 items-center rounded-full border border-sage/30 px-4 py-2 text-sm font-semibold text-sage-deep">10月2日の本人X告知を見る</ExternalLink> : null}
          {showroomUrl ? <ExternalLink href={showroomUrl} className="inline-flex min-h-11 items-center rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white">みりぃのSHOWROOMへ</ExternalLink> : null}
          {showSupportLink ? <a href="/support/" className="inline-flex min-h-11 items-center rounded-full border border-sage/30 px-4 py-2 text-sm font-semibold text-sage-deep">投票・無料ギフト・イベント審査の案内</a> : null}
        </div>
      </div>
    </section>
  );
}
