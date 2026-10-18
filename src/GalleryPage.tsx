import { ArchiveShell } from "./components/ArchiveShell";
import { Gallery } from "./components/Gallery";
import { radioFanroomAftershowPhoto } from "./data/radioFanroomAftershowPhoto.ts";
import { GALLERY_ARCHIVE_INITIAL } from "./lib/homePortal";

export default function GalleryPage() {
  return (
    <ArchiveShell
      eyebrow="Gallery"
      title="ギャラリー"
      description="みりぃさんの確認済みの写真と動画です。"
    >
      <figure className="mx-4 mt-6 overflow-hidden rounded-2xl border border-sage/15 bg-paper-card shadow-card sm:mx-0">
        <a
          href={`${radioFanroomAftershowPhoto.basePath}-1000.jpg`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="10月11日のラジオ終了後に投稿された2ショット写真を拡大"
          className="block cursor-zoom-in"
        >
          <picture>
            <source type="image/webp" srcSet={radioFanroomAftershowPhoto.widths.map(width => `${radioFanroomAftershowPhoto.basePath}-${width}.webp ${width}w`).join(", ")} sizes="(min-width: 640px) 42rem, 100vw" />
            <img
              src={`${radioFanroomAftershowPhoto.basePath}-1000.jpg`}
              srcSet={radioFanroomAftershowPhoto.widths.map(width => `${radioFanroomAftershowPhoto.basePath}-${width}.jpg ${width}w`).join(", ")}
              sizes="(min-width: 640px) 42rem, 100vw"
              width={radioFanroomAftershowPhoto.width}
              height={radioFanroomAftershowPhoto.height}
              alt={radioFanroomAftershowPhoto.alt}
              loading="lazy"
              decoding="async"
              className="w-full object-contain"
            />
          </picture>
        </a>
        <figcaption className="px-5 py-3 text-sm leading-7 text-ink-muted">{radioFanroomAftershowPhoto.caption}</figcaption>
      </figure>
      <Gallery
        initialVisible={GALLERY_ARCHIVE_INITIAL}
        showArchiveCta={false}
        showIntro={false}
      />
    </ArchiveShell>
  );
}
