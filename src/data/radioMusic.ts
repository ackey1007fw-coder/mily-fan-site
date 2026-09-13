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
export const radioMusicEpisodes: RadioMusicEpisode[] = [
  {
    "id": "2026-09-13-solo-theme",
    "date": "2026-09-13",
    "dateLabel": "2026.09.13（日）",
    "theme": "一人○○",
    "broadcastLabel": "10:00〜13:00 生放送",
    "songs": [
      {
        "timestamp": "0:06:35",
        "title": "タッタ",
        "artist": "ゆず",
        "youtubeUrl": "https://www.youtube.com/watch?v=R-FRuQzdw8U"
      },
      {
        "timestamp": "0:13:23",
        "title": "アイドル",
        "artist": "YOASOBI",
        "youtubeUrl": "https://www.youtube.com/watch?v=ZRtdQ81jPUQ"
      },
      {
        "timestamp": "0:26:30",
        "title": "Thinking Out Loud",
        "artist": "Ed Sheeran",
        "youtubeUrl": "https://www.youtube.com/watch?v=lp-EO5I60KA"
      },
      {
        "timestamp": "0:38:18",
        "title": "Butterfly",
        "artist": "木村カエラ",
        "youtubeUrl": "https://www.youtube.com/watch?v=h5b-tBZfsT8"
      },
      {
        "timestamp": "0:55:35",
        "title": "瞳をとじて",
        "artist": "平井 堅",
        "youtubeUrl": "https://www.youtube.com/watch?v=EqVoCfSwfUY"
      },
      {
        "timestamp": "1:10:47",
        "title": "ひゅるりらぱっぱ",
        "artist": "tuki.",
        "youtubeUrl": "https://www.youtube.com/watch?v=AOfaWrBwo7I"
      },
      {
        "timestamp": "1:22:11",
        "title": "MORE THAN LiKE",
        "artist": "BiSH",
        "youtubeUrl": "https://www.youtube.com/watch?v=Jzg0oBf-47A"
      },
      {
        "timestamp": "1:47:27",
        "title": "Brand New",
        "artist": "Mrs. GREEN APPLE",
        "youtubeUrl": "https://www.youtube.com/watch?v=dePs7UPp6GQ"
      },
      {
        "timestamp": "1:56:50",
        "title": "世界はひとりじゃなかった",
        "artist": "大槻マキ",
        "youtubeUrl": "https://www.youtube.com/watch?v=M4GMCh8tdlY"
      },
      {
        "timestamp": "2:11:18",
        "title": "Blue Jeans",
        "artist": "HANA",
        "youtubeUrl": "https://www.youtube.com/watch?v=r_AOa3yVz8A"
      },
      {
        "timestamp": "2:20:39",
        "title": "恋におちて -Fall in love-",
        "artist": "小林明子",
        "youtubeUrl": "https://www.youtube.com/watch?v=dbHPwFo_28o"
      },
      {
        "timestamp": "2:32:05",
        "title": "創造",
        "artist": "星野源",
        "youtubeUrl": "https://www.youtube.com/watch?v=74FIsXlS0EQ"
      },
      {
        "timestamp": "2:54:27",
        "title": "優しさに溢れた世界で",
        "artist": "Saucy Dog",
        "youtubeUrl": "https://www.youtube.com/watch?v=F7xTTkmGE1Y"
      }
    ],
    "sourceLabel": "2026年9月13日 放送内の曲紹介・各アーティスト／権利者の公式公開情報",
    "verifiedAt": "2026-09-13",
    "note": "曲紹介の自動文字起こしを一部区間の再認識結果で再照合し、曲名・アーティストと公式公開先を確認した楽曲を掲載しています。手動での全編聴取は未実施です。時刻は録音開始から曲紹介箇所までの目安です。YouTubeは各公開元の映像へ案内します。"
  }
];

export function radioMusicSongCount(
  episodes: readonly RadioMusicEpisode[] = radioMusicEpisodes,
): number {
  return episodes.reduce((count, episode) => count + episode.songs.length, 0);
}
