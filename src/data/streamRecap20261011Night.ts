import type { StreamRecap } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  RANKING_NOTE_WITHOUT_RANGE,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

// 写真の時刻は放送開始ではなく、同日の保存録画の先頭からの目安。
// コメント欄・視聴者名のない実フレームだけを採用しています。
const moments = [
  [1, "0:00:35", "三つ編み姿で話し始めるみりぃ"],
  [2, "0:02:35", "カメラに微笑むみりぃ"],
  [3, "0:05:05", "笑顔を見せるみりぃ"],
  [4, "0:07:35", "手で口元を覆いながら笑うみりぃ"],
  [5, "0:18:25", "カメラの近くで笑顔を見せるみりぃ"],
  [6, "0:21:45", "両手を広げて話すみりぃ"],
  [7, "0:28:25", "目を細めて笑うみりぃ"],
  [8, "0:31:45", "指で輪を作って話すみりぃ"],
  [9, "0:35:05", "髪に手を添えて微笑むみりぃ"],
  [10, "0:41:45", "口元を整えるみりぃ"],
  [11, "0:51:45", "翌日の予定を書いたメモを見せるみりぃ"],
  [12, "0:55:05", "両手を振って挨拶するみりぃ"],
] as const;

const gallery = moments.map(([index, time, alt]) => {
  const downloadName = "mily-b211-" + String(index).padStart(2, "0") + "-20261011-night-still.jpg";
  return {
    src: "/media/live/" + downloadName,
    width: 640,
    height: 360,
    alt,
    caption: time + "｜" + alt,
    downloadName,
  };
});

export const streamRecap20261011Night: StreamRecap = {
  id: "2026-10-11-night-showroom",
  date: "2026-10-11",
  dateLabel: "2026.10.11（日）",
  theme: "夜のラジオと最終日前夜",
  broadcastLabel: "録画開始20:30頃〜 約56分",
  platformLabel: "SHOWROOM",
  summary:
    "ラジオ出演を振り返り、聴いてくれた人へ感謝を伝えた夜。歌やメイクの話を交え、翌12日の四次審査最終日に向けて呼びかけました。当日の実写真12枚とともに振り返ります。",
  image: gallery[2],
  gallery,
  galleryNote:
    "当日の保存録画から選んだ実フレーム12枚です。写真の時刻は録画の先頭からの目安で、配信全体の開始時刻とは異なります。",
  galleryZip: {
    src: "/media/live/mily-b211-13-20261011-night-stills.zip",
    filename: "mily_20261011_night_screenshots_12.zip",
    label: "12枚まとめて保存",
  },
  highlights: [
    {
      timestamp: "0:00:57",
      title: "慌ただしい一日から配信へ",
      body: "忙しい一日だったと振り返り、朝から応援してくれた人たちへのお礼を伝えながら夜の配信を始めました。",
    },
    {
      timestamp: "0:06:15",
      title: "コンテストと応援の話",
      body: "審査や応援の話題に触れ、見守ってくれる人たちへの感謝を繰り返し伝えました。",
    },
    {
      timestamp: "0:17:40",
      title: "今日のラジオを振り返る",
      body: "10時から13時まで担当したラジオの話へ。番組でメッセージをもらい、たくさん話したことを紹介しました。",
    },
    {
      timestamp: "0:24:05",
      title: "ラジオも聴いてくれる人へ",
      body: "SHOWROOMで話すだけでなく、ラジオにも耳を傾けてくれる人たちのことを取り上げ、お礼を伝えました。",
    },
    {
      timestamp: "0:31:00",
      title: "一日を通したメイクの話",
      body: "朝から活動していたことに触れ、メイクの様子についてリスナーと楽しく話しました。",
    },
    {
      timestamp: "0:35:25",
      title: "歌を届けるひととき",
      body: "会話の途中には歌う時間も。歌い終えた後は、またリスナーとのおしゃべりへ戻りました。",
    },
    {
      timestamp: "0:51:45",
      title: "翌日の最終日を案内",
      body: "翌12日が審査最終日であることを話し、朝と夜の配信予定を書いたメモも画面に見せました。",
    },
    {
      timestamp: "0:53:35",
      title: "応援へのお礼と締めくくり",
      body: "配信の終わりにはランキングを読み上げて感謝を伝え、翌日への呼びかけと挨拶で締めくくりました。",
    },
  ],
  goals: [],
  ranking: [RANKING_NOTE_WITHOUT_RANGE],
  timeline: [
    { timestamp: "0:00:57", label: "一日の振り返りと感謝" },
    { timestamp: "0:06:15", label: "コンテスト・応援へのお礼" },
    { timestamp: "0:08:49", label: "リスナーとの会話" },
    { timestamp: "0:17:40", label: "今日のラジオを紹介" },
    { timestamp: "0:24:05", label: "ラジオを聴いてくれる人へ" },
    { timestamp: "0:28:25", label: "笑顔でおしゃべり" },
    { timestamp: "0:31:00", label: "朝からのメイクの話" },
    { timestamp: "0:35:25", label: "歌唱のひととき" },
    { timestamp: "0:39:55", label: "リスナーの応援と交流" },
    { timestamp: "0:41:45", label: "口元のメイク" },
    { timestamp: "0:51:45", label: "翌12日の予定メモ" },
    { timestamp: "0:53:35", label: "ランキング読み上げ" },
    { timestamp: "0:55:05", label: "終わりの挨拶" },
  ],
  nextNote:
    "配信時点では、翌12日朝5:30〜6:30・夜21:00〜21:59の予定を手書きメモで案内していました。最新の予定は本人の告知を確認してください。",
  sourceLabel: "2026年10月11日 夜のSHOWROOM配信（保存録画・自動文字起こし）",
  verifiedAt: "2026-10-11",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画から切り出した実フレーム12枚です。",
    extra:
      "配信全体の自動文字起こしをもとに話題を要約し、写真の表情とメモの表示は当日の録画フレームで確認しました。全編の実聴・逐語校正は未実施です。文字起こしには聞き間違いがあります。歌唱部分の曲名・歌詞や、審査順位・ギフトの確定数値は載せていません。録画開始20:30頃は配信全体の開始時刻を確定する情報ではありません。録画は約56分で正常保存されました。翌日の予定は配信時点の案内です。",
  }),
};
