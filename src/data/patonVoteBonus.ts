import type { SupportEventSchedule } from "./supportEvents.ts";

/**
 * 2026-08-31 の Paton 1.5倍DAY。投票本体（campusGirlsFinalStagePatonVote）とは別枠。
 * 出典は本人X。期間後の live HOME / now / share には出さない。
 * 8/31 の dated NEWS はこの日の記録として残す。
 */
export const PATON_FIFTEEN_X_BONUS_SOURCE =
  "https://x.com/Mily_chan36/status/2094102196447334713";

export const PATON_FIFTEEN_X_NEWS_IDS = [
  "2026-08-31-paton-first-place-story",
  "2026-08-31-paton-15x-day-story",
  "2026-08-31-paton-15x-day",
  "2026-08-31-paton-vote-voice-story",
] as const;

/** 8/30 Mixch「配信＆ムービーは今日が最終日」。dated NEWS + Gallery に残し、live now には出さない。 */
export const MIXCH_FINAL_DAY_NEWS_ID = "2026-08-30-mixch-final-day";

export const patonFifteenXBonusSchedule: SupportEventSchedule = {
  state: "confirmed-period",
  start: "2026-08-31T00:00:00+09:00",
  end: "2026-08-31T23:59:00+09:00",
  allDay: false,
  timezone: "Asia/Tokyo",
};

/** 期間中の live note / share に足す確認済み文言。SupportEvent.shareText には書かない。 */
export const PATON_FIFTEEN_X_LIVE_NOTE =
  "本日（31日 0:00〜23:59）は1.5倍です。";
export const PATON_FIFTEEN_X_LIVE_SHARE_SUFFIX = "本日は1.5倍DAY";
