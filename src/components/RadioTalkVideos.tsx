import { useEffect, useRef, useState } from "react";
import type { RadioEpisodeTalkVideo } from "../data/radioEpisodes.ts";
import { ExternalLink } from "./ExternalLink";

function RadioTalkVideo({ video }: { video: RadioEpisodeTalkVideo }) {
  const [showPlayer, setShowPlayer] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const videoId = new URL(video.youtubeUrl).searchParams.get("v");
  useEffect(() => {
    if (showPlayer) playerRef.current?.focus();
  }, [showPlayer]);
  return (
    <article id={video.id} className="scroll-mt-24 overflow-hidden rounded-2xl border border-sage/20 bg-paper-card shadow-card" data-radio-talk-video>
      <div className="aspect-video overflow-hidden bg-ink/95">
        {showPlayer ? (
          <iframe
            ref={playerRef}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1&rel=0`}
            title={video.title}
            className="h-full w-full"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowPlayer(true)}
            aria-label={`「${video.title}」のYouTubeプレイヤーを表示`}
            className="group relative flex h-full w-full items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-apricot"
          >
            <img
              src={video.poster.src}
              width={video.poster.width}
              height={video.poster.height}
              alt={video.poster.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain"
            />
            <span className="absolute inset-x-2 bottom-2 mx-auto w-fit max-w-[calc(100%-1rem)] rounded-full bg-paper/95 px-4 py-2 text-xs font-bold leading-5 text-sage-deep shadow-card group-hover:bg-paper sm:text-sm">
              ▶ 動画を表示
            </span>
          </button>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <p className="text-xs font-semibold leading-6 text-sage-deep">{video.durationLabel}・YouTube限定公開</p>
        <h4 className="mt-1 text-lg font-bold leading-relaxed text-ink">{video.title}</h4>
        <p className="mt-2 text-sm leading-7 text-ink-muted">{video.description}</p>
        <p className="mt-2 text-xs leading-6 text-ink-muted">{video.sourceTimeLabel}</p>
        <ExternalLink
          href={video.youtubeUrl}
          className="mt-3 inline-flex min-h-11 items-center rounded-full border border-sage/30 bg-paper px-4 py-2 text-sm font-bold text-sage-deep hover:bg-sage-soft"
          aria-label={`「${video.title}」をYouTubeで見る（新しいタブ）`}
        >
          YouTubeで見る ↗
        </ExternalLink>
      </div>
    </article>
  );
}

export function RadioTalkVideos({ videos, episodeId }: { videos: readonly RadioEpisodeTalkVideo[]; episodeId: string }) {
  if (videos.length === 0) return null;
  return (
    <section aria-labelledby={`${episodeId}-talk-videos`} className="mt-9">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">Talk Archive</p>
      <h3 id={`${episodeId}-talk-videos`} className="mt-2 text-xl font-bold text-ink sm:text-2xl">声で振り返る、今日の放送</h3>
      <p className="mt-3 text-sm leading-7 text-ink-muted">
        放送のトーク音声に、当日の番組案内画像・映像を合わせた非公式ファン編集です。放送中のスタジオ映像ではありません。
      </p>
      <p className="mt-2 text-xs leading-6 text-ink-muted">
        楽曲のオンエア部分はカットしています。見たい動画を選ぶとプレイヤーが表示されます。再生できない場合は、YouTubeのリンクからお楽しみください。
      </p>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {videos.map((video) => <RadioTalkVideo key={video.id} video={video} />)}
      </div>
    </section>
  );
}
