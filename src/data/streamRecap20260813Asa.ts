import type { StreamRecap } from "./streamRecaps.ts";
import { buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const captionMaterialNote =
  "保存済みの日本語自動字幕615行を全文テキスト確認して整理しています。全編の手動聴取は行っておらず、本文は保存字幕の範囲で整理しています。";

export const streamRecap20260813Asa: StreamRecap = {
  id: "2026-08-13-asa-showroom",
  date: "2026-08-13",
  dateLabel: "2026.08.13（木）",
  theme: "朝の雑談と23:30枠案内",
  broadcastLabel: "7:21頃〜 約30分",
  platformLabel: "SHOWROOM",
  summary:
    "WEB投票6日目を案内した朝配信。ハーフアップ姿で、配信を始めてからの学びやラジオでの話し方、SHOWROOMのギフト演出などを軽快にトーク。終盤は13位から1位までランキングを読み上げ、次枠は配信時点で23:30からと案内しました。",
  highlights: [
    { timestamp: "0:00:50", title: "WEB投票6日目", body: "この日もWEB投票を忘れず参加してほしいと呼びかけました。" },
    { timestamp: "0:02:17", title: "朝はハーフアップ", body: "朝らしく少しフレッシュにしたくて、ハーフアップにしたと話しました。" },
    { timestamp: "0:09:49", title: "16日までのWEB投票を案内", body: "プロフィール上部のリンクから投票でき、16日まで毎日参加できると説明しました。" },
    { timestamp: "0:10:41", title: "配信を研究していきたい", body: "できることは自分で試しつつ、まだ分からないこともあるので研究していきたいと話しました。" },
    { timestamp: "0:11:30", title: "ラジオでの話し方", body: "ラジオでもクールに話せないと笑いながら、惹きつける話し方への憧れを語りました。" },
    { timestamp: "0:18:58", title: "デイリー演出にびっくり", body: "画面いっぱいに広がるギフト演出を喜び、SHOWROOMの仕組みを一緒に学びました。" },
    { timestamp: "0:22:18", title: "次枠は23時30分", body: "別の予定との兼ね合いから、次の配信は予定を変更して23時30分からと案内しました。" },
    { timestamp: "0:27:10", title: "あくびを前向きに捉える話", body: "あくびは脳を起こそうとする反応だと教わった話を紹介し、印象に残っている考え方を語りました。" },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1, "end")],
  timeline: [
    { timestamp: "0:00:50", label: "WEB投票6日目に触れる" },
    { timestamp: "0:02:17", label: "朝のハーフアップを紹介" },
    { timestamp: "0:05:17", label: "配信時間のタイマーをセット" },
    { timestamp: "0:09:49", label: "16日までのWEB投票を案内" },
    { timestamp: "0:10:41", label: "配信をもっと研究したいと話す" },
    { timestamp: "0:11:30", label: "ラジオでの話し方と憧れを語る" },
    { timestamp: "0:18:58", label: "デイリーギフトの演出を楽しむ" },
    { timestamp: "0:22:18", label: "次枠を23時30分と案内" },
    { timestamp: "0:27:10", label: "あくびをめぐる印象的な話" },
    { timestamp: "0:27:54", label: "ランキング13位から1位を読み上げ" },
    { timestamp: "0:29:20", label: "23時30分の次枠を再案内して終了" },
  ],
  nextNote: "配信時点では、次の配信を23時30分から行うと案内していました。",
  sourceLabel: "2026年8月13日 SHOWROOM朝配信（保存済み自動字幕確認）",
  verifiedAt: "2026-09-15",
  transcriptionNote: buildTranscriptionNote({
    material: captionMaterialNote,
    stills: "静止画は実フレーム8枚を掲載確認用に準備済みですが、未承認のためまだ掲載していません。",
    extra:
      "録画タイトルの開始時刻は目安として扱っています。字幕中に音楽を示す断続的な記号はありますが、独立した歌唱場面の根拠にはならないためsongsには登録していません。",
  }),
};
