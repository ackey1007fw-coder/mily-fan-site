import { useState, type ReactNode } from "react";
import {
  news,
  newsDisplayMedia,
  sortNewsByDateDesc,
  type NewsItem,
  type NewsMedia,
} from "../data/news";
import {
  ARCHIVE_LOAD_MORE_LABEL,
  ARCHIVE_PAGE_SIZE,
  HOME_NEWS_ARCHIVE_CTA,
  NEWS_ARCHIVE_ROUTE,
} from "../lib/homePortal";
import { SECTION_ANCHOR_OFFSET } from "../lib/navigation";
import { resolveNewsLinks } from "../lib/newsLinks";
import { useSupportEventClock } from "../lib/useSupportEventClock";
import { EmptyState } from "./EmptyState";
import { ExternalLink } from "./ExternalLink";

function NewsLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  if (href.startsWith("/")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <ExternalLink href={href} className={className}>
      {children}
    </ExternalLink>
  );
}

function NewsMediaBlock({ media }: { media: NewsMedia }) {
  if (media.kind === "video") {
    return (
      <video
        src={media.src}
        poster={media.poster}
        width={media.width}
        height={media.height}
        controls
        playsInline
        preload="none"
        aria-label={media.alt}
        className="mx-auto mt-4 aspect-[9/16] w-full max-w-sm rounded-xl bg-sage-soft object-contain focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
      />
    );
  }

  if (media.kind === "image") {
    return (
      <img
        src={media.src}
        width={media.width}
        height={media.height}
        loading="lazy"
        decoding="async"
        alt={media.alt}
        className="mx-auto mt-4 h-auto w-full max-w-sm rounded-xl bg-sage-soft object-contain"
      />
    );
  }

  return null;
}

export function NewsArticle({ item, now }: { item: NewsItem; now: number }) {
  const resolvedLinks = resolveNewsLinks(item, now);

  return (
    <li className="rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card">
      <p className="text-xs text-ink-muted">{item.date}</p>
      <p className="mt-1 font-semibold text-ink">{item.title}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
      {item.message ? (
        <div className="mt-3 rounded-xl bg-sage-soft/60 px-4 py-3">
          {item.message.label ? (
            <p className="text-xs font-medium text-sage-deep">
              {item.message.label}
            </p>
          ) : null}
          <p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-ink">
            {item.message.text}
          </p>
        </div>
      ) : null}
      {newsDisplayMedia(item).map((media) => (
        <NewsMediaBlock key={`${media.kind}:${media.src}`} media={media} />
      ))}
      {item.source || item.sourceLabel || resolvedLinks.relatedUrl ? (
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {item.source ? (
            <ExternalLink
              href={item.source}
              className="text-sm font-medium text-sage hover:underline"
            >
              {item.sourceLabel ?? "出典を見る"}
            </ExternalLink>
          ) : item.sourceLabel ? (
            <span className="text-sm font-medium text-ink-muted">
              {item.sourceLabel}
            </span>
          ) : null}
          {resolvedLinks.relatedUrl && resolvedLinks.relatedUrl !== item.source ? (
            <NewsLink
              href={resolvedLinks.relatedUrl}
              className="text-sm font-medium text-sage hover:underline"
            >
              関連リンク
            </NewsLink>
          ) : null}
        </p>
      ) : null}
      {resolvedLinks.cta ? (
        <p className="mt-4">
          <NewsLink
            href={resolvedLinks.cta.url}
            className="inline-flex min-h-11 items-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
          >
            {resolvedLinks.cta.label}
          </NewsLink>
        </p>
      ) : null}
    </li>
  );
}

export function Latest({
  limit,
  initialVisible,
  archiveHref = NEWS_ARCHIVE_ROUTE,
  showArchiveCta = Boolean(limit),
}: {
  limit?: number;
  initialVisible?: number;
  archiveHref?: string;
  showArchiveCta?: boolean;
}) {
  const now = useSupportEventClock();
  const latestNews = sortNewsByDateDesc(news);
  const capped = typeof limit === "number" ? latestNews.slice(0, limit) : latestNews;
  const [visibleCount, setVisibleCount] = useState(
    initialVisible ?? capped.length,
  );
  const visibleNews = capped.slice(0, visibleCount);
  const canLoadMore = visibleCount < capped.length;

  return (
    <section id="latest" className={`${SECTION_ANCHOR_OFFSET} px-4 py-10`}>
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-ink">最新情報</h2>
        <p className="mt-2 text-sm text-ink-muted">みりぃさんの近況とお知らせ。</p>
        {latestNews.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="お知らせはまだありません"
              body="新しいお知らせはまだありません。"
            />
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {visibleNews.map((item) => (
              <NewsArticle key={item.id} item={item} now={now} />
            ))}
          </ul>
        )}
        {canLoadMore ? (
          <p className="mt-6">
            <button
              type="button"
              className="inline-flex min-h-11 items-center rounded-full border border-sage/30 bg-paper-card px-5 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft"
              onClick={() =>
                setVisibleCount((count) =>
                  Math.min(count + ARCHIVE_PAGE_SIZE, capped.length),
                )
              }
            >
              {ARCHIVE_LOAD_MORE_LABEL}
            </button>
          </p>
        ) : null}
        {showArchiveCta && latestNews.length > visibleNews.length ? (
          <p className="mt-6">
            <a
              href={archiveHref}
              className="inline-flex min-h-11 items-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
            >
              {HOME_NEWS_ARCHIVE_CTA}
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
