import type { StreamRecap } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildRankingNote,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

// 2026-10-15夜SHOWROOM。保存録画の速報ASR247チャンクと録画サイドカー・匿名画面値を参照。
// 原音全編の手動聴取・逐語校正・映像との厳密な同期は未実施。見どころは録画先頭からの目安。
// 配信末尾の画面数値は未取得。録画・個別視聴者・全文文字起こしは一般公開しない。
// 2026-10-16の追加依頼で当日録画の実フレーム2枚を掲載。
const nightGallery = [
  {
    src: "/media/live/mily-b227-01-20261015-night-smile-001500.jpg",
    width: 640,
    height: 360,
    alt: "笑顔で話すみりぃ",
    caption: "0:15:00｜応援を振り返る夜の笑顔",
    downloadName: "mily-b227-01-20261015-night-smile-001500.jpg",
  },
  {
    src: "/media/live/mily-b227-02-20261015-night-talk-010700.jpg",
    width: 640,
    height: 360,
    alt: "カメラへ笑顔を向けるみりぃ",
    caption: "1:07:00｜次の挑戦を語る夜のおしゃべり",
    downloadName: "mily-b227-02-20261015-night-talk-010700.jpg",
  }
];

export const streamRecap20261015Night: StreamRecap = {
  id: "2026-10-15-night-showroom",
  date: "2026-10-15",
  dateLabel: "2026.10.15（木）",
  theme: "夜の四次審査突破と感謝",
  broadcastLabel: "録画開始21:59頃〜 約82分",
  platformLabel: "SHOWROOM",
  summary: "四次審査の通過を報告し、セミファイナル進出を喜んだ夜。応援への感謝に加え、ラジオでの活動や次の挑戦についても話しました。終盤はランキングを読み上げ、翌朝の配信を案内しました。",
  image: nightGallery[0],
  gallery: nightGallery,
  highlights: [
    {
      timestamp: "0:00:51",
      title: "四次審査突破の報告",
      body: "配信の冒頭で四次審査を通過できたことに触れ、セミファイナル進出を報告。集まってくれたみんなに感謝を伝えました。",
    },
    {
      timestamp: "0:10:54",
      title: "応援を振り返る喜び",
      body: "審査を振り返りながら、支えてくれた人たちへの感謝を重ねて伝えました。喜びを分かち合う話が続きました。",
    },
    {
      timestamp: "0:27:00",
      title: "Xでのやりとりも励みに",
      body: "本人のXに届くコメントについて触れ、応援の言葉をもらえるうれしさを話しました。",
    },
    {
      timestamp: "0:45:18",
      title: "セミファイナルへの気持ち",
      body: "セミファイナルへ進んだことで、これからの応援や挑戦がどう変わっていくかを話題にしました。",
    },
    {
      timestamp: "0:58:40",
      title: "ラジオでの活動の話",
      body: "ラジオパーソナリティとしての活動に触れ、メッセージを送ってくれる人たちへの感謝と放送の楽しさを伝えました。",
    },
    {
      timestamp: "1:05:40",
      title: "結果の先にある思い",
      body: "先の結果がどうであっても応援してもらえたことは大切だという思いを語り、ファイナルを目指して頑張る姿勢を伝えました。",
    },
    {
      timestamp: "1:18:20",
      title: "四次審査へのありがとう",
      body: "四次審査を楽しく続けられたことや、そこでの出会いを振り返りました。これからも応援してもらえるように頑張りたいと語りました。",
    },
    {
      timestamp: "1:19:20",
      title: "ランキングと翌朝の案内",
      body: "終盤にランキングを読み上げ、応援への感謝を伝えました。最後は翌朝の配信を案内し、挨拶して締めくくりました。",
      relatedLinks: [
        { label: "MILY SIGNAL・10月15日夜の匿名分析", url: "/data-lab/#night-20261015" },
        { label: "翌10月16日朝の配信レポート", url: "/activities/live/#recap-2026-10-16-morning-showroom" },
      ],
    }
  ],
  goals: [],
  ranking: [buildRankingNote(undefined, undefined, "during")],
  timeline: [
    { timestamp: "0:00:04", label: "帰宅直後の挨拶" },
    { timestamp: "0:00:51", label: "四次審査突破・セミファイナル進出" },
    { timestamp: "0:10:54", label: "応援への感謝" },
    { timestamp: "0:23:50", label: "翌朝の配信についての言及" },
    { timestamp: "0:27:00", label: "Xへのコメントと応援の話" },
    { timestamp: "0:45:18", label: "次のセミファイナルの話" },
    { timestamp: "0:51:40", label: "SNSでの発信の話" },
    { timestamp: "0:58:40", label: "ラジオの活動とメッセージ" },
    { timestamp: "1:05:40", label: "ファイナルを目指す思い" },
    { timestamp: "1:18:20", label: "四次審査を振り返る感謝" },
    { timestamp: "1:19:20", label: "ランキング読み上げ" },
    { timestamp: "1:21:20", label: "翌朝の配信案内と挨拶" }
  ],
  nextNote: "配信時点では、翌10月16日朝6時半頃から配信すると案内していました。この案内は当時のもので、今後の確定予定ではありません。",
  sourceLabel:
    "2026年10月15日 夜のSHOWROOM配信（保存録画・速報自動文字起こし）",
  verifiedAt: "2026-10-16",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画の実フレーム2枚です。",
    extra: "録画処理は21:59:58〜23:23:20頃、保存映像の尺は約82分15秒で、放送の確定開始・終了時刻や全編の完全収録を意味しません。通信エラーがあります。自動文字起こし247処理チャンクには認識誤りがあり、見どころの時刻は録画先頭基準の目安で、原音の全編手動聴取や逐語校正は未実施です。歌唱曲や不明瞭な固有名詞は載せていません。22:03:19のきら星510・コメント31は早い時点のオンライン参考値で、総訪問と配信終了時の数値は未取得です。10月12日までの四次審査ポイントには加算していません。",
  }),
};
