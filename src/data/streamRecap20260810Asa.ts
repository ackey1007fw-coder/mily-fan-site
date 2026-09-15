import type { StreamRecap } from "./streamRecaps.ts";
import { buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const captionMaterialNote =
  "保存済みの日本語自動字幕を2分割録画ぶん確認して整理しています。全編の手動聴取は行っておらず、本文は保存字幕の範囲で整理しています。";

export const streamRecap20260810Asa: StreamRecap = {
  id: "2026-08-10-asa-showroom",
  date: "2026-08-10",
  dateLabel: "2026.08.10（月）",
  theme: "朝の寝坊謝罪と配信10日目",
  broadcastLabel: "10:00頃〜 約32分",
  platformLabel: "SHOWROOM",
  summary:
    "8:30開始予定を寝坊して10:00頃から始めた朝配信。二度寝を率直に謝りながら、配信10日目と三日目投票への感謝、前日のラジオ後の疲れや今後のアラーム対策を話しました。録画は途中に確認できない区間がありますが、終盤にはランキングを読み上げ、夜21:00からの次枠を案内しました。",
  highlights: [
    {
      timestamp: "0:00:43",
      title: "寝坊を率直に謝罪",
      body: "開始直後から寝坊を認め、待っていた人たちへ何度も謝りました。",
    },
    {
      timestamp: "0:01:01",
      title: "三日目投票への感謝",
      body: "三日目の投票への感謝を伝え、この回は音楽なしで話すと述べました。",
    },
    {
      timestamp: "0:02:42",
      title: "ラジオ後の疲れを振り返る",
      body: "前日の3時間ラジオや夜更かしが重なった可能性を話しつつ、二度寝した経緯を振り返りました。",
    },
    {
      timestamp: "0:04:02",
      title: "配信10日目",
      body: "配信を始めて10日目の節目だったことに触れ、来てくれた人たちへ感謝しました。",
    },
    {
      timestamp: "0:15:48",
      title: "原因と対策を整理",
      body: "寝落ち後に二度寝したことを振り返り、早寝早起きを心がけると話しました。",
    },
    {
      timestamp: "0:17:54",
      title: "次は遅れない宣言",
      body: "目覚まし時計の話から、今後は時間に遅れる姿を見せたくないと話しました。",
    },
    {
      timestamp: "0:19:49",
      title: "8:30予定から10:00開始",
      body: "8:30から配信すると案内していたのに、実際は10:00頃の開始になったと改めて謝りました。",
    },
    {
      timestamp: "0:30:17",
      title: "終盤のランキング読み上げ",
      body: "録画で確認できる範囲では12位から1位までを読み上げました。個人名は公開しません。",
    },
  ],
  goals: [],
  ranking: [buildRankingNote(12, 1, "end")],
  timeline: [
    { timestamp: "0:00:00", label: "寝坊後の朝配信を開始" },
    { timestamp: "0:00:43", label: "寝坊について謝罪" },
    { timestamp: "0:01:01", label: "三日目投票への感謝" },
    { timestamp: "0:02:42", label: "ラジオ後の疲れを振り返る" },
    { timestamp: "0:04:02", label: "配信を始めて10日目と振り返る" },
    { timestamp: "0:04:16", label: "録画で確認できない区間へ" },
    { timestamp: "0:10:00", label: "録画再開後も寝坊謝罪トークを継続" },
    { timestamp: "0:15:48", label: "二度寝の原因と対策を整理" },
    { timestamp: "0:17:54", label: "今後の時間管理と目覚ましの話" },
    { timestamp: "0:19:49", label: "8:30予定から10:00開始になったと説明" },
    { timestamp: "0:27:09", label: "配信前アラーム対策を相談" },
    { timestamp: "0:30:17", label: "12位から1位までランキングを読み上げ" },
    { timestamp: "0:31:57", label: "次枠は夜21:00と案内" },
  ],
  nextNote:
    "配信時点では、この日の夜枠を21:00から行うと案内していました。",
  sourceLabel: "2026年8月10日 SHOWROOM朝配信（保存済み字幕・分割録画確認）",
  verifiedAt: "2026-09-15",
  transcriptionNote: buildTranscriptionNote({
    material: captionMaterialNote,
    stills: "静止画は8枚を掲載確認用に準備済みですが、未承認のためまだ掲載していません。",
    extra:
      "録画は約4分20秒と約22分10秒の2本に分かれ、間に確認できない区間があります。同じ朝枠として文脈を整理しましたが、完全な連続録画とは扱っていません。歌唱は確認できませんでした。",
  }),
};