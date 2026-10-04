import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

const moments = [
  [1, "0:00:30", "手を振って笑うみりぃ"],
  [2, "0:10:00", "穏やかな表情で話すみりぃ"],
  [3, "0:15:00", "カメラに笑顔を向けるみりぃ"],
  [4, "0:20:00", "胸の前で手を合わせるみりぃ"],
  [5, "0:25:00", "マイクに手を添えて笑うみりぃ"],
  [6, "0:30:00", "頭に両手を添えるみりぃ"],
  [7, "0:35:00", "両手を振るみりぃ"],
  [8, "0:40:00", "カメラに両手を広げるみりぃ"],
] as const;
const gallery = moments.map(([index, time, alt]) => {
  const downloadName = `mily-b190-${String(index).padStart(2, "0")}-20261004-night-still.jpg`;
  return { src: `/media/live/${downloadName}`, width: 380, height: 360, alt, caption: `${time}｜${alt}`, downloadName };
});

export const streamRecap20261004Night: StreamRecap = {
  id: "2026-10-04-night-showroom", date: "2026-10-04", dateLabel: "2026.10.04（日）",
  theme: "夜のラジオとありがとう", broadcastLabel: "録画開始22:30頃〜 約46分", platformLabel: "SHOWROOM",
  summary: "ラジオ1周年の余韻を話しながら、みんなの応援にありがとう。服の見え方をめぐるおしゃべりや、来られる時間に合わせた配信の話、もっと知ってもらいたいという思いを振り返ります。",
  image: gallery[4], gallery,
  galleryNote: "当日の保存録画から選んだ実フレーム8枚です。写真の時刻は録画の先頭からの目安です。",
  highlights: [
    { timestamp: "0:05:53", title: "ラジオ1周年の余韻", body: "お祝いへのお礼を伝えながら、その日のラジオを振り返りました。ラジオの話をたくさんできたことにも触れています。" },
    { timestamp: "0:07:20", title: "服の色はどう見える？", body: "画面を通した服の色の見え方が話題になりました。みんなとのやりとりを交え、身近なおしゃべりが続きます。" },
    { timestamp: "0:12:01", title: "あっという間の一日", body: "ラジオも配信もあっという間だったと、その日の時間を振り返りました。充実した一日の余韻をみんなと分かち合います。" },
    { timestamp: "0:17:27", title: "来られる時間に合わせて", body: "来られる時間が人によって違うことを踏まえて、昼の枠も設けた理由を話しました。応援してくれる人との時間を大切にする思いが伝わります。" },
    { timestamp: "0:20:11", title: "応援の輪を広げたい", body: "きっかけ配信に挑戦した理由を話しました。もっと応援を集めたいという思いを伝えています。" },
    { timestamp: "0:31:37", title: "もっと知ってもらいたい", body: "もっと多くの人に自分を知ってもらいたいという思いを語りました。これからも頑張りたいという気持ちを伝えています。" },
    { timestamp: "0:38:53", title: "盛り上げてくれてありがとう", body: "一緒に盛り上げてくれたみんなへ、何度もありがとうを伝えました。夜の配信の終盤も、お礼の言葉が続きます。" },
  ],
  goals: [], ranking: [],
  timeline: [
    { timestamp: "0:05:53", label: "ラジオ1周年の振り返り" },
    { timestamp: "0:07:20", label: "服の色についてのやりとり" },
    { timestamp: "0:12:01", label: "ラジオと配信を振り返る" },
    { timestamp: "0:16:57", label: "ラジオの締めの言葉を振り返る" },
    { timestamp: "0:17:27", label: "昼の配信枠を設けた理由" },
    { timestamp: "0:20:11", label: "きっかけ配信への挑戦" },
    { timestamp: "0:31:37", label: "もっと知ってもらいたいという思い" },
    { timestamp: "0:38:53", label: "盛り上がった時間への感謝" },
    { timestamp: "0:45:22", label: "終わりの挨拶" },
  ],
  nextNote: "",
  sourceLabel: "2026年10月4日 夜のSHOWROOM配信（保存録画・自動文字起こし）", verifiedAt: "2026-10-05",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の録画の実フレーム8枚です。",
    extra: "保存音声の全入力を10区間に分けて自動文字起こしした要約です。全編の手動聴取・逐語校正は未実施です。見どころとタイムラインの時刻は音声内の目安で、写真は録画内の目安です。音声と映像の厳密な対応は未検証です。放送枠は録画開始と録画の長さを示し、真の配信開始・全尺を確定したものではありません。曲名・歌詞・個人名・ギフト個数・順位は掲載していません。歌唱とトークの短尺動画は検品未完了のため掲載していません。次枠の候補は現在の確定予定へ転記していません。",
  }),
};
