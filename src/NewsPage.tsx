import { ArchiveShell } from "./components/ArchiveShell";
import { Latest } from "./components/Latest";
import { NEWS_ARCHIVE_INITIAL } from "./lib/homePortal";

export default function NewsPage() {
  return (
    <ArchiveShell
      eyebrow="NEWS"
      title="最新情報"
      description="みりぃさんの確認済みの近況とお知らせです。新しいものから順に並んでいます。"
    >
      <Latest
        initialVisible={NEWS_ARCHIVE_INITIAL}
        showArchiveCta={false}
        showIntro={false}
      />
    </ArchiveShell>
  );
}
