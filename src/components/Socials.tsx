import { links } from "../data/links";
import { socials } from "../data/socials";
import { EmptyState } from "./EmptyState";
import { ExternalLink } from "./ExternalLink";

export function Socials() {
  const hasAny = socials.length > 0 || links.length > 0;

  return (
    <section id="links" className="scroll-mt-24 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-ink">SNS / リンク</h2>
        <p className="mt-2 text-sm text-ink-muted">
          本人のSNSは、確認できたものだけを載せます。未確認のURLは追加しません。
        </p>
        {!hasAny ? (
          <div className="mt-6">
            <EmptyState
              title="確認できたリンクはまだありません"
              body="本人アカウントと分かったSNSから、ここに追加していきます。"
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
            {links.length > 0 ? (
              <ul className="space-y-3">
                {links.map((item) => (
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
