import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE_WITHOUT_RANGE } from "./streamRecapRules.ts";

export const streamRecap20261006Day: StreamRecap = {
  "id": "2026-10-06-noon-showroom",
  "date": "2026-10-06",
  "dateLabel": "2026.10.06（火）",
  "theme": "昼の応援とアバター権の話題",
  "broadcastLabel": "録画開始14:40頃〜 約42分",
  "platformLabel": "SHOWROOM",
  "summary": "時間変更への応答、キラキラと投票報告へのお礼、アバター権の話題をまとめました。終盤はランキングの読み上げと挨拶へ。保存録画は約42分です。",
  "highlights": [
    {
      "timestamp": "0:00:23",
      "title": "こんにちはの挨拶から",
      "body": "来てくれた人への挨拶と、キラキラへのお礼から昼の枠が始まりました。"
    },
    {
      "timestamp": "0:09:06",
      "title": "朝の時間変更について",
      "body": "変更に気づかなかったというコメントに応答し、朝に待ってくれた人へお礼とお詫びを伝えました。"
    },
    {
      "timestamp": "0:18:43",
      "title": "キラキラへの協力を呼びかけ",
      "body": "午前のキラキラについて声をかけ、その後も応援へのお礼を重ねました。"
    },
    {
      "timestamp": "0:20:58",
      "title": "アバター権の話題に",
      "body": "アバター権に届いたと話し、応援してくれた人たちへのお礼を伝えました。"
    },
    {
      "timestamp": "0:31:04",
      "title": "投票報告へのお礼",
      "body": "投票したという報告にも、お礼を伝えました。"
    },
    {
      "timestamp": "0:38:31",
      "title": "ランキングと申請の話",
      "body": "終盤にはランキングを読み上げ、アバター権の申請にも触れました。"
    },
    {
      "timestamp": "0:41:38",
      "title": "夜枠の案内に触れて締めくくり",
      "body": "夜枠の案内に触れ、お礼と挨拶で昼の枠を締めくくりました。"
    }
  ],
  "goals": [],
  "ranking": [
    RANKING_NOTE_WITHOUT_RANGE
  ],
  "timeline": [
    {
      "timestamp": "0:00:23",
      "label": "こんにちはの挨拶から"
    },
    {
      "timestamp": "0:09:06",
      "label": "朝の時間変更について"
    },
    {
      "timestamp": "0:18:43",
      "label": "キラキラへの協力を呼びかけ"
    },
    {
      "timestamp": "0:20:58",
      "label": "アバター権の話題に"
    },
    {
      "timestamp": "0:31:04",
      "label": "投票報告へのお礼"
    },
    {
      "timestamp": "0:38:31",
      "label": "ランキングと申請の話"
    },
    {
      "timestamp": "0:41:38",
      "label": "夜枠の案内に触れて締めくくり"
    }
  ],
  "nextNote": "配信時点では夜枠の案内がありました。現在の予定は配信予定欄をご確認ください。",
  "sourceLabel": "2026年10月6日 昼のSHOWROOM配信（保存録画・自動文字起こし）",
  "verifiedAt": "2026-10-07",
  transcriptionNote: buildTranscriptionNote({ material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "保存素材の30秒・21分・40分付近は黒画面で、人物写真を得られなかったため静止画は掲載していません。", extra: "時刻は自動文字起こしの目安です。全編の手動聴取・曲名確認は未完了です。約42分は保存録画のコンテナ参考値42分6.253秒を丸めた表記で、配信全体の尺ではありません。アバター権は本人発言の要約です。" })
};
