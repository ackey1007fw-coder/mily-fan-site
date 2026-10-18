import type { StreamRecap } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildRankingNote,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

// 同一録画の速報ASR 203処理チャンクと、実寸確認した録画実フレームによる記録。
// 全編手動聴取・逐語校正・厳密な映像同期は未実施。数値の正本は既存MILY SIGNAL。
const nightGallery = [
  {
    src: "/media/live/mily-b228-01-20261016-night-greeting.jpg",
    width: 640,
    height: 360,
    alt: "カメラに向かって夜の挨拶をするみりぃ",
    caption: "0:00:20｜夜のおしゃべりの始まり",
    downloadName: "mily-b228-01-20261016-night-greeting.jpg",
  },
  {
    src: "/media/live/mily-b228-02-20261016-night-close-smile.jpg",
    width: 640,
    height: 360,
    alt: "カメラへ身を寄せて笑顔を見せるみりぃ",
    caption: "0:16:00｜近くでにっこり",
    downloadName: "mily-b228-02-20261016-night-close-smile.jpg",
  },
  {
    src: "/media/live/mily-b228-03-20261016-night-radio-talk.jpg",
    width: 640,
    height: 360,
    alt: "カメラを見ながらラジオの話をするみりぃ",
    caption: "0:26:00｜ラジオの楽しさを紹介",
    downloadName: "mily-b228-03-20261016-night-radio-talk.jpg",
  },
  {
    src: "/media/live/mily-b228-04-20261016-night-hair-chat.jpg",
    width: 640,
    height: 360,
    alt: "首を少しかしげて笑うみりぃ",
    caption: "0:31:00｜髪型の話へ",
    downloadName: "mily-b228-04-20261016-night-hair-chat.jpg",
  },
  {
    src: "/media/live/mily-b228-05-20261016-night-bun-pose.jpg",
    width: 640,
    height: 360,
    alt: "髪を頭の上でまとめ、笑顔を見せるみりぃ",
    caption: "0:37:23｜お団子の髪型を試して",
    downloadName: "mily-b228-05-20261016-night-bun-pose.jpg",
  },
  {
    src: "/media/live/mily-b228-06-20261016-night-fragrance-talk.jpg",
    width: 640,
    height: 360,
    alt: "ボトルを手に持ちながら横を向いて話すみりぃ",
    caption: "0:53:00｜お気に入りの香りの話",
    downloadName: "mily-b228-06-20261016-night-fragrance-talk.jpg",
  },
  {
    src: "/media/live/mily-b228-07-20261016-night-relaxed-talk.jpg",
    width: 640,
    height: 360,
    alt: "両手を前に寄せておしゃべりするみりぃ",
    caption: "0:56:00｜ゆったり続く会話",
    downloadName: "mily-b228-07-20261016-night-relaxed-talk.jpg",
  },
  {
    src: "/media/live/mily-b228-08-20261016-night-goodnight.jpg",
    width: 640,
    height: 360,
    alt: "胸の前で両手を合わせて挨拶するみりぃ",
    caption: "1:06:00｜みんなへのありがとう",
    downloadName: "mily-b228-08-20261016-night-goodnight.jpg",
  },
];

export const streamRecap20261016Night: StreamRecap = {
  id: "2026-10-16-night-showroom",
  date: "2026-10-16",
  dateLabel: "2026.10.16（金）",
  theme: "夜の髪型相談と香りの話",
  broadcastLabel: "録画開始21:49頃〜 約67分",
  platformLabel: "SHOWROOM",
  summary:
    "夜の挨拶から、ラジオの紹介や髪型の相談、お気に入りの香りの話へ。ゆったりした会話を楽しみ、終盤はランキングの読み上げと応援への感謝、セミファイナルに向けた思いで締めくくりました。",
  image: nightGallery[4],
  gallery: nightGallery,
  highlights: [
    {
      timestamp: "0:00:20",
      title: "夜のおしゃべりの始まり",
      body: "帰ってきた挨拶とともに、夜のおしゃべりが始まりました。立ち寄ってくれた人たちを迎えながら、一日を振り返りました。",
    },
    {
      timestamp: "0:25:28",
      title: "みんなへのエール",
      body: "仕事を頑張っている人への言葉とともに、自分もみんなを応援していると伝えました。配信に来てくれた人たちへエールを送りました。",
    },
    {
      timestamp: "0:25:55",
      title: "ラジオの楽しさを紹介",
      body: "大学生メンバーで作るラジオ番組を紹介。番組の雰囲気やネットでの聴き方にも触れ、ラジオの活動について話しました。",
    },
    {
      timestamp: "0:31:13",
      title: "髪型の相談",
      body: "髪の長さやストレート、内巻きなどを話題に、どんな髪型がよいか相談しました。髪をまとめてお団子の形を試す場面もありました。",
    },
    {
      timestamp: "0:50:40",
      title: "お気に入りの香りの話",
      body: "好きな香りのシリーズを紹介し、ボディクリームやハンドクリーム、ミストを手に取りました。香りを楽しむ話で会話が続きました。",
    },
    {
      timestamp: "1:00:03",
      title: "ゆったり話せる時間",
      body: "夜らしいゆったりしたおしゃべりを振り返り、みんなとこの時間を過ごせることへの喜びを伝えました。",
    },
    {
      timestamp: "1:03:52",
      title: "応援への感謝と次へ",
      body: "終盤にはランキングを読み上げ、応援に感謝。セミファイナルに向け、みんなと楽しく配信していきたいという思いを伝えました。",
      relatedLinks: [
        { label: "MILY SIGNAL・10月16日夜の匿名分析", url: "/data-lab/#night-20261016" },
      ],
    },
  ],
  goals: [],
  ranking: [buildRankingNote(undefined, undefined, "during")],
  timeline: [
    { timestamp: "0:00:20", label: "夜の挨拶" },
    { timestamp: "0:25:28", label: "みんなへのエール" },
    { timestamp: "0:25:55", label: "ラジオ番組と聴き方の紹介" },
    { timestamp: "0:31:13", label: "髪の長さとヘアスタイルの相談" },
    { timestamp: "0:36:01", label: "髪をまとめてお団子の形へ" },
    { timestamp: "0:50:40", label: "好きな香りのシリーズ" },
    { timestamp: "1:00:03", label: "ゆったり話す時間への感謝" },
    { timestamp: "1:01:24", label: "翌日の配信への言及" },
    { timestamp: "1:03:52", label: "ランキング読み上げ" },
    { timestamp: "1:06:00", label: "セミファイナルに向けて" },
    { timestamp: "1:06:53", label: "おやすみの挨拶" },
  ],
  nextNote:
    "配信時点では、翌10月17日の朝と夜の配信に触れていました。詳しい時刻は自動文字起こしだけでは確定できないため、現在の確定予定としては掲載しません。",
  sourceLabel:
    "2026年10月16日 夜のSHOWROOM配信（保存録画の実フレーム・速報自動文字起こし）",
  verifiedAt: "2026-10-17",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画の実フレーム8枚です。",
    extra:
      "録画処理は21:49:18〜22:57:33頃、保存メディアは約67分21秒で、配信の確定開始・終了時刻や全配信時間ではありません。完全収録は未確定です。自動文字起こし203処理チャンクを参照し、見どころと索引の時刻は録画先頭からの目安で、実映像との厳密な同期は未確認です。写真の時刻も録画先頭からの経過時間です。歌唱曲は特定できていないため、曲目は掲載していません。配信終了時の最終値は未確定です。数値と観測時点はリンク先のMILY SIGNALにまとめ、10月12日までの四次審査集計には加えていません。",
  }),
};
