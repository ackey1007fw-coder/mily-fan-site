import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { buildTranscriptionNote } from "./streamRecapRules.ts";

const stillDescriptions = [
  ["0:25:00", "鏡を手にした笑顔", "鏡を手に持ち、カメラに向かって笑顔を見せるみりぃ"],
  ["0:31:04", "メイク中の笑顔", "髪を横でまとめ、メイク中に笑顔を見せるみりぃ"],
  ["0:39:58", "髪をほどく場面", "両手を上げ、髪をほどきながら笑うみりぃ"],
  ["0:43:04", "髪を下ろした姿", "髪を下ろし、カメラに近づいて笑顔を見せるみりぃ"],
  ["0:46:02", "顔の横で指を広げたポーズ", "顔の横で指を広げ、カメラを見つめるみりぃ"],
  ["0:51:56", "両手を添えた笑顔", "頭の両側に手を添え、笑顔を見せるみりぃ"],
  ["0:54:58", "首をかしげた笑顔", "首をかしげ、歯を見せて笑うみりぃ"],
  ["1:04:00", "片手を振る場面", "髪を横でまとめ、カメラへ片手を振るみりぃ"],
  ["1:12:02", "手を合わせた笑顔", "顔の前で手を合わせ、笑顔を見せるみりぃ"],
  ["1:13:28", "両手を広げたポーズ", "顔の横に両手を広げ、笑顔でポーズをとるみりぃ"],
] as const;

const approvedStills: StreamRecapImage[] = stillDescriptions.map(([timestamp, label, alt], index) => ({
  src: `/media/live/mily-b126-${String(index + 1).padStart(2, "0")}-morning.jpg`,
  width: 640,
  height: 360,
  alt,
  caption: `${timestamp} ${label}`,
  downloadName: `みりぃ_20260917朝_${String(index + 1).padStart(2, "0")}.jpg`,
}));

export const streamRecap20260917Asa: StreamRecap = {
  id: "2026-09-17-asa-showroom",
  date: "2026-09-17",
  dateLabel: "2026.09.17（木）",
  theme: "朝のメイクと笑顔",
  broadcastLabel: "8:32頃〜 約74分",
  platformLabel: "SHOWROOM",
  summary: "グレーのトップスでメイクを進め、途中で髪を下ろした朝配信。鏡を手にした笑顔、首をかしげる姿、両手を広げたポーズなど、映像で確認できた場面を振り返ります。",
  image: approvedStills[9],
  gallery: approvedStills,
  galleryZip: { src: "/media/live/mily-b126-morning-stills.zip", filename: "みりぃ_20260917朝_スクショ10枚.zip", label: "10枚まとめて保存" },
  highlights: [
    { timestamp: "0:25:00", title: "鏡を手にした笑顔", body: "髪を横でまとめてメイクを進める場面。鏡を手に持ちながら、カメラに向かって笑顔を見せています。" },
    { timestamp: "0:39:58", title: "髪をほどいた姿", body: "まとめていた髪をほどき、髪を下ろした姿に変わります。両手を上げた笑顔を残しました。" },
    { timestamp: "0:51:56", title: "表情の違う笑顔", body: "頭の両側に手を添えた笑顔や、首をかしげた笑顔が見られます。構図を変えず、その瞬間を切り出しています。" },
    { timestamp: "1:13:28", title: "両手を広げたポーズ", body: "録画の終盤には、顔の横へ両手を広げてポーズ。代表写真にも、この笑顔の場面を選びました。" },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:25:00", label: "鏡を手にしたメイク中の笑顔" },
    { timestamp: "0:31:04", label: "メイクを進める場面" },
    { timestamp: "0:39:58", label: "髪をほどく場面" },
    { timestamp: "0:43:04", label: "髪を下ろしてカメラへ" },
    { timestamp: "0:51:56", label: "頭の両側に手を添えた笑顔" },
    { timestamp: "0:54:58", label: "首をかしげた笑顔" },
    { timestamp: "1:04:00", label: "片手を振る場面" },
    { timestamp: "1:13:28", label: "両手を広げたポーズ" },
  ],
  nextNote: "",
  sourceLabel: "2026年9月17日 SHOWROOM朝配信（オーナー提供録画の静止画を確認）",
  verifiedAt: "2026-09-17",
  transcriptionNote: buildTranscriptionNote({
    material: "オーナー提供録画から抽出した静止画を目視して整理しています。音声内容は未確認です。",
    stills: "静止画は録画の実フレーム10枚を掲載しています。",
    extra: "開始表示は録画開始記録8:32:47を分単位で示し、長さはメディア実測4434.404秒から約74分に丸めています。タイムスタンプは録画先頭からの位置です。配信全編の完全収録や全編の手動聴取は確認していません。発言の詳細・歌唱曲・目標・ランキング・次枠は掲載していません。",
  }),
};
