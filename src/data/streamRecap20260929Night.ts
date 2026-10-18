import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const nightGallery: StreamRecapImage[] = [
  {
    "src": "/media/live/mily-b174-01-20260929-night-000230.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラを見つめるみりぃ",
    "caption": "0:02:30｜カメラを見つめるみりぃ",
    "downloadName": "mily-b174-01-20260929-night-000230.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b174-02-20260929-night-002030.jpg",
    "width": 640,
    "height": 360,
    "alt": "明るく笑うみりぃ",
    "caption": "0:20:30｜明るく笑うみりぃ",
    "downloadName": "mily-b174-02-20260929-night-002030.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b174-03-20260929-night-002430.jpg",
    "width": 640,
    "height": 360,
    "alt": "少し離れて笑うみりぃ",
    "caption": "0:24:30｜少し離れて笑うみりぃ",
    "downloadName": "mily-b174-03-20260929-night-002430.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b174-04-20260929-night-004230.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラへ顔を寄せて笑うみりぃ",
    "caption": "0:42:30｜カメラへ顔を寄せて笑うみりぃ",
    "downloadName": "mily-b174-04-20260929-night-004230.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b174-05-20260929-night-005030.jpg",
    "width": 640,
    "height": 360,
    "alt": "両手を上げるみりぃ",
    "caption": "0:50:30｜両手を上げるみりぃ",
    "downloadName": "mily-b174-05-20260929-night-005030.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b174-06-20260929-night-011430.jpg",
    "width": 640,
    "height": 360,
    "alt": "顔を近づけて笑うみりぃ",
    "caption": "1:14:30｜顔を近づけて笑うみりぃ",
    "downloadName": "mily-b174-06-20260929-night-011430.jpg",
    "galleryHour": 1
  },
  {
    "src": "/media/live/mily-b174-07-20260929-night-012230.jpg",
    "width": 640,
    "height": 360,
    "alt": "口元に手を添えて笑うみりぃ",
    "caption": "1:22:30｜口元に手を添えて笑うみりぃ",
    "downloadName": "mily-b174-07-20260929-night-012230.jpg",
    "galleryHour": 1
  },
  {
    "src": "/media/live/mily-b174-08-20260929-night-012830.jpg",
    "width": 640,
    "height": 360,
    "alt": "青い服でカメラを見るみりぃ",
    "caption": "1:28:30｜青い服でカメラを見るみりぃ",
    "downloadName": "mily-b174-08-20260929-night-012830.jpg",
    "galleryHour": 1
  },
  {
    "src": "/media/live/mily-b174-09-20260929-night-015030.jpg",
    "width": 640,
    "height": 360,
    "alt": "笑顔で手を振るみりぃ",
    "caption": "1:50:30｜笑顔で手を振るみりぃ",
    "downloadName": "mily-b174-09-20260929-night-015030.jpg",
    "galleryHour": 1
  },
  {
    "src": "/media/live/mily-b174-10-20260929-night-015230.jpg",
    "width": 640,
    "height": 360,
    "alt": "両手の人差し指を上げるみりぃ",
    "caption": "1:52:30｜両手の人差し指を上げるみりぃ",
    "downloadName": "mily-b174-10-20260929-night-015230.jpg",
    "galleryHour": 1
  },
  {
    "src": "/media/live/mily-b174-11-20260929-night-020030.jpg",
    "width": 640,
    "height": 360,
    "alt": "笑顔で片手を上げるみりぃ",
    "caption": "2:00:30｜笑顔で片手を上げるみりぃ",
    "downloadName": "mily-b174-11-20260929-night-020030.jpg",
    "galleryHour": 2
  },
  {
    "src": "/media/live/mily-b174-12-20260929-night-021030.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラに笑顔を向けるみりぃ",
    "caption": "2:10:30｜カメラに笑顔を向けるみりぃ",
    "downloadName": "mily-b174-12-20260929-night-021030.jpg",
    "galleryHour": 2
  },
  {
    "src": "/media/live/mily-b174-13-20260929-night-022430.jpg",
    "width": 640,
    "height": 360,
    "alt": "正面を向いて笑うみりぃ",
    "caption": "2:24:30｜正面を向いて笑うみりぃ",
    "downloadName": "mily-b174-13-20260929-night-022430.jpg",
    "galleryHour": 2
  },
  {
    "src": "/media/live/mily-b174-14-20260929-night-024830.jpg",
    "width": 640,
    "height": 360,
    "alt": "顔の横で手を振るみりぃ",
    "caption": "2:48:30｜顔の横で手を振るみりぃ",
    "downloadName": "mily-b174-14-20260929-night-024830.jpg",
    "galleryHour": 2
  },
  {
    "src": "/media/live/mily-b174-15-20260929-night-025830.jpg",
    "width": 640,
    "height": 360,
    "alt": "両腕を動かすみりぃ",
    "caption": "2:58:30｜両腕を動かすみりぃ",
    "downloadName": "mily-b174-15-20260929-night-025830.jpg",
    "galleryHour": 2
  },
  {
    "src": "/media/live/mily-b174-16-20260929-night-031230.jpg",
    "width": 640,
    "height": 360,
    "alt": "笑顔で片手を振るみりぃ",
    "caption": "3:12:30｜笑顔で片手を振るみりぃ",
    "downloadName": "mily-b174-16-20260929-night-031230.jpg",
    "galleryHour": 3
  },
  {
    "src": "/media/live/mily-b174-17-20260929-night-031430.jpg",
    "width": 640,
    "height": 360,
    "alt": "少し離れて微笑むみりぃ",
    "caption": "3:14:30｜少し離れて微笑むみりぃ",
    "downloadName": "mily-b174-17-20260929-night-031430.jpg",
    "galleryHour": 3
  },
  {
    "src": "/media/live/mily-b174-18-20260929-night-031830.jpg",
    "width": 640,
    "height": 360,
    "alt": "頬の横で両手を合わせるみりぃ",
    "caption": "3:18:30｜頬の横で両手を合わせるみりぃ",
    "downloadName": "mily-b174-18-20260929-night-031830.jpg",
    "galleryHour": 3
  },
  {
    "src": "/media/live/mily-b174-19-20260929-night-035230.jpg",
    "width": 640,
    "height": 360,
    "alt": "終盤に笑顔を見せるみりぃ",
    "caption": "3:52:30｜終盤に笑顔を見せるみりぃ",
    "downloadName": "mily-b174-19-20260929-night-035230.jpg",
    "galleryHour": 3
  },
  {
    "src": "/media/live/mily-b174-20-20260929-night-035830.jpg",
    "width": 640,
    "height": 360,
    "alt": "正面を向いて微笑むみりぃ",
    "caption": "3:58:30｜正面を向いて微笑むみりぃ",
    "downloadName": "mily-b174-20-20260929-night-035830.jpg",
    "galleryHour": 3
  },
  {
    "src": "/media/live/mily-b174-21-20260929-night-040030.jpg",
    "width": 640,
    "height": 360,
    "alt": "終盤のおしゃべりをするみりぃ",
    "caption": "4:00:30｜終盤のおしゃべりをするみりぃ",
    "downloadName": "mily-b174-21-20260929-night-040030.jpg",
    "galleryHour": 4
  },
  {
    "src": "/media/live/mily-b174-22-20260929-night-040230.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラを見て笑うみりぃ",
    "caption": "4:02:30｜カメラを見て笑うみりぃ",
    "downloadName": "mily-b174-22-20260929-night-040230.jpg",
    "galleryHour": 4
  },
  {
    "src": "/media/live/mily-b174-23-20260929-night-040430.jpg",
    "width": 640,
    "height": 360,
    "alt": "手を伸ばして微笑むみりぃ",
    "caption": "4:04:30｜手を伸ばして微笑むみりぃ",
    "downloadName": "mily-b174-23-20260929-night-040430.jpg",
    "galleryHour": 4
  },
  {
    "src": "/media/live/mily-b174-24-20260929-night-040630.jpg",
    "width": 640,
    "height": 360,
    "alt": "口元に手を添えるみりぃ",
    "caption": "4:06:30｜口元に手を添えるみりぃ",
    "downloadName": "mily-b174-24-20260929-night-040630.jpg",
    "galleryHour": 4
  },
  {
    "src": "/media/live/mily-b174-25-20260929-night-040830.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラに向かって話すみりぃ",
    "caption": "4:08:30｜カメラに向かって話すみりぃ",
    "downloadName": "mily-b174-25-20260929-night-040830.jpg",
    "galleryHour": 4
  }
];

