import type { MediaItem } from "./media.ts";
import type { NewsImageMedia } from "./news.ts";

const basePath = "/media/gallery/mily-b145-03-blue-ribbon-fanroom-selfie";

export const september23FanroomPhoto = {
  id: "mily-b145-03",
  kind: "photo",
  basePath,
  widths: [480, 960, 1600],
  width: 1206,
  height: 666,
  alt: "紺色のトップスと青いリボン姿で、指を頬に添えたみりぃの横長セルフィー",
  caption: "9月23日10:27、SHOWROOMファンルームに投稿されたみりぃのセルフィー。",
  provenance: "owner-provided",
  sourceUrl: null,
  sourceDate: "2026-09-23",
  credit: null,
  aspect: "1206 / 666",
  published: true,
} satisfies MediaItem;

export const september23FanroomImage = {
  kind: "image",
  src: `${basePath}-1600.jpg`,
  srcSet: `${basePath}-480.jpg 480w, ${basePath}-960.jpg 960w, ${basePath}-1600.jpg 1206w`,
  webpSrcSet: `${basePath}-480.webp 480w, ${basePath}-960.webp 960w, ${basePath}-1600.webp 1206w`,
  sizes: "(min-width: 640px) 24rem, 100vw",
  width: september23FanroomPhoto.width,
  height: september23FanroomPhoto.height,
  alt: september23FanroomPhoto.alt,
} satisfies NewsImageMedia;

export const fanroomVoice1027 = {
  kind: "audio",
  src: "/media/news/mily-b145-01-fanroom-voice-1027.m4a",
  mimeType: "audio/mp4",
  alt: "9月23日10:27、みりぃがファンルームに投稿した音声メッセージ",
  label: "みりぃからの連絡 · 10:27 · 約17秒",
} as const;

export const fanroomVoice1032 = {
  kind: "audio",
  src: "/media/news/mily-b145-02-fanroom-voice-1032.m4a",
  mimeType: "audio/mp4",
  alt: "9月23日10:32、みりぃがファンルームに投稿した音声メッセージ",
  label: "みりぃからの連絡 · 10:32 · 約9秒",
} as const;
