import type { StreamRecap } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildRankingNote,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

export const streamRecap20260806Asa: StreamRecap = {
  id: "2026-08-06-asa",
  date: "2026-08-06",
  dateLabel: "2026.08.06（木）",
  theme: "朝の投票案内と歌唱",
  broadcastLabel: "10:02頃〜 約180分",
  platformLabel: "SHOWROOM",
  summary:
    "8月8日からの投票を案内し、配信を始めて間もない思いやラジオ活動、当時のファンネーム「リコピン」を紹介。終盤には「かわいいだけじゃだめですか？」を歌い、夜のゲリラ配信の可能性も案内しました。",
  songs: [
    {
      title: "かわいいだけじゃだめですか？",
      artist: "CUTIE STREET",
      timestamp: "2:22:56",
      youtubeUrl: "https://www.youtube.com/watch?v=d0rOHgzCe6s",
      karaoke: { youtubeUrl: "https://www.youtube.com/watch?v=YYGsvfQcDIg", channel: "CUTIE STREET" },
    },
  ],
  highlights: [
    {
      timestamp: "0:26:18",
      title: "8月8日からの投票案内",
      body: "8月8日12時から16日までの投票について、毎日参加できると案内しました。",
    },
    {
      timestamp: "0:33:11",
      title: "プロフィールから投票へ",
      body: "プロフィール上部の投票リンクから進めると説明し、毎日忘れず参加してほしいと呼びかけました。",
    },
    {
      timestamp: "1:49:46",
      title: "ラジオ活動の話",
      body: "日曜朝の生放送でラジオパーソナリティを務めていることを紹介しました。",
    },
    {
      timestamp: "2:18:11",
      title: "一曲歌う流れへ",
      body: "終盤、歌える曲が増えたと話し、アイドル系の一曲を選ぶ流れになりました。",
    },
    {
      timestamp: "2:22:56",
      title: "かわいいだけじゃだめですか？",
      body: "CUTIE STREETの「かわいいだけじゃだめですか？」を歌唱しました。",
    },    {
      timestamp: "2:32:20",
      title: "ファンネーム「リコピン」",
      body: "当時のファンネームを「リコピン」と紹介し、トマトの栄養素が名前の由来だと説明しました。",
    },
    {
      timestamp: "2:40:44",
      title: "プロフィール写真のこだわり",
      body: "周囲と同じ雰囲気にせず、あえて落ち着いた色合いの写真を選んだ理由を話しました。",
    },
    {
      timestamp: "2:49:50",
      title: "いい景色を一緒に",
      body: "審査を駆け抜け、みんなで良い景色を見たいと語りました。",
      quote: "いい景色見ようね、みんなで",
    },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1, "during")],
  timeline: [
    { timestamp: "0:26:18", label: "8月8日からの投票を案内" },
    { timestamp: "0:33:11", label: "プロフィール上部の投票リンクを説明" },
    { timestamp: "0:52:54", label: "投票方法について会話" },
    { timestamp: "1:49:46", label: "ラジオ活動を紹介" },
    { timestamp: "2:18:11", label: "一曲歌う流れへ" },
    { timestamp: "2:20:39", label: "歌う曲を選択" },
    { timestamp: "2:22:56", label: "「かわいいだけじゃだめですか？」を歌唱" },
    { timestamp: "2:32:20", label: "当時のファンネーム「リコピン」を紹介" },
    { timestamp: "2:40:44", label: "プロフィール写真の選び方を説明" },
    { timestamp: "2:49:50", label: "審査を駆け抜けたい思い" },
    { timestamp: "2:54:21", label: "夜のゲリラ配信の可能性を案内" },
    { timestamp: "2:55:55", label: "13位から1位までランキングを読み上げ" },
    { timestamp: "2:59:22", label: "ファンルーム確認を案内して終了" },
  ],
  nextNote:
    "配信時点では、夜遅くにゲリラ配信できるかもしれないため、実施可否はファンルームで知らせると案内していました。",
  sourceLabel: "2026年8月6日 SHOWROOM朝配信（オーナー提供録画の自動文字起こし）",
  verifiedAt: "2026-09-13",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra:
      "36/36区間の自動文字起こしを全文読解し、重要区間を照合しました。全編の手動聴取は実施していません。開始時刻は録画情報に基づく目安です。",
  }),
};