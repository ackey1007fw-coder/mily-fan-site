import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap1109Morning: StreamRecap = {
  id: "2026-11-09-morning-showroom",
  date: "2026-11-09",
  dateLabel: "2026.11.09（月）",
  theme: "朝のごあいさつと出会い",
  broadcastLabel: "録画開始6:00頃〜 約36分",
  platformLabel: "SHOWROOM",
  summary: "寒い朝のごあいさつから始まった11月9日の配信。より多くの人に見つけてもらうため、時間帯を試している話がありました。セミファイナルを終えて結果を待つ中で、応援への感謝を伝えました。",
  highlights: [
    { timestamp: "0:15:12", title: "新しい出会いのきっかけ", body: "より多くの人に配信を見つけてもらうため、時間帯を試していると話しました。" },
    { timestamp: "0:19:34", title: "応援への感謝と自己紹介", body: "セミファイナルを終えて結果を待つ時期として、応援への感謝を伝え、自己紹介をしました。" },
    { timestamp: "0:33:35", title: "朝の来訪へのお礼", body: "配信に来てくれた人たちへ感謝を伝え、朝の見送りをしました。" },
    { timestamp: "0:35:45", title: "夜の配信案内", body: "夜の配信は時刻未定で、決まり次第ファンルームとSNSで知らせると案内しました。" },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:15:12", label: "配信の時間帯と新しい出会い" },
    { timestamp: "0:19:34", label: "セミファイナル後の感謝と自己紹介" },
    { timestamp: "0:33:35", label: "来訪へのお礼と朝の見送り" },
    { timestamp: "0:35:45", label: "夜枠の告知方法" },
  ],
  nextNote: "配信時点では、同日夜の配信時刻は未定で、決まり次第ファンルームとSNSで知らせると案内していました。",
  sourceLabel: "2026年11月9日 朝のSHOWROOM配信（保存録画の自動文字起こし）",
  verifiedAt: "2026-11-09",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra: "本文は自動文字起こしに基づく要約で、原音の手動聴取・逐語校正は未実施です。時刻は録画先頭からの目安です。保存録画の実尺は36分24.640秒で、録画開始から保存処理の終了までの時計上の幅とは約49秒異なります。録画の全区間の連続性は未確認です。曲名は未確認のため掲載していません。写真・短尺動画は検品が完了するまで保留しています。",
  }),
};
