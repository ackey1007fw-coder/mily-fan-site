import { defaultSrc, media, srcSetFor, visibleMedia } from "../data/media";
import { EmptyState } from "./EmptyState";
import { ExternalLink } from "./ExternalLink";

const SIZES = "(min-width: 640px) 350px, 100vw";

export function Gallery() {
  const items = visibleMedia(media);

  return (
    <section id="gallery" className="scroll-mt-24 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-ink">ギャラリー</h2>
        <p className="mt-2 text-sm text-ink-muted">みりぃさんの写真を、少しずつ。</p>
        {items.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="写真はまだありません"
              body="これから増やしていきます。"
            />
          </div>
        ) : (
          <ul className="mt-6 grid items-start gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="overflow-hidden rounded-2xl border border-sage/15 bg-paper-card shadow-card"
              >
                {item.kind === "photo" ? (
                  <a
                    href={`${item.basePath}-${item.widths[item.widths.length - 1]}.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block cursor-zoom-in"
                    aria-label={`${item.alt}（拡大表示）`}
                  >
                    <picture>
                      <source
                        type="image/webp"
                        srcSet={srcSetFor(item, "webp")}
                        sizes={SIZES}
                      />
                      <img
                        src={defaultSrc(item)}
                        srcSet={srcSetFor(item, "jpg")}
                        sizes={SIZES}
                        width={item.width}
                        height={item.height}
                        loading="lazy"
                        decoding="async"
                        alt={item.alt}
                        className="aspect-[4/3] w-full object-cover"
                        style={item.focal ? { objectPosition: item.focal } : undefined}
                      />
                    </picture>
                  </a>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-sage-soft px-4 text-sm text-sage-deep">
                    動画は準備中です
                  </div>
                )}
                {item.caption || item.sourceUrl ? (
                  <div className="p-4">
                    {item.caption ? (
                      <p className="text-sm leading-relaxed text-ink">{item.caption}</p>
                    ) : null}
                    {item.sourceUrl ? (
                      <p className={item.caption ? "mt-3" : ""}>
                        <ExternalLink
                          href={item.sourceUrl}
                          className="text-sm font-medium text-sage hover:underline"
                        >
                          出典を見る
                        </ExternalLink>
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
