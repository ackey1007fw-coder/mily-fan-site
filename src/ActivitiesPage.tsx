import type { ReactNode } from "react";
import { radioProgram } from "../shared/radio-program.js";
import { ExternalLink } from "./components/ExternalLink";
import { Footer } from "./components/Footer";
import {
  activities,
  type Activity,
  type ActivityId,
} from "./data/activities";
import { contest } from "./data/contest";
import type { NewsItem } from "./data/news";
import {
  selectActivityHighlights,
  selectActivityPageContent,
  type ActivityResource,
} from "./lib/activityContent";
import type { ActivityMediaItem } from "./lib/activityMedia";
import {
  activityByRoute,
  isActivitiesHubRoute,
} from "./lib/activityRoute";
import {
  selectLiveActivityStatus,
  selectRadioActivityStatus,
} from "./lib/activityStatus";
import { useMilyRealtimeStatus } from "./lib/useMilyRealtimeStatus";
import {
  formatSlotDate,
  useStreamSchedule,
} from "./lib/useStreamSchedule";

const primaryCta =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep";
const secondaryCta =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-sage/25 bg-paper px-4 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft";

function formatDate(value: string): string {
  return value.replace(/-/g, ".");
}

function SmartLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return href.startsWith("/") ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <ExternalLink href={href} className={className}>
      {children}
    </ExternalLink>
  );
}

function ActivitiesHeader({ detail = false }: { detail?: boolean }) {
  return (
    <header className="sticky top-0 z-20 border-b border-sage/15 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <a href="/" className="font-semibold tracking-wide text-sage-deep">
          みりぃ ファンサイト
        </a>
        <nav aria-label="Activitiesページ内ナビゲーション" className="flex flex-wrap gap-2">
          {detail ? (
            <a href="/activities/" className={secondaryCta}>
              Activitiesへ戻る
            </a>
          ) : null}
          <a href="/" className={detail ? secondaryCta : primaryCta}>
            ホームへ戻る
          </a>
        </nav>
      </div>
    </header>
  );
}

function StatusLine({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-sage/15 bg-sage-soft/45 px-4 py-3">
      <p className="text-xs font-semibold text-sage-deep">{label}</p>
      <p className="mt-1 font-bold leading-relaxed text-ink">{value}</p>
      {note ? <p className="mt-1 text-xs leading-6 text-ink-muted">{note}</p> : null}
    </div>
  );
}

function HubMissCircleStatus() {
  return contest.currentPhase ? (
    <StatusLine
      label="現在の審査段階"
      value={contest.currentPhase.name}
      note={`${formatDate(contest.lastVerifiedAt)}確認`}
    />
  ) : null;
}

function HubRadioStatus() {
  const { radio, schedulePhase } = useMilyRealtimeStatus();
  const status = selectRadioActivityStatus(radio, schedulePhase);
  return <StatusLine label={status.label} value={status.value} />;
}

function HubLiveStatus() {
  const { live } = useMilyRealtimeStatus();
  const { slots, roomUrl } = useStreamSchedule();
  const status = selectLiveActivityStatus(live, slots, roomUrl);
  if (!status || status.state === "offline") return null;

  return (
    <StatusLine
      label={status.label}
      value={
        status.slot
          ? `${formatSlotDate(status.slot)} ${status.slot.time}〜`
          : status.value
      }
      note={status.slot ? "終了時刻は確認できていません。" : undefined}
    />
  );
}

function HubCampusGirlsStatus() {
  const latest = selectActivityHighlights("campus-girls")[0];
  return latest ? (
    <StatusLine
      label="最新の確認済み記録"
      value={latest.title}
      note={latest.dateLabel}
    />
  ) : null;
}

function HubActivityStatus({ activityId }: { activityId: ActivityId }) {
  if (activityId === "miss-circle") return <HubMissCircleStatus />;
  if (activityId === "radio") return <HubRadioStatus />;
  if (activityId === "live-stream") return <HubLiveStatus />;
  return <HubCampusGirlsStatus />;
}

