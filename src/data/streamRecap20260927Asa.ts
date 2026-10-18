import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const morningGallery = [
  {
    "src": "/media/live/mily-b169-01-20260927-asa-000220.jpg",
    "width": 640,
    "height": 360,
    "alt": "タコ踊りで両手を動かすみりぃ",
    "caption": "0:02:20｜タコ踊りで両手を動かすみりぃ",
    "downloadName": "mily-b169-01-20260927-asa-000220.jpg"
  },
  {
    "src": "/media/live/mily-b169-02-20260927-asa-000900.jpg",
    "width": 640,
    "height": 360,
    "alt": "朝のおしゃべりで笑顔を見せるみりぃ",
    "caption": "0:09:00｜朝のおしゃべりで笑顔を見せるみりぃ",
    "downloadName": "mily-b169-02-20260927-asa-000900.jpg"
  },
  {
    "src": "/media/live/mily-b169-03-20260927-asa-001700.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラに笑顔を向けるみりぃ",
    "caption": "0:17:00｜カメラに笑顔を向けるみりぃ",
    "downloadName": "mily-b169-03-20260927-asa-001700.jpg"
  },
  {
    "src": "/media/live/mily-b169-04-20260927-asa-001900.jpg",
    "width": 640,
    "height": 360,
    "alt": "髪に手を添えて笑うみりぃ",
    "caption": "0:19:00｜髪に手を添えて笑うみりぃ",
    "downloadName": "mily-b169-04-20260927-asa-001900.jpg"
  },
  {
    "src": "/media/live/mily-b169-05-20260927-asa-003500.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラへ身を寄せて笑うみりぃ",
    "caption": "0:35:00｜カメラへ身を寄せて笑うみりぃ",
    "downloadName": "mily-b169-05-20260927-asa-003500.jpg"
  },
  {
    "src": "/media/live/mily-b169-06-20260927-asa-005100.jpg",
    "width": 640,
    "height": 360,
    "alt": "顔の前で手を合わせるみりぃ",
    "caption": "0:51:00｜顔の前で手を合わせるみりぃ",
    "downloadName": "mily-b169-06-20260927-asa-005100.jpg"
  },
  {
    "src": "/media/live/mily-b169-07-20260927-asa-005900.jpg",
    "width": 640,
    "height": 360,
    "alt": "終盤のおしゃべりで笑うみりぃ",
    "caption": "0:59:00｜終盤のおしゃべりで笑うみりぃ",
    "downloadName": "mily-b169-07-20260927-asa-005900.jpg"
  },
  {
    "src": "/media/live/mily-b169-08-20260927-asa-010100.jpg",
    "width": 640,
    "height": 360,
    "alt": "上を見ながらピースするみりぃ",
    "caption": "1:01:00｜上を見ながらピースするみりぃ",
    "downloadName": "mily-b169-08-20260927-asa-010100.jpg"
  },
  {
    "src": "/media/live/mily-b169-09-20260927-asa-010300.jpg",
    "width": 640,
    "height": 360,
    "alt": "両手でピースするみりぃ",
    "caption": "1:03:00｜両手でピースするみりぃ",
    "downloadName": "mily-b169-09-20260927-asa-010300.jpg"
  },
  {
    "src": "/media/live/mily-b169-10-20260927-asa-010500.jpg",
    "width": 640,
    "height": 360,
    "alt": "両手を振ってあいさつするみりぃ",
    "caption": "1:05:00｜両手を振ってあいさつするみりぃ",
    "downloadName": "mily-b169-10-20260927-asa-010500.jpg"
  }
];

