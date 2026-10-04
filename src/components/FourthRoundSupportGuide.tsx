import { contest } from "../data/contest";
import { providedVoteVideo } from "../data/providedVoteVideo";
import { missCircleFourthRoundShowroomEventLink, missCircleFourthRoundWebVoteLink } from "../data/links";
import { missCircleFourthRoundWebVote, missCircleFourthRoundShowroomReview, type SupportEventSchedule } from "../data/supportEvents";
import { useSupportEventClock } from "../lib/useSupportEventClock";
import { ExternalLink } from "./ExternalLink";

const dateTime = new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
function formatScheduleRange(schedule: SupportEventSchedule) {
  return schedule.state === "confirmed-period"
    ? `${dateTime.format(new Date(schedule.start))}〜${dateTime.format(new Date(schedule.end))}`
    : "公式案内をご確認ください";
}

export function FourthRoundSupportGuide() {
  const now = useSupportEventClock();
  const schedule = missCircleFourthRoundWebVote.schedule;
  if (schedule.state !== "confirmed-period" || now > Date.parse(schedule.end)) return null;

  return (
    <section id="fourth-round-guide" aria-labelledby="fourth-round-heading" className="scroll-mt-24 px-4 py-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-apricot/50 bg-paper-card p-5 shadow-card sm:p-8">
        <p className="text-xs font-semibold tracking-wide text-sage-deep">MISS CIRCLE CONTEST 2026 · ENTRY 734</p>
        <h2 id="fourth-round-heading" className="mt-2 text-2xl font-bold text-ink">四次審査の応援ガイド</h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">三橋莉子（みりぃ）を応援する、3つの審査。日程はすべて日本時間です。WEB投票とSHOWROOMは開始・締切時刻が異なります。</p>
        {providedVoteVideo.published ? (
          <figure id="vote-support-video" className="mt-6 scroll-mt-24 rounded-2xl border border-sage/20 bg-sage-soft/20 p-4">
            <h3 className="mb-3 text-lg font-bold text-ink">みりぃからの投票応援動画</h3>
            <video src={providedVoteVideo.src} poster={providedVoteVideo.poster} width={providedVoteVideo.width} height={providedVoteVideo.height} controls playsInline preload="none" aria-label={providedVoteVideo.alt} aria-describedby="vote-support-video-description" className="mx-auto max-h-[72vh] w-full max-w-sm rounded-xl bg-sage-soft object-contain">
              動画を再生できない場合は、<a href={providedVoteVideo.src} className="underline">投票応援動画を開く</a>。
            </video>
            <figcaption id="vote-support-video-description" className="mt-3 text-xs leading-6 text-ink-muted">
              オーナー提供の動画（5秒・音声なし）。撮影・投稿日時は未確認です。動画内の「3日目」は投稿時点の文言で、現在の日程を示すものではありません。動画内のリンク表示はタップできません。投票は下の公式ボタンから進めます。
            </figcaption>
            {now >= Date.parse(schedule.start) ? (
              <ExternalLink href={missCircleFourthRoundWebVoteLink.url} className="mt-3 inline-flex min-h-11 items-center justify-center rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white">三橋莉子にWEB投票する（公式）</ExternalLink>
            ) : (
              <ExternalLink href={contest.entryUrl} className="mt-3 inline-flex min-h-11 items-center font-semibold text-sage-deep underline">ENTRY 734・公式投票入口を見る</ExternalLink>
            )}
          </figure>
        ) : null}
        <ol className="mt-6 space-y-5">
          <li className="rounded-2xl bg-sage-soft/35 p-4">
            <h3 className="font-bold text-ink">1. WEB投票審査</h3>
            <p className="mt-2 text-sm font-semibold text-sage-deep">{formatScheduleRange(schedule)}</p>
            <p className="mt-2 text-sm leading-7 text-ink-muted">ENTRY 734の「WEB投票」からLINEログインへ進み、三橋莉子であることを確認してください。開始後はこのページ上部・ホームの投票ボタンから直接進めます。投票回数や手順は公式投票画面の案内に従ってください。</p>
            <ExternalLink href={contest.entryUrl} className="mt-3 inline-flex min-h-11 items-center font-semibold text-sage-deep underline">ENTRY 734・公式投票入口を見る</ExternalLink>
            <div id="web-vote-howto" className="mt-5 scroll-mt-24 border-t border-sage/20 pt-4">
              <h4 className="text-lg font-bold text-ink">WEB投票方法</h4>
              <p className="mt-2 text-sm leading-7 text-ink-muted">公式投票ページを開き、LINEログイン後に「三橋莉子・ENTRY 734」であることを確認して、画面の案内に従って投票してください。</p>
              <figure className="mt-4">
                <a href="/media/support/mily-b181-02-fourth-round-web-vote-howto.jpg" target="_blank" rel="noopener noreferrer" className="block" aria-label="本人提供の投票方法画像を原寸で開く（新しいタブ）">
                  <img src="/media/support/mily-b181-02-fourth-round-web-vote-howto.jpg" width={864} height={1536} loading="lazy" decoding="async" alt="本人提供のWEB投票方法。リンク先へ進み、WEB投票を選び、三橋莉子・ENTRY 734を確認して投票する手順。画像の回数・人数の記載は下の説明をご確認ください。" className="mx-auto h-auto w-full max-w-sm rounded-xl" />
                </a>
                <figcaption className="mt-2 text-xs leading-6 text-ink-muted">本人提供の案内画像。タップすると原寸で読めます。画像内の「ここをタップ」は、このページの「三橋莉子にWEB投票する（公式）」ボタンから進んでください。画像には「1日1回、12日（月）まで」「1人5名まで」と記載されていますが、主催者の現行ルールとして再確認できていません。回数・投票できる人数は公式投票画面をご確認ください。</figcaption>
              </figure>
              <figure className="mt-4">
                <video controls playsInline preload="metadata" width={512} height={910} poster="/media/support/mily-b181-01-fourth-round-web-vote-poster.jpg" aria-label="三橋莉子からのWEB投票応援案内（2秒・音声なし）" aria-describedby="web-vote-video-description" className="mx-auto h-auto w-full max-w-sm rounded-xl">
                  <source src="/media/support/mily-b181-01-fourth-round-web-vote.mp4" type="video/mp4" />
                  動画を再生できない場合は、<a href="/media/support/mily-b181-01-fourth-round-web-vote.mp4" className="underline">投票応援案内の動画を開く</a>。
                </video>
                <figcaption id="web-vote-video-description" className="mt-2 space-y-2 text-xs leading-6 text-ink-muted">
                  <p>本人からの応援案内（2秒・音声なし）。止めて読むことができます。動画内の「あと30分」は投稿時点の案内です。投票期間は上記の日程を、投票手順・回数は公式画面をご確認ください。</p>
                  <p>動画内の本人による案内（投稿時点）：12日まで毎日投票した方への特典は「コンプリートありがとう動画」。1人ずつ別の動画をプレゼントすると案内しています。コンプリート報告先は別日にXで案内し、Xを使っていない方はInstagramで送れば本人が確認するとのことです。毎日の報告も待っていると伝えています。これは主催者の公式投票ルールとは別の本人による案内です。</p>
                </figcaption>
              </figure>
              {now >= Date.parse(schedule.start) ? (
                <ExternalLink href={missCircleFourthRoundWebVoteLink.url} className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white">三橋莉子にWEB投票する（公式）</ExternalLink>
              ) : (
                <p className="mt-3 text-sm text-ink-muted">投票ボタンは受付開始後に表示します。</p>
              )}
            </div>
          </li>
          <li className="rounded-2xl bg-sage-soft/35 p-4">
            <h3 className="font-bold text-ink">2. SHOWROOM無料ギフト審査</h3>
            <p className="mt-2 text-sm font-semibold text-sage-deep">{formatScheduleRange(missCircleFourthRoundShowroomReview.schedule)}</p>
            <p className="mt-2 text-sm leading-7 text-ink-muted">主催者がイベント審査とは別に設けている審査項目です。みりぃの配信で応援し、対象となる無料ギフト・集計条件は公式案内を確認してください。有料ギフトがこの審査にも算入されるとは案内していません。</p>
          </li>
          <li className="rounded-2xl bg-apricot-soft/35 p-4">
            <h3 className="font-bold text-ink">3. SHOWROOMイベント審査</h3>
            <p className="mt-2 text-sm font-semibold text-sage-deep">{formatScheduleRange(missCircleFourthRoundShowroomReview.schedule)}</p>
            <p className="mt-2 text-sm leading-7 text-ink-muted">「超十代2027出演オーディション」のイベントポイント・ランキングによる審査です。ギフトには無料・有料があり、有料ギフトの購入・送信は任意です。送信前にギフトの種類と必要なShow Goldを確認してください。</p>
            <p className="mt-2 text-sm leading-7 text-ink-muted">10月3日・8日は各05:00〜23:59、獲得ポイントが1.2倍になるボーナス期間。加算は翌営業日までに行われ、期間ランキングには反映されません。無料ギフト審査にも倍率が適用されるとは確認できていません。</p>
          </li>
        </ol>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <ExternalLink href={contest.entryUrl} className="inline-flex min-h-11 items-center justify-center rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white">ENTRY 734から配信ルームへ</ExternalLink>
          <ExternalLink href={missCircleFourthRoundShowroomEventLink.url} className="inline-flex min-h-11 items-center justify-center rounded-full border border-sage/25 px-5 py-3 text-sm font-semibold text-sage-deep">四次イベントの公式ルール・特典</ExternalLink>
        </div>
        <p className="mt-4 text-xs leading-6 text-ink-muted">複数アカウントでの応援は禁止されています。イベント特典には順位・選出などの条件があります。最新の対象ギフト、ミッション、集計・特典条件は公式イベントページをご確認ください。</p>
        <p className="mt-3 text-xs leading-6 text-ink-muted">確認日：2026年10月1日 · 日程の出典：<ExternalLink href={missCircleFourthRoundWebVote.source} className="font-semibold text-sage-deep underline">主催者公式SCHEDULE</ExternalLink> · 非公式の応援案内です。</p>
      </div>
    </section>
  );
}
