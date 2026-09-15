import type { MediaItem } from "./media.ts";
import type { NewsImageMedia } from "./news.ts";

export const nightRibbonFanroomPhoto = {
  id: "mily-b123-01",
  kind: "photo",
  basePath: "/media/gallery/mily-b123-01-night-ribbon-fanroom-selfie",
  widths: [480, 960, 1600],
  width: 1206,
  height: 666,
  alt: "グレーのトップスに黒い水玉リボンをつけ、カメラを見るみりぃの横長セルフィー",
  caption: "9月15日23:43、夜配信後のSHOWROOMファンルームに添えられた、みりぃの写真。",
  provenance: "owner-provided",
  sourceUrl: null,
  sourceDate: "2026-09-15",
  credit: null,
  aspect: "1206 / 666",
  published: true,
} satisfies MediaItem;

export const nightRibbonFanroomImage = {
  kind: "image",
  src: `${nightRibbonFanroomPhoto.basePath}-1600.jpg`,
  srcSet: `${nightRibbonFanroomPhoto.basePath}-480.jpg 480w, ${nightRibbonFanroomPhoto.basePath}-960.jpg 960w, ${nightRibbonFanroomPhoto.basePath}-1600.jpg 1206w`,
  webpSrcSet: `${nightRibbonFanroomPhoto.basePath}-480.webp 480w, ${nightRibbonFanroomPhoto.basePath}-960.webp 960w, ${nightRibbonFanroomPhoto.basePath}-1600.webp 1206w`,
  sizes: "(min-width: 640px) 24rem, 100vw",
  width: nightRibbonFanroomPhoto.width,
  height: nightRibbonFanroomPhoto.height,
  alt: nightRibbonFanroomPhoto.alt,
} satisfies NewsImageMedia;
