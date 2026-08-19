import type { Story } from "../data/stories";

export function StoryCard({ story }: { story: Story }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-sage/15 bg-paper-card shadow-card">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-sage/15 bg-sage-soft/55 px-5 py-4 sm:px-7">
        <time dateTime={story.date} className="text-xs font-medium text-ink-muted">
          {story.dateLabel}
        </time>
        {story.badge ? (
          <span className="rounded-full bg-sage px-3 py-1 text-xs font-semibold text-white">
            {story.badge}
          </span>
        ) : null}
      </div>
      <div className="p-5 sm:p-7">
        <h3 className="text-xl font-bold leading-relaxed text-ink sm:text-2xl">
          {story.cardTitle}
        </h3>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          {story.cardDescription}
        </p>
        <a
          href={story.href}
          className="mt-5 inline-flex min-h-11 items-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
        >
          STORYを読む
        </a>
      </div>
    </article>
  );
}
