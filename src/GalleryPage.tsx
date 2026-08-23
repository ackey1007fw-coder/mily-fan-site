import { ArchiveShell } from "./components/ArchiveShell";
import { Gallery } from "./components/Gallery";
import { GALLERY_ARCHIVE_INITIAL } from "./lib/homePortal";

export default function GalleryPage() {
  return (
    <ArchiveShell
      eyebrow="Gallery"
      title="ギャラリー"
      description="みりぃさんの確認済みの写真と動画です。"
    >
      <Gallery initialVisible={GALLERY_ARCHIVE_INITIAL} showArchiveCta={false} />
    </ArchiveShell>
  );
}
