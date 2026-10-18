import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const moments = [
  ["0:02:20", "髪を整えながら", "青いパーカーで髪を整えるみりぃ"],
  ["0:05:20", "フードをかぶって", "青いパーカーのフードをかぶるみりぃ"],
  ["0:08:30", "ふっと笑顔に", "フード姿で笑顔を見せるみりぃ"],
  ["0:14:10", "カメラへにっこり", "カメラに近づいて微笑むみりぃ"],
  ["0:19:50", "朝の笑顔", "髪をまとめて笑顔を見せるみりぃ"],
  ["0:22:50", "リボンと一緒に", "青いリボンを髪に結んで微笑むみりぃ"],
  ["0:28:50", "袖を頬に添えて", "パーカーの袖を頬に添えるみりぃ"],
  ["0:31:50", "ほっぺを指さして", "両手の指で頬を指すみりぃ"],
  ["0:49:50", "手を添えてにっこり", "笑顔で片手を上げるみりぃ"],
  ["0:58:30", "終盤のポーズ", "両手の指を立てて話すみりぃ"],
] as const;
const stills: StreamRecapImage[] = moments.map(([time, caption, alt], i) => ({
  src: `/media/live/mily-b161-${String(i + 1).padStart(2, "0")}-morning.jpg`,
  width: 640, height: 360, alt, caption: `${time} ${caption}`,
  downloadName: `みりぃ_20260925朝_${String(i + 1).padStart(2, "0")}.jpg`,
}));
export const streamRecap20260925Asa: StreamRecap = {
  id: "2026-09-25-asa-showroom",
  date: "2026-09-25", dateLabel: "2026.09.25（金）",
  theme: "朝のすっぴんトーク",
  broadcastLabel: "6:36頃〜 約61分", platformLabel: "SHOWROOM",
  summary: "青いパーカー姿で、今日はメイクをせずにおしゃべり。初アバターへのお礼や、10月2日からの四次審査に向けた話を交えながら、朝の時間を一緒に過ごしました。",
  image: stills[7], gallery: stills,
  galleryZip: {
    src: "/media/live/mily-b161-morning-stills.zip",
    filename: "みりぃ_20260925朝_スクショ10枚.zip", label: "10枚まとめて保存",
  },
  highlights: [
    { timestamp: "0:00:15", title: "今日はおしゃべりの朝", body: "メイクをせずに出かける日だから、朝はみんなとのおしゃべりを楽しむと話しました。" },
    { timestamp: "0:08:50", title: "メイクと自然な表情", body: "メイクの有無で印象が変わる話をしながら、青いパーカー姿で笑顔を見せました。",
      clip: { src: "/media/live-clips/mily-b161-no-makeup-talk.mp4", poster: "/media/live-clips/mily-b161-no-makeup-talk-poster.jpg", width: 640, height: 360, durationSeconds: 13, sourceTimestamp: "0:08:50" },
    },
    { timestamp: "0:11:40", title: "四次審査に向けて", body: "初めて来た人へ自己紹介し、10月2日から始まる四次審査にも遊びに来てほしいと呼びかけました。" },
    { timestamp: "0:19:50", title: "朝の応援に感謝", body: "初アバターを着けて遊びに来てくれた人たちの姿を喜び、朝から集まった皆さんへお礼を伝えました。" },
    { timestamp: "0:28:50", title: "フードとリボンの姿", body: "フードをかぶったり髪をまとめたり。帽子とマスクで出かける話から、見つけられるかなというおしゃべりも。" },
    { timestamp: "0:40:00", title: "配信を始めたころ", body: "以前は配信を始めることに不安もあったと振り返り、今はみんなと話す時間を楽しみにしていると話しました。" },
    { timestamp: "0:58:15", title: "最後は一人ずつお礼", body: "朝の時間を一緒に過ごした人へ感謝し、13位から1位までのランキングを読み上げました。" },
  ],
  goals: [], ranking: [buildRankingNote(13, 1)],
  timeline: [
    { timestamp: "0:00:15", label: "今日はメイクをしない朝のおしゃべり" },
    { timestamp: "0:05:20", label: "パーカーのフード姿" },
    { timestamp: "0:08:30", label: "メイクと自然な表情の話" },
    { timestamp: "0:11:40", label: "四次審査への呼びかけ" },
    { timestamp: "0:19:50", label: "初アバターと応援へのお礼" },
    { timestamp: "0:28:50", label: "帽子とマスクの話" },
    { timestamp: "0:40:00", label: "配信を始めたころの思い" },
    { timestamp: "0:58:15", label: "ランキングと朝のお礼" },
  ],
  nextNote: "",
  sourceLabel: "2026年9月25日 SHOWROOM朝配信（保存録画・自動文字起こし確認）",
  verifiedAt: "2026-09-25",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は同じ録画の実フレーム10枚を掲載しています。",
    extra: "録画開始記録06:36:12、メディア実測3654.058秒。6:30頃からの配信と案内されていましたが、録画開始前の約6分は確認できていません。録画全体を31分割して自動文字起こしし、主要な話題と実フレームを照合しました。全編手動聴取・逐語校正ではありません。時刻は録画先頭からの目安です。今回の確認範囲で歌唱曲は確定していません。",
  }),
};
