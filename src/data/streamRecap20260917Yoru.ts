import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const radioStill = {
  src: "/media/live/mily-b128-01-night-radio.jpg",
  width: 640,
  height: 360,
  alt: "ラジオ配信中に表示されていた、カメラを見つめるみりぃの画像",
  caption: "ラジオ配信中に表示されていた画像",
  downloadName: "みりぃ_20260917夜_ラジオ配信.jpg",
} as const;

export const streamRecap20260917Yoru: StreamRecap = {
  id: "2026-09-17-yoru-showroom",
  date: "2026-09-17",
  dateLabel: "2026.09.17（木）",
  theme: "夜のラジオと朝5時案内",
  broadcastLabel: "22:10頃〜 約41分",
  platformLabel: "SHOWROOM",
  summary: "久しぶりのラジオ形式で、四次審査前のルーム強化、まかない、お化け屋敷、ラジオパーソナリティの話まで約41分たっぷりおしゃべり。終盤は13位から1位までランキングを読み上げ、翌朝5時の配信を案内しました。",
  image: radioStill,
  highlights: [
    { timestamp: "0:00:31", title: "久しぶりのラジオ配信", body: "今回は静止画を表示するラジオ形式で配信。久しぶりのラジオ配信だと説明し、訪れた人へ声であいさつを届けました。" },
    { timestamp: "0:02:48", title: "四次審査前のルーム強化", body: "四次審査が始まるまでの間も、ルームをもっと盛り上げていきたいと話しました。ファイナルまで進めるよう頑張るので、これからも応援してほしいと呼びかけました。" },
    { timestamp: "0:10:29", title: "応援してくれる存在を大切に", body: "応援のやり取りでは、自分を卑下しないでと励ます場面も。一人ひとりの存在を大切に思っていることが伝わる言葉を返しました。" },
    { timestamp: "0:16:58", title: "まかないはフルコース", body: "お肉にスープ、キムチ、サラダもそろう、まかないの話へ。フルコースのような食事だと紹介し、お腹いっぱい食べられる充実ぶりを話しました。" },
    { timestamp: "0:20:47", title: "お化け屋敷は苦手", body: "お化け屋敷の話題では、絶対に行きたくないと即答。自分の悲鳴に周りも驚くと話し、行くなら出口まで一緒にいてほしいと笑いながら返しました。" },
    { timestamp: "0:29:49", title: "今夜はラジオ形式", body: "今夜はラジオ配信なのかという問いに、今日はラジオ形式でおしゃべりしていると説明。声だけでもコメントとの会話を楽しみました。" },
    { timestamp: "0:32:03", title: "3時間ラジオの経験", body: "週1回、3時間のラジオでパーソナリティをしていることに触れ、話し続けられるのはその経験の成果かもしれないとうれしそうに話しました。" },
    { timestamp: "0:37:38", title: "ランキングと翌朝の案内", body: "配信の締めに13位から1位までランキングを読み上げて感謝。最後に、翌朝は5時から配信すると案内しました。" },
  ],
  goals: [],
  ranking: [buildRankingNote(13, 1)],
  timeline: [
    { timestamp: "0:00:31", label: "久しぶりのラジオ配信" },
    { timestamp: "0:02:48", label: "四次審査前のルーム強化" },
    { timestamp: "0:07:50", label: "四次審査への応援をお願い" },
    { timestamp: "0:16:58", label: "まかないの話" },
    { timestamp: "0:20:47", label: "お化け屋敷は苦手" },
    { timestamp: "0:29:49", label: "今夜はラジオ形式と説明" },
    { timestamp: "0:31:41", label: "約40分のおしゃべりを振り返る" },
    { timestamp: "0:32:03", label: "ラジオパーソナリティの経験" },
    { timestamp: "0:34:47", label: "翌朝は早めに配信すると案内" },
    { timestamp: "0:37:38", label: "13位から1位までランキング読み上げ" },
    { timestamp: "0:40:50", label: "翌朝5時の配信を案内" },
    { timestamp: "0:41:15", label: "カウントダウンして終了" },
  ],
  nextNote: "配信時点では、翌9月18日午前5時から配信すると案内していました。",
  sourceLabel: "2026年9月17日 SHOWROOM夜ラジオ配信（オーナー提供録画・録画範囲の自動文字起こし確認）",
  verifiedAt: "2026-09-18",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画はラジオ配信中に表示されていた画像1枚を掲載しています。",
    extra: "録画開始記録22:09:50、メディア実測2480.991秒から表示を22:10頃・約41分に丸めています。録画範囲全体の自動文字起こし681区間を確認しました。配信全編の完全収録は保証しません。聞き取りが不確かな固有名詞・数値は省いています。タイムスタンプは録画先頭からの目安です。",
  }),
};
