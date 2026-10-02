import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const moments = [
  ["0:04:00", "笑顔で話すみりぃ"],
  ["0:07:00", "両手を頬に添えて笑うみりぃ"],
  ["0:19:00", "人差し指を立てるみりぃ"],
  ["0:34:00", "首を傾けて話すみりぃ"],
  ["0:43:00", "フードをかぶって笑うみりぃ"],
  ["0:52:00", "フードをかぶって話すみりぃ"],
  ["1:01:00", "カメラへ笑顔を向けるみりぃ"],
  ["1:16:00", "笑顔で指を立てるみりぃ"],
  ["1:19:00", "髪をまとめるみりぃ"],
  ["1:40:00", "終盤に笑顔を見せるみりぃ"],
];
const gallery = moments.map(([time, alt], index) => {
  const downloadName = `mily-b182-${String(index + 1).padStart(2, "0")}-20261002-night-still.jpg`;
  return { src: `/media/live/${downloadName}`, width: 640, height: 360, alt, caption: `${time}｜${alt}`, downloadName };
});

export const streamRecap20261002Night: StreamRecap = {
  id: "2026-10-02-night-showroom",
  date: "2026-10-02",
  dateLabel: "2026.10.02（金）",
  theme: "夜の四次審査スタート",
  broadcastLabel: "21:31頃〜 約105分",
  platformLabel: "SHOWROOM",
  summary: "WEB投票が始まった夜、投票報告への感謝と翌日からのSHOWROOM審査への思いを伝えました。みんなとやりとりしながら、毎日の応援を呼びかけ、次の朝と夜の配信も案内します。",
  image: gallery[7],
  gallery,
  galleryNote: "夜配信の実フレームから、表情やしぐさの異なる10枚を選びました。時刻は録画先頭からの目安です。",
  highlights: [
    { timestamp: "0:05:18", title: "翌日からのSHOWROOM審査", body: "WEB投票が始まったこの日、SHOWROOMのイベントは翌日からと案内しました。投票してくれたみんなへの感謝を伝えながら、応援を呼びかけます。" },
    { timestamp: "0:10:31", title: "投票報告への感謝", body: "投票したよと報告してくれることが嬉しいと話しました。ファンルームなどで届く報告にもお礼を伝え、みんなとのやりとりが続きます。" },
    { timestamp: "0:20:36", title: "毎日の投票をお願い", body: "投票は12日まで続くと案内し、毎日の応援をお願いしました。来てくれたみんなへ感謝しながら、四次審査を一緒に進んでいきたい気持ちを伝えます。" },
    { timestamp: "0:28:22", title: "セミファイナルを目指して", body: "セミファイナルへ進むため、投票と四次審査への応援をお願いしていると話しました。まずは次の審査へ進みたいという目標を伝えます。" },
    { timestamp: "0:53:01", title: "翌朝と夜の配信案内", body: "翌朝は6時半から1時間、夜は21時40分から1時間と案内しました。翌日から始まる審査へ向け、みんなと配信時間を確認します。" },
    { timestamp: "1:12:12", title: "届く報告が励みに", body: "Xで投票報告の通知が届くと嬉しいと話しました。応援してくれていることが伝わる報告に、あらためて感謝します。" },
    { timestamp: "1:36:40", title: "一緒に盛り上がって", body: "翌朝6時半からの配信をあらためて案内し、みんなと一緒に盛り上がりながら頑張りたいと伝えました。翌日からの審査へ向け、応援をお願いしています。" },
    { timestamp: "1:44:08", title: "翌朝の応援をお願い", body: "最後に翌朝6時半から7時半の配信を再案内し、キラ星での応援をお願いしました。投票報告が嬉しかったとお礼を伝え、夜の配信を締めます。" },
  ],
  goals: [{ item: "四次審査", target: "セミ進出", statusThen: "応援をお願い" }],
  ranking: [buildRankingNote(13, 1)],
  timeline: [
    { timestamp: "0:00:07", label: "夜の挨拶" },
    { timestamp: "0:03:13", label: "投票への感謝" },
    { timestamp: "0:05:18", label: "翌日からのSHOWROOMイベント" },
    { timestamp: "0:10:31", label: "ファンルームの投票報告" },
    { timestamp: "0:19:00", label: "午前と午後の応援を呼びかけ" },
    { timestamp: "0:20:36", label: "12日まで毎日の投票をお願い" },
    { timestamp: "0:28:22", label: "セミファイナルを目指す気持ち" },
    { timestamp: "0:48:01", label: "投票とイベント開始日の違い" },
    { timestamp: "0:53:01", label: "翌朝6時半からの配信案内" },
    { timestamp: "0:54:57", label: "翌夜21時40分からの配信案内" },
    { timestamp: "1:12:12", label: "Xで届く投票報告への感謝" },
    { timestamp: "1:20:36", label: "日々の投票報告について" },
    { timestamp: "1:36:40", label: "一緒に盛り上がりたい気持ち" },
    { timestamp: "1:37:09", label: "ランキングと応援へのお礼" },
    { timestamp: "1:39:46", label: "翌朝6時半の配信を再案内" },
    { timestamp: "1:44:08", label: "翌朝の応援をお願いして挨拶" },
  ],
  nextNote: "配信時点では、翌朝6時半から7時半、翌夜21時40分から1時間の配信を案内していました。",
  sourceLabel: "2026年10月2日 SHOWROOM夜配信（保存録画・自動文字起こし）",
  verifiedAt: "2026-10-03",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の録画から抽出した実フレーム10枚です。顔・身体の生成や補正は行っていません。",
    extra: "時刻は元録画に合わせた目安です。本文は発言の要約で、逐語引用ではありません。短尺動画は原音の検品待ちのため掲載していません。",
  }),
};
