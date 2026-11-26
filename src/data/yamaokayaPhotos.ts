/**
 * Photos and videos from Mily's Instagram post about a Yamaoka-ya ramen
 * outing with a close friend, followed by a windy stop at Umihotaru
 * (2026-11-26). The carousel holds six photos and three short videos.
 * Intake route: owner-designated post (AGENTS.md media exception) — the
 * owner specified this exact post URL on 2026-11-26 and asked for
 * publication. These images are local, metadata-stripped derivatives.
 * No SNS CDN hotlinks.
 */
const YAMAOKAYA_INSTAGRAM_URL = "https://www.instagram.com/p/DgM7i3xE_Bv/";

const photos = [
  [1, "ramen-chopsticks", "山岡家の店内で、ラーメンの丼を前に箸を持つみりぃ。グレーのスウェット姿", 1476, 1107],
  [2, "ramen-side-glance", "箸を持ち上げて、横を見つめるみりぃ", 1476, 1107],
  [3, "gyoza-plate", "焼きたての餃子の皿を、両手でカメラに見せるみりぃ", 1476, 1107],
  [4, "gyoza-lookdown", "餃子の皿を見下ろして、ほほえむみりぃ", 1476, 1107],
  [5, "ramen-three-bowls", "赤いテーブルの上に並ぶ、ラーメン3杯", 1108, 831],
  [9, "yamaokaya-sign", "夜空に浮かぶ「ラーメン 山岡家」の赤い看板", 1108, 831],
] as const;

export const yamaokayaPhotos = photos.map(([num, slug, alt, width, height]) => {
  const id = "mily-b282-" + String(num).padStart(2, "0");
  return {
    id,
    kind: "photo" as const,
    basePath: "/media/gallery/" + id + "-" + slug,
    widths: [480, 960, 1600] as const,
    width,
    height,
    alt,
    caption: "大好きな友達と山岡家へ行った日の写真。2026年11月26日の本人Instagram投稿より。",
    provenance: "sns-post" as const,
    sourceUrl: YAMAOKAYA_INSTAGRAM_URL,
    sourceDate: "2026-11-26",
    credit: null,
    published: true,
  };
});

export const yamaokayaNewsImages = yamaokayaPhotos.map((item) => ({
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
