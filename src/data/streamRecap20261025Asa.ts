import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20261025Asa: StreamRecap = {
  id: "2026-10-25-morning-showroom",
  date: "2026-10-25",
  dateLabel: "2026.10.25（日）",
  theme: "朝のメイクとエール",
  broadcastLabel: "録画開始5:37頃〜 約63分",
  platformLabel: "SHOWROOM",
  summary: "朝の支度やメイクをしながら、集まった人たちとおしゃべりした配信。次の審査や応援の話題にも触れ、ラジオへ向かう前に感謝を伝えました。",
  highlights: [
    { timestamp: "0:00:02", title: "朝の挨拶と配信準備", body: "朝早くから集まった人たちへ挨拶し、カメラや配信の準備を進めました。" },
    { timestamp: "0:03:04", title: "肌寒い朝のおしゃべり", body: "冷え込む朝の話題を交え、コメントを通じてやり取りしました。" },
    { timestamp: "0:15:50", title: "メイクと表現の話", body: "メイクを進めながら、舞台や表現への関心にも話が広がりました。" },
    { timestamp: "0:35:50", title: "次の審査を見据えて", body: "コンテストの次の審査や投票について、視聴者と話しました。" },
    { timestamp: "0:59:58", title: "ラジオに向かう前に", body: "この後のラジオのお仕事に触れながら、出発前の時間を過ごしました。" },
    { timestamp: "1:02:00", title: "朝のありがとう", body: "集まった人たちへ感謝を伝え、朝の配信を締めくくりました。" },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:00:02", label: "朝の挨拶と準備" },
    { timestamp: "0:03:04", label: "肌寒い朝の話" },
    { timestamp: "0:15:50", label: "メイク・表現の話題" },
    { timestamp: "0:35:50", label: "審査・投票について" },
    { timestamp: "0:59:58", label: "ラジオへ向かう前" },
    { timestamp: "1:02:00", label: "お礼と締めくくり" },
  ],
  nextNote: "",
  sourceLabel: "2026年10月25日 朝のSHOWROOM配信（保存録画メタデータ・自動文字起こし・通常閲覧画面参考値）",
  verifiedAt: "2026-10-25",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra: "録画処理は5:37:35〜6:41:50、保存映像の実尺は62分53.772秒です。自動文字起こしは189処理チャンク、6:40:26まで。話題位置は録画開始基準の目安で、自動認識には誤りがあり逐語引用・全編手動聴取・逐語校正はしていません。通信エラー記録があり、全尺デコード・録画の完全な連続性・正式な配信開始終了は未確認です。通常閲覧画面の9指標は6:40:46に更新された最後の有効な参考値で、配信終了時の確定値や正式イベントptではありません。停止した画面の再保存を新しい実測と数えていません。",
  }),
};
