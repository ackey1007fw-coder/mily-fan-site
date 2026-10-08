import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

const moments = [
  [1, "0:10:30", "紫のリボンと耳つきヘアバンドで笑うみりぃ"],
  [2, "0:12:30", "カメラに笑顔を向けるみりぃ"],
  [3, "0:18:30", "視線を少し下げてほほえむみりぃ"],
  [4, "0:20:30", "顔を近づけて笑うみりぃ"],
  [5, "0:22:30", "首をかしげて笑うみりぃ"],
  [6, "0:26:30", "片手のひらを上に向けるみりぃ"],
  [7, "0:32:30", "ヘアバンドの耳を前に倒して笑うみりぃ"],
  [8, "0:34:30", "耳つきヘアバンドで横を向くみりぃ"],
  [9, "0:36:30", "両腕を広げて笑うみりぃ"],
  [10, "0:38:30", "笑顔で両手を振るみりぃ"],
] as const;
const gallery = moments.map(([index, time, alt]) => {
  const downloadName = `mily-b197-${String(index).padStart(2, "0")}-20261008-night-still.jpg`;
  return { src: `/media/live/${downloadName}`, width: 640, height: 360, alt, caption: `${time}｜${alt}`, downloadName };
});

export const streamRecap20261008Night: StreamRecap = {
  id: "2026-10-08-night-showroom",
  date: "2026-10-08",
  dateLabel: "2026.10.08（木）",
  theme: "夜のありがとうとリボン",
  broadcastLabel: "録画開始23:21頃〜 約40分",
  platformLabel: "SHOWROOM",
  summary: "遅い時間に集まってくれた人へ、ありがとうを重ねた夜。みんなの応援が力になると話しました。歌いたくなった気持ちや、愛を感じたという言葉も。紫のリボン姿の写真10枚と、短いトーク2本で振り返ります。",
  image: gallery[4],
  gallery,
  galleryNote: "当日の保存録画から選んだ実フレーム10枚です。写真の時刻は録画の先頭からの目安です。",
  galleryZip: { src: "/media/live/mily-b197-11-20261008-night-stills.zip", filename: "mily_20261008_night_screenshots_10.zip", label: "10枚まとめて保存" },
  highlights: [
    { timestamp: "0:00:20", title: "来てくれてありがとう", body: "遅い時間になったことに触れながら、来てくれた人へお礼を重ねました。応援が届くたび、うれしい気持ちを伝えています。" },
    { timestamp: "0:04:33", title: "みんなの応援が力に", body: "投票や応援へのお礼に続いて、みんなの応援が力になると話しました。来てくれた人や、応援を届けてくれた人へ感謝を伝える場面です。" },
    { timestamp: "0:07:44", title: "一緒にお話ししたかった", body: "みんなと一緒にお話ししたかったと振り返り、この時間に起きられてよかったと話しました。" },
    { timestamp: "0:22:17", title: "歌いたくなった気持ち", body: "歌いたくなったと話し、みんなへ問いかけるみりぃ。笑顔になる短いトークを抜粋しました。", clip: { src: "/media/live-clips/mily-b197-12-20261008-night-want-to-sing.mp4", poster: "/media/live-clips/mily-b197-12-20261008-night-want-to-sing-poster.jpg", width: 640, height: 360, durationSeconds: 4.4, sourceTimestamp: "0:22:17" } },
    { timestamp: "0:26:36", title: "愛を感じたというお礼", body: "愛を感じたと話し、ありがとうを重ねました。感謝を伝える6.6秒のトークです。", clip: { src: "/media/live-clips/mily-b197-13-20261008-night-thank-you.mp4", poster: "/media/live-clips/mily-b197-13-20261008-night-thank-you-poster.jpg", width: 640, height: 360, durationSeconds: 6.6, sourceTimestamp: "0:26:36" } },
    { timestamp: "0:32:30", title: "耳を前に倒した姿", body: "ヘアバンドの耳が前に倒れた姿で笑っています。同じヘアバンドでも、形が変わった場面です。" },
    { timestamp: "0:38:30", title: "笑顔で両手を振る場面", body: "終盤には両手を広げ、カメラに向かって手を振っています。夜の笑顔を最後の写真にも残しました。" },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:00:20", label: "遅い時間に来てくれた人へのお礼" },
    { timestamp: "0:04:33", label: "応援が力になるという言葉" },
    { timestamp: "0:07:44", label: "一緒にお話ししたかった気持ち" },
    { timestamp: "0:10:30", label: "紫のリボンと耳つきヘアバンド" },
    { timestamp: "0:22:17", label: "歌いたくなった気持ち" },
    { timestamp: "0:22:30", label: "首をかしげる笑顔" },
    { timestamp: "0:26:30", label: "手のひらを上に向ける仕草" },
    { timestamp: "0:26:36", label: "愛を感じたというお礼" },
    { timestamp: "0:32:30", label: "耳を前に倒したヘアバンド" },
    { timestamp: "0:38:30", label: "両手を振る場面" },
  ],
  nextNote: "",
  sourceLabel: "2026年10月8日 夜のSHOWROOM配信（保存録画・自動文字起こし）",
  verifiedAt: "2026-10-09",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の録画の実フレーム10枚です。",
    publishedClips: true,
    extra: "会話の要約は冒頭8分と、掲載した短尺2本の前後の自動文字起こしで確認した範囲です。全編の手動聴取は未実施です。見どころの会話時刻は音声内、写真の時刻は録画内の目安です。保存録画の実尺は39分30.125秒です。録画開始23:21頃・約40分は保存録画の目安で、配信全体の開始・終了を確定していません。冒頭の確認できた複数時点は黒画面で、写真は映像のある区間から選んでいます。曲名・歌詞・ランキング・次枠の案内は確定していません。短尺は同じ録画の原音を保持した4.4秒と6.6秒のトークです。",
  }),
};
