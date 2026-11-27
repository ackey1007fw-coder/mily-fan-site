import { useEffect, useState, type ReactNode } from "react";
import {
  news,
  newsDisplayMedia,
  newsMediaKey,
  sortNewsByDateDesc,
  type NewsCategory,
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
import {
  countNewsByCategory,
  filterNewsByCategory,
  NEWS_CATEGORY_LABELS,
  NEWS_CATEGORY_ORDER,
  NEWS_CATEGORY_QUERY_KEY,
  newsCategoriesOf,
  readNewsCategoryFromSearch,
} from "../lib/newsCategories";
import { resolveNewsLinks } from "../lib/newsLinks";
import { useSupportEventClock } from "../lib/useSupportEventClock";
import { EmptyState } from "./EmptyState";
import { ExternalLink } from "./ExternalLink";
import { MixchOutboundCard } from "./MixchOutboundCard";
import { NewsAudioCard } from "./NewsAudioCard";
import { NewsImage } from "./NewsImage";
import { NewsNotes } from "./NewsNotes";
import { TikTokEmbedCard } from "./TikTokEmbedCard";
import { XEmbedCard } from "./XEmbedCard";

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
  if (media.kind === "mixch") {
    if (!media.published) return null;
    return <MixchOutboundCard movie={media} />;
  }

  if (media.kind === "tiktok") {
    return media.published ? <TikTokEmbedCard video={media} /> : null;
  }

  if (media.kind === "audio") {
    return <NewsAudioCard media={media} />;
  }

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
        style={{ aspectRatio: `${media.width} / ${media.height}` }}
        className="mx-auto mt-4 w-full max-w-sm rounded-xl bg-sage-soft object-contain focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
      />
    );
  }

  if (media.kind === "image") {
    return (
      <NewsImage
        media={media}
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
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <p className="text-xs text-ink-muted">{item.dateBasis === "confirmed-on" ? "確認日 " : ""}{item.date}</p>
        <p className="flex flex-wrap gap-1">
          <span className="sr-only">カテゴリ：</span>
          {newsCategoriesOf(item).map((category) => (
            <span
              key={category}
              data-news-category={category}
              className="rounded-full bg-sage-soft px-2 py-0.5 text-[11px] font-medium leading-4 text-sage-deep"
            >
              {NEWS_CATEGORY_LABELS[category]}
            </span>
          ))}
        </p>
      </div>
      <p className="mt-1 font-semibold text-ink">{item.title}</p>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-muted">{item.body}</p>
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
        <NewsMediaBlock key={newsMediaKey(media)} media={media} />
      ))}
      {item.xEmbed ? <XEmbedCard embed={item.xEmbed} /> : null}
      <NewsNotes notes={item.notes} />

      {item.source ||
      item.sourceLabel ||
      item.additionalSources?.length ||
      resolvedLinks.relatedUrl ? (
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
          {item.additionalSources?.map((source) => (
            <ExternalLink
              key={source.url}
              href={source.url}
              className="text-sm font-medium text-sage hover:underline"
            >
              {source.label}
            </ExternalLink>
          ))}
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
      {resolvedLinks.cta || resolvedLinks.additionalCtas?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {resolvedLinks.cta ? (
            <NewsLink
              href={resolvedLinks.cta.url}
              className="inline-flex min-h-11 items-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
            >
              {resolvedLinks.cta.label}
            </NewsLink>
          ) : null}
          {resolvedLinks.additionalCtas?.map((cta) => (
            <NewsLink
              key={cta.url}
              href={cta.url}
              className="inline-flex min-h-11 items-center rounded-full border border-sage/30 bg-paper px-5 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft"
            >
              {cta.label}
            </NewsLink>
          ))}
        </div>
      ) : null}
    </li>
  );
}

