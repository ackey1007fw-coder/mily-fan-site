import { Footer } from "./components/Footer";
import { ExternalLink } from "./components/ExternalLink";
import {
  storySources,
  type Story,
  type StoryBlock,
  type StoryMedia,
} from "./data/stories";

function StoryHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-sage/15 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <a href="/" className="font-semibold tracking-wide text-sage-deep">
          みりぃ ファンサイト
        </a>
        <a
          href="/"
          className="inline-flex min-h-11 items-center rounded-full bg-sage-soft px-4 py-2 text-sm font-semibold text-sage-deep hover:bg-sage/15"
        >
          ホームへ戻る
        </a>
      </div>
    </header>
  );
}

function MediaFigure({ media, priority = false }: { media: StoryMedia; priority?: boolean }) {
  if (media.kind === "video") {
    return (
      <figure className="mx-auto mt-8 max-w-sm overflow-hidden rounded-3xl border border-sage/15 bg-paper-card p-2 shadow-card">
        <video
          src={media.src}
          width={media.width}
          height={media.height}
          controls
          playsInline
          preload="none"
          aria-label={media.label}
          className="aspect-[9/16] max-h-[78vh] w-full rounded-2xl bg-sage-soft object-contain focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
        />
        <figcaption className="px-3 pb-2 pt-3 text-xs leading-6 text-ink-muted">
          {media.caption}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="mx-auto my-8 max-w-xl overflow-hidden rounded-3xl border border-sage/15 bg-paper-card p-2 shadow-card">
      <img
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="max-h-[72rem] w-full rounded-2xl bg-sage-soft/30 object-contain"
      />
      <figcaption className="px-3 pb-2 pt-3 text-xs leading-6 text-ink-muted">
        {media.caption}
      </figcaption>
    </figure>
  );
}

function StoryBodyBlock({
  block,
  mediaById,
}: {
  block: StoryBlock;
  mediaById: Map<string, StoryMedia>;
}) {
  if (block.type === "paragraph") {
    return <p className="mt-5 text-base leading-8 text-ink">{block.text}</p>;
  }

  if (block.type === "quote") {
    return (
      <blockquote className="my-7 border-l-2 border-sage/55 bg-sage-soft/35 px-5 py-4 text-base font-medium leading-8 text-ink sm:px-6">
        {block.paragraphs.map((paragraph, index) => (
          <p key={`${paragraph}-${index}`} className={index > 0 ? "mt-4 whitespace-pre-line" : "whitespace-pre-line"}>
            {paragraph}
          </p>
        ))}
      </blockquote>
    );
  }

  const media = mediaById.get(block.mediaId);
  return media ? <MediaFigure media={media} /> : null;
}

function sourceHref(sourceId: keyof typeof storySources): string | undefined {
  const source = storySources[sourceId];
  return "url" in source ? source.url : undefined;
}

export default function StoryPage({ story }: { story: Story }) {
  const mediaById = new Map(story.media.map((media) => [media.id, media]));
  const leadMedia = story.leadMediaId ? mediaById.get(story.leadMediaId) : undefined;

  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <a
        href="#story-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-sage focus:px-4 focus:py-2 focus:text-white"
      >
        本文へスキップ
      </a>
      <StoryHeader />
      <main id="story-main">
        <article aria-labelledby="story-title">
          <header className="relative overflow-hidden px-4 pb-10 pt-10 sm:pb-14 sm:pt-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-16 h-64 w-64 rounded-full bg-sage-soft"
            />
            <div className="relative mx-auto max-w-3xl">
              <nav aria-label="パンくず" className="text-xs text-ink-muted">
                <a href="/" className="hover:text-sage-deep hover:underline">
                  ホーム
                </a>
                <span aria-hidden="true" className="px-2">/</span>
                <span>STORY</span>
              </nav>
              <p className="mt-7 text-xs font-semibold tracking-[0.12em] text-sage-deep">
                {story.eyebrow}
              </p>
              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                <time dateTime={story.date} className="text-xs text-ink-muted">
                  {story.dateLabel}
                </time>
                {story.badge ? (
                  <span className="rounded-full bg-sage px-3 py-1 text-xs font-semibold text-white">
                    {story.badge}
                  </span>
                ) : null}
              </p>
              <h1
                id="story-title"
                className="mt-4 text-3xl font-bold leading-[1.45] tracking-tight text-ink sm:text-5xl sm:leading-[1.35]"
              >
                {story.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-ink sm:text-lg sm:leading-9">
                {story.lead}
              </p>
              {leadMedia ? <MediaFigure media={leadMedia} priority /> : null}
            </div>
          </header>

          <div className="px-4 pb-14">
            <div className="mx-auto max-w-2xl">
              {story.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24 border-t border-sage/15 py-10 first:border-t-0">
                  <h2 className="text-2xl font-bold leading-relaxed text-ink sm:text-3xl">
                    {section.title}
                  </h2>
                  {section.blocks.map((block, index) => (
                    <StoryBodyBlock
                      key={`${section.id}-${block.type}-${index}`}
                      block={block}
                      mediaById={mediaById}
                    />
                  ))}
                </section>
              ))}

              <section className="mt-4 rounded-3xl border border-sage/15 bg-paper-card p-6 shadow-card sm:p-8" aria-labelledby="story-sources">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
                  Sources
                </p>
                <h2 id="story-sources" className="mt-2 text-2xl font-bold text-ink">
                  出典
                </h2>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-ink-muted">
                  {story.sourceIds.map((sourceId) => {
                    const href = sourceHref(sourceId);
                    return (
                      <li key={sourceId} className="rounded-2xl bg-sage-soft/45 px-4 py-3">
                        {href ? (
                          <ExternalLink
                            href={href}
                            className="font-medium text-sage hover:underline"
                          >
                            {storySources[sourceId].label}
                          </ExternalLink>
                        ) : (
                          storySources[sourceId].label
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>

              <p className="mt-8 text-center">
                <a
                  href="/#stories"
                  className="inline-flex min-h-11 items-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
                >
                  ホームのSTORIESへ戻る
                </a>
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
