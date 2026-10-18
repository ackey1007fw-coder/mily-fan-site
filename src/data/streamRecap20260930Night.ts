import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

const gallery: StreamRecapImage[] = [
  {
    "src": "/media/live/mily-b177-01-20260930-night-000430.jpg",
    "width": 640,
    "height": 360,
    "alt": "両手を振って笑うみりぃ",
    "caption": "0:04:30｜両手を振って笑うみりぃ",
    "downloadName": "mily-b177-01-20260930-night-000430.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b177-02-20260930-night-001830.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラへ顔を近づけて笑うみりぃ",
    "caption": "0:18:30｜カメラへ顔を近づけて笑うみりぃ",
    "downloadName": "mily-b177-02-20260930-night-001830.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b177-03-20260930-night-002430.jpg",
    "width": 640,
    "height": 360,
    "alt": "頭の上で両腕を丸くするみりぃ",
    "caption": "0:24:30｜頭の上で両腕を丸くするみりぃ",
    "downloadName": "mily-b177-03-20260930-night-002430.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b177-04-20260930-night-004830.jpg",
    "width": 640,
    "height": 360,
    "alt": "顔の前で手を合わせるみりぃ",
    "caption": "0:48:30｜顔の前で手を合わせるみりぃ",
    "downloadName": "mily-b177-04-20260930-night-004830.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b177-05-20260930-night-005430.jpg",
    "width": 640,
    "height": 360,
    "alt": "笑顔でおしゃべりするみりぃ",
    "caption": "0:54:30｜笑顔でおしゃべりするみりぃ",
    "downloadName": "mily-b177-05-20260930-night-005430.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b177-06-20260930-night-010830.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラを見ながら話すみりぃ",
    "caption": "1:08:30｜カメラを見ながら話すみりぃ",
    "downloadName": "mily-b177-06-20260930-night-010830.jpg",
    "galleryHour": 1
  },
  {
    "src": "/media/live/mily-b177-07-20260930-night-011830.jpg",
    "width": 640,
    "height": 360,
    "alt": "笑顔を向けるみりぃ",
    "caption": "1:18:30｜笑顔を向けるみりぃ",
    "downloadName": "mily-b177-07-20260930-night-011830.jpg",
    "galleryHour": 1
  },
  {
    "src": "/media/live/mily-b177-08-20260930-night-013030.jpg",
    "width": 640,
    "height": 360,
    "alt": "フードをかぶって笑うみりぃ",
    "caption": "1:30:30｜フードをかぶって笑うみりぃ",
    "downloadName": "mily-b177-08-20260930-night-013030.jpg",
    "galleryHour": 1
  },
  {
    "src": "/media/live/mily-b177-09-20260930-night-014830.jpg",
    "width": 640,
    "height": 360,
    "alt": "両手をフードへ添えるみりぃ",
    "caption": "1:48:30｜両手をフードへ添えるみりぃ",
    "downloadName": "mily-b177-09-20260930-night-014830.jpg",
    "galleryHour": 1
  },
  {
    "src": "/media/live/mily-b177-10-20260930-night-015830.jpg",
    "width": 640,
    "height": 360,
    "alt": "フード姿で笑顔を見せるみりぃ",
    "caption": "1:58:30｜フード姿で笑顔を見せるみりぃ",
    "downloadName": "mily-b177-10-20260930-night-015830.jpg",
    "galleryHour": 1
  },
  {
    "src": "/media/live/mily-b177-11-20260930-night-020030.jpg",
    "width": 640,
    "height": 360,
    "alt": "フード姿で両手を振るみりぃ",
    "caption": "2:00:30｜フード姿で両手を振るみりぃ",
    "downloadName": "mily-b177-11-20260930-night-020030.jpg",
    "galleryHour": 2
  },
  {
    "src": "/media/live/mily-b177-12-20260930-night-021430.jpg",
    "width": 640,
    "height": 360,
    "alt": "顔の横で指を広げるみりぃ",
    "caption": "2:14:30｜顔の横で指を広げるみりぃ",
    "downloadName": "mily-b177-12-20260930-night-021430.jpg",
    "galleryHour": 2
  },
  {
    "src": "/media/live/mily-b177-13-20260930-night-022830.jpg",
    "width": 640,
    "height": 360,
    "alt": "首をかしげて笑うみりぃ",
    "caption": "2:28:30｜首をかしげて笑うみりぃ",
    "downloadName": "mily-b177-13-20260930-night-022830.jpg",
    "galleryHour": 2
  },
  {
    "src": "/media/live/mily-b177-14-20260930-night-024030.jpg",
    "width": 640,
    "height": 360,
    "alt": "片手で三本の指を上げるみりぃ",
    "caption": "2:40:30｜片手で三本の指を上げるみりぃ",
    "downloadName": "mily-b177-14-20260930-night-024030.jpg",
    "galleryHour": 2
  },
  {
    "src": "/media/live/mily-b177-15-20260930-night-025630.jpg",
    "width": 640,
    "height": 360,
    "alt": "片手を頭へ添えるみりぃ",
    "caption": "2:56:30｜片手を頭へ添えるみりぃ",
    "downloadName": "mily-b177-15-20260930-night-025630.jpg",
    "galleryHour": 2
  },
  {
    "src": "/media/live/mily-b177-16-20260930-night-030630.jpg",
    "width": 640,
    "height": 360,
    "alt": "体を傾けて微笑むみりぃ",
    "caption": "3:06:30｜体を傾けて微笑むみりぃ",
    "downloadName": "mily-b177-16-20260930-night-030630.jpg",
    "galleryHour": 3
  },
  {
    "src": "/media/live/mily-b177-17-20260930-night-031230.jpg",
    "width": 640,
    "height": 360,
    "alt": "少し離れて笑顔を見せるみりぃ",
    "caption": "3:12:30｜少し離れて笑顔を見せるみりぃ",
    "downloadName": "mily-b177-17-20260930-night-031230.jpg",
    "galleryHour": 3
  },
  {
    "src": "/media/live/mily-b177-18-20260930-night-031830.jpg",
    "width": 640,
    "height": 360,
    "alt": "胸元に両手を添えて話すみりぃ",
    "caption": "3:18:30｜胸元に両手を添えて話すみりぃ",
    "downloadName": "mily-b177-18-20260930-night-031830.jpg",
    "galleryHour": 3
  },
  {
    "src": "/media/live/mily-b177-19-20260930-night-033230.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラの近くで手を振るみりぃ",
    "caption": "3:32:30｜カメラの近くで手を振るみりぃ",
    "downloadName": "mily-b177-19-20260930-night-033230.jpg",
    "galleryHour": 3
  },
  {
    "src": "/media/live/mily-b177-20-20260930-night-035830.jpg",
    "width": 640,
    "height": 360,
    "alt": "両手を振って笑顔を見せるみりぃ",
    "caption": "3:58:30｜両手を振って笑顔を見せるみりぃ",
    "downloadName": "mily-b177-20-20260930-night-035830.jpg",
    "galleryHour": 3
  },
  {
    "src": "/media/live/mily-b177-21-20260930-night-040030.jpg",
    "width": 640,
    "height": 360,
    "alt": "終盤におしゃべりするみりぃ",
    "caption": "4:00:30｜終盤におしゃべりするみりぃ",
    "downloadName": "mily-b177-21-20260930-night-040030.jpg",
    "galleryHour": 4
  },
  {
    "src": "/media/live/mily-b177-22-20260930-night-040230.jpg",
    "width": 640,
    "height": 360,
    "alt": "両手の指を広げて笑うみりぃ",
    "caption": "4:02:30｜両手の指を広げて笑うみりぃ",
    "downloadName": "mily-b177-22-20260930-night-040230.jpg",
    "galleryHour": 4
  },
  {
    "src": "/media/live/mily-b177-23-20260930-night-040430.jpg",
    "width": 640,
    "height": 360,
    "alt": "胸の前で手を合わせるみりぃ",
    "caption": "4:04:30｜胸の前で手を合わせるみりぃ",
    "downloadName": "mily-b177-23-20260930-night-040430.jpg",
    "galleryHour": 4
  },
  {
    "src": "/media/live/mily-b177-24-20260930-night-040630.jpg",
    "width": 640,
    "height": 360,
    "alt": "終盤に明るい笑顔を見せるみりぃ",
    "caption": "4:06:30｜終盤に明るい笑顔を見せるみりぃ",
    "downloadName": "mily-b177-24-20260930-night-040630.jpg",
    "galleryHour": 4
  },
  {
    "src": "/media/live/mily-b177-25-20260930-night-041230.jpg",
    "width": 640,
    "height": 360,
    "alt": "顔を近づけて微笑むみりぃ",
    "caption": "4:12:30｜顔を近づけて微笑むみりぃ",
    "downloadName": "mily-b177-25-20260930-night-041230.jpg",
    "galleryHour": 4
  }
];

