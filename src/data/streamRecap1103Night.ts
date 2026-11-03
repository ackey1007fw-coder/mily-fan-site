import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, RANKING_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

// The owner's authorized recording of this night live (22:31-23:31 JST, about 59 minutes, start to end).
// Photos and the one short talk excerpt are from this live only. Singing excerpts are not published here (rights gate).
// Handwritten names on the background sticky notes are hidden with flat paper-colored fills (no generative edits, no face or body edits).
const moments = [
  [130, "hand-on-head", "頭に手をのせて笑うみりぃ", "バイト終わりのあいさつ"],
  [1020, "hands-mouth-giggle", "両手を口元に当てて笑うみりぃ", "ねこの歌の前に照れ笑い"],
  [1101, "wave-hand-cheek", "片手を振りながらほおに手を添えるみりぃ", "フォロワー400人まであと少し"],
  [1171, "nyan-song-reach", "ねこの歌の途中で手を伸ばすみりぃ", "にゃんにゃんにゃん"],
  [1549, "hand-chin-smile", "あごに手を添えて笑うみりぃ", "2曲目の前に"],
  [1571, "finger-point-smile", "人さし指を立てて笑うみりぃ", "2曲目を歌いながら"],
  [1650, "song-arm-up", "片腕を上げて歌うみりぃ", "2曲目のサビ"],
  [3141, "mic-point", "マイクを持って指さすみりぃ", "みんなへの1曲"],
  [3310, "bouquet-song-mic", "マイクを持って歌うみりぃ", "愛をこめて花束を"],
  [3539, "goodnight-pose", "両手を顔の近くに寄せて笑うみりぃ", "おやすみりー"],
] as const;
const clock = (s: number) => `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
export const night20261103Gallery: StreamRecapImage[] = moments.map(([seconds, slug, alt, label], i) => {
  const filename = `mily-b251-${String(i + 1).padStart(2, "0")}-20261103-night-${slug}.jpg`;
  return { src: `/media/live/${filename}`, width: 640, height: 360, alt, caption: `${clock(seconds)}｜${label}`, downloadName: filename };
});
const clip = (n: number, slug: string, durationSeconds: number, sourceTimestamp: string) => ({
  src: `/media/live-clips/mily-b251-${n}-20261103-night-${slug}.mp4`,
  poster: `/media/live/mily-b251-${n}-20261103-night-${slug}-cover.jpg`,
  width: 640,
  height: 360,
  durationSeconds,
  sourceTimestamp,
});

export const streamRecap1103Night: StreamRecap = {
  id: "2026-11-03-night-showroom",
  date: "2026-11-03",
  dateLabel: "2026.11.03（火）",
  theme: "夜のにゃんにゃんにゃんと歌",
  broadcastLabel: "22:31頃〜 約60分",
  platformLabel: "SHOWROOM",
  summary: "WEB投票6日目、バイト終わりの夜枠。イカのポーズを真顔で決めたあと、ねこの歌「にゃんにゃんにゃん」を「最後までやる」と宣言して3回に分けて歌いました。大好きな曲やみんなへの愛をこめた1曲など、たくさん歌った約1時間。最後は「ファイナルに行くまでは泣かない」と締めくくりました。",
  image: night20261103Gallery[0],
  gallery: night20261103Gallery,
  highlights: [
    { timestamp: "0:00:04", title: "バイト終わり・絶対泣かない", body: "「バイト終わったぜ」とあいさつ。寒い夜に来てくれたみんなにお礼を伝え、投票6日目の報告には「嬉しくて泣ける」と言いながら「絶対泣かないです」と笑顔で宣言しました。" },
    { timestamp: "0:04:15", title: "久しぶりの1曲目", body: "「久しぶりに歌う」という1曲目を披露。歌い終えて「この曲は声が低くて難しいの」と話しました（曲名は未確認）。" },
    { timestamp: "0:12:07", title: "イカのポーズは真顔で", body: "リクエストに応えて、今日1発目のイカのポーズ。「浮遊感が大事」「つまんないって思わないでよ、真剣にやってるんだけど」と言いながら、真顔で決めました。" },
    { timestamp: "0:17:24", title: "にゃんにゃんにゃんを最後まで", body: "「この曲を最後までやるってことにしよう」と宣言して、ねこの歌「にゃんにゃんにゃん」を歌唱。フォロワー400人まであと4人の話をはさみながら、3回に分けて最後まで歌いきりました。" },
    { timestamp: "0:24:50", title: "バイト中に頭の中で歌っていた曲", body: "2曲目は「私が大好きな曲」。バイトで少しやらかしてしまった日に、この曲で自分を励ましたと話してから歌いました（曲名は未確認）。" },
    { timestamp: "0:34:50", title: "みんな知ってた！", body: "3曲目を歌い、「みんな知ってた！よかった！この曲」と喜びました（曲名は未確認）。" },
    { timestamp: "0:51:20", title: "みんなへの愛をこめて", body: "「これは私からみんなへの愛」と前置きし、マイクを持って「愛をこめて花束を」を歌いました。「泣いちゃうかもしれない」と言いながら最後まで歌いきりました。" },
    { timestamp: "0:58:25", title: "ファイナルに行くまでは泣かない", body: "人気ルームになったことをみんなのおかげと喜び、明日からのタイムテーブルをファンルームに載せ直すと案内。「ファイナル行くまでは泣かない」と言って、「おやすみりー」で締めくくりました。", quote: "ミリちゃん頑張りますので、どうか見ていてください", clip: clip(58, "closing-no-tears", 37.0, "0:58:25") },
  ],
  goals: [],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:04", label: "バイト終わりのあいさつ" },
    { timestamp: "0:02:47", label: "投票6日目・絶対泣かない" },
    { timestamp: "0:04:15", label: "1曲目（久しぶりの曲・曲名は未確認）" },
    { timestamp: "0:12:07", label: "イカのポーズは真顔で" },
    { timestamp: "0:16:05", label: "リクエストでにゃんのポーズ" },
    { timestamp: "0:17:24", label: "にゃんにゃんにゃん（1回目）" },
    { timestamp: "0:18:19", label: "フォロワー400人まであと4人" },
    { timestamp: "0:18:39", label: "にゃんにゃんにゃん（2回目）" },
    { timestamp: "0:19:43", label: "にゃんにゃんにゃん（3回目・ラストまで）" },
    { timestamp: "0:24:50", label: "2曲目（大好きな曲・曲名は未確認）" },
    { timestamp: "0:34:50", label: "3曲目（曲名は未確認）" },
    { timestamp: "0:43:30", label: "4曲目（曲名は未確認）" },
    { timestamp: "0:51:20", label: "愛をこめて花束を" },
    { timestamp: "0:57:49", label: "ランキングの読み上げ" },
    { timestamp: "0:58:25", label: "締めのあいさつ・おやすみりー" },
  ],
  nextNote: "配信時点では、明日からのタイムテーブルをファンルームに載せ直すと案内しました。",
  sourceLabel: "2026年11月3日 夜のSHOWROOM配信（保存録画の自動文字起こし・実フレーム確認）",
  verifiedAt: "2026-11-03",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画の実フレーム10枚を掲載しています。",
    publishedClips: true,
    extra: "見どころとタイムスタンプの時刻は録画先頭からの目安です。録画は22:31頃の開始から終了直前までの約59分です。配信の正式な終了時刻は確認していません。背景の付箋に書かれた名前は、無地の紙色で隠しています。顔や身体の生成・補正はしていません。短尺1本は同じ回の録画から切り出した本人のトークで、元の音声を保持しています。歌唱場面の動画は掲載していません。曲名は「にゃんにゃんにゃん」と「愛をこめて花束を」以外は確認できていないため、曲リストは作っていません。ランキングの読み上げは確認しましたが、個人名は掲載していません。原音の全編手動聴取・逐語校正は未実施です。",
  }),
};
