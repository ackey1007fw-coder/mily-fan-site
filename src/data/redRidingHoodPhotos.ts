/**
 * 2026-10-13 08:08 JST、本人X投稿の「人生初コスプレ」赤ずきん写真4枚。
 * サイトオーナー提供の原本を、本人Xの添付4点とSHA-256で照合済み。
 * 公開派生はローカルの media/original から生成し、XのCDNをhotlinkしない。
 */
export const RED_RIDING_HOOD_X_URL =
  "https://x.com/Mily_chan36/status/2109783240366288956";

const photoDetails = [
  [
    "red-riding-hood-twin-braids",
    "赤いフードをかぶり、両手で三つ編みを持つ赤ずきん姿のみりぃ",
    1600,
    900,
  ],
  [
    "red-riding-hood-side-braid",
    "赤ずきん姿で片方の三つ編みを横に持ち、カメラを見つめるみりぃ",
    1600,
    900,
  ],
  [
    "red-riding-hood-portrait",
    "三つ編みを両手に持つ赤ずきん姿のみりぃの正面ショット",
    1600,
    901,
  ],
  [
    "red-riding-hood-full-body",
    "赤いケープと白いエプロンの赤ずきん衣装で立つみりぃの全身写真",
    1152,
    2048,
  ],
] as const;

export const redRidingHoodPhotos = photoDetails.map(([slug, alt, width, height], index) => ({
  id: `mily-b218-${String(index + 1).padStart(2, "0")}`,
  kind: "photo" as const,
  basePath: `/media/gallery/mily-b218-${String(index + 1).padStart(2, "0")}-${slug}`,
  widths: [480, 960, 1600] as const,
  width,
  height,
  alt,
  caption: "人生初コスプレとして披露した赤ずきん姿。2026年10月13日の本人X投稿より。",
  provenance: "owner-provided" as const,
  sourceUrl: RED_RIDING_HOOD_X_URL,
  sourceDate: "2026-10-13",
  credit: null,
  aspect: `${width} / ${height}`,
  published: true,
}));

export const redRidingHoodNewsImages = redRidingHoodPhotos.map((item) => ({
  kind: "image" as const,
  src: `${item.basePath}-1600.jpg`,
  srcSet: item.widths
    .map((targetWidth) => `${item.basePath}-${targetWidth}.jpg ${Math.min(targetWidth, item.width)}w`)
    .join(", "),
  webpSrcSet: item.widths
    .map((targetWidth) => `${item.basePath}-${targetWidth}.webp ${Math.min(targetWidth, item.width)}w`)
    .join(", "),
  sizes: "(min-width: 640px) 24rem, 100vw",
  width: item.width,
  height: item.height,
  alt: item.alt,
}));
