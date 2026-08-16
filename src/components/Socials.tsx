import { links } from "../data/links";
import { socials } from "../data/socials";
import { EmptyState } from "./EmptyState";
import { ExternalLink } from "./ExternalLink";

const ENTRY_LINK_ID = "miss-circle-2026-734";
const FM_LINK_IDS = new Set([
  "fm-smw-mily-profile",
  "fm-smw-ssc-program",
  "fm-smw-ssc-instagram",
  "fm-smw-staff",
]);

export function Socials() {
  const entryLink = links.find((item) => item.id === ENTRY_LINK_ID);
  const fmLinks = links.filter((item) => FM_LINK_IDS.has(item.id));
  const otherLinks = links.filter(
    (item) => item.id !== ENTRY_LINK_ID && !FM_LINK_IDS.has(item.id),
  );
  const hasAny = socials.length > 0 || links.length > 0;

  return (
    <section id="links" className="scroll-mt-24 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-ink">Follow Mily</h2>
        <p className="mt-2 text-sm text-ink-muted">みりぃさんのSNSと関連リンク。</p>
        {!hasAny ? (
          <div className="mt-6">
            <EmptyState
              title="リンクはまだありません"
              body="準備ができ次第、ここに並べます。"
            />
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {socials.length > 0 ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {socials.map((item) => (
                  <li key={item.id}>
                    <ExternalLink
                      href={item.url}
                      className="block rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card hover:border-sage/40"
                    >
                      <span className="text-xs uppercase tracking-wide text-ink-muted">
                        {item.platform}
                      </span>
                      <span className="mt-1 block font-semibold text-ink">
                        {item.label}
                      </span>
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            ) : null}

            {entryLink ? (
              <div className="rounded-2xl border-2 border-sage/40 bg-sage-soft/60 p-5 shadow-card">
                <p className="text-xs font-medium uppercase tracking-wide text-sage-deep">
                  MISS CIRCLE CONTEST 2026
                </p>
                <p className="mt-1 font-semibold text-ink">{entryLink.label}</p>
                {entryLink.note ? (
                  <p className="mt-2 text-sm text-ink-muted">{entryLink.note}</p>
                ) : null}
                <p className="mt-4">
                  <ExternalLink
                    href={entryLink.url}
                    className="inline-flex min-h-11 items-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
                  >
                    エントリーページへ
                  </ExternalLink>
                </p>
              </div>
            ) : null}

            {fmLinks.length > 0 ? (
              <div className="rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card">
                <p className="text-xs font-medium uppercase tracking-wide text-sage-deep">
                  FM湘南マジックウェイブ
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  スタッフページでは、Mily（ミリー）の担当番組として「湘南シーサイドサークル」が確認できます。
                </p>
                <p className="mt-4 flex flex-wrap gap-3">
                  {fmLinks
                    .filter((item) => item.id !== "fm-smw-staff")
                    .map((item) => (
                      <ExternalLink
                        key={item.id}
                        href={item.url}
                        className="inline-flex min-h-11 items-center rounded-full border border-sage/30 bg-paper px-5 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft"
                      >
                        {item.label}
                      </ExternalLink>
                    ))}
                </p>
              </div>
            ) : null}

            {otherLinks.length > 0 ? (
              <ul className="space-y-3">
                {otherLinks.map((item) => (
                  <li key={item.id}>
                    <ExternalLink
                      href={item.url}
                      className="block rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card"
                    >
                      <span className="font-semibold text-ink">{item.label}</span>
                      {item.note ? (
                        <span className="mt-1 block text-sm text-ink-muted">
                          {item.note}
                        </span>
                      ) : null}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
