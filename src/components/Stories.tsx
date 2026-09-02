import { visibleStories } from "../data/stories";
import {
  HOME_STORY_ARCHIVE_CTA,
  STORIES_ARCHIVE_ROUTE,
} from "../lib/homePortal";
import { SECTION_ANCHOR_OFFSET } from "../lib/navigation";
import { StoryCard } from "./StoryCard";

export function Stories({
  limit,
  archiveHref = STORIES_ARCHIVE_ROUTE,
  showArchiveCta = Boolean(limit),
  showIntro = true,
}: {
  limit?: number;
  archiveHref?: string;
  showArchiveCta?: boolean;
  showIntro?: boolean;
}) {
  const items = visibleStories();
  const visible = typeof limit === "number" ? items.slice(0, limit) : items;

  if (items.length === 0) return null;

  return (
    <section
      id="stories"
      className={`${SECTION_ANCHOR_OFFSET} border-y border-sage/15 bg-sage-soft/30 px-4 py-12`}
    >
      <div className="mx-auto max-w-3xl">
        {showIntro ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
              読み物 / STORY
            </p>
            <h2 className="mt-2 text-2xl font-bold text-ink">
              その日の言葉を読む
            </h2>
            <p className="mt-2 text-sm leading-7 text-ink-muted">
              本人の言葉と、その日の記録を読むページです。
            </p>
          </>
        ) : (
          <h2 className="sr-only">ストーリー一覧</h2>
        )}
        <div className="mt-6 space-y-4">
          {visible.map((story) => (
            <StoryCard key={story.slug} story={story} />
          ))}
        </div>
        {showArchiveCta && items.length > visible.length ? (
          <p className="mt-6">
            <a
              href={archiveHref}
              className="inline-flex min-h-11 items-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
            >
              {HOME_STORY_ARCHIVE_CTA}
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