function ActivityHubCard({ activity }: { activity: Activity }) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-sage/15 bg-paper-card p-5 shadow-card sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
        {activity.eyebrow}
      </p>
      <p className="mt-3 text-sm font-semibold text-apricot-ink">{activity.label}</p>
      <h2 className="mt-1 text-2xl font-bold leading-relaxed text-ink">
        {activity.title}
      </h2>
      <p className="mt-3 grow text-sm leading-7 text-ink-muted">{activity.summary}</p>
      <div className="mt-5">
        <HubActivityStatus activityId={activity.id} />
      </div>
      <p className="mt-5">
        <a href={activity.route} className={primaryCta}>
          詳細を見る
        </a>
      </p>
    </article>
  );
}

function ActivitiesHub() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <a
        href="#activities-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-sage focus:px-4 focus:py-2 focus:text-white"
      >
        本文へスキップ
      </a>
      <ActivitiesHeader />
      <main id="activities-main" className="px-4 pb-16 pt-10 sm:pt-14">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="パンくず" className="text-xs text-ink-muted">
            <a href="/" className="hover:text-sage-deep hover:underline">
              ホーム
            </a>
            <span aria-hidden="true" className="px-2">/</span>
            <span>Activities</span>
          </nav>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-sage-deep">
            Activities
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            みりぃの活動
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
            みりぃは今、何をしている人？ 確認済みの活動情報と、それぞれの歩み・記録を活動単位でたどれます。
          </p>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {activities.map((activity) => (
              <ActivityHubCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ActivityHero({ activity }: { activity: Activity }) {
  return (
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
          <a href="/activities/" className="hover:text-sage-deep hover:underline">
            Activities
          </a>
          <span aria-hidden="true" className="px-2">/</span>
          <span>{activity.label}</span>
        </nav>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-sage-deep">
          {activity.eyebrow}
        </p>
        <p className="mt-3 text-sm font-semibold text-apricot-ink">{activity.label}</p>
        <h1 className="mt-2 text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
          {activity.title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
          {activity.summary}
        </p>
      </div>
    </header>
  );
}

function MissCircleCurrent() {
  if (!contest.currentPhase) return null;
  return (
    <section aria-labelledby="contest-current" className="px-4 pb-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-sage/20 bg-sage-soft/45 p-5 shadow-card sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
          Current
        </p>
        <h2 id="contest-current" className="mt-2 text-2xl font-bold text-ink">
          現在の審査段階
        </h2>
        <p className="mt-4 text-2xl font-bold text-ink">{contest.currentPhase.name}</p>
        <p className="mt-2 text-sm text-ink-muted">
          {formatDate(contest.lastVerifiedAt)}確認
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ExternalLink href={contest.entryUrl} className={primaryCta}>
            ENTRY 734を見る
          </ExternalLink>
          <ExternalLink href={contest.currentPhase.source} className={secondaryCta}>
            審査段階の出典を見る
          </ExternalLink>
        </div>
      </div>
    </section>
  );
}

function RadioCurrent() {
  const { radio, schedulePhase } = useMilyRealtimeStatus();
  const status = selectRadioActivityStatus(radio, schedulePhase);
  return (
    <section aria-labelledby="radio-current" className="px-4 pb-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-apricot/30 bg-apricot-soft/55 p-5 shadow-card sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-apricot-ink">
          Program
        </p>
        <h2 id="radio-current" className="mt-2 text-2xl font-bold text-ink">
          {radioProgram.programName}
        </h2>
        <div className="mt-5" role="status" aria-live="polite">
          <StatusLine label={status.label} value={status.value} note={status.note} />
        </div>
        <p className="mt-3 text-xs leading-6 text-ink-muted">
          番組情報は{formatDate(radioProgram.lastVerifiedAt)}確認。
        </p>
        <p className="mt-5">
          <ExternalLink href={status.href} className={secondaryCta}>
            番組のNOW ON AIRを確認
          </ExternalLink>
        </p>
      </div>
    </section>
  );
}

function LiveCurrent() {
  const { live } = useMilyRealtimeStatus();
  const { slots, roomUrl } = useStreamSchedule();
  const status = selectLiveActivityStatus(live, slots, roomUrl);
  if (!status) return null;

  const value = status.slot
    ? `${formatSlotDate(status.slot)} ${status.slot.time}〜`
    : status.value;
  return (
    <section aria-labelledby="live-current" className="px-4 pb-10">
      <div
        className="mx-auto max-w-3xl rounded-3xl border border-sage/20 bg-sage-soft/45 p-5 shadow-card sm:p-7"
        role="status"
        aria-live="polite"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
          Realtime
        </p>
        <h2 id="live-current" className="mt-2 text-2xl font-bold text-ink">
          ライブ配信の現在情報
        </h2>
        <div className="mt-5">
          <StatusLine
            label={status.label}
            value={value}
            note={status.slot ? "終了時刻は確認できていません。" : undefined}
          />
        </div>
        {status.href ? (
          <p className="mt-5">
            <ExternalLink href={status.href} className={primaryCta}>
              SHOWROOMを見る
            </ExternalLink>
          </p>
        ) : null}
      </div>
    </section>
  );
}

function ActivityCurrent({ activityId }: { activityId: ActivityId }) {
  if (activityId === "miss-circle") return <MissCircleCurrent />;
  if (activityId === "radio") return <RadioCurrent />;
  if (activityId === "live-stream") return <LiveCurrent />;
  return null;
}

function SectionShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-sage/15 px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function ActivityNews({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;
  return (
    <SectionShell eyebrow="Latest" title="関連する最新情報">
      <ul className="mt-6 space-y-4">
        {items.map((item) => {
          const ctaHref = item.url ?? item.source;
          return (
            <li key={item.id} className="rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card">
              <time dateTime={item.date} className="text-xs text-ink-muted">
                {formatDate(item.date)}
              </time>
              <h3 className="mt-2 text-lg font-bold leading-relaxed text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-muted">{item.body}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {item.source ? (
                  <ExternalLink href={item.source} className="text-sm font-semibold text-sage hover:underline">
                    {item.sourceLabel ?? "出典を見る"}
                  </ExternalLink>
                ) : item.sourceLabel ? (
                  <span className="text-sm font-medium text-ink-muted">{item.sourceLabel}</span>
                ) : null}
                {item.url && item.url !== item.source ? (
                  <SmartLink href={item.url} className="text-sm font-semibold text-sage hover:underline">
                    関連ページを見る
                  </SmartLink>
                ) : null}
              </div>
              {item.ctaLabel && ctaHref ? (
                <p className="mt-4">
                  <SmartLink href={ctaHref} className={secondaryCta}>
                    {item.ctaLabel}
                  </SmartLink>
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}

function ActivityHighlights({
  items,
}: {
  items: ReturnType<typeof selectActivityHighlights>;
}) {
  if (items.length === 0) return null;
  return (
    <SectionShell eyebrow="History" title="確認済みの歩み">
      <ol className="mt-6 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card">
            {item.dateLabel ? <p className="text-xs text-ink-muted">{item.dateLabel}</p> : null}
            <h3 className="mt-1 text-lg font-bold leading-relaxed text-ink">{item.title}</h3>
            {item.body ? <p className="mt-2 text-sm leading-7 text-ink-muted">{item.body}</p> : null}
            <p className="mt-3">
              <ExternalLink href={item.source} className="text-sm font-semibold text-sage hover:underline">
                出典を見る
              </ExternalLink>
            </p>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}

function ActivityStories({ items }: { items: ReturnType<typeof selectActivityPageContent>["stories"] }) {
  if (items.length === 0) return null;
  return (
    <SectionShell eyebrow="Stories" title="関連するSTORY">
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((story) => (
          <li key={story.slug} className="rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card">
            <p className="text-xs font-semibold text-sage-deep">{story.eyebrow}</p>
            <p className="mt-2 text-xs text-ink-muted">{story.dateLabel}</p>
            <h3 className="mt-2 text-lg font-bold leading-relaxed text-ink">{story.cardTitle}</h3>
            <p className="mt-2 text-sm leading-7 text-ink-muted">{story.cardDescription}</p>
            <p className="mt-4">
              <a href={story.href} className={secondaryCta}>
                STORYを読む
              </a>
            </p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

function mediaLabel(media: ActivityMediaItem): string {
  if (media.kind === "video" && "label" in media) return media.label;
  return "alt" in media ? media.alt : "みりぃの関連動画";
}

function mediaCaption(media: ActivityMediaItem): string | undefined {
  return "caption" in media ? media.caption : undefined;
}

function ActivityMedia({ items }: { items: ActivityMediaItem[] }) {
  if (items.length === 0) return null;
  return (
    <SectionShell eyebrow="Media" title="関連するメディア">
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((media) => {
          const key = "id" in media ? media.id : media.src;
          const caption = mediaCaption(media);
          return (
            <li key={key} className="overflow-hidden rounded-2xl border border-sage/15 bg-paper-card p-2 shadow-card">
              {media.kind === "video" ? (
                <video
                  src={media.src}
                  poster={media.poster}
                  width={media.width}
                  height={media.height}
                  controls
                  playsInline
                  preload="none"
                  aria-label={mediaLabel(media)}
                  className="mx-auto aspect-[9/16] max-h-[70vh] w-full rounded-xl bg-sage-soft object-contain focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                />
              ) : (
                <img
                  src={media.src}
                  width={media.width}
                  height={media.height}
                  alt={media.alt}
                  loading="lazy"
                  decoding="async"
                  className="max-h-[42rem] w-full rounded-xl bg-sage-soft/30 object-contain"
                />
              )}
              {caption ? <p className="px-3 pb-2 pt-3 text-xs leading-6 text-ink-muted">{caption}</p> : null}
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}

const resourceKindLabel: Record<ActivityResource["kind"], string> = {
  "personal-social": "本人SNS・配信プロフィール",
  "related-link": "関連リンク",
  source: "確認済み出典",
};

function ActivityResources({ items }: { items: ActivityResource[] }) {
  if (items.length === 0) return null;
  return (
    <SectionShell eyebrow="Links & Sources" title="関連リンクと出典">
      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((resource) => (
          <li key={`${resource.kind}-${resource.id}`} className="rounded-2xl border border-sage/15 bg-paper-card p-4 shadow-card">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-sage-deep">
              {resourceKindLabel[resource.kind]}
            </p>
            <p className="mt-2">
              <ExternalLink href={resource.url} className="font-semibold leading-relaxed text-sage hover:underline">
                {resource.label}
              </ExternalLink>
            </p>
            {resource.note ? <p className="mt-2 text-xs leading-6 text-ink-muted">{resource.note}</p> : null}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

function ActivityDetail({ activity }: { activity: Activity }) {
  const content = selectActivityPageContent(activity.id);
  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <a
        href="#activity-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-sage focus:px-4 focus:py-2 focus:text-white"
      >
        本文へスキップ
      </a>
      <ActivitiesHeader detail />
      <main id="activity-main">
        <ActivityHero activity={content.activity} />
        <ActivityCurrent activityId={content.activity.id} />
        <ActivityNews items={content.news} />
        <ActivityHighlights items={content.highlights} />
        <ActivityStories items={content.stories} />
        <ActivityMedia items={content.media} />
        <ActivityResources items={content.resources} />
      </main>
      <Footer />
    </div>
  );
}

export default function ActivitiesPage({ pathname }: { pathname: string }) {
  if (isActivitiesHubRoute(pathname)) return <ActivitiesHub />;
  const activity = activityByRoute(pathname);
  if (!activity) throw new Error(`Activity page not found: ${pathname}`);
  return <ActivityDetail activity={activity} />;
}
