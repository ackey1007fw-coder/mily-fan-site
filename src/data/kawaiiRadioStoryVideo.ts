import type { MediaItem } from "./media.ts";
import additionalManifest from "./kawaiiRadioAdditionalVideos.json" with { type: "json" };
import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import type { NewsImageMedia } from "./news.ts";
import manifest from "./kawaiiRadioStoryVideo.json" with { type: "json" };

/** Owner-provided 9/27 radio announcement. NEWS and Gallery share one video. */
export const kawaiiRadioStoryVideo = manifest as MorningStoryVideo;

/** Official FM form, independently verified; not a claimed Story sticker target. */
export const RADIO_KAWAII_MESSAGE_FORM_URL = "https://fm-smw.jp/message?pgm_select=%E3%80%8E+%E6%B9%98%E5%8D%97%E3%82%B7%E3%83%BC%E3%82%B5%E3%82%A4%E3%83%89%E3%82%B5%E3%83%BC%E3%82%AF%E3%83%AB+%E3%80%8F%E3%80%80%EF%BC%83SSC";

export const kawaiiRadioMessageImage: NewsImageMedia = {
  kind: "image",
  src: "/media/gallery/mily-b168-02-radio-message-story-960.jpg",
  srcSet: "/media/gallery/mily-b168-02-radio-message-story-480.jpg 480w, /media/gallery/mily-b168-02-radio-message-story-960.jpg 864w",
  webpSrcSet: "/media/gallery/mily-b168-02-radio-message-story-480.webp 480w, /media/gallery/mily-b168-02-radio-message-story-960.webp 864w",
  sizes: "(min-width: 640px) 24rem, 100vw",
  width: 864,
  height: 1536,
  alt: "くま耳とキラキラのフィルター姿のみりぃがウインクし、『ここから』『匿名でメール送れるよ』のお便り案内を指さす写真",
};

/** Same public files are shared by NEWS and Gallery. */
export const kawaiiRadioAdditionalVideos = additionalManifest as MorningStoryVideo[];

export const kawaiiRadioMessagePhoto: MediaItem = {
  id: "mily-b168-02",
  kind: "photo",
  basePath: "/media/gallery/mily-b168-02-radio-message-story",
  widths: [480, 960, 1600],
  width: kawaiiRadioMessageImage.width,
  height: kawaiiRadioMessageImage.height,
  alt: kawaiiRadioMessageImage.alt,
  caption: "9月27日のInstagram Story。お便りの送り口を案内するみりぃ。",
  provenance: "owner-provided",
  sourceUrl: null,
  sourceDate: "2026-09-27",
  credit: null,
  aspect: "864 / 1536",
  published: true,
};
