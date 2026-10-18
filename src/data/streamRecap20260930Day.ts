import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

const gallery: StreamRecapImage[] = [
  {
    "src": "/media/live/mily-b176-01-20260930-day-000230.jpg",
    "width": 640,
    "height": 360,
    "alt": "リボンをつけて笑うみりぃ",
    "caption": "0:02:30｜リボンをつけて笑うみりぃ",
    "downloadName": "mily-b176-01-20260930-day-000230.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b176-02-20260930-day-002630.jpg",
    "width": 640,
    "height": 360,
    "alt": "顔を近づけて微笑むみりぃ",
    "caption": "0:26:30｜顔を近づけて微笑むみりぃ",
    "downloadName": "mily-b176-02-20260930-day-002630.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b176-03-20260930-day-004630.jpg",
    "width": 640,
    "height": 360,
    "alt": "まつ毛を整えながら笑うみりぃ",
    "caption": "0:46:30｜まつ毛を整えながら笑うみりぃ",
    "downloadName": "mily-b176-03-20260930-day-004630.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b176-04-20260930-day-005030.jpg",
    "width": 640,
    "height": 360,
    "alt": "リボンに手を添えて笑うみりぃ",
    "caption": "0:50:30｜リボンに手を添えて笑うみりぃ",
    "downloadName": "mily-b176-04-20260930-day-005030.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b176-05-20260930-day-005830.jpg",
    "width": 640,
    "height": 360,
    "alt": "前髪に両手を添えるみりぃ",
    "caption": "0:58:30｜前髪に両手を添えるみりぃ",
    "downloadName": "mily-b176-05-20260930-day-005830.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b176-06-20260930-day-010054.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラを見つめるみりぃ",
    "caption": "1:00:54｜カメラを見つめるみりぃ",
    "downloadName": "mily-b176-06-20260930-day-010054.jpg",
    "galleryHour": 1
  },
  {
    "src": "/media/live/mily-b176-07-20260930-day-010154.jpg",
    "width": 640,
    "height": 360,
    "alt": "額へ両手を添えるみりぃ",
    "caption": "1:01:54｜額へ両手を添えるみりぃ",
    "downloadName": "mily-b176-07-20260930-day-010154.jpg",
    "galleryHour": 1
  },
  {
    "src": "/media/live/mily-b176-08-20260930-day-010230.jpg",
    "width": 640,
    "height": 360,
    "alt": "口元に手を添えるみりぃ",
    "caption": "1:02:30｜口元に手を添えるみりぃ",
    "downloadName": "mily-b176-08-20260930-day-010230.jpg",
    "galleryHour": 1
  },
  {
    "src": "/media/live/mily-b176-09-20260930-day-010332.jpg",
    "width": 640,
    "height": 360,
    "alt": "頬の横で指を上げるみりぃ",
    "caption": "1:03:32｜頬の横で指を上げるみりぃ",
    "downloadName": "mily-b176-09-20260930-day-010332.jpg",
    "galleryHour": 1
  },
  {
    "src": "/media/live/mily-b176-10-20260930-day-010430.jpg",
    "width": 640,
    "height": 360,
    "alt": "終盤に笑顔を見せるみりぃ",
    "caption": "1:04:30｜終盤に笑顔を見せるみりぃ",
    "downloadName": "mily-b176-10-20260930-day-010430.jpg",
    "galleryHour": 1
  }
];

