import { links } from "../data/links.ts";
import type { NewsItem } from "../data/news.ts";
import { supportEvents } from "../data/supportEvents.ts";
import {
  isMissCircleWebVoteCtaVisible,
  isMissCircleWebVoteUrl,
  missCircleWebVoteCtaLabel,
} from "./missCircleWebVoteCta.ts";
import { isSupportEventUrlActive } from "./supportEventLinks.ts";

export type ResolvedNewsLinks = {
  relatedUrl?: string;
  cta?: { label: string; url: string };
  additionalCtas?: { label: string; url: string }[];
};

/**
 * 通常のNEWSリンクは従来どおり表示し、SupportEventが所有する投票リンクだけを
 * 確認済み期間中に限定する。終了後も本文と一次出典は履歴として残す。
 * ミスサー三次審査の既存 WEB投票 CTA だけは開始前も同じ URL で残し、
 * ラベルを時間で切り替える。
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
    isNewsActionUrlActive(relatedTarget, now)
      ? relatedTarget
      : undefined;
  const ctaUrl = relatedTarget ? relatedUrl : item.source;
  const additionalCtas = (item.additionalCtas ?? []).filter(
    ({ url }) => url !== ctaUrl && isNewsActionUrlActive(url, now),
  );
  const ctaLabel = ctaUrl ? resolveNewsCtaLabel(item, ctaUrl, now) : undefined;

  return {
    ...(relatedUrl ? { relatedUrl } : {}),
    ...(ctaLabel && ctaUrl ? { cta: { label: ctaLabel, url: ctaUrl } } : {}),
    ...(additionalCtas.length > 0 ? { additionalCtas } : {}),
  };
}

/**
 * SupportEvent 所有の投票リンクは期間中だけ出す。
 * ミスサー三次審査の既存 WEB投票 CTA だけは開始前も同じ URL で残す。
 */
function isNewsActionUrlActive(url: string, now: number): boolean {
  if (isMissCircleWebVoteUrl(url)) {
    return isMissCircleWebVoteCtaVisible(now);
  }
  return isSupportEventUrlActive({
    url,
    links,
    supportEvents,
    now,
  });
}

function resolveNewsCtaLabel(
  item: NewsItem,
  url: string,
  now: number,
): string | undefined {
  if (isMissCircleWebVoteUrl(url)) {
    return missCircleWebVoteCtaLabel(now);
  }
  return item.ctaLabel;
}
