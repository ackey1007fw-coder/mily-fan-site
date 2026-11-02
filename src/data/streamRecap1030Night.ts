import type { StreamRecap } from "./streamRecaps.ts";
import { buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap1030Night: StreamRecap = {
  id: "2026-10-30-night-showroom",
  date: "2026-10-30",
  dateLabel: "2026.10.30（金）",
  theme: "夜の配信、残せた記録",
  broadcastLabel: "画面観測22:32〜22:33（配信開始未確認）",
  platformLabel: "SHOWROOM",
  summary: "夜枠の短い録画断片で、カメラの方を向いて笑顔になる場面を確認しました。きら星の記録は22:33時点までの300です。配信全体の内容や最終結果は確認できていません。",
  highlights: [
    { timestamp: "0:00:14", title: "カメラに向けた笑顔", body: "残っていた短い録画断片から、笑顔の場面を確認しました。時刻はこの断片の先頭からの目安で、配信開始からの経過時間ではありません。", relatedLinks: [{ label: "夜枠の8観測点と欠測を見る", url: "/data-lab/reports/20261030-night/" }] },
  ],
  goals: [], ranking: [], timeline: [], nextNote: "",
  sourceLabel: "2026年10月30日 夜のSHOWROOM配信（匿名画面観測と部分録画の静止画確認）",
  verifiedAt: "2026-10-31",
  transcriptionNote: buildTranscriptionNote({
    material: "匿名カウンターの保存記録と、残存録画断片から取り出した6枚の静止画を確認して整理しています。発話内容の要約ではありません。",
    stills: "静止画は掲載していません。",
    extra: "原音の手動聴取・発話内容・全編の映像確認は未実施です。見どころの時刻は途中から残った録画断片の先頭を基準にしており、放送開始時刻との同期は未確認です。数値は22:33:29時点の途中画面参考値で、確定終値・実人数・イベントptではありません。以後の数値・配信終了時刻は未取得です。朝1枠目・朝2枠目と合算していません。",
  }),
};
