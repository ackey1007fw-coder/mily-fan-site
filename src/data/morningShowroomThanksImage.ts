/**
 * 2026-08-31 朝の本人X投稿に添付された SHOWROOM 配信画面。
 * 花束を抱えるみりぃと、画面下部の視聴者アバターが写る縦長スクリーンショット。
 * Latest / NEWS 専用。Gallery / media.ts / galleryVideos には出さない
 * （視聴者アバター・表示名を含む公開配信画面のため、b17 花火画面と同じ扱い）。
 * LIVE STREAM Activity の関連メディアには selectActivityMedia 経由で出る。
 * オーナーが依頼時に直接提供。SNS CDN からは取得していない。
 * 公開 JPEG は metadata 除去のみ。crop・scale・AI 加工なし。
 */
export const MORNING_SHOWROOM_THANKS_X_URL =
  "https://x.com/Mily_chan36/status/2094192106105659650";

export const morningShowroomThanksImage = {
  id: "mily-b44-01-morning-showroom-thanks",
  kind: "image" as const,
  src: "/media/news/mily-b44-01-morning-showroom-thanks.jpg",
  width: 1500,
  height: 2435,
  alt: "花束を抱えるみりぃが写ったSHOWROOM配信画面。画面下部に視聴者のアバターが並んでいる",
  caption:
    "2026年8月31日の本人X投稿。朝の配信に来てくれた人へのお礼として公開されたSHOWROOM画面。",
  provenance: "owner-provided" as const,
  sourceUrl: MORNING_SHOWROOM_THANKS_X_URL,
  sourceDate: "2026-08-31",
} as const;
