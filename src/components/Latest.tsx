import { news, sortNewsByDateDesc } from "../data/news";
import { EmptyState } from "./EmptyState";
import { ExternalLink } from "./ExternalLink";

export function Latest() {
  const latestNews = sortNewsByDateDesc(news);

  return (
    <section id="latest" className="scroll-mt-24 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-ink">最新情報</h2>
        <p className="mt-2 text-sm text-ink-muted">みりぃさんの近況とお知らせ。</p>
        {latestNews.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="お知らせはまだありません"
              body="更新があり次第、ここに載せていきます。"
            />
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {latestNews.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card"
              >
                <p className="text-xs text-ink-muted">{item.date}</p>
                <p className="mt-1 font-semibold text-ink">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {item.body}
                </p>
                <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                  <ExternalLink
                    href={item.source}
                    className="text-sm font-medium text-sage hover:underline"
                  >
                    出典を見る
                  </ExternalLink>
                  {item.url && item.url !== item.source ? (
                    <ExternalLink
                      href={item.url}
                      className="text-sm font-medium text-sage hover:underline"
                    >
                      関連リンク
                    </ExternalLink>
                  ) : null}
                </p>
                {item.ctaLabel ? (
                  <p className="mt-4">
                    <ExternalLink
                      href={item.url ?? item.source}
                      className="inline-flex min-h-11 items-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
                    >
                      {item.ctaLabel}
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
