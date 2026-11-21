/**
 * Photos from Mily's Instagram post about her photoshoot day (2026-11-21).
 * Intake route: owner-designated post (AGENTS.md media exception) — the owner
 * specified this exact post URL on 2026-11-22 and asked for publication.
 * These images are local, metadata-stripped derivatives. No SNS CDN hotlinks.
 * The post's three videos are not included here; see the original post.
 */
const PHOTOSHOOT_DAY_INSTAGRAM_URL = "https://www.instagram.com/p/DgAZjpJk1TR/";

const photos = [
  ["mirror-selfie-coat", "黒いコートに紺のフリルブラウスと白いスカートで、鏡の前でスマホを手に自撮りするみりぃ"],
  ["mirror-selfie-smile", "鏡越しにほほえむみりぃ。紺のフリルブラウスに大きなリボン"],
  ["mirror-selfie-bag", "バッグを手に、鏡の前に立つみりぃ"],
] as const;

export const photoshootDayPhotos = photos.map(([slug, alt], index) => {
  const id = "mily-b274-" + String(index + 1).padStart(2, "0");
  return {
    id,
    kind: "photo" as const,
    basePath: "/media/gallery/" + id + "-" + slug,
    widths: [480, 960, 1600] as const,
    width: 1080,
    height: 1440,
    alt,
    caption: "撮影の日のオフショット。2026年11月21日の本人Instagram投稿より。",
    provenance: "sns-post" as const,
    sourceUrl: PHOTOSHOOT_DAY_INSTAGRAM_URL,
    sourceDate: "2026-11-21",
    credit: null,
    aspect: "1080 / 1440",
    published: true,
  };
});

export const photoshootDayNewsImages = photoshootDayPhotos.map((item) => ({
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
