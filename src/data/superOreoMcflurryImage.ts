/**
 * 2026-09-25 本人Xのマックフルーリー超オレオ投稿に添えられた写真1枚。
 * オーナーがこの1枚の掲載を明示した。NEWSだけで自己ホストし、X CDNへhotlinkしない。
 */
export const SUPER_OREO_MCFLURRY_X_URL =
  "https://x.com/Mily_chan36/status/2103415595043852403";

export const superOreoMcflurryImage = {
  kind: "image" as const,
  src: "/media/news/mily-b162-01-super-oreo-mcflurry.jpg",
  width: 1536,
  height: 2048,
  alt: "木目のテーブルに置かれたマックフルーリー超オレオのカップ。アイスの上に砕いたオレオが乗っている",
} as const;
