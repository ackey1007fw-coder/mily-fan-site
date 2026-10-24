import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20261024Radio: StreamRecap = {
  id: "2026-10-24-morning-radio",
  date: "2026-10-24",
  dateLabel: "2026.10.24（土）",
  theme: "朝の夢と決意",
  broadcastLabel: "録画開始7:09頃〜 約93分",
  platformLabel: "SHOWROOM",
  summary: "ラジオ形式の朝配信。これまで伝えてこなかった将来の夢や、舞台・表現活動への思いを語りました。応援してくれる人とやり取りし、次の審査に向けた決意と感謝を届けました。",
  highlights: [
    { timestamp: "0:01:40", title: "朝の配信時間について", body: "予定していた早朝の配信時刻に触れ、待っていた人たちへ声でお礼を伝えました。" },
    { timestamp: "0:19:20", title: "夢を伝えるきっかけ", body: "これまであまり話してこなかった進路や将来の夢を、みんなに伝えようと語りました。" },
    { timestamp: "0:25:20", title: "これまでの道のり", body: "将来の仕事や、自分が進みたい方向について考えてきたことを振り返りました。" },
    { timestamp: "0:37:00", title: "舞台と表現の魅力", body: "演技や舞台への興味を話し、その場で届ける表現の価値について考えを伝えました。" },
    { timestamp: "1:00:20", title: "幅広い挑戦への思い", body: "舞台への関心と、さまざまな表現に挑戦していきたい気持ちを語りました。" },
    { timestamp: "1:10:25", title: "結果を目指す決意", body: "目指す結果に向けて努力を続けたいと話し、届いた応援の言葉に感謝しました。" },
    { timestamp: "1:29:35", title: "ランキングとありがとう", body: "終盤にはランキングに触れ、朝のラジオに集まった人たちへお礼を伝えました。" },
  ],
  goals: [],
  ranking: [buildRankingNote(undefined, undefined, "during")],
  timeline: [
    { timestamp: "0:01:40", label: "配信時刻と朝の挨拶" },
    { timestamp: "0:19:20", label: "将来の夢を話すきっかけ" },
    { timestamp: "0:25:20", label: "これまでの進路と考え" },
    { timestamp: "0:37:00", label: "舞台・ライブ表現への思い" },
    { timestamp: "1:00:20", label: "今後の表現活動への挑戦" },
    { timestamp: "1:10:25", label: "結果に向けて続ける決意" },
    { timestamp: "1:29:35", label: "ランキングと感謝" },
  ],
  nextNote: "",
  sourceLabel: "2026年10月24日 朝のSHOWROOMラジオ配信（保存録画メタデータ・自動文字起こし参照）",
  verifiedAt: "2026-10-24",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra: "録画処理は7:09:16〜8:43:46、保存映像の実尺は93分26.255秒です。自動文字起こし処理完了ログは281区間、8:42:40までです。話題位置は録画開始基準の目安です。自動認識に誤りがあり逐語引用はしていません。映像全尺デコード・録画の完全な連続性・全編手動聴取・逐語校正は未確認です。通信エラー記録があります。画面数値は原記録未照合であり、応援0とは扱いません。",
  }),
};
