/**
 * 2026-08-24 朝の本人Instagram Story本文だけの text-only crop。
 * オーナーが当該画像の NEWS 掲載を明示承認。Latest / NEWS 専用。
 * 埋め込みSHOWROOM画面（視聴者アバター・表示名・コメント・視聴者数）は
 * 1ピクセルも公開派生に含めない。
 * Gallery・/stories/・Activity 関連メディアには展開しない。
 * 恒久permalinkはないため sourceUrl は持たない。
 */
export const morningMakeupInstagramStoryImage = {
  id: "mily-b24-02-morning-makeup-instagram-story",
  kind: "image" as const,
  src: "/media/news/mily-b24-02-morning-makeup-instagram-story-text-only.jpg",
  width: 1500,
  height: 480,
  alt: "初メイク配信について理由と朝配信への感謝を伝える三橋莉子さんのInstagram Story本文",
  caption:
    "2026年8月24日の本人Instagram Story本文。初メイク配信の理由と朝配信への感謝、夜枠は改めて連絡する旨が書かれている。",
  provenance: "owner-provided",
  sourceDate: "2026-08-24",
} as const;
