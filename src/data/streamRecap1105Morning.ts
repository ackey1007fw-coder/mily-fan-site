import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

// The owner's authorized recording of this morning live (about 6:00-6:31 JST, about 31 minutes, start to end).
// Photos are real frames from this live only (no generative edits). The hand-held sticky note shown around 0:27 carries a
// viewer name, so no still or clip from that moment is used. Background sticky notes stay as they are.
// The hero image is a magazine-style page that only arranges these 10 frames with text (resize/crop only).
const moments = [
  [58, "hands-face", "両手を顔の横で広げて笑うみりぃ", "朝のごあいさつ"],
  [478, "hood-strings", "フードをかぶってひもを持つみりぃ", "フードで寒さ対策"],
  [629, "hood-tilt", "フードをかぶって首をかしげて笑うみりぃ", "にゃんにゃんの前"],
  [841, "hood-sing", "フードをかぶって歌うみりぃ", "パンクバージョン"],
  [902, "hood-laugh", "フードをかぶって目を細めて笑うみりぃ", "朝のにゃんにゃん終わり"],
  [988, "hand-hair", "髪に手をそえて笑うみりぃ", "笑顔全開"],
  [1321, "fight-wave", "手をふりながら歌うみりぃ", "倍倍FIGHT!"],
  [1416, "open-hands", "両手をひらいて笑うみりぃ", "倍倍FIGHT!のサビ"],
  [1828, "hand-up", "手をあげて笑うみりぃ", "30分ありがとう"],
  [1866, "wave-bye", "手を振るみりぃ", "いってきます"],
] as const;
const clock = (s: number) => `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
export const morning20261105Gallery: StreamRecapImage[] = moments.map(([seconds, slug, alt, label], i) => {
  const filename = `mily-b255-${String(i + 1).padStart(2, "0")}-20261105-morning-${slug}.jpg`;
  return { src: `/media/live/${filename}`, width: 640, height: 360, alt, caption: `${clock(seconds)}｜${label}`, downloadName: filename };
});
export const morning20261105Collage: StreamRecapImage = {
  src: "/media/live/mily-b255-00-20261105-morning-magazine-collage.jpg",
  width: 1280,
  height: 720,
  alt: "11月5日朝のみりぃの写真10枚を並べた雑誌風のフォトページ",
  caption: "11月5日朝のフォトページ（当日録画の実フレーム10枚）",
  downloadName: "mily-b255-00-20261105-morning-magazine-collage.jpg",
};

const dataLink = [{ label: "MILY SIGNAL・11月5日朝の観測と確認範囲", url: "/data-lab/reports/20261105-morning/" }];

export const streamRecap1105Morning: StreamRecap = {
  id: "2026-11-05-morning-showroom",
  date: "2026-11-05",
  dateLabel: "2026.11.05（木）",
  theme: "朝のフードと倍倍FIGHT!",
  broadcastLabel: "6:00頃〜 約31分",
  platformLabel: "SHOWROOM",
  summary: "「寒いね」とフードをかぶってぬくぬくの朝枠。にゃんにゃんにゃんを普通バージョンとパンクバージョンで歌い、「みんなにがんばれの気持ちを込めて」倍倍FIGHT!を最後まで届けてくれました。締めは「いってきます、みんなもいってらっしゃい」。",
  image: morning20261105Collage,
  gallery: [morning20261105Collage, ...morning20261105Gallery],
  highlights: [
    { timestamp: "0:06:29", title: "黒い服、あんまりない", body: "服の色の話になり、黒い服はあまり持っていなくて、色ものや白ばかりなんだそう。黒がほしいときのために、意識して集めることもあると教えてくれました。" },
    { timestamp: "0:10:46", title: "にゃんにゃんにゃん", body: "フードをかぶったまま、にゃんにゃんにゃん。歌い終わると、続けてパンクバージョンへ。" },
    { timestamp: "0:12:46", title: "パンクバージョンで最後まで", body: "「もう1回、最後まで行けばいいの？」とパンクバージョンへ。ねこの手のポーズも見せてくれて、「朝のにゃんにゃん終わりー！」で締めました。" },
    { timestamp: "0:20:50", title: "倍倍FIGHT!", body: "朝早くから見に来てくれたみんなへ、「がんばれの気持ちを込めて」倍倍FIGHT!。手をふったり、両手を広げたり、全身で歌ってくれました。", relatedLinks: dataLink },
    { timestamp: "0:25:37", title: "今日はうさみみなし", body: "「今日はうさみみないからね」と笑って、「朝だから、みんなと一緒に元気に」。" },
    { timestamp: "0:30:49", title: "いってきます", body: "次の配信の予定を伝えて、「いってきます、そしてみんなもいってらっしゃい」と手を振って朝枠を締めくくりました。" },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:00:00", label: "朝のはじまり" },
    { timestamp: "0:06:29", label: "黒い服の話" },
    { timestamp: "0:10:46", label: "にゃんにゃんにゃん" },
    { timestamp: "0:12:46", label: "パンクバージョン" },
    { timestamp: "0:20:50", label: "倍倍FIGHT!" },
    { timestamp: "0:25:37", label: "今日はうさみみなし" },
    { timestamp: "0:30:49", label: "いってきます" },
  ],
  nextNote: "",
  sourceLabel: "2026年11月5日 朝のSHOWROOM配信（保存録画の自動文字起こし・実フレーム確認）",
  verifiedAt: "2026-11-05",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画の実フレーム10枚と、その10枚を並べたフォトページ1枚を掲載しています。",
    publishedClips: false,
    extra: "見どころとタイムスタンプの時刻は録画先頭からの目安です。録画は6:00頃の開始から終了までの約31分です。手に持った付箋が写る場面の写真は使っていません。背景の付箋はそのまま写っています。顔や身体の生成・補正はしていません。動画は掲載していません。原音の全編手動聴取・逐語校正は未実施です。",
  }),
};
