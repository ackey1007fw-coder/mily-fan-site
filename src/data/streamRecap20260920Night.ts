import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildRankingNote,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

const stills: StreamRecapImage[] = [
  {
    src: "/media/live/mily-b137-01-night.jpg",
    width: 640,
    height: 360,
    alt: "夜配信の冒頭で話すみりぃ",
    caption: "0:01:10 深夜配信の冒頭",
    downloadName: "みりぃ_20260920深夜_01.jpg",
  },
  {
    src: "/media/live/mily-b137-02-night.jpg",
    width: 640,
    height: 360,
    alt: "ライブイベントの話をするみりぃ",
    caption: "0:15:00 コールの話題",
    downloadName: "みりぃ_20260920深夜_02.jpg",
  },
  {
    src: "/media/live/mily-b137-03-night.jpg",
    width: 640,
    height: 360,
    alt: "応援への思いを話すみりぃ",
    caption: "0:20:35 応援への思い",
    downloadName: "みりぃ_20260920深夜_03.jpg",
  },
  {
    src: "/media/live/mily-b137-04-night.jpg",
    width: 640,
    height: 360,
    alt: "前向きな思いを語るみりぃ",
    caption: "0:40:08 前向きな思い",
    downloadName: "みりぃ_20260920深夜_04.jpg",
  },
  {
    src: "/media/live/mily-b137-05-night.jpg",
    width: 640,
    height: 360,
    alt: "配信を始めた頃を振り返るみりぃ",
    caption: "0:44:50 配信を始めた頃を振り返る",
    downloadName: "みりぃ_20260920深夜_05.jpg",
  },
  {
    src: "/media/live/mily-b137-06-night.jpg",
    width: 640,
    height: 360,
    alt: "四次審査について話すみりぃ",
    caption: "0:48:18 四次審査への呼びかけ",
    downloadName: "みりぃ_20260920深夜_06.jpg",
  },
  {
    src: "/media/live/mily-b137-07-night.jpg",
    width: 640,
    height: 360,
    alt: "応援方法について話すみりぃ",
    caption: "0:54:12 応援・投票の話",
    downloadName: "みりぃ_20260920深夜_07.jpg",
  },
  {
    src: "/media/live/mily-b137-08-night.jpg",
    width: 640,
    height: 360,
    alt: "深夜のトークを続けるみりぃ",
    caption: "1:00:00 深夜のトーク",
    downloadName: "みりぃ_20260920深夜_08.jpg",
  },
  {
    src: "/media/live/mily-b137-09-night.jpg",
    width: 640,
    height: 360,
    alt: "ランキングを読み上げるみりぃ",
    caption: "1:16:42 ランキング読み上げ",
    downloadName: "みりぃ_20260920深夜_09.jpg",
  },
  {
    src: "/media/live/mily-b137-10-night.jpg",
    width: 640,
    height: 360,
    alt: "配信終盤にお礼を伝えるみりぃ",
    caption: "1:22:02 終盤のお礼",
    downloadName: "みりぃ_20260920深夜_10.jpg",
  },
];

export const streamRecap20260920Night: StreamRecap = {
  id: "2026-09-20-night-showroom",
  date: "2026-09-20",
  dateLabel: "2026.09.20（日）",
  theme: "深夜の振り返りトーク",
  broadcastLabel: "23:51頃〜 約83分",
  platformLabel: "SHOWROOM",
  summary:
    "ライブイベント帰りの深夜配信。会場での楽しさやコールを振り返り、配信を始めた頃の気持ち、応援への感謝、四次審査へ向けた思いをじっくり語りました。終盤はランキングを読み上げ、翌朝の配信について案内しています。",
  image: stills[3],
  gallery: stills,
  galleryZip: {
    src: "/media/live/mily-b137-night-stills.zip",
    filename: "みりぃ_20260920深夜_スクショ10枚.zip",
    label: "10枚まとめて保存",
  },
  highlights: [
    {
      timestamp: "0:00:35",
      title: "イベント帰りの余韻",
      body: "外出先のライブイベントから戻って配信を開始。会場の盛り上がりや楽しかった場面を思い返しながら、深夜トークが始まりました。",
    },
    {
      timestamp: "0:14:58",
      title: "コールの話で盛り上がる",
      body: "会場で耳にしたコールや応援の掛け声を振り返り、覚えてみたいものを一緒に確認しながら盛り上がりました。",
    },
    {
      timestamp: "0:20:28",
      title: "最初からの応援を大切に",
      body: "配信の輪が大きくなっても、今ここに来てくれている人たちは忘れられない存在だと話しました。",
    },
    {
      timestamp: "0:40:06",
      title: "照らす存在になりたい",
      body: "応援に支えられることへの感謝を語り、自分もみんなを照らすような存在になりたいと前向きな気持ちを伝えました。",
    },
    {
      timestamp: "0:44:49",
      title: "もっと早く出会いたかった",
      body: "配信を始める前は迷いもあったものの、今ではもっと早く始めて、もっと早くみんなと出会いたかったと振り返りました。",
    },
    {
      timestamp: "0:47:05",
      title: "初配信から毎日へ",
      body: "初めての配信に思った以上の人が来てくれたことがきっかけになり、次の日からも続けてみようと思った経緯を話しました。",
    },
    {
      timestamp: "0:48:04",
      title: "四次審査へ一緒に",
      body: "三次審査を通過し、10月2日から始まる四次審査を前に、これからも一緒に進んでほしいと呼びかけました。",
    },
    {
      timestamp: "1:16:38",
      title: "ランキングと深夜の感謝",
      body: "13位から1位までランキングを読み上げ、遅い時間に集まってくれたことへ感謝。最後まで一人ひとりにお礼を伝えました。",
    },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1)],
  timeline: [
    { timestamp: "0:00:23", label: "深夜配信スタート" },
    { timestamp: "0:00:35", label: "ライブイベント帰りの話" },
    { timestamp: "0:14:58", label: "会場のコールを振り返る" },
    { timestamp: "0:20:28", label: "応援してくれる人への思い" },
    { timestamp: "0:40:06", label: "みんなを照らす存在になりたいと語る" },
    { timestamp: "0:44:49", label: "配信を始めた頃を振り返る" },
    { timestamp: "0:47:05", label: "初配信から毎日続けた経緯" },
    { timestamp: "0:48:04", label: "四次審査への呼びかけ" },
    { timestamp: "0:54:10", label: "応援・投票の流れを説明" },
    { timestamp: "1:16:38", label: "13位から1位までランキングを読み上げ" },
    { timestamp: "1:20:52", label: "深夜に来てくれたことへお礼" },
    { timestamp: "1:20:55", label: "翌朝の配信について案内" },
    { timestamp: "1:22:02", label: "最後のお礼" },
  ],
  nextNote:
    "配信時点では、翌朝にラジオ形式で配信できたらと案内していましたが、時間は未定としていました。",
  sourceLabel:
    "2026年9月20日 SHOWROOM深夜配信（オーナー提供録画・自動文字起こし確認）",
  verifiedAt: "2026-09-21",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は同じ録画の実フレーム10枚を掲載しています。",
    extra:
      "保存録画全体を42区間に分け、日本語の自動文字起こし1,935区間を統合して確認しました。全編の手動聴取・逐語校正ではありません。録画開始記録23:51:00、メディア実測4951.573秒から約83分としています。終盤のランキング13位から1位と翌朝の案内は別モデルでも再確認しました。時刻は録画先頭からの目安で、完全収録は保証しません。",
  }),
};
