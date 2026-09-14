import type { StreamRecap } from "./streamRecaps.ts";
import { buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const captionMaterialNote =
  "保存済みの日本語自動字幕をもとに整理しています。全編の手動聴取は行っておらず、本文は自動字幕と必要な対象区間確認の範囲で整理しています。";

export const recap0808Late: StreamRecap = {
  id: "2026-08-08-shinya-guerrilla-0104",
  date: "2026-08-08",
  dateLabel: "2026.08.08（土）",
  theme: "深夜のゲリラ相談",
  broadcastLabel: "1:04頃〜 約41分",
  platformLabel: "SHOWROOM",
  summary:
    "深夜のゲリラ・ラジオ配信。配信を始めたばかりの今やラジオ活動を振り返り、二次審査開始前の不安や注意点を相談。終盤には毎日のWEB投票と当日11時の配信を案内しました。",
  highlights: [
    {
      timestamp: "0:00:55",
      title: "ラジオ活動を紹介",
      body: "日曜朝10時から13時まで生放送のラジオを担当していることを紹介しました。",
    },
    {
      timestamp: "0:05:58",
      title: "配信を始めたばかり",
      body: "8月1日から配信を始めた理由に触れ、話すことへの自信をつけながら頑張りたいと話しました。",
    }    ,{
      timestamp: "0:12:03",
      title: "配信時間を守る話",
      body: "以前のSHOWROOMでは開始時刻に合わせて応援準備が必要だったと教わり、時間を守る大切さを聞きました。",
    },
    {
      timestamp: "0:19:06",
      title: "初めての深夜ラジオ",
      body: "深夜のラジオ形式で配信し、初めてこのスタイルを試したと話しました。",
    },
    {
      timestamp: "0:31:15",
      title: "二次審査前の相談",
      body: "二次審査のSHOWROOM配信が始まる前に、不安な点や気をつけることをリスナーへ相談しました。",
    },
    {
      timestamp: "0:32:16",
      title: "ラジオ経験を配信へ",
      body: "ラジオパーソナリティとしての経験を、このラジオ配信にも生かしたと振り返りました。",
    },
    {
      timestamp: "0:40:08",
      title: "毎日のWEB投票をお願い",
      body: "16日まで毎日投票があるとして、忘れず参加してほしいと呼びかけました。",
    }    ,{
      timestamp: "0:40:21",
      title: "当日11時の配信案内",
      body: "配信時点では、この日の最初の配信を11時から行うと案内しました。",
    },
  ],
  goals: [],
  ranking: [buildRankingNote(undefined, undefined, "during")],
  timeline: [
    { timestamp: "0:00:55", label: "日曜朝のラジオ活動を紹介" },
    { timestamp: "0:05:58", label: "8月1日から配信を始めた話" },
    { timestamp: "0:12:03", label: "SHOWROOMの配信時間管理を聞く" },
    { timestamp: "0:19:06", label: "初めての深夜ラジオ形式を振り返る" },
    { timestamp: "0:31:15", label: "二次審査開始前の不安を相談" },
    { timestamp: "0:32:16", label: "ラジオ経験を配信へ生かす話" },
    { timestamp: "0:38:37", label: "配信中にランキングを一件読み上げ" },
    { timestamp: "0:40:08", label: "16日までの毎日投票を案内" },
    { timestamp: "0:40:21", label: "当日11時の最初の配信を案内" },
  ],
  nextNote:
    "配信時点では、この日の最初の配信を11時から行うと案内していました。",
  sourceLabel: "2026年8月8日 SHOWROOM深夜ゲリラ配信（自動字幕確認）",
  verifiedAt: "2026-09-14",
  transcriptionNote: buildTranscriptionNote({    material: captionMaterialNote,
    stills: "静止画は掲載していません。",
    extra:
      "自動字幕736行を全文テキスト確認し、歌唱候補2件は対象音声区間の追加確認で会話と判定しました。開始時刻はプレイリスト記録に基づく目安です。",
  }),
};
