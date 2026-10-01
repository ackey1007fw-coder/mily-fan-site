import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

const gallery: StreamRecapImage[] = [
  {
    "src": "/media/live/mily-b178-01-20261001-morning-001030.jpg",
    "width": 640,
    "height": 360,
    "alt": "片手を頬に添えて笑うみりぃ",
    "caption": "0:10:30｜片手を頬に添えて笑うみりぃ",
    "downloadName": "mily-b178-01-20261001-morning-001030.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b178-02-20261001-morning-002230.jpg",
    "width": 640,
    "height": 360,
    "alt": "笑顔で片手を上げるみりぃ",
    "caption": "0:22:30｜笑顔で片手を上げるみりぃ",
    "downloadName": "mily-b178-02-20261001-morning-002230.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b178-03-20261001-morning-003630.jpg",
    "width": 640,
    "height": 360,
    "alt": "頬の横に両手を添えて笑うみりぃ",
    "caption": "0:36:30｜頬の横に両手を添えて笑うみりぃ",
    "downloadName": "mily-b178-03-20261001-morning-003630.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b178-04-20261001-morning-004630.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラに笑顔を向けるみりぃ",
    "caption": "0:46:30｜カメラに笑顔を向けるみりぃ",
    "downloadName": "mily-b178-04-20261001-morning-004630.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b178-05-20261001-morning-005630.jpg",
    "width": 640,
    "height": 360,
    "alt": "終盤に手を振るみりぃ",
    "caption": "0:56:30｜終盤に手を振るみりぃ",
    "downloadName": "mily-b178-05-20261001-morning-005630.jpg",
    "galleryHour": 0
  }
];

