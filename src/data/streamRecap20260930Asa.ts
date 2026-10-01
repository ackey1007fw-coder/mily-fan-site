import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

const gallery: StreamRecapImage[] = [
  {
    "src": "/media/live/mily-b175-01-20260930-morning-000430.jpg",
    "width": 640,
    "height": 360,
    "alt": "笑顔を見せるみりぃ",
    "caption": "0:04:30｜笑顔を見せるみりぃ",
    "downloadName": "mily-b175-01-20260930-morning-000430.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b175-02-20260930-morning-000830.jpg",
    "width": 640,
    "height": 360,
    "alt": "頬の横に両手を添えて笑うみりぃ",
    "caption": "0:08:30｜頬の横に両手を添えて笑うみりぃ",
    "downloadName": "mily-b175-02-20260930-morning-000830.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b175-03-20260930-morning-001230.jpg",
    "width": 640,
    "height": 360,
    "alt": "笑顔で手を振るみりぃ",
    "caption": "0:12:30｜笑顔で手を振るみりぃ",
    "downloadName": "mily-b175-03-20260930-morning-001230.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b175-04-20260930-morning-004230.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラへ笑顔を向けるみりぃ",
    "caption": "0:42:30｜カメラへ笑顔を向けるみりぃ",
    "downloadName": "mily-b175-04-20260930-morning-004230.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b175-05-20260930-morning-005030.jpg",
    "width": 640,
    "height": 360,
    "alt": "マイクを手に片手を上げるみりぃ",
    "caption": "0:50:30｜マイクを手に片手を上げるみりぃ",
    "downloadName": "mily-b175-05-20260930-morning-005030.jpg",
    "galleryHour": 0
  },
  {
    "src": "/media/live/mily-b175-06-20260930-morning-010430.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラへ顔を近づけるみりぃ",
    "caption": "1:04:30｜カメラへ顔を近づけるみりぃ",
    "downloadName": "mily-b175-06-20260930-morning-010430.jpg",
    "galleryHour": 1
  },
  {
    "src": "/media/live/mily-b175-07-20260930-morning-011430.jpg",
    "width": 640,
    "height": 360,
    "alt": "両腕を広げておしゃべりするみりぃ",
    "caption": "1:14:30｜両腕を広げておしゃべりするみりぃ",
    "downloadName": "mily-b175-07-20260930-morning-011430.jpg",
    "galleryHour": 1
  },
  {
    "src": "/media/live/mily-b175-08-20260930-morning-012230.jpg",
    "width": 640,
    "height": 360,
    "alt": "笑顔でおしゃべりするみりぃ",
    "caption": "1:22:30｜笑顔でおしゃべりするみりぃ",
    "downloadName": "mily-b175-08-20260930-morning-012230.jpg",
    "galleryHour": 1
  },
  {
    "src": "/media/live/mily-b175-09-20260930-morning-012630.jpg",
    "width": 640,
    "height": 360,
    "alt": "両手を振って笑うみりぃ",
    "caption": "1:26:30｜両手を振って笑うみりぃ",
    "downloadName": "mily-b175-09-20260930-morning-012630.jpg",
    "galleryHour": 1
  },
  {
    "src": "/media/live/mily-b175-10-20260930-morning-013630.jpg",
    "width": 640,
    "height": 360,
    "alt": "人差し指を上げるみりぃ",
    "caption": "1:36:30｜人差し指を上げるみりぃ",
    "downloadName": "mily-b175-10-20260930-morning-013630.jpg",
    "galleryHour": 1
  }
];

