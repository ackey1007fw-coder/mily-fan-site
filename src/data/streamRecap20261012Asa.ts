import type { StreamRecap } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  RANKING_NOTE_WITHOUT_RANGE,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

// 時刻は保存録画の先頭から。公開はUIなしの実映像12時点のみ。
const moments = [
  [1, "0:03:10", "カメラの外へ目線を向けながら笑うみりぃ"],
  [2, "0:07:40", "手を頬に添えて話すみりぃ"],
  [3, "0:10:20", "手を合わせながらおしゃべりするみりぃ"],
  [4, "0:20:40", "髪に触れて笑顔を見せるみりぃ"],
  [5, "0:25:40", "両手を頬に添えて笑うみりぃ"],
  [6, "0:32:40", "視線を上に向けてほほえむみりぃ"],
  [7, "0:36:15", "両手を猫の手のように丸めて笑うみりぃ"],
  [8, "0:36:24", "両腕で大きなハートを作って笑うみりぃ"],
  [9, "0:49:50", "両手で髪を整えるみりぃ"],
  [10, "0:56:20", "両手を合わせて拍手するみりぃ"],
  [11, "0:59:30", "配信の終わりに手を振るみりぃ"],
  [12, "1:00:00", "ピースで笑顔を見せるみりぃ"],
] as const;

const gallery = moments.map(([index, time, alt]) => {
  const downloadName =
    `mily-b214-${String(index).padStart(2, "0")}-20261012-asa-still.jpg`;
  return {
    src: `/media/live/${downloadName}`,
    width: 640,
    height: 360,
    alt,
    caption: `${time}｜${alt}`,
    downloadName,
  };
});

export const streamRecap20261012Asa: StreamRecap = {
  id: "2026-10-12-asa-showroom",
  date: "2026-10-12",
  dateLabel: "2026.10.12（月）",
  theme: "朝の最終日と笑顔のエール",
  broadcastLabel: "録画開始5:32頃〜 約61分",
  platformLabel: "SHOWROOM",
  summary:
    "MISS CIRCLE CONTEST 2026の四次審査最終日。朝から訪れた人たちに感謝を伝え、ファイナルを目指す思いや好きなことを話しました。終盤には夜21:00〜21:59の最終枠を案内。笑顔やピースを当日の実写真12枚で振り返ります。",
  image: gallery[6],
  gallery,
  galleryNote:
    "当日の保存録画から選んだ実フレーム12枚です。各写真の時刻は録画先頭からの目安で、配信開始時刻ではありません。",
  galleryZip: {
    src: "/media/live/mily-b214-13-20261012-asa-stills.zip",
    filename: "mily_20261012_morning_screenshots_12.zip",
    label: "12枚まとめて保存",
  },
  highlights: [
    {
      timestamp: "0:00:41",
      title: "早朝からありがとう",
      body: "早朝から集まったリスナーに挨拶し、応援への感謝を何度も伝えながら配信が始まりました。",
    },
    {
      timestamp: "0:07:26",
      title: "四次審査の最終日",
      body: "コンテスト審査がいよいよ最終日であることを伝え、最後まで見守ってほしいと呼びかけました。",
    },
    {
      timestamp: "0:12:46",
      title: "ファイナルへの思い",
      body: "以前は自分が目指してよいか迷うこともあったと話し、応援する人の言葉を受けて、ファイナルへ進みたい気持ちが固まったと伝えました。",
    },
    {
      timestamp: "0:22:26",
      title: "周りの挑戦にも刺激",
      body: "コンテストに挑戦する人たちの頑張りにも触れ、自分も最後まで努力したいと話していました。",
    },
    {
      timestamp: "0:28:26",
      title: "応援を力に変えて",
      body: "励ましの言葉や応援の報告を受けて、これまでの取り組みへの思いを話しました。",
    },
    {
      timestamp: "0:38:15",
      title: "好きなことのおしゃべり",
      body: "リスナーとの会話から趣味などの話題に広がり、和やかなおしゃべりが続きました。",
    },
    {
      timestamp: "0:45:55",
      title: "食べ物の話題で笑顔",
      body: "IKEAのホットドッグやソフトクリームの話で盛り上がり、昼は大学のため配信できず、次は夜が最終枠になると説明しました。",
    },
    {
      timestamp: "0:57:40",
      title: "夜の最終枠へ",
      body: "夜21:00〜21:59の予定と、少し早く始める可能性を案内。集まった人へのお礼と挨拶で朝の枠を締めくくりました。",
    },
  ],
  goals: [],
  ranking: [RANKING_NOTE_WITHOUT_RANGE],
  timeline: [
    { timestamp: "0:00:41", label: "朝の挨拶と感謝" },
    { timestamp: "0:07:26", label: "四次審査の最終日" },
    { timestamp: "0:12:46", label: "ファイナルを目指す思い" },
    { timestamp: "0:20:40", label: "髪に触れる仕草と笑顔" },
    { timestamp: "0:22:26", label: "挑戦を続ける気持ち" },
    { timestamp: "0:25:40", label: "両手を頬に添えた笑顔" },
    { timestamp: "0:28:26", label: "応援で生まれた手応え" },
    { timestamp: "0:36:15", label: "猫の手ポーズ" },
    { timestamp: "0:36:24", label: "頭上に大きなハート" },
    { timestamp: "0:38:15", label: "趣味の話題" },
    { timestamp: "0:45:55", label: "食べ物のおしゃべり" },
    { timestamp: "0:49:50", label: "髪を整えるみりぃ" },
    { timestamp: "0:56:20", label: "拍手と笑顔" },
    { timestamp: "0:57:40", label: "夜の最終枠の案内" },
    { timestamp: "0:59:30", label: "手を振って挨拶" },
    { timestamp: "1:00:00", label: "ピースでにっこり" },
  ],
  nextNote:
    "配信時点では夜21:00〜21:59を最終枠の予定と案内し、少し早く始める可能性にも触れていました。最新情報は本人の告知を確認してください。",
  sourceLabel:
    "2026年10月12日 朝のSHOWROOM配信（保存録画・自動文字起こし・提供スクショ照合）",
  verifiedAt: "2026-10-12",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画から切り出した実フレーム12枚です。",
    extra:
      "発話は全編の自動文字起こしをもとに確認し、可愛い仕草や笑顔は当日の保存録画フレームで照合しました。全編の手動聴取・逐語校正は未実施です。音声認識に不確かな言葉があるため、発言の直接引用・未確認の曲名・ギフト確定数値・ランキング個人名は掲載していません。提供された配信画面スクショ8枚には視聴者表示名やアバターが写るため、公開写真にはUIのない録画映像から切り出したフレームだけを採用しました。録画開始5:32頃は配信全体の開始を確定する時刻ではなく、約61分は保存録画の尺です。夜21:00〜21:59はこの配信中に案内した予定で、夜の実施結果ではありません。",
  }),
};
