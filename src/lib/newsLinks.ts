import { links } from "../data/links.ts";
import type { NewsItem } from "../data/news.ts";
import { supportEvents } from "../data/supportEvents.ts";
import { isSupportEventUrlActive } from "./supportEventLinks.ts";

export type ResolvedNewsLinks = {
  relatedUrl?: string;
  cta?: { label: string; url: string };
  additionalCtas?: { label: string; url: string }[];
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

  const relatedTarget = item.relatedUrl ?? item.url;
  const relatedUrl =
    relatedTarget &&
    isSupportEventUrlActive({
      url: relatedTarget,
      links,
      supportEvents,
      now,
    })
      ? relatedTarget
      : undefined;
  const ctaUrl = relatedTarget ? relatedUrl : item.source;
  const additionalCtas = (item.additionalCtas ?? []).filter(
    ({ url }) =>
      url !== ctaUrl &&
      isSupportEventUrlActive({
        url,
        links,
        supportEvents,
        now,
      }),
  );

  return {
    ...(relatedUrl ? { relatedUrl } : {}),
    ...(item.ctaLabel && ctaUrl
      ? { cta: { label: item.ctaLabel, url: ctaUrl } }
      : {}),
    ...(additionalCtas.length > 0 ? { additionalCtas } : {}),
  };
}
