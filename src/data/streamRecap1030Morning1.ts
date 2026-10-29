import type { StreamRecap } from "./streamRecaps.ts";
import { buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap1030Morning1: StreamRecap = {
  id: "2026-10-30-morning1-showroom",
  date: "2026-10-30",
  dateLabel: "2026.10.30（金）",
  theme: "朝1枠目、きら星の応援",
  broadcastLabel: "画面観測5:00〜5:17（配信開始未確認）",
  timestampBasis: "asr-clock",
  platformLabel: "SHOWROOM",
  summary: "早朝の1枠目。きら星の応援への呼びかけ、通常配信で続ける話、6時の次枠案内を、保存された自動文字起こしの冒頭・終盤から整理しました。同回の数値は5:17時点までの途中参考値です。",
  highlights: [
    { timestamp: "5:01頃", title: "きら星の応援を呼びかけ", body: "自動文字起こしには、朝のあいさつと、きら星での応援を呼びかける話が記録されています。" },
    { timestamp: "5:02頃", title: "通常配信で続けることに", body: "きっかけ配信を意図していたものの、通常配信になっていることを話し、そのまま続ける趣旨のやり取りが記録されています。原因は未確認です。" },
    { timestamp: "5:28頃", title: "セミファイナルの応援", body: "セミファイナルでの応援と、きら星についてあらためて呼びかける話が記録されています。順位目標や発言の細部は確定していません。" },
    { timestamp: "5:30頃", title: "お礼と6時の次枠案内", body: "終盤には応援へのお礼と、6時の次枠への案内が記録されています。次枠とは別の配信記録として整理しています。", relatedLinks: [{ label: "朝1枠目の100観測点と欠測を見る", url: "/data-lab/reports/20261030-morning1/" }] },
  ],
  goals: [], ranking: [], timeline: [],
  nextNote: "配信時点では同日6時の次枠に言及。現在の予定や実施確認とは別です。",
  sourceLabel: "2026年10月30日 朝1枠目のSHOWROOM配信（保存ASR冒頭・終盤と匿名画面観測の照合）",
  verifiedAt: "2026-10-30",
  transcriptionNote: buildTranscriptionNote({
    material: "保存された自動文字起こしの冒頭・終盤を確認した、非逐語の暫定要約です。",
    stills: "静止画は掲載していません。",
    extra: "見どころの時刻は自動文字起こしに記録された日本時間の目安で、映像との同期や正式な配信開始・終了時刻は確認していません。原音の手動聴取・逐語校正は未実施です。きっかけ配信を意図して通常配信で続ける話が記録されていますが、操作履歴・原因・機能の切替条件は未確認です。6時の次枠案内は配信時点の発言で、実施確認や最新予定ではありません。きら星1,898・総訪問表示129・コメント表示77は5:17:50時点の途中参考値で、確定終値・実人数・イベントptではありません。5:18頃に数値の読取りエラーがあり、終盤の数値は未取得です。録画処理メタデータでは5:31頃に保存成功ですが、映像の無欠落を保証するものではありません。",
  }),
};
