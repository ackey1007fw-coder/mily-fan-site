import type { StreamRecap } from "./streamRecaps.ts";
import {
  TRANSCRIPT_MATERIAL_NOTE,
  buildRankingNote,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

export const streamRecap20260806Night: StreamRecap = {
  id: "2026-08-06-night-showroom",
  date: "2026-08-06",
  dateLabel: "2026.08.06（木）",
  theme: "深夜のゲリラと投票案内",
  broadcastLabel: "23:31頃〜 約93分",
  platformLabel: "SHOWROOM",
  summary:
    "急きょ始めた深夜のゲリラ配信。ラジオ活動や配信を始めたばかりの手応えを語り、8月8日開始の投票方法を案内。歌のリクエストは次枠へ持ち越し、終盤に次の配信を13:30頃と案内しました。",
  songs: [],
  highlights: [
    {
      timestamp: "0:02:03",
      title: "少しでも話したくて",
      body: "予定外の時間でしたが、少しでもみんなと話したくて配信を始めたと話しました。",
    },
    {
      timestamp: "0:05:03",
      title: "ラジオ番組を紹介",
      body: "FM湘南マジックウェイブの「湘南シーサイドサークル」でパーソナリティをしていると紹介しました。",
    },
    {
      timestamp: "0:38:04",
      title: "リコピンの話題",
      body: "当時の呼び名「リコピン」や、トマトの栄養素にちなむファンネームの話で盛り上がりました。",
    },
    {
      timestamp: "0:55:15",
      title: "8月8日から投票",
      body: "8月8日から投票が始まることと、プロフィール付近の投票導線を案内しました。",
    },
    {
      timestamp: "1:06:27",
      title: "配信を始めた手応え",
      body: "配信を始めてまだ日が浅い中でも、多くの出会いやフォローがあったことを喜びました。",
    },
    {
      timestamp: "1:17:31",
      title: "昼枠の歌を振り返る",
      body: "昼配信で「かわいいだけじゃだめですか？」を歌ったことを振り返り、次に歌いたい曲を相談しました。",
    },
    {
      timestamp: "1:22:04",
      title: "投票方法をあらためて",
      body: "8月8日12時からの投票について、1日1回参加できることを説明しました。",
    },
    {
      timestamp: "1:31:48",
      title: "次の配信を案内",
      body: "次の配信を13:30頃から行い、歌や会話を楽しみたいと案内しました。",
    },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1, "during")],
  timeline: [
    { timestamp: "0:02:03", label: "深夜のゲリラ配信を始めた理由" },
    { timestamp: "0:05:03", label: "ラジオ活動を紹介" },
    { timestamp: "0:38:04", label: "リコピンとファンネームの話" },
    { timestamp: "0:50:52", label: "投票をめぐる冗談で交流" },
    { timestamp: "0:55:15", label: "8月8日開始の投票を案内" },
    { timestamp: "1:03:48", label: "歌のリクエストについて会話" },
    { timestamp: "1:17:31", label: "昼配信の歌唱を振り返る" },
    { timestamp: "1:21:29", label: "次に歌う候補を相談" },
    { timestamp: "1:22:04", label: "1日1回の投票方法を説明" },
    { timestamp: "1:24:55", label: "リクエスト曲を次枠へ持ち越し" },
    { timestamp: "1:27:30", label: "次の配信時刻を相談" },
    { timestamp: "1:29:28", label: "13位から1位までランキングを読み上げ" },
    { timestamp: "1:31:48", label: "次枠13:30頃と歌の予定を案内" },
  ],
  nextNote:
    "配信時点では、次の配信を13:30頃から行い、歌や会話を楽しみたいと案内していました。",
  sourceLabel: "2026年8月6日 SHOWROOM深夜配信（オーナー指定アーカイブの自動字幕）",
  verifiedAt: "2026-09-13",
  transcriptionNote: buildTranscriptionNote({
    material: TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra:
      "オーナー指定アーカイブの自動字幕1766行を全文抽出し、主要区間を照合しました。全編の手動聴取は実施していません。開始時刻は録画情報に基づく目安です。",
  }),
};
