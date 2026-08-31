import { useEffect } from "react";
import {
  CAMPUS_GIRLS_FINAL_STAGE_INSTAGRAM_CTA_LABEL,
  CAMPUS_GIRLS_FINAL_STAGE_INSTAGRAM_PROFILE_URL,
  campusGirlsFinalStageDetailsStoryImage,
  campusGirlsFinalStageRankingStoryVideos,
} from "../data/campusGirlsFinalStageStorySeries";
import { campusGirlsPatonVoteLink, links } from "../data/links";
import {
  PATON_VOTE_HOW_TO_ANCHOR_ID,
  PATON_VOTE_HOW_TO_SOURCE_LABEL,
  PATON_VOTE_HOW_TO_X_URL,
  patonVoteHowToSpokenMessage,
  patonVoteHowToSteps,
} from "../data/patonVoteHowTo";
import { patonVoteDay3StoryVideo } from "../data/patonVoteDay3StoryVideo";
import { supportEvents } from "../data/supportEvents";
import { SECTION_ANCHOR_OFFSET } from "../lib/navigation";
import { isSupportEventUrlActive } from "../lib/supportEventLinks";
import { useSupportEventClock } from "../lib/useSupportEventClock";
import { ExternalLink } from "./ExternalLink";

/**
 * CAMPUS GIRLS 2027 予選A FinalSTAGE の投票手順。
 * 期間中だけホームと Support に出し、終了後は NEWS 履歴へ残す。
 * 既存の本人写真は流用せず、オーナー提供の8/28 Instagram Storyだけを表示する。
 * Storyのリンクステッカーの代わりに、HOME / Support の確認済み投票CTAへつなぐ。
 * 期間中の Paton ボタン自体は NOW / Hero 側の1件に任せ、ここでは重ねない。
 */
