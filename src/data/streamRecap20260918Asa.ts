import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const stills: StreamRecapImage[] = [
  {
    "src": "/media/live/mily-b130-01-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "手のひらを広げた笑顔のみりぃ",
    "caption": "0:01:45 手のひらを広げた笑顔",
    "downloadName": "みりぃ_20260918朝_01.jpg"
  },
  {
    "src": "/media/live/mily-b130-02-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "両手を振る笑顔のみりぃ",
    "caption": "0:07:45 両手を振る笑顔",
    "downloadName": "みりぃ_20260918朝_02.jpg"
  },
  {
    "src": "/media/live/mily-b130-03-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "顔の前で手を合わせる場面のみりぃ",
    "caption": "0:10:46 顔の前で手を合わせる場面",
    "downloadName": "みりぃ_20260918朝_03.jpg"
  },
  {
    "src": "/media/live/mily-b130-04-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "髪に手を添えた笑顔のみりぃ",
    "caption": "0:21:15 髪に手を添えた笑顔",
    "downloadName": "みりぃ_20260918朝_04.jpg"
  },
  {
    "src": "/media/live/mily-b130-05-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラに近づいた笑顔のみりぃ",
    "caption": "0:31:44 カメラに近づいた笑顔",
    "downloadName": "みりぃ_20260918朝_05.jpg"
  },
  {
    "src": "/media/live/mily-b130-06-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "ペンとボードを手にした場面のみりぃ",
    "caption": "0:43:42 ペンとボードを手にした場面",
    "downloadName": "みりぃ_20260918朝_06.jpg"
  },
  {
    "src": "/media/live/mily-b130-07-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "あごに手を添えた表情のみりぃ",
    "caption": "0:52:45 あごに手を添えた表情",
    "downloadName": "みりぃ_20260918朝_07.jpg"
  },
  {
    "src": "/media/live/mily-b130-08-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "手書きボードを見せる笑顔のみりぃ",
    "caption": "1:18:15 手書きボードを見せる笑顔",
    "downloadName": "みりぃ_20260918朝_08.jpg"
  },
  {
    "src": "/media/live/mily-b130-09-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "ボードに顔を寄せた笑顔のみりぃ",
    "caption": "1:22:43 ボードに顔を寄せた笑顔",
    "downloadName": "みりぃ_20260918朝_09.jpg"
  },
  {
    "src": "/media/live/mily-b130-10-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "胸元で手を組む笑顔のみりぃ",
    "caption": "1:30:15 胸元で手を組む笑顔",
    "downloadName": "みりぃ_20260918朝_10.jpg"
  },
  {
    "src": "/media/live/mily-b130-11-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "片手を振る笑顔のみりぃ",
    "caption": "1:43:45 片手を振る笑顔",
    "downloadName": "みりぃ_20260918朝_11.jpg"
  },
  {
    "src": "/media/live/mily-b130-12-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "終盤の笑顔のみりぃ",
    "caption": "1:46:45 終盤の笑顔",
    "downloadName": "みりぃ_20260918朝_12.jpg"
  }
];

