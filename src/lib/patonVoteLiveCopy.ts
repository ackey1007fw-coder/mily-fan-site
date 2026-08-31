import {
  MIXCH_FINAL_DAY_NEWS_ID,
  PATON_FIFTEEN_X_LIVE_NOTE,
  PATON_FIFTEEN_X_LIVE_SHARE_SUFFIX,
  PATON_FIFTEEN_X_NEWS_IDS,
  patonFifteenXBonusSchedule,
} from "../data/patonVoteBonus.ts";
import { sortNewsByDateDesc, type NewsItem } from "../data/news.ts";
import { displayStatus } from "./supportCalendar.ts";

const fifteenXNewsIds = new Set<string>(PATON_FIFTEEN_X_NEWS_IDS);

export function isPatonFifteenXBonusLive(now: number): boolean {
  if (!Number.isFinite(now)) {
    throw new Error("now must be a finite timestamp");
  }
  return displayStatus(patonFifteenXBonusSchedule, now) === "live";
}

export function patonVoteLiveNote(
  baseNote: string | undefined,
  now: number,
): string | undefined {
  const bonus = isPatonFifteenXBonusLive(now)
    ? PATON_FIFTEEN_X_LIVE_NOTE
    : undefined;
  const parts = [baseNote, bonus].filter(
    (part): part is string => typeof part === "string" && part.length > 0,
  );
  return parts.length > 0 ? parts.join(" ") : undefined;
}

export function patonVoteLiveShareText(baseShare: string, now: number): string {
  if (!isPatonFifteenXBonusLive(now)) return baseShare;
  if (baseShare.includes(PATON_FIFTEEN_X_LIVE_SHARE_SUFFIX)) return baseShare;
  return `${baseShare} ${PATON_FIFTEEN_X_LIVE_SHARE_SUFFIX}`;
}

/**
 * Hero の live aside。dated NEWS 一覧そのものは変えない。
 * 1.5倍DAY 終了後は 1.5x 見出しを live に出さず、Mixch 最終日も live にしない。
 */
export function isHomeHeroLiveNews(item: NewsItem, now: number): boolean {
  if (item.id === MIXCH_FINAL_DAY_NEWS_ID) return false;
  if (!isPatonFifteenXBonusLive(now) && fifteenXNewsIds.has(item.id)) {
    return false;
  }
  return true;
}

export function selectHomeHeroNews(
  items: readonly NewsItem[],
  now: number,
): NewsItem | undefined {
  if (!Number.isFinite(now)) {
    throw new Error("now must be a finite timestamp");
  }
  return sortNewsByDateDesc([...items]).find((item) =>
    isHomeHeroLiveNews(item, now),
  );
}
