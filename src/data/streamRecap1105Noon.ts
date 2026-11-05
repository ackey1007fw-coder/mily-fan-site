import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

// The owner's authorized recording of this noon live (about 14:45-15:16 JST, about 31 minutes, start to end).
// Photos are real frames from this live only (no generative edits). This live was streamed from a car seat; no sticky
// notes were held up (the screenshot-time poses were taken without notes). The hero image is a magazine-style page that
// only arranges these 10 frames with text (resize/crop only).
const moments = [
  [24, "heart-hand", "片手でハートを作って笑うみりぃ", "車からこんにちは"],
  [95, "hand-cheek", "ほおに手をそえて笑うみりぃ", "眠いけどがんばる"],
  [765, "after-song", "歌い終わって笑うみりぃ", "高嶺の花子さんのあと"],
  [1009, "nutrient-smile", "にっこり笑うみりぃ", "ファンレベルの節目"],
  [1047, "chin-smile", "あごに手をそえて笑うみりぃ", "うれしい報告"],
  [1460, "pose-hand", "手をのばしてポーズするみりぃ", "スクショタイム"],
  [1471, "pose-cheek", "両手をほおにそえてポーズするみりぃ", "スクショタイム"],
  [1503, "rainbow-surprise", "両手で口元をおさえて笑うみりぃ", "ビッグレインボースター"],
  [1702, "hand-up", "手をあげて笑うみりぃ", "泣かないって決めた"],
  [1822, "wave-bye", "手を振って笑うみりぃ", "お昼もありがとう"],
] as const;
const clock = (s: number) => `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
export const noon20261105Gallery: StreamRecapImage[] = moments.map(([seconds, slug, alt, label], i) => {
  const filename = `mily-b256-${String(i + 1).padStart(2, "0")}-20261105-noon-${slug}.jpg`;
  return { src: `/media/live/${filename}`, width: 640, height: 360, alt, caption: `${clock(seconds)}｜${label}`, downloadName: filename };
});
export const noon20261105Collage: StreamRecapImage = {
  src: "/media/live/mily-b256-00-20261105-noon-magazine-collage.jpg",
  width: 1280,
  height: 720,
  alt: "11月5日昼のみりぃの写真10枚を並べた雑誌風のフォトページ",
  caption: "11月5日昼のフォトページ（当日録画の実フレーム10枚）",
  downloadName: "mily-b256-00-20261105-noon-magazine-collage.jpg",
};

const dataLink = [{ label: "MILY SIGNAL・11月5日昼の観測と確認範囲", url: "/data-lab/reports/20261105-noon/" }];

export const streamRecap1105Noon: StreamRecap = {
  id: "2026-11-05-noon-showroom",
  date: "2026-11-05",
  dateLabel: "2026.11.05（木）",
  theme: "昼は車から高嶺の花子さん",
  broadcastLabel: "14:45頃〜 約31分",
  platformLabel: "SHOWROOM",
  summary: "この日のお昼は車の中から。眠そうに笑いながら、back number「高嶺の花子さん」を最後まで歌ってくれました。スクショタイムのポーズ、ビッグレインボースターへのびっくり顔、「もう泣かないって決めたんだ」。最後は「こんなにお昼たくさん来てもらえると思わなくて」とお礼。",
  image: noon20261105Collage,
  gallery: [noon20261105Collage, ...noon20261105Gallery],
  songs: [
    { title: "高嶺の花子さん", artist: "back number", timestamp: "0:08:50", youtubeUrl: "https://www.youtube.com/watch?v=SII-S-zCg-c" },
  ],
  highlights: [
    { timestamp: "0:00:21", title: "ちょっと今ね、車なんだ", body: "「やっほー、来てくれてありがとう」と、この日は車の中からスタート。少し逆光で、とても眠そうにしながらも、明るくあいさつしてくれました。" },
    { timestamp: "0:08:50", title: "高嶺の花子さん", body: "車からの1曲目として、back number「高嶺の花子さん」を最後まで歌いました。" },
    { timestamp: "0:13:55", title: "もう泣かないって決めたんだ", body: "「もう泣かないって決めたんだ」「みんな泣いてる顔見たいんだろ」と笑って宣言。" },
    { timestamp: "0:16:15", title: "もうちょっと可愛い顔に見に来て", body: "メイクなしでお疲れ顔だから、と照れながら「もうちょっと可愛い顔に見に来てもらっていいですか？」。" },
    { timestamp: "0:20:00", title: "ファイナルへ", body: "予測順位の話から、ここまで上がれたことへの感謝と、「絶対頑張る」とファイナルへの思いを話しました。", relatedLinks: dataLink },
    { timestamp: "0:24:18", title: "スクショタイム", body: "ファンレベルの節目を迎えたリスナーさんとのスクショタイム。この日は付箋がないので、ポーズで撮っておいて、次の枠で書くと約束しました。" },
    { timestamp: "0:24:53", title: "ビッグレインボースター", body: "ビッグレインボースターに「今見たわ！」とびっくり。「嬉しい…いや、泣かないって決めた！」と笑顔を見せました。" },
    { timestamp: "0:30:30", title: "お昼もありがとう", body: "ランキングを読み上げたあと、「こんなにお昼たくさんの方に来てもらえると思わなくて」とお礼。夜の企画への参加を呼びかけて、おつみり。" },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:00:00", label: "車からのお昼枠" },
    { timestamp: "0:08:50", label: "高嶺の花子さん" },
    { timestamp: "0:13:55", label: "もう泣かない宣言" },
    { timestamp: "0:20:00", label: "ファイナルへの思い" },
    { timestamp: "0:24:18", label: "スクショタイム" },
    { timestamp: "0:24:53", label: "ビッグレインボースター" },
    { timestamp: "0:30:30", label: "おつみり" },
  ],
  nextNote: "配信時点では、この日の21:30から企画配信をすると案内していました。",
  sourceLabel: "2026年11月5日 昼のSHOWROOM配信（保存録画の自動文字起こし・実フレーム確認）",
  verifiedAt: "2026-11-05",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画の実フレーム10枚と、その10枚を並べたフォトページ1枚を掲載しています。",
    publishedClips: false,
    extra: "見どころとタイムスタンプの時刻は録画先頭からの目安です。録画は14:45頃の開始から終了までの約31分です。この回は手に持った付箋が写る場面はありません。顔や身体の生成・補正はしていません。動画は掲載していません。原音の全編手動聴取・逐語校正は未実施です。",
  }),
};
