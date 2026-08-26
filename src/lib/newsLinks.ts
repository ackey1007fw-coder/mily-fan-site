import { links } from "../data/links.ts";
import type { NewsItem } from "../data/news.ts";
import { supportEvents } from "../data/supportEvents.ts";
import { isSupportEventUrlActive } from "./supportEventLinks.ts";

export type ResolvedNewsLinks = {
  relatedUrl?: string;
  cta?: { label: string; url: string };
};

/**
 * 通常のNEWSリンクは従来どおり表示し、SupportEventが所有する投票リンクだけを
 * 確認済み期間中に限定する。終了後も本文と一次出典は履歴として残す。
 */
export function resolveNewsLinks(
  item: NewsItem,
  now: number,
): ResolvedNewsLinks {
  if (!Number.isFinite(now)) {
    throw new Error("now must be a finite timestamp");
  }

  const relatedUrl =
    item.url &&
    isSupportEventUrlActive({
      url: item.url,
      links,
      supportEvents,
      now,
    })
      ? item.url
      : undefined;
  const ctaUrl = item.url ? relatedUrl : item.source;

  return {
    ...(relatedUrl ? { relatedUrl } : {}),
    ...(item.ctaLabel && ctaUrl
      ? { cta: { label: item.ctaLabel, url: ctaUrl } }
      : {}),
  };
}
