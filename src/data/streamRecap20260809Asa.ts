import type { StreamRecap } from "./streamRecaps.ts";
import { buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const captionMaterialNote =
  "保存済みの日本語自動字幕をもとに整理しています。全編の手動聴取は行っておらず、本文は自動字幕と実フレーム確認の範囲で整理しています。";

export const streamRecap20260809Asa: StreamRecap = {
  id: "2026-08-09-asa-showroom",
  date: "2026-08-09",
  dateLabel: "2026.08.09（日）",
  theme: "朝の二次審査スタート",
  broadcastLabel: "6:03頃〜 約31分",
  platformLabel: "SHOWROOM",
  summary:
    "二次審査のSHOWROOM審査が始まった朝の短時間配信。毎日のWEB投票を呼びかけ、配信を始めたばかりの今や、この後に控えたラジオ生放送について話しました。",
  highlights: [
    {
      timestamp: "0:01:05",
      title: "二次審査がスタート",
      body: "この日からSHOWROOM審査が始まったと案内し、応援を呼びかけました。",
    },
    {
      timestamp: "0:05:48",
      title: "初日の緊張",
      body: "審査初日の緊張を口にしながら、朝から来てくれた人たちへ感謝を伝えました。",
    },
    {
      timestamp: "0:08:11",
      title: "一緒に前を向く",
      body: "肩の力を抜いて、みんなと一緒に前を向いていこうと話しました。",
    },
    {
      timestamp: "0:09:18",
      title: "ラジオ前の30分枠",
      body: "この後のラジオ生放送に間に合うよう、この朝枠は約30分にすると説明しました。",
    },
    {
      timestamp: "0:13:57",
      title: "WEB投票を毎日",
      body: "WEB投票の比重が大きいとして、1日1回忘れず参加してほしいと呼びかけました。",
    },
    {
      timestamp: "0:15:29",
      title: "配信9日目",
      body: "8月1日に配信を始め、この日で9日目になると振り返りました。",
    },
    {
      timestamp: "0:16:10",
      title: "朝10時からラジオ",
      body: "湘南シーサイドサークルを紹介し、朝10時から3時間の生放送を案内しました。",
    },
    {
      timestamp: "0:28:08",
      title: "一緒に勝ち上がる",
      body: "ブロックの厳しさに触れつつ、応援してくれるみんなと一緒に頑張ると話しました。",
    },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1, "during")],
  timeline: [
    { timestamp: "0:01:05", label: "二次審査のSHOWROOM審査開始を案内" },
    { timestamp: "0:03:16", label: "イベントのランキング表示を確認" },
    { timestamp: "0:05:24", label: "6時32分頃までの短時間枠と説明" },
    { timestamp: "0:08:11", label: "肩の力を抜いて前を向く話" },
    { timestamp: "0:09:18", label: "ラジオ前の約30分配信と説明" },
    { timestamp: "0:13:57", label: "毎日のWEB投票を呼びかけ" },
    { timestamp: "0:15:29", label: "配信を始めて9日目と振り返る" },
    { timestamp: "0:16:10", label: "湘南シーサイドサークルを紹介" },
    { timestamp: "0:19:15", label: "投票とSHOWROOM審査を改めて案内" },
    { timestamp: "0:23:06", label: "ラジオ前の早朝枠だった理由を説明" },
    { timestamp: "0:28:36", label: "13位から1位までランキングを読み上げ" },
    { timestamp: "0:30:31", label: "ラジオと次の配信候補を案内" },
  ],
  nextNote:
    "配信時点では、次の配信は17時頃だったと思うのでタイムテーブルを確認してほしいと案内していました。",
  sourceLabel: "2026年8月9日 SHOWROOM朝配信（自動字幕確認）",
  verifiedAt: "2026-09-15",
  transcriptionNote: buildTranscriptionNote({
    material: captionMaterialNote,
    stills: "静止画は8枚を掲載確認用に準備済みですが、未承認のためまだ掲載していません。",
    extra:
      "自動字幕662行を全文テキスト確認し、実フレーム候補も確認しています。歌唱は確認できませんでした。開始時刻と各タイムスタンプは保存済み記録に基づく目安です。",
  }),
};
