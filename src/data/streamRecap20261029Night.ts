import type { StreamRecap } from "./streamRecaps.ts";
import { buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20261029Night: StreamRecap = {
  id: "2026-10-29-night-showroom",
  date: "2026-10-29",
  dateLabel: "2026.10.29（木）",
  theme: "夜のセミファイナル初日、ありがとう",
  broadcastLabel: "録画開始23:02頃〜 約59分",
  timestampBasis: "asr-clock",
  platformLabel: "SHOWROOM",
  summary: "夜のあいさつから、初日から続く挑戦への思い、終盤のお礼へ。保存された自動文字起こしの冒頭・終盤で確認できた範囲を非逐語で整理しました。同回のきら星の動きは、206の観測点を使った別レポートで振り返れます。",
  highlights: [
    { timestamp: "23:03頃", title: "夜枠へようこそ", body: "集まってくれた人たちへのお礼と、夜の配信のあいさつ。就寝前のひとときを一緒に過ごす話題がありました。" },
    { timestamp: "23:51頃", title: "初日から、ここから", body: "自動文字起こしでは、この日を始まりとして捉え、最後の楽曲につなげる趣旨の話が記録されています。曲名や逐語発言は未確定のため掲載しません。", relatedLinks: [{ label: "206点のきら星・4つのグラフで振り返る", url: "/data-lab/reports/20261029-night/" }] },
  ],
  goals: [], ranking: [], timeline: [],
  nextNote: "配信時点の予定案内と、現在の確定スケジュールは別です。最新予定は本人の案内をご確認ください。",
  sourceLabel: "2026年10月29日 夜のSHOWROOM配信（保存ASR冒頭・終盤の確認、匿名画面観測の照合）",
  verifiedAt: "2026-10-30",
  transcriptionNote: buildTranscriptionNote({
    material: "保存された自動文字起こしの冒頭・終盤をもとにした非逐語要約です。",
    stills: "静止画は実映像が未確認のため未掲載で、短尺も原音の確認待ちです。",
    extra: "見どころ時刻は自動文字起こしに付いた日本時間の目安で、録画内の経過時刻ではありません。00:00は翌10月30日です。映像との同期や正式な配信開始・終了時刻は確認していません。原音の手動聴取・逐語校正・全編無欠落は未確認です。保存映像約58分41秒は正式な放送尺ではありません。きら星3,984は23:57:09の画面参考値であり、確定終値やイベントptではありません。総訪問・コメント・新規フォローは検証できず、0として扱いません。",
  }),
};