function NewsCategoryFilter({
  selected,
  counts,
  total,
  onSelect,
}: {
  selected: NewsCategory | null;
  counts: Record<NewsCategory, number>;
  total: number;
  onSelect: (category: NewsCategory | null) => void;
}) {
  const options: { value: NewsCategory | null; label: string; count: number }[] = [
    { value: null, label: "すべて", count: total },
    ...NEWS_CATEGORY_ORDER.filter((category) => counts[category] > 0).map((category) => ({
      value: category,
      label: NEWS_CATEGORY_LABELS[category],
      count: counts[category],
    })),
  ];

  return (
    <div role="group" aria-label="カテゴリで絞り込む" className="mt-2 flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.value === selected;
        return (
          <button
            key={option.value ?? "all"}
            type="button"
            aria-pressed={active}
            data-news-filter={option.value ?? "all"}
            onClick={() => onSelect(option.value)}
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold ${
              active
                ? "border-sage bg-sage text-white"
                : "border-sage/30 bg-paper-card text-sage-deep hover:bg-sage-soft"
            }`}
          >
            {option.label}
            <span className={`text-xs font-medium ${active ? "text-white/85" : "text-ink-muted"}`}>
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function writeCategoryToUrl(category: NewsCategory | null) {
  try {
    const url = new URL(window.location.href);
    if (category) url.searchParams.set(NEWS_CATEGORY_QUERY_KEY, category);
    else url.searchParams.delete(NEWS_CATEGORY_QUERY_KEY);
    window.history.replaceState(window.history.state, "", url);
  } catch {
    // URL sync is a convenience only; filtering still works without it.
  }
}

export function Latest({
  limit,
  initialVisible,
  archiveHref = NEWS_ARCHIVE_ROUTE,
  showArchiveCta = Boolean(limit),
  showIntro = true,
  showCategoryFilter = false,
}: {
  limit?: number;
  initialVisible?: number;
  archiveHref?: string;
  showArchiveCta?: boolean;
  showIntro?: boolean;
  /** Category chips with `?category=` sync. Used on the /news/ archive only. */
  showCategoryFilter?: boolean;
}) {
  const now = useSupportEventClock();
  const latestNews = sortNewsByDateDesc(news);
  const capped = typeof limit === "number" ? latestNews.slice(0, limit) : latestNews;
  const pageSize = initialVisible ?? capped.length;
  const [category, setCategory] = useState<NewsCategory | null>(null);
  const [visibleCount, setVisibleCount] = useState(pageSize);

  useEffect(() => {
    if (!showCategoryFilter) return;
    const fromUrl = readNewsCategoryFromSearch(window.location.search);
    if (fromUrl) setCategory(fromUrl);
  }, [showCategoryFilter]);

  const filtered = showCategoryFilter ? filterNewsByCategory(capped, category) : capped;
  const visibleNews = filtered.slice(0, visibleCount);
  const canLoadMore = visibleCount < filtered.length;

  const selectCategory = (next: NewsCategory | null) => {
    setCategory(next);
    setVisibleCount(pageSize);
    writeCategoryToUrl(next);
  };

  return (
    <section id="latest" className={`${SECTION_ANCHOR_OFFSET} px-4 py-10`}>
      <div className="mx-auto max-w-3xl">
        {showIntro ? (
          <>
            <h2 className="text-2xl font-bold text-ink">最新情報</h2>
            <p className="mt-2 text-sm text-ink-muted">
              みりぃさんの近況とお知らせ。
            </p>
          </>
        ) : (
          <h2 className="sr-only">最新情報一覧</h2>
        )}
        {showCategoryFilter && capped.length > 0 ? (
          <>
            <NewsCategoryFilter
              selected={category}
              counts={countNewsByCategory(capped)}
              total={capped.length}
              onSelect={selectCategory}
            />
            <p className="mt-3 text-xs text-ink-muted" aria-live="polite" data-news-filter-status>
              {category ? `「${NEWS_CATEGORY_LABELS[category]}」の記事 ${filtered.length}件` : `すべての記事 ${filtered.length}件`}
            </p>
          </>
        ) : null}
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
                  Math.min(count + ARCHIVE_PAGE_SIZE, filtered.length),
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
