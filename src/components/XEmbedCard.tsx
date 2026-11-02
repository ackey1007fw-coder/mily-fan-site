import type { NewsXEmbed } from "../data/news";
import { ExternalLink } from "./ExternalLink";

/**
 * NEWS-only official X post player.
 * Uses the public post id, not downloaded video bytes or an X CDN thumbnail.
 * The link remains usable when an iframe is blocked or fails to load.
 */
export function XEmbedCard({ embed }: { embed: NewsXEmbed }) {
  return (
    <div className="mx-auto mt-4 w-full max-w-sm overflow-hidden rounded-xl border border-sage/15 bg-sage-soft">
      <iframe
        title={embed.alt}
        src={`https://platform.twitter.com/embed/Tweet.html?id=${embed.postId}&dnt=true`}
        width="400"
        height="590"
        loading="lazy"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="h-[590px] w-full border-0"
      />
      <p className="px-3 py-3 text-sm">
        <ExternalLink href={embed.sourceUrl} className="font-medium text-sage hover:underline">
          Xで元の投稿を見る
        </ExternalLink>
      </p>
    </div>
  );
}
