import { useState } from "react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import {
  PUBLIC_SHORTS_CHANNEL,
  publicShorts,
  publicShortEmbedUrl,
  publicShortRecapUrl,
  publicShortUrl,
  shortCategoryLabels,
  type PublicShort,
  type PublicShortCategory,
  type PublicShortPlatform,
} from "./data/publicShorts";

type CategoryFilter = "all" | PublicShortCategory;

const filters: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "すべて" },
  { id: "talk", label: "トーク" },
  { id: "gesture", label: "表情・しぐさ" },
  { id: "audio", label: "音声中心" },
];
const socialLabels: Record<PublicShortPlatform, string> = {
  x: "X",
  instagram: "Instagram",
  tiktok: "TikTok",
};
const socialPlatforms: PublicShortPlatform[] = ["x", "instagram", "tiktok"];
const PAGE_SIZE = 12;

function ShortCard({
  item,
  isPlaying,
  onPlay,
}: {
  item: PublicShort;
  isPlaying: boolean;
  onPlay: () => void;
}) {
  const isAudio = item.category === "audio";
  const visualSymbol = item.category === "gesture" ? "🍅" : isAudio ? "🎧" : "🌻";
  return (
    <li className="min-w-0">
      <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-sage/20 bg-paper-card shadow-card">
        <div className="p-3 sm:p-4">
          <div className="relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-2xl bg-gradient-to-br from-sage-deep via-ink to-sage-deep text-paper">
            {isPlaying ? (
              <iframe
                title={"みりぃのショート「" + item.title + "」"}
                src={publicShortEmbedUrl(item)}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0 bg-black"
              />
            ) : (
              <button
                type="button"
                onClick={onPlay}
                aria-label={"「" + item.title + "」をYouTubeプレーヤーで再生"}
                className="group absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-5 overflow-hidden p-5 text-center focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-apricot"
              >
                <span className="absolute -left-16 top-12 h-44 w-44 rounded-full border border-paper/15" aria-hidden="true" />
                <span className="absolute -right-14 bottom-8 h-44 w-44 rounded-full border border-paper/15" aria-hidden="true" />
                <span className="relative text-5xl" aria-hidden="true">{visualSymbol}</span>
                <span className="relative max-w-[16rem] break-words text-lg font-bold leading-relaxed">{item.title}</span>
                <span className="relative flex items-end gap-1" aria-hidden="true">
                  {[15, 28, 19, 38, 26, 42, 16, 34, 21, 30, 15].map((height, index) => (
                    <span key={index} className="w-1 rounded-full bg-apricot" style={{ height: height + "px" }} />
                  ))}
                </span>
                <span className="relative rounded-full bg-paper px-5 py-3 text-sm font-bold text-sage-deep shadow-card transition-transform group-hover:scale-105">
                  ▶ タップして再生
                </span>
                <span className="relative text-xs text-paper/85">非公式ファン編集・YouTube公開動画</span>
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4 pt-0 sm:p-5 sm:pt-0">
          <p className="text-xs font-semibold tracking-wide text-sage-deep">
            {item.streamDate.replace(/-/g, ".")}・{item.slot}配信
            <span className="ml-2 rounded-full bg-sage-soft px-2 py-1 text-[11px]">{shortCategoryLabels[item.category]}</span>
          </p>
          <h2 className="mt-3 break-words text-lg font-bold leading-relaxed text-ink">{item.title}</h2>
          {item.durationSeconds ? (
            <p className="mt-1 text-xs text-ink-muted">約{item.durationSeconds}秒</p>
          ) : null}
          <p className="mt-2 flex-1 text-xs leading-6 text-ink-muted">
            みりぃ本人の公開済みショート。配信の一場面をファン編集で振り返ります。
            {isAudio ? " この回は声を中心にお楽しみください。" : ""}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={publicShortUrl(item)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-full bg-sage px-4 py-2 text-sm font-bold text-white hover:bg-sage-deep"
              aria-label={item.title + "をYouTubeで開く（新しいタブ）"}
            >
              YouTubeで見る ↗
            </a>
            <a
              href={publicShortRecapUrl(item)}
              className="inline-flex min-h-11 items-center rounded-full border border-sage/30 px-4 py-2 text-sm font-semibold text-sage-deep hover:bg-sage-soft"
            >
              配信レポートへ
            </a>
          </div>
          {socialPlatforms.some((platform) => Boolean(item.socialLinks?.[platform])) ? (
            <div className="mt-3 flex flex-wrap gap-3 border-t border-sage/15 pt-3">
              {socialPlatforms.map((platform) => {
                const link = item.socialLinks?.[platform];
                return link ? (
                  <a key={platform} href={link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-xs font-semibold text-sage-deep underline underline-offset-4"
                    aria-label={item.title + "を" + socialLabels[platform] + "で開く（新しいタブ）"}
                  >
                    {socialLabels[platform]} ↗
                  </a>
                ) : null;
              })}
            </div>
          ) : null}
        </div>
      </article>
    </li>
  );
}

export default function ShortsPage() {
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const filtered = publicShorts.filter((item) => filter === "all" || item.category === filter);
  const visible = filtered.slice(0, visibleCount);

  const selectFilter = (next: CategoryFilter) => {
    setFilter(next);
    setVisibleCount(PAGE_SIZE);
    setActiveVideo(null);
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-ink">
      <Header />
      <main>
        <header className="bg-gradient-to-br from-sage-soft via-paper to-apricot/10 px-4 pb-10 pt-10 sm:pt-14">
          <div className="mx-auto max-w-5xl">
            <nav aria-label="パンくず" className="flex flex-wrap gap-x-2 text-sm text-ink-muted">
              <a href="/" className="font-semibold text-sage-deep hover:underline">ホーム</a>
              <span aria-hidden="true">/</span>
              <a href="/activities/live/" className="font-semibold text-sage-deep hover:underline">LIVE STREAM</a>
              <span aria-hidden="true">/</span><span>ショート動画</span>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-sage-deep">Mily Short Moments</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">みりぃのショート動画 🍅</h1>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-ink-muted sm:text-base">
              かわいい表情も、思いのこもった声も、ほんの数十秒でまた会える。
              SHOWROOMの配信から生まれた、みりぃ（三橋莉子 / Mily）の公開済みファン編集ショートを集めました。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-paper-card px-4 py-2 text-sm font-bold text-sage-deep shadow-sm">
                確認済み {publicShorts.length}本
              </span>
              <span className="rounded-full bg-paper-card px-4 py-2 text-sm font-medium text-ink-muted shadow-sm">
                2026年10月15日時点の掲載確認
              </span>
            </div>
            <p className="mt-4 text-xs leading-6 text-ink-muted">
              非公式ファンサイトです。動画は投稿済みの公開ショートだけを案内し、限定公開・非公開のアーカイブや第三者の動画は掲載しません。
              曲を歌った場面は<a href="/activities/live/clips/" className="mx-1 font-semibold text-sage-deep underline underline-offset-4">歌唱クリップ</a>で別にご覧いただけます。
            </p>
          </div>
        </header>
        <section className="px-4 pb-16 pt-9" aria-labelledby="short-archive-title">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">Public Clip Archive</p>
                <h2 id="short-archive-title" className="mt-1 text-2xl font-bold sm:text-3xl">ショートを探す</h2>
              </div>
              <a href={PUBLIC_SHORTS_CHANNEL} target="_blank" rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-full border border-sage/30 px-4 py-2 text-sm font-semibold text-sage-deep hover:bg-sage-soft">
                応援アーカイブのShorts一覧 ↗
              </a>
            </div>
            <div role="group" aria-label="動画の種類で絞り込む" className="mt-6 flex flex-wrap gap-2">
              {filters.map((item) => (
                <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => selectFilter(item.id)}
                  className={"min-h-11 rounded-full border px-5 py-2 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage " +
                    (filter === item.id ? "border-sage bg-sage text-white" : "border-sage/30 bg-paper-card text-sage-deep hover:bg-sage-soft")}>
                  {item.label}
                </button>
              ))}
            </div>
            <p role="status" aria-live="polite" className="mt-4 text-xs text-ink-muted">
              {filtered.length}本中 {visible.length}本を表示しています。新しい配信日のものから順に掲載。
            </p>
            <ol className="mt-6 grid min-w-0 grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((item) => (
                <ShortCard
                  key={item.id}
                  item={item}
                  isPlaying={activeVideo === item.id}
                  onPlay={() => setActiveVideo(item.id)}
                />
              ))}
            </ol>
            {filtered.length > visible.length ? (
              <div className="mt-8 text-center">
                <button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className="min-h-11 rounded-full bg-sage px-8 py-3 text-sm font-bold text-white hover:bg-sage-deep">
                  もっと見る（残り{filtered.length - visible.length}本）
                </button>
              </div>
            ) : null}
            <p className="mt-10 rounded-2xl bg-sage-soft/60 p-5 text-xs leading-7 text-ink-muted">
              このページの各カードは1つの場面を表しています。同じ場面をX・Instagram・TikTokにも公開した場合は、確認済みの投稿だけを1枚のカード内にまとめています。
              再生ボタンを押したときだけYouTubeのプレーヤーを読み込みます。動画が再生できない場合は「YouTubeで見る」から開いてください。
              公開状態は投稿先で変更される場合があります。
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
