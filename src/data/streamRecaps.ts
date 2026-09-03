import { streamRecap20260903Night } from "./streamRecap20260903Night.ts";
export { streamRecap20260903Night };

export type StreamRecapHighlight = {
  timestamp: string;
  title: string;
  body: string;
  quote?: string;
};

export type StreamRecapGoal = {
  item: string;
  target: string;
  statusThen: string;
};

export type StreamRecapTimelineItem = {
  timestamp: string;
  label: string;
};

export type StreamRecapImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  downloadName?: string;
};

export type StreamRecapGalleryZip = {
  src: string;
  filename: string;
  label: string;
};

export type StreamRecap = {
  id: string;
  date: string;
  dateLabel: string;
  theme: string;
  broadcastLabel: string;
  platformLabel: string;
  summary: string;
  image?: StreamRecapImage;
  gallery?: StreamRecapImage[];
  galleryZip?: StreamRecapGalleryZip;
  highlights: StreamRecapHighlight[];
  goals: StreamRecapGoal[];
  ranking: string[];
  timeline: StreamRecapTimelineItem[];
  nextNote: string;
  sourceLabel: string;
  verifiedAt: string;
  transcriptionNote: string;
};

const RANKING_NOTE =
  "配信終了時に、13位から1位までランキングを読み上げました。個人名は掲載していません。";

const streamRecapRadioStill: StreamRecapImage = {
  src: "/media/live/mily-b51-01-morning-radio-showroom.jpg",
  width: 640,
  height: 360,
  alt: "SHOWROOMラジオ配信で使われた静止画。室内の木の椅子に座り、白いトップスと黒いスカート、白い靴下で、右手を口元に当てているみりぃ。画面左上にSHOWROOM、左下にみりぃの文字",
  caption: "配信中に使われていた静止画",
};

const GACHI_STILL_W = 400;
const GACHI_STILL_H = 228;

const gachiMorningStills: StreamRecapImage[] = [
  {
    src: "/media/live/mily-b52-01-peace-smile.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、ベージュのトップスのみりぃが右手でピースをしている",
    caption: "ベストショット。ピース",
    downloadName: "みりぃ_三次初日朝_01_ベスト_ピース.jpg",
  },
  {
    src: "/media/live/mily-b52-02-peace.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、ベージュのトップスのみりぃが右手を開いて振っている",
    caption: "手を振る",
    downloadName: "みりぃ_三次初日朝_02_手を振る.jpg",
  },
  {
    src: "/media/live/mily-b52-03-peace-talk.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、ベージュのトップスのみりぃが顔を上げて話している",
    caption: "顔を上げて話す",
    downloadName: "みりぃ_三次初日朝_03_顔を上げて.jpg",
  },
  {
    src: "/media/live/mily-b52-04-smile.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、口元をゆるめて微笑んでいるみりぃ",
    caption: "微笑み",
    downloadName: "みりぃ_三次初日朝_04_微笑み.jpg",
  },
  {
    src: "/media/live/mily-b52-05-talk-smile.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、少し笑って話しているみりぃ",
    caption: "話す笑顔",
    downloadName: "みりぃ_三次初日朝_05_話す笑顔.jpg",
  },
  {
    src: "/media/live/mily-b52-06-talk.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、こちらを見て話しているみりぃ",
    caption: "話す",
    downloadName: "みりぃ_三次初日朝_06_話す.jpg",
  },
  {
    src: "/media/live/mily-b52-07-look.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、まっすぐこちらを見て話しているみりぃ",
    caption: "こちらを見て話す",
    downloadName: "みりぃ_三次初日朝_07_見つめて.jpg",
  },
  {
    src: "/media/live/mily-b52-08-soft-smile.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、やわらかく笑っているみりぃ",
    caption: "やわらかい笑顔",
    downloadName: "みりぃ_三次初日朝_08_やわらか笑顔.jpg",
  },
  {
    src: "/media/live/mily-b52-09-later.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信の中盤、話しているみりぃ",
    caption: "配信の中盤",
    downloadName: "みりぃ_三次初日朝_09_中盤.jpg",
  },
  {
    src: "/media/live/mily-b52-10-board.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、ホワイトボードの話をしているみりぃ",
    caption: "ホワイトボードの話のころ",
    downloadName: "みりぃ_三次初日朝_10_ボード.jpg",
  },
];
