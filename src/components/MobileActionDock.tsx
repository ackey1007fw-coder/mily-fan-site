import { contest } from "../data/contest";
import { links } from "../data/links";
import { supportEvents } from "../data/supportEvents";
import {
  selectHomeVoteActions,
  selectHomeVoteSpotlight,
} from "../lib/homePortal";
import { SUPPORT_HUB_ROUTE } from "../lib/supportHub";
import { useSupportEventClock } from "../lib/useSupportEventClock";

/**
 * スマホ専用の画面下部固定ドック。
 * 期間中の確認済み投票、MISS CIRCLE、Support Hub（`/support/`）を押しやすくする。
 * 画面を占有しすぎないよう、両立時も細い1段のみ。
 */
export function MobileActionDock() {
  const now = useSupportEventClock();
  const voteActions = selectHomeVoteActions({
    contest,
    supportEvents,
    links,
    now,
  });
  const spotlight = selectHomeVoteSpotlight({
    contest,
    supportEvents,
    links,
    now,
  });
  const [selectedVoteAction] = voteActions;
  const voteAction = spotlight?.action ?? selectedVoteAction;
  const additionalVoteActions = voteActions.filter(
    (action) => action.url !== voteAction.url,
  );

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sage/20 bg-paper/95 px-4 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-3xl items-center gap-1.5">
        <a
          href={voteAction.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-full px-2 text-xs font-semibold text-white ${
            spotlight
              ? "bg-apricot-ink hover:bg-ink"
              : "bg-sage hover:bg-sage-deep"
          }`}
        >
          <span className="truncate">
            {spotlight?.action.mobileLabel ?? voteAction.label}
          </span>
          <span className="sr-only">
            （{spotlight?.title ?? selectedVoteAction.title}・新しいタブで開きます）
          </span>
        </a>
        {additionalVoteActions.map((action) => (
          <a
            key={action.url}
            href={action.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-full border border-sage/30 bg-paper-card px-2 text-xs font-semibold text-sage-deep"
          >
            <span className="truncate">{action.label}</span>
            <span className="sr-only">
              （{action.title}・新しいタブで開きます）
            </span>
          </a>
        ))}
        <a
          href={SUPPORT_HUB_ROUTE}
          className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-full border border-sage/30 bg-paper-card px-2 text-xs font-semibold text-sage-deep"
        >
          応援・予定
        </a>
      </div>
    </div>
  );
}
