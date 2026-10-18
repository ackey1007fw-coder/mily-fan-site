import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const stills: StreamRecapImage[] = [
  { src: "/media/live/mily-b143-01-asa.jpg", width: 640, height: 360, alt: "朝の配信で手を上げて挨拶するみりぃ", caption: "0:04:10 朝の挨拶", downloadName: "みりぃ_20260923朝_01.jpg" },
  { src: "/media/live/mily-b143-02-asa.jpg", width: 640, height: 360, alt: "頬にメイクスポンジを当てるみりぃ", caption: "0:08:10 メイク中の表情", downloadName: "みりぃ_20260923朝_02.jpg" },
  { src: "/media/live/mily-b143-03-asa.jpg", width: 640, height: 360, alt: "ブラシを使いながら微笑むみりぃ", caption: "0:12:10 メイクとおしゃべり", downloadName: "みりぃ_20260923朝_03.jpg" },
  { src: "/media/live/mily-b143-04-asa.jpg", width: 640, height: 360, alt: "カメラに向かって笑うみりぃ", caption: "0:24:10 朝の笑顔", downloadName: "みりぃ_20260923朝_04.jpg" },
  { src: "/media/live/mily-b143-05-asa.jpg", width: 640, height: 360, alt: "手を上げながら笑顔を見せるみりぃ", caption: "0:28:10 おしゃべりのひとこま", downloadName: "みりぃ_20260923朝_05.jpg" },
  { src: "/media/live/mily-b143-06-asa.jpg", width: 640, height: 360, alt: "穏やかな表情で話すみりぃ", caption: "0:36:10 ゆったりトーク", downloadName: "みりぃ_20260923朝_06.jpg" },
  { src: "/media/live/mily-b143-07-asa.jpg", width: 640, height: 360, alt: "画面近くで微笑むみりぃ", caption: "0:46:10 近くで見せた笑顔", downloadName: "みりぃ_20260923朝_07.jpg" },
  { src: "/media/live/mily-b143-08-asa.jpg", width: 640, height: 360, alt: "青いヘアゴムを頬の近くに持つみりぃ", caption: "1:00:10 青いヘアゴムと一緒に", downloadName: "みりぃ_20260923朝_08.jpg" },
  { src: "/media/live/mily-b143-09-asa.jpg", width: 640, height: 360, alt: "大きな笑顔を見せるみりぃ", caption: "1:10:10 明るい笑顔", downloadName: "みりぃ_20260923朝_09.jpg" },
  { src: "/media/live/mily-b143-10-asa.jpg", width: 640, height: 360, alt: "ピースサインを見せるみりぃ", caption: "1:32:10 締めくくりのピース", downloadName: "みりぃ_20260923朝_10.jpg" },
];
export const streamRecap20260923Asa: StreamRecap = {
  id: "2026-09-23-asa-showroom",
  date: "2026-09-23",
  dateLabel: "2026.09.23（水）",
  theme: "朝のメイクとおしゃべり",
  broadcastLabel: "06:31頃〜 約95分",
  platformLabel: "SHOWROOM",
  summary: "大学へ行く前の朝、メイクを進めながら視聴者とおしゃべり。焼きそばの話題から、アナウンスの勉強や発声練習、朝ごはんの話まで、身支度と一緒に話題が広がりました。笑顔やピースを見せて締めくくった朝配信です。",
  image: stills[0],
  gallery: stills,
  galleryZip: {
    src: "/media/live/mily-b143-asa-stills.zip",
    filename: "みりぃ_20260923朝_スクショ10枚.zip",
    label: "10枚まとめて保存",
  },
  highlights: [
    {
      timestamp: "0:04:00",
      title: "大学へ行く前のメイク配信",
      body: "朝の挨拶から、メイクをしながらのトークへ。スポンジやブラシを使い、少しずつ仕上がっていく様子を見せました。",
    },
    {
      timestamp: "0:15:25",
      title: "メイクすると、もっとかわいく",
      body: "メイクで変わる楽しさを話しながら、ブラシを動かす朝のひとこまです。",
      clip: { src: "/media/live-clips/mily-b143-makeup.mp4", poster: stills[2].src, width: 640, height: 360, durationSeconds: 10, sourceTimestamp: "0:15:25" },
      socialClip: {
        title: "朝メイクのひとこと", sourceTimestamp: "0:15:25", durationSeconds: 10,
        links: [
          { platform: "youtube", url: "https://www.youtube.com/watch?v=x7KwsFjvcCY" },
          { platform: "tiktok", url: "https://www.tiktok.com/@ackeytan_/video/7688519694814383377" },
          { platform: "instagram", url: "https://www.instagram.com/reel/DdnA_oAEb7T/" },
          { platform: "x", url: "https://x.com/ackey_RiRi_supp/status/2102554652877213696" },
        ],
      },
    },
    {
      timestamp: "0:18:00",
      title: "焼きそばの話で盛り上がる",
      body: "カップ焼きそばやスープの話題で、コメントとのやり取りが弾みました。",
    },
    {
      timestamp: "0:34:00",
      title: "アナウンスの勉強と発声の話",
      body: "大学で学ぶアナウンスのことや、発声練習、ビブラートを自分で練習した話をしました。",
    },
    {
      timestamp: "0:54:15",
      title: "みんなと話すと笑顔に",
      body: "来てくれる人たちと話すのがうれしくて笑顔になる、と語った場面。朝のやさしい表情が残りました。",
      clip: { src: "/media/live-clips/mily-b143-smile.mp4", poster: stills[6].src, width: 640, height: 360, durationSeconds: 10, sourceTimestamp: "0:54:15" },
      socialClip: {
        title: "みんなと話すと笑顔に", sourceTimestamp: "0:54:15", durationSeconds: 10,
        links: [
          { platform: "youtube", url: "https://www.youtube.com/watch?v=Lus1uzQ_LU8" },
          { platform: "tiktok", url: "https://www.tiktok.com/@ackeytan_/video/7688519895222488341" },
          { platform: "instagram", url: "https://www.instagram.com/reel/DdnA_n2DCjC/" },
          { platform: "x", url: "https://x.com/ackey_RiRi_supp/status/2102554669297881140" },
        ],
      },
    },
    {
      timestamp: "0:55:10",
      title: "朝ごはんの話",
      body: "配信後の朝ごはんを考えながら、食べ物や飲み物の話題へ。メイクを終えた朝のおしゃべりが続きました。",
    },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1)],
  timeline: [
    { timestamp: "0:04:00", label: "メイクをしながら朝のおしゃべり" },
    { timestamp: "0:15:25", label: "メイクの楽しさを話す" },
    { timestamp: "0:18:00", label: "カップ焼きそばの話" },
    { timestamp: "0:34:00", label: "アナウンスの勉強" },
    { timestamp: "0:42:00", label: "発声やビブラートの練習" },
    { timestamp: "0:54:15", label: "来てくれるとうれしくて笑顔に" },
    { timestamp: "1:00:00", label: "メイクを終えて朝ごはんの話" },
    { timestamp: "1:20:00", label: "歴史や勉強の話題" },
    { timestamp: "1:32:00", label: "13位から1位までのお礼" },
    { timestamp: "1:34:37", label: "夜配信と行ってきますの挨拶" },
  ],
  nextNote: "配信時点では、夜も配信する予定で、時刻が決まり次第知らせると話していました。",
  sourceLabel: "2026年9月23日 SHOWROOM朝配信（オーナー提供録画・録画範囲の自動文字起こし確認）",
  verifiedAt: "2026-09-23",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は同じ録画の実フレーム10枚を掲載しています。",
    extra: "録画開始記録06:31:06、メディア実測5718.644秒から、表示を06:31頃・約95分に丸めています。録画範囲を48分割して日本語の自動文字起こしを確認し、採用した話題の一部を別モデルでも確認しました。全編の手動聴取・逐語校正ではなく、配信全編の完全収録は保証しません。時刻は録画先頭からの目安です。短尺は原音を使ったファン編集です。",
  }),
};
