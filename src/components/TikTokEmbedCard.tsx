import type { TikTokPostVideo } from "../data/tiktokGoodVibesVideo";
import { ExternalLink } from "./ExternalLink";

export function TikTokEmbedCard({ video }: { video: TikTokPostVideo }) {
  return (
    <div className="mx-auto mt-4 w-full max-w-sm overflow-hidden rounded-xl bg-sage-soft">
      <iframe
        src={`https://www.tiktok.com/player/v1/${video.postId}?description=1&music_info=1`}
        title={video.alt}
        width="400"
        height="710"
        loading="lazy"
        allow="fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        className="aspect-[9/16] w-full border-0"
      />
      <p className="px-3 py-2 text-sm">
        <ExternalLink
          href={video.sourceUrl}
          className="font-medium text-sage hover:underline"
        >
          TikTokで元の動画を見る
        </ExternalLink>
      </p>
    </div>
  );
}
