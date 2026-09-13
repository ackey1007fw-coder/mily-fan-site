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
        "timestamp": "1:34:37",
        "title": "The Villains' Halloween \"Into the Frenzy\"",
        "artist": "東京ディズニーランド",
        "youtubeUrl": "https://www.youtube.com/watch?v=48rO35UGlc8",
        "youtubeVersionNote": "リンク先は権利者配信のショー音源全編（約27分）です。放送で流れた抜粋区間とは長さが異なります。"
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
        "timestamp": "2:42:30",
        "title": "同担☆拒否",
        "artist": "HoneyWorks",
        "youtubeUrl": "https://www.youtube.com/watch?v=FbTtjs6OZ20",
        "youtubeVersionNote": "リンク先は公式MVのちゅーたん（CV：早見沙織）歌唱版です。放送内の曲紹介では歌唱者を特定できていません。"
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
    "note": "曲紹介から確認した15曲を掲載しています。時刻は録音内の曲紹介の目安です。YouTubeの歌唱版・リマスター・ショー全編など、放送との違いや未確認事項は各曲に注記しています。手動での全編聴取は未実施です。"
  },
  {
    "id": "2026-09-06-august-memories",
    "date": "2026-09-06",
    "dateLabel": "2026.09.06（日）",
    "theme": "8月の思い出",
    "broadcastLabel": "10:00〜13:00 生放送",
    "songs": [
      {
        "timestamp": "0:06:13",
        "title": "日曜日の恋人たち",
        "artist": "サニーデイ・サービス",
        "youtubeUrl": "https://www.youtube.com/watch?v=ZuegBbQzvG4"
      },
      {
        "timestamp": "0:13:25",
        "title": "It's Great To Be Here",
        "artist": "Jackson 5",
        "youtubeUrl": "https://www.youtube.com/watch?v=BnQnq5PiSaI",
        "youtubeVersionNote": "リンク先は権利者配信のアルバム版。"
      },
      {
        "timestamp": "0:38:50",
        "title": "Help Me, Rhonda",
        "artist": "The Beach Boys",
        "youtubeUrl": "https://www.youtube.com/watch?v=j1THDLgL_bs",
        "youtubeVersionNote": "リンク先は権利者配信のステレオ版。"
      },
      {
        "timestamp": "0:57:07",
        "title": "勝手にシンドバッド",
        "artist": "サザンオールスターズ",
        "youtubeUrl": "https://www.youtube.com/watch?v=11XPLPc4ULE",
        "youtubeVersionNote": "リンク先は2024年リマスター版。"
      },
      {
        "timestamp": "1:11:24",
        "title": "創聖のアクエリオン",
        "artist": "AKINO",
        "youtubeUrl": "https://www.youtube.com/watch?v=W6DOkcLlIgE"
      }
    ],
    "sourceLabel": "2026/09/06 放送内の曲紹介・各楽曲の公式公開情報",
    "verifiedAt": "2026-09-14",
    "note": "この回はみりぃの出演がないため、曲紹介を確認できた5曲を簡単に記録しています。全曲リストではありません。時刻は録音内の目安です。"
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
        "timestamp": "0:34:46",
        "title": "Edelweiss",
        "artist": "Julie Andrews",
        "youtubeUrl": "https://www.youtube.com/watch?v=0wXP6LYzVZE",
        "youtubeVersionNote": "リンク先はジュリー・アンドリュースのソロ歌唱音源です。放送で使用された録音との同一性は未確認です。"
      },
      {
        "timestamp": "0:42:25",
        "title": "One Short Day",
        "artist": "Cynthia Erivo, Ariana Grande, Kristin Chenoweth & Idina Menzel",
        "youtubeUrl": "https://www.youtube.com/watch?v=aCTmVliv4XM",
        "youtubeVersionNote": "映画『ウィキッド ふたりの魔女』英語版サウンドトラック。"
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
    "note": "ゲスト：清水美依紗。曲紹介の文字起こしから確認した14曲を掲載しています。時刻は録音内の目安です。リンク先の録音・映像の版は各曲の注記もご確認ください。"
  }
];

export function radioMusicSongCount(
  episodes: readonly RadioMusicEpisode[] = radioMusicEpisodes,
): number {
  return episodes.reduce((count, episode) => count + episode.songs.length, 0);
}
