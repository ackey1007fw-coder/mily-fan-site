import { Play } from "lucide-react";
import type { MixchMovie } from "../data/mixchMovies";
import { ExternalLink } from "./ExternalLink";

/**
 * Looks like a video player; watching opens Mixch in a new tab.
 * Do not use `<video>` or iframe Mixch — contest views belong on Mixch.
 */
export function MixchOutboundCard({
  movie,
  className,
}: {
  movie: MixchMovie;
  className?: string;
}) {
  return (
    <ExternalLink
      href={movie.mixchUrl}
      className={
        className ??
        "group relative mx-auto mt-4 block w-full max-w-sm rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
      }
    >
      <span
        className="relative block overflow-hidden rounded-xl bg-sage-soft"
        style={{ aspectRatio: `${movie.width} / ${movie.height}` }}
      >
        <img
          src={movie.poster}
          width={movie.width}
          height={movie.height}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain"
        />
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/55 text-white shadow-lg ring-2 ring-white/80 transition group-hover:bg-black/70">
            <Play className="ml-1 h-8 w-8 fill-current" aria-hidden="true" />
          </span>
        </span>
        <span
          className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/65 px-2.5 py-1 text-xs font-semibold tracking-wide text-white"
          aria-hidden="true"
        >
          Mixch
        </span>
      </span>
      <span className="mt-2 block px-1 text-sm font-medium leading-relaxed text-sage-deep">
        Mixchで「{movie.title}」を見る
      </span>
    </ExternalLink>
  );
}
