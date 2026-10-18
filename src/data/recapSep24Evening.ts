import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

const moments = [
  ["0:00:00", "夜のごあいさつ", "青いトップスでカメラを見るみりぃ"],
  ["0:08:00", "明るい笑顔", "カメラに向かって笑うみりぃ"],
  ["0:12:00", "おしゃべりの時間", "笑顔で話すみりぃ"],
  ["0:20:00", "ピースを見せて", "指でピースを作るみりぃ"],
  ["0:42:00", "にっこり", "両手をそばに寄せて笑うみりぃ"],
  ["0:44:00", "近くで笑顔", "カメラの近くで笑顔を見せるみりぃ"],
  ["0:48:00", "頬に手を添えて", "頬に指を添えながら話すみりぃ"],
  ["0:58:00", "笑顔のひととき", "穏やかに笑うみりぃ"],
  ["1:00:00", "身ぶりを交えて", "片手を上げて話すみりぃ"],
  ["1:24:00", "うれしそうに", "カメラの近くで笑うみりぃ"],
  ["1:30:00", "夜の笑顔", "カメラへ笑顔を見せるみりぃ"],
  ["1:32:00", "最後のおしゃべり", "手を動かしながら笑うみりぃ"],
] as const;
const stills: StreamRecapImage[] = moments.map(([time, caption, alt], i) => ({
  src: `/media/live/mily-b158-${String(i + 1).padStart(2, "0")}-evening.jpg`,
  width: 640, height: 360, alt, caption: `${time} ${caption}`,
  downloadName: `みりぃ_20260924夜_${String(i + 1).padStart(2, "0")}.jpg`,
}));
export const recapSep24Evening: StreamRecap = {
  id: "2026-09-24-evening-showroom",
  date: "2026-09-24", dateLabel: "2026.09.24（木）",
  theme: "夜の初アバターお披露目",
  broadcastLabel: "21:00頃〜 約96分", platformLabel: "SHOWROOM",
  summary: "初めてのみりぃアバターが配布された夜。うれしそうにアバターを紹介し、着替えてくれた皆さんへ感謝を伝えました。後半は天宮あみさんとの約束やコラボの話にも広がります。",
  image: stills[5], gallery: stills,
  galleryZip: { src: "/media/live/mily-b158-evening-stills.zip", filename: "みりぃ_20260924夜_スクショ12枚.zip", label: "12枚まとめて保存" },
  highlights: [
    { timestamp: "0:05:04", title: "初めてのアバターを紹介", body: "初めて獲得したみりぃのアバターを紹介。配布できるようになった喜びを笑顔で伝え、みんなにも手に取ってほしいと呼びかけました。", clip: { src: "/media/live-clips/mily-b158-avatar.mp4", poster: "/media/live-clips/mily-b158-avatar-poster.jpg", width: 640, height: 360, durationSeconds: 10.4, sourceTimestamp: "0:05:04" },
      socialClip: {
        title: "初アバター配布の夜", sourceTimestamp: "0:05:04", durationSeconds: 10.4,
        links: [
          { platform: "x", url: "https://x.com/ackey_RiRi_supp/status/2103147371005620354" },
          { platform: "instagram", url: "https://www.instagram.com/reel/DdrOiNJjx5w/" },
          { platform: "tiktok", url: "https://www.tiktok.com/t/7689126898185587986" },
          { platform: "youtube", url: "https://www.youtube.com/watch?v=pAvOzPjqPkI" },
        ],
      },
    },
    { timestamp: "0:23:55", title: "みんなのおかげで配布の日", body: "初アバターの配布をあらためて報告。受け取りに来てくれた人へ感謝し、喜びを分かち合いました。" },
    { timestamp: "0:29:20", title: "アバターと一緒に", body: "みんなでみりぃのアバターを着て、記念の画面を撮りたいと話しました。" },
    { timestamp: "0:44:25", title: "あみちゃんの話題へ", body: "フレキャンに挑戦する天宮あみさんの配信や、ふたりで話す機会について話が広がりました。" },
    { timestamp: "0:53:25", title: "一緒にファイナルへ", body: "天宮あみさんとともにファイナルを目指す約束に触れ、前を向く言葉で応援を呼びかけました。" },
  ],
  goals: [], ranking: [],
  timeline: [
    { timestamp: "0:05:04", label: "みりぃの初アバターを紹介" },
    { timestamp: "0:23:55", label: "初アバター配布と感謝" },
    { timestamp: "0:29:20", label: "みんなでアバターを着て撮影したい" },
    { timestamp: "0:44:25", label: "天宮あみさんの配信とコラボの話" },
    { timestamp: "0:53:25", label: "ふたりでファイナルを目指す約束" },
  ],
  nextNote: "配信時点では、翌9月25日の朝6時30分から配信すると案内していました。",
  sourceLabel: "2026年9月24日 SHOWROOM21時配信（オーナー提供録画・自動文字起こし確認）",
  verifiedAt: "2026-09-24",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は同じ録画の実フレーム12枚を掲載しています。",
    extra: "録画開始21:00:01、メディア実測5740.544秒を約96分に丸めています。全編の自動文字起こしを確認し、固有名詞・歌唱・数値の曖昧な箇所は掲載を控えました。全編手動聴取・逐語校正ではありません。時刻は録画先頭からの目安です。",
  }),
};
