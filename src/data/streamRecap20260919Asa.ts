import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const stills: StreamRecapImage[] = [
  {
    "src": "/media/live/mily-b132-01-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "朝の笑顔のみりぃ",
    "caption": "0:03:17 朝の笑顔",
    "downloadName": "みりぃ_20260919朝_01.jpg"
  },
  {
    "src": "/media/live/mily-b132-02-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "フードをかぶった表情のみりぃ",
    "caption": "0:13:43 フードをかぶった表情",
    "downloadName": "みりぃ_20260919朝_02.jpg"
  },
  {
    "src": "/media/live/mily-b132-03-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラへピースのみりぃ",
    "caption": "0:24:15 カメラへピース",
    "downloadName": "みりぃ_20260919朝_03.jpg"
  },
  {
    "src": "/media/live/mily-b132-04-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "青いパーカー姿で笑顔のみりぃ",
    "caption": "0:28:45 青いパーカー姿で笑顔",
    "downloadName": "みりぃ_20260919朝_04.jpg"
  },
  {
    "src": "/media/live/mily-b132-05-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "自己紹介ボードを手にのみりぃ",
    "caption": "0:31:44 自己紹介ボードを手に",
    "downloadName": "みりぃ_20260919朝_05.jpg"
  },
  {
    "src": "/media/live/mily-b132-06-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "頬に手を添えて自己紹介のみりぃ",
    "caption": "0:48:15 頬に手を添えて自己紹介",
    "downloadName": "みりぃ_20260919朝_06.jpg"
  },
  {
    "src": "/media/live/mily-b132-07-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラへ向けた笑顔のみりぃ",
    "caption": "1:01:45 カメラへ向けた笑顔",
    "downloadName": "みりぃ_20260919朝_07.jpg"
  },
  {
    "src": "/media/live/mily-b132-08-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "頬杖をついたポーズのみりぃ",
    "caption": "1:13:45 頬杖をついたポーズ",
    "downloadName": "みりぃ_20260919朝_08.jpg"
  },
  {
    "src": "/media/live/mily-b132-09-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "指でポーズのみりぃ",
    "caption": "1:18:14 指でポーズ",
    "downloadName": "みりぃ_20260919朝_09.jpg"
  },
  {
    "src": "/media/live/mily-b132-10-morning.jpg",
    "width": 640,
    "height": 360,
    "alt": "終盤の笑顔のみりぃ",
    "caption": "1:40:44 終盤の笑顔",
    "downloadName": "みりぃ_20260919朝_10.jpg"
  }
];

