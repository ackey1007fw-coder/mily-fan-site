import { contest } from "../data/contest";
import { SECTION_ANCHOR_OFFSET } from "../lib/navigation";
import { SUPPORT_HUB_ROUTE } from "../lib/supportHub";
import { ExternalLink } from "./ExternalLink";

/**
 * ホームの compact Support gateway。
 *
 * Support全体の正規Hubは `/support/`。ホームでは Support Hub を複製せず、
 * 「今できる応援 / 確認済みの予定 / 日程発表待ち」への入口だけを置く。
 * Support Calendar の中身はここへ複製しない。
 * ENTRY番号・ENTRY URLは `src/data/contest.ts` を参照する（文字列で再保存しない）。
 */
export function Support() {
  return (
    <section id="support" className={`${SECTION_ANCHOR_OFFSET} px-4 py-6`}>
      <div className="mx-auto max-w-3xl rounded-3xl border border-sage/15 bg-paper-card p-5 shadow-card sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
          Support
        </p>
        <h2 className="mt-2 text-2xl font-bold text-ink">応援・予定</h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          今できる応援、確認済みの予定、日程発表待ちはSupport Hubにまとめています。
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <a
            href={SUPPORT_HUB_ROUTE}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
          >
            Support Hubを見る
          </a>
          <ExternalLink
            href={contest.entryUrl}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-sage/30 bg-paper px-5 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft"
          >
            {contest.entryNumber}を応援する
          </ExternalLink>
        </div>
      </div>
    </section>
  );
}
