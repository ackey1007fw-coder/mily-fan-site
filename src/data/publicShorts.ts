/**
 * Curated PUBLIC-only fan edit video links for Mily.
 * Verified via the owner-uploaded @ouen_archive Shorts shelf on 2026-10-15.
 * These are links to the owner's existing posts, not downloaded/re-hosted media.
 * Do not ingest private/unlisted full recordings or other creators' content here.
 * Song performances remain in /activities/live/clips/ with their own rights notes.
 */
export type PublicShortCategory = "talk" | "gesture" | "audio";
export type PublicShortSlot = "朝" | "昼" | "夜" | "ラジオ" | "配信";
export type PublicShortPlatform = "x" | "instagram" | "tiktok";
export type PublicShort = {
  readonly id: string;
  readonly title: string;
  /** The broadcast or capture date, not YouTube's upload date. */
  readonly streamDate: string;
  readonly slot: PublicShortSlot;
  readonly category: PublicShortCategory;
  readonly recapId?: string;
  readonly durationSeconds?: number;
  readonly socialLinks?: Partial<Record<PublicShortPlatform, string>>;
};

export const PUBLIC_SHORTS_ROUTE = "/activities/live/shorts/" as const;
export const PUBLIC_SHORTS_CHANNEL = "https://www.youtube.com/@ouen_archive/shorts";
export const UNLISTED_OR_UNAPPROVED_VIDEO_IDS = [
  "AcLkrNTC-Sw", // 2026-10-14 night, confirmed unlisted
  "8ZmCS8uIFzo", // 2026-10-14 night, confirmed unlisted
  "KOOyDO8MZuk", // 2026-10-15 full archive, unlisted
] as const;

