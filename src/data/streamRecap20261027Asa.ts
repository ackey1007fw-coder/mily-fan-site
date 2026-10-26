import type { StreamRecap } from "./streamRecaps.ts";
import { buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20261027Asa: StreamRecap = {
  id: "2026-10-27-morning-showroom",
  date: "2026-10-27",
  dateLabel: "2026.10.27（火）",
  theme: "朝の感謝と一日のエール",
  broadcastLabel: "録画開始5:50頃〜 約44分",
  platformLabel: "SHOWROOM",
  summary: "朝早く集まった人たちへの感謝から始まり、ハロウィンの衣装や日常の話題を交わした朝。自分のできることを続け、今日も一緒に頑張ろうという気持ちで送り出しました。",
  highlights: [
    { timestamp: "0:03:20", title: "早朝に集まった皆へ", body: "朝早く来てくれた人たちに感謝を伝え、コメントに応じながら朝の時間を過ごしました。" },
    { timestamp: "0:10:40", title: "ハロウィンの衣装の話", body: "ハロウィンの衣装を話題に、照れながらリスナーとやり取りする場面がありました。" },
    { timestamp: "0:15:47", title: "できることを続ける", body: "もっと配信時間を取りたい気持ちを話しつつ、周囲と比べすぎず、自分のできることを進めようと語りました。" },
    { timestamp: "0:29:05", title: "天気と懐かしい番組", body: "天気や昔のクイズ番組の話題を交え、朝のおしゃべりを楽しみました。" },
    { timestamp: "0:37:12", title: "日常も配信も一歩ずつ", body: "やるべきことを進め、できる時間に配信するという考えを話しました。確定した次回予定の案内ではありません。" },
    { timestamp: "0:44:03", title: "一日を応援する挨拶", body: "朝の応援に感謝し、今日も一緒に頑張ろうという挨拶で締めくくりました。" },
  ],
  goals: [],
  ranking: [],
  timeline: [],
  nextNote: "",
  sourceLabel: "2026年10月27日 朝のSHOWROOM配信（保存ASRの匿名化要約・録画メタデータ確認報告）",
  verifiedAt: "2026-10-27",
  transcriptionNote: buildTranscriptionNote({
    material: "保存された自動文字起こし全566レコードを分割して読んだ担当の匿名化要約に基づく、非逐語の暫定記録です。",
    stills: "静止画は掲載していません。",
    extra: "時刻はASRの経過秒数に基づく見返し目安で、映像PTSとの同期は未検証です。原音の手動聴取・逐語校正は未実施です。録画のコンテナ実尺は44分23.289秒との確認報告がありますが、正式な配信開始・終了時刻や全編の無欠落を確認したものではありません。録画ログには通信エラーがあり、全編デコード検査は未実施です。歌唱の有無・曲名は未確定のため、歌唱リストを設けていません。数値はこのカードには掲載していません。",
  }),
};
