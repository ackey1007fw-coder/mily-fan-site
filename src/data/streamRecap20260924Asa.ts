import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const stills: StreamRecapImage[] = [
  { src: "/media/live/mily-b145-01-morning.jpg", width: 640, height: 360, alt: "朝の配信で笑顔を見せるみりぃ", caption: "0:07:30 朝の笑顔", downloadName: "みりぃ_20260924朝_01.jpg" },
  { src: "/media/live/mily-b145-02-morning.jpg", width: 640, height: 360, alt: "メイクスポンジを頬に当てるみりぃ", caption: "0:10:00 メイク中のひとこま", downloadName: "みりぃ_20260924朝_02.jpg" },
  { src: "/media/live/mily-b145-03-morning.jpg", width: 640, height: 360, alt: "メイクをしながら目を細めて笑うみりぃ", caption: "0:17:30 メイクと笑顔", downloadName: "みりぃ_20260924朝_03.jpg" },
  { src: "/media/live/mily-b145-04-morning.jpg", width: 640, height: 360, alt: "朝の配信でカメラへ穏やかに話すみりぃ", caption: "0:20:00 朝のおしゃべり", downloadName: "みりぃ_20260924朝_04.jpg" },
  { src: "/media/live/mily-b145-05-morning.jpg", width: 640, height: 360, alt: "画面近くで笑顔を見せるみりぃ", caption: "0:27:30 近くでにっこり", downloadName: "みりぃ_20260924朝_05.jpg" },
  { src: "/media/live/mily-b145-06-morning.jpg", width: 640, height: 360, alt: "メイクを終えつつカメラへ話すみりぃ", caption: "0:32:30 メイクも終盤へ", downloadName: "みりぃ_20260924朝_06.jpg" },
  { src: "/media/live/mily-b145-07-morning.jpg", width: 640, height: 360, alt: "朝の配信で明るい表情を見せるみりぃ", caption: "0:35:00 明るい表情", downloadName: "みりぃ_20260924朝_07.jpg" },
  { src: "/media/live/mily-b145-08-morning.jpg", width: 640, height: 360, alt: "カメラ近くから笑顔で話すみりぃ", caption: "0:42:30 仕上がりを見せて", downloadName: "みりぃ_20260924朝_08.jpg" },
  { src: "/media/live/mily-b145-09-morning.jpg", width: 640, height: 360, alt: "メイク後に笑顔でカメラを見るみりぃ", caption: "0:45:00 メイク後の笑顔", downloadName: "みりぃ_20260924朝_09.jpg" },
  { src: "/media/live/mily-b145-10-morning.jpg", width: 640, height: 360, alt: "配信終盤に笑顔で話すみりぃ", caption: "0:50:00 まだ話していたい朝", downloadName: "みりぃ_20260924朝_10.jpg" },
  { src: "/media/live/mily-b145-11-morning.jpg", width: 640, height: 360, alt: "両手の人差し指を頬の近くに向けて笑うみりぃ", caption: "0:55:00 かわいいポーズ", downloadName: "みりぃ_20260924朝_11.jpg" },
  { src: "/media/live/mily-b145-12-morning.jpg", width: 640, height: 360, alt: "片手を広げて明るく話すみりぃ", caption: "1:02:30 締めくくりのひとこま", downloadName: "みりぃ_20260924朝_12.jpg" },
];

export const streamRecap20260924Asa: StreamRecap = {
  id: "2026-09-24-asa-showroom",
  date: "2026-09-24",
  dateLabel: "2026.09.24（木）",
  theme: "朝のメイクと大笑い",
  broadcastLabel: "5:33頃〜 約64分",
  platformLabel: "SHOWROOM",
  summary: "コンタクトを探す小さな大騒ぎから始まり、メイクをしながら朝のおしゃべり。朝ごはん、四次審査、大学の話まで広がり、終盤には「まだ終わりたくない」空気になる楽しい朝枠でした。",
  image: stills[10],
  gallery: stills,
  galleryZip: {
    src: "/media/live/mily-b145-morning-stills.zip",
    filename: "みりぃ_20260924朝_スクショ12枚.zip",
    label: "12枚まとめて保存",
  },
  highlights: [
    {
      timestamp: "0:00:18",
      title: "朝からコンタクト探し",
      body: "いつもの場所に見当たらず、配信開始早々から探しもの。朝ならではのドタバタも笑いに変わりました。",
    },
    {
      timestamp: "0:06:19",
      title: "ここからメイク開始",
      body: "これからかわいくなる、とメイクへ。スポンジやブラシを使いながら会話もどんどん弾みました。",
    },
    {
      timestamp: "0:28:06",
      title: "朝ごはんはパン派",
      body: "朝ごはんの話題ではパン派と答え、身支度の合間も食べ物トークで盛り上がりました。",
    },
    {
      timestamp: "0:31:04",
      title: "四次審査へ向けて",
      body: "これからの審査に向けて、見つけてほしい、一緒に走ってほしいと応援を呼びかけました。",
    },
    {
      timestamp: "0:40:20",
      title: "メイク完成",
      body: "仕上がりを見せながら、かわいいでしょ、と笑顔。大学へ向かう準備もいよいよ完成です。",
    },
    {
      timestamp: "0:42:00",
      title: "大学へ向かう朝",
      body: "通学や授業の話へ。前日に大学へ向かったあとオンライン授業だと知った出来事も笑い話になりました。",
    },
    {
      timestamp: "0:51:18",
      title: "朝配信を終わりたくない",
      body: "あと少しで終了というところで、楽しくて朝配信を終わりたくない、と名残惜しそうに話しました。",
      clip: { src: "/media/live-clips/mily-b145-cute.mp4", poster: stills[9].src, width: 640, height: 360, durationSeconds: 8, sourceTimestamp: "0:51:18" },
    },
    {
      timestamp: "1:01:30",
      title: "ランキングと朝のお礼",
      body: "13位から1位まで順に読み上げ、メイクを見届けてくれたことへ感謝。大学へ行ってくるね、と締めました。",
    },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1)],
  timeline: [
    { timestamp: "0:00:18", label: "コンタクトを探しながらスタート" },
    { timestamp: "0:06:19", label: "メイクを始める" },
    { timestamp: "0:28:06", label: "朝ごはんはパン派" },
    { timestamp: "0:31:04", label: "四次審査へ向けた呼びかけ" },
    { timestamp: "0:40:20", label: "メイク完成" },
    { timestamp: "0:42:00", label: "大学と授業の話" },
    { timestamp: "0:51:18", label: "朝配信を終わりたくない" },
    { timestamp: "1:00:00", label: "終盤のおしゃべり" },
    { timestamp: "1:01:30", label: "13位から1位までのお礼" },
    { timestamp: "1:03:30", label: "大学へ行ってくるねと挨拶" },
  ],
  nextNote: "配信時点では、帰宅後にも配信する予定で、時刻は決まり次第知らせると話していました。",
  sourceLabel: "2026年9月24日 SHOWROOM朝配信（オーナー提供録画・録画範囲の自動文字起こし確認）",
  verifiedAt: "2026-09-24",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は同じ録画の実フレーム12枚を掲載しています。",
    extra: "録画開始記録05:32:49、メディア実測3844.041秒から、表示を5:33頃・約64分に丸めています。録画範囲を33分割して日本語の自動文字起こしを確認しました。全編の手動聴取・逐語校正ではなく、聞き取りが不明瞭な話題は掲載していません。時刻は録画先頭からの目安です。短尺は原音を使ったファン編集です。",
  }),
};
