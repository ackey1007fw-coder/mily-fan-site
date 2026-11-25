/**
 * Photos of Mily taken by Yui Saito (@_____fil_) on their first outing
 * together, shared across three of Saito's Instagram posts (2026-11-24).
 * Intake route: owner-designated posts (AGENTS.md media exception) — the
 * owner specified these exact post URLs on 2026-11-26 and asked for
 * publication. These images are local, metadata-stripped derivatives.
 * No SNS CDN hotlinks. The cafe two-shot collage is kept as one image,
 * exactly as posted. Some of these photos were also used by Mily herself
 * in her 2026-11-25 finalist announcement post (see finalistForestPhotos).
 */
const SAITO_CAROUSEL_URL = "https://www.instagram.com/p/DgHrkZrE_8x/";
const SAITO_SINGLE_THINKING_URL = "https://www.instagram.com/p/DgHrqYzzR1W/";
const SAITO_SINGLE_KOMOREBI_URL = "https://www.instagram.com/p/DgHrtpyzKGl/";

const photos = [
  ["park-backlight", "強い木漏れ日の逆光の中に座るみりぃ。紺のブラウスに白いスカート", SAITO_CAROUSEL_URL, 1080, 1350],
  ["komorebi-shadow", "地面に落ちる木漏れ日の影", SAITO_CAROUSEL_URL, 2000, 2666],
  ["cafe-sweets-collage", "カフェでパンケーキを食べるみりぃの、2カットのコラージュ", SAITO_CAROUSEL_URL, 1080, 1350],
  ["cafe-pancakes", "カフェのテーブルのパンケーキとコーヒー。奥にみりぃ", SAITO_CAROUSEL_URL, 3000, 2000],
  ["forest-lean", "森の木漏れ日の中で、頬に手を添えてほほえむみりぃ", SAITO_SINGLE_THINKING_URL, 1088, 1344],
  ["wall-komorebi-fullbody", "木漏れ日の影が落ちる白い壁の前に立つみりぃ。白いティアードスカートの全身", SAITO_SINGLE_KOMOREBI_URL, 1088, 1344],
] as const;

export const komorebiShootPhotos = photos.map(([slug, alt, sourceUrl, width, height], index) => {
  const id = "mily-b280-" + String(index + 1).padStart(2, "0");
  return {
    id,
    kind: "photo" as const,
    basePath: "/media/gallery/" + id + "-" + slug,
    widths: [480, 960, 1600] as const,
    width,
    height,
    alt,
    caption: "齊藤結さんが撮影した、初めてのお出かけの日の写真。2026年11月24日の結さんのInstagram投稿より。",
    provenance: "sns-post" as const,
    sourceUrl,
    sourceDate: "2026-11-24",
    credit: "齊藤結（@_____fil_）",
    aspect: width + " / " + height,
    published: true,
  };
});

export const komorebiShootNewsImages = komorebiShootPhotos.map((item) => ({
  kind: "image" as const,
  src: item.basePath + "-1600.jpg",
  srcSet: item.widths
    .map((target) => item.basePath + "-" + target + ".jpg " + Math.min(target, item.width) + "w")
    .join(", "),
  webpSrcSet: item.widths
    .map((target) => item.basePath + "-" + target + ".webp " + Math.min(target, item.width) + "w")
    .join(", "),
  sizes: "(min-width: 640px) 24rem, 100vw",
  width: item.width,
  height: item.height,
  alt: item.alt,
}));
