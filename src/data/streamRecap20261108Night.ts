import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

const moments = [
  ["00:30", "hair-arrange", "髪を整えるしぐさ"],
  ["01:40", "red-ribbon", "赤いリボンと制服風の衣装"],
  ["08:00", "camera-smile", "カメラに向けた笑顔"],
  ["20:00", "talk-expression", "会話中の表情"],
  ["33:50", "side-ponytail", "サイドにまとめた髪を整える場面"],
  ["46:20", "talk-smile", "笑顔のトーク場面"],
  ["53:20", "cat-ears", "猫耳をつけた近景"],
  ["53:40", "paws-up", "肉球を頭のそばに上げたポーズ"],
  ["53:55", "both-paws", "両手の肉球ポーズ"],
  ["59:05", "closing-cat-ears", "終盤の猫耳のしぐさ"],
] as const;

export const night20261108Gallery: StreamRecapImage[] = moments.map(([time, slug, label], i) => {
  const filename = `mily-b257-${String(i + 1).padStart(2, "0")}-20261108-night-${slug}.jpg`;
  return { src: `/media/live/${filename}`, width: 640, height: 360, alt: `みりぃの${label}`, caption: `0:${time}｜${label}`, downloadName: filename };
});

export const streamRecap20261108Night: StreamRecap = {
  id: "2026-11-08-night-showroom",
  date: "2026-11-08",
  dateLabel: "2026.11.08（日）",
  theme: "夜は配信100日のありがとう",
  broadcastLabel: "録画開始22:32頃〜 約60分",
  platformLabel: "SHOWROOM",
  summary: "11月8日夜は、セミファイナルの応援への感謝と、配信100日を記念する交流が中心でした。投票期間を支えてくれた人たちへお礼を伝え、後半はアバターを揃えた記念撮影を呼びかけました。",
  image: night20261108Gallery[8],
  gallery: night20261108Gallery,
  galleryZip: {
    src: "/media/live/mily-b257-20261108-night-photos.zip",
    filename: "mily-20261108-night-photos.zip",
    label: "この回のスクショ10枚をまとめて保存",
  },
  highlights: [
    { timestamp: "0:03:00", title: "応援と投票への感謝", body: "結果がまだわからない中で、セミファイナル期間を振り返り、応援と投票への感謝を伝えました。" },
    { timestamp: "0:10:20", title: "コメントへの思い", body: "すべてに個別返信する時間は取れなくても、寄せられたコメントを見ているという話がありました。" },
    { timestamp: "0:35:13", title: "配信100日の記念企画", body: "配信100日の記念として、アバターを揃えた記念撮影を呼びかけました。トマトのファンマークを取り入れたアバターも話題になりました。", clip: { src: "/media/live-clips/mily-b259-11-20261108-night-photo-call.mp4", poster: "/media/live-clips/mily-b259-11-20261108-night-photo-call-poster.jpg", width: 640, height: 360, durationSeconds: 17, sourceTimestamp: "0:35:13" } },
    { timestamp: "0:53:25", title: "猫耳と肉球の記念ポーズ", body: "猫耳と肉球をつけ、両手を頭のそばに上げてポーズをとりました。" },
    { timestamp: "0:57:25", title: "これからも楽しい時間を", body: "これからも皆で配信を楽しみたいという思いと、感謝を伝えました。", clip: { src: "/media/live-clips/mily-b259-12-20261108-night-closing-thanks.mp4", poster: "/media/live-clips/mily-b259-12-20261108-night-closing-thanks-poster.jpg", width: 640, height: 360, durationSeconds: 22, sourceTimestamp: "0:57:25" } },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:03:00", label: "セミファイナルの応援への感謝" },
    { timestamp: "0:10:20", label: "寄せられたコメントの話" },
    { timestamp: "0:35:13", label: "配信100日の記念企画" },
    { timestamp: "0:53:20", label: "記念撮影への呼びかけ" },
    { timestamp: "0:57:25", label: "これからの配信への思い" },
  ],
  nextNote: "配信時点では、翌11月9日6:00〜6:30の朝配信を案内していました。",
  sourceLabel: "2026年11月8日 夜のSHOWROOM配信（保存録画の自動文字起こし・実フレーム確認）",
  verifiedAt: "2026-11-09",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画の実フレーム10枚を掲載しています。",
    publishedClips: true,
    extra: "本文は自動文字起こしに基づく要約で、原音の手動聴取・逐語校正は未実施です。時刻は録画先頭からの目安です。録画実尺は約60分で、処理開始から終了までの時計上の幅とは約51秒異なります。全区間の連続性は未確認です。配信100日は本人の説明に基づき、日付からの独立した検算はしていません。曲名は未確認のため掲載していません。短尺は原音付きで、歌唱のない雑談部分から切り出し、掲載範囲は原音の文字起こしで照合しています。",
  }),
};