export const streamRecap20261001Asa: StreamRecap = {
  image: gallery[2],
  gallery,
  transcriptionNote: buildTranscriptionNote({material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は録画の実フレーム5枚です。約58分の録画の最後まで含めた1枠から、5枚を掲載しています。", extra: "時刻は録画先頭からの目安です。全文の逐語校正と全編の連続視聴は行っていません。短尺は実映像と自動文字起こしを照合しています。投票や審査の時刻・手順は、本人が配信中に確認していた当時の案内として記録しています。", publishedClips: true}),
  "id": "2026-10-01-morning-showroom",
  "date": "2026-10-01",
  "dateLabel": "2026.10.01（木）",
  "theme": "朝の10月スタート",
  "broadcastLabel": "5:36頃〜 約58分",
  "platformLabel": "SHOWROOM",
  "summary": "10月最初の朝は、新しい目標と四次審査への意気込みをお話ししました。投票の手順もみんなと確認しながら、早朝に集まってくれた応援への感謝を伝えた配信です。",
  "highlights": [
    {
      "timestamp": "0:02:44",
      "title": "10月の目標を発表",
      "body": "アバター権の獲得、フォロワー400人、「トマトの栄養素」100人を10月の目標として発表しました。今月も一緒に頑張ろうと呼びかけました。"
    },
    {
      "timestamp": "0:17:49",
      "title": "みんなの応援が栄養に",
      "body": "来てくれることも、アバターやコメント、キラキラも自分の栄養になると話しました。朝からの応援への感謝を伝えています。"
    },
    {
      "timestamp": "0:24:27",
      "title": "投票開始時刻を確認",
      "body": "投票の開始時刻を確認し、10月2日の昼12時からと案内しました。配信審査は3日の朝5時からという、配信時点の説明もありました。"
    },
    {
      "timestamp": "0:24:59",
      "title": "タイムテーブルを準備",
      "body": "審査期間のタイムテーブルを、その日のうちに案内する予定と話しました。ファンルームなどで知らせると伝えています。"
    },
    {
      "timestamp": "0:39:23",
      "title": "キラ星で上を目指したい",
      "body": "ブロック分けへの緊張を話しながら、キラ星で1位を狙いたいという目標を伝えました。応援をお願いしつつ、四次審査への意気込みを話しています。"
    },
    {
      "timestamp": "0:40:28",
      "title": "WEB投票の手順を案内",
      "body": "プロフィールのリンクからWEB投票へ進む手順を説明しました。初回にはLINE認証が必要と話し、やり方を改めて案内する予定も伝えました。"
    },
    {
      "timestamp": "0:49:00",
      "title": "ラジオのメッセージ募集",
      "body": "10月4日のラジオに向けて、1周年にまつわる話や感想などのメッセージを募集しました。いろいろなお話を送ってもらえるとうれしいと呼びかけています。"
    },
    {
      "timestamp": "0:56:18",
      "title": "10月の朝に、拍手！",
      "body": "10月の朝の配信に集まったみなさんへ、笑顔で拍手を送ります。",
      "clip": {
        "src": "/media/live-clips/mily-b178-06-20261001-morning-hour-1-clip.mp4",
        "poster": "/media/live-clips/mily-b178-07-20261001-morning-hour-1-poster.jpg",
        "width": 640,
        "height": 360,
        "durationSeconds": 3.95,
        "sourceTimestamp": "0:56:18"
      }
    }
  ],
  "goals": [
    {
      "item": "アバター権",
      "target": "獲得",
      "statusThen": "10月の目標"
    },
    {
      "item": "フォロワー",
      "target": "400人",
      "statusThen": "10月の目標"
    },
    {
      "item": "トマトの栄養素",
      "target": "100人",
      "statusThen": "10月の目標"
    },
    {
      "item": "キラ星",
      "target": "1位を目指す",
      "statusThen": "目標として言及"
    }
  ],
  "ranking": [
    "配信終了時に、13位から1位までランキングを読み上げました。個人名は掲載していません。"
  ],
  "timeline": [
    {
      "timestamp": "0:00:03",
      "label": "10月最初の朝のあいさつ"
    },
    {
      "timestamp": "0:02:44",
      "label": "10月の新しい目標"
    },
    {
      "timestamp": "0:07:47",
      "label": "11日間の投票への呼びかけ"
    },
    {
      "timestamp": "0:11:23",
      "label": "昼と夜の次枠案内"
    },
    {
      "timestamp": "0:17:49",
      "label": "応援が自分の栄養になるお話"
    },
    {
      "timestamp": "0:24:27",
      "label": "投票開始時刻の確認"
    },
    {
      "timestamp": "0:24:59",
      "label": "審査開始とタイムテーブルの案内"
    },
    {
      "timestamp": "0:28:44",
      "label": "審査初日の朝枠を検討"
    },
    {
      "timestamp": "0:35:46",
      "label": "ラジオと配信の時間配分"
    },
    {
      "timestamp": "0:39:23",
      "label": "ブロック分けへの緊張と目標"
    },
    {
      "timestamp": "0:40:28",
      "label": "WEB投票の手順説明"
    },
    {
      "timestamp": "0:44:33",
      "label": "読み間違いから学ぶ雑談"
    },
    {
      "timestamp": "0:47:13",
      "label": "英会話を楽しむお話"
    },
    {
      "timestamp": "0:49:00",
      "label": "ラジオのメッセージ募集"
    },
    {
      "timestamp": "0:54:48",
      "label": "お礼のランキング読み上げ"
    },
    {
      "timestamp": "0:56:18",
      "label": "10月の朝に、拍手！"
    }
  ],
  "nextNote": "配信時点では、次は同日15時、夜は22時30分の予定と案内していました。昼枠は休息を優先して変更する可能性も話していました。",
  "sourceLabel": "2026年10月1日 朝のSHOWROOM配信（オーナー提供録画・実フレームと自動文字起こし確認）",
  "verifiedAt": "2026-10-01",
  "galleryZip": {
    "src": "/media/live/mily-b178-08-20261001-morning-stills-5.zip",
    "filename": "mily-b178-08-20261001-morning-stills-5.zip",
    "label": "スクショ5枚をまとめて保存（ZIP）"
  }
};
