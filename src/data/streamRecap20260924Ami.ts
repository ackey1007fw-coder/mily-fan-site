import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { amiMilyKoreaPromise } from "./challengeConnection.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

const moments = [
  ["0:00:30", "ふたりでごあいさつ", "画面を分けて手を振るみりぃと天宮あみさん"],
  ["0:03:30", "ハートを作って", "二分割画面で手を動かすみりぃと天宮あみさん"],
  ["0:06:00", "一緒に笑顔", "二分割画面で笑顔を見せるみりぃと天宮あみさん"],
  ["0:09:30", "おしゃべりの笑顔", "画面越しに笑うみりぃと天宮あみさん"],
  ["0:10:30", "ほほえむふたり", "並んだ画面でほほえむみりぃと天宮あみさん"],
  ["0:13:30", "カメラへにっこり", "それぞれの画面から笑顔を見せるみりぃと天宮あみさん"],
  ["0:15:00", "楽しい掛け合い", "二分割画面で会話するみりぃと天宮あみさん"],
  ["0:17:30", "声を交わして", "並んだ画面から話すみりぃと天宮あみさん"],
  ["0:19:30", "ふたりの笑顔", "二分割画面でほほえむみりぃと天宮あみさん"],
  ["0:23:30", "お別れ前の笑顔", "コラボの終盤に笑顔を見せるみりぃと天宮あみさん"],
  ["0:24:30", "頬に手を添えて", "笑顔で頬に手を添える天宮あみさんと、隣で笑うみりぃ"],
  ["0:29:00", "最後のにっこり", "単独画面で笑顔を見せるみりぃ"],
] as const;
const stills: StreamRecapImage[] = moments.map(([time, caption, alt], i) => ({
  src: `/media/live/mily-b159-${String(i + 1).padStart(2, "0")}-ami.jpg`,
  width: i === 11 ? 640 : 480, height: i === 11 ? 360 : 270, alt, caption: `${time} ${caption}`,
  downloadName: `みりぃ_20260924あみちゃんコラボ_${String(i + 1).padStart(2, "0")}.jpg`,
}));
export const streamRecap20260924Ami: StreamRecap = {
  id: "2026-09-24-ami-collab-showroom",
  date: "2026-09-24", dateLabel: "2026.09.24（木）",
  theme: "夜のあみちゃんコラボ",
  broadcastLabel: "22:55頃〜 約30分", platformLabel: "SHOWROOM",
  summary: "天宮あみさんと画面を分けて話した夜のコラボ配信。ふたりでハートの形を試したり、互いのルームの皆さんへ手を振ったり。コラボ終了後は、みりぃが感想とお礼を伝えました。",
  image: stills[10], gallery: stills,
  galleryZip: { src: "/media/live/mily-b159-ami-stills.zip", filename: "みりぃ_20260924あみちゃんコラボ_スクショ12枚.zip", label: "12枚まとめて保存" },
  highlights: [
    { timestamp: "0:00:18", title: "ふたりの画面がつながる", body: "天宮あみさんと一緒に画面へ登場。コラボ表示や声の聞こえ方を確かめながら、笑顔で話し始めました。" },
    { timestamp: "0:02:55", title: "画面越しのハート", body: "左右の画面で手を動かし、ふたりでハートの形を作ろうと試します。映り方の左右が違って、楽しい掛け合いになりました。" },
    { timestamp: "0:09:20", title: "初めてのコラボに感謝", body: "初めて試したコラボ配信を楽しみ、両方のルームから来てくれた皆さんに感謝を伝えました。" },
    { timestamp: "0:24:10", title: "ふたりで目指す舞台", body: "ふたりでファイナリストを目指し、笑顔で終えたら韓国旅行へ行くという約束にも触れました。あみさんの活動も応援できます。", relatedLinks: [amiMilyKoreaPromise.amiEntry, amiMilyKoreaPromise.amiX, amiMilyKoreaPromise.amiTikTok], clip: { src: "/media/live-clips/mily-b159-ami-farewell.mp4", poster: "/media/live-clips/mily-b159-ami-farewell-poster.jpg", width: 480, height: 270, durationSeconds: 21.2, sourceTimestamp: "0:24:10" } },
    { timestamp: "0:25:00", title: "あみさんのルームへお礼", body: "あみさんのルームの皆さんへもお礼を伝え、ふたりで手を振ってコラボを締めくくりました。" },
    { timestamp: "0:25:25", title: "みりぃからもう一度", body: "コラボ後は単独画面に戻り、急な配信になったことや一緒に話せた喜びを振り返りました。" },
  ],
  goals: [], ranking: [],
  timeline: [
    { timestamp: "0:00:18", label: "天宮あみさんと画面がつながる" },
    { timestamp: "0:02:55", label: "画面をまたぐハートを試す" },
    { timestamp: "0:09:20", label: "初めてのコラボと感謝" },
    { timestamp: "0:24:10", label: "ふたりで目指すファイナル" },
    { timestamp: "0:25:00", label: "コラボの締めと手振り" },
    { timestamp: "0:25:25", label: "単独画面で振り返り" },
    { timestamp: "0:28:15", label: "翌朝の配信案内とお礼" },
  ],
  nextNote: "配信時点では、翌9月25日の朝6時30分から配信すると案内していました。",
  sourceLabel: "2026年9月24日 SHOWROOM夜コラボ配信（オーナー提供録画・自動文字起こし確認）",
  verifiedAt: "2026-09-24",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は同じ録画の実フレーム12枚を掲載しています。",
    extra: "録画開始22:55:10、メディア実測1825.64秒を約30分に丸めています。ふたりの声が重なる区間は自動認識の誤りが多いため、固有名詞や発言を逐語引用せず確認できた話題に限りました。全編手動聴取・逐語校正ではありません。時刻は録画先頭からの目安です。",
  }),
};
