import type { StreamRecap } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

// 2026-10-13夜の保存録画と自動文字起こしによる要約。
// 開始時刻・長さは録画記録、見どころ時刻は録画先頭からの目安。
// 映像は人物が映らない音声中心の画面のため、別日の写真は流用しない。
export const streamRecap20261013Night: StreamRecap = {
  id: "2026-10-13-night-showroom",
  date: "2026-10-13",
  dateLabel: "2026.10.13（火）",
  theme: "夜の素顔と次への思い",
  broadcastLabel: "録画開始22:31頃〜 約58分",
  platformLabel: "SHOWROOM",
  summary:
    "四次審査を終えた翌日の夜。すっぴんで気さくにおしゃべりし、参考予測データをきっかけに、ファイナルへ進みたい気持ちや応援への感謝を語りました。",
  highlights: [
    {
      timestamp: "0:00:19",
      title: "すっぴんで始まる夜",
      body:
        "すっぴんでの配信だと話し、集まった人たちと気さくにやり取りしました。会話を楽しみたい気持ちが伝わる始まりです。",
    },
    {
      timestamp: "0:05:55",
      title: "赤ずきんの思い出",
      body:
        "前日の赤ずきん姿や、楽しかった配信の話題へ。四次審査の最終夜を振り返りながら会話が広がりました。",
    },
    {
      timestamp: "0:06:50",
      title: "審査の参考データ",
      body:
        "四次審査をめぐる第三者の予測データが話題に。数字を見て驚きつつ、次に向けてもっと頑張りたいという思いを話しました。審査の確定結果ではありません。",
    },
    {
      timestamp: "0:12:45",
      title: "ファイナルへの気持ち",
      body:
        "活動を始めた頃は遠く感じていたファイナル。応援を受け、そこへ行きたいと口にできるようになったことへの喜びと感謝を語りました。",
    },
    {
      timestamp: "0:15:32",
      title: "みんなと話したくて",
      body:
        "朝にも配信していたこの日。夜もみんなとおしゃべりしたくなって配信した、と素直な気持ちを伝えました。",
    },
    {
      timestamp: "0:17:48",
      title: "写真と見せ方の工夫",
      body:
        "赤ずきん写真をサムネイルにするアイデアや写真の話も。見つけてもらうための工夫をリスナーと一緒に考えました。",
    },
    {
      timestamp: "0:25:22",
      title: "交通案内でひと笑い",
      body:
        "交通情報を読む流れになり、道路案内をアナウンサー風に披露。次々に飛び出す話題へユーモアたっぷりに応じました。",
    },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:00:19", label: "すっぴんでの挨拶と交流" },
    { timestamp: "0:05:55", label: "前日の赤ずきん配信を回想" },
    { timestamp: "0:06:50", label: "四次審査の参考予測の話題" },
    { timestamp: "0:11:30", label: "応援への感謝と次の挑戦" },
    { timestamp: "0:12:45", label: "ファイナルへ進みたい思い" },
    { timestamp: "0:15:32", label: "今夜配信した理由" },
    { timestamp: "0:17:48", label: "配信サムネイルと写真の話" },
    { timestamp: "0:22:25", label: "言葉遊びと楽しいやり取り" },
    { timestamp: "0:25:22", label: "交通情報をアナウンサー風に" },
    { timestamp: "0:34:02", label: "リスナーとのおしゃべり" },
  ],
  nextNote: "",
  sourceLabel:
    "2026年10月13日 夜のSHOWROOM配信（保存録画・自動文字起こし）",
  verifiedAt: "2026-10-14",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra:
      "録画は22:31頃から約58分で、画面は音声中心のため人物の静止画を採用していません。見どころとタイムスタンプは保存録画の自動文字起こしによる要約と目安です。第三者の審査予測は参考情報であり、審査結果の確定順位や最終得点ではありません。",
  }),
};
