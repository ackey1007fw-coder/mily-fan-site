import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE_WITHOUT_RANGE } from "./streamRecapRules.ts";

const gallery = [
  {
    "src": "/media/live/mily-b194-01-20261006-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "目線を下に向けるみりぃ",
    "caption": "0:00:30｜目線を下に向けるみりぃ",
    "downloadName": "mily-b194-01-20261006-morning-still.jpg"
  },
  {
    "src": "/media/live/mily-b194-02-20261006-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "カメラへ笑顔を向けるみりぃ",
    "caption": "0:11:00｜カメラへ笑顔を向けるみりぃ",
    "downloadName": "mily-b194-02-20261006-morning-still.jpg"
  },
  {
    "src": "/media/live/mily-b194-03-20261006-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "顔の前に手を添えるみりぃ",
    "caption": "0:40:00｜顔の前に手を添えるみりぃ",
    "downloadName": "mily-b194-03-20261006-morning-still.jpg"
  }
];

export const streamRecap20261006Asa: StreamRecap = {
  "id": "2026-10-06-morning-showroom",
  "date": "2026-10-06",
  "dateLabel": "2026.10.06（火）",
  "theme": "朝の投票報告と応援へのお礼",
  "broadcastLabel": "録画開始05:40頃〜 約41分",
  "platformLabel": "SHOWROOM",
  "summary": "朝の挨拶から、投票報告へのお礼へ。投票日数の表示を確認し、キラキラ星での応援やアバター権の話題を挟みながらコメントとやり取りします。終盤は読み上げと感謝、一日の挨拶。保存録画は約41分。当日の実写真3枚と、自動文字起こしに基づく要約です。",
  "galleryNote": "当日の保存録画から選んだ実写真3枚です。写真の時刻は録画の先頭からの目安で、写っている表情・仕草のみを紹介しています。",
  "highlights": [
    {
      "timestamp": "0:01:23",
      "title": "投票日数の表示を確認",
      "body": "朝の挨拶を交わしながら、投票の日数表示が変わっているかを確認。コメントを受け、以前の表示が残っていたことについてやり取りしました。"
    },
    {
      "timestamp": "0:03:49",
      "title": "投票報告へのお礼",
      "body": "投票完了の報告を受け、来てくれたことへのお礼を伝えます。投票の話題と朝の挨拶を挟みながら、コメントへの応答が続きました。"
    },
    {
      "timestamp": "0:11:10",
      "title": "キラキラ星での応援を案内",
      "body": "キラキラ星での応援に触れ、協力を呼びかけました。コメントへの応答を挟みながら、応援へのお礼が続きます。"
    },
    {
      "timestamp": "0:12:56",
      "title": "アバター権への話題",
      "body": "アバター権に近づいていることを話し、コメントに応答。後半にも同じ話題へ戻りました。"
    },
    {
      "timestamp": "0:30:25",
      "title": "応援への感謝を伝える",
      "body": "応援してくれる人たちへの感謝を伝えました。来てくれた人へのお礼を挟みながら、コメントとのやり取りが続きます。"
    },
    {
      "timestamp": "0:38:09",
      "title": "終盤の読み上げとお礼",
      "body": "朝枠の終わりに向けてランキングの読み上げへ。来訪や応援へのお礼を伝えました。"
    },
    {
      "timestamp": "0:40:44",
      "title": "一日の挨拶と次枠への案内",
      "body": "今日も一日元気に過ごそうと挨拶し、午後の枠へ案内して締めくくられました。"
    }
  ],
  "goals": [],
  "ranking": [RANKING_NOTE_WITHOUT_RANGE],
  "timeline": [
    {
      "timestamp": "0:00:33",
      "label": "朝の挨拶と来訪へのお礼"
    },
    {
      "timestamp": "0:01:23",
      "label": "投票日数の表示確認"
    },
    {
      "timestamp": "0:03:49",
      "label": "投票報告への応答"
    },
    {
      "timestamp": "0:11:10",
      "label": "キラキラ星での応援案内"
    },
    {
      "timestamp": "0:12:56",
      "label": "アバター権の話題"
    },
    {
      "timestamp": "0:29:00",
      "label": "アバター権の話題へ再び"
    },
    {
      "timestamp": "0:30:25",
      "label": "応援への感謝"
    },
    {
      "timestamp": "0:38:09",
      "label": "終盤の読み上げとお礼"
    },
    {
      "timestamp": "0:40:44",
      "label": "一日の挨拶"
    },
    {
      "timestamp": "0:41:12",
      "label": "午後枠への案内"
    }
  ],
  "nextNote": "",
  "sourceLabel": "2026年10月6日 朝のSHOWROOM配信（保存録画・自動文字起こし）",
  "verifiedAt": "2026-10-07",
  gallery, image: gallery[1],
  transcriptionNote: buildTranscriptionNote({ material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は当日の保存録画の実写真3枚です。", extra: "保存録画21区間の自動文字起こしをもとにした要約です。全文の実音聴取・逐語校正は未完了です。時刻は録画内の目安です。約41分は保存録画のコンテナ参考値41分28.619秒を丸めた表記で、配信全体の尺ではありません。審査条件・ポイント・獲得結果は確定していません。当時の午後枠案内から現在の予定は生成しません。" })
};
