import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const stills: StreamRecapImage[] = [
  { src: "/media/live/mily-b142-01-night.jpg", width: 640, height: 360, alt: "耳つきヘアバンドで笑うみりぃ", caption: "0:03:00 夜配信の笑顔", downloadName: "みりぃ_20260922夜_01.jpg" },
  { src: "/media/live/mily-b142-02-night.jpg", width: 640, height: 360, alt: "頬に手を添えて話すみりぃ", caption: "0:15:00 ほほえむひとこま", downloadName: "みりぃ_20260922夜_02.jpg" },
  { src: "/media/live/mily-b142-03-night.jpg", width: 640, height: 360, alt: "四次審査の日付を書いたボードを見せるみりぃ", caption: "0:27:00 四次審査の案内", downloadName: "みりぃ_20260922夜_03.jpg" },
  { src: "/media/live/mily-b142-04-night.jpg", width: 640, height: 360, alt: "画面に向かって笑うみりぃ", caption: "0:35:00 夜のトーク", downloadName: "みりぃ_20260922夜_04.jpg" },
  { src: "/media/live/mily-b142-05-night.jpg", width: 640, height: 360, alt: "耳つきヘアバンドに手を添えるみりぃ", caption: "0:47:00 ヘアバンドと一緒に", downloadName: "みりぃ_20260922夜_05.jpg" },
  { src: "/media/live/mily-b142-06-night.jpg", width: 640, height: 360, alt: "手を上げて話すみりぃ", caption: "0:55:00 楽しいおしゃべり", downloadName: "みりぃ_20260922夜_06.jpg" },
  { src: "/media/live/mily-b142-07-night.jpg", width: 640, height: 360, alt: "カメラを見つめるみりぃ", caption: "1:00:00 近くでトーク", downloadName: "みりぃ_20260922夜_07.jpg" },
  { src: "/media/live/mily-b142-08-night.jpg", width: 640, height: 360, alt: "穏やかな表情で話すみりぃ", caption: "1:03:00 穏やかな表情", downloadName: "みりぃ_20260922夜_08.jpg" },
  { src: "/media/live/mily-b142-09-night.jpg", width: 640, height: 360, alt: "終盤に大きく笑うみりぃ", caption: "1:28:00 終盤の笑顔", downloadName: "みりぃ_20260922夜_09.jpg" },
  { src: "/media/live/mily-b142-10-night.jpg", width: 640, height: 360, alt: "配信の最後に話すみりぃ", caption: "1:31:00 お礼の時間", downloadName: "みりぃ_20260922夜_10.jpg" },
];
export const streamRecap20260922Night: StreamRecap = {
  id: "2026-09-22-night-showroom",
  date: "2026-09-22",
  dateLabel: "2026.09.22（火）",
  theme: "夜のヘアバンドトーク",
  broadcastLabel: "22:00頃〜 約94分",
  platformLabel: "SHOWROOM",
  summary: "耳つきヘアバンド姿で始まった夜配信。髪形や「今日もかわいい」のやり取りで笑い、四次審査の予定をボードでも案内。終盤は一人ひとりへのお礼と翌朝の配信予定を伝えました。",
  image: stills[0],
  gallery: stills,
  galleryZip: {
    src: "/media/live/mily-b142-night-stills.zip",
    filename: "みりぃ_20260922夜_スクショ10枚.zip",
    label: "10枚まとめて保存",
  },
  highlights: [
    {
      timestamp: "0:17:00",
      title: "耳つきヘアバンドと前髪の話",
      body: "この日のヘアバンドを紹介しながら、いつもと違う前髪に少し照れた様子。自然体の笑顔が続きました。",
      clip: { src: "/media/live-clips/mily-b142-hairband.mp4", poster: stills[1].src, width: 640, height: 360, durationSeconds: 23, sourceTimestamp: "0:17:00" },
    },
    {
      timestamp: "0:20:53",
      title: "「今日までかわいい？」の笑い",
      body: "「今日までかわいい」という言い方から、明日以降はどうなるのかと冗談に。これからもかわいい、と笑いながら話しました。",
      clip: { src: "/media/live-clips/mily-b142-cute.mp4", poster: stills[1].src, width: 640, height: 360, durationSeconds: 15, sourceTimestamp: "0:20:53" },
    },
    {
      timestamp: "0:26:40",
      title: "四次審査の日程をボードで案内",
      body: "手書きのボードを見せながら、10月2日から始まる四次審査に向けて案内しました。",
    },
    {
      timestamp: "1:16:55",
      title: "くしゃみと耳つき姿に照れ笑い",
      body: "思いがけず出たくしゃみをきっかけに、自分の姿がみんなに見えていることを改めて意識して照れ笑いしました。",
    },
    {
      timestamp: "1:22:00",
      title: "翌朝の配信と制作中の特典",
      body: "翌朝6時半からの配信を案内。準備中の特典についても、完成を待っていてほしいと伝えました。",
    },
    {
      timestamp: "1:30:31",
      title: "ランキングを読んでお礼",
      body: "13位から1位まで順位を読み上げ、来てくれた人たちに感謝を伝えて夜配信を締めくくりました。",
    },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1)],
  timeline: [
    { timestamp: "0:03:00", label: "耳つきヘアバンドで夜のトーク" },
    { timestamp: "0:17:00", label: "ヘアバンドと前髪の話" },
    { timestamp: "0:20:53", label: "かわいさをめぐる冗談" },
    { timestamp: "0:26:40", label: "四次審査のボードを披露" },
    { timestamp: "1:16:55", label: "くしゃみと照れ笑い" },
    { timestamp: "1:22:00", label: "翌朝と特典の案内" },
    { timestamp: "1:30:31", label: "13位から1位までのお礼" },
    { timestamp: "1:34:04", label: "翌朝6時半を伝えておやすみ" },
  ],
  nextNote: "配信時点では、翌朝6時半から配信すると案内していました。",
  sourceLabel: "2026年9月22日 SHOWROOM夜配信（オーナー提供録画・録画範囲の自動文字起こし確認）",
  verifiedAt: "2026-09-23",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は同じ録画の実フレーム10枚を掲載しています。",
    extra: "録画開始記録21:59:34、メディア実測5660.458秒から、表示を22:00頃・約94分に丸めています。録画範囲を48分割して日本語の自動文字起こしを確認し、採用した話題の一部を別モデルでも確認しました。全編の手動聴取・逐語校正ではなく、配信全編の完全収録は保証しません。時刻は録画先頭からの目安です。短尺は原音を使ったファン編集です。",
  }),
};
