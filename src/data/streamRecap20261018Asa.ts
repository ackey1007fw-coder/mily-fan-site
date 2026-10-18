import type { StreamRecap } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

// 2026/10/18朝の保存録画に対応する速報ASR（339処理チャンク）を参照。
// 全編の原音手動聴取、映像との全区間同期、曲名の同定は未実施。
// UIの約束どおり、欠測・無効表示は最終値や0として扱わない。
// 当該記事への実写真掲載をサイトオーナーが明示承認。個人別コメント・表示名・全文ASRは公開しない。
// 同じ回の保存録画に由来する実写真。背景付箋の細字のみぼかし、人物の顔や身体の生成・補正なし。
const morningGallery = [
  {
    src: "/media/live/mily-b229-05-morning-overhead-heart-early-01425s.jpg",
    width: 640,
    height: 360,
    alt: "両手を頭上に掲げてポーズを取る朝のみりぃ",
    caption: "0:23:45｜頭の上で大きくポーズ",
    downloadName: "mily-b229-05-morning-overhead-heart-early-01425s.jpg",
  },
  {
    src: "/media/live/mily-b229-06-morning-bright-smile-02148s.jpg",
    width: 640,
    height: 360,
    alt: "肩をすぼめてにっこり笑うみりぃ",
    caption: "0:35:48｜うれしそうな笑顔",
    downloadName: "mily-b229-06-morning-bright-smile-02148s.jpg",
  },
  {
    src: "/media/live/mily-b229-07-morning-hair-up-pose-02184s.jpg",
    width: 640,
    height: 360,
    alt: "手を頭の上に添えながら笑うみりぃ",
    caption: "0:36:24｜髪をまとめながらにっこり",
    downloadName: "mily-b229-07-morning-hair-up-pose-02184s.jpg",
  },
  {
    src: "/media/live/mily-b229-08-morning-close-up-smile-02504s.jpg",
    width: 640,
    height: 360,
    alt: "カメラに近づきやさしく微笑むみりぃ",
    caption: "0:41:44｜近くでにっこり",
    downloadName: "mily-b229-08-morning-close-up-smile-02504s.jpg",
  },
  {
    src: "/media/live/mily-b229-09-morning-small-hand-heart-02762s.jpg",
    width: 640,
    height: 360,
    alt: "手指で小さなハートを作ろうとするみりぃ",
    caption: "0:46:02｜指先のハートポーズ",
    downloadName: "mily-b229-09-morning-small-hand-heart-02762s.jpg",
  },
  {
    src: "/media/live/mily-b229-10-morning-overhead-heart-02882s.jpg",
    width: 640,
    height: 360,
    alt: "両手で頭上にハートを作るみりぃ",
    caption: "0:48:02｜頭上に大きなハート",
    downloadName: "mily-b229-10-morning-overhead-heart-02882s.jpg",
  },
  {
    src: "/media/live/mily-b229-11-morning-large-hand-heart-02942s.jpg",
    width: 640,
    height: 360,
    alt: "手指で大きなハートを作り笑顔を見せるみりぃ",
    caption: "0:49:02｜両手でハートと笑顔",
    downloadName: "mily-b229-11-morning-large-hand-heart-02942s.jpg",
  },
  {
    src: "/media/live/mily-b229-12-morning-happy-hands-03140s.jpg",
    width: 640,
    height: 360,
    alt: "頬のそばに手を添えて微笑むみりぃ",
    caption: "0:52:20｜手を頬に添えて",
    downloadName: "mily-b229-12-morning-happy-hands-03140s.jpg",
  },
];