export const streamRecap20260919Asa: StreamRecap = {
  "id": "2026-09-19-asa-showroom",
  "date": "2026-09-19",
  "dateLabel": "2026.09.19（土）",
  "theme": "朝の自己紹介と出会い",
  "broadcastLabel": "5:30頃〜 約103分",
  "platformLabel": "SHOWROOM",
  "summary": "早朝の挨拶から手書きの自己紹介、書道やダンスの思い出まで、会話が広がった朝配信。いろいろな時間に配信する理由も話し、出会えた人への感謝を伝えていました。",
  "image": stills[5],
  "gallery": stills,
  "galleryZip": {
    "src": "/media/live/mily-b132-morning-stills.zip",
    "filename": "みりぃ_20260919朝_スクショ10枚.zip",
    "label": "10枚まとめて保存"
  },
  "highlights": [
    {
      "timestamp": "0:09:30",
      "title": "「トマトの栄養素」の由来",
      "body": "名前の「莉子」から「リコピン」へ、そこからファンネームの「トマトの栄養素」につながったことを紹介。初めて来た人にも、自分とルームのことを覚えてもらおうと話していました。"
    },
    {
      "timestamp": "0:17:05",
      "title": "おしゃべりで上がる朝のテンション",
      "body": "朝のゆったりした雰囲気から、会話が弾むにつれて笑顔も増えていきます。「みんなとお話しすると楽しくて」と、配信中に気分が上がることを言葉にしていました。"
    },
    {
      "timestamp": "0:31:28",
      "title": "手書きボードで「みりぃって呼んでね」",
      "body": "前日に書いたという自己紹介ボードを見せながら、名前と呼び名をアピール。ボードをどう飾るかという話でも盛り上がり、笑顔で「よろしくね」と挨拶しました。",
      "clip": {
        "src": "/media/live-clips/mily-b132-11-self-introduction.mp4",
        "poster": "/media/live-clips/mily-b132-11-self-introduction-poster.jpg",
        "width": 640,
        "height": 360,
        "durationSeconds": 5.45,
        "sourceTimestamp": "0:31:28"
      }
    },
    {
      "timestamp": "0:33:42",
      "title": "配信50日目、今から知ってもらいたい",
      "body": "配信を始めて50日目だと話し、初めて来た人へも親しみを込めて呼びかけ。コンテストに向け、毎日配信を続けていることを紹介していました。"
    },
    {
      "timestamp": "0:48:09",
      "title": "いろいろな時間に配信する理由",
      "body": "応援してくれる人と出会いたくて、さまざまな時間帯に配信してみていると説明。最後は「来てくれてありがとう、出会ってくれてありがとう」と、まっすぐ感謝を伝えました。",
      "clip": {
        "src": "/media/live-clips/mily-b132-12-meeting-viewers.mp4",
        "poster": "/media/live-clips/mily-b132-12-meeting-viewers-poster.jpg",
        "width": 640,
        "height": 360,
        "durationSeconds": 15.65,
        "sourceTimestamp": "0:48:09"
      }
    },
    {
      "timestamp": "1:12:10",
      "title": "利き手で続けてきた書道",
      "body": "左利きで書道を続けてきたことも紹介。線の引き方の難しさを身ぶりで示しながら、利き手で上達したかったという思いを話しました。"
    },
    {
      "timestamp": "1:18:05",
      "title": "練習を重ねたダンスの思い出",
      "body": "ダンス未経験ながら何度も練習し、センターに選ばれた思い出を披露。本番での緊張も笑って振り返り、一生懸命取り組んだ経験を語りました。"
    },
    {
      "timestamp": "1:34:30",
      "title": "ラジオの活動も自己紹介",
      "body": "「湘南シーサイドサークル」でラジオの生放送を担当していることも紹介。「ぜひ聞いてください」と、声の活動にも親しんでほしいと呼びかけました。"
    }
  ],
  "goals": [],
  "ranking": [
    buildRankingNote(13, 1)
  ],
  "timeline": [
    {
      "timestamp": "0:00:00",
      "label": "早朝の挨拶"
    },
    {
      "timestamp": "0:09:30",
      "label": "ファンネームの由来"
    },
    {
      "timestamp": "0:17:05",
      "label": "会話でもらう元気"
    },
    {
      "timestamp": "0:20:00",
      "label": "コンテストへ向けて"
    },
    {
      "timestamp": "0:29:20",
      "label": "自己紹介ボードが登場"
    },
    {
      "timestamp": "0:31:28",
      "label": "みりぃって呼んでね"
    },
    {
      "timestamp": "0:33:40",
      "label": "配信50日目の紹介"
    },
    {
      "timestamp": "0:48:09",
      "label": "出会いへのありがとう"
    },
    {
      "timestamp": "1:01:40",
      "label": "呼び名の由来"
    },
    {
      "timestamp": "1:12:10",
      "label": "書道の話"
    },
    {
      "timestamp": "1:18:05",
      "label": "ダンスの思い出"
    },
    {
      "timestamp": "1:25:30",
      "label": "活動への応援を案内"
    },
    {
      "timestamp": "1:34:30",
      "label": "ラジオの活動紹介"
    },
    {
      "timestamp": "1:40:45",
      "label": "ランキングのお礼"
    },
    {
      "timestamp": "1:42:55",
      "label": "次枠の案内と挨拶"
    }
  ],
  "nextNote": "配信時点では、同日14:40から次の配信を行うと案内していました。夜にも会いましょうと呼びかけていました。",
  "sourceLabel": "2026年9月19日 SHOWROOM朝配信（オーナー提供録画・自動文字起こし確認）",
  "verifiedAt": "2026-09-19",
  "transcriptionNote": buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム10枚を掲載しています。",
    extra: "見どころには自己紹介と感謝の短いトーク抜粋2本を掲載しています。録画開始記録5:29:50、実測6204.779秒から表示を5:30頃・約103分に丸めています。保存録画範囲全体を52チャンク・2561区間の自動文字起こしで確認しました。配信全編の完全収録は保証しません。時刻は録画先頭からの目安です。歌の話題や短い口ずさみ候補は確定歌唱曲と区別し、歌詞全文は掲載していません。",
  })
};
