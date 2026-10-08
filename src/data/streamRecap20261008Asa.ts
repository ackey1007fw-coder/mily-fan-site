import type { StreamRecap } from "./streamRecaps.ts";
import { buildTranscriptionNote } from "./streamRecapRules.ts";

/** 保存録画の確認範囲に限定した短報。会話の詳細は未確認。 */
export const streamRecap20261008Asa: StreamRecap = {
  id: "2026-10-08-morning-showroom",
  date: "2026-10-08", dateLabel: "2026.10.08（木）",
  theme: "朝配信の記録",
  broadcastLabel: "録画開始5:51頃〜 約43分", platformLabel: "SHOWROOM",
  summary: "10月8日朝のSHOWROOM配信の短い記録です。保存録画は約43分で、映像は黒画面、音声が含まれています。会話の詳細は未確認のため、録画で確認できた範囲を記載しています。",
  highlights: [], goals: [], ranking: [], timeline: [], nextNote: "",
  sourceLabel: "2026年10月8日 朝のSHOWROOM配信（保存録画の尺・映像確認）",
  verifiedAt: "2026-10-08",
  transcriptionNote: buildTranscriptionNote({
    material: "保存録画の尺と映像、音声トラックの有無を確認した短い記録です。会話の詳細は未確認です。",
    stills: "静止画は掲載していません。",
    extra: "保存録画は42分37.908秒で、映像は黒画面でした。配信形式は確定していません。録画開始5:51頃・約43分は保存録画の目安で、配信全体の開始・終了を確定していません。会話・歌唱・ランキング・次枠の案内は未確認です。",
  }),
};
