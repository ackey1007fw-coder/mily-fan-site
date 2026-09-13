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
  },
  {
    "id": "2026-08-30-movie-special",
    "date": "2026-08-30",
    "dateLabel": "2026.08.30（日）",
    "theme": "映画特集",
    "broadcastLabel": "10:00〜13:00 生放送",
    "songs": [
      {
        "timestamp": "0:06:32",
        "title": "You're Welcome",
        "artist": "Dwayne Johnson",
        "youtubeUrl": "https://www.youtube.com/watch?v=79DijItQXMM"
      },
      {
        "timestamp": "0:26:05",
        "title": "Out There",
        "artist": "Tony Jay & Tom Hulce",
        "youtubeUrl": "https://www.youtube.com/watch?v=nE91BwrH79E",
        "youtubeVersionNote": "公式公開の2021年リマスター版です。放送で使用されたマスターとは異なる場合があります。"
      },
      {
        "timestamp": "0:57:32",
        "title": "ラストダンスあなたと",
        "artist": "MISIA",
        "youtubeUrl": "https://www.youtube.com/watch?v=m4UuJWVt4Zc"
      },
      {
        "timestamp": "1:11:17",
        "title": "素敵じゃないか",
        "artist": "サニーデイ・サービス",
        "youtubeUrl": "https://www.youtube.com/watch?v=V6UddO4c-tM",
        "youtubeVersionNote": "公式配信の2025年リマスター版です。"
      },
      {
        "timestamp": "1:25:08",
        "title": "HANABI",
        "artist": "いきものがかり",
        "youtubeUrl": "https://www.youtube.com/watch?v=VQLjUZ2bm24"
      },
      {
        "timestamp": "1:37:05",
        "title": "Cosmic Girl",
        "artist": "Jamiroquai",
        "youtubeUrl": "https://www.youtube.com/watch?v=D-NvQ6VJYtE"
      },
      {
        "timestamp": "1:56:50",
        "title": "I Wish",
        "artist": "Stevie Wonder",
        "youtubeUrl": "https://www.youtube.com/watch?v=c7IYSAUj78g"
      },
      {
        "timestamp": "2:11:18",
        "title": "RPG",
        "artist": "SEKAI NO OWARI",
        "youtubeUrl": "https://www.youtube.com/watch?v=Mi9uNu35Gmk"
      },
      {
        "timestamp": "2:23:43",
        "title": "One Love",
        "artist": "嵐",
        "youtubeUrl": "https://www.youtube.com/watch?v=XswwGN-eIs0"
      },
      {
        "timestamp": "2:38:13",
        "title": "何なんw",
        "artist": "藤井 風",
        "youtubeUrl": "https://www.youtube.com/watch?v=Nt6ZwuVzOS4"
      },
      {
        "timestamp": "2:51:54",
        "title": "Good Life",
        "artist": "OneRepublic",
        "youtubeUrl": "https://www.youtube.com/watch?v=jZhQOvvV45w"
      }
    ],
    "sourceLabel": "2026/08/30 放送内の曲紹介・各楽曲の公式公開情報",
    "verifiedAt": "2026-09-13",
    "note": "曲紹介の文字起こしと公開情報を照合しました。時刻は録音内の曲紹介の目安です。曲名または歌唱版の確認が残る2曲は未掲載です。"
  },
  {
    "id": "2026-08-23-musical-special",
    "date": "2026-08-23",
    "dateLabel": "2026.08.23（日）",
    "theme": "真夏のミュージカル特集",
    "broadcastLabel": "10:00〜13:00 生放送",
    "songs": [
      {
        "timestamp": "0:08:07",
        "title": "Starting Now ～新しい私へ",
        "artist": "清水美依紗",
        "youtubeUrl": "https://www.youtube.com/watch?v=eK-Mbzc4m0k"
      },
      {
        "timestamp": "0:23:04",
        "title": "Sun and Moon",
        "artist": "Lea Salonga & Simon Bowman",
        "youtubeUrl": "https://www.youtube.com/watch?v=dEpWEG_MYkI",
        "youtubeVersionNote": "『ミス・サイゴン』1989年オリジナル・ロンドン・キャスト録音。"
      },
      {
        "timestamp": "0:58:14",
        "title": "There's a Fine, Fine Line",
        "artist": "Stephanie D'Abruzzo",
        "youtubeUrl": "https://www.youtube.com/watch?v=y5m6vinIbXY",
        "youtubeVersionNote": "『アベニューQ』オリジナル・ブロードウェイ・キャスト録音。"
      },
      {
        "timestamp": "1:12:37",
        "title": "Dead Mom",
        "artist": "Sophia Anne Caruso",
        "youtubeUrl": "https://www.youtube.com/watch?v=KEct4Nod2iU",
        "youtubeVersionNote": "『ビートルジュース』オリジナル・ブロードウェイ・キャスト録音。"
      },
      {
        "timestamp": "1:26:12",
        "title": "On My Own",
        "artist": "Frances Ruffelle",
        "youtubeUrl": "https://www.youtube.com/watch?v=UwM0U3UcFtw",
        "youtubeVersionNote": "曲紹介で指定された1987年オリジナル・ブロードウェイ版。"
      },
      {
        "timestamp": "1:33:33",
        "title": "Move",
        "artist": "Jennifer Hudson, Beyoncé Knowles & Anika Noni Rose",
        "youtubeUrl": "https://www.youtube.com/watch?v=AoOqNuA1_Vw",
        "youtubeVersionNote": "『ドリームガールズ』映画サウンドトラック。"
      },
      {
        "timestamp": "1:44:32",
        "title": "Reunion",
        "artist": "清水美依紗",
        "youtubeUrl": "https://www.youtube.com/watch?v=7UEZMkMqjVY"
      },
      {
        "timestamp": "1:58:03",
        "title": "Dive",
        "artist": "清水美依紗",
        "youtubeUrl": "https://www.youtube.com/watch?v=SqgjCcOhVw8"
      },
      {
        "timestamp": "2:11:45",
        "title": "Wave",
        "artist": "清水美依紗",
        "youtubeUrl": "https://www.youtube.com/watch?v=wYNS6jIhDpo"
      },
      {
        "timestamp": "2:24:52",
        "title": "Hail Holy Queen",
        "artist": "Deloris & The Sisters",
        "youtubeUrl": "https://www.youtube.com/watch?v=Yev14Ti8_jY",
        "youtubeVersionNote": "『天使にラブ・ソングを…』映画サウンドトラック。"
      },
      {
        "timestamp": "2:37:03",
        "title": "We Go Together",
        "artist": "John Travolta & Olivia Newton-John",
        "youtubeUrl": "https://www.youtube.com/watch?v=b-D8CQPpzqU",
        "youtubeVersionNote": "『グリース』映画サウンドトラック。"
      },
      {
        "timestamp": "2:49:38",
        "title": "Raise You Up / Just Be",
        "artist": "Kinky Boots Original Broadway Cast",
        "youtubeUrl": "https://www.youtube.com/watch?v=flPracw4y3M",
        "youtubeVersionNote": "オリジナル・ブロードウェイ・キャスト版の公式音源。"
      }
    ],
    "sourceLabel": "2026/08/23 放送内の曲紹介・各楽曲の公式公開情報",
    "verifiedAt": "2026-09-13",
    "note": "ゲスト：清水美依紗。曲紹介の文字起こしと公開情報を照合しました。時刻は録音内の目安です。歌唱版・公式公開先の確認が残る2曲は未掲載です。"
  }
];

export function radioMusicSongCount(
  episodes: readonly RadioMusicEpisode[] = radioMusicEpisodes,
): number {
  return episodes.reduce((count, episode) => count + episode.songs.length, 0);
}
