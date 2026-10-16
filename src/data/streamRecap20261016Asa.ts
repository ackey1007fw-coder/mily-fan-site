import type { StreamRecap } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildRankingNote,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

// 2026-10-16朝。保存録画の実フレームと同一録画の速報ASR（169チャンク）を確認。
// 本文の時刻はASRの経過秒による目安。原音全編の手動聴取・逐語校正・厳密な映像同期は未実施。
// 数値は既存MILY SIGNALを参照し、ここには集計を複製しない。
const morningStill = {
  src: "/media/live/mily-b226-01-20261016-morning-postit-pose.jpg",
  width: 640,
  height: 360,
  alt: "付箋をカメラに見せ、首をかしげて頬に手を添えるみりぃ",
  caption: "0:05:50｜付箋を見せてスクショタイム（文字は非表示）",
  downloadName: "mily-b226-01-20261016-morning-postit-pose.jpg",
};

export const streamRecap20261016Asa: StreamRecap = {
  id: "2026-10-16-morning-showroom",
  date: "2026-10-16",
  dateLabel: "2026.10.16（金）",
  theme: "朝の出会いと次への思い",
  broadcastLabel: "録画開始6:35頃〜 約56分",
  platformLabel: "SHOWROOM",
  summary:
    "朝の挨拶から、季節の話やリスナーとの出会いへ。みんなと話す楽しさとセミファイナル進出への感謝、ファイナルを目指す思いを語りました。終盤にはランキングを読み上げ、一日を頑張るエールを送りました。",
  image: morningStill,
  highlights: [
    {
      timestamp: "0:00:43",
      title: "朝早くの挨拶",
      body: "朝から立ち寄ってくれた人たちに挨拶。来てくれたことへの感謝を伝えながら、朝のおしゃべりが始まりました。",
    },
    {
      timestamp: "0:05:00",
      title: "ラジオのように聴いてね",
      body: "忙しい朝にはコメントしにくいことにも触れ、ラジオのように聴いていてほしいと呼びかけました。",
    },
    {
      timestamp: "0:18:35",
      title: "ひと足早いクリスマス",
      body: "買い物先でクリスマスの売り場を見つけて驚いた話に。ハロウィンから年末へと、季節の移り変わりを話しました。",
    },
    {
      timestamp: "0:31:51",
      title: "みんなと話す楽しさ",
      body: "リスナーとの会話が楽しく、時間を切り上げるのが難しいという話をしました。話し相手になってくれるみんなへの感謝も伝えました。",
    },
    {
      timestamp: "0:34:25",
      title: "また来たいと思える出会い",
      body: "初めて来てくれた人を迎えながら、配信に足を止めてもらう難しさを話題に。また見に来たいと思ってもらうには、と考えました。",
    },
    {
      timestamp: "0:50:00",
      title: "ファイナルを目指して",
      body: "四次審査を突破してセミファイナルへの進出が決まったことを改めて報告。ファイナルを目指す思いと、応援の言葉が力になることを伝えました。",
    },
    {
      timestamp: "0:53:09",
      title: "朝の応援へありがとう",
      body: "終盤にはランキングを読み上げ、朝からの応援に感謝。最後は一日を頑張ろうというエールと、行ってきますの挨拶で締めくくりました。",
      relatedLinks: [
        { label: "MILY SIGNAL・10月16日朝の匿名分析", url: "/data-lab/#morning-20261016" },
      ],
    },
  ],
  goals: [],
  ranking: [buildRankingNote(undefined, undefined, "during")],
  timeline: [
    { timestamp: "0:00:43", label: "朝の挨拶" },
    { timestamp: "0:05:00", label: "ラジオのように聴く朝の配信" },
    { timestamp: "0:18:35", label: "クリスマスの売り場と季節の話" },
    { timestamp: "0:31:51", label: "会話の楽しさと感謝" },
    { timestamp: "0:34:25", label: "配信での新しい出会い" },
    { timestamp: "0:50:00", label: "セミファイナル進出と次の目標" },
    { timestamp: "0:53:09", label: "ランキング読み上げ" },
    { timestamp: "0:55:40", label: "夜への言及と一日のエール" },
  ],
  nextNote:
    "配信時点では、同日夜にも配信する予定に触れていました。時刻は確定できないため、現在の確定予定としては掲載しません。",
  sourceLabel:
    "2026年10月16日 朝のSHOWROOM配信（保存録画の実フレーム・速報自動文字起こし）",
  verifiedAt: "2026-10-16",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画の実フレーム1枚です。",
    extra:
      "録画処理は6:35:03〜7:32:07頃、保存メディアは約56分12秒で、配信の確定開始・終了時刻や全配信時間ではありません。通信エラーがあり、完全収録は未確定です。見どころと索引の時刻は自動文字起こしの経過秒による目安で、実映像との厳密な同期は未確認です。歌唱曲は特定できていないため、曲目は掲載していません。配信終了時の最終値は未確定です。数値と観測時点はリンク先のMILY SIGNALにまとめ、10月12日までの四次審査集計には加えていません。",
  }),
};
