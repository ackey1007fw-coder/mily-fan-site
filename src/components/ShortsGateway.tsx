import { publicShorts, PUBLIC_SHORTS_ROUTE } from "../data/publicShorts";

type Props = { variant?: "home" | "activity" };

export function ShortsGateway({ variant = "home" }: Props) {
  if (variant === "activity") {
    return (
      <a href={PUBLIC_SHORTS_ROUTE}
        className="mt-4 flex min-w-0 items-center gap-4 rounded-3xl border-2 border-sage/35 bg-gradient-to-r from-sage-soft to-apricot/20 p-5 shadow-card transition-colors hover:bg-sage-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage sm:p-6">
        <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sage text-3xl text-white">▶</span>
        <span className="min-w-0 flex-1">
          <span className="block text-xl font-bold text-ink sm:text-2xl">みりぃのショート動画 🍅</span>
          <span className="mt-1 block text-sm leading-6 text-ink-muted">
            朝の声・笑顔・しぐさをひとまとめ。公開済み{publicShorts.length}本
          </span>
          <span className="mt-3 inline-flex min-h-11 items-center rounded-full bg-sage px-5 py-2 text-sm font-bold text-white">
            切り抜きアーカイブを見る →
          </span>
        </span>
      </a>
    );
  }

  return (
    <section id="mily-shorts-preview" aria-labelledby="mily-shorts-preview-title" className="px-4 pb-7">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-sage/20 bg-paper-card shadow-card">
        <div className="bg-gradient-to-r from-sage-soft via-paper-card to-apricot/15 px-5 py-6 sm:px-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">Mily Short Moments</p>
          <h2 id="mily-shorts-preview-title" className="mt-2 text-2xl font-bold leading-snug text-ink sm:text-3xl">
            みりぃの、好きな瞬間をもう一度 🍅
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink-muted">
            朝の声も、笑顔も、かわいい仕草も。配信から生まれた公開ショート{publicShorts.length}本を、ひとつのアーカイブに。
          </p>
        </div>
        <div className="p-5 sm:p-7">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {publicShorts.slice(0, 2).map((video) => (
              <li key={video.id}>
                <a href={PUBLIC_SHORTS_ROUTE}
                  className="flex min-h-28 items-center gap-4 rounded-2xl border border-sage/20 bg-sage-soft/30 p-4 transition-colors hover:bg-sage-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage">
                  <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-sage-deep text-2xl text-paper">
                    {video.category === "audio" ? "🎧" : "▶"}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-sage-deep">最新・{video.streamDate.replace(/-/g, ".")}</span>
                    <span className="mt-1 block break-words text-sm font-bold leading-6 text-ink">{video.title}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a href={PUBLIC_SHORTS_ROUTE}
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-sage px-6 py-3 text-sm font-bold text-white hover:bg-sage-deep sm:w-auto">
            公開ショート{publicShorts.length}本を見る →
          </a>
          <p className="mt-3 text-xs leading-6 text-ink-muted">
            非公式ファン編集。限定公開のフル配信や、ほかの配信者の動画は含めていません。
          </p>
        </div>
      </div>
    </section>
  );
}
