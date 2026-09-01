import { contest } from "../data/contest";
import { links } from "../data/links";
import { supportEvents } from "../data/supportEvents";
import { selectHomeVoteActions } from "../lib/homePortal";
import { SECTION_ANCHOR_OFFSET } from "../lib/navigation";
import { SUPPORT_HUB_ROUTE } from "../lib/supportHub";
import { useSupportEventClock } from "../lib/useSupportEventClock";
import { ExternalLink } from "./ExternalLink";

/**
 * ホームの compact Support gateway。
 *
 * Support全体の正規Hubは `/support/`。ホームでは Support Hub を複製せず、
 * 「今できる応援 / 確認済みの予定 / 日程発表待ち」への入口だけを置く。
 * Support Calendar の中身はここへ複製しない。
 * 投票先は supportEvents / links の確認済み期間を参照し、期間中もENTRYを併記する。
 */
export function Support() {
  const now = useSupportEventClock();
  const voteActions = selectHomeVoteActions({
    contest,
    supportEvents,
    links,
    now,
  });
  const [voteAction, ...additionalVoteActions] = voteActions;
  const gatewayVoteActions =
    voteAction.kind === "support-event" ? additionalVoteActions : voteActions;

  return (
    <section id="support" className={`${SECTION_ANCHOR_OFFSET} px-4 py-6`}>
      <div className="mx-auto max-w-3xl rounded-3xl border border-sage/15 bg-paper-card p-5 shadow-card sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
          Support
        </p>
        <h2 className="mt-2 text-2xl font-bold text-ink">応援・予定</h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          今できる応援、今日・今週の予定、日程発表待ちはSupport Hubへ。
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <a
            href={SUPPORT_HUB_ROUTE}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
          >
            応援・予定を見る
          </a>
          {voteAction.kind === "support-event" ? null : (
            <ExternalLink
              href={voteAction.url}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-sage/30 bg-paper px-5 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft"
            >
              {voteAction.label}
            </ExternalLink>
          )}
          {additionalVoteActions.map((action) => (
            <ExternalLink
              key={action.url}
              href={action.url}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-sage/30 bg-paper px-5 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft"
            >
              {action.label}
            </ExternalLink>
          ))}
        </div>
        {gatewayVoteActions.some(({ note }) => note) ? (
          <div className="mt-3 space-y-1">
            {gatewayVoteActions.map((action) =>
              action.note ? (
                <p
                  key={action.url}
                  className="whitespace-pre-line text-xs leading-5 text-ink-muted"
                >
                  <span className="font-medium">{action.label}:</span>{" "}
                  {action.note}
                </p>
              ) : null,
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
