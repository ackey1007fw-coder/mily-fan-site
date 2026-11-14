import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

const moments = [
  ["0:46:30", "serious-look", "映像がついた直後の真剣な表情"],
  ["0:48:00", "thinking", "考えこむ表情"],
  ["0:49:30", "smile", "笑顔で話す場面"],
  ["0:51:00", "hair-touch", "髪に触れて話す場面"],
  ["0:52:30", "talking", "話す場面"],
  ["0:54:00", "lean-in", "身を乗り出して話す場面"],
  ["0:57:00", "tearful-soft", "涙ぐんだ表情"],
  ["0:58:30", "big-laugh", "大きな笑いの場面"],
  ["1:00:00", "bright-smile", "明るい笑顔"],
  ["1:03:00", "hand-on-chest", "胸に手を当てて話す場面"],
] as const;

export const night20261113Gallery: StreamRecapImage[] = moments.map(([time, slug, label], i) => {
  const filename = `mily-b263-${String(i + 1).padStart(2, "0")}-20261113-night-${slug}.jpg`;
  return { src: `/media/live/${filename}`, width: 640, height: 360, alt: `みりぃの${label}`, caption: `${time}｜${label}`, downloadName: filename };
});

export const streamRecap20261113Night: StreamRecap = {
  id: "2026-11-13-night-showroom",
  date: "2026-11-13",
  dateLabel: "2026.11.13（金）",
  theme: "夜の本音トークと相談",
  broadcastLabel: "20:45頃〜 約64分",
  platformLabel: "SHOWROOM",
  summary: "11月13日夜は、予定より早く始まったゲリラ配信でした。前半は映像のない声だけの時間でイベントの相談をし、後半は顔出しで、応援してくれる人への思いを涙ながらに打ち明けました。",
  image: night20261113Gallery[8],
  gallery: night20261113Gallery,
  galleryZip: {
    src: "/media/live/mily-b263-20261113-night-photos.zip",
    filename: "mily-20261113-night-photos.zip",
    label: "この回のスクショ10枚をまとめて保存",
  },
  highlights: [
    { timestamp: "0:00:35", title: "帰宅直後のゲリラ開始", body: "帰宅したばかりのタイミングで急きょ始まりました。充電器を忘れたことに気づく場面もあり、初めましての人が多く集まるにぎやかな始まりでした。" },
    { timestamp: "0:20:00", title: "湘南イベントの相談", body: "参加中の湘南PRイベントを続けるか、別のイベントへ乗り換えるか、集まった人たちと相談しました。結論は急がず、考える時間にする様子でした。" },
    { timestamp: "0:39:00", title: "ドラゴンボールの台詞遊び", body: "昔の漫画の話題から、ドラゴンボールZの台詞まねで盛り上がりました。相談の合間の、笑いの多い時間でした。" },
    { timestamp: "0:45:30", title: "後半は顔出しで", body: "録画の開始から約45分は映像が真っ黒な声だけの時間でした。後半は映像をつけて顔出しになり、ここからは気持ちを打ち明ける時間になりました。" },
    { timestamp: "0:46:50", title: "涙ながらの本音トーク", body: "応援してくれる人を幸せにできているか、自分の進み方が分からなくなる気持ちを、涙ながらに打ち明けました。励ましのコメントが多く集まりました。" },
    { timestamp: "0:58:56", title: "有り余る力と、出し切れない悔しさ", body: "「全然疲れ切ってない」「有り余ってる力をうまく発揮できてなくて悔しい」——まだまだできるはずなのに出し切れていない、という悔しさを率直に言葉にしていました。", clip: { src: "/media/live-clips/mily-b263-11-20261113-night-more-power-left.mp4", poster: "/media/live-clips/mily-b263-11-20261113-night-more-power-left-poster.jpg", width: 640, height: 360, durationSeconds: 21.9, sourceTimestamp: "0:58:56" } },
    { timestamp: "0:59:59", title: "パンドラの箱と希望の話", body: "励ましを受けて、しだいに笑顔が戻りました。パンドラの箱を開けたら災いが出てきたけれど、最後に残っていたのは希望だった——その話に触れながら、楽しく配信したい、やり残しがないようにしたいと話しました。", clip: { src: "/media/live-clips/mily-b263-12-20261113-night-hope-remains.mp4", poster: "/media/live-clips/mily-b263-12-20261113-night-hope-remains-poster.jpg", width: 640, height: 360, durationSeconds: 13.3, sourceTimestamp: "0:59:59" } },
    { timestamp: "1:03:00", title: "湘南PRは3位の表示", body: "配信中、湘南PRのぼり応援大使決定戦はルーム表示で3位、197,223ptと表示されました。表示された値であり、確定値ではありません。" },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:00:35", label: "帰宅直後のゲリラ開始" },
    { timestamp: "0:20:00", label: "湘南イベントの相談" },
    { timestamp: "0:39:00", label: "ドラゴンボールの台詞遊び" },
    { timestamp: "0:45:30", label: "顔出しに切り替え" },
    { timestamp: "0:46:50", label: "涙ながらの本音トーク" },
    { timestamp: "0:58:56", label: "有り余る力と悔しさ" },
    { timestamp: "0:59:59", label: "パンドラの箱と希望の話" },
    { timestamp: "1:03:00", label: "湘南PRの結果表示" },
  ],
  nextNote: "配信時点では、ファイナル審査（11月26日〜12月6日）と、12月12日の表彰式について案内していました。",
  sourceLabel: "2026年11月13日 夜のSHOWROOM配信（保存録画の自動文字起こし・実フレーム確認）",
  verifiedAt: "2026-11-13",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画の実フレーム10枚を掲載しています。",
    publishedClips: true,
    extra: "映像は録画開始から約45分間が真っ黒で、静止画は映像のある区間の実フレームだけを使っています。保存録画の実尺は63分31秒で、配信の時計上の幅（20時45分〜21時49分）とは約70秒異なります。前半の見どころの時刻は、コメント記録の時計時刻から換算した目安です。湘南PRのぼり応援大使決定戦の順位とポイントは配信中のルーム表示の値で、確定値ではありません。視聴者の名前が含まれる区間の扱いは制作記録に分けています。",
  }),
};
