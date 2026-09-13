import { ExternalLink } from "./components/ExternalLink";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import {
  radioMusicEpisodes,
  radioMusicSongCount,
} from "./data/radioMusic";

const episodes = [...radioMusicEpisodes].sort((a, b) => b.date.localeCompare(a.date));
const songCount = radioMusicSongCount(episodes);

export default function RadioMusicPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />
      <main>
        <header className="px-4 pb-8 pt-10 sm:pb-10 sm:pt-14">
          <div className="mx-auto max-w-3xl">
            <nav aria-label="パンくず" className="text-sm text-ink-muted">
              <a href="/activities/" className="font-semibold text-sage-deep underline underline-offset-4">Activities</a>
              <span aria-hidden="true" className="px-2">/</span>
              <a href="/activities/radio/" className="font-semibold text-sage-deep underline underline-offset-4">RADIO</a>
              <span aria-hidden="true" className="px-2">/</span>
              <span>On Air Music</span>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-apricot-ink">On Air Music</p>
            <h1 className="mt-2 text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">ラジオで流れた楽曲</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
              「湘南シーサイドサークル」の放送で確認できた楽曲を、放送回ごとにまとめる非公式アーカイブです。
            </p>
            <div className="mt-5 rounded-2xl border border-apricot/30 bg-apricot-soft/45 p-4 text-sm leading-7 text-ink-muted">
              <p><strong className="text-ink">{songCount}曲掲載中。</strong> 曲名・アーティストを確認でき、公開YouTubeリンクも確認できた楽曲だけを掲載します。</p>
              <p className="mt-2">放送音源や歌詞は掲載しません。リンク先の楽曲・映像の権利は各権利者に帰属します。</p>
            </div>
          </div>
        </header>

        <section aria-labelledby="radio-music-title" className="px-4 pb-14">
          <div className="mx-auto max-w-3xl">
            <h2 id="radio-music-title" className="sr-only">オンエア楽曲一覧</h2>
            {episodes.length === 0 ? (
              <div className="rounded-3xl border border-sage/20 bg-paper-card p-6 shadow-card">
                <p className="font-bold text-ink">確認済みの曲目を準備中です。</p>
                <p className="mt-2 text-sm leading-7 text-ink-muted">放送後に曲名・アーティスト・YouTubeリンクを照合できたものから追加します。</p>
              </div>
            ) : (
              <div className="space-y-8">
                {episodes.map((episode) => (
                  <article key={episode.id} className="rounded-3xl border border-sage/20 bg-paper-card p-5 shadow-card sm:p-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">{episode.dateLabel}</p>
                    <h2 className="mt-2 text-2xl font-bold text-ink">{episode.theme}</h2>
                    <p className="mt-2 text-sm text-ink-muted">{episode.broadcastLabel}</p>
                    {episode.note ? <p className="mt-3 text-sm leading-7 text-ink-muted">{episode.note}</p> : null}
                    <ol className="mt-6 space-y-3">
                      {episode.songs.map((song, index) => (
                        <li key={`${episode.id}-${song.timestamp ?? index}-${song.title}`} className="rounded-2xl border border-sage/15 bg-sage-soft/30 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0 flex-1 break-words">
                              <p className="text-xs font-semibold text-sage-deep">#{index + 1}{song.timestamp ? ` · ${song.timestamp}` : ""}</p>
                              <h3 className="mt-1 text-lg font-bold leading-relaxed text-ink">{song.title}</h3>
                              <p className="mt-1 text-sm text-ink-muted">{song.artist}</p>
                            </div>
                            <ExternalLink href={song.youtubeUrl} className="inline-flex min-h-11 items-center rounded-full border border-sage/30 bg-paper px-4 py-2 text-sm font-bold text-sage-deep">
                              YouTubeで聴く ↗
                            </ExternalLink>
                          </div>
                          {song.youtubeVersionNote ? <p className="mt-3 text-xs leading-6 text-ink-muted">{song.youtubeVersionNote}</p> : null}
                        </li>
                      ))}
                    </ol>
                    <p className="mt-5 text-xs leading-6 text-ink-muted">出典: {episode.sourceLabel} · {episode.verifiedAt.replace(/-/g, ".")}確認</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
