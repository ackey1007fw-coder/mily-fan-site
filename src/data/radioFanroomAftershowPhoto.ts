import type { MediaItem } from "./media.ts";

const basePath = "/media/gallery/mily-b202-01-ssc-aftershow-duo";
const widths = [480, 960, 1000] as const;

/**
 * 2026-10-11 13:12 JST SHOWROOM Fan Room photo.
 *
 * The site owner's supplied Fan Room screenshot and the room's public image
 * metadata corroborate the post time. This asset is a crop of the photograph
 * alone and contains no private reply, username or app UI.
 */
export const radioFanroomAftershowPhoto = {
  id: "mily-b202-01-ssc-aftershow-duo",
  kind: "photo",
  basePath,
  widths,
  width: 1000,
  height: 562,
  alt: "車内で並んで写真を撮る2人。左側の人物はマスク姿でピース、右側の人物は頬に手を添えている",
  caption: "10月11日『湘南シーサイドサークル』放送後、13:12にSHOWROOMファンルームへ投稿された2ショット写真。",
  provenance: "owner-provided",
  sourceUrl: "https://www.showroom-live.com/room/fan_club?room_id=573253",
  sourceDate: "2026-10-11",
  credit: null,
  aspect: "1000 / 562",
  published: true,
} satisfies MediaItem;

export const radioFanroomAftershowNewsImage = {
  kind: "image" as const,
  src: `${basePath}-1000.jpg`,
  srcSet: widths.map((width) => `${basePath}-${width}.jpg ${width}w`).join(", "),
  webpSrcSet: widths.map((width) => `${basePath}-${width}.webp ${width}w`).join(", "),
  sizes: "(min-width: 640px) 28rem, 100vw",
  width: radioFanroomAftershowPhoto.width,
  height: radioFanroomAftershowPhoto.height,
  alt: radioFanroomAftershowPhoto.alt,
} as const;
