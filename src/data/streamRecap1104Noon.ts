import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

// The owner's authorized recording of this afternoon live (14:45 JST, about 20 minutes, start to end).
// Photos are from this live only. Singing excerpts are not published here (rights gate).
// Background sticky notes are shown as-is per the owner's 2026-11-04 instruction (no generative edits, no face or body edits).
const moments = [
  [32, "hair-touch-smile", "髪に手を添えて笑うみりぃ", "昼のはじまり"],
  [92, "arm-up-hair", "腕を上げて髪を整えるみりぃ", "メイクする余裕はなかった"],
  [532, "bright-smile", "明るく笑うみりぃ", "昼枠の笑顔"],
  [660, "cheek-hand-wink", "ほおに手を添えて目を細めるみりぃ", "篠笛を手に"],
  [890, "shinobue-show", "篠笛を横に持って見せるみりぃ", "篠笛を見せて"],
  [900, "hands-wave-cheeks", "両手を顔の横で振るみりぃ", "ありがとう"],
  [1032, "surprised-smile", "驚いた顔で笑うみりぃ", "ネコちゃんありがとう"],
  [1136, "chin-hand-smile", "あごに手を添えてほほえむみりぃ", "一緒に頑張ろう"],
  [1164, "nyan-arm-up", "腕を上げてねこのポーズをするみりぃ", "にゃんにゃんで締め"],
  [1190, "nyan-paws-smile", "両手をねこの手にして笑うみりぃ", "にゃんにゃんで締め"],
] as const;
const clock = (s: number) => `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
export const noon20261104Gallery: StreamRecapImage[] = moments.map(([seconds, slug, alt, label], i) => {
  const filename = `mily-b253-${String(i + 1).padStart(2, "0")}-20261104-noon-${slug}.jpg`;
  return { src: `/media/live/${filename}`, width: 640, height: 360, alt, caption: `${clock(seconds)}｜${label}`, downloadName: filename };
});

export const streamRecap1104Noon: StreamRecap = {
  id: "2026-11-04-noon-showroom",
  date: "2026-11-04",
  dateLabel: "2026.11.04（水）",
  theme: "昼の篠笛とにゃんにゃん",
  broadcastLabel: "14:45頃〜 約20分",
  platformLabel: "SHOWROOM",
  summary: "お昼の約20分枠。楽器の話題で盛り上がり、篠笛を手に持って歌う場面も。「応援してくれてるからには行かないと」と前を向き、最後はねこの歌「にゃんにゃん」で締めくくりました。",
  image: noon20261104Gallery[0],
  gallery: noon20261104Gallery,
  highlights: [
    { timestamp: "0:01:51", title: "メイクする余裕はなかった", body: "本当はメイクしようと思っていたけれど、そんな余裕はなかったと笑いながら昼枠をスタート。" },
    { timestamp: "0:02:13", title: "楽器の話題", body: "コメントで挙がった楽器の名前に「すごい楽器のつめ合わせ」と楽しそうに反応しました。" },
    { timestamp: "0:04:58", title: "パンク系じゃない？", body: "「今日は光の当たり方が悪い気がする」と言いつつ、「ちょっとパンク系じゃない？かっこよくない？」と画面をのぞきこみました。" },
    { timestamp: "0:09:42", title: "篠笛を手に", body: "篠笛を取り出し、手に持って歌う場面も。終盤には篠笛を横に持ってカメラに見せました。" },
    { timestamp: "0:15:27", title: "前を向いて", body: "「応援してくれてるからには、やはり行かないと」と、みんなへの感謝とともに前向きな気持ちを伝えました。", quote: "ここはいかないと" },
    { timestamp: "0:19:24", title: "にゃんにゃんで締め", body: "「じゃあにゃんにゃんして終わるか」と、ねこの歌「にゃんにゃん」で昼枠を締めくくりました。" },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:00:00", label: "昼のはじまり" },
    { timestamp: "0:02:13", label: "楽器の話題" },
    { timestamp: "0:03:43", label: "涙袋が気になる" },
    { timestamp: "0:04:58", label: "パンク系じゃない？" },
    { timestamp: "0:09:42", label: "篠笛を手に歌う" },
    { timestamp: "0:14:50", label: "篠笛を見せる" },
    { timestamp: "0:15:27", label: "ここはいかないと" },
    { timestamp: "0:19:24", label: "にゃんにゃん" },
  ],
  nextNote: "",
  sourceLabel: "2026年11月4日 昼のSHOWROOM配信（保存録画の自動文字起こし・実フレーム確認）",
  verifiedAt: "2026-11-04",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画の実フレーム10枚を掲載しています。",
    publishedClips: false,
    extra: "見どころとタイムスタンプの時刻は録画先頭からの目安です。録画は14:45頃の開始から終了までの約20分です。配信の正式な終了時刻は確認していません。背景の付箋はそのまま写っています。顔や身体の生成・補正はしていません。歌唱場面の動画は掲載していません。曲名は「にゃんにゃん」以外は扱っていないため、曲リストは作っていません。原音の全編手動聴取・逐語校正は未実施です。",
  }),
};