export const streamRecap20260930Day: StreamRecap = {
  image: gallery[9],
  gallery,
  transcriptionNote: buildTranscriptionNote({material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は録画の実フレーム10枚です。1時間ごとに5枚、最後の約6分も5枚を掲載しています。", extra: "時刻は録画先頭からの目安です。全文の逐語校正と全編の連続視聴は行っていません。短尺は実映像と自動文字起こしを照合しています。冒頭に音声トラブルがあり、文字起こしのない区間の会話は補っていません。", publishedClips: true}),
  "id": "2026-09-30-day-showroom",
  "date": "2026-09-30",
  "dateLabel": "2026.09.30（水）",
  "theme": "昼のメイク配信",
  "broadcastLabel": "14:44頃〜 約66分",
  "platformLabel": "SHOWROOM",
  "summary": "音声トラブルを確認しながら始まった昼枠は、前日に好評だったメイクをもう一度。コメントに応えながら仕上げて、夜20時の配信を案内しました。",
  "highlights": [
    {
      "timestamp": "0:02:26",
      "title": "音声を確かめて再スタート",
      "body": "聞こえないという声を受けて、立ち上げ直しや音声の確認をしました。トラブルを教えてくれた人へのお礼も伝えています。"
    },
    {
      "timestamp": "0:02:56",
      "title": "やっほー、うれしい！",
      "body": "音が届くようになり、笑顔でやっほーと声をかける場面です。",
      "clip": {
        "src": "/media/live-clips/mily-b176-11-20260930-day-hour-1-clip.mp4",
        "poster": "/media/live-clips/mily-b176-13-20260930-day-hour-1-poster.jpg",
        "width": 640,
        "height": 360,
        "durationSeconds": 4.32,
        "sourceTimestamp": "0:02:56"
      }
    },
    {
      "timestamp": "0:10:57",
      "title": "前日のメイクをもう一度",
      "body": "前日にかわいいと言ってもらえたメイクを、もう一度してみることにしました。みんなに見てもらいたいという気持ちを話しています。"
    },
    {
      "timestamp": "0:17:23",
      "title": "四次審査に向けたお話",
      "body": "10月2日から投票、3日から配信審査が始まると案内しました。見つけてくれた人に、これからの応援を呼びかけています。"
    },
    {
      "timestamp": "0:42:56",
      "title": "もっと知ってもらいたい",
      "body": "審査に向けて、今のうちに見つけてもらい、自分のことを知ってもらいたいと話しました。まったりした時間も大切にしています。"
    },
    {
      "timestamp": "0:49:17",
      "title": "メイクの仕上がりを紹介",
      "body": "前日と同じメイクができたと、仕上がりを紹介しました。少し薄めにしたことや、これからもこのメイクをもとに工夫したいと話しています。"
    },
    {
      "timestamp": "1:01:43",
      "title": "ひと休みして夜枠へ",
      "body": "夜にまた楽しく話せるよう、いったん休むと伝えました。次は20時からと案内し、たくさんのコメントを待っていると呼びかけました。"
    },
    {
      "timestamp": "1:04:55",
      "title": "夜も会おうね",
      "body": "夜の配信へのお誘いと、みなさんと楽しみたい気持ちを伝えます。",
      "clip": {
        "src": "/media/live-clips/mily-b176-12-20260930-day-hour-2-clip.mp4",
        "poster": "/media/live-clips/mily-b176-14-20260930-day-hour-2-poster.jpg",
        "width": 640,
        "height": 360,
        "durationSeconds": 8.12,
        "sourceTimestamp": "1:04:55"
      }
    }
  ],
  "goals": [],
  "ranking": [
    "配信終了時に、13位から1位までランキングを読み上げました。個人名は掲載していません。"
  ],
  "timeline": [
    {
      "timestamp": "0:02:26",
      "label": "再起動と音声の確認"
    },
    {
      "timestamp": "0:02:56",
      "label": "やっほー、うれしい！"
    },
    {
      "timestamp": "0:10:57",
      "label": "メイク配信のスタート"
    },
    {
      "timestamp": "0:14:45",
      "label": "コメントを交えたお化けの話"
    },
    {
      "timestamp": "0:17:23",
      "label": "四次審査と投票の案内"
    },
    {
      "timestamp": "0:23:57",
      "label": "夜枠のためのメイク"
    },
    {
      "timestamp": "0:28:00",
      "label": "メイクに集中"
    },
    {
      "timestamp": "0:42:56",
      "label": "審査前に知ってもらう意気込み"
    },
    {
      "timestamp": "0:46:02",
      "label": "休んで夜に楽しく話す準備"
    },
    {
      "timestamp": "0:49:17",
      "label": "メイクの仕上がり"
    },
    {
      "timestamp": "1:01:43",
      "label": "夜20時の次枠案内"
    },
    {
      "timestamp": "1:02:21",
      "label": "お礼のランキング読み上げ"
    },
    {
      "timestamp": "1:04:53",
      "label": "夜枠へのお誘いと終了の挨拶"
    },
    {
      "timestamp": "1:04:55",
      "label": "夜も会おうね"
    }
  ],
  "nextNote": "配信時点では、次は同日20時からと案内していました。夜枠ではたくさんのコメントを待っていると呼びかけていました。",
  "sourceLabel": "2026年9月30日 昼のSHOWROOM配信（オーナー提供録画・実フレームと自動文字起こし確認）",
  "verifiedAt": "2026-10-01",
  "galleryZip": {
    "src": "/media/live/mily-b176-15-20260930-day-stills-10.zip",
    "filename": "mily-b176-15-20260930-day-stills-10.zip",
    "label": "スクショ10枚をまとめて保存（ZIP）"
  }
};
