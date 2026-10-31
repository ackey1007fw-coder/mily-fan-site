import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, RANKING_NOTE_WITHOUT_RANGE, buildTranscriptionNote } from "./streamRecapRules.ts";

// The owner's own authorized recording of this morning live. Photos and the talk excerpt are from this live only.
// Handwritten names on the sticky notes and on the held sign are hidden with flat paper-colored fills (no generative edits).
const moments = [
  [31, "hair-hands", "両手で髪に触れてカメラを見るみりぃ", "髪に手を添えて"],
  [218, "close-smile", "カメラに近づいて笑顔を見せるみりぃ", "朝のにっこり"],
  [468, "hands-chest-talk", "胸元に両手を添えて話すみりぃ", "おしゃべり中"],
  [530, "hair-up", "前髪を両手でかき上げるみりぃ", "すっきりした髪"],
  [655, "clap-smile", "顔の横で両手を広げて笑うみりぃ", "うれしい笑顔"],
  [780, "tomato-sign-pose", "描いたトマトの紙のそばでポーズをとるみりぃ", "トマトの紙とポーズ"],
  [905, "bright-smile", "明るい笑顔で話すみりぃ", "明るい笑顔"],
  [1030, "wall-present", "壁の付箋を両手で示して笑うみりぃ", "壁の付箋をご紹介"],
  [1279, "near-smile", "カメラのすぐ近くで笑うみりぃ", "近くでにっこり"],
  [1591, "soft-smile", "やわらかな表情で話すみりぃ", "やわらかな表情"],
  [1716, "hair-hands-goodbye", "両手で髪を持って笑うみりぃ", "終盤の笑顔"],
] as const;
const clock = (s: number) => `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
export const morning20261101Gallery: StreamRecapImage[] = moments.map(([seconds, slug, alt, label], i) => {
  const filename = `mily-b243-${String(i + 1).padStart(2, "0")}-20261101-morning-${slug}.jpg`;
  return { src: `/media/live/${filename}`, width: 640, height: 360, alt, caption: `${clock(seconds)}｜${label}`, downloadName: filename };
});

export const streamRecap1101Morning: StreamRecap = {
  id: "2026-11-01-morning-showroom",
  date: "2026-11-01",
  dateLabel: "2026.11.01（日）",
  theme: "朝のトマトの付箋",
  broadcastLabel: "6:06頃〜 約30分",
  platformLabel: "SHOWROOM",
  summary: "11月最初の朝枠。髪を切って明るい色にした姿で登場し、トマトの栄養素になってくれた人の付箋を壁に貼る企画を進めました。落ちない対策や小さなハプニングもあった朝です。",
  image: morning20261101Gallery[7],
  gallery: morning20261101Gallery,
  highlights: [
    { timestamp: "0:00:30", title: "11月最初の朝のごあいさつ", body: "笑顔で手を振りながら、来てくれたみんなへお礼を伝え、今月もよろしくとあいさつしました。", clip: { src: "/media/live-clips/mily-b243-12-20261101-morning-greeting-talk.mp4", poster: "/media/live/mily-b243-12-20261101-morning-greeting-talk-cover.jpg", width: 640, height: 360, durationSeconds: 9, sourceTimestamp: "0:00:30" } },
    { timestamp: "0:05:11", title: "トマトの栄養素の企画", body: "この日のうちに何人がトマトの栄養素になってくれるかを数える企画。今回こそ付箋が落ちないよう、対策をしたいと話していました。" },
    { timestamp: "0:05:55", title: "髪をすっきり明るく", body: "髪がすっきりしたという声に応えて、髪を切って色も明るくしたことを紹介しました。" },
    { timestamp: "0:10:17", title: "誕生日をみんなでお祝い", body: "この日が誕生日のリスナーのために、みんなに拍手をお願いしてハッピーバースデーを歌い、お祝いしました。" },
    { timestamp: "0:11:52", title: "オレンジの付箋から", body: "付箋は今回オレンジから始まると紹介し、名前を書いて一人ずつ貼っていきました。この朝は3人分の付箋が並びました。" },
    { timestamp: "0:14:20", title: "心を込めて描いたトマト", body: "描いたトマトが柿に見えるという声には、何度もトマトだと返していました。心を込めて描いたので受け取ってほしいと話しています。", quote: "これはトマトなんだよ" },
    { timestamp: "0:21:34", title: "時計が落ちてびっくり", body: "付箋が落ちる場面に続いて、壁の時計まで落ちて驚く一幕も。その後、学生時代から持っているマスキングテープを出して、好きな色で付箋を補強しました。" },
    { timestamp: "0:26:43", title: "照れながら猫の歌", body: "照れながらも、猫がテーマの歌を少しだけ歌いました。曲名は確認できていません。最後は11月最初の朝に集まったみんなへお礼を伝えました。", relatedLinks: [{ label: "前半の画面参考値と欠測", url: "/data-lab/reports/20261101-morning/" }] },
  ],
  goals: [{ item: "トマトの栄養素", target: "11月に100人", statusThen: "協力を呼びかけ" }],
  ranking: [RANKING_NOTE_WITHOUT_RANGE],
  timeline: [
    { timestamp: "0:00:30", label: "朝のごあいさつ" },
    { timestamp: "0:04:05", label: "トマトの栄養素の企画の説明" },
    { timestamp: "0:05:55", label: "髪を切って色を明るくした話" },
    { timestamp: "0:10:17", label: "リスナーの誕生日のお祝い" },
    { timestamp: "0:11:52", label: "オレンジの付箋を貼り始める" },
    { timestamp: "0:15:02", label: "描いたトマトの紹介" },
    { timestamp: "0:17:39", label: "スクショタイム" },
    { timestamp: "0:21:34", label: "壁の時計が落ちる" },
    { timestamp: "0:22:45", label: "マスキングテープで付箋を補強" },
    { timestamp: "0:26:43", label: "猫がテーマの歌を少し" },
    { timestamp: "0:28:59", label: "ランキングの読み上げ" },
    { timestamp: "0:29:22", label: "11月の目標と次の予定の案内" },
  ],
  nextNote: "配信時点では、この後ラジオの生放送に向かうことと、同じ日に昼枠を予定していることを案内していました。昼枠の時刻は案内されていません。",
  sourceLabel: "2026年11月1日 朝のSHOWROOM配信（保存録画の自動文字起こし・実フレーム確認）",
  verifiedAt: "2026-11-01",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画の実フレーム11枚を掲載しています。",
    publishedClips: true,
    extra: "見どころとタイムスタンプの時刻は録画先頭からの目安です。録画は6:06頃から約30分で、配信の正式な終了時刻は確認していません。付箋や手に持った紙に書かれた名前は、無地の紙色で隠しています。顔や身体の生成・補正はしていません。短尺1本は同じ回の録画から切り出した本人のあいさつで、元の音声を保持しています。歌の曲名は確認できていないため、この回に歌った曲には載せていません。原音の全編手動聴取・逐語校正は未実施です。",
  }),
};
