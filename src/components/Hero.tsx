import { featuredPhoto } from "../data/media";
import { news, sortNewsByDateDesc } from "../data/news";
import { profile } from "../data/profile";
import { site } from "../data/site";

export function Hero() {
  const photo = featuredPhoto();
  const latest = sortNewsByDateDesc(news)[0];

  return (
    <section
      id="top"
      className="relative overflow-hidden px-4 pb-12 pt-10 sm:pb-16 sm:pt-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-10 h-48 w-48 rounded-full bg-sage-soft"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 bottom-4 h-32 w-32 rounded-full bg-apricot-soft"
      />
      <div className="relative mx-auto grid max-w-3xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)] lg:items-center">
        <div>
          <p className="inline-flex rounded-full bg-sage-soft px-3 py-1 text-xs font-medium text-sage-deep">
            ファン制作・非公式サイト
          </p>
          <p className="mt-4 text-sm font-medium tracking-wide text-ink-muted">
            {site.displayTitle}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {profile.displayName}
          </h1>
          <p className="mt-2 text-lg text-ink-muted">{profile.legalName}</p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink">
            確認できた活動情報だけを、ゆっくり残していくファンサイトです。
            公式・公認・本人運営ではありません。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#support"
              className="inline-flex min-h-11 items-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
            >
              応援する
            </a>
            <a
              href="#latest"
              className="inline-flex min-h-11 items-center rounded-full border border-sage/30 bg-paper-card px-5 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft"
            >
              最新情報を見る
            </a>
          </div>
        </div>

        {photo ? (
          <figure className="overflow-hidden rounded-3xl border border-sage/15 bg-paper-card shadow-card">
            <img
              src={photo.src}
              alt={photo.alt}
              className="aspect-[4/5] w-full object-cover object-center"
            />
            {photo.caption ? (
              <figcaption className="px-4 py-3 text-xs leading-relaxed text-ink-muted">
                {photo.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : (
          <div className="rounded-3xl border border-sage/15 bg-paper-card p-6 shadow-card">
            <p className="text-xs font-medium uppercase tracking-wide text-sage-deep">
              Mily Fan Site
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              写真は、出典が確認できたものからギャラリーに残していきます。
            </p>
          </div>
        )}
      </div>

      {latest ? (
        <aside className="relative mx-auto mt-8 max-w-3xl rounded-2xl border border-sage/15 bg-paper-card/90 p-5 shadow-card">
          <p className="text-xs text-ink-muted">{latest.date}</p>
          <p className="mt-1 font-semibold text-ink">{latest.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{latest.body}</p>
          <a
            href="#latest"
            className="mt-3 inline-flex text-sm font-medium text-sage hover:underline"
          >
            最新情報で出典を見る
          </a>
        </aside>
      ) : null}
    </section>
  );
}
