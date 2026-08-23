import { contest } from "../data/contest";
import { HOME_VOTE_CTA } from "../lib/homePortal";
import { SUPPORT_HUB_ROUTE } from "../lib/supportHub";

/**
 * スマホ専用の画面下部固定ドック。
 * 投票（ENTRY URL）と Support Hub（`/support/`）を常に押しやすくする。
 * 画面を占有しすぎないよう、細い1段のみ。ENTRY URL / 番号は contest.ts が正本。
 * 投票期間が確認できていないときは「投票受付中」と書かない。
 */
export function MobileActionDock() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sage/20 bg-paper/95 px-4 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-3xl items-center gap-2">
        <a
          href={contest.entryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-sage px-4 text-sm font-semibold text-white hover:bg-sage-deep"
        >
          {HOME_VOTE_CTA}
          <span className="sr-only">
            （{contest.entryNumber}・新しいタブで開きます）
          </span>
        </a>
        <a
          href={SUPPORT_HUB_ROUTE}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-sage/30 bg-paper-card px-4 text-sm font-semibold text-sage-deep"
        >
          応援・予定
        </a>
      </div>
    </div>
  );
}
