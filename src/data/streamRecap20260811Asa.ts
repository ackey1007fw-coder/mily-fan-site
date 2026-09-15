import type { StreamRecap } from "./streamRecaps.ts";
import { buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const captionMaterialNote =
  "保存済みの日本語自動字幕1,655行を全文テキスト確認して整理しています。全編の手動聴取は行っておらず、本文は保存字幕と実フレーム確認の範囲で整理しています。";

export const streamRecap20260811Asa: StreamRecap = {
  id: "2026-08-11-asa-showroom",
  date: "2026-08-11",
  dateLabel: "2026.08.11（火）",
  theme: "朝・配信11日目の改善",
  broadcastLabel: "6:33頃〜 約88分",
  platformLabel: "SHOWROOM",
  summary:
    "前日の寝坊を踏まえて二度寝せず始めた朝配信。配信11日目の改善やWEB投票、二次審査通過をまずの目標にすることを話し、朝枠の短縮や夜の短時間配信も相談。終盤はランキングを読み上げ、夜枠は時刻が分かり次第ファンルームで知らせると案内しました。",
  highlights: [
    { timestamp: "0:00:29", title: "二度寝せず朝配信へ", body: "前日の寝坊を振り返りつつ、この日は二度寝していないと話してスタートしました。" },
    { timestamp: "0:02:48", title: "WEB投票をリマインド", body: "毎日のWEB投票を忘れず参加してほしいと案内しました。" },
    { timestamp: "0:07:58", title: "配信11日目の成長", body: "配信を始めて11日目になり、教わったことを少しずつ吸収できていると振り返りました。" },
    { timestamp: "0:17:28", title: "昨日より今日、今日より明日", body: "前日の反省を引きずるより、少しずつ改善していきたいと前向きに話しました。" },
    { timestamp: "0:46:24", title: "朝枠を8時までに変更", body: "当初の予定を見直し、この朝枠を8時までに短縮すると案内しました。" },
    { timestamp: "0:50:02", title: "まずは二次審査通過を目標に", body: "目標の立て方を相談し、まずは二次審査を通過することが大切だと話しました。" },
    { timestamp: "1:06:01", title: "翌夜はリコクイズ予定", body: "配信時点では、翌夜に本人のことをもっと知ってもらうクイズ企画を考えていると話しました。" },
    { timestamp: "1:25:52", title: "ランキング読み上げと夜枠案内", body: "13位から1位までランキングを読み上げ、夜枠は時刻が分かり次第ファンルームで知らせると案内しました。個人名は掲載しません。" },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1, "end")],
  timeline: [
    { timestamp: "0:00:29", label: "前日の寝坊を振り返り、今日は二度寝していないと話す" },
    { timestamp: "0:02:48", label: "WEB投票を案内" },
    { timestamp: "0:07:58", label: "配信11日目の改善を振り返る" },
    { timestamp: "0:17:28", label: "昨日より今日、今日より明日と前向きに話す" },
    { timestamp: "0:23:11", label: "新しい配信者として知ってもらう工夫を考える" },
    { timestamp: "0:33:52", label: "朝枠を短縮し夜に短時間配信する案を相談" },
    { timestamp: "0:46:24", label: "朝枠を8時までに変更すると案内" },
    { timestamp: "0:50:02", label: "二次審査通過をまずの目標に置く" },
    { timestamp: "1:00:03", label: "最終日の配信終了タイミングを相談" },
    { timestamp: "1:06:01", label: "翌夜のクイズ企画を案内" },
    { timestamp: "1:25:52", label: "13位から1位までランキングを読み上げる" },
    { timestamp: "1:27:18", label: "夜枠は時刻が分かり次第ファンルームで案内するとして終了" },
  ],
  nextNote: "配信時点では、夜枠は時刻未定で、帰宅時刻が見えたらファンルームで案内すると話していました。",
  sourceLabel: "2026年8月11日 SHOWROOM朝配信（保存済み自動字幕確認）",
  verifiedAt: "2026-09-15",
  transcriptionNote: buildTranscriptionNote({
    material: captionMaterialNote,
    stills: "静止画は実フレーム8枚を掲載確認用に準備済みですが、未承認のためまだ掲載していません。",
    extra: "保存字幕は録画のほぼ全域をカバーしていますが、全編の手動聴取とは区別しています。歌唱曲として確定できる場面はありませんでした。",
  }),
};