export const streamRecap20260929Night: StreamRecap = {
  image: nightGallery[1],
  gallery: nightGallery,
  transcriptionNote: buildTranscriptionNote({material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は録画の実フレーム25枚です。1時間ごとに5枚、最後の約9分も5枚を掲載しています。", extra: "時刻は録画先頭からの目安です。全文の逐語校正と全編の連続視聴は行っていません。短尺は実映像と自動文字起こしを照合しています。", publishedClips: true}),
    "id": "2026-09-29-night-showroom",
    "date": "2026-09-29",
    "dateLabel": "2026.09.29（火）",
    "theme": "夜の配信60日目",
    "broadcastLabel": "21:31頃〜 約249分",
    "platformLabel": "SHOWROOM",
    "summary": "配信を始めて60日目を迎え、ここまでの応援に感謝を伝えました。笑顔や手振りを見せながら会話が続き、ラジオや次の審査への思いも語った夜です。録画を1時間ごとに区切った5枠から、スクショ25枚と短いシーン5本を掲載しています。",
    "highlights": [
      {
        "timestamp": "0:00:47",
        "title": "配信60日目の記念",
        "body": "配信を始めて60日目を迎えたと話し、ここまで支えてくれたみなさんへ感謝を伝えました。"
      },
      {
        "timestamp": "0:20:36",
        "title": "60日目のありがとう",
        "body": "60日間配信を続けられたことへの感謝を、笑顔で伝える短い場面です。",
        "clip": {
          "durationSeconds": 3.85,
          "src": "/media/live-clips/mily-b174-26-20260929-night-hour-1-clip.mp4",
          "poster": "/media/live-clips/mily-b174-31-20260929-night-hour-1-poster.jpg",
          "width": 640,
          "height": 360,
          "sourceTimestamp": "0:20:36"
        }
      },
      {
        "timestamp": "1:31:24",
        "title": "話すこととラジオの積み重ね",
        "body": "配信でのおしゃべりとラジオの話題を交え、これからも成長していきたい気持ちを語りました。"
      },
      {
        "timestamp": "1:50:32",
        "title": "笑顔でおしゃべり",
        "body": "おしゃべりの合間に笑顔を見せ、あたたかな言葉にお礼を伝えます。",
        "clip": {
          "durationSeconds": 7.8,
          "src": "/media/live-clips/mily-b174-27-20260929-night-hour-2-clip.mp4",
          "poster": "/media/live-clips/mily-b174-32-20260929-night-hour-2-poster.jpg",
          "width": 640,
          "height": 360,
          "sourceTimestamp": "1:50:32"
        }
      },
      {
        "timestamp": "2:48:23",
        "title": "笑顔とおやすみの手振り",
        "body": "笑顔で手を振りながら、遅い時間まで来てくれた人へおやすみの言葉を届けます。",
        "clip": {
          "durationSeconds": 11.7,
          "src": "/media/live-clips/mily-b174-28-20260929-night-hour-3-clip.mp4",
          "poster": "/media/live-clips/mily-b174-33-20260929-night-hour-3-poster.jpg",
          "width": 640,
          "height": 360,
          "sourceTimestamp": "2:48:23"
        }
      },
      {
        "timestamp": "3:12:28",
        "title": "手を振りながらおしゃべり",
        "body": "手を振って笑顔を見せ、お礼とともにおしゃべりを続ける場面です。",
        "clip": {
          "durationSeconds": 4.8,
          "src": "/media/live-clips/mily-b174-29-20260929-night-hour-4-clip.mp4",
          "poster": "/media/live-clips/mily-b174-34-20260929-night-hour-4-poster.jpg",
          "width": 640,
          "height": 360,
          "sourceTimestamp": "3:12:28"
        }
      },
      {
        "timestamp": "3:12:53",
        "title": "次の審査へ向けた思い",
        "body": "投票やSHOWROOMの審査を前にした思いを話し、みなさんとの会話を続けました。"
      },
      {
        "timestamp": "4:04:33",
        "title": "終盤のありがとう",
        "body": "終盤に感謝と、これからも頑張る気持ちを短く伝えます。",
        "clip": {
          "durationSeconds": 4.25,
          "src": "/media/live-clips/mily-b174-30-20260929-night-hour-5-clip.mp4",
          "poster": "/media/live-clips/mily-b174-35-20260929-night-hour-5-poster.jpg",
          "width": 640,
          "height": 360,
          "sourceTimestamp": "4:04:33"
        }
      }
    ],
    "goals": [{"item":"次の審査","target":"ファイナルへ","statusThen":"応援を呼びかけ"}],
    "ranking": [buildRankingNote(13, 1)],
    "timeline": [
      {
        "timestamp": "0:00:47",
        "label": "配信60日目を迎えたお礼"
      },
      {
        "timestamp": "0:20:36",
        "label": "続けてこられたことへの感謝"
      },
      {
        "timestamp": "0:31:17",
        "label": "投票と次の審査の話題"
      },
      {
        "timestamp": "1:31:24",
        "label": "ラジオと話すことの積み重ね"
      },
      {
        "timestamp": "1:50:32",
        "label": "笑顔のおしゃべり"
      },
      {
        "timestamp": "2:48:23",
        "label": "おやすみの言葉と手振り"
      },
      {
        "timestamp": "3:12:28",
        "label": "手を振りながらお礼"
      },
      {
        "timestamp": "3:12:53",
        "label": "審査を前にした思い"
      },
      {
        "timestamp": "3:18:30",
        "label": "頬の横で両手を合わせるポーズ"
      },
      {
        "timestamp": "4:04:33",
        "label": "終盤の感謝とこれからの気持ち"
      },
      {
        "timestamp": "4:05:18",
        "label": "13位から1位までランキングの読み上げ"
      },
      {
        "timestamp": "4:08:39",
        "label": "翌朝9時の案内とおやすみのあいさつ"
      }
    ],
    "nextNote": "配信時点では、次の枠は朝9時に会おうと案内していました。",
    "sourceLabel": "2026年9月29日 夜のSHOWROOM配信（オーナー提供録画・実フレームと自動文字起こし確認）",
    "verifiedAt": "2026-09-30",
    "galleryZip": {
      "src": "/media/live/mily-b174-39-20260929-night-stills-25.zip",
      "filename": "mily-b174-39-20260929-night-stills-25.zip",
      "label": "スクショ25枚をまとめて保存（ZIP）"
    }
};
