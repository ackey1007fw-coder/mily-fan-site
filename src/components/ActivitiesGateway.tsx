import { activities } from "../data/activities";
import { ACTIVITIES_HUB_ROUTE } from "../lib/activityRoute";
import { SECTION_ANCHOR_OFFSET } from "../lib/navigation";

/**
 * ホームの compact Activities gateway。
 *
 * 表示に使うのは `src/data/activities.ts` の identity と route だけ。
 * 現在のphase / rank / 期間などの状態は各活動ページ側の責務なので、
 * ここへコピーしない（activities.ts からも状態を生成しない）。
 */
export function ActivitiesGateway() {
  return (
    <section id="activities" className={`${SECTION_ANCHOR_OFFSET} px-4 pb-6`}>
      <div className="mx-auto max-w-3xl rounded-3xl border border-sage/15 bg-paper-card p-5 shadow-card sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
          Activities
        </p>
        <h2 className="mt-2 text-2xl font-bold text-ink">活動から知る</h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          みりぃの活動を活動単位でたどれます。それぞれの現在情報と記録はActivitiesへ。
        </p>
        <ul aria-label="活動の一覧" className="mt-5 flex flex-wrap gap-2">
          {activities.map((activity) => (
            <li key={activity.id} className="min-w-0">
              <a
                href={activity.route}
                className="inline-flex min-h-11 items-center rounded-full border border-sage/25 bg-sage-soft/60 px-4 py-2 text-sm font-semibold text-sage-deep hover:bg-sage-soft"
              >
                {activity.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-5">
          <a
            href={ACTIVITIES_HUB_ROUTE}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep sm:w-auto"
          >
            Activities Hubを見る
          </a>
        </p>
      </div>
    </section>
  );
}
