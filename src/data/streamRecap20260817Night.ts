import type { StreamRecap } from "./streamRecaps.ts";
import { buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const captionMaterialNote =
  "保存済みの日本語自動字幕920行を全文テキスト確認して整理しています。全編の手動聴取は行っておらず、本文は保存字幕の範囲で整理しています。";

export const streamRecap20260817Night: StreamRecap = {
  id: "2026-08-17-night-showroom",
  date: "2026-08-17",
  dateLabel: "2026.08.17（月）",
  theme: "夜の映画帰り・雑談",
  broadcastLabel: "23:21頃〜 約52分",
  platformLabel: "SHOWROOM",
  summary:
    "イベント後の夜、友人と映画を見た帰りに配信。久しぶりに友人と過ごした時間や映画の感想、毎日配信を続ける思いをゆったり話し、翌日の配信時刻は起きてから案内すると説明。終盤はランキングを読み上げて締めました。",
  highlights: [
    { timestamp: "0:00:37", title: "友人と過ごした夜を振り返る", body: "高校時代からの友人と久しぶりにゆっくり過ごせたことを話しました。" },
    { timestamp: "0:07:22", title: "映画の感想トーク", body: "この日に見てきた映画について、前作とのつながりも含めて感想を話しました。" },
    { timestamp: "0:15:20", title: "毎日配信は継続", body: "イベント後も毎日配信を続けるつもりだと話し、来てくれる人への感謝を伝えました。" },
    { timestamp: "0:17:16", title: "配信に来てもらえる嬉しさ", body: "前日までの配信も振り返り、みんなが来てくれることが嬉しいと話しました。" },
    { timestamp: "0:25:22", title: "映画から受け取ったこと", body: "映画の設定そのものより、人生の教訓として受け止めて心を動かされたと振り返りました。" },
    { timestamp: "0:33:14", title: "0時で区切ると宣言", body: "夜も遅くなったため、0時ごろには配信を終えるつもりだと話しました。" },
    { timestamp: "0:41:21", title: "翌日の配信時間は未定", body: "翌日の予定は時間が読めないため、朝起きてから配信時間を案内すると説明しました。" },
    { timestamp: "0:49:47", title: "ランキング読み上げ", body: "終盤に13位から1位までランキングを読み上げました。個人名は掲載しません。" },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1, "end")],
  timeline: [
    { timestamp: "0:00:37", label: "友人と久しぶりに過ごせて楽しかったと振り返る" },
    { timestamp: "0:03:57", label: "映画後の流れで友人と食事に行った経緯を話す" },
    { timestamp: "0:07:22", label: "この日に見た映画と前作について話す" },
    { timestamp: "0:11:53", label: "少し早めに終えるかもしれないと話す" },
    { timestamp: "0:15:20", label: "毎日配信は続けると話す" },
    { timestamp: "0:17:16", label: "配信へ来てもらえることの嬉しさを振り返る" },
    { timestamp: "0:25:22", label: "映画を人生の教訓として受け止めたと話す" },
    { timestamp: "0:33:14", label: "0時には終えると区切りを決める" },
    { timestamp: "0:41:21", label: "翌日の配信時間はまだ読めないと説明" },
    { timestamp: "0:42:18", label: "映画から受け取った感動を改めて話す" },
    { timestamp: "0:49:47", label: "13位から1位までランキングを読み上げる" },
    { timestamp: "0:51:24", label: "翌日の枠は起きてから案内すると説明" },
    { timestamp: "0:52:20", label: "挨拶して配信を終了" },
  ],
  nextNote: "配信時点では翌日の配信時刻は未定で、起きてから案内すると話していました。",
  sourceLabel: "2026年8月17日 SHOWROOM夜配信（保存済み自動字幕確認）",
  verifiedAt: "2026-09-15",
  transcriptionNote: buildTranscriptionNote({
    material: captionMaterialNote,
    stills: "静止画は掲載していません。",
    extra:
      "保存字幕は録画のほぼ全域をカバーしていますが、全編の手動聴取とは区別しています。この字幕監査では独立した歌唱場面を確認できなかったためsongsには登録していません。録画は日付をまたいでいますが、配信日は録画タイトルの開始日を目安にしています。",
  }),
};
