import { contest } from "../data/contest";
import { campusGirlsPatonVoteLink, links } from "../data/links";
import { defaultSrc, featuredPhoto, srcSetFor } from "../data/media";
import { news, sortNewsByDateDesc } from "../data/news";
import { PATON_VOTE_HOW_TO_ANCHOR_ID } from "../data/patonVoteHowTo";
import { profile } from "../data/profile";
import { site } from "../data/site";
import { supportEvents } from "../data/supportEvents";
import { selectHomeVoteActions } from "../lib/homePortal";
import { SUPPORT_HUB_ROUTE } from "../lib/supportHub";
import { isSupportEventUrlActive } from "../lib/supportEventLinks";
import { useSupportEventClock } from "../lib/useSupportEventClock";
import { ExternalLink } from "./ExternalLink";
import { Socials } from "./Socials";

export function Hero() {
  const photo = featuredPhoto();
  const latest = sortNewsByDateDesc(news)[0];
  const now = useSupportEventClock();
  const voteActions = selectHomeVoteActions({
    contest,
    supportEvents,
    links,
    now,
  });
  const [voteAction, ...additionalVoteActions] = voteActions;
  const seasideCircleLinks = links.filter(
    (link) =>
      link.id === "fm-smw-ssc-program" ||
      link.id === "fm-smw-ssc-tiktok",
  );
  const showPatonHowTo = isSupportEventUrlActive({
    url: campusGirlsPatonVoteLink.url,
    links,
    supportEvents,
    now,
  });

  return (
    <section
      id="top"
      className="relative overflow-hidden px-4 pb-10 pt-10 sm:pb-14 sm:pt-14"
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
        <div className="order-2 lg:order-1">
          <p className="inline-flex rounded-full bg-sage-soft px-3 py-1 text-xs font-medium text-sage-deep">
            ファン制作・非公式サイト
          </p>
          <p className="mt-4 text-sm font-medium tracking-wide text-ink-muted">
            {site.displayTitle}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {profile.displayName}
          </h1>
          <p className="mt-2 text-lg text-ink-muted">{profile.publicName}</p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink">
            ラジオ、配信、コンテスト。みりぃの今をひとつに。
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ExternalLink
                href={voteAction.url}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-sage px-6 py-3 text-base font-semibold text-white shadow-card hover:bg-sage-deep sm:w-auto sm:min-w-[18rem]"
              >
                {voteAction.label}
              </ExternalLink>
              {additionalVoteActions.map((action) => (
                <ExternalLink
                  key={action.url}
                  href={action.url}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-sage/30 bg-paper-card px-6 py-3 text-base font-semibold text-sage-deep hover:bg-sage-soft sm:w-auto"
                >
                  {action.label}
                </ExternalLink>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {showPatonHowTo ? (
                <a
                  href={`#${PATON_VOTE_HOW_TO_ANCHOR_ID}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-apricot/50 bg-apricot-soft/60 px-5 py-2.5 text-sm font-semibold text-apricot-ink hover:bg-apricot-soft"
                >
                  投票のやり方を見る
                </a>
              ) : null}
              <a
                href="#latest"
                className="inline-flex min-h-11 items-center rounded-full border border-sage/30 bg-paper-card px-5 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft"
              >
                最新情報を見る
              </a>
              <a
                href={SUPPORT_HUB_ROUTE}
                className="inline-flex min-h-11 items-center rounded-full border border-sage/30 bg-paper-card px-5 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft"
              >
                応援・予定
              </a>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {voteActions.map((action) => (
              <div key={action.url}>
                <p className="text-xs text-ink-muted">{action.title}</p>
                {action.note ? (
                  <p className="mt-1 text-xs leading-5 text-ink-muted">
                    {action.note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
          <Socials />
          {seasideCircleLinks.length > 0 ? (
            <div
              className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap"
              role="group"
              aria-label="湘南シーサイドサークル 番組リンク"
            >
              {seasideCircleLinks.map((link) => (
                <ExternalLink
                  key={link.id}
                  href={link.url}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-sage/30 bg-paper-card px-4 py-2 text-sm font-semibold text-sage-deep hover:bg-sage-soft sm:w-auto"
                >
                  {link.label}
                </ExternalLink>
              ))}
            </div>
          ) : null}
        </div>

        {photo ? (
          <figure className="order-1 overflow-hidden rounded-3xl border border-sage/15 bg-paper-card shadow-card lg:order-2">
            <picture>
              <source
                type="image/webp"
                srcSet={srcSetFor(photo, "webp")}
                sizes="(min-width: 1024px) 17rem, 100vw"
              />
              <img
                src={defaultSrc(photo)}
                srcSet={srcSetFor(photo, "jpg")}
                sizes="(min-width: 1024px) 17rem, 100vw"
                width={photo.width}
                height={photo.height}
                {...{ fetchpriority: "high" }}
                alt={photo.alt}
                className="aspect-[4/5] w-full object-cover"
                style={photo.focal ? { objectPosition: photo.focal } : undefined}
              />
            </picture>
            {photo.caption ? (
              <figcaption className="px-4 py-3 text-xs leading-relaxed text-ink-muted">
                {photo.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : (
          <div className="order-1 rounded-3xl border border-sage/15 bg-paper-card p-6 shadow-card lg:order-2">
            <p className="text-xs font-medium uppercase tracking-wide text-sage-deep">
              Mily Fan Site
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              写真はまだありません。
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
            最新情報へ
          </a>
        </aside>
      ) : null}
    </section>
  );
}
