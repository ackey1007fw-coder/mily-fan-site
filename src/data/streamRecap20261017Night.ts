import type { StreamRecap } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

// 2026/10/17夜の保存録画に対応する速報ASR（147処理チャンク）を参照。
// 全編の原音手動聴取、映像と文字起こしの全区間照合、曲目の確定は未実施。
// 個人別コメント・表示名・全文ASRは公開しない。当該記事への実写真掲載をサイトオーナーが明示承認。
// 同じ回の保存録画に由来する実写真。背景付箋の細字のみぼかし、人物の顔や身体の生成・補正なし。
const nightGallery = [
  {
    src: "/media/live/mily-b229-01-night-smile-greeting-00075s.jpg",
    width: 640,
    height: 360,
    alt: "カメラへ笑顔を向ける夜の配信中のみりぃ",
    caption: "0:01:15｜笑顔で夜のごあいさつ",
    downloadName: "mily-b229-01-night-smile-greeting-00075s.jpg",
  },
  {
    src: "/media/live/mily-b229-02-night-both-hands-wave-01101s.jpg",
    width: 640,
    height: 360,
    alt: "両手を合わせて笑顔を見せる夜のみりぃ",
    caption: "0:18:21｜明るい笑顔と手のポーズ",
    downloadName: "mily-b229-02-night-both-hands-wave-01101s.jpg",
  },
  {
    src: "/media/live/mily-b229-03-night-side-smile-01275s.jpg",
    width: 640,
    height: 360,
    alt: "髪を持ち上げてヘアスタイルを見せるみりぃ",
    caption: "0:21:15｜髪型を見せるひとこま",
    downloadName: "mily-b229-03-night-side-smile-01275s.jpg",
  },
  {
    src: "/media/live/mily-b229-04-night-farewell-wave-02923s.jpg",
    width: 640,
    height: 360,
    alt: "終盤にカメラを見つめて微笑むみりぃ",
    caption: "0:48:43｜終盤のやさしい笑顔",
    downloadName: "mily-b229-04-night-farewell-wave-02923s.jpg",
  },
];

export const streamRecap20261017Night: StreamRecap = {
  id: "2026-10-17-night-showroom",
  date: "2026-10-17",
  dateLabel: "2026.10.17（土）",
  theme: "夜の髪型と焼き肉の話",
  broadcastLabel: "録画開始22:29頃〜 約49分",
  platformLabel: "SHOWROOM",
  summary:
    "ポニーテールの話から始まり、忙しかった一日の食事や焼き肉の話題へ。コメントとのやり取りを楽しみながら、次の挑戦や応援への感謝にも触れた夜の配信でした。",
  image: nightGallery[0],
  gallery: nightGallery,
  highlights: [
    {
      timestamp: "0:00:44",
      title: "ポニーテールの夜",
      body: "髪型の話題から、夜のおしゃべりがスタート。ポニーテールについて話しながら、集まった人たちを迎えました。",
    },
    {
      timestamp: "0:03:55",
      title: "次の挑戦にも触れて",
      body: "セミファイナルに言及する場面も。新しいステージへ向かう時間の中で、応援への呼びかけを交えました。",
    },
    {
      timestamp: "0:04:46",
      title: "忙しかった一日の話",
      body: "アルバイトで忙しかった日を振り返り、食事の時間やまかないの話題に。身近な出来事を楽しく話しました。",
    },
    {
      timestamp: "0:22:12",
      title: "焼き肉談義が広がる",
      body: "焼き肉の話が続き、カルビやハラミなどの話題も登場。食べ方や好みについて会話が広がりました。",
    },
    {
      timestamp: "0:41:04",
      title: "ラジオの話題も",
      body: "おしゃべりの中ではラジオにも触れ、普段の活動の話題へ。日常と配信がつながる時間になりました。",
    },
    {
      timestamp: "0:46:53",
      title: "夜の終わりにありがとう",
      body: "終盤はコメントに応じながら、来てくれた人たちへ感謝。夜の時間を一緒に過ごした人へ挨拶しました。",
      relatedLinks: [
        {
          label: "MILY SIGNAL・10月17日夜の匿名分析",
          url: "/data-lab/reports/20261017-night/",
        },
      ],
    },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:00:44", label: "ポニーテールの話題" },
    { timestamp: "0:03:55", label: "セミファイナルへの言及" },
    { timestamp: "0:04:46", label: "忙しかった一日を振り返る" },
    { timestamp: "0:05:00", label: "まかないと食事の話" },
    { timestamp: "0:15:00", label: "一緒に話せる時間について" },
    { timestamp: "0:22:12", label: "焼き肉とカルビの話" },
    { timestamp: "0:27:49", label: "ハラミや焼き方の話題" },
    { timestamp: "0:41:04", label: "ラジオについての会話" },
    { timestamp: "0:46:53", label: "来てくれた人たちへの挨拶" },
    { timestamp: "0:49:00", label: "締めくくりのありがとう" },
  ],
  nextNote: "",
  sourceLabel:
    "2026年10月17日 夜のSHOWROOM配信（保存録画の実フレーム・速報自動文字起こし）",
  verifiedAt: "2026-10-18",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当該回の保存録画から抽出した実フレーム4枚です。",
    extra:
      "保存録画の処理開始は22:29頃、保存メディア尺は約49分08秒です。正式な放送開始・終了時刻や全区間の録画連続性を確定するものではありません。速報自動文字起こし147処理チャンクを参照しました。見どころと時刻は録画先頭からの目安で、全編の手動聴取や逐語校正は行っていません。曲名とランキング読み上げの詳細は確定していないため掲載していません。きら星2,970・総訪問表示90・コメント453は最後の有効オンライン画面参考値で、配信終了時の確定値・実人数・イベントポイントではありません。収集品質はデータラボで確認できます。10月12日までの四次審査累計には加算していません。",
  }),
};
