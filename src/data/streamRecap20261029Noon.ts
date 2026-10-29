import type { StreamRecap } from "./streamRecaps.ts";
import { buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20261029Noon: StreamRecap = {
  id: "2026-10-29-noon-showroom",
  date: "2026-10-29",
  dateLabel: "2026.10.29（木）",
  theme: "昼のセミファイナル初日",
  broadcastLabel: "録画開始14:47頃〜 約29分",
  timestampBasis: "asr-clock",
  platformLabel: "SHOWROOM",
  summary: "セミファイナル初日の昼枠。きら星の応援方法やファイナルを目指す思い、足を運んだ人たちへの感謝を、保存された自動文字起こしから非逐語でまとめました。",
  highlights: [
    { timestamp: "14:49頃", title: "昼枠の応援タイム", body: "きら星の応援について呼びかけ、短い昼枠に足を運んだ人たちへお礼を伝えていました。" },
    { timestamp: "14:53頃", title: "ファイナルへの思い", body: "次のステージに進みたい気持ちと、応援への感謝が語られました。" },
    { timestamp: "15:00頃", title: "きら星の送り方", body: "きら星の送り方や切り替えのタイミングについて、リスナーと確認する場面がありました。" },
    { timestamp: "15:04頃", title: "一緒に頑張りたい", body: "セミファイナルの話題と、ここからみんなで頑張りたいという呼びかけがありました。" },
    { timestamp: "15:15頃", title: "お礼と次枠の話", body: "応援へのお礼を伝え、配信時点では同日夜の枠についても案内していました。", relatedLinks: [{ label: "昼枠の画面参考値と欠測", url: "/data-lab/reports/20261029-noon/" }] },
  ],
  goals: [],
  ranking: [],
  timeline: [],
  nextNote: "配信時点では10月29日夜22時頃の枠に言及。確定した予定として扱わず、最新の配信予定を別途確認してください。",
  sourceLabel: "2026年10月29日 昼のSHOWROOM配信（保存ASR88処理区間・画面観測の照合）",
  verifiedAt: "2026-10-29",
  transcriptionNote: buildTranscriptionNote({
    material: "保存された自動文字起こし88処理区間をもとにした非逐語要約です。",
    stills: "静止画は掲載していません。",
    extra: "時刻は自動文字起こしの日本時間の目安で、映像との同期や正式な配信開始・終了時刻は確認していません。原音の全編手動聴取・逐語校正は未実施です。保存映像の実尺は29分17.507秒ですが、全編の無欠落を保証しません。14:47頃は録画処理の開始であり、正式な放送開始時刻ではありません。きら星4,724などの画面参考値は確定終値やイベントptではありません。",
  }),
};
