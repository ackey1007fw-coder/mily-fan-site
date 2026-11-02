import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, RANKING_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

// The owner's own authorized recording of this noon live. Photos and the three talk excerpts are from this live only.
// Handwritten names on the background sticky notes are hidden with flat paper-colored fills (no generative edits, no face or body edits).
const moments = [
  [52, "hoodie-wave", "パーカー姿で手を振ってあいさつするみりぃ", "ただいまのあいさつ"],
  [194, "teal-smile", "青緑のトップスに着替えて笑うみりぃ", "着替えてにっこり"],
  [362, "chin-hands", "両手をあごの下にそろえて話すみりぃ", "おしゃべり中"],
  [552, "hands-head", "両手を頭の後ろに回して笑うみりぃ", "両手を頭に"],
  [980, "big-smile", "カメラに向かって大きく笑うみりぃ", "大きな笑顔"],
  [1074, "double-peace", "顔の横で両手のピースをするみりぃ", "両手でピース"],
  [1410, "cheek-frame", "両手で顔を包むようにして笑うみりぃ", "両手でほっぺ"],
  [1600, "point-vote", "上を指さしながら投票の方法を説明するみりぃ", "投票のやり方を説明"],
  [1630, "bright-smile", "明るい笑顔でカメラを見るみりぃ", "明るい笑顔"],
  [1800, "hands-together-goodbye", "両手を合わせてほほえむみりぃ", "最後のごあいさつ"],
] as const;
const clock = (s: number) => `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
export const noon20261101Gallery: StreamRecapImage[] = moments.map(([seconds, slug, alt, label], i) => {
  const filename = `mily-b247-${String(i + 1).padStart(2, "0")}-20261101-noon-${slug}.jpg`;
  return { src: `/media/live/${filename}`, width: 640, height: 360, alt, caption: `${clock(seconds)}｜${label}`, downloadName: filename };
});
const clip = (n: number, slug: string, durationSeconds: number, sourceTimestamp: string) => ({
  src: `/media/live-clips/mily-b247-${n}-20261101-noon-${slug}.mp4`,
  poster: `/media/live/mily-b247-${n}-20261101-noon-${slug}-cover.jpg`,
  width: 640,
  height: 360,
  durationSeconds,
  sourceTimestamp,
});

export const streamRecap1101Noon: StreamRecap = {
  id: "2026-11-01-noon-showroom",
  date: "2026-11-01",
  dateLabel: "2026.11.01（日）",
  theme: "昼のラジオ明けの決意",
  broadcastLabel: "14:45頃〜 約30分",
  platformLabel: "SHOWROOM",
  summary: "ラジオの生放送を終えての昼枠。放送の反省を素直に話しつつ、師匠に褒められた喜びや初めての美容室の話、セミファイナルへの思いとWEB投票のやり方を伝えました。",
  image: noon20261101Gallery[5],
  gallery: noon20261101Gallery,
  highlights: [
    { timestamp: "0:00:30", title: "ラジオ明けのごあいさつ", body: "この日のラジオの生放送を終えての昼枠。来てくれたみんなにお礼を伝えつつ、放送中に計算でつまずいた場面を振り返り、自分の中で反省が大きいと話しました。" },
    { timestamp: "0:06:20", title: "リスナー目線で楽しんで", body: "面白さを届けるのも仕事のひとつと話し、リスナー目線で楽しんでもらえていたらうれしいと伝えました。しっかり寝て精進するとも話しています。" },
    { timestamp: "0:07:23", title: "師匠に褒められた回", body: "この日のラジオは、師匠がみりぃの好きなところを言ってくれる回。たくさん褒めてもらえて、泣きそうになったと振り返りました。" },
    { timestamp: "0:10:37", title: "お気に入りの色の服", body: "着替えた青緑のトップスを、この色が好きと紹介。かわいいでしょと笑顔を見せました。" },
    { timestamp: "0:18:45", title: "初めての美容室", body: "髪を切って明るくしたのは、初めて行った美容室。仕上がりに満足して、またそこへ通おうかなと話していました。" },
    { timestamp: "0:20:05", title: "セミファイナルの真っ最中", body: "初めて来た人へ自己紹介し、MISS CIRCLE CONTESTのセミファイナルを通過できるのは今いる人のおよそ3分の1と説明。一緒に見届けてほしいと呼びかけました。", clip: clip(11, "semifinal-intro", 38.8, "0:20:05") },
    { timestamp: "0:26:20", title: "WEB投票のやり方", body: "横画面のバナーからプロフィールのリンクへ進み、WEB投票を押してLINE認証、元のページに戻って投票する流れを、指さしながら説明しました。", clip: clip(12, "vote-guide", 48.25, "0:26:20") },
    { timestamp: "0:30:00", title: "あきらめずに頑張る", body: "ランキングの読み上げのあと、泣きそうになりながらも、これからも頑張ると宣言。次の配信で会おうと手を振りました。", quote: "これからも頑張っていこうと思うので", clip: clip(13, "never-give-up-goodbye", 17.96, "0:30:00") },
  ],
  goals: [],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:20", label: "ラジオ明けのごあいさつ" },
    { timestamp: "0:01:40", label: "ラジオの反省" },
    { timestamp: "0:02:50", label: "青緑のトップスに着替え" },
    { timestamp: "0:06:20", label: "リスナー目線の話" },
    { timestamp: "0:07:23", label: "ラジオで師匠に褒められた話" },
    { timestamp: "0:07:48", label: "キラ星審査の呼びかけ" },
    { timestamp: "0:09:40", label: "セミファイナル期間の説明" },
    { timestamp: "0:10:37", label: "お気に入りの色の服" },
    { timestamp: "0:18:45", label: "初めての美容室の話" },
    { timestamp: "0:20:05", label: "初めての人への自己紹介" },
    { timestamp: "0:26:20", label: "WEB投票のやり方" },
    { timestamp: "0:29:15", label: "ランキングの読み上げ" },
    { timestamp: "0:30:00", label: "次の配信の案内とお別れ" },
  ],
  nextNote: "配信時点では、次の配信は同じ日の22時半からと案内していました。",
  sourceLabel: "2026年11月1日 昼のSHOWROOM配信（保存録画の自動文字起こし・実フレーム確認）",
  verifiedAt: "2026-11-01",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画の実フレーム10枚を掲載しています。",
    publishedClips: true,
    extra: "見どころとタイムスタンプの時刻は録画先頭からの目安です。録画は14:45頃から約30分で、配信の正式な終了時刻は確認していません。背景の付箋に書かれた名前は、無地の紙色で隠しています。顔や身体の生成・補正はしていません。短尺3本は同じ回の録画から切り出した本人のトークで、元の音声を保持しています。この回は歌の場面を確認していません。原音の全編手動聴取・逐語校正は未実施です。",
  }),
};