export function PatonVoteGuide() {
  const now = useSupportEventClock();
  const active = isSupportEventUrlActive({
    url: campusGirlsPatonVoteLink.url,
    links,
    supportEvents,
    now,
  });

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    const scrollToGuide = () => {
      if (window.location.hash !== `#${PATON_VOTE_HOW_TO_ANCHOR_ID}`) return;

      if (frame !== 0) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        document.getElementById(PATON_VOTE_HOW_TO_ANCHOR_ID)?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
          block: "start",
        });
      });
    };

    scrollToGuide();
    window.addEventListener("hashchange", scrollToGuide);
    return () => {
      window.removeEventListener("hashchange", scrollToGuide);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [active]);

  if (!active) return null;

  return (
    <section
      id={PATON_VOTE_HOW_TO_ANCHOR_ID}
      className={`${SECTION_ANCHOR_OFFSET} px-4 py-6`}
    >
      <div className="mx-auto max-w-3xl rounded-3xl border border-apricot/50 bg-apricot-soft/40 p-5 shadow-card sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-apricot-ink">
          CAMPUS GIRLS 2027
        </p>
        <h2 className="mt-2 text-2xl font-bold text-ink">パトン投票のやり方</h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          みりぃがXで案内した、CAMPUS GIRLS 2027 予選ファイナルの投票方法です。
          投票期間は9月1日23:59まで。投票にはPatonへのログインが必要です。
        </p>

        <figure className="mt-5 overflow-hidden rounded-2xl border border-apricot/40 bg-paper-card/80">
          <video
            aria-label={patonVoteDay3StoryVideo.alt}
            className="mx-auto block max-h-[36rem] w-full bg-black object-contain"
            controls
            height={patonVoteDay3StoryVideo.height}
            playsInline
            preload="none"
            poster={patonVoteDay3StoryVideo.poster}
            width={patonVoteDay3StoryVideo.width}
          >
            <source src={patonVoteDay3StoryVideo.src} type="video/mp4" />
          </video>
          <figcaption className="px-4 py-3">
            <p className="text-xs font-medium text-apricot-ink">
              {patonVoteDay3StoryVideo.sourceLabel} · 8/28のInstagram Story
            </p>
            <p className="mt-1 text-sm font-semibold leading-6 text-ink">
              パトン投票3日目はここから❣️
            </p>
            <p className="mt-1 text-xs leading-5 text-ink-muted">
              Story内のリンクはサイト上では押せないため、下の「今日のみりぃ」または
              Support の投票ボタンから直接みりぃのページへ進めます。
            </p>
          </figcaption>
        </figure>

        <div className="mt-6 rounded-2xl border border-apricot/40 bg-paper-card/80 p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-apricot-ink">
            CAMPUS GIRLS 2027 予選Final STAGEのStory
          </p>
          <h3 className="mt-2 text-xl font-bold text-ink">
            審査の詳細と投稿時点の記録
          </h3>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            順位は2026年8月28日のStory投稿時点の記録です。現在の順位を示すものではありません。
          </p>

          <figure className="mt-4 overflow-hidden rounded-2xl border border-apricot/30 bg-paper">
            <img
              alt={campusGirlsFinalStageDetailsStoryImage.alt}
              className="mx-auto block h-auto w-full object-contain"
              decoding="async"
              height={campusGirlsFinalStageDetailsStoryImage.height}
              loading="lazy"
              src={campusGirlsFinalStageDetailsStoryImage.src}
              width={campusGirlsFinalStageDetailsStoryImage.width}
            />
            <figcaption className="px-4 py-3">
              <p className="text-sm font-semibold leading-6 text-ink">
                {campusGirlsFinalStageDetailsStoryImage.title}
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                {campusGirlsFinalStageDetailsStoryImage.sourceLabel} ·
                2026年8月28日
              </p>
            </figcaption>
          </figure>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {campusGirlsFinalStageRankingStoryVideos.map((item) => (
              <figure
                key={item.id}
                className="overflow-hidden rounded-2xl border border-apricot/30 bg-paper"
              >
                <video
                  aria-label={item.alt}
                  className="block h-auto w-full bg-black object-contain"
                  controls
                  height={item.height}
                  playsInline
                  poster={item.poster}
                  preload="none"
                  width={item.width}
                >
                  <source src={item.src} type="video/mp4" />
                </video>
                <figcaption className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-apricot-soft px-2.5 py-1 text-xs font-semibold text-apricot-ink">
                    {item.recordLabel}
                  </span>
                  <p className="mt-2 text-sm font-semibold leading-6 text-ink">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {item.sourceLabel} · 2026年8月28日
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <ol className="mt-5 space-y-3">
          {patonVoteHowToSteps.map((item) => (
            <li key={item.step} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-apricot text-sm font-bold text-white"
              >
                {item.step}
              </span>
              <p className="pt-0.5 text-sm font-semibold leading-6 text-ink">
                {item.text}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-4 text-sm leading-6 text-ink-muted">
          投票ボタンから三橋莉子（みりぃ）のページが直接開きます。あとは右下のギフトから、1日1回無料拍手を送ると投票完了です。
        </p>

        <blockquote className="mt-4 rounded-2xl bg-paper-card/80 px-4 py-3">
          <p className="text-xs font-medium text-apricot-ink">みりぃの案内</p>
          <p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-ink">
            {patonVoteHowToSpokenMessage}
          </p>
        </blockquote>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <ExternalLink
            href={CAMPUS_GIRLS_FINAL_STAGE_INSTAGRAM_PROFILE_URL}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-apricot px-5 py-2.5 text-sm font-semibold text-white hover:bg-apricot-ink"
          >
            {CAMPUS_GIRLS_FINAL_STAGE_INSTAGRAM_CTA_LABEL}
          </ExternalLink>
          <ExternalLink
            href={PATON_VOTE_HOW_TO_X_URL}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-sage/30 bg-paper px-5 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft"
          >
            {PATON_VOTE_HOW_TO_SOURCE_LABEL}
          </ExternalLink>
        </div>
      </div>
    </section>
  );
}
