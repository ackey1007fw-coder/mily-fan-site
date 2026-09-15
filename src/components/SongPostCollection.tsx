import { streamRecaps } from "../data/streamRecaps";
import { songPostGroups } from "../data/streamSongPosts";

const groups = songPostGroups(streamRecaps);
const labels = { youtube: "YouTubeで見る", tiktok: "TikTokで見る", instagram: "リールで見る", x: "Xで見る" };
const colors = { youtube: "bg-red-700 text-white", tiktok: "bg-ink text-white", instagram: "bg-purple-700 text-white", x: "bg-ink text-white" };

export default function SongPostCollection() {
  return (
    <section id="social-song-posts" aria-labelledby="social-song-title" className="px-4 pb-14">
      <div className="mx-auto max-w-3xl">
        <h2 id="social-song-title" className="text-2xl font-bold text-ink sm:text-3xl">歌声をSNSで楽しむ</h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">あっきーの応援アカウントに掲載された歌唱動画へ。好きなサービスで、みりぃの歌声を楽しめます。各リンクは新しいタブで開きます。</p>
        <div className="mt-6 space-y-8">
          {groups.map(({ recap, songs }) => (
            <article key={recap.id} className="overflow-hidden rounded-3xl border border-sage/20 bg-paper-card shadow-card">
              {recap.image ? (
                <figure className="relative">
                  <img src={recap.image.src} alt={recap.image.alt} width={recap.image.width} height={recap.image.height} loading="lazy" className="max-h-80 w-full bg-sage-soft object-contain" />
                  <figcaption className="absolute bottom-3 left-3 rounded-full bg-paper/95 px-3 py-1 text-xs text-ink">この配信の写真</figcaption>
                </figure>
              ) : null}
              <div className="p-5 sm:p-6">
                <p className="text-xs font-semibold tracking-wide text-sage-deep">{recap.dateLabel} · {songs.length}場面</p>
                <h3 className="mt-2 text-xl font-bold leading-relaxed">{recap.theme}</h3>
                <ul className="mt-5 divide-y divide-sage/20">
                  {songs.map(({ song, links }) => (
                    <li key={song.title} className="py-4 first:pt-0">
                      <h4 className="text-lg font-bold leading-relaxed">{song.title}</h4>
                      <p className="mt-1 text-sm text-ink-muted">{song.artist}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {links.map(link => (
                          <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`${song.title} — ${labels[link.platform]}（新しいタブ）`} className={`inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${colors[link.platform]}`}>{labels[link.platform]} ↗</a>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
                <a href={`/activities/live/#recap-${recap.id}`} className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-sage-deep underline underline-offset-4">この回の配信レポート・原曲リンクを見る →</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
