import type { StreamRecap } from "./streamRecaps.ts";
import { buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const captionMaterialNote =
  "保存済みの日本語自動字幕538行を全文テキスト確認して整理しています。全編の手動聴取は行っておらず、本文は保存字幕の範囲で整理しています。";

export const streamRecap20260816Asa: StreamRecap = {
  id: "2026-08-16-morning-showroom",
  date: "2026-08-16",
  dateLabel: "2026.08.16（日）",
  theme: "朝の最終日とラジオ前",
  broadcastLabel: "6:01頃〜 約31分",
  platformLabel: "SHOWROOM",
  summary:
    "二次審査最終日の朝枠。ラジオ前の近況を話し、WEB投票最終日と20:30からの最終枠を案内。配信16日目を迎えた実感や、最終日とラジオ出演が重なる日の調整を振り返り、終盤はランキングを読み上げてラジオへ向かいました。",
  highlights: [
    { timestamp: "0:00:43", title: "二次審査最終日の朝", body: "少しかすれた声で朝枠を始め、二次審査最終日として投票が済んだか確認しました。" },
    { timestamp: "0:03:15", title: "このあと3時間の生ラジオへ", body: "配信後は10時から13時の生ラジオへ向かうと案内しました。" },
    { timestamp: "0:07:22", title: "20:30から最終枠を案内", body: "二次審査最終日を最後まで走り切りたいとして、20:30からの最終枠を案内しました。" },
    { timestamp: "0:11:50", title: "連続投票への感謝", body: "Xで連続投票を報告してくれている投稿も見ているとして感謝を伝えました。" },
    { timestamp: "0:16:32", title: "最後まで一緒に駆け抜けたい", body: "応援を力に、最終日をみんなと一緒に最後まで駆け抜けたいと話しました。" },
    { timestamp: "0:18:17", title: "配信16日目", body: "配信を始めて16日目になり、毎日続けてこられたことへの実感を語りました。" },
    { timestamp: "0:21:36", title: "ラジオと審査最終日の調整", body: "審査最終日とラジオが重なる経験から、今後は学生メンバー同士でシフトを調整することも考えたいと振り返りました。" },
    { timestamp: "0:29:03", title: "ランキングと最終枠で締め", body: "13位から1位までランキングを読み上げ、20:30からの最終枠とラジオを案内して締めました。個人名は掲載しません。" },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1, "end")],
  timeline: [
    { timestamp: "0:00:43", label: "声の調子に触れつつ、二次審査最終日と投票を確認" },
    { timestamp: "0:03:15", label: "このあと3時間の生ラジオへ向かうと案内" },
    { timestamp: "0:07:22", label: "二次審査最終日、20:30から最終枠と案内" },
    { timestamp: "0:09:52", label: "二次審査期間の朝配信はこの回が最後と話す" },
    { timestamp: "0:11:50", label: "Xの連続投票報告への感謝を伝える" },
    { timestamp: "0:12:22", label: "WEB投票の最終日を改めて呼びかける" },
    { timestamp: "0:16:32", label: "最後まで一緒に駆け抜けたいと話す" },
    { timestamp: "0:18:17", label: "配信16日目を迎えたことを振り返る" },
    { timestamp: "0:19:54", label: "10時のラジオに向けて基本は2時間前に入ると説明" },
    { timestamp: "0:21:36", label: "審査最終日とラジオ出演が重なる日のシフト調整を振り返る" },
    { timestamp: "0:24:46", label: "声の調子を気にしつつ、喉は痛くないと話す" },
    { timestamp: "0:29:03", label: "13位から1位までランキングを読み上げる" },
    { timestamp: "0:30:20", label: "次枠20:30と3時間の生ラジオを案内して終了へ" },
  ],
  nextNote: "配信時点では、同日20:30から二次審査の最終枠を行うと案内していました。",
  sourceLabel: "2026年8月16日 SHOWROOM朝配信（保存済み自動字幕確認）",
  verifiedAt: "2026-09-15",
  transcriptionNote: buildTranscriptionNote({
    material: captionMaterialNote,
    stills: "静止画は掲載していません。",
    extra:
      "保存字幕は録画のほぼ全域をカバーしていますが、全編の手動聴取とは区別しています。この字幕監査では独立した歌唱場面を確認できなかったためsongsには登録していません。",
  }),
};
