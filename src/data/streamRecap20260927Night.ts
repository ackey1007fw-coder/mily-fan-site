import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, RANKING_NOTE_WITHOUT_RANGE, buildTranscriptionNote } from "./streamRecapRules.ts";

const nightGallery = [
    {
      "src": "/media/live/mily-b170-01-20260927-night-000610.jpg",
      "width": 640,
      "height": 360,
      "alt": "夜のおしゃべりでカメラを見るみりぃ",
      "caption": "0:06:10｜夜のおしゃべりでカメラを見るみりぃ",
      "downloadName": "mily-b170-01-20260927-night-000610.jpg"
    },
    {
      "src": "/media/live/mily-b170-02-20260927-night-000844.jpg",
      "width": 640,
      "height": 360,
      "alt": "カメラに近づいて笑うみりぃ",
      "caption": "0:08:44｜カメラに近づいて笑うみりぃ",
      "downloadName": "mily-b170-02-20260927-night-000844.jpg"
    },
    {
      "src": "/media/live/mily-b170-03-20260927-night-002210.jpg",
      "width": 640,
      "height": 360,
      "alt": "立ち上がって両腕を動かすみりぃ",
      "caption": "0:22:10｜立ち上がって両腕を動かすみりぃ",
      "downloadName": "mily-b170-03-20260927-night-002210.jpg"
    },
    {
      "src": "/media/live/mily-b170-04-20260927-night-002337.jpg",
      "width": 640,
      "height": 360,
      "alt": "カメラへ顔を向けるみりぃ",
      "caption": "0:23:37｜カメラへ顔を向けるみりぃ",
      "downloadName": "mily-b170-04-20260927-night-002337.jpg"
    },
    {
      "src": "/media/live/mily-b170-05-20260927-night-005208.jpg",
      "width": 640,
      "height": 360,
      "alt": "水玉のシュシュに手を添えるみりぃ",
      "caption": "0:52:08｜水玉のシュシュに手を添えるみりぃ",
      "downloadName": "mily-b170-05-20260927-night-005208.jpg"
    },
    {
      "src": "/media/live/mily-b170-06-20260927-night-005310.jpg",
      "width": 640,
      "height": 360,
      "alt": "サイドポニー姿で笑うみりぃ",
      "caption": "0:53:10｜サイドポニー姿で笑うみりぃ",
      "downloadName": "mily-b170-06-20260927-night-005310.jpg"
    },
    {
      "src": "/media/live/mily-b170-07-20260927-night-005520.jpg",
      "width": 640,
      "height": 360,
      "alt": "両手でピースしてウインクするみりぃ",
      "caption": "0:55:20｜両手でピースしてウインクするみりぃ",
      "downloadName": "mily-b170-07-20260927-night-005520.jpg"
    },
    {
      "src": "/media/live/mily-b170-08-20260927-night-011555.jpg",
      "width": 640,
      "height": 360,
      "alt": "水玉のシュシュを見せて笑うみりぃ",
      "caption": "1:15:55｜水玉のシュシュを見せて笑うみりぃ",
      "downloadName": "mily-b170-08-20260927-night-011555.jpg"
    },
    {
      "src": "/media/live/mily-b170-09-20260927-night-012339.jpg",
      "width": 640,
      "height": 360,
      "alt": "終盤のおしゃべりをするみりぃ",
      "caption": "1:23:39｜終盤のおしゃべりをするみりぃ",
      "downloadName": "mily-b170-09-20260927-night-012339.jpg"
    },
    {
      "src": "/media/live/mily-b170-10-20260927-night-013149.jpg",
      "width": 640,
      "height": 360,
      "alt": "手を合わせて感謝を伝えるみりぃ",
      "caption": "1:31:49｜手を合わせて感謝を伝えるみりぃ",
      "downloadName": "mily-b170-10-20260927-night-013149.jpg"
    }
  ];

