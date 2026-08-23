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

/**
 * ホームの compact Follow。本人SNS（socials.ts）だけを出す。
 * 番組・主催者リンク（links.ts）は混ぜない。
 */
export function Socials() {
  const items = HOME_FOLLOW_PLATFORMS.map((platform) =>
    socials.find((item) => item.platform === platform),
  ).filter((item) => item !== undefined);

  return (
    <section id="links" className={`${SECTION_ANCHOR_OFFSET} px-4 py-8`}>
      <div className="mx-auto max-w-3xl">
        <h2 className="text-xl font-bold text-ink">Follow Mily</h2>
        <p className="mt-2 text-sm text-ink-muted">みりぃさんの本人SNS。</p>
        {items.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="リンクはまだありません"
              body="今はリンクがありません。"
            />
          </div>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-2">
            {items.map((item) => (
              <li key={item.id}>
                <ExternalLink
                  href={item.url}
                  className="inline-flex min-h-11 items-center rounded-full border border-sage/25 bg-paper-card px-4 py-2 text-sm font-semibold text-sage-deep hover:bg-sage-soft"
                >
                  {platformLabel[item.platform as (typeof HOME_FOLLOW_PLATFORMS)[number]] ??
                    item.platform}
                </ExternalLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
