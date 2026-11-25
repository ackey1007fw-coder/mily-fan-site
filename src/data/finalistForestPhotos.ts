/**
 * Photos from Mily's Instagram post announcing her selection as a
 * MISS CIRCLE CONTEST 2026 finalist (2026-11-25). The three photos were
 * taken by Yui Saito (@_____fil_), credited as "Pic" in the post itself.
 * Intake route: owner-designated post (AGENTS.md media exception) — the
 * owner specified this exact post URL on 2026-11-26 and asked for
 * publication. These images are local, metadata-stripped derivatives.
 * No SNS CDN hotlinks.
 */
const FINALIST_INSTAGRAM_URL = "https://www.instagram.com/p/DgKWbe_E10B/";

const photos = [
  ["forest-smile", "木漏れ日の森で、腕を組んでほほえむみりぃ。紺のブラウス姿"],
  ["forest-lookup-profile", "森の中で手を組み、空を見上げるみりぃの横顔"],
  ["forest-lookup", "光の差す森で、手を合わせて見上げるみりぃ"],
] as const;

export const finalistForestPhotos = photos.map(([slug, alt], index) => {
  const id = "mily-b281-" + String(index + 1).padStart(2, "0");
  return {
    id,
    kind: "photo" as const,
    basePath: "/media/gallery/" + id + "-" + slug,
    widths: [480, 960, 1600] as const,
    width: 3000,
    height: 2000,
    alt,
    caption: "ファイナリスト選出の報告投稿より。2026年11月25日の本人Instagram投稿から。撮影は齊藤結さん。",
    provenance: "sns-post" as const,
    sourceUrl: FINALIST_INSTAGRAM_URL,
    sourceDate: "2026-11-25",
    credit: "齊藤結（@_____fil_、本人投稿文による）",
    aspect: "3000 / 2000",
    published: true,
  };
});

export const finalistForestNewsImages = finalistForestPhotos.map((item) => ({
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
