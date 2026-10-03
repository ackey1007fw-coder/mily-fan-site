import type { HomeVoteSpotlight } from "../lib/homePortal";
import { ExternalLink } from "./ExternalLink";

export function VoteSpotlight({
  spotlight,
  className = "",
  headingAs = "h2",
}: {
  spotlight: HomeVoteSpotlight | null;
  className?: string;
  headingAs?: "h2" | "p";
}) {
  if (!spotlight) return null;

  const isLive = spotlight.state === "live";
  const headingClassName =
    "mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl";

  return (
    <aside
      aria-label={spotlight.kind === "support" ? "いまお願いしたい応援" : "MISS CIRCLE WEB投票のご案内"}
      aria-live="polite"
      aria-atomic="true"
      data-vote-state={spotlight.kind === "support" ? undefined : spotlight.state}
      className={`${className} overflow-hidden rounded-3xl border-2 border-apricot bg-gradient-to-br from-apricot-soft via-paper-card to-sage-soft/70 p-5 shadow-card sm:p-6`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="inline-flex rounded-full bg-apricot-ink px-3 py-1 text-xs font-bold tracking-wide text-white">
            {spotlight.eyebrow}
          </p>
          {headingAs === "h2" ? (
            <h2 className={headingClassName}>{spotlight.title}</h2>
          ) : (
            <p className={headingClassName}>{spotlight.title}</p>
          )}
          <p className="mt-2 max-w-2xl whitespace-pre-line text-sm leading-7 text-ink-muted">
            {spotlight.note}
          </p>
        </div>
        <ExternalLink
          href={spotlight.action.url}
          className={`inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-full px-6 py-3 text-base font-bold shadow-card sm:w-auto ${
            isLive
              ? "bg-apricot-ink text-white hover:bg-ink"
              : "border border-apricot bg-paper-card text-apricot-ink hover:bg-apricot-soft"
          }`}
        >
          {spotlight.action.label}
        </ExternalLink>
      </div>
      {spotlight.dailyVote ? (
        <div className="mt-5 border-t border-apricot/40 pt-4">
          <p className="text-base font-bold leading-7 text-ink">{spotlight.dailyVote.dailyLabel}</p>
          <p className="mt-1 text-sm font-semibold text-apricot-ink">{spotlight.dailyVote.deadline}</p>
          <p className="mt-3 text-sm leading-7 text-ink-muted">{spotlight.dailyVote.benefitNote}</p>
          <ExternalLink href={spotlight.dailyVote.announcement.url} className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-sage-deep underline">
            {spotlight.dailyVote.announcement.label}
          </ExternalLink>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {spotlight.dailyVote.contacts.map((contact) => (
              <ExternalLink key={contact.id} href={contact.url} className="inline-flex min-h-11 items-center justify-center rounded-full border border-sage/30 bg-paper-card px-4 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft">
                {contact.label}
              </ExternalLink>
            ))}
          </div>
          <p className="mt-3 text-xs leading-6 text-ink-muted">
            {spotlight.dailyVote.ruleNote}{" "}
            <ExternalLink href={spotlight.dailyVote.dailySource.url} className="font-semibold text-sage-deep underline">{spotlight.dailyVote.dailySource.label}</ExternalLink>
          </p>
        </div>
      ) : null}
    </aside>
  );
}
