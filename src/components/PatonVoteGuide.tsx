import { campusGirlsPatonPortraitImage } from "../data/campusGirlsPatonImages";
import { campusGirlsPatonVoteLink, links } from "../data/links";
import {
  PATON_VOTE_HOW_TO_ANCHOR_ID,
  PATON_VOTE_HOW_TO_SOURCE_LABEL,
  PATON_VOTE_HOW_TO_X_URL,
  patonVoteHowToSpokenMessage,
  patonVoteHowToSteps,
} from "../data/patonVoteHowTo";
import { supportEvents } from "../data/supportEvents";
import { SECTION_ANCHOR_OFFSET } from "../lib/navigation";
import { isSupportEventUrlActive } from "../lib/supportEventLinks";
import { useSupportEventClock } from "../lib/useSupportEventClock";
import { ExternalLink } from "./ExternalLink";
import { NewsImage } from "./NewsImage";

/**
 * CAMPUS GIRLS 2027 予選A FinalSTAGE の投票手順。
 * 期間中だけホームと Support に出し、終了後は NEWS 履歴へ残す。
 */
export function PatonVoteGuide() {
  const now = useSupportEventClock();
  const active = isSupportEventUrlActive({
    url: campusGirlsPatonVoteLink.url,
    links,
    supportEvents,
    now,
  });

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

        <div className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:items-start">
          <NewsImage
            media={campusGirlsPatonPortraitImage}
            className="mx-auto h-auto w-full max-w-[11rem] rounded-2xl bg-paper-card object-contain"
          />
          <ol className="space-y-3">
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
        </div>

        <p className="mt-4 text-sm leading-6 text-ink-muted">
          下の投票ボタンから三橋莉子（みりぃ）のページが直接開きます。あとは右下のギフトから、1日1回無料拍手を送ると投票完了です。
        </p>

        <blockquote className="mt-4 rounded-2xl bg-paper-card/80 px-4 py-3">
          <p className="text-xs font-medium text-apricot-ink">みりぃの案内</p>
          <p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-ink">
            {patonVoteHowToSpokenMessage}
          </p>
        </blockquote>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <ExternalLink
            href={campusGirlsPatonVoteLink.url}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
          >
            {campusGirlsPatonVoteLink.label}
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
