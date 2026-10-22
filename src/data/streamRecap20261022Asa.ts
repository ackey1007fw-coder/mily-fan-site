import type { StreamRecap } from "./streamRecaps.ts";
import { buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20261022Asa: StreamRecap = {
  id: "2026-10-22-morning-showroom", date: "2026-10-22", dateLabel: "2026.10.22（木）",
  theme: "朝の挨拶と一日へのエール", broadcastLabel: "録画開始06:00頃〜 約25分", platformLabel: "SHOWROOM",
  summary: "朝のラジオ配信で挨拶を交わし、飲み物の話題などで交流。最後は来てくれた人へのお礼と、一日へのエールで締めくくりました。",
  highlights: [
    { timestamp: "0:00:00", title: "朝の挨拶", body: "来てくれた人を迎えながら、ラジオ形式で朝の挨拶を交わしました。" },
    { timestamp: "0:09:00", title: "飲み物の話題", body: "カフェの甘い飲み物などを話題に、やり取りが続きました。商品名は確定していません。" },
    { timestamp: "0:24:00", title: "一日へのエール", body: "朝から来てくれた人へ感謝を伝え、一日へのエールとともに締めくくりました。", relatedLinks: [{ label: "この朝の記録と確認範囲", url: "/data-lab/reports/20261022-morning/" }] },
  ],
  goals: [], ranking: [],
  timeline: [{ timestamp: "0:00:00", label: "朝の挨拶" }, { timestamp: "0:09:00", label: "飲み物の話題" }, { timestamp: "0:24:00", label: "一日へのエール" }],
  nextNote: "",
  sourceLabel: "2026年10月22日 朝のSHOWROOM配信（同日の公開済み配信記録・自動文字起こし確認結果参照）", verifiedAt: "2026-10-22",
  transcriptionNote: buildTranscriptionNote({ material: "同じ朝配信の公開済み記録と、保存自動文字起こしの確認結果をもとに整理しています。", stills: "静止画は今回追加しておらず、動画も追加していません。",
    extra: "保存実尺24分55.124秒・自動文字起こし75処理区間の既存確認結果を参照しています。時刻は朝の公開記録にある概時刻から示した録画内の目安です。今回の登録にあたり原音の手動聴取・全編視聴・逐語校正は未実施です。数値9指標は未取得で、0として補っていません。" }),
};
