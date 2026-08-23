import { activities } from "../data/activities";
import { socials } from "../data/socials";
import { SECTION_ANCHOR_OFFSET } from "../lib/navigation";
import { EmptyState } from "./EmptyState";
import { ExternalLink } from "./ExternalLink";

const HOME_FOLLOW_PLATFORMS = ["x", "instagram", "tiktok", "showroom"] as const;

const platformLabel: Record<(typeof HOME_FOLLOW_PLATFORMS)[number], string> = {
  x: "X",
  instagram: "Instagram",
  tiktok: "TikTok",
  showroom: "SHOWROOM",
};

const chipClass =
  "inline-flex min-h-11 items-center rounded-full border border-sage/25 bg-paper-card px-4 py-2 text-sm font-semibold text-sage-deep hover:bg-sage-soft";
const radioChipClass =
  "inline-flex min-h-11 items-center rounded-full border border-sage/30 bg-sage-soft/70 px-4 py-2 text-sm font-semibold text-sage-deep hover:bg-sage-soft";

/**
 * ホーム上部の compact Follow。
 * 本人SNSは socials.ts、ラジオ導線は activities.ts の radio identity / route。
 * 番組・主催者リンク（links.ts）は混ぜない。
 */
export function Socials() {
  const items = HOME_FOLLOW_PLATFORMS.map((platform) =>
    socials.find((item) => item.platform === platform),
  ).filter((item) => item !== undefined);
  const radioActivity = activities.find((activity) => activity.id === "radio");

  return (
    <section id="links" className={`${SECTION_ANCHOR_OFFSET} px-4 pb-6 pt-1`}>
      <div className="mx-auto max-w-3xl rounded-3xl border border-sage/15 bg-paper-card px-5 py-4 shadow-card sm:px-6">
        <h2 className="text-lg font-bold text-ink">Follow Mily</h2>
        <p className="mt-1 text-sm text-ink-muted">
          本人SNSと、ラジオのページ。
        </p>
        {items.length === 0 && !radioActivity ? (
          <div className="mt-4">
            <EmptyState
              title="リンクはまだありません"
              body="今はリンクがありません。"
            />
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {items.length > 0 ? (
              <ul aria-label="本人SNS" className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <li key={item.id}>
                    <ExternalLink href={item.url} className={chipClass}>
                      {platformLabel[
                        item.platform as (typeof HOME_FOLLOW_PLATFORMS)[number]
                      ] ?? item.platform}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            ) : null}
            {radioActivity ? (
              <ul aria-label="ラジオ" className="flex flex-wrap gap-2">
                <li>
                  <a href={radioActivity.route} className={radioChipClass}>
                    {radioActivity.label}
                  </a>
                </li>
              </ul>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
