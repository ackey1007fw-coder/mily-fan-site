import type { StreamRecap } from "./streamRecaps.ts";
import { buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const captionMaterialNote =
  "保存済みの日本語自動字幕1,566行を全文テキスト確認して整理しています。全編の手動聴取は行っておらず、本文は保存字幕の範囲で整理しています。";

export const streamRecap20260812Night: StreamRecap = {
  id: "2026-08-12-night-showroom",
  date: "2026-08-12",
  dateLabel: "2026.08.12（水）",
  theme: "夜のリコクイズ",
  broadcastLabel: "21:32頃〜 約89分",
  platformLabel: "SHOWROOM",
  summary:
    "本人のことをもっと知ってもらう『リコクイズ』を実施した夜配信。年齢、好きなおつまみ、ひとり行動、書道などを答え合わせしながら交流し、WEB投票も案内。終盤は翌朝枠を7:20〜7:50へ変更すると伝え、13位から1位までランキングを読み上げました。",
  highlights: [
    { timestamp: "0:05:55", title: "配信日付の切り替えを整理", body: "イベント側の3時切り替えとSHOWROOMの配信レポート表示を分けて確認し、混乱していた点を整理しました。" },
    { timestamp: "0:15:04", title: "リコクイズをスタート", body: "番号や色で答える参加型クイズの進め方を決め、本人について知ってもらう企画を始めました。" },
    { timestamp: "0:27:37", title: "21歳を改めて紹介", body: "8月2日に21歳になった大学3年生だと答え合わせし、まだ知らない人にも知ってもらいたいと話しました。" },
    { timestamp: "0:32:16", title: "好きなおつまみは梅水晶", body: "クイズの答えとして、梅水晶が好きだと紹介しました。" },
    { timestamp: "0:41:38", title: "ひとり行動が好き", body: "ラーメン、カラオケ、買い物なども一人で行けると話し、一人の時間も大切だと語りました。" },
    { timestamp: "0:47:16", title: "書道6段を初出し", body: "左利きで書道を続け、中学生の頃に6段を取得したことをクイズの答えとして紹介しました。" },
    { timestamp: "1:21:06", title: "翌朝枠を7:20〜7:50へ変更", body: "翌朝の予定に合わせ、配信時点では朝枠を7:20から7:50へ変更すると案内しました。" },
    { timestamp: "1:24:36", title: "ランキングと次枠案内", body: "13位から1位までランキングを読み上げ、翌朝7:20からの配信を改めて案内しました。個人名は掲載しません。" },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1, "end")],
  timeline: [
    { timestamp: "0:05:55", label: "イベント側の3時切り替えと配信レポート表示の違いを整理" },
    { timestamp: "0:15:04", label: "参加型のリコクイズを開始" },
    { timestamp: "0:27:37", label: "21歳・8月2日生まれ・大学3年生と答え合わせ" },
    { timestamp: "0:32:16", label: "好きなおつまみは梅水晶と紹介" },
    { timestamp: "0:41:38", label: "ひとり行動が好きと答え合わせ" },
    { timestamp: "0:47:16", label: "左利きで書道6段を取得したことを紹介" },
    { timestamp: "1:02:02", label: "WEB投票と二次審査の折り返しを案内" },
    { timestamp: "1:06:26", label: "夏か冬なら夏と答え合わせ" },
    { timestamp: "1:08:17", label: "いちばん好きな季節は春とも補足" },
    { timestamp: "1:21:06", label: "翌朝枠を7:20〜7:50へ変更すると案内" },
    { timestamp: "1:24:36", label: "13位から1位までランキングを読み上げる" },
    { timestamp: "1:28:35", label: "翌朝7:20からの配信を改めて案内して終了" },
  ],
  nextNote: "配信時点では、翌朝7:20〜7:50の30分配信へ変更すると案内していました。",
  sourceLabel: "2026年8月12日 SHOWROOM夜配信（保存済み自動字幕確認）",
  verifiedAt: "2026-09-15",
  transcriptionNote: buildTranscriptionNote({
    material: captionMaterialNote,
    stills: "静止画は実フレーム8枚を掲載確認用に準備済みですが、未承認のためまだ掲載していません。",
    extra:
      "保存字幕は録画のほぼ全域をカバーしていますが、全編の手動聴取とは区別しています。終盤にその日聴いていた曲の話題はありますが、この録画内の歌唱とは確認できないためsongsには登録していません。",
  }),
};