export const streamRecap20260918Asa: StreamRecap = {
  id: "2026-09-18-asa-showroom",
  date: "2026-09-18",
  dateLabel: "2026.09.18（金）",
  theme: "朝5時の出会いと応援歌",
  broadcastLabel: "5:01頃〜 約108分",
  platformLabel: "SHOWROOM",
  summary: "初めての人との出会いを求めて始めた朝5時の配信。配信49日目の思いと昼の「きっかけ配信」への挑戦を話し、「ぼよよん行進曲」で一日の始まりにエールを送りました。",
  songs: [{
    title: "ぼよよん行進曲",
    artist: "今井ゆうぞう・はいだしょうこ",
    timestamp: "1:24:08",
    karaoke: { youtubeUrl: "https://www.youtube.com/watch?v=8s8GcvwlhR8", channel: "カラオケ歌っちゃ王" },
    youtubeUrl: "https://www.youtube.com/watch?v=nAjJluQCSGE",
    youtubeVersionNote: "原曲歌手も参加する「よしお兄さんとあそぼう!」の企画動画です。原盤音源とは異なります。",
  }],
  image: stills[3],
  gallery: stills,
  galleryZip: { src: "/media/live/mily-b130-morning-stills.zip", filename: "みりぃ_20260918朝_スクショ12枚.zip", label: "12枚まとめて保存" },
  highlights: [
    { timestamp: "0:01:38", title: "新しい出会いを求めて朝5時に", body: "初めての人に会いたいと思い、早朝の配信に挑戦しました。いつもの人も集まってくれたことを喜び、初訪問や再訪問の人へ繰り返しあいさつしました。" },
    { timestamp: "0:12:03", title: "初めてのアバターを楽しみに", body: "初めて獲得したアバター権に触れ、デザインを再提出したと説明しました。配布後にみんなでアバター撮影会をしたいと話し、完成を楽しみにしていました。" },
    { timestamp: "0:27:48", title: "昼のきっかけ配信への挑戦", body: "昼は初めての「きっかけ配信」を予定していると案内しました。自分の力を試したいので、まずは自分で進めてみたいと話しました。" },
    { timestamp: "0:37:08", title: "配信49日目の成長への思い", body: "配信を始めて49日目だと紹介しました。これからの成長を見続けてほしい、応援していてよかったと思ってもらえるよう頑張りたいと伝えました。" },
    { timestamp: "0:48:11", title: "みりぃという名前の由来", body: "名字と名前の頭を取って「みりぃ」と名乗っていると説明しました。ラジオでも使っている名前だと紹介し、初めての人に覚えてもらおうと呼びかけました。", socialClip: {
    "title": "「みりぃ」ってどういう意味？",
    "sourceTimestamp": "0:48:11",
    "durationSeconds": 23.7,
    "links": [
        {
            "platform": "youtube",
            "url": "https://www.youtube.com/watch?v=0JR37d8ZNdU"
        },
        {
            "platform": "tiktok",
            "url": "https://www.tiktok.com/@ackeytan_/video/7687035295061069063"
        },
        {
            "platform": "instagram",
            "url": "https://www.instagram.com/reel/Ddctql9icAb/"
        },
        {
            "platform": "x",
            "url": "https://x.com/ackey_RiRi_supp/status/2101105579330769213"
        }
    ]
} },
    { timestamp: "1:13:39", title: "手書きボードで自己紹介", body: "名前とコンテストの案内を書いたボードをカメラに見せました。四次審査に向けて、これからも配信へ来てほしいと呼びかけました。" },
    { timestamp: "1:24:08", title: "朝に届けるぼよよん行進曲", body: "朝がつらい人を元気づけたいと話し、「ぼよよん行進曲」を歌いました。歌い終えると、みんなの一日が素敵な日になるようにとエールを送りました。" },
    { timestamp: "1:27:36", title: "大人にも響く好きな歌", body: "歌った曲を改めて紹介し、子ども向けの歌として知られていても、大人にも響くところが好きだと話しました。夜にも歌を届けたいと予告しました。" },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1)],
  timeline: [
    { timestamp: "0:00:20", label: "早朝に集まったみんなへあいさつ" },
    { timestamp: "0:01:38", label: "朝5時に配信した理由" },
    { timestamp: "0:12:03", label: "初めてのアバターと撮影会の話" },
    { timestamp: "0:13:11", label: "アバターデザイン再提出の報告" },
    { timestamp: "0:27:48", label: "昼のきっかけ配信への挑戦" },
    { timestamp: "0:37:08", label: "配信49日目とこれからの成長" },
    { timestamp: "0:48:11", label: "みりぃという名前の由来" },
    { timestamp: "1:13:39", label: "手書きボードで自己紹介" },
    { timestamp: "1:23:43", label: "朝を元気づける歌への思い" },
    { timestamp: "1:24:08", label: "ぼよよん行進曲の歌唱" },
    { timestamp: "1:27:36", label: "大人にも響く歌の魅力" },
    { timestamp: "1:44:08", label: "13位から1位までランキング読み上げ" },
    { timestamp: "1:45:41", label: "昼のきっかけ配信と通常配信の案内" },
    { timestamp: "1:46:14", label: "夜も配信すると予告" },
    { timestamp: "1:47:18", label: "今日も一日頑張ろうと締めくくり" },
  ],
  nextNote: "配信時点では、同日13:40から初めてのきっかけ配信、14:40から通常配信を案内。夜も配信する予定で、時刻は後ほど知らせると話していました。",
  sourceLabel: "2026年9月18日 SHOWROOM朝配信（オーナー提供録画・自動文字起こし確認）",
  verifiedAt: "2026-09-18",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム12枚を掲載しています。",
    extra: "録画開始記録5:01:12、実測6467.158秒から表示を5:01頃・約108分に丸めています。保存録画範囲全体を54チャンク・2401区間の自動文字起こしで確認しました。配信全編の完全収録は保証しません。タイムスタンプは録画先頭からの目安です。歌詞全文や歌唱動画は掲載していません。",
  }),
};
