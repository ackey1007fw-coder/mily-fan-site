import { contest } from "../data/contest";
import { links } from "../data/links";
import { supportEvents } from "../data/supportEvents";
import { selectHomeVoteAction } from "../lib/homePortal";
import { SUPPORT_HUB_ROUTE } from "../lib/supportHub";

/**
 * スマホ専用の画面下部固定ドック。
 * 期間中の確認済み投票と Support Hub（`/support/`）を常に押しやすくする。
 * 画面を占有しすぎないよう、細い1段のみ。終了後はENTRY導線へ戻す。
 */
export function MobileActionDock() {
  const voteAction = selectHomeVoteAction({
    contest,
    supportEvents,
    links,
    now: Date.now(),
  });

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sage/20 bg-paper/95 px-4 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-3xl items-center gap-2">
        <a
          href={voteAction.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-sage px-4 text-sm font-semibold text-white hover:bg-sage-deep"
        >
          {voteAction.label}
          <span className="sr-only">
            （{voteAction.title}・新しいタブで開きます）
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
