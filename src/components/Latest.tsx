import type { ReactNode } from "react";
import { news, sortNewsByDateDesc } from "../data/news";
import { SECTION_ANCHOR_OFFSET } from "../lib/navigation";
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

export function Latest() {
  const latestNews = sortNewsByDateDesc(news);

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
            {latestNews.map((item) => {
              const ctaHref = item.url ?? item.source;

              return (
                <li
                  key={item.id}
                  className="rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card"
                >
                  <p className="text-xs text-ink-muted">{item.date}</p>
                  <p className="mt-1 font-semibold text-ink">{item.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {item.body}
                  </p>
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
                  {item.media?.kind === "video" ? (
                    <video
                      src={item.media.src}
                      poster={item.media.poster}
                      width={item.media.width}
                      height={item.media.height}
                      controls
                      playsInline
                      preload="none"
                      aria-label={item.media.alt}
                      className="mx-auto mt-4 aspect-[9/16] w-full max-w-sm rounded-xl bg-sage-soft object-contain focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                    />
                  ) : null}
                  {item.media?.kind === "image" ? (
                    <img
                      src={item.media.src}
                      width={item.media.width}
                      height={item.media.height}
                      loading="lazy"
                      decoding="async"
                      alt={item.media.alt}
                      className="mx-auto mt-4 h-auto w-full max-w-sm rounded-xl bg-sage-soft object-contain"
                    />
                  ) : null}
                  {item.source || item.sourceLabel || item.url ? (
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
                      {item.url && item.url !== item.source ? (
                        <NewsLink
                          href={item.url}
                          className="text-sm font-medium text-sage hover:underline"
                        >
                          関連リンク
                        </NewsLink>
                      ) : null}
                    </p>
                  ) : null}
                  {item.ctaLabel && ctaHref ? (
                    <p className="mt-4">
                      <NewsLink
                        href={ctaHref}
                        className="inline-flex min-h-11 items-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
                      >
                        {item.ctaLabel}
                      </NewsLink>
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
