import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";
import { media234Gallery, media234Clip } from "./streamMedia2026102021.ts";
export const streamRecap20261021Noon: StreamRecap = {
  id: "2026-10-21-noon-showroom", date: "2026-10-21", dateLabel: "2026.10.21（水）",
  theme: "昼の笑顔と午後へのエール", broadcastLabel: "録画開始12:22頃〜 約51分", platformLabel: "SHOWROOM",
  summary: "お昼に訪れた人たちと話し、SNSに投稿した動画も紹介した配信。最後は午後も一緒に頑張ろうと呼びかけ、笑顔で挨拶しました。",
  image: media234Gallery[2], gallery: media234Gallery,
  highlights: [{ timestamp: "0:49:00", title: "午後も一緒に頑張ろう", body: "お昼の時間への感謝を伝え、午後も一緒に頑張ろうと呼びかけました。最後は手を振りながら挨拶しました。", clip: media234Clip }],
  goals: [], ranking: [], timeline: [{ timestamp: "0:49:00", label: "午後へのエールと挨拶" }], nextNote: "",
  sourceLabel: "2026年10月21日 昼のSHOWROOM配信（保存自動文字起こし・実フレーム参照）", verifiedAt: "2026-10-21",
  transcriptionNote: buildTranscriptionNote({ material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は同じ配信の実フレーム5枚を掲載しています。", publishedClips: true, extra: "保存メディアの長さは約50分55秒です。冒頭は映像がない時間があり、写真は映像のある区間から選定しました。記事は保存自動文字起こしの対象区間を参照し、全編の手動聴取・逐語校正は未実施です。オーナー承認のトーク短尺の先頭0.3秒は当日の表紙静止画です。原音と尺は保持し、背景の紙にある文字だけをぼかしています。時刻は録画先頭からの目安で、正式な配信開始時刻や全編の連続性は未確認です。" }),
};
