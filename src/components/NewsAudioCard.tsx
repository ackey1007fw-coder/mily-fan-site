import { AudioLines } from "lucide-react";
import type { NewsAudioMedia } from "../data/news";

/**
 * In-page player for a self-hosted Fan Room voice memo.
 * Do not iframe SHOWROOM. Do not hotlink SHOWROOM CDN.
 */
export function NewsAudioCard({ media }: { media: NewsAudioMedia }) {
  return (
    <figure className="mx-auto mt-4 w-full max-w-sm rounded-xl border border-sage/15 bg-sage-soft/60 px-4 py-4">
      <div className="flex items-center gap-2">
        <AudioLines className="h-4 w-4 shrink-0 text-sage-deep" aria-hidden="true" />
        <figcaption className="text-xs font-medium text-sage-deep">
          {media.label ?? "音声メッセージ"}
        </figcaption>
      </div>
      <audio
        controls
        preload="none"
        aria-label={media.alt}
        className="mt-3 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
      >
        <source src={media.src} type={media.mimeType} />
      </audio>
    </figure>
  );
}
