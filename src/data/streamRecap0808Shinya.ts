import type { StreamRecap } from "./streamRecaps.ts";
import { buildTranscriptionNote } from "./streamRecapRules.ts";

export const recap20260808Shinya: StreamRecap = {
  id: "2026-08-08-shinya-radio-0025",
  date: "2026-08-08",
  dateLabel: "2026.08.08（土）",
  theme: "深夜の相談ラジオ",
  broadcastLabel: "0:25頃〜 約32分",
  platformLabel: "SHOWROOM",
  summary:
    "二次審査開始直前の深夜ラジオ配信。配信時間の分け方や審査期間中の運用を相談し、8月8日12時開始のWEB投票を案内。イベント参加時の注意点や配信時間管理も確認した回です。",
  highlights: [
    {
      timestamp: "0:00:27",
      title: "初めてのラジオ配信",
      body: "ラジオ配信は初めての試みだと話し、操作も含めてリスナーに助けてもらいながら始めました。",
    },
    {
      timestamp: "0:02:31",
      title: "配信時間の分け方を相談",
      body: "二次審査期間の配信を長く続けるか、朝・昼・夜に分けるかを相談しました。",
    },
    {
      timestamp: "0:03:21",
      title: "相談のためのラジオ枠",
      body: "真剣に相談したいことがあり、話を聞いてもらうためにラジオ配信にしたと説明しました。",
    },
    {
      timestamp: "0:11:25",
      title: "8月8日12時からWEB投票",
      body: "日付が変わって8月8日になり、12時から投票できると案内して参加を呼びかけました。",
    },
    {
      timestamp: "0:20:07",
      title: "投票と広報への意識",
      body: "イベント特典だけでなく投票も大切だと受け止め、広報活動も頑張りたいと話しました。",
    },
    {
      timestamp: "0:20:32",
      title: "一緒にいい景色を",
      body: "応援してくれる人たちと一緒に良い景色を見たいと語りました。",
      quote: "一緒にいい景色見ようね。絶対に",
    },
    {
      timestamp: "0:29:08",
      title: "イベント参加前の確認",
      body: "参加中のイベントについて、事前に知っておくことや注意点をリスナーに尋ねました。",
    },
    {
      timestamp: "0:30:27",
      title: "配信時間をタイマーで管理",
      body: "時間超過を避けるため、手元のタイマーを使って早めに終える運用を考えました。",
    },
  ],
  goals: [],
  ranking: [],  timeline: [
    { timestamp: "0:00:27", label: "初めてのラジオ配信を開始" },
    { timestamp: "0:01:00", label: "二次審査開始直前の不安を相談" },
    { timestamp: "0:02:31", label: "配信時間の分け方を相談" },
    { timestamp: "0:03:21", label: "相談目的のラジオ枠と説明" },
    { timestamp: "0:11:25", label: "8月8日12時開始のWEB投票を案内" },
    { timestamp: "0:20:07", label: "投票と広報への意識を話す" },
    { timestamp: "0:20:32", label: "一緒に良い景色を見たいと語る" },
    { timestamp: "0:29:08", label: "イベント参加時の注意点を相談" },
    { timestamp: "0:30:27", label: "タイマーで配信時間を管理する案" },
    { timestamp: "0:32:18", label: "時間通り終了する方針を確認" },
  ],
  nextNote: "",
  sourceLabel: "2026年8月8日 SHOWROOM深夜ラジオ配信（YouTube自動字幕確認）",
  verifiedAt: "2026-09-14",
  transcriptionNote: buildTranscriptionNote({
    material:
      "YouTubeの日本語自動字幕をもとに整理しています。自動字幕には聞き取り誤りの可能性があります。",
    stills: "静止画は掲載していません。",
    extra:
      "606行の自動字幕を全文確認しました。全編の手動聴取は実施していません。0:25はプレイリスト上の記録時刻をもとにした目安で、実際の配信開始時刻とは区別しています。",
  }),
};