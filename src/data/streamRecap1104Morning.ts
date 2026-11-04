import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, RANKING_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

// The owner's authorized recording of this morning live (6:41-7:16 JST, about 33 minutes, start to end).
// Photos and the three short talk excerpts are from this live only. Singing excerpts are not published here (rights gate).
// Handwritten names on the background sticky notes are hidden with flat paper-colored fills (no generative edits, no face or body edits).
const moments = [
  [4, "hand-forehead-morning", "おでこに手を当てるみりぃ", "朝のはじまり"],
  [479, "hood-hands-giggle", "フードをかぶって両手を顔の横に広げるみりぃ", "きれいって言われるの嬉しい"],
  [840, "hood-smile", "フードをかぶって笑うみりぃ", "頭が働いていない朝"],
  [1144, "nyan-hands-cheeks", "両手をほおに添えて笑うみりぃ", "にゃんにゃんにゃん"],
  [1190, "nyan-hands-behind-head", "両手を頭のうしろに組んで笑うみりぃ", "にゃんにゃんにゃん"],
  [1245, "hood-hands-cheeks", "フードをかぶって両手でほおを包むみりぃ", "にゃんにゃんにゃんの途中で"],
  [1281, "nyan-paws", "両手をねこの手のように広げるみりぃ", "にゃんにゃんにゃん2番"],
  [1631, "punk-nyan-point", "指さしながら歌うみりぃ", "パンクバージョン"],
  [1919, "hands-together-wink", "両手を合わせてほほえむみりぃ", "今日も一日よろしくね"],
  [1951, "closing-cheeks-smile", "両手をほおに添えて笑うみりぃ", "締めのあいさつ"],
] as const;
const clock = (s: number) => `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
export const morning20261104Gallery: StreamRecapImage[] = moments.map(([seconds, slug, alt, label], i) => {
  const filename = `mily-b252-${String(i + 1).padStart(2, "0")}-20261104-morning-${slug}.jpg`;
  return { src: `/media/live/${filename}`, width: 640, height: 360, alt, caption: `${clock(seconds)}｜${label}`, downloadName: filename };
});
const clip = (n: number, slug: string, durationSeconds: number, sourceTimestamp: string) => ({
  src: `/media/live-clips/mily-b252-${n}-20261104-morning-${slug}.mp4`,
  poster: `/media/live/mily-b252-${n}-20261104-morning-${slug}-cover.jpg`,
  width: 640,
  height: 360,
  durationSeconds,
  sourceTimestamp,
});

export const streamRecap1104Morning: StreamRecap = {
  id: "2026-11-04-morning-showroom",
  date: "2026-11-04",
  dateLabel: "2026.11.04（水）",
  theme: "朝のにゃんにゃんとパンク版",
  broadcastLabel: "6:41頃〜 約35分",
  platformLabel: "SHOWROOM",
  summary: "前髪がぱっくり割れたまま始まった朝枠。「頭が働いていない」と笑いながら、ねこの歌「にゃんにゃんにゃん」を歌い、初めての「パンクバージョン」も披露。お仕事に向かうみんなへ「エネルギーチャージになりますように」と送り出し、投票の残り日程を伝えて締めくくりました。",
  image: morning20261104Gallery[0],
  gallery: morning20261104Gallery,
  highlights: [
    { timestamp: "0:03:14", title: "デコ出し、似合う？", body: "前髪をセットしようとしたらぱっくり割れてしまったそうで、「デコ出しじゃないこれ」「デコ出し似合う？」と照れ笑い。", clip: clip(66, "deko-dashi", 7.9, "0:03:14") },
    { timestamp: "0:08:04", title: "今日は3枠", body: "この日は朝・昼・夜の3枠。昼は14時45分から、夜はいつもより早い20時50分からと、今日の配信予定を案内しました。" },
    { timestamp: "0:12:16", title: "頭が働いていない朝", body: "終了時刻を言い間違えたり、引き算に詰まったり。「頭が働いてないのバレバレだよね」と笑い、心配するみんなに「大丈夫だよ」と伝えました。" },
    { timestamp: "0:18:35", title: "朝からにゃんにゃんにゃん", body: "「じゃあにゃんにゃんやるか」と、ねこの歌「にゃんにゃんにゃん」を朝から歌唱。途中でお礼をはさみながら、2番の「おかえりにゃ、おやつくれ」まで歌いきり、「もうにゃんにゃん終わり」と照れました。" },
    { timestamp: "0:26:47", title: "パンクバージョン、初披露", body: "「パンクにゃんにゃんっていうのがあるんだよ」と予告していたパンクバージョンを披露。歌い終えて「パンクバージョンは初めてなんだけど、嬉しい！」と喜びました。" },
    { timestamp: "0:28:22", title: "みんなのエネルギーチャージに", body: "「みんな今日はお仕事？」と問いかけ、「みんなに元気を与えよう」「みんなのエネルギーチャージになりますように」と送り出しました。", quote: "みんなのエネルギーチャージになりますように", clip: clip(64, "energy-charge", 9.9, "0:28:22") },
    { timestamp: "0:29:15", title: "投票は11月8日まで", body: "投票は11月8日まで、配信でのSHOWROOM審査は7日までと伝え、「皆さんどうか私に力を貸してください」とお願いしました。", clip: clip(65, "vote-appeal", 10.6, "0:29:15") },
    { timestamp: "0:31:56", title: "今日も一日よろしくね", body: "大きなレインボースターに喜び、「今日も一日よろしくね」「今日も頑張ろうね」とあいさつして朝枠を締めくくりました。" },
  ],
  goals: [],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:02", label: "朝のはじまり（コメントが見えないトラブル）" },
    { timestamp: "0:03:14", label: "前髪が割れてデコ出しに" },
    { timestamp: "0:08:04", label: "今日の配信予定（朝・昼・夜）" },
    { timestamp: "0:12:16", label: "頭が働いていない朝" },
    { timestamp: "0:16:10", label: "緊張すると何をしているか分からなくなる話" },
    { timestamp: "0:18:35", label: "にゃんにゃんにゃん" },
    { timestamp: "0:21:41", label: "もうにゃんにゃん終わり" },
    { timestamp: "0:24:55", label: "パンクにゃんにゃんの予告" },
    { timestamp: "0:26:47", label: "パンクバージョン初披露" },
    { timestamp: "0:28:22", label: "みんなのエネルギーチャージに" },
    { timestamp: "0:29:15", label: "投票は11月8日まで・SHOWROOM審査は7日まで" },
    { timestamp: "0:30:14", label: "ランキングの読み上げ" },
    { timestamp: "0:31:56", label: "締めのあいさつ" },
  ],
  nextNote: "配信時点では、この日の昼枠は14:45から、夜枠は20:50からと案内しました。",
  sourceLabel: "2026年11月4日 朝のSHOWROOM配信（保存録画の自動文字起こし・実フレーム確認）",
  verifiedAt: "2026-11-04",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画の実フレーム10枚を掲載しています。",
    publishedClips: true,
    extra: "見どころとタイムスタンプの時刻は録画先頭からの目安です。録画は6:41頃の開始から終了までの約33分です。配信の正式な終了時刻は確認していません。背景の付箋に書かれた名前は、無地の紙色で隠しています。顔や身体の生成・補正はしていません。短尺3本は同じ回の録画から切り出した本人のトークで、元の音声を保持しています。歌唱場面の動画は掲載していません。曲名は「にゃんにゃんにゃん」以外は扱っていないため、曲リストは作っていません。ランキングの読み上げは確認しましたが、個人名は掲載していません。原音の全編手動聴取・逐語校正は未実施です。",
  }),
};
