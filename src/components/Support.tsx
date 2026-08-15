import { profile } from "../data/profile";
import { ExternalLink } from "./ExternalLink";

const VOTE_URL = "https://2026.misscircle.jp/entry/734";

export function Support() {
  return (
    <section id="support" className="scroll-mt-24 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-ink">応援する</h2>
        <p className="mt-2 text-sm text-ink-muted">
          {profile.displayName}（{profile.legalName}）さんのエントリーを、ファンとして応援できます。
          このサイトはファン制作の非公式サイトです。
        </p>
        <div className="mt-6 rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-sage-deep">
            MISS CIRCLE CONTEST 2026
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            ENTRY 734
          </p>
          <p className="mt-1 text-base text-ink-muted">
            {profile.displayName} / {profile.legalName}
          </p>
          <p className="mt-6">
            <ExternalLink
              href={VOTE_URL}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-sage px-6 py-3 text-base font-semibold text-white hover:bg-sage-deep sm:w-auto"
            >
              投票ページを見る
            </ExternalLink>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            投票方法や最新情報はリンク先でご確認ください。
          </p>
        </div>
      </div>
    </section>
  );
}
