import { useRef, useState } from "react";
import type { StreamRecapApprovedSongClip } from "../data/streamRecaps.ts";

function ApprovedSongClipPlayer({ clip }: { clip: StreamRecapApprovedSongClip }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const beginPlayback = () => {
    const video = videoRef.current;
    const source = video?.querySelector("source");
    if (!video || !source) return;
    setError(null);
    // A source URL is attached only after a real viewer action. WebKit may
    // request metadata even with preload=none when a source is already set.
    if (!source.getAttribute("src")) {
      source.src = clip.src;
      video.load();
    }
    void video.play().catch(() => {
      setStarted(false);
      setError("再生できませんでした。もう一度お試しください。");
    });
  };
  return (
    <figure id={clip.id} className="mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl border border-sage/20 bg-paper-card">
      <div className="relative">
        <video
          ref={videoRef}
          controls playsInline preload="none"
          width={clip.width} height={clip.height} poster={clip.poster}
          className="aspect-[9/16] h-auto w-full bg-black object-contain"
          aria-label={`みりぃの切り抜き「${clip.title}」`}
          onPlay={(event) => {
            setStarted(true);
            const active = event.currentTarget;
            document.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
              if (video !== active && !video.paused) video.pause();
            });
          }}
        >
          <source data-src={clip.src} type="video/mp4" />
          この環境では動画を再生できません。
        </video>
        {!started ? (
          <button
            type="button"
            data-load-approved-clip
            onClick={beginPlayback}
            aria-label={`「${clip.title}」を再生`}
            className="absolute inset-0 flex items-center justify-center bg-black/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-sage"
          >
            <span className="rounded-full bg-paper/95 px-6 py-3 font-semibold text-sage-deep shadow-card">▶ 動画を再生</span>
          </button>
        ) : null}
      </div>
      {error ? <p role="alert" className="px-3 pt-3 text-sm text-ink">{error}</p> : null}
      <figcaption className="p-3 text-sm leading-6">
        <p className="font-semibold text-ink">{clip.title}</p>
        <p className="text-xs text-ink-muted">本人の短い歌唱映像・約{Math.round(clip.durationSeconds)}秒</p>
        <p className="text-xs text-ink-muted">非公式ファン編集／実映像・原音</p>
      </figcaption>
    </figure>
  );
}

export function ApprovedSongClipList({ clips }: { clips: readonly StreamRecapApprovedSongClip[] }) {
  if (clips.length === 0) return null;
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2" data-approved-song-clips>
      {clips.map((clip) => <ApprovedSongClipPlayer key={clip.id} clip={clip} />)}
    </div>
  );
}
