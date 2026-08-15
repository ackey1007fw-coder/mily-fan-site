import { media, visibleMedia } from "../data/media";
import { EmptyState } from "./EmptyState";
import { ExternalLink } from "./ExternalLink";

export function Gallery() {
  const items = visibleMedia(media);

  return (
    <section id="gallery" className="scroll-mt-24 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-ink">ギャラリー</h2>
        <p className="mt-2 text-sm text-ink-muted">
          確認できた写真だけを載せます。動画は、用意できたものから追加します。
        </p>
        {items.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="まだ掲載できる写真はありません"
              body="出典が確認できた写真から、ここに残していきます。動画はまだありません。"
            />
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="overflow-hidden rounded-2xl border border-sage/15 bg-paper-card shadow-card"
              >
                {item.kind === "photo" ? (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="aspect-[4/5] w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-sage-soft px-4 text-sm text-sage-deep">
                    動画は準備中です
                  </div>
                )}
                <div className="p-4">
                  {item.caption ? (
                    <p className="text-sm leading-relaxed text-ink">{item.caption}</p>
                  ) : null}
                  <p className={item.caption ? "mt-3" : ""}>
                    <ExternalLink
                      href={item.source}
                      className="text-sm font-medium text-sage hover:underline"
                    >
                      出典を見る
                    </ExternalLink>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
