import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

const moments = [
  ["0:02:45", "opening-laugh", "笑顔で始まるオープニング"],
  ["0:07:07", "soft-apology", "やわらかな表情で話す場面"],
  ["0:11:22", "tilt-laugh", "首をかしげて笑う場面"],
  ["0:20:47", "hair-touch-smile", "髪に触れながらの笑顔"],
  ["0:24:30", "serious-talk", "真剣に話す場面"],
  ["0:34:27", "puzzle-smile", "パズルに夢中な笑顔"],
  ["0:46:12", "lean-talk", "身を乗り出して話す場面"],
  ["0:49:27", "front-smile", "正面からの笑顔"],
  ["0:53:27", "bright-smile", "明るい笑顔"],
  ["1:09:52", "closing-smile", "締めくくりの笑顔"],
] as const;

export const night20261109Gallery: StreamRecapImage[] = moments.map(([time, slug, label], i) => {
  const filename = `mily-b260-${String(i + 1).padStart(2, "0")}-20261109-night-${slug}.jpg`;
  return { src: `/media/live/${filename}`, width: 640, height: 360, alt: `みりぃの${label}`, caption: `${time}｜${label}`, downloadName: filename };
});

export const streamRecap1109Night: StreamRecap = {
  id: "2026-11-09-night-showroom",
  date: "2026-11-09",
  dateLabel: "2026.11.09（月）",
  theme: "夜のゆるっとおしゃべり",
  broadcastLabel: "録画開始22:30頃〜 約71分",
  platformLabel: "SHOWROOM",
  summary: "11月9日夜は、セミファイナルの結果発表を待つ中での、ゆるっとした雑談枠でした。数字パズルで盛り上がり、感情との向き合い方や口癖の由来など、素顔のトークが多い夜になりました。",
  image: night20261109Gallery[9],
  gallery: night20261109Gallery,
  galleryZip: {
    src: "/media/live/mily-b260-20261109-night-photos.zip",
    filename: "mily-20261109-night-photos.zip",
    label: "この回のスクショ10枚をまとめて保存",
  },
  highlights: [
    { timestamp: "0:02:45", title: "ゆるっと夜枠のはじまり", body: "PCの充電トラブルで、この日はPCを使わずに開始しました。セミファイナルの結果への受け止めと、応援へのお礼から始まりました。" },
    { timestamp: "0:07:07", title: "心配をかけたことへの言葉", body: "前日から心配をかけていたことを謝り、この日はゆるっと話す夜にしようと伝えていました。" },
    { timestamp: "0:20:47", title: "お風呂上がりの近況トーク", body: "お風呂上がりの近況を話し、ライチの香りのボディクリームを紹介しました。" },
    { timestamp: "0:34:27", title: "数字パズルで大盛り上がり", body: "数字を組み合わせて24を作るパズルに挑戦し、解けた瞬間はひときわ盛り上がりました。" },
    {
      timestamp: "0:46:06", title: "感情との向き合い方", body: "怒りをそのままぶつけない工夫や、感情の伝え方について話しました。キャッチコピー「喜怒哀楽を全力で楽しむ」への共感も語られました。",
      clip: { src: "/media/live-clips/mily-b260-11-20261109-night-emotion-talk.mp4", poster: "/media/live-clips/mily-b260-11-20261109-night-emotion-talk-poster.jpg", width: 640, height: 360, durationSeconds: 26.9, sourceTimestamp: "0:46:06" },
    },
    {
      timestamp: "0:59:27", title: "口癖「ボンズ」の由来", body: "口癖の「ボンズ」は、もとの「ボーズ」をそのまま言うのは強すぎると感じて変えた、という由来が明かされました。",
      clip: { src: "/media/live-clips/mily-b260-12-20261109-night-bonzu-origin.mp4", poster: "/media/live-clips/mily-b260-12-20261109-night-bonzu-origin-poster.jpg", width: 640, height: 360, durationSeconds: 22.1, sourceTimestamp: "0:59:27" },
    },
    {
      timestamp: "1:10:35", title: "寝る前のバイバイ", body: "お風呂も済んで「あとは寝るだけ」と伝え、宝くじで資金調達という冗談を交えながら、おやすみの挨拶をしました。",
      clip: { src: "/media/live-clips/mily-b260-13-20261109-night-goodbye.mp4", poster: "/media/live-clips/mily-b260-13-20261109-night-goodbye-poster.jpg", width: 640, height: 360, durationSeconds: 19.5, sourceTimestamp: "1:10:35" },
    },
    {
      timestamp: "1:11:04", title: "本当の締めの挨拶", body: "最後に翌朝6時からの配信を案内し、「また明日会いましょう」「おやすみでーす」で締めくくりました。",
      clip: { src: "/media/live-clips/mily-b260-14-20261109-night-last-goodbye.mp4", poster: "/media/live-clips/mily-b260-14-20261109-night-last-goodbye-poster.jpg", width: 640, height: 360, durationSeconds: 13.3, sourceTimestamp: "1:11:04" },
    },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:02:45", label: "ゆるっと夜枠の開始とお礼" },
    { timestamp: "0:07:07", label: "心配をかけたことへの言葉" },
    { timestamp: "0:20:47", label: "ボディクリームと近況トーク" },
    { timestamp: "0:34:27", label: "数字パズル「24を作る」" },
    { timestamp: "0:46:06", label: "感情との向き合い方" },
    { timestamp: "0:59:27", label: "口癖「ボンズ」の由来" },
    { timestamp: "1:10:35", label: "寝る前のバイバイ" },
    { timestamp: "1:11:04", label: "締めの挨拶と翌朝の案内" },
  ],
  nextNote: "配信時点では、翌朝6時から6時半に配信すると案内していました。",
  sourceLabel: "2026年11月9日 夜のSHOWROOM配信（保存録画の自動文字起こし・実フレーム確認）",
  verifiedAt: "2026-11-10",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画の実フレーム10枚を掲載しています。",
    publishedClips: true,
    extra: "本文は自動文字起こしに基づく要約で、原音の手動聴取・逐語校正は未実施です。時刻は録画先頭からの目安です。保存録画の実尺は71分16.914秒で、録画開始から保存処理の終了までの時計上の幅とは約66秒異なります。録画の全区間の連続性は未確認です。短尺は原音付きで、歌唱のない雑談部分から切り出しています。短尺の掲載範囲は、別の自動認識でも照合しています。",
  }),
};
