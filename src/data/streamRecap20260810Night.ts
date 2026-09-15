import type { StreamRecap } from "./streamRecaps.ts";
import { buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const captionMaterialNote =
  "保存済みの日本語自動字幕1,457行を全文テキスト確認して整理しています。全編の手動聴取は行っておらず、本文は保存字幕の範囲で整理しています。";

export const streamRecap20260810Night: StreamRecap = {
  id: "2026-08-10-night-showroom",
  date: "2026-08-10",
  dateLabel: "2026.08.10（月）",
  theme: "夜・配信10日間を振り返る",
  broadcastLabel: "21:00頃〜 約88分",
  platformLabel: "SHOWROOM",
  summary:
    "配信開始から約10日を振り返り、自分に自信をつけることや他人との比較との向き合い方をじっくり話した夜配信。朝の寝坊を踏まえた対策や、応援への感謝、ラジオの話も交え、終盤にはランキングを読み上げて翌朝6:30の配信予定を案内しました。",
  highlights: [
    {
      timestamp: "0:02:59",
      title: "配信10日間を振り返る",
      body: "配信を始めた理由と、もっと自信をつける方向へ進みたいという思いを話しました。",
    },
    {
      timestamp: "0:04:02",
      title: "自信つけプロジェクト",
      body: "自分の良いところを自分でも見つけていこうと話しました。",
    },
    {
      timestamp: "0:16:18",
      title: "自分へのリスペクト",
      body: "他の配信者と悪い面だけを比べず、自分の土俵や良さを見直したいと語りました。",
    },
    {
      timestamp: "0:30:06",
      title: "応援の言葉に涙",
      body: "優しい言葉への感謝から涙し、普段は人前で弱みを見せるのが得意ではないとも話しました。",
    },
    {
      timestamp: "0:38:39",
      title: "比較との向き合い方",
      body: "比較そのものを責めず、自分と条件の合う比較かを見直したいと整理しました。",
    },
    {
      timestamp: "0:41:34",
      title: "リコピンの由来",
      body: "ファンネームの発想を、みんなで一つのものを育てるイメージとともに説明しました。",
    },
    {
      timestamp: "0:42:55",
      title: "みんなの太陽でいたい",
      body: "本当はみんなを照らしたいという思いを話しました。",
    },
    {
      timestamp: "1:24:27",
      title: "終盤ランキングと感謝",
      body: "13位から1位までランキングを読み上げ、連続配信10日目への感謝を伝えました。個人名は公開しません。",
    },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1, "end")],
  timeline: [
    { timestamp: "0:02:59", label: "配信を始めて約10日を振り返る" },
    { timestamp: "0:04:02", label: "自信つけプロジェクトを提案" },
    { timestamp: "0:11:35", label: "WEB投票と翌朝6:30枠を案内" },
    { timestamp: "0:16:18", label: "他人との比較と自分へのリスペクトを考える" },
    { timestamp: "0:30:06", label: "応援の言葉への感謝で涙" },
    { timestamp: "0:38:39", label: "比較の仕方を見直す結論" },
    { timestamp: "0:41:34", label: "ファンネームの由来を説明" },
    { timestamp: "0:42:55", label: "みんなの太陽でいたいと話す" },
    { timestamp: "1:07:59", label: "ラジオ活動を現在も続けていると話す" },
    { timestamp: "1:24:27", label: "13位から1位までランキングを読み上げる" },
    { timestamp: "1:26:57", label: "翌朝6:30から約2時間の予定を案内して終了" },
  ],
  nextNote:
    "配信時点では、翌朝6:30から約2時間の配信を予定していると案内していました。",
  sourceLabel: "2026年8月10日 SHOWROOM夜配信（保存済み自動字幕確認）",
  verifiedAt: "2026-09-15",
  transcriptionNote: buildTranscriptionNote({
    material: captionMaterialNote,
    stills: "静止画は実フレーム8枚を掲載確認用に準備済みですが、未承認のためまだ掲載していません。",
    extra:
      "短い歌唱らしき区間が2か所ありますが、全編の手動聴取をしていないため歌唱曲としては確定せず、songsには登録していません。",
  }),
};