export const streamRecap20260930Asa: StreamRecap = {
  image: gallery[1],
  gallery,
  transcriptionNote: buildTranscriptionNote({material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は録画の実フレーム10枚です。1時間ごとに5枚、最後の約39分も5枚を掲載しています。", extra: "時刻は録画先頭からの目安です。全文の逐語校正と全編の連続視聴は行っていません。短尺は実映像と自動文字起こしを照合しています。歌唱場面は自動文字起こしで確認できますが、曲名と原曲リンクは原音未照合のため一覧化していません。", publishedClips: true}),
  "id": "2026-09-30-morning-showroom",
  "date": "2026-09-30",
  "dateLabel": "2026.09.30（水）",
  "theme": "朝の月末ありがとう",
  "broadcastLabel": "9:00頃〜 約99分",
  "platformLabel": "SHOWROOM",
  "summary": "9月最後の朝は、初アバターや今月の応援へのお礼をたっぷり。途中には歌に挑戦する場面もあり、10月の目標をみんなに伝えた配信です。",
  "highlights": [
    {
      "timestamp": "0:02:06",
      "title": "朝の自己紹介",
      "body": "MISS CIRCLE CONTESTに出場中と自己紹介し、見つけてくれた人にこれからも見守ってほしいと呼びかけました。"
    },
    {
      "timestamp": "0:03:46",
      "title": "初アバターのお話",
      "body": "初めてのアバターを紹介し、着てくれる人が増える喜びを話しました。後半には、衣装がプロフィール写真と同じという裏話もありました。"
    },
    {
      "timestamp": "0:08:23",
      "title": "うれしい朝のひとこと",
      "body": "うれしさと感謝を、笑顔で伝える短い場面です。",
      "clip": {
        "src": "/media/live-clips/mily-b175-11-20260930-morning-hour-1-clip.mp4",
        "poster": "/media/live-clips/mily-b175-13-20260930-morning-hour-1-poster.jpg",
        "width": 640,
        "height": 360,
        "durationSeconds": 4.85,
        "sourceTimestamp": "0:08:23"
      }
    },
    {
      "timestamp": "0:25:04",
      "title": "四次審査への呼びかけ",
      "body": "10月2日から投票、3日から配信審査が始まると案内しました。配信時点の案内として、応援へのお願いを伝えています。"
    },
    {
      "timestamp": "0:49:49",
      "title": "トークから歌に挑戦",
      "body": "歌えそう、と話していた曲にその場で挑戦しました。歌い終わると、朝のオープニングナンバーとして振り返りました。"
    },
    {
      "timestamp": "1:04:13",
      "title": "9月の目標達成にお礼",
      "body": "「トマトの栄養素」の目標70人を超えたと喜びました。来月も、無理なくルームに来てもらえるとうれしいと話しています。"
    },
    {
      "timestamp": "1:26:29",
      "title": "笑顔でありがとう",
      "body": "笑顔でお礼を伝え、ルームに来てくれるみなさんの優しさを話します。",
      "clip": {
        "src": "/media/live-clips/mily-b175-12-20260930-morning-hour-2-clip.mp4",
        "poster": "/media/live-clips/mily-b175-14-20260930-morning-hour-2-poster.jpg",
        "width": 640,
        "height": 360,
        "durationSeconds": 7.75,
        "sourceTimestamp": "1:26:29"
      }
    },
    {
      "timestamp": "1:30:10",
      "title": "10月は100人を目標に",
      "body": "10月の「トマトの栄養素」は100人を目標にすると発表しました。月末の感謝を込めて、来月も一緒に頑張ろうと呼びかけました。"
    }
  ],
  "goals": [
    {
      "item": "9月の応援",
      "target": "70人",
      "statusThen": "達成を喜ぶ"
    },
    {
      "item": "10月の応援",
      "target": "100人",
      "statusThen": "目標を発表"
    }
  ],
  "ranking": [
    "配信終了時に、13位から1位までランキングを読み上げました。個人名は掲載していません。"
  ],
  "timeline": [
    {
      "timestamp": "0:01:08",
      "label": "いつもより遅めの朝配信"
    },
    {
      "timestamp": "0:02:06",
      "label": "コンテスト出場の自己紹介"
    },
    {
      "timestamp": "0:03:46",
      "label": "初アバターの紹介"
    },
    {
      "timestamp": "0:08:23",
      "label": "うれしい朝のひとこと"
    },
    {
      "timestamp": "0:12:18",
      "label": "名前を覚えてもらう自己紹介"
    },
    {
      "timestamp": "0:25:04",
      "label": "投票と配信審査の案内"
    },
    {
      "timestamp": "0:43:42",
      "label": "リップのキャップに新発見"
    },
    {
      "timestamp": "0:49:49",
      "label": "トークから歌に挑戦"
    },
    {
      "timestamp": "1:04:13",
      "label": "9月の応援目標達成のお礼"
    },
    {
      "timestamp": "1:17:31",
      "label": "話し方や表情も磨く意気込み"
    },
    {
      "timestamp": "1:26:29",
      "label": "笑顔でありがとう"
    },
    {
      "timestamp": "1:30:10",
      "label": "10月の応援目標100人"
    },
    {
      "timestamp": "1:36:02",
      "label": "お礼のランキング読み上げ"
    },
    {
      "timestamp": "1:38:08",
      "label": "次の昼枠と夜枠の案内"
    }
  ],
  "nextNote": "配信時点では、次は14時40分頃から、夜も配信する予定と案内していました。夜枠の時刻は、この朝枠では未定でした。",
  "sourceLabel": "2026年9月30日 朝のSHOWROOM配信（オーナー提供録画・実フレームと自動文字起こし確認）",
  "verifiedAt": "2026-10-01",
  "galleryZip": {
    "src": "/media/live/mily-b175-15-20260930-morning-stills-10.zip",
    "filename": "mily-b175-15-20260930-morning-stills-10.zip",
    "label": "スクショ10枚をまとめて保存（ZIP）"
  }
};
