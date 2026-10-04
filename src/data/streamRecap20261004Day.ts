import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

const moments = [
  [1, "録画1・0:01:05", "手を振るみりぃ"],
  [3, "録画1・0:02:50", "笑顔で話すみりぃ"],
  [5, "録画2・0:01:30", "マイクを手にするみりぃ"],
  [6, "録画2・0:11:39", "マイクを両手で持つみりぃ"],
  [7, "録画2・0:12:14", "首を傾けて笑うみりぃ"],
  [9, "録画2・0:14:32", "大きな笑顔のみりぃ"],
] as const;
const gallery = moments.map(([index, time, alt]) => {
  const downloadName = `mily-20261004-day-${String(index).padStart(2, "0")}-still.jpg`;
  return { src: `/media/live/${downloadName}`, width: 640, height: 360, alt, caption: `${time}｜${alt}`, downloadName };
});

export const streamRecap20261004Day: StreamRecap = {
  id: "2026-10-04-day-showroom", date: "2026-10-04", dateLabel: "2026.10.04（日）",
  theme: "昼の歌と応援ありがとう", broadcastLabel: "14:40頃〜 約30分", platformLabel: "SHOWROOM",
  summary: "午前のラジオを終えたみりぃが、昼の配信で歌とおしゃべり。キラキラ星や投票へのお礼、声の出し方の話、クマのかわいさを楽しむやりとりまで、みんなとの時間を振り返ります。",
  image: gallery[5], gallery,
  galleryNote: "当日の保存録画から選んだ実フレーム6枚です。画像の時刻は各録画の先頭からの目安で、2本を連結した通算時刻ではありません。",
  highlights: [
    { timestamp: "0:01:30", title: "投票の応援にありがとう", body: "投票の報告へお礼を伝えました。現在の投票先や受付期間は、サイトの応援案内で確認できます。" },
    { timestamp: "0:03:34", title: "アカペラでも歌おう", body: "歌を楽しむ中で、アカペラの提案もありました。曲名や歌詞は確認を終えていないため掲載していません。" },
    { timestamp: "0:07:56", title: "応援とラジオの話", body: "届いた応援へのお礼を伝え、午前のラジオについても話しました。コメントを交えながら、おしゃべりが続きます。" },
    { timestamp: "0:11:39", title: "声の出し方を振り返って", body: "ラジオの生放送を終えたあとの声の出し方を話しました。歌声へのコメントにも喜びを伝えています。" },
    { timestamp: "0:13:11", title: "かわいいクマのやりとり", body: "クマのギフトのかわいさを話題に、みんなとやりとり。いろいろなクマを見て楽しみ、お礼を伝えました。" },
    { timestamp: "0:18:00", title: "昼に来てくれたみんなへ", body: "この時間に来てくれたみんなへ感謝を伝えました。歌とおしゃべりを一緒に楽しんだ昼の時間を締めくくります。" },
  ],
  goals: [], ranking: [], timeline: [], nextNote: "",
  sourceLabel: "2026年10月4日 昼のSHOWROOM配信（保存録画・自動文字起こし）", verifiedAt: "2026-10-04",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の録画の実フレーム6枚です。",
    extra: "保存録画2本を別々に自動文字起こしした要約です。全編の手動聴取・逐語校正は未実施です。録画には欠測・音声の不連続があり、連続した全配信の確認ではありません。放送枠はオーナーの約14:40〜15:10という案内に基づく目安です。見どころの時刻は録画2の先頭から数えた動画内の目安で、放送時刻や2本の通算時刻ではありません。曲名・歌詞・個人名・ギフト個数・順位は掲載していません。次枠は現在の確定予定へ転記していません。",
  }),
};
