import { profile } from "../data/profile";

const previewFactIds = new Set(["hometown", "university", "special-skill", "fan-name"]);

export function About() {
  const previewFacts = profile.facts.filter((fact) => previewFactIds.has(fact.id));

  return (
    <section id="about" className="scroll-mt-24 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-3xl border border-sage/15 bg-paper-card shadow-card">
          <div className="bg-sage-soft/70 px-5 py-6 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
              Meet Mily
            </p>
            <h2 className="mt-2 text-2xl font-bold text-ink">みりぃをもっと知る</h2>
            <p className="mt-3 text-sm leading-7 text-ink-muted">{profile.summary}</p>
          </div>
          <div className="p-5 sm:p-8">
            <dl className="grid gap-3 sm:grid-cols-2">
              {previewFacts.map((fact) => (
                <div key={fact.id} className="rounded-2xl bg-paper px-4 py-3">
                  <dt className="text-xs text-ink-muted">{fact.label}</dt>
                  <dd className="mt-1 font-semibold text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm leading-7 text-ink-muted">
              ラジオ、吹奏楽、SHOWROOM、大学生コンテスト、好きなものまで。確認済みの公開情報を、出典付きの専用ページにまとめました。
            </p>
            <a
              href="/profile/"
              className="mt-5 inline-flex min-h-11 items-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
            >
              詳しいプロフィールを見る
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
