/**
 * 2026-08-24 朝の本人Instagram Story。オーナーが当該画像のNEWS掲載面を明示承認。
 * HOME Latest / /news/ 専用。Gallery と /stories/ には展開しない。
 * 公開用metadata除去以外はcrop・mask・scaleなしで元画像の見た目を維持。
 * 恒久permalinkはないため sourceUrl は持たない。
 */
export const morningMakeupInstagramStoryImage = {
  id: "mily-b24-02-morning-makeup-instagram-story",
  kind: "image" as const,
  src: "/media/news/mily-b24-02-morning-makeup-instagram-story.jpg",
  width: 1500,
  height: 2667,
  alt: "初メイク配信について理由と朝配信への感謝を伝える三橋莉子さんのInstagram Story",
  caption:
    "2026年8月24日の本人Instagram Story。初メイク配信の理由と朝配信への感謝、夜枠は改めて連絡する旨が書かれている。",
  provenance: "owner-provided",
  sourceDate: "2026-08-24",
} as const;
