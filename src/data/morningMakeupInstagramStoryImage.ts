/**
 * 2026-08-24 朝の本人Instagram Story本文の privacy-safe crop。
 * オーナーが当該画像の NEWS 掲載を明示承認。Latest / NEWS 専用。
 * Gallery・/stories/・Activity 関連メディアには展開しない。
 * 恒久permalinkはないため sourceUrl は持たない。
 */
export const morningMakeupInstagramStoryImage = {
  id: "mily-b24-02-morning-makeup-instagram-story",
  kind: "image" as const,
  src: "/media/news/mily-b24-02-morning-makeup-instagram-story-text.jpg",
  width: 1500,
  height: 1450,
  alt: "初メイク配信について理由と朝配信への感謝を伝える三橋莉子さんのInstagram Story",
  caption:
    "2026年8月24日の本人Instagram Story本文。初メイク配信の理由と朝配信への感謝、夜枠は改めて連絡する旨が書かれている。",
  provenance: "owner-provided",
  sourceDate: "2026-08-24",
} as const;
