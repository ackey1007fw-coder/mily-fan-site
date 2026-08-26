/**
 * 既存 Gallery `mily-b05-01` を NEWS `2026-08-19-second-round-result` へ
 * srcset で配線する。新しいファイルは作らない。Gallery 派生 6 本のまま。
 * media.ts の `sourceUrl` は未確認のため null のまま（推測して埋めない）。
 */
const BASE = "/media/gallery/mily-b05-01-autumn-leaf";
const WIDTHS = [480, 960, 1600] as const;

function gallerySrcSet(format: "jpg" | "webp"): string {
  return WIDTHS.map((width) => `${BASE}-${width}.${format} ${width}w`).join(", ");
}

export const autumnLeafNewsImage = {
  id: "mily-b05-01-autumn-leaf",
  kind: "image" as const,
  src: `${BASE}-1600.jpg`,
  srcSet: gallerySrcSet("jpg"),
  webpSrcSet: gallerySrcSet("webp"),
  sizes: "(min-width: 640px) 24rem, 100vw",
  width: 1152,
  height: 2048,
  alt: "夜の並木道で、大きな落ち葉を手に持つみりぃさん",
} as const;
