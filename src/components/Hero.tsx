import { profile } from "../data/profile";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-4 pb-12 pt-10 sm:pb-16 sm:pt-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-10 h-48 w-48 rounded-full bg-sage-soft"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 bottom-4 h-32 w-32 rounded-full bg-apricot-soft"
      />
      <div className="relative mx-auto max-w-3xl">
        <p className="inline-flex rounded-full bg-sage-soft px-3 py-1 text-xs font-medium text-sage-deep">
          ファン制作・非公式サイト
        </p>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          {profile.displayName}
        </h1>
        <p className="mt-2 text-lg text-ink-muted">{profile.legalName}</p>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink">
          確認できた活動情報だけを、ゆっくり残していくファンサイトです。
          公式・公認・本人運営ではありません。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#latest"
            className="inline-flex min-h-11 items-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
          >
            最新情報を見る
          </a>
          <a
            href="#schedule"
            className="inline-flex min-h-11 items-center rounded-full border border-sage/30 bg-paper-card px-5 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft"
          >
            スケジュールへ
          </a>
        </div>
      </div>
    </section>
  );
}