export const streamRecap20260927Night: StreamRecap = {
  "id": "2026-09-27-night-showroom",
  "date": "2026-09-27",
  "dateLabel": "2026.09.27（日）",
  "theme": "夜のシュシュと一日のお礼",
  "broadcastLabel": "22:30頃〜 約93分",
  "platformLabel": "SHOWROOM",
  "summary": "ラジオを振り返るおしゃべりから、イカやタコの動き、サイドポニーのスクショタイムへ。水玉のシュシュを見せながら表情を変え、ファイナルへの思いも話しました。朝から夜まで一緒に過ごしたみんなへの感謝で締めくくった回です。",
  image: nightGallery[6],
  gallery: nightGallery,
  "galleryZip": {
    "src": "/media/live/mily-b170-11-20260927-night-stills.zip",
    "filename": "mily-b170-11-20260927-night-stills.zip",
    "label": "夜配信のスクショ10枚をまとめて保存"
  },
  "highlights": [
    {
      "timestamp": "0:13:18",
      "title": "ラジオを振り返る夜",
      "body": "この日のラジオを振り返りながらおしゃべり。配信中にも番組の話題が登場し、朝から続く一日をみんなと振り返りました。"
    },
    {
      "timestamp": "0:22:00",
      "title": "イカとタコの動きで遊ぶ",
      "body": "イカやタコの話題から、腕を使った動きへ。立ち上がって身ぶりを見せる場面もあり、カメラの前で表情豊かに遊んでいました。"
    },
    {
      "timestamp": "0:50:50",
      "title": "水玉シュシュのサイドポニー",
      "body": "髪を横にまとめ、水玉のシュシュを見せながらおしゃべり。髪に手を添えたりカメラへ近づいたりして、いろいろな表情を見せました。"
    },
    {
      "timestamp": "0:55:18",
      "title": "ダブルピースでスクショタイム",
      "body": "シュシュを見せた後は、両手でピース。ウインクや笑顔を向ける、短いスクショタイムです。",
      "socialClip": {
        "title": "ダブルピース、からのウインク。",
        "sourceTimestamp": "0:55:18",
        "durationSeconds": 10,
        "links": [
          { "platform": "x", "url": "https://x.com/ackey_RiRi_supp/status/2104521135261897014" },
          { "platform": "instagram", "url": "https://www.instagram.com/reel/Dd0_RyYiW9-/" },
          { "platform": "tiktok", "url": "https://www.tiktok.com/@ackeytan_/video/7690533760294554900" },
          { "platform": "youtube", "url": "https://www.youtube.com/watch?v=5JK8DupppFg" }
        ]
      },
      "clip": {
        "src": "/media/live-clips/mily-b170-12-20260927-night-peace-005518.mp4",
        "poster": "/media/live/mily-b170-07-20260927-night-005520.jpg",
        "width": 640,
        "height": 360,
        "durationSeconds": 10,
        "sourceTimestamp": "0:55:18"
      }
    },
    {
      "timestamp": "0:59:58",
      "title": "みんなとファイナルへ",
      "body": "ファイナルを目指す気持ちを言葉にし、これからも一緒に進んでほしいと呼びかけました。集まってくれる人への感謝が続く場面です。"
    },
    {
      "timestamp": "1:23:37",
      "title": "外郎売の口上に挑戦",
      "body": "滑舌練習で知られる外郎売の口上を披露。その後は練習についても話し、声で伝える活動につながるひと幕になりました。"
    },
    {
      "timestamp": "1:31:45",
      "title": "朝も夜も一緒にありがとう",
      "body": "一日の始まりと終わりを配信でみんなと過ごせたことへ感謝。夜も楽しい時間になったと伝え、次の配信での再会を案内しました。",
      "clip": {
        "src": "/media/live-clips/mily-b170-13-20260927-night-thanks-013145.mp4",
        "poster": "/media/live/mily-b170-10-20260927-night-013149.jpg",
        "width": 640,
        "height": 360,
        "durationSeconds": 10.8,
        "sourceTimestamp": "1:31:45"
      }
    }
  ],
  "goals": [],
  "ranking": [
    RANKING_NOTE_WITHOUT_RANGE
  ],
  "timeline": [
    {
      "timestamp": "0:02:28",
      "label": "イベントでの応援へのお礼"
    },
    {
      "timestamp": "0:13:18",
      "label": "この日のラジオを振り返る"
    },
    {
      "timestamp": "0:22:00",
      "label": "イカとタコの動きで遊ぶ"
    },
    {
      "timestamp": "0:50:50",
      "label": "サイドポニーと水玉のシュシュ"
    },
    {
      "timestamp": "0:55:18",
      "label": "両手ピースとウインク"
    },
    {
      "timestamp": "0:59:58",
      "label": "ファイナルを目指す思い"
    },
    {
      "timestamp": "1:03:29",
      "label": "お礼配信の案内"
    },
    {
      "timestamp": "1:15:55",
      "label": "水玉のシュシュを見せる"
    },
    {
      "timestamp": "1:23:37",
      "label": "外郎売の口上"
    },
    {
      "timestamp": "1:28:12",
      "label": "ランキングの読み上げとお礼"
    },
    {
      "timestamp": "1:31:45",
      "label": "一日を一緒に過ごした感謝"
    }
  ],
  "nextNote": "配信時点では、翌9月28日も朝の配信と、夜のお礼配信を行うと案内していました。",
  "sourceLabel": "2026年9月27日 SHOWROOM夜配信（保存録画・自動文字起こし確認）",
  "verifiedAt": "2026-09-28",
  "transcriptionNote": buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    publishedClips: true,
    stills: "静止画は同じ録画の実フレーム10枚です。掲載画像を個別に目視確認し、録画内時刻を付記しています。",
    extra: "録画開始記録22:30:29、メディア実測5550.483秒。完了済み47区間の自動文字起こし全体を確認しました。短尺2本は同じ録画の原音付き抜粋で、1秒間隔の実フレームと音声トラックを検査しています。全編の手動聴取・逐語校正・連続視聴は未実施です。録画開始以前と連続性は未確認で、時刻は録画先頭からの目安です。今回の確認範囲で歌唱曲は確定していません。",
  })
};
