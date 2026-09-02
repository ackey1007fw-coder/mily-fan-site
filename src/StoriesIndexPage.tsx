import { ArchiveShell } from "./components/ArchiveShell";
import { Stories } from "./components/Stories";

export default function StoriesIndexPage() {
  return (
    <ArchiveShell
      eyebrow="STORY"
      title="STORY"
      description="本人の言葉と、その日の記録を読むページです。"
    >
      <Stories showArchiveCta={false} showIntro={false} />
    </ArchiveShell>
  );
}
