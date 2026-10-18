import { supportMv } from "../data/supportMv";
import { ExternalLink } from "./ExternalLink";

export function SupportMusicVideo() {
  return (
    <section id="support-mv" className="px-4 py-10">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-sage/20 bg-paper-card shadow-card">
        <div className="bg-gradient-to-br from-sage-soft via-paper-card to-amber-50/70 px-5 py-7 sm:px-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
            {supportMv.collaborationLabel}
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-tight text-ink">
            {supportMv.title}
          </h2>
          <p className="mt-1 text-sm font-medium text-ink">
            {supportMv.subtitle}
          </p>
          <p className="mt-4 text-sm leading-7 text-ink-muted">
            {supportMv.body}
          </p>
        </div>
        <div className="p-5 sm:p-7">
          <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-sm">
            <iframe
              src={supportMv.youtubeEmbedUrl}
              title={supportMv.subtitle}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <ExternalLink
              href={supportMv.youtubeUrl}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
            >
              YouTubeでフル版を見る
            </ExternalLink>
            <ExternalLink
              href={supportMv.manabiLabUrl}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-sage/30 bg-paper px-5 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft"
            >
              MANABI LABを見る
            </ExternalLink>
          </div>
          <p className="mt-4 text-xs leading-6 text-ink-muted">
            {supportMv.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
