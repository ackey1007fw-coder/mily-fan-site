/**
 * Photos from Mily's Instagram post sharing last year's autumn leaves.
 * Intake route: owner-designated post (AGENTS.md media exception) — the owner
 * specified this exact post URL on 2026-11-13 and asked for publication.
 * These images are local, metadata-stripped derivatives. No SNS CDN hotlinks.
 * The post's three videos are not included (no file was obtained).
 */
const AUTUMN_LEAVES_INSTAGRAM_URL = "https://www.instagram.com/p/DfrcoWLEyck/";

const photos = [
  ["night-ginkgo-leaf-face", "ライトアップされたイチョウ並木の下で、大きな紅葉の葉を顔の横に掲げるみりぃ"],
  ["day-ginkgo-friends", "青空の下、黄金色のイチョウ並木で友達2人と並び、小さなイチョウの葉を持つみりぃ"],
  ["night-ginkgo-closeup", "夜のイチョウ並木で、うつむき目を閉じるみりぃのクローズアップ"],
  ["night-ginkgo-wide", "夜のイチョウ並木でうつむくみりぃと、行き交う人々"],
  ["night-ginkgo-peace", "夜のイチョウ並木で、両手を頬の横に上げて微笑むみりぃ"],
] as const;

export const autumnLeavesPhotos = photos.map(([slug, alt], index) => {
  const id = "mily-b262-" + String(index + 1).padStart(2, "0");
  return {
    id,
    kind: "photo" as const,
    basePath: "/media/gallery/" + id + "-" + slug,
    widths: [480, 960, 1600] as const,
    width: 1536,
    height: 2048,
    alt,
    caption: "去年の秋の紅葉。2026年11月13日の本人Instagram投稿より。",
    provenance: "sns-post" as const,
    sourceUrl: AUTUMN_LEAVES_INSTAGRAM_URL,
    sourceDate: "2026-11-13",
    credit: null,
    aspect: "1536 / 2048",
    published: true,
  };
});

export const autumnLeavesNewsImages = autumnLeavesPhotos.map((item) => ({
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
