import { contest } from "../data/contest";
import { providedVoteVideo } from "../data/providedVoteVideo";
import { missCircleFourthRoundWebVoteLink } from "../data/links";
import { missCircleFourthRoundWebVote } from "../data/supportEvents";
import { displayStatus } from "../lib/supportCalendar";
import { useSupportEventClock } from "../lib/useSupportEventClock";
import { ExternalLink } from "./ExternalLink";

/** The video archive stays available after the voting window closes. */
export function ProvidedVoteSupportVideo() {
  const now = useSupportEventClock();
  const status = displayStatus(missCircleFourthRoundWebVote.schedule, now);
  if (!providedVoteVideo.published) return null;

  return (
    <section id="vote-support-video" aria-labelledby="vote-support-video-heading" className="scroll-mt-24 px-4 py-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-sage/20 bg-paper-card p-5 shadow-card sm:p-8">
        <h2 id="vote-support-video-heading" className="mb-4 text-2xl font-bold text-ink">みりぃからの投票応援動画</h2>
        <figure>
          <video src={providedVoteVideo.src} poster={providedVoteVideo.poster} width={providedVoteVideo.width} height={providedVoteVideo.height} controls playsInline preload="none" aria-label={providedVoteVideo.alt} aria-describedby="vote-support-video-description" className="mx-auto max-h-[72vh] w-full max-w-sm rounded-xl bg-sage-soft object-contain">
            動画を再生できない場合は、<a href={providedVoteVideo.src} className="underline">投票応援動画を開く</a>。
          </video>
          <figcaption id="vote-support-video-description" className="mt-3 text-xs leading-6 text-ink-muted">
            オーナー提供の動画（5秒・音声なし）。撮影・投稿日時は未確認です。動画内の「3日目」は投稿時点の文言で、現在の日程を示すものではありません。動画内のリンク表示はタップできません。現在の投票案内は下の公式リンクからご確認ください。
          </figcaption>
        </figure>
        {status === "live" ? (
          <ExternalLink href={missCircleFourthRoundWebVoteLink.url} className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white">三橋莉子にWEB投票する（公式）</ExternalLink>
        ) : (
          <div className="mt-4">
            <p className="text-sm leading-7 text-ink-muted">{status === "ended" ? "四次審査のWEB投票期間は終了しました。最新の案内は公式ページをご確認ください。" : "投票の受付期間・最新の案内は公式ページをご確認ください。"}</p>
            <ExternalLink href={contest.entryUrl} className="mt-2 inline-flex min-h-11 items-center font-semibold text-sage-deep underline">ENTRY 734・公式ページを見る</ExternalLink>
          </div>
        )}
      </div>
    </section>
  );
}
