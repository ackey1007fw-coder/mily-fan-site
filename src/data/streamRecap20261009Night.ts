import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

// 写真の時刻は配信時刻ではなく、保存録画の先頭からの目安。
const moments = [
  [1, "0:01:30", "頭の横に両手を上げ、笑顔を見せるみりぃ"],
  [2, "0:03:30", "両手を頭の上に伸ばして笑うみりぃ"],
  [3, "0:05:30", "胸の前で手を合わせるみりぃ"],
  [4, "0:13:30", "青いフードをかぶり、笑顔のみりぃ"],
  [5, "0:17:30", "フードの上に手を乗せて笑うみりぃ"],
  [6, "0:19:30", "フード姿でカメラへほほえむみりぃ"],
  [7, "0:23:30", "両手で口元を覆うみりぃ"],
  [8, "0:49:30", "両手を合わせて笑顔を見せるみりぃ"],
  [9, "0:59:30", "髪を横に結び、笑顔のみりぃ"],
  [10, "1:07:30", "横に結んだ髪で明るく笑うみりぃ"],
] as const;

const gallery = moments.map(([index, time, alt]) => {
  const downloadName = `mily-b199-${String(index).padStart(2, "0")}-20261009-night-still.jpg`;
  return { src: `/media/live/${downloadName}`, width: 380, height: 360, alt, caption: `${time}｜${alt}`, downloadName };
});

export const streamRecap20261009Night: StreamRecap = {
  id: "2026-10-09-night-showroom",
  date: "2026-10-09",
  dateLabel: "2026.10.09（金）",
  theme: "夜の顔出しと笑顔",
  broadcastLabel: "録画開始21:32頃〜 約74分",
  platformLabel: "SHOWROOM",
  summary: "久しぶりに顔を見せ、またみんなと話せる喜びを伝えた夜。青いパーカーでフードをかぶった姿や、髪を横に結んだ終盤まで、録画から選んだ笑顔の写真10枚で振り返ります。",
  image: gallery[8],
  gallery,
  galleryNote: "当日の保存録画から選んだ実フレーム10枚です。写真の時刻は録画の先頭からの目安です。",
  galleryZip: { src: "/media/live/mily-b199-11-20261009-night-stills.zip", filename: "mily_20261009_night_screenshots_10.zip", label: "10枚まとめて保存" },
  highlights: [
    { timestamp: "0:00:02", title: "久しぶりに、やっほー", body: "録画冒頭では、集まってくれた人へ挨拶とお礼を伝えました。久しぶりに顔を見せながら、話しかけています。" },
    { timestamp: "0:01:13", title: "顔を見せて、またお話し", body: "顔を見せる配信が久しぶりだと話しました。またみんなと話せることを喜ぶ言葉も聞かれます。" },
    { timestamp: "0:02:13", title: "直接話したかった気持ち", body: "画面を通して顔を見せながら話したかったと伝え、来てくれた人へお礼を重ねました。" },
    { timestamp: "0:13:30", title: "青いフードで笑顔", body: "青いパーカーのフードをかぶり、カメラに笑顔を向ける姿が録画に残っています。" },
    { timestamp: "0:23:30", title: "両手で口元を覆って", body: "両手を口元に添えた仕草の一枚です。フード姿で表情を変える場面を残しました。" },
    { timestamp: "0:49:30", title: "手を合わせるひとこま", body: "顔の前で両手を合わせて笑顔を見せる瞬間を、実際の録画フレームから選びました。" },
    { timestamp: "0:59:30", title: "髪を横にまとめた笑顔", body: "後半には髪を横に結んだ姿も登場。パーカー姿のまま、明るい笑顔を見せています。" },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:00:02", label: "久しぶりの挨拶と感謝" },
    { timestamp: "0:01:13", label: "顔を見せて話せる時間" },
    { timestamp: "0:02:13", label: "顔を見せて話したかった気持ち" },
    { timestamp: "0:03:30", label: "両手を上げる笑顔" },
    { timestamp: "0:05:30", label: "手を合わせる仕草" },
    { timestamp: "0:13:30", label: "青いパーカーのフード姿" },
    { timestamp: "0:19:30", label: "フード姿でカメラへ笑顔" },
    { timestamp: "0:23:30", label: "両手を口元へ" },
    { timestamp: "0:49:30", label: "笑顔で手を合わせる場面" },
    { timestamp: "0:59:30", label: "髪を横にまとめた姿" },
    { timestamp: "1:07:30", label: "終盤の明るい笑顔" },
  ],
  nextNote: "",
  sourceLabel: "2026年10月9日 夜のSHOWROOM配信（保存録画・自動文字起こし）",
  verifiedAt: "2026-10-09",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画の実フレーム10枚です。",
    extra: "発言の紹介は録画冒頭約5分の自動文字起こしから聞き取りの明瞭な範囲を要約しています。写真の表情・仕草は録画の実フレームで確認しました。見どころと写真の時刻は録画先頭からの目安です。保存録画の実尺は74分03.904秒で、録画開始21:32頃は配信全体の開始を確定する情報ではありません。後半の話題、個人名、投票制度の詳細、曲名、ランキングと次枠は確定していないため掲載していません。",
  }),
};
