import { news } from "../data/news";
import { EmptyState } from "./EmptyState";
import { ExternalLink } from "./ExternalLink";

export function Latest() {
  return (
    <section id="latest" className="scroll-mt-24 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-ink">最新情報</h2>
        <p className="mt-2 text-sm text-ink-muted">
          確認できた更新だけを載せます。未確認の話題は入れません。
        </p>
        {news.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="まだ掲載できる最新情報はありません"
              body="出典が確認できたお知らせから、ここに追加していきます。"
            />
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {news.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card"
              >
                <p className="text-xs text-ink-muted">{item.date}</p>
                <p className="mt-1 font-semibold text-ink">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {item.body}
                </p>
                {item.url ? (
                  <p className="mt-3">
                    <ExternalLink
                      href={item.url}
                      className="text-sm font-medium text-sage hover:underline"
                    >
                      出典を見る
                    </ExternalLink>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
