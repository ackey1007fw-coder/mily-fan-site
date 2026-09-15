import type { StreamRecap } from "./streamRecaps.ts";
import { buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const captionMaterialNote =
  "保存済みの日本語自動字幕986行を全文テキスト確認して整理しています。全編の手動聴取は行っておらず、本文は保存字幕の範囲で整理しています。";

export const streamRecap20260818Night: StreamRecap = {
  id: "2026-08-18-night",
  date: "2026-08-18",
  dateLabel: "2026.08.18（火）",
  theme: "夜のラジオ配信・歌唱練習",
  broadcastLabel: "22:10頃〜 約54分",
  platformLabel: "SHOWROOM",
  summary:
    "体調を整えるためラジオ形式で行った夜配信。大学の友人やラジオ活動を振り返り、翌日の撮影・リハーサルに向けて「ぼよよん行進曲」を練習。後半は吹奏楽部時代の経験を語り、ランキングと翌日の案内で締めました。",
  songs: [{
    title: "ぼよよん行進曲",
    artist: "今井ゆうぞう・はいだしょうこ",
    timestamp: "0:38:07",
    youtubeUrl: "https://www.youtube.com/watch?v=nAjJluQCSGE",
    youtubeVersionNote: "原曲歌手も参加する「よしお兄さんとあそぼう!」の企画動画です。原盤音源とは異なります。",
    karaoke: { youtubeUrl: "https://www.youtube.com/watch?v=8s8GcvwlhR8", channel: "カラオケ歌っちゃ王" },
  }],
  highlights: [
    { timestamp: "0:00:35", title: "今夜はラジオ配信", body: "体調を整えるため顔出しではなくラジオ形式で配信し、早めに休むつもりだと話しました。" },
    { timestamp: "0:06:35", title: "湘南マジックウェイブを紹介", body: "毎週日曜10時〜13時にFM湘南マジックウェイブで3時間生放送していることを紹介しました。" },
    { timestamp: "0:15:20", title: "大学の友人と久しぶりの時間", body: "大学の友人と久しぶりに会い、写真もたくさん撮ったので順次SNSへ載せたいと話しました。" },
    { timestamp: "0:23:20", title: "3時間ラジオへの思い", body: "長時間でも聴く人が飽きないように話せたら嬉しいと、ラジオでの話し方について振り返りました。" },
    { timestamp: "0:35:00", title: "翌日の撮影に向けて歌の練習", body: "翌日に撮影とリハーサルがあり、そこで歌う曲を練習しておきたいと話しました。" },
    { timestamp: "0:38:07", title: "「ぼよよん行進曲」を歌唱", body: "翌日に向けた練習として「ぼよよん行進曲」を歌いました。" },
    { timestamp: "0:42:30", title: "吹奏楽とコロナ禍の記憶", body: "中学時代の吹奏楽コンクールが中止になった悔しさと、高校でも続けてやり切った経験を振り返りました。" },
    { timestamp: "0:48:00", title: "ランキングと翌日の予定", body: "13位から1位までランキングを読み上げ、翌日はリハーサル後に配信時刻を案内すると説明しました。" },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1, "end")],
  timeline: [
    { timestamp: "0:00:35", label: "顔出しではなくラジオ形式で配信を開始" },
    { timestamp: "0:04:25", label: "早めに配信して休む時間を確保したいと話す" },
    { timestamp: "0:06:35", label: "FM湘南マジックウェイブの日曜3時間生放送を紹介" },
    { timestamp: "0:10:10", label: "前夜の配信を振り返る" },
    { timestamp: "0:14:05", label: "この日の写真をSNSにも載せたいと話す" },
    { timestamp: "0:15:20", label: "大学の友人と久しぶりに会えた時間を振り返る" },
    { timestamp: "0:23:20", label: "3時間ラジオを飽きずに楽しんでもらう話し方について話す" },
    { timestamp: "0:34:40", label: "23時頃までに終え、歌の練習もしたいと話す" },
    { timestamp: "0:35:00", label: "翌日の撮影・リハーサルで歌う予定を説明" },
    { timestamp: "0:38:07", label: "「ぼよよん行進曲」を歌唱" },
    { timestamp: "0:41:05", label: "曲に背中を押された経験を話す" },
    { timestamp: "0:42:30", label: "中学時代の吹奏楽とコロナ禍でのコンクール中止を振り返る" },
    { timestamp: "0:46:20", label: "高校でも吹奏楽を続けてやり切ったと話す" },
    { timestamp: "0:47:10", label: "担当楽器はトロンボーンだったと紹介" },
    { timestamp: "0:48:00", label: "13位から1位までランキングを読み上げる" },
    { timestamp: "0:49:40", label: "翌日はリハーサル後にファンルームで配信時刻を案内すると説明" },
  ],
  nextNote: "配信時点では、翌日はリハーサル後に配信時刻をファンルームで案内すると話していました。",
  sourceLabel: "2026年8月18日 SHOWROOM夜配信（保存済み自動字幕確認）",
  verifiedAt: "2026-09-15",
  transcriptionNote: buildTranscriptionNote({
    material: captionMaterialNote,
    stills: "静止画は掲載していません。",
    extra:
      "保存字幕は録画のほぼ全域をカバーしていますが、全編の手動聴取とは区別しています。歌唱開始時刻は録画内の目安です。",
  }),
};
