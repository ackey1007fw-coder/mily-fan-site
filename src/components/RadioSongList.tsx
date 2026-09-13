import { ExternalLink } from "./ExternalLink";
import type { RadioMusicEpisode } from "../data/radioMusic";

export function RadioSongList({ episode, headingLevel = "h3" }: { episode: RadioMusicEpisode; headingLevel?: "h3" | "h4" }) {
  const SongTitle = headingLevel;
  return (
<ol className="mt-6 space-y-3">
                      {episode.songs.map((song, index) => (
                        <li key={`${episode.id}-${song.timestamp ?? index}-${song.title}`} className="rounded-2xl border border-sage/15 bg-sage-soft/30 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0 flex-1 break-words">
                              <p className="text-xs font-semibold text-sage-deep">#{index + 1}{song.timestamp ? ` · ${song.timestamp}` : ""}</p>
                              <SongTitle className="mt-1 text-lg font-bold leading-relaxed text-ink">{song.title}</SongTitle>
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
  );
}
