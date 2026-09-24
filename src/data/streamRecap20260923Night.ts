import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const stills: StreamRecapImage[] = [
  { src: "/media/live/mily-b144-01-night.jpg", width: 640, height: 360, alt: "大きな青いリボンをつけて笑うみりぃ", caption: "0:10:00 青いリボンと笑顔", downloadName: "みりぃ_20260923夜_01.jpg" },
  { src: "/media/live/mily-b144-02-night.jpg", width: 640, height: 360, alt: "青いリボンをつけてカメラへ笑顔を向けるみりぃ", caption: "0:20:00 カメラへにっこり", downloadName: "みりぃ_20260923夜_02.jpg" },
  { src: "/media/live/mily-b144-03-night.jpg", width: 640, height: 360, alt: "青いリボンをつけて近くから笑うみりぃ", caption: "0:25:00 近くで見せた笑顔", downloadName: "みりぃ_20260923夜_03.jpg" },
  { src: "/media/live/mily-b144-04-night.jpg", width: 640, height: 360, alt: "青いリボンをつけて大きく笑うみりぃ", caption: "0:30:00 大きな笑顔", downloadName: "みりぃ_20260923夜_04.jpg" },
  { src: "/media/live/mily-b144-05-night.jpg", width: 640, height: 360, alt: "青いリボンをつけて手を上げるみりぃ", caption: "0:45:00 おしゃべり中のひとこま", downloadName: "みりぃ_20260923夜_05.jpg" },
  { src: "/media/live/mily-b144-06-night.jpg", width: 640, height: 360, alt: "青いリボン姿で四次審査の案内ボードを見せるみりぃ", caption: "0:50:00 四次審査の案内ボード", downloadName: "みりぃ_20260923夜_06.jpg" },
  { src: "/media/live/mily-b144-07-night.jpg", width: 640, height: 360, alt: "青いリボンをつけて穏やかに話すみりぃ", caption: "0:55:00 ゆったりトーク", downloadName: "みりぃ_20260923夜_07.jpg" },
  { src: "/media/live/mily-b144-08-night.jpg", width: 640, height: 360, alt: "青いリボンをつけてカメラを見つめるみりぃ", caption: "1:00:00 カメラを見つめて", downloadName: "みりぃ_20260923夜_08.jpg" },
  { src: "/media/live/mily-b144-09-night.jpg", width: 640, height: 360, alt: "青いリボンをつけて笑顔で話すみりぃ", caption: "1:10:00 夜のおしゃべり", downloadName: "みりぃ_20260923夜_09.jpg" },
  { src: "/media/live/mily-b144-10-night.jpg", width: 640, height: 360, alt: "青いリボンに手を添えて話すみりぃ", caption: "1:30:00 リボンに手を添えて", downloadName: "みりぃ_20260923夜_10.jpg" },
  { src: "/media/live/mily-b144-11-night.jpg", width: 640, height: 360, alt: "青いリボン姿で明るく笑うみりぃ", caption: "1:50:00 終盤の笑顔", downloadName: "みりぃ_20260923夜_11.jpg" },
  { src: "/media/live/mily-b144-12-night.jpg", width: 640, height: 360, alt: "配信の終盤に両手を動かしながら話すみりぃ", caption: "2:00:00 締めくくりのおしゃべり", downloadName: "みりぃ_20260923夜_12.jpg" },
];

export const streamRecap20260923Night: StreamRecap = {
  id: "2026-09-23-night-showroom",
  date: "2026-09-23",
  dateLabel: "2026.09.23（水）",
  theme: "夜の青リボントーク",
  broadcastLabel: "20:30頃〜 約122分",
  platformLabel: "SHOWROOM",
  summary: "大きな青いリボン姿でたっぷりおしゃべり。初見さんへの自己紹介、四次審査、配信を続けて話しやすくなったこと、大学での一日まで話題が広がった夜でした。",
  image: stills[1],
  gallery: stills,
  galleryZip: {
    src: "/media/live/mily-b144-night-stills.zip",
    filename: "みりぃ_20260923夜_スクショ12枚.zip",
    label: "12枚まとめて保存",
  },
  highlights: [
    {
      timestamp: "0:10:47",
      title: "配信を始めて55日目",
      body: "配信を続けてきた日数に触れながら、来てくれる人との時間を振り返りました。",
    },
    {
      timestamp: "0:35:33",
      title: "四次審査の案内",
      body: "10月2日から始まる四次審査について話し、一緒に走ってほしいと呼びかけました。",
    },
    {
      timestamp: "0:44:50",
      title: "配信で話すのが楽しく",
      body: "配信を重ねるうちに話しやすくなり、来てくれる人が増えて楽しく配信できていると話しました。",
      clip: { src: "/media/live-clips/mily-b144-cute.mp4", poster: stills[4].src, width: 640, height: 360, durationSeconds: 12, sourceTimestamp: "0:44:50" },
    },
    {
      timestamp: "1:10:34",
      title: "大学での一日を振り返る",
      body: "朝配信のあと大学へ向かった話から、授業や移動中の出来事へ。日中の出来事を笑いながら振り返りました。",
    },
    {
      timestamp: "1:56:53",
      title: "翌朝は5時半から",
      body: "翌朝5時半から配信すると案内。早起きに備えて、そろそろ終わろうと話しました。",
    },
    {
      timestamp: "1:58:20",
      title: "最後はランキングとお礼",
      body: "13位から1位まで読み上げ、初めましての人にも出会えたことを喜びながら感謝を伝えました。",
    },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1)],
  timeline: [
    { timestamp: "0:10:00", label: "青いリボン姿で夜のおしゃべり" },
    { timestamp: "0:10:47", label: "配信を始めて55日目の話" },
    { timestamp: "0:35:33", label: "四次審査の案内" },
    { timestamp: "0:44:50", label: "配信で話しやすくなったこと" },
    { timestamp: "0:50:00", label: "案内ボードを見せる" },
    { timestamp: "1:10:34", label: "大学での一日を振り返る" },
    { timestamp: "1:56:53", label: "翌朝5時半配信の案内" },
    { timestamp: "1:58:20", label: "13位から1位までのお礼" },
    { timestamp: "2:01:36", label: "おやすみの挨拶" },
  ],
  nextNote: "配信時点では、翌朝5時半から約1時間配信すると案内していました。",
  sourceLabel: "2026年9月23日 SHOWROOM夜配信（オーナー提供録画・録画範囲の自動文字起こし確認）",
  verifiedAt: "2026-09-24",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は同じ録画の実フレーム12枚を掲載しています。",
    extra: "録画開始記録20:29:48、メディア実測7322.901秒から、表示を20:30頃・約122分に丸めています。録画範囲を62分割して日本語の自動文字起こしを確認しました。全編の手動聴取・逐語校正ではなく、聞き取りが不明瞭な話題は掲載していません。時刻は録画先頭からの目安です。短尺は原音を使ったファン編集です。",
  }),
};
