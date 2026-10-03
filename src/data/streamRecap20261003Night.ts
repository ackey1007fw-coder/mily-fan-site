import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

const moments = [
  [30, "横を向いて笑顔を見せるみりぃ"],
  [360, "カメラに向かって両手を振るみりぃ"],
  [740, "笑顔で話すみりぃ"],
  [1080, "カメラへ顔を近づけるみりぃ"],
  [1440, "横を向いて話すみりぃ"],
  [1830, "頬に手を添えるみりぃ"],
  [2190, "歯を見せて笑うみりぃ"],
  [2540, "両手を合わせて笑顔を見せるみりぃ"],
  [3000, "マイクを持つみりぃ"],
  [3510, "終盤にカメラへ笑顔を向けるみりぃ"],
] as const;
const gallery = moments.map(([seconds, alt], index) => {
  const time = `${Math.floor(seconds / 3600)}:${String(Math.floor(seconds % 3600 / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const downloadName = `mily-b185-${String(index + 1).padStart(2, "0")}-20261003-night-${String(seconds).padStart(4, "0")}.jpg`;
  return { src: `/media/live/${downloadName}`, width: 420, height: 360, alt, caption: `${time}｜${alt}`, downloadName };
});

export const streamRecap20261003Night: StreamRecap = {
  id: "2026-10-03-night-showroom", date: "2026-10-03", dateLabel: "2026.10.03（土）",
  theme: "夜の笑顔と応援へのありがとう", broadcastLabel: "21:40頃〜 約60分", platformLabel: "SHOWROOM",
  summary: "10月3日夜の配信。カメラに向かって手を振る姿や、マイクを持つ姿、終盤の笑顔を実際の録画からまとめました。自動文字起こしではキラキラ星や応援への感謝が繰り返し認識されています。",
  image: gallery[9], gallery,
  galleryNote: "この夜の録画から選んだ実フレーム10枚です。不要な背景を切り出して除き、元の表情を保持しています。時刻は録画内の目安です。",
  highlights: [
    { timestamp: "0:06:00", title: "カメラに向かって手を振って", body: "笑顔で両手を振る場面を録画の実フレームで確認しました。" },
    { timestamp: "0:30:30", title: "表情が近くに感じられる夜", body: "頬に手を添えたり、カメラへ近づいたりする姿も。表情の異なる場面を写真で振り返ります。" },
    { timestamp: "0:58:30", title: "終盤の笑顔", body: "配信終盤にもカメラへ笑顔を向ける姿が残っています。応援への感謝の言葉は自動文字起こしによる要約候補で、逐語引用としては掲載していません。" },
  ],
  goals: [], ranking: [],
  timeline: [
    { timestamp: "0:06:00", label: "笑顔で両手を振る場面" },
    { timestamp: "0:30:30", label: "頬に手を添える場面" },
    { timestamp: "0:50:00", label: "マイクを持つ場面" },
    { timestamp: "0:58:30", label: "終盤の笑顔" },
  ],
  nextNote: "配信時点の翌日案内は原音確認が未完了のため、時刻を確定記載していません。最新予定は本人の案内とLIVEページをご確認ください。",
  sourceLabel: "2026年10月3日 SHOWROOM夜配信（保存録画・自動文字起こし）", verifiedAt: "2026-10-04",
  transcriptionNote: buildTranscriptionNote({ material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "この夜の実フレーム10枚を目視確認し、不要な背景を切り出して除きました。顔の生成・補正は行っていません。", extra: "元録画の音声時刻を照合していますが、全編手動聴取・逐語校正は未実施です。境界の重複・不確定語句を含むため、本人の逐語引用、歌った曲名、翌日の時刻は確定掲載していません。画像の時刻は録画内の目安です。" }),
};
