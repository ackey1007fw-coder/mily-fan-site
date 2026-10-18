/**
 * 2026-09-25 本人Xの初アバター配布投稿に添えられた配信画面2枚。
 * オーナーがこの2枚の掲載を明示した。NEWSだけで自己ホストし、X CDNへhotlinkしない。
 */
export const FIRST_AVATAR_DISTRIBUTION_X_URL =
  "https://x.com/Mily_chan36/status/2103255202749198794";

export const firstAvatarDistributionImages = {
  point: {
    kind: "image" as const,
    src: "/media/news/mily-b160-01-first-avatar-point.jpg",
    width: 811,
    height: 1238,
    alt: "青いTシャツのみりぃが、初アバ配布と表示された配信画面で両手の人差し指を下げて笑う写真",
  },
  heart: {
    kind: "image" as const,
    src: "/media/news/mily-b160-02-first-avatar-heart.jpg",
    width: 809,
    height: 1246,
    alt: "青いTシャツのみりぃが、初アバ配布と表示された配信画面で両手でハートを作って笑う写真",
  },
} as const;
