import type { StreamRecap } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildRankingNote,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

// room573253 / live23564059。保存録画のフレームと同じ配信の速報ASR 654チャンクを照合。
// 映像は各静止画位置を確認。全編手動聴取・逐語校正は未実施。通常UIカウンターの欠測を録画欠測と混同しない。
// 個人の表示名や原音、全文ASRは公開しない。写真は実配信からの派生で、顔・身体に加工なし。
const longMorningGallery = [
  {
    src: "/media/live/mily-b230-01-20261017-long-003640-close-smile.jpg",
    width: 640,
    height: 360,
    alt: "カメラに近づいて笑顔を見せるみりぃ",
    caption: "0:36:40｜にっこり、朝の笑顔",
    downloadName: "mily-b230-01-20261017-long-003640-close-smile.jpg",
  },
  {
    src: "/media/live/mily-b230-02-20261017-long-013000-friendly-talk.jpg",
    width: 640,
    height: 360,
    alt: "髪に手を添えて話すみりぃ",
    caption: "1:30:00｜おしゃべりが続く時間",
    downloadName: "mily-b230-02-20261017-long-013000-friendly-talk.jpg",
  },
  {
    src: "/media/live/mily-b230-03-20261017-long-014410-bright-smile.jpg",
    width: 640,
    height: 360,
    alt: "場所を変えて笑顔を見せるみりぃ",
    caption: "1:44:10｜場所を変えて、またにっこり",
    downloadName: "mily-b230-03-20261017-long-014410-bright-smile.jpg",
  },
  {
    src: "/media/live/mily-b230-04-20261017-long-015820-relaxed-chat.jpg",
    width: 640,
    height: 360,
    alt: "座ってくつろぎながら話すみりぃ",
    caption: "1:58:20｜くつろぎながら",
    downloadName: "mily-b230-04-20261017-long-015820-relaxed-chat.jpg",
  },
  {
    src: "/media/live/mily-b230-05-20261017-long-021140-cozy-talk.jpg",
    width: 640,
    height: 360,
    alt: "リラックスした姿勢でカメラを見るみりぃ",
    caption: "2:11:40｜ゆったり続く会話",
    downloadName: "mily-b230-05-20261017-long-021140-cozy-talk.jpg",
  },
  {
    src: "/media/live/mily-b230-06-20261017-long-022640-hand-wave.jpg",
    width: 640,
    height: 360,
    alt: "手を軽く振りながら話すみりぃ",
    caption: "2:26:40｜手を振って",
    downloadName: "mily-b230-06-20261017-long-022640-hand-wave.jpg",
  },
  {
    src: "/media/live/mily-b230-07-20261017-long-024140-leaning-smile.jpg",
    width: 640,
    height: 360,
    alt: "前に身を寄せて笑顔で話すみりぃ",
    caption: "2:41:40｜笑顔の近いおしゃべり",
    downloadName: "mily-b230-07-20261017-long-024140-leaning-smile.jpg",
  },
  {
    src: "/media/live/mily-b230-08-20261017-long-025640-close-talk.jpg",
    width: 640,
    height: 360,
    alt: "カメラに近づいて話すみりぃ",
    caption: "2:56:40｜カメラに近づいて",
    downloadName: "mily-b230-08-20261017-long-025640-close-talk.jpg",
  },
  {
    src: "/media/live/mily-b230-09-20261017-long-031230-gentle-gesture.jpg",
    width: 640,
    height: 360,
    alt: "手を上げて話すみりぃ",
    caption: "3:12:30｜身振りも交えて",
    downloadName: "mily-b230-09-20261017-long-031230-gentle-gesture.jpg",
  },
  {
    src: "/media/live/mily-b230-10-20261017-long-032640-leaning-chat.jpg",
    width: 640,
    height: 360,
    alt: "顔を傾けながら話すみりぃ",
    caption: "3:26:40｜終盤のやさしい表情",
    downloadName: "mily-b230-10-20261017-long-032640-leaning-chat.jpg",
  },
  {
    src: "/media/live/mily-b230-11-20261017-long-033700-farewell.jpg",
    width: 640,
    height: 360,
    alt: "カメラの前で話しながら締めくくるみりぃ",
    caption: "3:37:00｜長い朝配信の終盤",
    downloadName: "mily-b230-11-20261017-long-033700-farewell.jpg",
  },
];

