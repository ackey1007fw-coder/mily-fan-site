import type { StreamRecap } from "./streamRecaps.ts";
import { RANKING_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

const captionMaterialNote =
  "保存済みの日本語自動字幕をもとに整理しています。全編の手動聴取は行っておらず、本文は自動字幕の範囲で整理しています。";

export const streamRecap20260814Night: StreamRecap = {
  id: "2026-08-14-night-song-requests",
  date: "2026-08-14",
  dateLabel: "2026.08.14（金）",
  theme: "夜の歌リクエスト相談",
  broadcastLabel: "22:31頃〜 約60分",
  platformLabel: "SHOWROOM",
  summary:
    "翌日の歌配信に向けてリクエスト曲を募り、知っている曲や練習したい曲をメモ。歌詞や楽曲へのリスペクトを語り、終盤にランキングと翌日の配信を案内しました。",
  highlights: [
    {
      timestamp: "0:02:33",
      title: "定型文を用意",
      body: "投票完了や100キラのお礼を伝えやすくするため、新しい定型文を作ったと紹介しました。",
    },
    {
      timestamp: "0:04:04",
      title: "翌日の歌を募集",
      body: "翌日11時半からの配信で歌う候補として、リクエスト曲を募りました。",
    },
    {
      timestamp: "0:12:05",
      title: "1フレーズを確認",
      body: "『やさしさで溢れるように』を短く歌い、サビの一部なら歌えると確認しました。",
    },
    {
      timestamp: "0:19:32",
      title: "悪天候への気づかい",
      body: "関東・千葉方面の天候を気にかけ、無理して見ず自分の身を大切にしてほしいと呼びかけました。",
    },
    {
      timestamp: "0:24:37",
      title: "地図投影の雑談",
      body: "グリーンランドの大きさや地図投影について調べながら、雑談を広げました。",
    },
    {
      timestamp: "0:32:17",
      title: "曲候補をメモ",
      body: "翌日に歌える曲を選ぶため、知っている曲と練習したい曲を次々にメモしました。",
    },
    {
      timestamp: "0:51:20",
      title: "歌詞と世界観を大切に",
      body: "歌詞や楽曲を作った人の意図を大切にしながら歌いたいと話しました。",
    },
    {
      timestamp: "0:57:12",
      title: "ランキングと翌日案内",
      body: "終了前に13位から1位までを読み上げ、翌日11時半〜12時半の配信を案内しました。",
    },
  ],
  goals: [],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:01", label: "開始直後に順位の動きを話題にする" },
    { timestamp: "0:02:33", label: "投票完了・100キラ用の定型文を紹介" },
    { timestamp: "0:04:04", label: "翌日11時半の配信と歌リクエスト募集" },
    { timestamp: "0:12:05", label: "リクエスト曲を1フレーズだけ確認" },
    { timestamp: "0:19:32", label: "関東・千葉方面の悪天候に注意を呼びかけ" },
    { timestamp: "0:24:37", label: "グリーンランドと地図投影の雑談" },
    { timestamp: "0:32:17", label: "翌日に向けた曲候補をメモ" },
    { timestamp: "0:38:40", label: "応援や順位との向き合い方を話す" },
    { timestamp: "0:43:57", label: "自分のイメージカラーについて雑談" },
    { timestamp: "0:48:15", label: "23時半までの枠と歌募集を確認" },
    { timestamp: "0:51:20", label: "歌詞・楽曲制作者へのリスペクトを語る" },
    { timestamp: "0:52:00", label: "二次審査後も配信を続ける意向を話す" },
    { timestamp: "0:57:12", label: "終了時ランキング13位から1位を読み上げ" },
    { timestamp: "0:58:44", label: "翌日11時半〜12時半の配信を案内して終了" },
  ],
  nextNote:
    "配信時点では、翌日11時半〜12時半に歌も交えた配信を行うと案内していました。",
  sourceLabel: "2026年8月14日 SHOWROOM夜配信（自動字幕確認）",
  verifiedAt: "2026-09-14",
  transcriptionNote: buildTranscriptionNote({
    material: captionMaterialNote,
    stills: "静止画は掲載していません。",
    extra:
      "自動字幕1123行を全文テキスト確認しました。12分台の歌唱は1フレーズのみのため歌唱曲には登録していません。字幕トラックの最終時刻は映像尺より短く、映像全編の完全確認とは扱っていません。開始時刻はプレイリスト記録に基づく目安です。",
  }),
};
