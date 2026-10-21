import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, buildRankingNote } from "./streamRecapRules.ts";

export const streamRecap20261020Night: StreamRecap = {
  "id": "2026-10-20-night-showroom",
  "date": "2026-10-20",
  "dateLabel": "2026.10.20（火）",
  "theme": "夜の出会いと決意",
  "platformLabel": "SHOWROOM",
  "summary": "新しい時間帯での出会いを喜び、好きな歌を届けた夜。セミファイナルを越えてファイナルへ進みたいという思いを話し、最後は応援への感謝を伝えました。",
  "highlights": [
    {
      "timestamp": "0:14:09",
      "title": "好きな曲で歌の時間へ",
      "body": "何度歌っても飽きないほど好きな曲の話をして、歌の時間へ。初めて訪れた人にも自己紹介し、見つけてくれたことに感謝しました。"
    },
    {
      "timestamp": "0:52:28",
      "title": "新しい時間帯の出会い",
      "body": "この時間帯での配信を試し、新しい出会いを楽しみにしていると話しました。訪れた人やフォローしてくれた人へお礼を伝えました。"
    },
    {
      "timestamp": "1:03:23",
      "title": "ファイナルへ進みたい",
      "body": "セミファイナルを乗り越え、ファイナルへ進みたいという目標を話しました。"
    },
    {
      "timestamp": "3:11:06",
      "title": "思いを歌に重ねて",
      "body": "自分を奮い立たせ、今の気持ちを伝えられる曲として歌を紹介しました。ファイナルへ進む決意と、これからも見ていてほしいという思いを話しました。"
    },
    {
      "timestamp": "3:21:10",
      "title": "投票とSNSの案内",
      "body": "セミファイナルの応援を呼びかけ、投票を忘れないためにSNSをフォローしてほしいと案内しました。"
    },
    {
      "timestamp": "3:25:02",
      "title": "ランキングと締めの感謝",
      "body": "ランキングを読み上げながら、コメントや応援への感謝を伝えました。長い時間を一緒に過ごし、話を聞いてくれた人たちにお礼を伝えて締めくくりました。",
      "relatedLinks": [
        {
          "label": "MILY SIGNAL・この回の観測と欠測",
          "url": "/data-lab/reports/20261020-night/"
        }
      ]
    }
  ],
  "goals": [
    {
      "item": "コンテスト",
      "target": "ファイナル進出",
      "statusThen": "応援を呼びかけ"
    }
  ],
  "timeline": [
    {
      "timestamp": "0:14:09",
      "label": "好きな曲で歌の時間へ"
    },
    {
      "timestamp": "0:52:28",
      "label": "新しい時間帯の出会い"
    },
    {
      "timestamp": "1:03:23",
      "label": "ファイナルへ進みたい"
    },
    {
      "timestamp": "3:11:06",
      "label": "思いを歌に重ねて"
    },
    {
      "timestamp": "3:21:10",
      "label": "投票とSNSの案内"
    },
    {
      "timestamp": "3:25:02",
      "label": "ランキングと締めの感謝"
    }
  ],
  "nextNote": "",
  "sourceLabel": "2026年10月20日 夜のSHOWROOM配信（保存済み自動文字起こし参照）",
  "verifiedAt": "2026-10-21",
  "broadcastLabel": "録画開始18:01頃〜 約209分",
  "ranking": [buildRankingNote()],
  transcriptionNote: buildTranscriptionNote({material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は掲載していません。", extra: "録画2本の保存尺は合計約209分18秒。自動文字起こし628処理区間のうち、掲載する話題の区間を照合しました。通信エラー・再接続の記録があり、全区間の連続性は未確認です。時刻は2本の保存メディアを順番に並べた経過の目安です。実際の時計時刻とは区別し、連続収録を保証しません。同一配信の録画2本に対応する自動文字起こしのうち、掲載話題に関係する区間を照合しました。原音の手動聴取・動画の視聴は行っていません。録画処理時刻と配信開始時刻は別で、分割間を含む全区間の連続性は未検証です。歌唱曲名と次枠時刻は確定していません。匿名の数値と取得範囲はデータラボへ掲載しています。"}),
};
