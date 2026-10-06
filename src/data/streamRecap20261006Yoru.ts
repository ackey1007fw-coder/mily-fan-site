import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE_WITHOUT_RANGE } from "./streamRecapRules.ts";

export const streamRecap20261006Yoru: StreamRecap = {
  "id": "2026-10-06-night-showroom",
  "date": "2026-10-06",
  "dateLabel": "2026.10.06（火）",
  "theme": "夜の応援とサイコロの会話",
  "broadcastLabel": "録画開始21:30頃〜 約48分",
  "platformLabel": "SHOWROOM",
  "summary": "キラキラや投票報告へのお礼から、アバター、ラジオの交通情報、サイコロの数字を使った言葉遊びへ。終盤はランキングとおやすみの挨拶で締めくくりました。保存録画は約48分です。",
  "highlights": [
    {
      "timestamp": "0:00:13",
      "title": "夜の挨拶",
      "body": "保存録画の冒頭では、来てくれた人へ挨拶を伝えました。"
    },
    {
      "timestamp": "0:01:17",
      "title": "キラキラへのお礼と呼びかけ",
      "body": "昼の応援に触れ、まだの人へキラキラでの協力を呼びかけました。来てくれた人や、応援を届けてくれた人へお礼を重ねました。"
    },
    {
      "timestamp": "0:03:26",
      "title": "投票報告へのお礼",
      "body": "投票したという報告を受け、お礼を伝えました。その後も投票報告が届き、コメントに応じてお礼を返しました。"
    },
    {
      "timestamp": "0:06:44",
      "title": "アバター姿と次のアバター",
      "body": "自身のアバターを着けて来てくれたことにお礼を伝えました。終盤には、次のアバターをどんなものにするかも話しました。"
    },
    {
      "timestamp": "0:16:00",
      "title": "コメントとのおしゃべり",
      "body": "面白いというコメントに応じ、みんなに笑ってほしいと話しました。"
    },
    {
      "timestamp": "0:29:48",
      "title": "ラジオの交通情報の話",
      "body": "ラジオで交通情報を読むことに触れ、コメントとその日の話題をやりとりしました。"
    },
    {
      "timestamp": "0:39:56",
      "title": "サイコロの数字で言葉遊び",
      "body": "サイコロの数字に合わせて言葉を考えるやりとりが続きました。数字が変わるたび、意味を考えながらコメントとおしゃべりしました。"
    },
    {
      "timestamp": "0:46:08",
      "title": "ランキングとおやすみの挨拶",
      "body": "終盤はランキングを読み上げ、応援へのお礼を伝えました。翌日の予定を改めて案内することに触れ、おやすみの挨拶で締めくくりました。"
    }
  ],
  "goals": [],
  "ranking": [
    RANKING_NOTE_WITHOUT_RANGE
  ],
  "timeline": [
    {
      "timestamp": "0:00:13",
      "label": "夜の挨拶"
    },
    {
      "timestamp": "0:01:17",
      "label": "キラキラへのお礼と呼びかけ"
    },
    {
      "timestamp": "0:03:26",
      "label": "投票報告へのお礼"
    },
    {
      "timestamp": "0:06:44",
      "label": "アバター姿と次のアバター"
    },
    {
      "timestamp": "0:16:00",
      "label": "コメントとのおしゃべり"
    },
    {
      "timestamp": "0:29:48",
      "label": "ラジオの交通情報の話"
    },
    {
      "timestamp": "0:36:06",
      "label": "翌朝の枠についての相談"
    },
    {
      "timestamp": "0:39:56",
      "label": "サイコロの数字で言葉遊び"
    },
    {
      "timestamp": "0:45:34",
      "label": "次のアバターの話"
    },
    {
      "timestamp": "0:46:08",
      "label": "ランキングとおやすみの挨拶"
    },
    {
      "timestamp": "0:47:14",
      "label": "翌日の案内とおやすみ"
    }
  ],
  "nextNote": "配信時点では翌日の予定を改めて案内する話がありました。現在の予定は配信予定欄をご確認ください。",
  "sourceLabel": "2026年10月6日 夜のSHOWROOM音声配信（保存録画・自動文字起こし）",
  "verifiedAt": "2026-10-07",
  transcriptionNote: buildTranscriptionNote({ material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は掲載していません。音声配信の会話を中心にまとめています。", extra: "時刻は自動文字起こしの目安です。曲名は未確認です。約48分は保存録画のコンテナ参考値47分38.333秒を丸めた表記で、配信全体の尺ではありません。翌日の案内から現在の予定は生成しません。" })
};
