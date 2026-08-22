import {
  driveGallerySections,
  driveVideoView,
  visibleDriveGallery,
} from "../data/driveGallery";
import { visibleGalleryVideos } from "../data/galleryVideos";
import { defaultSrc, media, srcSetFor, visibleMedia } from "../data/media";
import { SECTION_ANCHOR_OFFSET } from "../lib/navigation";
import { EmptyState } from "./EmptyState";
import { ExternalLink } from "./ExternalLink";

const SIZES = "(min-width: 640px) 350px, 100vw";

export function Gallery() {
  const items = visibleMedia(media);
  const drive = driveGallerySections(visibleDriveGallery());
  const videos = [
    ...visibleGalleryVideos().map(driveVideoView),
    ...drive.videos,
  ];
  const hasAny = items.length > 0 || drive.photos.length > 0 || videos.length > 0;

  return (
    <section id="gallery" className={`${SECTION_ANCHOR_OFFSET} px-4 py-10`}>
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-ink">ギャラリー</h2>
        <p className="mt-2 text-sm text-ink-muted">
          みりぃの写真と動画を、ひとつのギャラリーに。
        </p>
        {!hasAny ? (
          <div className="mt-6">
            <EmptyState
              title="写真・動画はまだありません"
              body="最初の一枚をお楽しみに。"
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
                        style={
                          item.focal || item.aspect
                            ? {
                                ...(item.focal ? { objectPosition: item.focal } : {}),
                                ...(item.aspect ? { aspectRatio: item.aspect } : {}),
                              }
                            : undefined
                        }
                      />
                    </picture>
                  </a>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-sage-soft px-4 text-sm text-sage-deep">
                    動画はまだ見られません。
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

        {drive.photos.length > 0 ? (
          <div className="mt-10">
            <h3 className="text-lg font-bold text-ink">写真アーカイブ</h3>
            <p className="mt-1 text-sm text-ink-muted">
              お預かりした写真、全{drive.photos.length}点。
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:grid-cols-3">
              {drive.photos.map((photo) => (
                <li
                  key={photo.key}
                  className="overflow-hidden rounded-2xl border border-sage/15 bg-paper-card shadow-card"
                >
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={photo.img.webpSrcSet}
                      sizes={photo.img.sizes}
                    />
                    <img
                      src={photo.img.src}
                      srcSet={photo.img.srcSet}
                      sizes={photo.img.sizes}
                      alt={photo.img.alt}
                      width={photo.img.width}
                      height={photo.img.height}
                      loading={photo.img.loading}
                      decoding={photo.img.decoding}
                      className="aspect-[4/5] w-full bg-sage-soft/30 object-cover"
                    />
                  </picture>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {videos.length > 0 ? (
          <div className="mt-10">
            <h3 className="text-lg font-bold text-ink">動画アーカイブ</h3>
            <p className="mt-1 text-sm text-ink-muted">
              お預かりした動画、全{videos.length}本。
            </p>
            <ul className="mt-4 grid items-start gap-4 sm:grid-cols-2">
              {videos.map((video) => (
                <li
                  key={video.key}
                  className="overflow-hidden rounded-2xl border border-sage/15 bg-paper-card p-2 shadow-card"
                >
                  <video
                    src={video.video.src}
                    poster={video.video.poster}
                    width={video.video.width}
                    height={video.video.height}
                    controls={video.video.controls}
                    playsInline={video.video.playsInline}
                    preload={video.video.preload}
                    aria-label={video.video.label}
                    className="aspect-[9/16] max-h-[72vh] w-full rounded-xl bg-sage-soft object-contain focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                  />
                  <p className="px-2 pb-1 pt-2 text-sm leading-relaxed text-ink">
                    {video.video.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

      </div>
    </section>
  );
}
