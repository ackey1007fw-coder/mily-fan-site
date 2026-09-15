import type { StreamRecap } from "./streamRecaps.ts";
import { buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const captionMaterialNote =
  "保存済みの日本語自動字幕1,182行を全文テキスト確認して整理しています。字幕は録画末尾近くまで到達していますが、全編の手動聴取は行っていません。";

export const streamRecap20260815Night: StreamRecap = {
  id: "2026-08-15-night-showroom",
  date: "2026-08-15",
  dateLabel: "2026.08.15（土）",
  theme: "夜の最終日前と成長",
  broadcastLabel: "22:31頃〜 約60分",
  platformLabel: "SHOWROOM",
  summary:
    "二次審査最終日前夜の配信。翌日のラジオや自分の声への思い、配信を始めてからの試行錯誤を語り、WEB投票最終日と翌朝6時枠を案内。終盤は13位から1位までランキングを読み上げて締めました。",
  highlights: [
    { timestamp: "0:01:12", title: "二次審査は翌日が最終日", body: "この1週間への感謝を伝え、翌日で二次審査期間が終わると話しました。" },
    { timestamp: "0:05:45", title: "翌日のラジオは部活動がテーマ", body: "翌朝10時から13時のラジオで、部活動をテーマに話す予定を案内しました。" },
    { timestamp: "0:20:59", title: "自分の声への気づき", body: "以前は自分の声が好きではなかったものの、聞きやすい・好きと言ってもらえることがありがたいと語りました。" },
    { timestamp: "0:32:26", title: "WEB投票の最終日", body: "日付が変われば二次審査のWEB投票最終日になるとして、忘れず投票してほしいと呼びかけました。" },
    { timestamp: "0:33:27", title: "ゆっくり成長する配信へ", body: "まだ配信を始めたばかりなので、試行錯誤しながらみんなが楽しめる配信へ成長したいと話しました。" },
    { timestamp: "0:34:32", title: "篠笛は夜なので演奏せず", body: "篠笛の話題になりましたが、夜遅く近所への配慮から吹かないと判断しました。" },
    { timestamp: "0:38:05", title: "翌朝に向けて睡眠優先", body: "翌朝6時枠に備え、5時起きを目標に早く入浴して眠りたいと話しました。" },
    { timestamp: "0:58:28", title: "ランキングと翌朝6時枠", body: "13位から1位までランキングを読み上げ、翌朝6時の配信予定を案内して締めました。個人名は掲載しません。" },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1, "end")],
  timeline: [
    { timestamp: "0:01:12", label: "翌日で二次審査期間が終わると確認" },
    { timestamp: "0:03:29", label: "BGM選びで幅広い年代やジャンルを意識" },
    { timestamp: "0:05:45", label: "翌朝10時から13時のラジオを案内" },
    { timestamp: "0:15:16", label: "翌日のラジオを学生だけで3時間担当" },
    { timestamp: "0:20:59", label: "自分の声を好きと言ってもらえる喜び" },
    { timestamp: "0:32:26", label: "WEB投票と翌日の最終日を案内" },
    { timestamp: "0:33:27", label: "試行錯誤しながら成長したいと話す" },
    { timestamp: "0:34:32", label: "篠笛は夜遅いため演奏しないと判断" },
    { timestamp: "0:37:55", label: "翌朝6時枠に向けて早起きと睡眠を相談" },
    { timestamp: "0:42:03", label: "審査期間の配信スケジュールを振り返る" },
    { timestamp: "0:47:10", label: "睡眠時間をきちんと確保しようと整理" },
    { timestamp: "0:49:14", label: "プロフィールからのWEB投票を再案内" },
    { timestamp: "0:58:28", label: "13位から1位までランキングを読み上げる" },
    { timestamp: "0:59:19", label: "翌朝6時の配信予定を案内して終了" },
  ],
  nextNote:
    "配信時点では、翌朝6時から配信し、その後10時から13時のラジオを担当すると案内していました。",
  sourceLabel: "2026年8月15日 SHOWROOM夜配信（保存済み自動字幕確認）",
  verifiedAt: "2026-09-15",
  transcriptionNote: buildTranscriptionNote({
    material: captionMaterialNote,
    stills: "静止画は掲載していません。",
    extra:
      "録画タイトルの開始時刻は目安として扱っています。字幕内ではこの回のみりぃ本人による独立した歌唱を確認できなかったためsongsには登録していません。",
  }),
};
