import { defaultSrc, featuredPhoto, srcSetFor } from "./data/media";
import { contest } from "./data/contest";
import { links } from "./data/links";
import {
  profile,
  profileSources,
  type ProfileSourceId,
} from "./data/profile";
import { highlights } from "./data/highlights";
import { ExternalLink } from "./components/ExternalLink";
import { Footer } from "./components/Footer";

const profileNav = [
  { href: "#basics", label: "基本情報" },
  { href: "#activities", label: "活動" },
  { href: "#favorites", label: "好きなもの" },
  { href: "#timeline", label: "歩み" },
  { href: "#sources", label: "出典" },
];

const radioProgramTikTok = links.find(
  (link) => link.id === "fm-smw-ssc-tiktok",
);

function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
}

function SourceLinks({ sourceIds }: { sourceIds: ProfileSourceId[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-2" aria-label="この内容の出典">
      {sourceIds.map((sourceId) => {
        const source = profileSources[sourceId];
        return (
          <li key={source.id}>
            <ExternalLink
              href={source.url}
              className="inline-flex min-h-11 items-center rounded-full border border-sage/25 bg-paper px-3 py-2 text-xs font-medium leading-snug text-sage-deep hover:bg-sage-soft"
            >
              {source.title}
            </ExternalLink>
          </li>
        );
      })}
    </ul>
  );
}

function ProfileHeader() {
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

function ProfileHero() {
  const photo = featuredPhoto();

  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-10 sm:pb-14 sm:pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-14 h-56 w-56 rounded-full bg-sage-soft"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-14 bottom-0 h-40 w-40 rounded-full bg-apricot-soft"
      />
      <div className="relative mx-auto grid max-w-3xl gap-8 sm:grid-cols-[minmax(0,1fr)_15rem] sm:items-center">
        <div className="min-w-0">
          <p className="inline-flex rounded-full bg-sage-soft px-3 py-1 text-xs font-medium text-sage-deep">
            ファン運営・非公式プロフィール
          </p>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Mily Profile
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {profile.displayName}
          </h1>
          <p className="mt-2 text-xs font-medium text-ink-muted">公表名</p>
          <p className="mt-1 text-xl font-semibold text-ink">{profile.publicName}</p>
          <p className="mt-1 text-sm text-ink-muted">{profile.aliases.join(" / ")}</p>
          <p className="mt-5 text-base leading-8 text-ink">{profile.summary}</p>
          <p className="mt-4 text-xs leading-relaxed text-ink-muted">
            {formatDate(profile.lastVerifiedAt)}時点
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ExternalLink
              href={contest.entryUrl}
              className="inline-flex min-h-11 items-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
            >
              ENTRY 734を見る
            </ExternalLink>
            <a
              href="#basics"
              className="inline-flex min-h-11 items-center rounded-full border border-sage/30 bg-paper-card px-5 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft"
            >
              プロフィールを読む
            </a>
          </div>
        </div>

        {photo ? (
          <figure className="mx-auto w-full max-w-60 overflow-hidden rounded-3xl border border-sage/15 bg-paper-card shadow-card">
            <picture>
              <source
                type="image/webp"
                srcSet={srcSetFor(photo, "webp")}
                sizes="(min-width: 640px) 15rem, 60vw"
              />
              <img
                src={defaultSrc(photo)}
                srcSet={srcSetFor(photo, "jpg")}
                sizes="(min-width: 640px) 15rem, 60vw"
                width={photo.width}
                height={photo.height}
                fetchPriority="high"
                alt={photo.alt}
                className="aspect-[4/5] w-full object-cover"
                style={photo.focal ? { objectPosition: photo.focal } : undefined}
              />
            </picture>
          </figure>
        ) : null}
      </div>
    </section>
  );
}

function ProfileBasics() {
  return (
    <section id="basics" className="scroll-mt-24 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
          At a glance
        </p>
        <h2 className="mt-2 text-2xl font-bold text-ink">ひと目でわかる基本情報</h2>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {profile.facts.map((fact) => (
            <div
              key={fact.id}
              className="min-w-0 rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card"
            >
              <dt className="text-xs font-medium text-ink-muted">{fact.label}</dt>
              <dd className="mt-1 text-lg font-semibold leading-snug text-ink">
                {fact.value}
              </dd>
              {fact.detail ? (
                <dd className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {fact.detail}
                </dd>
              ) : null}
              {fact.asOf ? (
                <dd className="mt-2 text-xs text-ink-muted">
                  {formatDate(fact.asOf)}時点
                </dd>
              ) : null}
              <dd>
                <SourceLinks sourceIds={fact.sourceIds} />
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 rounded-3xl border border-apricot/35 bg-apricot-soft/70 p-6 shadow-card sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-apricot-ink">
            Her vision
          </p>
          <p className="mt-3 text-xl font-bold leading-relaxed text-ink">
            {profile.vision.title}
          </p>
          <p className="mt-3 text-sm leading-7 text-ink-muted">{profile.vision.body}</p>
          {profile.vision.asOf ? (
            <p className="mt-3 text-xs text-ink-muted">
              {formatDate(profile.vision.asOf)}時点
            </p>
          ) : null}
          <SourceLinks sourceIds={profile.vision.sourceIds} />
        </div>
      </div>
    </section>
  );
}

function ProfileActivities() {
  return (
    <section id="activities" className="scroll-mt-24 px-4 py-10 [content-visibility:auto] [contain-intrinsic-size:900px]">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
          Activities
        </p>
        <h2 className="mt-2 text-2xl font-bold text-ink">みりぃの活動</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {profile.activities.map((activity) => (
            <article
              key={activity.id}
              className="min-w-0 rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-deep">
                {activity.eyebrow}
              </p>
              <h3 className="mt-2 text-lg font-bold leading-snug text-ink">
                {activity.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-ink-muted">{activity.body}</p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink">
                {activity.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-apricot" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              {activity.id === "miss-circle" && contest.currentPhase ? (
                <div className="mt-4 rounded-xl border border-sage/15 bg-sage-soft/45 p-4">
                  <p className="text-xs font-semibold text-sage-deep">現在の審査段階</p>
                  <p className="mt-1 font-bold leading-snug text-ink">
                    {contest.currentPhase.name}
                  </p>
                  <p className="mt-2 text-xs text-ink-muted">
                    {formatDate(contest.lastVerifiedAt)}時点
                  </p>
                  <ExternalLink
                    href={contest.currentPhase.source}
                    className="mt-3 inline-flex min-h-11 items-center rounded-full border border-sage/25 bg-paper px-3 py-2 text-xs font-medium leading-snug text-sage-deep hover:bg-sage-soft"
                  >
                    審査段階の出典を見る
                  </ExternalLink>
                </div>
              ) : null}
              {activity.id === "radio" && radioProgramTikTok ? (
                <div className="mt-4 rounded-xl border border-sage/15 bg-sage-soft/45 p-4">
                  <p className="text-xs font-semibold text-sage-deep">
                    番組側TikTok
                  </p>
                  <ExternalLink
                    href={radioProgramTikTok.url}
                    className="mt-2 inline-flex min-h-11 items-center rounded-full border border-sage/25 bg-paper px-3 py-2 text-xs font-medium leading-snug text-sage-deep hover:bg-sage-soft"
                  >
                    {radioProgramTikTok.label}
                  </ExternalLink>
                </div>
              ) : null}
              {activity.asOf ? (
                <p className="mt-4 text-xs text-ink-muted">
                  {formatDate(activity.asOf)}時点
                </p>
              ) : null}
              <SourceLinks sourceIds={activity.sourceIds} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionBody({
  items,
  note,
  sourceIds,
  asOf,
}: {
  items: string[];
  note: string;
  sourceIds: ProfileSourceId[];
  asOf?: string;
}) {
  return (
    <>
      <p className="mt-3 text-sm leading-7 text-ink-muted">{note}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-sage/15 bg-sage-soft/60 px-3 py-2 text-sm leading-snug text-sage-deep"
          >
            {item}
          </li>
        ))}
      </ul>
      {asOf ? (
        <p className="mt-4 text-xs text-ink-muted">{formatDate(asOf)}時点</p>
      ) : null}
      <SourceLinks sourceIds={sourceIds} />
    </>
  );
}

function ProfileCollections() {
  return (
    <section id="favorites" className="scroll-mt-24 px-4 py-10 [content-visibility:auto] [contain-intrinsic-size:1100px]">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
          More about Mily
        </p>
        <h2 className="mt-2 text-2xl font-bold text-ink">音楽・好きなもの・意外な一面</h2>
        <div className="mt-6 space-y-4">
          {profile.collections.map((collection) =>
            collection.collapsed ? (
              <details
                key={collection.id}
                className="group rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card"
              >
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-bold text-ink [&::-webkit-details-marker]:hidden">
                  <span>{collection.title}</span>
                  <span aria-hidden="true" className="text-sage transition group-open:rotate-45">
                    ＋
                  </span>
                </summary>
                <CollectionBody
                  items={collection.items}
                  note={collection.note}
                  sourceIds={collection.sourceIds}
                  asOf={collection.asOf}
                />
              </details>
            ) : (
              <article
                key={collection.id}
                className="rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card"
              >
                <h3 className="text-lg font-bold text-ink">{collection.title}</h3>
                <CollectionBody
                  items={collection.items}
                  note={collection.note}
                  sourceIds={collection.sourceIds}
                  asOf={collection.asOf}
                />
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function ProfileTimeline() {
  return (
    <section id="timeline" className="scroll-mt-24 px-4 py-10 [content-visibility:auto] [contain-intrinsic-size:650px]">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
          Timeline
        </p>
        <h2 className="mt-2 text-2xl font-bold text-ink">挑戦の歩み</h2>
        <ol className="mt-6 border-l-2 border-sage/20 pl-5">
          {highlights.map((item) => (
            <li key={item.id} className="relative pb-6 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute -left-[1.66rem] top-1.5 h-3 w-3 rounded-full border-2 border-paper bg-sage"
              />
              <p className="text-xs font-medium text-ink-muted">
                {item.dateLabel ?? `${item.year}年`}
              </p>
              <h3 className="mt-1 font-bold leading-snug text-ink">{item.title}</h3>
              {item.body ? (
                <p className="mt-2 text-sm leading-7 text-ink-muted">{item.body}</p>
              ) : null}
              <p className="mt-3">
                <ExternalLink
                  href={item.source}
                  className="inline-flex min-h-11 items-center rounded-full border border-sage/25 bg-paper-card px-3 py-2 text-xs font-medium text-sage-deep hover:bg-sage-soft"
                >
                  出典を見る
                </ExternalLink>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProfileSources() {
  return (
    <section id="sources" className="scroll-mt-24 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-sage/15 bg-paper-card p-6 shadow-card sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
          Sources
        </p>
        <h2 className="mt-2 text-2xl font-bold text-ink">出典</h2>
        <ol className="mt-5 space-y-3">
          {Object.values(profileSources).map((source, index) => (
            <li key={source.id} className="rounded-2xl bg-sage-soft/45 p-4">
              <p className="text-xs text-ink-muted">{index + 1}. {source.publisher}</p>
              <ExternalLink
                href={source.url}
                className="mt-1 inline-flex min-h-11 items-center font-semibold leading-snug text-sage-deep hover:underline"
              >
                {source.title}
              </ExternalLink>
              <p className="mt-1 text-xs text-ink-muted">
                {formatDate(source.verifiedAt)}時点
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <a
        href="#profile-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-sage focus:px-4 focus:py-2 focus:text-white"
      >
        本文へスキップ
      </a>
      <ProfileHeader />
      <main id="profile-main">
        <ProfileHero />
        <nav aria-label="プロフィール内ナビ" className="px-4">
          <div className="mx-auto flex max-w-3xl flex-wrap gap-2 rounded-2xl border border-sage/15 bg-paper-card p-3 shadow-card">
            {profileNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center rounded-full px-3 py-2 text-sm font-medium text-sage-deep hover:bg-sage-soft"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
        <ProfileBasics />
        <ProfileActivities />
        <ProfileCollections />
        <ProfileTimeline />
        <ProfileSources />
      </main>
      <Footer />
    </div>
  );
}
