import type { StreamRecap } from "./streamRecaps.ts";
import { buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const captionMaterialNote =
  "保存済みの日本語自動字幕495行を全文テキスト確認して整理しています。字幕は3分割録画のうち3本目のみで、全編の手動聴取は行っていません。";

export const streamRecap20260812Asa: StreamRecap = {
  id: "2026-08-12-asa-showroom",
  date: "2026-08-12",
  dateLabel: "2026.08.12（水）",
  theme: "朝の再起動と時間管理",
  broadcastLabel: "10:16頃〜 約31分",
  platformLabel: "SHOWROOM",
  summary:
    "朝の予定時刻を過ぎたことを謝り、短めの朝枠へ切り替えた配信。配信12日目の時間管理を振り返り、WEB投票への感謝を伝えました。途中の再起動と無音開始にも触れ、終盤は13位から1位までランキングを読み上げ、夜21時から本人クイズを予定していると案内しました。",
  highlights: [
    { timestamp: "0:00:08", title: "朝の予定変更を謝罪", body: "予定より遅い開始になったことを謝り、来てくれた人へ感謝を伝えました。" },
    { timestamp: "0:03:21", title: "本来は8:30予定", body: "朝8:30からの予定だったものの、遅い時間になったと振り返りました。" },
    { timestamp: "0:05:05", title: "朝枠は短めに", body: "この朝枠は短めにして、夜の枠を長めにできるよう調整すると話しました。" },
    { timestamp: "0:11:33", title: "配信12日目を振り返る", body: "配信12日目の時間管理を振り返り、今後もよろしくと話しました。" },
    { timestamp: "0:16:21", title: "途中再起動を確認", body: "途中で配信を再起動したことや、最初の無音開始を含む時間の扱いを確認しました。" },
    { timestamp: "0:17:02", title: "WEB投票への感謝", body: "WEB投票を済ませたという反応に感謝を伝えました。" },
    { timestamp: "0:21:26", title: "ランキング読み上げ", body: "13位から1位までランキングを読み上げました。個人名は掲載しません。" },
    { timestamp: "0:23:48", title: "夜21時は本人クイズ予定", body: "配信時点では、夜21時から本人のことを知ってもらうクイズ企画を予定していると案内しました。" },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1, "end")],
  timeline: [
    { timestamp: "0:00:08", label: "予定より遅い朝配信になったことを謝る" },
    { timestamp: "0:03:21", label: "本来は8:30開始予定だったと振り返る" },
    { timestamp: "0:05:05", label: "朝枠を短めにして夜枠へ時間を回すと話す" },
    { timestamp: "0:07:07", label: "WEB投票への感謝を伝える" },
    { timestamp: "0:11:33", label: "配信12日目の時間管理を振り返る" },
    { timestamp: "0:16:21", label: "途中再起動と最初の無音開始の扱いを確認" },
    { timestamp: "0:18:16", label: "そろそろ朝枠を終えて夜に備えると話す" },
    { timestamp: "0:21:26", label: "13位から1位までランキングを読み上げる" },
    { timestamp: "0:23:48", label: "夜21時から本人クイズ予定と案内" },
    { timestamp: "0:24:11", label: "朝枠を終了し、夜21時にまた会おうと締める" },
  ],
  nextNote: "配信時点では、夜21時から本人クイズを予定していると案内していました。",
  sourceLabel: "2026年8月12日 SHOWROOM朝配信（保存済み字幕・分割録画確認）",
  verifiedAt: "2026-09-15",
  transcriptionNote: buildTranscriptionNote({
    material: captionMaterialNote,
    stills: "静止画は実フレーム1枚を掲載確認用に準備済みですが、未承認のためまだ掲載していません。",
    extra:
      "録画は短い再起動分を含む3本に分かれています。最初の2本には保存字幕がないため発言内容を復元せず、見どころとタイムラインの時刻は字幕のある3本目録画先頭からの目安です。歌唱は確認できませんでした。",
  }),
};
