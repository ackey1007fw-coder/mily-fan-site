import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { VIDEO_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

const approvedStills: StreamRecapImage[] = [
  { src: "/media/live/mily-b125-01-morning.jpg", width: 640, height: 360, alt: "9月16日の朝配信、グレーのパーカー姿で笑顔のみりぃ", caption: "0:09:58 笑顔で朝のおしゃべり", downloadName: "みりぃ_20260916朝_01.jpg" },
  { src: "/media/live/mily-b125-02-morning.jpg", width: 640, height: 360, alt: "9月16日の朝配信、カメラに向けて手を添えるみりぃ", caption: "0:25:04 カメラに向けてリアクション", downloadName: "みりぃ_20260916朝_02.jpg" },
  { src: "/media/live/mily-b125-03-morning.jpg", width: 640, height: 360, alt: "9月16日の朝配信、フードをかぶって笑顔のみりぃ", caption: "0:31:02 フード姿でにっこり", downloadName: "みりぃ_20260916朝_03.jpg" },
  { src: "/media/live/mily-b125-04-morning.jpg", width: 640, height: 360, alt: "9月16日の朝配信、髪に手を添えて話すみりぃ", caption: "0:40:00 髪に手を添えてトーク", downloadName: "みりぃ_20260916朝_04.jpg" },
  { src: "/media/live/mily-b125-05-morning.jpg", width: 640, height: 360, alt: "9月16日の朝配信、手を振りながら笑うみりぃ", caption: "0:54:58 手を振って笑顔", downloadName: "みりぃ_20260916朝_05.jpg" },
  { src: "/media/live/mily-b125-06-morning.jpg", width: 640, height: 360, alt: "9月16日の朝配信、両手でピースするみりぃ", caption: "0:55:00 ダブルピース", downloadName: "みりぃ_20260916朝_06.jpg" },
  { src: "/media/live/mily-b125-07-morning.jpg", width: 640, height: 360, alt: "9月16日の朝配信、手を合わせて話すみりぃ", caption: "1:15:56 手を合わせておしゃべり", downloadName: "みりぃ_20260916朝_07.jpg" },
  { src: "/media/live/mily-b125-08-morning.jpg", width: 640, height: 360, alt: "9月16日の朝配信、髪に手を添えて大きく笑うみりぃ", caption: "1:18:58 明るい笑顔", downloadName: "みりぃ_20260916朝_08.jpg" },
  { src: "/media/live/mily-b125-09-morning.jpg", width: 640, height: 360, alt: "9月16日の朝配信、正面を向いて笑顔のみりぃ", caption: "1:22:02 正面を向いてにっこり", downloadName: "みりぃ_20260916朝_09.jpg" },
  { src: "/media/live/mily-b125-10-morning.jpg", width: 640, height: 360, alt: "9月16日の朝配信、身ぶりを交えて笑うみりぃ", caption: "1:24:58 身ぶりを交えてトーク", downloadName: "みりぃ_20260916朝_10.jpg" },
];

export const streamRecap20260916Asa: StreamRecap = {
  id: "2026-09-16-asa-showroom",
  date: "2026-09-16",
  dateLabel: "2026.09.16（水）",
  theme: "朝のゆったりトーク",
  broadcastLabel: "7:31頃〜 約94分",
  platformLabel: "SHOWROOM",
  summary: "朝7時半ごろからのSHOWROOM配信。グレーのパーカー姿で、コメントに反応しながらゆったりおしゃべりする朝の時間になりました。",
  image: approvedStills[5],
  gallery: approvedStills,
  galleryZip: { src: "/media/live/mily-b125-morning-stills.zip", filename: "みりぃ_20260916朝_スクショ10枚.zip", label: "10枚まとめて保存" },
  highlights: [
    { timestamp: "0:09:58", title: "笑顔で朝のおしゃべり", body: "コメントに反応しながら、笑顔で朝のおしゃべりを続けました。" },
    { timestamp: "0:31:02", title: "フード姿でにっこり", body: "途中ではパーカーのフードをかぶる場面も。リラックスした雰囲気で配信が続きました。" },
    { timestamp: "0:55:00", title: "ダブルピース", body: "カメラに向かって両手でピース。朝枠らしい自然な表情が見られました。" },
    { timestamp: "1:18:58", title: "終盤も明るい笑顔", body: "終盤まで身ぶりを交えながらトーク。大きな笑顔でコメントとのやり取りを楽しみました。" },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:09:58", label: "笑顔で朝のおしゃべり" },
    { timestamp: "0:25:04", label: "カメラに向けてリアクション" },
    { timestamp: "0:31:02", label: "フード姿でトーク" },
    { timestamp: "0:40:00", label: "髪に手を添えておしゃべり" },
    { timestamp: "0:55:00", label: "ダブルピース" },
    { timestamp: "1:15:56", label: "手を合わせてトーク" },
    { timestamp: "1:18:58", label: "明るい笑顔" },
    { timestamp: "1:24:58", label: "身ぶりを交えておしゃべり" },
  ],
  nextNote: "",
  sourceLabel: "2026年9月16日 SHOWROOM朝配信（オーナー提供録画を確認）",
  verifiedAt: "2026-09-16",
  transcriptionNote: buildTranscriptionNote({
    material: VIDEO_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム10枚を掲載しています。",
    extra: "録画開始記録7:31:08、メディア実測5628.34秒から表示を7:31頃・約94分に丸めています。録画全体から74枚の候補フレームを比較し、本人以外やコメント欄が写らない10枚を選定しました。本文は映像で直接確認できる範囲に限定し、音声内容の詳細・歌唱曲・目標・ランキング・次枠は追加確認が完了するまで掲載していません。",
  }),
};
