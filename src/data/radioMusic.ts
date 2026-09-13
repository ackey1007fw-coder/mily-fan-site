export type RadioMusicSong = {
  timestamp?: string;
  title: string;
  artist: string;
  youtubeUrl: string;
  youtubeVersionNote?: string;
};

export type RadioMusicEpisode = {
  id: string;
  date: string;
  dateLabel: string;
  theme: string;
  broadcastLabel: string;
  songs: RadioMusicSong[];
  sourceLabel: string;
  verifiedAt: string;
  note?: string;
};

/** Confirmed on-air songs from FM湘南マジックウェイブ「湘南シーサイドサークル」. */
export const radioMusicEpisodes: RadioMusicEpisode[] = [];

export function radioMusicSongCount(
  episodes: readonly RadioMusicEpisode[] = radioMusicEpisodes,
): number {
  return episodes.reduce((count, episode) => count + episode.songs.length, 0);
}
