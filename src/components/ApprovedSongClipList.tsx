import type { StreamRecapApprovedSongClip } from "../data/streamRecaps.ts";

export function ApprovedSongClipList({ clips }: { clips: readonly StreamRecapApprovedSongClip[] }) {
  if (clips.length === 0) return null;
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2" data-approved-song-clips>
      {clips.map((clip) => (
        <figure id={clip.id} key={clip.id} className="mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl border border-sage/20 bg-paper-card">
          <video
            controls playsInline preload="none"
            width={clip.width} height={clip.height} poster={clip.poster}
            className="aspect-[9/16] h-auto w-full bg-black object-contain"
            aria-label={`みりぃの切り抜き「${clip.title}」`}
            onPlay={(event) => {
              const active = event.currentTarget;
              document.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
                if (video !== active && !video.paused) video.pause();
              });
            }}
          >
            <source src={clip.src} type="video/mp4" />
            この環境では動画を再生できません。
          </video>
          <figcaption className="p-3 text-sm leading-6">
            <p className="font-semibold text-ink">{clip.title}</p>
            <p className="text-xs text-ink-muted">本人の短い歌唱映像・約{Math.round(clip.durationSeconds)}秒</p>
            <p className="text-xs text-ink-muted">非公式ファン編集／実映像・原音</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