/** Hand-verified public Shorts, newest *recording day* first. */
export const publicShorts: readonly PublicShort[] = [
  {
    "id": "0lEzZS76oik",
    "title": "応援が自信に変わる朝",
    "streamDate": "2026-10-15",
    "slot": "朝",
    "category": "talk",
    "recapId": "2026-10-15-morning-showroom",
    "durationSeconds": 28,
    "socialLinks": {
      "x": "https://x.com/ackey_RiRi_supp/status/2110698271211425854",
      "instagram": "https://www.instagram.com/reel/Deg4SgzAd8q/",
      "tiktok": "https://www.tiktok.com/@ackeytan_/video/7696859048666238229"
    }
  },
  {
    "id": "0BuivWfuQiY",
    "title": "自分の頑張りも大切に",
    "streamDate": "2026-10-15",
    "slot": "朝",
    "category": "talk",
    "recapId": "2026-10-15-morning-showroom",
    "durationSeconds": 28,
    "socialLinks": {
      "x": "https://x.com/ackey_RiRi_supp/status/2110698031213425048",
      "instagram": "https://www.instagram.com/reel/Deg4LtoiggR/",
      "tiktok": "https://www.tiktok.com/@ackeytan_/video/7696858780952284424"
    }
  },
  {
    "id": "xSUuhUe1WHc",
    "title": "またね！の手ふり",
    "streamDate": "2026-10-14",
    "slot": "昼",
    "category": "gesture",
    "recapId": "2026-10-14-noon-showroom",
    "durationSeconds": 22
  },
  {
    "id": "uevhgq6QAzY",
    "title": "すっぴんデーの笑顔",
    "streamDate": "2026-10-14",
    "slot": "昼",
    "category": "gesture",
    "recapId": "2026-10-14-noon-showroom",
    "durationSeconds": 18
  },
  {
    "id": "V7p9TH_lnJM",
    "title": "アクセルとブレーキの朝トーク",
    "streamDate": "2026-10-14",
    "slot": "朝",
    "category": "audio",
    "recapId": "2026-10-14-morning-showroom",
    "durationSeconds": 24
  },
  {
    "id": "MnMXGTSMRCc",
    "title": "猫の手からハートへ",
    "streamDate": "2026-10-12",
    "slot": "朝",
    "category": "gesture",
    "recapId": "2026-10-12-morning-showroom"
  },
  {
    "id": "P5bphXJwaaw",
    "title": "ラジオ3時間を振り返って",
    "streamDate": "2026-10-11",
    "slot": "夜",
    "category": "talk",
    "recapId": "2026-10-11-night-showroom"
  },
  {
    "id": "XJ1FrmkF8-Y",
    "title": "メイクから三つ編みへ",
    "streamDate": "2026-10-11",
    "slot": "朝",
    "category": "gesture",
    "recapId": "2026-10-11-morning-showroom"
  },
  {
    "id": "9hPii8Yk2ms",
    "title": "応援がうれしい夜",
    "streamDate": "2026-10-08",
    "slot": "夜",
    "category": "talk",
    "recapId": "2026-10-08-night-showroom"
  },
  {
    "id": "Bnv7uihCrDQ",
    "title": "四次審査初日の朝、ありがとう",
    "streamDate": "2026-10-03",
    "slot": "朝",
    "category": "talk",
    "recapId": "2026-10-03-morning-showroom"
  },
  {
    "id": "U0pQNKgr5yo",
    "title": "四次審査へ、応援のお願い",
    "streamDate": "2026-10-02",
    "slot": "夜",
    "category": "talk",
    "recapId": "2026-10-02-night-showroom"
  },
  {
    "id": "c3HTt15l0ro",
    "title": "みんなのよりどころになる場所",
    "streamDate": "2026-10-01",
    "slot": "昼",
    "category": "talk"
  },
  {
    "id": "qfw_s6RsssA",
    "title": "10月最初のおはよう",
    "streamDate": "2026-10-01",
    "slot": "朝",
    "category": "talk",
    "recapId": "2026-10-01-morning-showroom"
  },
  {
    "id": "aYa4KAE-LnM",
    "title": "リボン姿もかわいい",
    "streamDate": "2026-09-30",
    "slot": "昼",
    "category": "gesture"
  },
  {
    "id": "kWrk-Lp3iB0",
    "title": "朝の笑顔",
    "streamDate": "2026-09-30",
    "slot": "配信",
    "category": "gesture"
  },
  {
    "id": "yq0GsaXZ9QI",
    "title": "お互いを照らし合う",
    "streamDate": "2026-09-28",
    "slot": "朝",
    "category": "audio"
  },
  {
    "id": "lLl43vVYyO0",
    "title": "タコ？イカ？ゆらゆらダンス",
    "streamDate": "2026-09-27",
    "slot": "夜",
    "category": "gesture"
  },
  {
    "id": "5JK8DupppFg",
    "title": "ダブルピースからのウインク",
    "streamDate": "2026-09-27",
    "slot": "夜",
    "category": "gesture"
  },
  {
    "id": "ant30v2jT_A",
    "title": "朝のタコ踊り",
    "streamDate": "2026-09-27",
    "slot": "朝",
    "category": "gesture"
  },
  {
    "id": "4-ei2ZZs96I",
    "title": "これからの活動をみんなと相談",
    "streamDate": "2026-09-26",
    "slot": "朝",
    "category": "audio"
  },
  {
    "id": "M9daXYmctro",
    "title": "紫リボンの帽子でおしゃべり",
    "streamDate": "2026-09-25",
    "slot": "夜",
    "category": "talk"
  },
  {
    "id": "DOEm662Cpp8",
    "title": "青いパーカーでおしゃべり",
    "streamDate": "2026-09-25",
    "slot": "朝",
    "category": "talk"
  },
  {
    "id": "pAvOzPjqPkI",
    "title": "初アバター配布の夜",
    "streamDate": "2026-09-24",
    "slot": "夜",
    "category": "talk"
  },
  {
    "id": "Lus1uzQ_LU8",
    "title": "みんなと話すと笑顔に",
    "streamDate": "2026-09-23",
    "slot": "朝",
    "category": "talk"
  },
  {
    "id": "x7KwsFjvcCY",
    "title": "朝メイクのひとこと",
    "streamDate": "2026-09-23",
    "slot": "配信",
    "category": "gesture"
  },
  {
    "id": "gup32N0p6Tc",
    "title": "かわいさに期限なし",
    "streamDate": "2026-09-22",
    "slot": "夜",
    "category": "talk"
  },
  {
    "id": "QtndjoBPU3w",
    "title": "耳つきヘアバンドの夜",
    "streamDate": "2026-09-22",
    "slot": "夜",
    "category": "gesture"
  },
  {
    "id": "9_QswQA5Pjk",
    "title": "お腹の音も聞こえちゃう？",
    "streamDate": "2026-09-21",
    "slot": "ラジオ",
    "category": "audio"
  },
  {
    "id": "2gdXjtTRd4I",
    "title": "ラジオも楽しませちゃうぞ",
    "streamDate": "2026-09-21",
    "slot": "ラジオ",
    "category": "audio"
  },
  {
    "id": "OnYV7IlyXyA",
    "title": "配信が本当に楽しい",
    "streamDate": "2026-09-20",
    "slot": "朝",
    "category": "talk"
  },
  {
    "id": "_R8Cpummxp8",
    "title": "メイクの仕上がりの笑顔",
    "streamDate": "2026-09-19",
    "slot": "昼",
    "category": "gesture"
  },
  {
    "id": "viIb9j6QOu4",
    "title": "出会ってくれてありがとう",
    "streamDate": "2026-09-19",
    "slot": "朝",
    "category": "talk"
  },
  {
    "id": "FrmbREbT3SE",
    "title": "みりぃって呼んでね",
    "streamDate": "2026-09-19",
    "slot": "朝",
    "category": "talk"
  },
  {
    "id": "wMWy1Dmaq9E",
    "title": "はじめまして！みりぃです",
    "streamDate": "2026-09-18",
    "slot": "配信",
    "category": "talk"
  },
  {
    "id": "0JR37d8ZNdU",
    "title": "「みりぃ」ってどういう意味？",
    "streamDate": "2026-09-18",
    "slot": "朝",
    "category": "talk"
  }
];

export function publicShortUrl(video: Pick<PublicShort, "id">): string {
  return "https://www.youtube.com/shorts/" + video.id;
}

/** Third-party player is only loaded after a visitor actively chooses to play. */
export function publicShortEmbedUrl(video: Pick<PublicShort, "id">): string {
  return "https://www.youtube-nocookie.com/embed/" + video.id + "?autoplay=1&playsinline=1";
}

export function publicShortRecapUrl(video: PublicShort): string {
  return video.recapId
    ? "/activities/live/#recap-" + video.recapId
    : "/activities/live/";
}

export const shortCategoryLabels: Record<PublicShortCategory, string> = {
  talk: "トーク",
  gesture: "表情・しぐさ",
  audio: "音声中心",
};
