/**
 * User-supplied photos from Mily's Instagram GODIVA × NANA post.
 * The source post date is not verified; do not infer it from the site's receipt date.
 * These images are local, metadata-stripped derivatives. No SNS CDN hotlinks.
 */
const GODIVA_NANA_INSTAGRAM_URL = "https://www.instagram.com/p/DeRQGExEyoX/";

const photos = [
  ["godiva-nana-smile", "GODIVAのNANAコラボドリンクを手に、カメラに笑顔を向けるみりぃ"],
  ["godiva-nana-two-drinks", "NANAコラボドリンクを両手に一杯ずつ持ち、隣のカップを見るみりぃ"],
  ["godiva-nana-eyes-closed", "両手にNANAコラボドリンクを掲げ、目を閉じて微笑むみりぃ"],
] as const;

export const godivaNanaPhotos = photos.map(([slug, alt], index) => {
  const id = "mily-b198-" + String(index + 1).padStart(2, "0");
  return {
    id,
    kind: "photo" as const,
    basePath: "/media/gallery/" + id + "-" + slug,
    widths: [480, 960, 1600] as const,
    width: 1152,
    height: 1536,
    alt,
    caption: "GODIVA × NANA コラボドリンク",
    provenance: "owner-provided" as const,
    sourceUrl: GODIVA_NANA_INSTAGRAM_URL,
    sourceDate: null,
    credit: null,
    aspect: "1152 / 1536",
    published: true,
  };
});

export const godivaNanaNewsImages = godivaNanaPhotos.map((item) => ({
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
