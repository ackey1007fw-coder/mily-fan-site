import type { StreamRecap } from "./streamRecaps.ts";
import { buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20261029Asa: StreamRecap = {
  id: "2026-10-29-morning-showroom",
  date: "2026-10-29",
  dateLabel: "2026.10.29（木）",
  theme: "朝、歌で始める初日",
  broadcastLabel: "視聴メモ6:00頃〜（終了未確認）",
  timestampBasis: "memo-clock",
  platformLabel: "SHOWROOM",
  summary: "セミファイナル初日の朝、寒い朝の挨拶から始まった歌枠です。視聴メモには5曲と、初日の投票への呼びかけ、100キラへの感謝が記録されています。",
  highlights: [
    { timestamp: "6:00頃", title: "セミファイナル初日の朝", body: "寒い朝の挨拶とともに、ガチイベント初枠への意気込みを話しました。初日の投票への協力も呼びかけています。" },
    { timestamp: "6:03頃", title: "私、アイドル宣言", body: "視聴メモでは、最初の歌唱曲として「私、アイドル宣言」が記録されています。" },
    { timestamp: "6:09頃", title: "生まれてはじめて", body: "視聴メモでは、2曲目に「生まれてはじめて」を歌っています。合間には100キラへの感謝も伝えました。" },
    { timestamp: "6:15頃", title: "とくべチュ、して", body: "視聴メモでは、3曲目は「とくべチュ、して」です。曲名と時刻は原音との照合前の記録です。" },
    { timestamp: "6:21頃", title: "かわいいだけじゃだめですか？", body: "視聴メモでは、4曲目に「かわいいだけじゃだめですか？」が続きました。" },
    { timestamp: "6:27頃", title: "Mela!から締めの挨拶へ", body: "視聴メモでは「Mela!」を途中で区切り、締めの挨拶へ進んでいます。今日一日への挨拶と、また会おうという言葉で結びました。", relatedLinks: [{ label: "朝のキラ星推移と画面参考値", url: "/data-lab/reports/20261029-morning/" }] },
  ],
  goals: [],
  ranking: [],
  timeline: [],
  nextNote: "",
  sourceLabel: "2026年10月29日 朝のSHOWROOM配信（提供された視聴メモ）",
  verifiedAt: "2026-10-29",
  transcriptionNote: buildTranscriptionNote({
    material: "提供された視聴メモに基づく非逐語の要約です。原音・映像の再確認は行っていません。",
    stills: "当該回の確認済み写真がないため、静止画は掲載していません。",
    extra: "時刻は日本時間の時計時刻の目安で、録画内の経過時刻ではありません。視聴メモの範囲は6:00〜6:32頃ですが、正式な開始終了は未確認です。5曲の曲名・歌唱時刻は原音未照合のため、録画内時刻の歌唱リストにはしていません。聞き取りが不確かな次枠時刻や定義不明の人数表示は掲載していません。",
  }),
};
