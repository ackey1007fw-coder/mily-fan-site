import {
  driveFileViewUrl,
  driveGallery,
  drivePreviewUrl,
  driveThumbnailUrl,
  visibleDriveGallery,
} from "../data/driveGallery";
import { defaultSrc, media, srcSetFor, visibleMedia } from "../data/media";
import { EmptyState } from "./EmptyState";
import { ExternalLink } from "./ExternalLink";

const SIZES = "(min-width: 640px) 350px, 100vw";

export function Gallery() {
  const items = visibleMedia(media);
  const driveItems = visibleDriveGallery(driveGallery);
  const drivePhotos = driveItems.filter((item) => item.kind === "photo");
  const driveVideos = driveItems.filter((item) => item.kind === "video");
  const hasAny = items.length > 0 || driveItems.length > 0;

  return (
    <section id="gallery" className="scroll-mt-24 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-ink">ギャラリー</h2>
        <p className="mt-2 text-sm text-ink-muted">
          みりぃさんの写真と動画をまとめています。
        </p>
        {!hasAny ? (
          <div className="mt-6">
            <EmptyState
              title="写真・動画はまだありません"
              body="これから増やしていきます。"
            />
          </div>
        ) : null}

        {items.length > 0 ? (
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
        ) : null}

        {drivePhotos.length > 0 ? (
          <div className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-ink">写真アーカイブ</h3>
                <p className="mt-1 text-sm text-ink-muted">
                  オーナー提供素材 {drivePhotos.length}点
                </p>
              </div>
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {drivePhotos.map((item) => (
                <li
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-sage/15 bg-paper-card shadow-card"
                >
                  <a
                    href={driveFileViewUrl(item.fileId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                    aria-label={`${item.alt}（Google Driveで拡大表示・新しいタブ）`}
                  >
                    <img
                      src={driveThumbnailUrl(item.fileId, 1200)}
                      loading="lazy"
                      decoding="async"
                      alt={item.alt}
                      referrerPolicy="no-referrer"
                      className="aspect-[4/5] w-full bg-sage-soft/30 object-contain"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {driveVideos.length > 0 ? (
          <div className="mt-10">
            <h3 className="text-lg font-bold text-ink">動画アーカイブ</h3>
            <p className="mt-1 text-sm text-ink-muted">
              オーナー提供動画 {driveVideos.length}本。完全に重複した1本は1件にまとめています。
            </p>
            <ul className="mt-4 grid items-start gap-4 sm:grid-cols-2">
              {driveVideos.map((item) => (
                <li
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-sage/15 bg-paper-card p-2 shadow-card"
                >
                  <iframe
                    src={drivePreviewUrl(item.fileId)}
                    title={item.alt}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                    className="aspect-[9/16] max-h-[72vh] w-full rounded-xl border-0 bg-sage-soft"
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
