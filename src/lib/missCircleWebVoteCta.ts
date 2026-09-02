import { missCircleWebVoteLink } from "../data/links.ts";
import { missCircleThirdRoundWebVote } from "../data/supportEvents.ts";
import { displayStatus } from "./supportCalendar.ts";

/** 確認済み WEB投票開始前。急かす文言は付けない。 */
export const MISS_CIRCLE_WEB_VOTE_PRESTART_LABEL = "投票開始前";
/** 確認済み WEB投票期間中。1日1回まで。 */
export const MISS_CIRCLE_WEB_VOTE_LIVE_LABEL = "WEB投票する（1日1回）";

export function isMissCircleWebVoteUrl(url: string): boolean {
  return url === missCircleWebVoteLink.url;
}

/**
 * 既存の WEB投票 CTA だけ、開始前も同じ URL で残す。
 * 期間後は隠す（新しいボタンは足さない）。
 */
export function missCircleWebVoteCtaLabel(now: number): string | undefined {
  if (!Number.isFinite(now)) {
    throw new Error("now must be a finite timestamp");
  }

  const status = displayStatus(missCircleThirdRoundWebVote.schedule, now);
  if (status === "upcoming") return MISS_CIRCLE_WEB_VOTE_PRESTART_LABEL;
  if (status === "live") return MISS_CIRCLE_WEB_VOTE_LIVE_LABEL;
  return undefined;
}

export function isMissCircleWebVoteCtaVisible(now: number): boolean {
  return missCircleWebVoteCtaLabel(now) !== undefined;
}
