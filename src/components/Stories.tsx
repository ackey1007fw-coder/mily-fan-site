import { visibleStories } from "../data/stories";
import { StoryCard } from "./StoryCard";

export function Stories() {
  const items = visibleStories();

  if (items.length === 0) return null;

  return (
    <section id="stories" className="scroll-mt-24 border-y border-sage/15 bg-sage-soft/30 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
          読み物 / STORY
        </p>
        <h2 className="mt-2 text-2xl font-bold text-ink">その日の言葉を読む</h2>
        <p className="mt-2 text-sm leading-7 text-ink-muted">
          本人の言葉と、その日の記録を読むページです。
        </p>
        <div className="mt-6 space-y-4">
          {items.map((story) => (
            <StoryCard key={story.slug} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}