export const streamRecap20261018Asa: StreamRecap = {
  id: "2026-10-18-morning-showroom",
  date: "2026-10-18",
  dateLabel: "2026.10.18（日）",
  theme: "朝の歌と次の挑戦",
  broadcastLabel: "録画開始5:03頃〜 約113分",
  platformLabel: "SHOWROOM",
  summary:
    "セミファイナルへの思いを話し、朝の挨拶や歌を交えながらコメントと交流。ラジオの話題や新しい出会いにも触れ、終盤はたくさんの応援への感謝を伝えました。",
  image: morningGallery[6],
  gallery: morningGallery,
  highlights: [
    {
      timestamp: "0:00:49",
      title: "おはようから始まる朝",
      body: "早朝の挨拶からスタート。初めて見つけてくれた人にも自己紹介し、朝の配信へ迎えました。",
    },
    {
      timestamp: "0:03:46",
      title: "セミファイナルへ向けて",
      body: "次のステージにも触れ、ここからも頑張りたいという思いを話しました。一緒に進んでいきたい気持ちが伝わる場面でした。",
    },
    {
      timestamp: "0:05:30",
      title: "歌を交えた朝の時間",
      body: "早朝という時間帯に合わせて声の出し方にも触れながら、歌を挟んでおしゃべり。曲名は今回確定できていません。",
    },
    {
      timestamp: "0:11:44",
      title: "ペンライトと応援への感謝",
      body: "ペンライトやきら星の話題に触れながら、届いた応援に何度もありがとうを伝えました。",
    },
    {
      timestamp: "0:26:00",
      title: "見つけてくれた人へ",
      body: "新しく訪れた人に名前を覚えてもらおうと、自己紹介を交えながら感謝を伝えました。",
    },
    {
      timestamp: "0:53:40",
      title: "好きなことは幅広く",
      body: "いろいろなことが好きだと話し、ひとつに絞らない自分らしい楽しみ方にも触れました。",
    },
    {
      timestamp: "1:13:50",
      title: "ラジオを聴く楽しさ",
      body: "ラジオや番組の聴き方の話題へ。インターネットを使って離れた場所からも聴けることを紹介しました。",
    },
    {
      timestamp: "1:49:00",
      title: "朝の応援へありがとう",
      body: "終盤は新しくフォローしてくれた人や、コメント・きら星を届けてくれた人たちに感謝を伝え、朝の時間を締めくくりました。",
      relatedLinks: [
        {
          label: "MILY SIGNAL・10月18日朝の匿名分析と欠測",
          url: "/data-lab/reports/20261018-morning/",
        },
      ],
    },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:00:49", label: "早朝の挨拶と自己紹介" },
    { timestamp: "0:03:46", label: "セミファイナルに向けた言葉" },
    { timestamp: "0:05:30", label: "歌を交えたおしゃべり" },
    { timestamp: "0:11:44", label: "ペンライトと応援のお礼" },
    { timestamp: "0:20:33", label: "朝のコメントとのやり取り" },
    { timestamp: "0:26:00", label: "初めての人への自己紹介" },
    { timestamp: "0:34:20", label: "新しく見つけてくれた人へ" },
    { timestamp: "0:52:42", label: "いろいろな好きなこと" },
    { timestamp: "1:13:50", label: "ラジオにまつわる会話" },
    { timestamp: "1:16:07", label: "ウェブでの聴き方の紹介" },
    { timestamp: "1:27:41", label: "次の挑戦への言及" },
    { timestamp: "1:36:32", label: "歌を交える時間" },
    { timestamp: "1:49:00", label: "きら星やフォローへの感謝" },
    { timestamp: "1:53:00", label: "朝の締めくくり" },
  ],
  nextNote: "",
  sourceLabel:
    "2026年10月18日 朝のSHOWROOM配信（保存録画の実フレーム・速報自動文字起こし）",
  verifiedAt: "2026-10-18",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当該回の保存録画から抽出した実フレーム8枚です。",
    extra:
      "保存録画の処理開始は5:03頃、保存メディア尺は約113分06秒です。正式な放送開始・終了時刻と全区間の連続性は未確定です。速報自動文字起こし339処理チャンクを参照し、全編の手動聴取・逐語校正や歌唱曲の確定は行っていません。見どころと時刻は録画先頭からの目安です。きら星9,887・総訪問表示1,603・コメント961は最後に保存したオンライン画面参考値で、配信終了時の確定値・ユニーク視聴者数・イベントポイントではありません。05:54の総訪問無効表示や観測ギャップを0補完せず、データラボで取得品質を明記しています。10月12日までの四次審査累計には加算していません。",
  }),
};