export const streamRecap20261017Asa: StreamRecap = {
  id: "2026-10-17-morning-showroom",
  date: "2026-10-17",
  dateLabel: "2026.10.17（土）",
  theme: "朝のロング配信と歌の時間",
  broadcastLabel: "録画開始6:01頃〜 約218分",
  platformLabel: "SHOWROOM",
  summary:
    "セミファイナルに向けた思いや写真・食べ物の話などを、朝からゆったりおしゃべり。時折歌も交え、最後は長い時間を一緒に過ごしてくれた人たちへ感謝を伝えました。",
  image: longMorningGallery[2],
  gallery: longMorningGallery,
  highlights: [
    {
      timestamp: "0:02:43",
      title: "セミファイナルへ向けて",
      body: "四次審査を終え、次はセミファイナル。ファイナルを目指していることを話し、新しく出会った人たちも朝の配信へ迎えました。",
    },
    {
      timestamp: "0:18:00",
      title: "思わず歌い出す朝",
      body: "朝から楽しくなって歌を交えながらのおしゃべりに。コメントでも一緒に話したいと呼びかけ、賑やかな時間になりました。",
    },
    {
      timestamp: "0:27:06",
      title: "写真と撮影の話",
      body: "大学で写真を学ぶ人に撮影をお願いする話など、写真の話題に。新しい写真を楽しみにする気持ちも話しました。",
    },
    {
      timestamp: "1:17:40",
      title: "食べ物とラジオの話",
      body: "最近のラジオでも食べ物の話で盛り上がったと振り返り、毎日の食事を楽しく味わいたいという話になりました。",
    },
    {
      timestamp: "1:44:10",
      title: "場所を変えてゆったり",
      body: "配信の途中でカメラに映る場所が変わり、くつろいだ姿勢で会話が続きました。後半も自然体のおしゃべりが続きます。",
    },
    {
      timestamp: "2:04:52",
      title: "次の挑戦への呼びかけ",
      body: "セミファイナルではさらに応援の力が必要になることを話し、この朝に見つけてくれた人たちへも感謝を伝えました。",
      relatedLinks: [
        { label: "MILY SIGNAL・10月17日朝の匿名観測と欠測", url: "/data-lab/reports/20261017-morning/" },
      ],
    },
    {
      timestamp: "2:46:11",
      title: "後半も歌の時間",
      body: "おしゃべりの合間に歌う場面があり、歌声やこれから歌ってみたい曲の話も。曲名は確実に確認できたものだけ掲載するため、今回は曲目を控えています。",
    },
    {
      timestamp: "3:29:00",
      title: "応援への感謝とまた夜に",
      body: "終盤にランキングを読み上げ、長く一緒に過ごした人たちへ感謝。次の配信にも来てほしいと伝え、一日のエールで締めくくりました。",
    },
  ],
  goals: [],
  ranking: [buildRankingNote(undefined, undefined, "during")],
  timeline: [
    { timestamp: "0:00:45", label: "朝の挨拶とみんなへのありがとう" },
    { timestamp: "0:02:43", label: "セミファイナルに向けた思い" },
    { timestamp: "0:18:00", label: "歌も飛び出す朝のおしゃべり" },
    { timestamp: "0:27:06", label: "写真撮影にまつわる話" },
    { timestamp: "0:50:20", label: "四次審査を越えて次のステージへ" },
    { timestamp: "1:17:40", label: "食べ物とラジオの話題" },
    { timestamp: "1:30:00", label: "朝の会話が続く" },
    { timestamp: "1:44:10", label: "場所を変えてリラックス" },
    { timestamp: "2:04:52", label: "セミファイナルへ向けた呼びかけ" },
    { timestamp: "2:13:40", label: "写真の仕上げ方についての話" },
    { timestamp: "2:46:11", label: "歌を交えた長い朝の時間" },
    { timestamp: "3:03:30", label: "歌声や歌の楽しさについて" },
    { timestamp: "3:29:00", label: "ランキング読み上げと感謝" },
    { timestamp: "3:37:07", label: "夜への言及と一日のエール" },
  ],
  nextNote:
    "配信時点では、10月17日夜にも配信すると案内していました。その後、本人Xで22:30枠が告知されましたが、現在の確定予定としては転記しません。",
  sourceLabel:
    "2026年10月17日 朝のSHOWROOMロング配信（保存録画の実フレーム・速報自動文字起こし）",
  verifiedAt: "2026-10-17",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は同じ朝配信の保存録画から切り出した実フレーム11枚です。",
    extra:
      "保存録画の処理時刻は6:01:17〜9:39:49頃、保存メディアは約3時間37分53秒です。録画の厳密な公式開始・終了時刻や全区間の連続収録は未確定です。速報自動文字起こし654処理チャンクを参照し、見どころと索引の時刻は録画先頭からの経過時間の目安です。全編の手動聴取と逐語校正は行っていません。歌った曲の確実な同定ができていないため曲目は掲載していません。数値は配信終了時の確定値ではなく、詳細と約123分のカウンター欠測はMILY SIGNALにまとめています。カウンターの欠測は録画の欠測と同義ではありません。10月12日までの四次審査集計には加えていません。",
  }),
};
