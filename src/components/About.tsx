import { highlights } from "../data/highlights";
import { profile } from "../data/profile";

export function About() {
  return (
    <section id="about" className="scroll-mt-24 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-ink">プロフィール</h2>
        <p className="mt-2 text-sm text-ink-muted">
          確認できている最小限の情報だけです。推測はしません。
        </p>
        <div className="mt-6 rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-ink-muted">呼び名</dt>
              <dd className="mt-1 text-lg font-semibold text-ink">
                {profile.displayName}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-muted">氏名</dt>
              <dd className="mt-1 text-lg font-semibold text-ink">
                {profile.legalName}
              </dd>
            </div>
          </dl>
          <p className="mt-5 text-sm leading-relaxed text-ink-muted">
            {profile.summary}
          </p>
          {profile.facts.length > 0 ? (
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              {profile.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs text-ink-muted">{fact.label}</dt>
                  <dd className="mt-1 text-sm text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-5 rounded-xl bg-sage-soft/60 px-4 py-3 text-sm text-sage-deep">
              誕生日・出身・所属などの詳細は、公開情報を確認してから追加します。
            </p>
          )}
        </div>
        {highlights.length > 0 ? (
          <ol className="mt-6 space-y-3">
            {highlights.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card"
              >
                <p className="text-xs text-ink-muted">{item.year}</p>
                <p className="mt-1 font-semibold text-ink">{item.title}</p>
                {item.body ? (
                  <p className="mt-2 text-sm text-ink-muted">{item.body}</p>
                ) : null}
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </section>
  );
}
