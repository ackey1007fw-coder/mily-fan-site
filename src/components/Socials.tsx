import { Radio } from "lucide-react";
import { activities } from "../data/activities";
import { socials } from "../data/socials";
import {
  HOME_FOLLOW_HEADING,
  HOME_FOLLOW_LEAD,
  HOME_RADIO_CTA,
  HOME_RADIO_LEAD,
} from "../lib/homePortal";
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
  "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-sage/25 bg-paper-card px-4 py-2 text-sm font-semibold text-sage-deep hover:bg-sage-soft";

function PlatformIcon({
  platform,
}: {
  platform: (typeof HOME_FOLLOW_PLATFORMS)[number];
}) {
  const common = {
    viewBox: "0 0 16 16",
    className: "h-4 w-4 shrink-0",
    "aria-hidden": true as const,
  };

  if (platform === "x") {
    return (
      <svg {...common}>
        <path
          fill="currentColor"
          d="M12.6 1H15L9.7 7.1 15.9 15h-3.6l-4.2-5.7L3.8 15H1.3l5.6-6.5L1 1h3.7l3.8 5.2L12.6 1zm-1.3 12.6h1.1L4.8 2.3H3.6l7.7 11.3z"
        />
      </svg>
    );
  }

  if (platform === "instagram") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2.25" y="2.25" width="11.5" height="11.5" rx="3.2" />
        <circle cx="8" cy="8" r="2.7" />
        <circle cx="11.35" cy="4.65" r="0.7" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (platform === "tiktok") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M10.4 1.2h1.7c.2 1.5 1.1 2.7 2.6 3.1v1.8c-.9 0-1.8-.3-2.6-.8v4.7c0 2.6-2.1 4.6-4.8 4.6S2.5 12.6 2.5 10s2.1-4.6 4.8-4.6c.3 0 .5 0 .8.1v1.9c-.2-.1-.5-.1-.8-.1-1.6 0-2.8 1.3-2.8 2.8s1.3 2.8 2.8 2.8 2.8-1.3 2.8-2.8V1.2z" />
      </svg>
    );
  }

  return (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3.2" width="12" height="8.2" rx="1.6" />
      <path d="M5.2 14h5.6M8 11.4V14" />
      <circle cx="8" cy="7.3" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Hero内の compact Follow と、別CTAのラジオ導線。
 * 本人SNSは socials.ts、ラジオ導線は activities.ts の radio identity / route。
 * 番組・主催者リンク（links.ts）は混ぜない。
 */
export function Socials() {
  const items = HOME_FOLLOW_PLATFORMS.map((platform) =>
    socials.find((item) => item.platform === platform),
  ).filter((item) => item !== undefined);
  const radioActivity = activities.find((activity) => activity.id === "radio");

  return (
    <div id="links" className={`${SECTION_ANCHOR_OFFSET} mt-6`}>
      <h2 className="text-sm font-semibold text-ink">{HOME_FOLLOW_HEADING}</h2>
      <p className="mt-1 text-sm text-ink-muted">{HOME_FOLLOW_LEAD}</p>
      {items.length === 0 && !radioActivity ? (
        <div className="mt-3">
          <EmptyState
            title="リンクはまだありません"
            body="今はリンクがありません。"
          />
        </div>
      ) : (
        <>
          {items.length > 0 ? (
            <ul aria-label="本人SNS" className="mt-3 flex flex-wrap gap-2">
              {items.map((item) => {
                const platform =
                  item.platform as (typeof HOME_FOLLOW_PLATFORMS)[number];

                return (
                  <li key={item.id}>
                    <ExternalLink href={item.url} className={chipClass}>
                      <PlatformIcon platform={platform} />
                      {platformLabel[platform] ?? item.platform}
                    </ExternalLink>
                  </li>
                );
              })}
            </ul>
          ) : null}
          {radioActivity ? (
            <div className="mt-4" role="group" aria-label="ラジオ">
              <a
                href={radioActivity.route}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-sage/40 bg-sage-soft/60 px-5 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft sm:w-auto"
              >
                <Radio className="h-4 w-4 shrink-0" aria-hidden="true" />
                {HOME_RADIO_CTA}
              </a>
              <p className="mt-1.5 text-xs text-ink-muted">{HOME_RADIO_LEAD}</p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
