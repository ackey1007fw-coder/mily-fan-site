import type { StreamRecap } from "./streamRecaps.ts";
import { buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20261024Noon: StreamRecap = {
  id: "2026-10-24-noon-showroom",
  date: "2026-10-24",
  dateLabel: "2026.10.24（土）",
  theme: "昼の配信と応援の記録",
  broadcastLabel: "画面観測14:45〜16:01（配信開始未確認）",
  platformLabel: "SHOWROOM",
  summary: "10月24日昼のSHOWROOM配信。保存された通常閲覧画面の9指標と時刻付き観測を照合しました。本人の発言内容と正式な開始時刻はまだ未確認です。",
  highlights: [],
  goals: [],
  ranking: [],
  timeline: [],
  nextNote: "",
  sourceLabel: "2026年10月24日 昼のSHOWROOM配信（保存された通常閲覧画面の9指標参照）",
  verifiedAt: "2026-10-24",
  transcriptionNote: buildTranscriptionNote({
    material: "保存された通常閲覧画面の9指標と時刻付き観測をもとに整理しています。録画内容・自動文字起こしは未照合です。",
    stills: "静止画は掲載していません。",
    extra: "14:45:39に最初の画面観測、16:01:00に最後の有効な9指標、16:01:25に3回目のオフライン表示を確認しました。正式な配信開始時刻・保存映像の完全な連続性は未確認です。16:01:00のきら星3,904・総訪問表示391・コメント461は正式イベントptや配信終了時の確定数値ではありません。",
  }),
};
