import { useState } from "react";
import { defaultSrc, srcSetFor } from "../data/media";
import {
  selectGalleryEntries,
  type GalleryEntry,
} from "../lib/galleryItems";
import {
  ARCHIVE_LOAD_MORE_LABEL,
  ARCHIVE_PAGE_SIZE,
  GALLERY_ARCHIVE_ROUTE,
  HOME_GALLERY_ARCHIVE_CTA,
} from "../lib/homePortal";
import { SECTION_ANCHOR_OFFSET } from "../lib/navigation";
import { EmptyState } from "./EmptyState";
import { ExternalLink } from "./ExternalLink";
import { MixchOutboundCard } from "./MixchOutboundCard";

const SIZES = "(min-width: 640px) 350px, 100vw";

function MediaPhotoCard({ entry }: { entry: Extract<GalleryEntry, { kind: "media" }> }) {
  const item = entry.item;

  return (
    <li className="overflow-hidden rounded-2xl border border-sage/15 bg-paper-card shadow-card">
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
  );
}

function DrivePhotoCard({
  entry,
}: {
  entry: Extract<GalleryEntry, { kind: "drive-photo" }>;
}) {
  const photo = entry.item;

  return (
    <li className="overflow-hidden rounded-2xl border border-sage/15 bg-paper-card shadow-card">
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
  );
}

function VideoCard({ entry }: { entry: Extract<GalleryEntry, { kind: "video" }> }) {
  const video = entry.item;

  return (
    <li className="overflow-hidden rounded-2xl border border-sage/15 bg-paper-card p-2 shadow-card">
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
  );
}

function MixchCard({ entry }: { entry: Extract<GalleryEntry, { kind: "mixch" }> }) {
  return (
    <li className="overflow-hidden rounded-2xl border border-sage/15 bg-paper-card p-2 shadow-card">
      <MixchOutboundCard movie={entry.item} className="group relative block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sage" />
    </li>
  );
}

function GalleryCard({ entry }: { entry: GalleryEntry }) {
  if (entry.kind === "media") return <MediaPhotoCard entry={entry} />;
  if (entry.kind === "drive-photo") return <DrivePhotoCard entry={entry} />;
  if (entry.kind === "mixch") return <MixchCard entry={entry} />;
  return <VideoCard entry={entry} />;
}

export function Gallery({
  limit,
  initialVisible,
  archiveHref = GALLERY_ARCHIVE_ROUTE,
  showArchiveCta = Boolean(limit),
}: {
  limit?: number;
  initialVisible?: number;
  archiveHref?: string;
  showArchiveCta?: boolean;
}) {
  const entries = selectGalleryEntries();
  const capped = typeof limit === "number" ? entries.slice(0, limit) : entries;
  const [visibleCount, setVisibleCount] = useState(
    initialVisible ?? capped.length,
  );
  const visible = capped.slice(0, visibleCount);
  const canLoadMore = visibleCount < capped.length;
  const photos = visible.filter(
    (entry) => entry.kind === "media" || entry.kind === "drive-photo",
  );
  // Mixch cards must not wait behind photo pagination. Take them from the
  // capped list so /gallery/ first paint always includes outbound players.
  const videos = [
    ...capped.filter((entry) => entry.kind === "mixch"),
    ...visible.filter((entry) => entry.kind === "video"),
  ];

  return (
    <section id="gallery" className={`${SECTION_ANCHOR_OFFSET} px-4 py-10`}>
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-ink">ギャラリー</h2>
        <p className="mt-2 text-sm text-ink-muted">
          みりぃの写真と動画を、ひとつのギャラリーに。
        </p>
        {entries.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="写真・動画はまだありません"
              body="最初の一枚をお楽しみに。"
            />
          </div>
        ) : null}

        {photos.length > 0 ? (
          <ul className="mt-6 grid grid-cols-1 items-start gap-3 min-[360px]:grid-cols-2 sm:grid-cols-3 sm:gap-4">
            {photos.map((entry) => (
              <GalleryCard key={entry.key} entry={entry} />
            ))}
          </ul>
        ) : null}

        {videos.length > 0 ? (
          <div className={photos.length > 0 ? "mt-10" : "mt-6"}>
            {limit ? null : (
              <>
                <h3 className="text-lg font-bold text-ink">動画アーカイブ</h3>
                <p className="mt-1 text-sm text-ink-muted">
                  お預かりした動画と、Mixchで見る動画。
                </p>
              </>
            )}
            <ul className="mt-4 grid items-start gap-4 sm:grid-cols-2">
              {videos.map((entry) => (
                <GalleryCard key={entry.key} entry={entry} />
              ))}
            </ul>
          </div>
        ) : null}

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

        {showArchiveCta && entries.length > visible.length ? (
          <p className="mt-6">
            <a
              href={archiveHref}
              className="inline-flex min-h-11 items-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
            >
              {HOME_GALLERY_ARCHIVE_CTA}
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
