import type { StreamRecap } from "./streamRecaps.ts";
import { buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap1030Morning2: StreamRecap = {
  id: "2026-10-30-morning2-showroom",
  date: "2026-10-30",
  dateLabel: "2026.10.30（金）",
  theme: "朝2枠目、ファイナルへ",
  broadcastLabel: "画面観測6:02〜6:08（配信開始未確認）",
  timestampBasis: "asr-clock",
  platformLabel: "SHOWROOM",
  summary: "6時台の朝2枠目。きら星や投票の応援への感謝と、ファイナルへ向けた呼びかけを、保存された自動文字起こしの冒頭100秒から整理しました。数値は6:08時点までの途中参考値です。",
  highlights: [
    { timestamp: "6:00頃", title: "朝のきら星の応援", body: "保存された自動文字起こしの冒頭には、きら星での応援を呼びかけ、集まった応援に感謝するやり取りが記録されています。" },
    { timestamp: "6:02頃", title: "ファイナルへ向けた呼びかけ", body: "ファイナルへ進みたいという思いと、投票へのお礼を伝える話が記録されています。日程など聞き取りが不明瞭な情報は省いています。", relatedLinks: [{ label: "朝2枠目の40観測点と欠測を見る", url: "/data-lab/reports/20261030-morning2/" }] },
  ],
  goals: [], ranking: [], timeline: [], nextNote: "",
  sourceLabel: "2026年10月30日 朝2枠目のSHOWROOM配信（保存ASR冒頭100秒と匿名画面観測の照合）",
  verifiedAt: "2026-10-30",
  transcriptionNote: buildTranscriptionNote({ material: "保存された自動文字起こしの冒頭100秒をもとにした、非逐語の暫定要約です。", stills: "静止画は掲載していません。", extra: "見どころの時刻は自動文字起こしに付いた日本時間の目安です。原音の手動聴取・逐語校正・映像との同期は未確認です。日程や機能説明の聞き取りは不明瞭なため掲載していません。数値は6:08:50時点の途中画面参考値で、確定終値・実人数・イベントptではありません。その後の数値と終了確認は未取得です。録画は異常終了した6つの非ゼロ断片が残っていますが、各断片の実尺・映像の無欠落・配信全体の連続性は未確認です。朝1枠目や前日夜とは合算していません。" }),
};
