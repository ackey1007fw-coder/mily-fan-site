import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

// The owner's authorized recording of this afternoon live (14:53-15:08 JST of a 14:45-15:15 live; opening and closing minutes not recorded).
// Photos and the three short excerpts are from this live only.
// Handwritten names on the background sticky notes are hidden with flat paper-colored fills (no generative edits, no face or body edits).
const moments = [
  [2, "hello-cheek", "ほおに手を添えて笑うみりぃ", "ほっぺに手を添えて"],
  [240, "both-cheeks", "両手でほおを包んで笑うみりぃ", "今日は泣かない"],
  [391, "head-tilt", "首をかしげて歌うみりぃ", "歌唱中"],
  [478, "hands-together", "両手を合わせてほおに寄せるみりぃ", "両手を合わせて"],
  [620, "point-smile", "指を立てて笑うみりぃ", "イカのポーズの前に"],
  [630, "close-smile", "カメラに近づいて笑うみりぃ", "カメラに近づいて"],
  [668, "cat-paws", "両手を前に出してほおをふくらませるみりぃ", "タコのポーズ"],
  [700, "thinking", "口元に指を当てて考えるみりぃ", "崖っぷち"],
  [845, "bunny-ears", "うさ耳をつけて笑うみりぃ", "うさ耳"],
  [860, "bunny-ears-up", "両手でうさ耳を押さえて笑うみりぃ", "うさ耳で最後に"],
] as const;
const clock = (s: number) => `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
export const afternoon20261102Gallery: StreamRecapImage[] = moments.map(([seconds, slug, alt, label], i) => {
  const filename = `mily-b249-${String(i + 1).padStart(2, "0")}-20261102-afternoon-${slug}.jpg`;
  return { src: `/media/live/${filename}`, width: 640, height: 360, alt, caption: `${clock(seconds)}｜${label}`, downloadName: filename };
});
const clip = (n: number, slug: string, durationSeconds: number, sourceTimestamp: string) => ({
  src: `/media/live-clips/mily-b249-${n}-20261102-afternoon-${slug}.mp4`,
  poster: `/media/live/mily-b249-${n}-20261102-afternoon-${slug}-cover.jpg`,
  width: 640,
  height: 360,
  durationSeconds,
  sourceTimestamp,
});

export const streamRecap1102Afternoon: StreamRecap = {
  id: "2026-11-02-afternoon-showroom",
  date: "2026-11-02",
  dateLabel: "2026.11.02（月）",
  theme: "昼の崖っぷち宣言と笑顔",
  broadcastLabel: "14:45頃〜 約30分",
  platformLabel: "SHOWROOM",
  summary: "WEB投票5日目の昼枠。「今日は泣かない」と決めて笑顔を通し、「今はこの気分」という1曲を歌いました。リクエストに応えてイカ・タコ・にゃんのポーズで盛り上げ、初めて来た人へ「セミファイナルは崖っぷち。私のことを知ってほしい」と自己紹介しました。",
  image: afternoon20261102Gallery[0],
  gallery: afternoon20261102Gallery,
  highlights: [
    { timestamp: "0:00:30", title: "みんなが優しくて", body: "最初の頃はメイクをしなきゃと気負っていたけれど、みんなが優しくて本当にありがとうと伝えました。" },
    { timestamp: "0:01:36", title: "投票5日目", body: "WEB投票はとても大事と話し、みんなを信じていると伝えました。4日目と言い間違えて5日目と笑って訂正し、画面右上のハートをタップしてピンクにしてほしいと呼びかけました。" },
    { timestamp: "0:03:05", title: "見つけてもらうところから", body: "まだ見つけてもらえていないことが多いので、みんなに見つけてもらうところから始まると話し、フォロワーがあと少しで400人になることを喜びました。" },
    { timestamp: "0:04:20", title: "今日は泣かない", body: "前日はたくさん泣いたけれど、今日は泣かないと決めてきたと宣言。うるっとしそうになりながらも笑顔で通しました。" },
    { timestamp: "0:04:35", title: "今の気分の1曲", body: "声の調子が良いので歌いたいと話し、「今はこれの気分だった」という1曲を歌いました（曲名は未確認）。" },
    { timestamp: "0:10:34", title: "イカのポーズは真顔で", body: "リクエストに応えてイカとタコのポーズを披露。「イカは真顔でやることが大事です」と言って、両腕を上げたポーズを決めました。", clip: clip(11, "ika-pose", 18.1, "0:10:34") },
    { timestamp: "0:11:36", title: "崖っぷちのセミファイナル", body: "初めて来た人へ、MISS CIRCLE CONTESTに出場中の三橋莉子と自己紹介。セミファイナルは崖っぷちと明かし、応援してもらえる人間になりたい、私のことを知ってほしいと伝えました。", quote: "私のことを知ってほしいな、見ててね", clip: clip(12, "gakeppuchi", 15.5, "0:11:36") },
    { timestamp: "0:12:57", title: "愛してるにゃん", body: "リクエストに応えて、ねこのポーズで「愛してるにゃん」「あなたの帰りを待ってたにゃん」を披露。終盤はうさ耳をつけて、もう一度にゃんにゃんで盛り上げました。", clip: clip(13, "aishiteru-nyan", 15.7, "0:12:57") },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:00:30", label: "みんなの優しさにありがとう" },
    { timestamp: "0:01:36", label: "投票5日目の呼びかけ" },
    { timestamp: "0:02:31", label: "右上のハートをピンクに" },
    { timestamp: "0:03:05", label: "見つけてもらうところから・400人目前" },
    { timestamp: "0:03:46", label: "青が好き・今日の服の色" },
    { timestamp: "0:04:20", label: "今日は泣かない" },
    { timestamp: "0:05:17", label: "1曲歌唱（曲名は未確認）" },
    { timestamp: "0:09:22", label: "歌い終えてお礼" },
    { timestamp: "0:10:00", label: "リクエストでタコ・イカのポーズ" },
    { timestamp: "0:11:22", label: "初めての人への自己紹介" },
    { timestamp: "0:12:12", label: "リクエストでにゃんにゃん" },
    { timestamp: "0:13:58", label: "うさ耳でもう一度にゃんにゃん" },
  ],
  nextNote: "配信時点の録画範囲では、次の配信の時刻の案内は確認できていません。",
  sourceLabel: "2026年11月2日 昼のSHOWROOM配信（保存録画の自動文字起こし・実フレーム確認）",
  verifiedAt: "2026-11-02",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画の実フレーム10枚を掲載しています。",
    publishedClips: true,
    extra: "見どころとタイムスタンプの時刻は録画先頭からの目安です。配信は14:45頃開始・15:15頃終了で、録画は14:53頃からの約14分です。冒頭約8分と、途中の約40秒、15:08頃以降の終盤約7分は録画に含まれていないため、本文にも書いていません。配信の正式な終了時刻は確認していません。背景の付箋に書かれた名前は、無地の紙色で隠しています。顔や身体の生成・補正はしていません。短尺3本は同じ回の録画から切り出した本人のトークとポーズで、元の音声を保持しています。歌唱は1曲確認しましたが、曲名は確認できていないため曲リストは作っていません。ランキングの読み上げは録画範囲で確認していません。原音の全編手動聴取・逐語校正は未実施です。",
  }),
};
