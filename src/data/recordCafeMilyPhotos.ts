/**
 * オーナー提供の「レコードカフェ第二弾【みりぃ集】」7枚。
 * 元投稿の恒久URLと投稿日は未確認。2026-09-29はサイトへの受領日。
 * 写真の撮影者は本人投稿文で「あみちゃん」と説明されている。
 */
const photos = [
  ["record-listening", "ヘッドホンを着け、ピンクのレコードとケーキの前で頬に手を添えるみりぃ"],
  ["record-browsing", "レコード棚の前でレコードを探すみりぃ"],
  ["record-portrait-hands", "レコード棚の前で両手を顔の近くに添えるみりぃ"],
  ["record-portrait-side", "レコード棚の前で横を向くみりぃ"],
  ["record-standing", "レコード棚の前で横を向いて立つみりぃ"],
  ["record-adjusting-hair", "レコード棚の前で髪に手を添えるみりぃ"],
  ["record-listening-side", "ヘッドホンを着け、レコードとケーキのそばで頬に手を添えるみりぃ"],
] as const;

export const recordCafeMilyPhotos = photos.map(([slug, alt], index) => ({
  id: `mily-b173-${String(index + 1).padStart(2, "0")}`,
  kind: "photo" as const,
  basePath: `/media/gallery/mily-b173-${String(index + 1).padStart(2, "0")}-${slug}`,
  widths: [480, 960, 1600] as const,
  width: 1153,
  height: 1536,
  alt,
  caption: "レコードカフェ第二弾【みりぃ集】。撮影：あみちゃん（本人投稿文による）。",
  provenance: "owner-provided" as const,
  sourceUrl: null,
  sourceDate: null,
  credit: "あみちゃん（本人投稿文による）",
  aspect: "1153 / 1536",
  published: true,
}));

export const recordCafeMilyNewsImages = recordCafeMilyPhotos.map((item) => ({
  kind: "image" as const,
  src: `${item.basePath}-1600.jpg`,
  srcSet: [480, 960, 1600]
    .map((suffix) => `${item.basePath}-${suffix}.jpg ${suffix === 1600 ? 1153 : suffix}w`)
    .join(", "),
  webpSrcSet: [480, 960, 1600]
    .map((suffix) => `${item.basePath}-${suffix}.webp ${suffix === 1600 ? 1153 : suffix}w`)
    .join(", "),
  sizes: "(min-width: 640px) 24rem, 100vw",
  width: item.width,
  height: item.height,
  alt: item.alt,
}));
