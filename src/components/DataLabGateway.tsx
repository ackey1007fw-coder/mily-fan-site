import { DATA_LAB_ROUTE } from "../lib/dataLabRoute";
import { SECTION_ANCHOR_OFFSET } from "../lib/navigation";

/** 公開情報に限定した統計ページへの、ホーム上の入口。 */
export function DataLabGateway() {
  return (
    <section
      id="data-lab"
      aria-labelledby="data-lab-title"
      className={`${SECTION_ANCHOR_OFFSET} px-4 pb-6`}
    >
      <div className="mx-auto max-w-3xl rounded-3xl border border-apricot/40 bg-paper-card p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage-deep">
            Mily Signal · Data Lab
          </p>
          <span className="rounded-full bg-sage-soft px-3 py-1 text-xs font-semibold text-sage-deep">
            公開データの記録
          </span>
        </div>
        <h2 id="data-lab-title" className="mt-3 text-2xl font-bold leading-snug text-ink">
          数字で見る、みりぃの挑戦。🍅
        </h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          MISS CIRCLE 2026 四次審査のSHOWROOM順位や、公開情報に基づく学年別比較。
          70人の公式進出者を名前やEntry番号から探せます。
          独立した外部予測は、確定順位と区別して紹介しています。
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={DATA_LAB_ROUTE}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-deep sm:w-auto"
          >
            データ分析を見る <span aria-hidden="true">↗</span>
          </a>
          <a
            href={`${DATA_LAB_ROUTE}progress/`}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-sage px-5 py-2.5 text-sm font-semibold text-sage-deep transition hover:bg-sage-soft sm:w-auto"
          >
            応援の積み重ねを見る <span aria-hidden="true">↗</span>
          </a>
          <p className="text-xs text-ink-muted">
            2026年10月12日の記録 · 非公式ファン制作
          </p>
        </div>
      </div>
    </section>
  );
}