export const streamRecap20260927Asa: StreamRecap = {
  id: "2026-09-27-asa-showroom",
  date: "2026-09-27",
  dateLabel: "2026.09.27（日）",
  theme: "朝のメイクとラジオ前トーク",
  broadcastLabel: "5:34頃〜 約66分",
  platformLabel: "SHOWROOM",
  summary: "ラジオへ向かう前のメイク配信。コメントに返しているうちに準備がなかなか進まず、コスメや食べ物の話まで広がりました。四次審査への応援を呼びかけ、朝から集まったみんなへ感謝を伝えた回です。",
  image: morningGallery[8],
  gallery: morningGallery,
  galleryZip: {"src": "/media/live/mily-b169-11-20260927-asa-stills.zip", "filename": "mily-b169-11-20260927-asa-stills.zip", "label": "朝配信のスクショ10枚をまとめて保存"},
  highlights: [
    {"timestamp": "0:02:15", "title": "両手くねくねのタコ踊り", "body": "両手を交互にくねくね動かすタコ踊りを披露。最後はカメラに笑顔を向ける、朝のひと幕です。", "clip": {"src": "/media/live-clips/mily-b169-12-20260927-asa-taco-000215.mp4", "poster": "/media/live/mily-b169-01-20260927-asa-000220.jpg", "width": 640, "height": 360, "durationSeconds": 7.6, "sourceTimestamp": "0:02:15"}, "socialClip": {"title": "タコ踊りの7秒", "sourceTimestamp": "0:02:15", "durationSeconds": 7.6, "links": [{"platform": "x", "url": "https://x.com/ackey_RiRi_supp/status/2104136102365823130"}, {"platform": "instagram", "url": "https://www.instagram.com/reel/DdyRJObDpQZ/"}, {"platform": "tiktok", "url": "https://www.tiktok.com/t/7690141584322579733"}, {"platform": "youtube", "url": "https://www.youtube.com/watch?v=ant30v2jT_A"}]}},
    { timestamp: "0:02:36", title: "ラジオへ向かう朝", body: "早朝に集まったみんなへあいさつ。この日は「湘南シーサイドサークル」の生放送に向かうと話し、準備をしながらおしゃべりを始めました。" },
    { timestamp: "0:08:37", title: "メイクの過程を一緒に", body: "初めて来た人にも声をかけ、メイクができあがるまでを見届けてほしいとお誘い。番組を聴く方法や、ファンサイトの聴取リンクも案内しました。" },
    { timestamp: "0:25:17", title: "集中したいのにコメント渋滞", body: "メイクに集中しようとしたところへ、次々とコメントが届きます。読めないと言いながらもさかのぼって返し、なかなか手が進まないやり取りになりました。" },
    { timestamp: "0:31:47", title: "コスメから食べ物の話へ", body: "コスメの名前をめぐる会話から、ハンバーガー店やオニオンリングの話へ脱線。オレオたっぷりのマックフルーリーの話題も飛び出しました。" },
    { timestamp: "0:43:05", title: "ラジオのテーマはかわいい", body: "この日の番組テーマ「かわいい」に触れ、配信で出会った人たちの話もしてみたいと話しました。朝配信から生放送へ、話題がつながるひと幕です。" },
    { timestamp: "0:51:32", title: "応援の気持ちが力に", body: "キラ星や投票など、無理のない応援も大きな力になると伝えました。終盤にも10月2日からの四次審査に触れ、みんなと一緒に進みたいと呼びかけています。" },
    { timestamp: "1:02:24", title: "また通いたくなる配信を", body: "楽しくてつい通いたくなる配信を目指したいと話しました。ランキングでお礼を伝えた後、夜の再会を案内し、ラジオへ向かうあいさつで締めくくりました。" },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1)],
  timeline: [
    { timestamp: "0:02:15", label: "両手をくねくね動かすタコ踊り" },
    { timestamp: "0:02:36", label: "生放送へ向かう日の早朝配信" },
    { timestamp: "0:06:43", label: "10月2日からの投票の呼びかけ" },
    { timestamp: "0:08:37", label: "メイクの過程を見届けてほしいお誘い" },
    { timestamp: "0:09:09", label: "番組の聴き方とファンサイトの案内" },
    { timestamp: "0:22:42", label: "リコピンとファンネームの話" },
    { timestamp: "0:25:17", label: "集中タイムと止まらないコメント" },
    { timestamp: "0:31:47", label: "コスメの名前から食べ物の話へ" },
    { timestamp: "0:34:44", label: "オレオたっぷりのマックフルーリー" },
    { timestamp: "0:43:05", label: "ラジオのテーマ「かわいい」" },
    { timestamp: "0:51:32", label: "応援が力になるという思い" },
    { timestamp: "1:00:26", label: "朝配信の話をラジオでも" },
    { timestamp: "1:00:58", label: "四次審査を一緒に進みたい呼びかけ" },
    { timestamp: "1:02:24", label: "楽しくて通いたくなる配信への思い" },
    { timestamp: "1:02:48", label: "ランキングと朝の応援への感謝" },
    { timestamp: "1:04:30", label: "夜の配信案内とラジオへの出発" },
  ],
  nextNote: "配信時点では、同日9月27日の夜22:30から配信すると案内していました。",
  sourceLabel: "2026年9月27日 SHOWROOM朝配信（保存録画・自動文字起こし確認）",
  verifiedAt: "2026-09-27",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は同じ録画の実フレーム10枚です。掲載画像を個別に目視確認し、録画内時刻を付記しています。",
    extra: "録画開始記録05:34:17、メディア実測3936.081秒。録画音声全体の自動文字起こしを確認しました。タコ踊りの短い抜粋を元の音声・画角で掲載しています。抜粋区間の1秒間隔のフレームと全体の間隔抽出画像を確認しました。全編の手動聴取・逐語校正・連続視聴は未実施です。録画開始以前と連続性は未確認で、時刻は録画先頭からの目安です。今回の確認範囲で歌唱曲は確定していません。",
  }),
};