export const streamRecap20260930Night: StreamRecap = {
  image: gallery[23],
  gallery,
  transcriptionNote: buildTranscriptionNote({material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は録画の実フレーム25枚です。1時間ごとに5枚、最後の約16分も5枚を掲載しています。", extra: "時刻は録画先頭からの目安です。全文の逐語校正と全編の連続視聴は行っていません。短尺は実映像と自動文字起こしを照合しています。日付をまたいだ夜枠です。歌唱曲名・人数の不明瞭な箇所は補っていません。", publishedClips: true}),
  "id": "2026-09-30-night-showroom",
  "date": "2026-09-30",
  "dateLabel": "2026.09.30（水）",
  "theme": "夜の月末ありがとう",
  "broadcastLabel": "20:03頃〜 約256分",
  "platformLabel": "SHOWROOM",
  "summary": "9月最後の夜は、ラジオのお話や配信を始めてからの振り返りを、みんなとゆっくり楽しみました。日付が変わるまでおしゃべりを続け、10月も一緒に頑張ろうと感謝を伝えた配信です。",
  "highlights": [
    {
      "timestamp": "0:18:33",
      "title": "こんばんみり",
      "body": "笑顔で手を振り、夜の挨拶を届けます。",
      "clip": {
        "src": "/media/live-clips/mily-b177-26-20260930-night-hour-1-clip.mp4",
        "poster": "/media/live-clips/mily-b177-31-20260930-night-hour-1-poster.jpg",
        "width": 640,
        "height": 360,
        "durationSeconds": 2.4,
        "sourceTimestamp": "0:18:33"
      }
    },
    {
      "timestamp": "0:58:15",
      "title": "ラジオのお話をじっくり",
      "body": "ラジオを聴く方法や番組づくりを紹介しました。選曲も話し合いながら進めていることや、活動できる環境への感謝を話しています。"
    },
    {
      "timestamp": "1:30:13",
      "title": "おしゃべりの合間に、にこっ",
      "body": "フード姿でおしゃべりしながら、笑顔を見せる短い場面です。",
      "clip": {
        "src": "/media/live-clips/mily-b177-27-20260930-night-hour-2-clip.mp4",
        "poster": "/media/live-clips/mily-b177-32-20260930-night-hour-2-poster.jpg",
        "width": 640,
        "height": 360,
        "durationSeconds": 3.1,
        "sourceTimestamp": "1:30:13"
      }
    },
    {
      "timestamp": "2:34:23",
      "title": "2か月を振り返って",
      "body": "配信を続けてきた2か月を振り返り、みなさんに問いかけます。",
      "clip": {
        "src": "/media/live-clips/mily-b177-28-20260930-night-hour-3-clip.mp4",
        "poster": "/media/live-clips/mily-b177-33-20260930-night-hour-3-poster.jpg",
        "width": 640,
        "height": 360,
        "durationSeconds": 7.4,
        "sourceTimestamp": "2:34:23"
      }
    },
    {
      "timestamp": "2:38:08",
      "title": "2か月の配信を振り返る",
      "body": "始める前は怖かった配信も、応援を受けて楽しく続けられたと振り返りました。四次審査では、みんなと一緒にもっと上を目指したいと話しています。"
    },
    {
      "timestamp": "3:32:13",
      "title": "これからも頑張るね",
      "body": "応援してもらえるよう、これからも頑張りたい気持ちを伝えます。",
      "clip": {
        "src": "/media/live-clips/mily-b177-29-20260930-night-hour-4-clip.mp4",
        "poster": "/media/live-clips/mily-b177-34-20260930-night-hour-4-poster.jpg",
        "width": 640,
        "height": 360,
        "durationSeconds": 7.1,
        "sourceTimestamp": "3:32:13"
      }
    },
    {
      "timestamp": "4:00:17",
      "title": "10月も一緒に頑張ろう",
      "body": "日付が変わって10月を迎え、ここまで楽しく配信できたことにお礼を伝えました。「トマトの栄養素」100人を目標に、今月も楽しい時間を届けたいと話しました。"
    },
    {
      "timestamp": "4:15:34",
      "title": "おやすみ、10月も一緒に",
      "body": "手を振ってお礼とおやすみを伝え、10月も一緒に頑張ろうと呼びかけます。",
      "clip": {
        "src": "/media/live-clips/mily-b177-30-20260930-night-hour-5-clip.mp4",
        "poster": "/media/live-clips/mily-b177-35-20260930-night-hour-5-poster.jpg",
        "width": 640,
        "height": 360,
        "durationSeconds": 7.45,
        "sourceTimestamp": "4:15:34"
      }
    }
  ],
  "goals": [
    {
      "item": "9月アバター権",
      "target": "獲得",
      "statusThen": "獲得・配布を報告"
    },
    {
      "item": "9月フォロー",
      "target": "300人",
      "statusThen": "目標超えを報告"
    },
    {
      "item": "9月のトマト",
      "target": "70人",
      "statusThen": "目標超えを報告"
    },
    {
      "item": "9月ファン印",
      "target": "5人",
      "statusThen": "4人と説明"
    },
    {
      "item": "10月のトマト",
      "target": "100人",
      "statusThen": "目標を発表"
    }
  ],
  "ranking": [],
  "timeline": [
    {
      "timestamp": "0:01:04",
      "label": "夕食を交えた夜のおしゃべり"
    },
    {
      "timestamp": "0:18:33",
      "label": "こんばんみり"
    },
    {
      "timestamp": "0:58:15",
      "label": "ラジオの聴き方と番組づくり"
    },
    {
      "timestamp": "1:30:13",
      "label": "おしゃべりの合間に、にこっ"
    },
    {
      "timestamp": "1:31:47",
      "label": "ファンマークのきっかけ"
    },
    {
      "timestamp": "2:18:04",
      "label": "応援を自信にして進む気持ち"
    },
    {
      "timestamp": "2:30:06",
      "label": "9月の目標と成果を振り返る"
    },
    {
      "timestamp": "2:34:23",
      "label": "2か月を振り返って"
    },
    {
      "timestamp": "2:38:08",
      "label": "配信を始めて2か月の振り返り"
    },
    {
      "timestamp": "2:47:00",
      "label": "四次審査で存在感を出す目標"
    },
    {
      "timestamp": "2:52:42",
      "label": "英語に親しむお話"
    },
    {
      "timestamp": "3:01:03",
      "label": "コメントと話題をつなぐお話"
    },
    {
      "timestamp": "3:32:13",
      "label": "これからも頑張るね"
    },
    {
      "timestamp": "4:00:17",
      "label": "10月を迎えて感謝と目標"
    },
    {
      "timestamp": "4:14:49",
      "label": "翌朝5時半の案内とおやすみ"
    },
    {
      "timestamp": "4:15:34",
      "label": "おやすみ、10月も一緒に"
    }
  ],
  "nextNote": "配信時点では、次は10月1日の朝5時30分からと案内していました。その後も昼と夜に配信する予定と話していましたが、この夜枠では時刻は未定でした。",
  "sourceLabel": "2026年9月30日 夜のSHOWROOM配信（オーナー提供録画・実フレームと自動文字起こし確認）",
  "verifiedAt": "2026-10-01",
  "galleryZip": {
    "src": "/media/live/mily-b177-36-20260930-night-stills-25.zip",
    "filename": "mily-b177-36-20260930-night-stills-25.zip",
    "label": "スクショ25枚をまとめて保存（ZIP）"
  }
};
