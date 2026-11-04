import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

// The owner's authorized recording of this night live (20:50 JST, about 61 minutes, start to end).
// Photos are real frames from this live only (resize only, no generative edits). 06/07 are face-only crops
// from the screenshot-time poses so the hand-held sticky notes with viewer names are not shown.
const moments = [
  [100, "opening-smile", 640, "うさみみをつけて笑うみりぃ", "夜のはじまり"],
  [180, "pointing-smile", 640, "カメラを指さして笑うみりぃ", "こんばんは"],
  [870, "bunny-ears", 640, "両手でうさみみにふれるみりぃ", "うさみみ これいる？"],
  [1545, "heart-hands", 640, "両手でハートを作るみりぃ", "好きな色の話"],
  [1664, "shy-hands", 640, "両手で口元をおおって照れるみりぃ", "ひとりでランニング"],
  [1987, "pose-facecrop", 300, "スクショタイムでポーズするみりぃ", "スクショタイム"],
  [3168, "pose2-facecrop", 310, "スクショタイムで笑うみりぃ", "スクショタイム"],
  [3445, "hand-cheek", 640, "ほおに手を添えて笑うみりぃ", "終盤の笑顔"],
  [3594, "wave-smile", 640, "手を振って笑うみりぃ", "おつみりー"],
  [3634, "bye-bunny", 640, "両手を頭の上に上げてうさみみポーズのみりぃ", "いい夢見てね"],
] as const;
const clock = (s: number) => `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
export const night20261104Gallery: StreamRecapImage[] = moments.map(([seconds, slug, width, alt, label], i) => {
  const filename = `mily-b254-${String(i + 1).padStart(2, "0")}-20261104-night-${slug}.jpg`;
  return { src: `/media/live/${filename}`, width, height: 360, alt, caption: `${clock(seconds)}｜${label}`, downloadName: filename };
});

const dataLink = [{ label: "MILY SIGNAL・11月4日夜の観測と確認範囲", url: "/data-lab/reports/20261104-night/" }];

export const streamRecap1104Night: StreamRecap = {
  id: "2026-11-04-night-showroom",
  date: "2026-11-04",
  dateLabel: "2026.11.04（水）",
  theme: "夜のうさみみと2時間じゃ足りない",
  broadcastLabel: "20:50頃〜 約61分",
  platformLabel: "SHOWROOM",
  summary: "うさみみをつけて約1時間、ずっと笑顔の夜枠。好きな色は青という話や、ひとりでランニングした話を楽しそうに聞かせてくれて、「配信楽しくて仕方ない、2時間じゃ足りない」とうれしい一言も。スクショタイムのポーズのあと、「おつみりー」で締めくくりました。",
  image: night20261104Gallery[0],
  gallery: night20261104Gallery,
  highlights: [
    { timestamp: "0:14:23", title: "うさみみ これいる？", body: "つけていたうさみみを外したり、またつけたり。「これいる？」と迷う姿まで、ずっとかわいい時間でした。" },
    { timestamp: "0:25:46", title: "好きな色は青", body: "好きな色の話になり、青が好きだと教えてくれました。" },
    { timestamp: "0:26:44", title: "ランニングと2時間じゃ足りない", body: "ひとりでランニングに行った話を楽しそうに聞かせてくれたあと、「配信楽しくて仕方ない」「2時間じゃ足りない」と配信への思いを笑顔で伝えてくれました。見ている側もうれしくなる一言です。", quote: "配信楽しくて仕方ない、2時間じゃ足りない", relatedLinks: dataLink },
    { timestamp: "0:33:07", title: "スクショタイム", body: "スクショタイムでは、カメラに向けてポーズ。写真はみりぃの顔の部分だけを切り出して載せています。" },
    { timestamp: "0:59:59", title: "おつみりー", body: "「おつみりー！いい夢見てね」と手を振って、夜枠を締めくくりました。" },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:00:00", label: "夜のはじまり" },
    { timestamp: "0:14:23", label: "うさみみ これいる？" },
    { timestamp: "0:25:46", label: "好きな色は青" },
    { timestamp: "0:26:44", label: "ひとりでランニング" },
    { timestamp: "0:33:07", label: "スクショタイム" },
    { timestamp: "0:52:48", label: "2回目のスクショタイム" },
    { timestamp: "0:59:59", label: "おつみりー" },
  ],
  nextNote: "",
  sourceLabel: "2026年11月4日 夜のSHOWROOM配信（保存録画の自動文字起こし・実フレーム確認）",
  verifiedAt: "2026-11-04",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画の実フレーム10枚を掲載しています。",
    publishedClips: false,
    extra: "見どころとタイムスタンプの時刻は録画先頭からの目安です。録画は20:50頃の開始から終了までの約61分です。スクショタイムの2枚は、手に持った付箋が写らないよう顔の部分だけを切り出しています。背景の付箋はそのまま写っています。顔や身体の生成・補正はしていません。動画は掲載していません。原音の全編手動聴取・逐語校正は未実施です。",
  }),
};
