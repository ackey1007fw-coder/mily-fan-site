import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

// 写真の時刻は放送時刻ではなく、当日の保存録画の先頭からの目安。
const moments = [
  [1, "0:02:50", "頬に手を添えて話すみりぃ"],
  [2, "0:05:10", "メイクの合間に笑顔を見せるみりぃ"],
  [3, "0:08:00", "細いブラシを手にメイクするみりぃ"],
  [4, "0:11:20", "ピンク色のパフを口元に当てるみりぃ"],
  [5, "0:14:50", "目元を整えながら笑顔を見せるみりぃ"],
  [6, "0:18:50", "ブラシで目元を整えるみりぃ"],
  [7, "0:30:40", "カメラにほほえむみりぃ"],
  [8, "0:34:10", "頬に指を添えて笑うみりぃ"],
  [9, "0:50:10", "編んだ髪を持って笑うみりぃ"],
  [10, "0:54:30", "編んだ髪を肩に垂らして話すみりぃ"],
  [11, "0:59:10", "髪に手を当ててほほえむみりぃ"],
  [12, "1:03:30", "両手を前に出して表情を作るみりぃ"],
] as const;

const gallery = moments.map(([index, time, alt]) => {
  const downloadName = `mily-b200-${String(index).padStart(2, "0")}-20261011-asa-still.jpg`;
  return {
    src: `/media/live/${downloadName}`,
    width: 380,
    height: 360,
    alt,
    caption: `${time}｜${alt}`,
    downloadName,
  };
});

export const streamRecap20261011Asa: StreamRecap = {
  id: "2026-10-11-asa-showroom",
  date: "2026-10-11",
  dateLabel: "2026.10.11（日）",
  theme: "朝のメイクと編み込みヘア",
  broadcastLabel: "録画開始5:34頃〜 約65分",
  platformLabel: "SHOWROOM",
  summary:
    "メイクをしながらリスナーに挨拶した朝の配信。ラジオの予定にも触れ、ブラシを手にした真剣な表情から、後半の三つ編みと笑顔まで、当日の実写真12枚で振り返ります。",
  image: gallery[8],
  gallery,
  galleryNote:
    "当日の保存録画から選んだ実フレーム12枚です。写真の時刻は録画の先頭からの目安で、配信開始時刻とは異なります。",
  galleryZip: {
    src: "/media/live/mily-b200-13-20261011-asa-stills.zip",
    filename: "mily_20261011_morning_screenshots_12.zip",
    label: "12枚まとめて保存",
  },
  highlights: [
    {
      timestamp: "0:00:34",
      title: "朝の挨拶と感謝",
      body: "朝から来てくれた人へ繰り返しお礼を伝え、配信を始めました。",
    },
    {
      timestamp: "0:00:49",
      title: "今日はメイク配信",
      body: "今朝はメイクをしながら進める回だと説明し、画面の前で準備を始めました。",
    },
    {
      timestamp: "0:02:20",
      title: "声の調子を気にしつつ",
      body: "いつもと違う声の調子について触れながら、リスナーとの会話を続けました。",
    },
    {
      timestamp: "0:04:45",
      title: "この日はラジオも",
      body: "この日は朝からラジオがあることにも触れ、身支度を進めていました。",
    },
    {
      timestamp: "0:08:00",
      title: "ブラシを手にメイク",
      body: "細いブラシを手に、鏡を確かめながらメイクをする様子が映っています。",
    },
    {
      timestamp: "0:14:50",
      title: "目元のメイクに集中",
      body: "目元を丁寧に整え、合間にはカメラへ笑顔を向ける姿も見られました。",
    },
    {
      timestamp: "0:34:10",
      title: "頬に指を添えて笑顔",
      body: "頬に指先を添え、カメラに向かって明るく笑う一瞬を残しました。",
    },
    {
      timestamp: "0:50:10",
      title: "後半はヘアアレンジ",
      body: "髪を編んでいく様子が映り、三つ編み姿での笑顔も見られました。",
    },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:00:34", label: "朝の挨拶と感謝" },
    { timestamp: "0:00:49", label: "メイク配信の案内" },
    { timestamp: "0:02:20", label: "声の調子についての話題" },
    { timestamp: "0:04:45", label: "朝のラジオについて" },
    { timestamp: "0:05:10", label: "メイク中の笑顔" },
    { timestamp: "0:08:00", label: "細いブラシを手に" },
    { timestamp: "0:11:20", label: "ピンク色のパフ" },
    { timestamp: "0:14:50", label: "目元を整える" },
    { timestamp: "0:18:50", label: "ブラシを使う様子" },
    { timestamp: "0:30:40", label: "カメラに向かう表情" },
    { timestamp: "0:34:10", label: "頬に指を添えた笑顔" },
    { timestamp: "0:50:10", label: "髪を編み始める" },
    { timestamp: "0:54:30", label: "三つ編みのヘアスタイル" },
    { timestamp: "0:59:10", label: "編んだ髪と笑顔" },
    { timestamp: "1:03:30", label: "両手を使ったジェスチャー" },
  ],
  nextNote: "",
  sourceLabel: "2026年10月11日 朝のSHOWROOM配信（保存録画・自動文字起こし）",
  verifiedAt: "2026-10-11",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画から切り出した実フレーム12枚です。",
    extra:
      "発言に関する見どころは冒頭約5分の自動文字起こしをもとにした要約です。後半の写真と動作は保存録画の実フレームで確認しました。全編の実聴・逐語確認は未実施です。録画開始5:34頃は配信全体の開始を確定する情報ではありません。保存尺は64分47.725秒で、録画処理の開始から終了までの時間とは異なります。曲名、順位、ギフト数、次枠など、確定できていない情報は掲載していません。",
  }),
};
