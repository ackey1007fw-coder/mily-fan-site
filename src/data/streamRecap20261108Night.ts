import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20261108Night: StreamRecap = {
  id: "2026-11-08-night-showroom",
  date: "2026-11-08",
  dateLabel: "2026.11.08（日）",
  theme: "夜は配信100日のありがとう",
  broadcastLabel: "録画開始22:32頃〜 約60分",
  platformLabel: "SHOWROOM",
  summary: "11月8日夜は、セミファイナルの応援への感謝と、配信100日を記念する交流が中心でした。投票期間を支えてくれた人たちへお礼を伝え、後半はアバターを揃えた記念撮影を呼びかけました。",
  highlights: [
    { timestamp: "0:03:00", title: "応援と投票への感謝", body: "結果がまだわからない中で、セミファイナル期間を振り返り、応援と投票への感謝を伝えました。" },
    { timestamp: "0:10:20", title: "コメントへの思い", body: "すべてに個別返信する時間は取れなくても、寄せられたコメントを見ているという話がありました。" },
    { timestamp: "0:34:40", title: "配信100日の記念企画", body: "配信100日の記念として、アバターを揃えた記念撮影を呼びかけました。トマトのファンマークを取り入れたアバターも話題になりました。" },
    { timestamp: "0:53:20", title: "記念写真の声掛け", body: "記念撮影に向けて、ポーズや撮影のタイミングを呼びかけました。" },
    { timestamp: "0:57:14", title: "これからも楽しい時間を", body: "これからも皆で配信を楽しみたいという思いと、感謝を伝えました。" },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:03:00", label: "セミファイナルの応援への感謝" },
    { timestamp: "0:10:20", label: "寄せられたコメントの話" },
    { timestamp: "0:34:40", label: "配信100日の記念企画" },
    { timestamp: "0:53:20", label: "記念撮影への呼びかけ" },
    { timestamp: "0:57:14", label: "これからの配信への思い" },
  ],
  nextNote: "配信時点では、翌11月9日6:00〜6:30の朝配信を案内していました。",
  sourceLabel: "2026年11月8日 夜のSHOWROOM配信（保存録画の自動文字起こし）",
  verifiedAt: "2026-11-09",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra: "本文は自動文字起こしに基づく要約で、原音の手動聴取・逐語校正は未実施です。時刻は録画先頭からの目安です。録画実尺は約60分で、処理開始から終了までの時計上の幅とは約51秒異なります。全区間の連続性は未確認です。配信100日は本人の説明に基づき、日付からの独立した検算はしていません。曲名は未確認のため掲載していません。写真・短尺動画は確認と掲載承認が済むまで保留しています。",
  }),
};
