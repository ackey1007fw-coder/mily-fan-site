import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const moments = [
  [1, "0:00:30", "カメラへ顔を向けるみりぃ"],
  [2, "0:06:00", "顔を近づけて笑うみりぃ"],
  [3, "0:09:00", "人差し指を立てて話すみりぃ"],
  [5, "0:24:00", "姿勢を伸ばして話すみりぃ"],
  [6, "0:27:00", "横を向いて笑うみりぃ"],
  [7, "0:30:00", "手のひらを見せて首を傾けるみりぃ"],
  [8, "0:45:00", "少し離れて笑顔を見せるみりぃ"],
  [4, "0:48:00", "上を見ながら話すみりぃ"],
  [9, "0:54:00", "身体を傾けて腕を曲げるみりぃ"],
  [10, "0:59:40", "カメラへ指を向けて笑うみりぃ"],
] as const;
const gallery = moments.map(([index, time, alt]) => {
  const downloadName = `mily-b184-${String(index).padStart(2, "0")}-20261003-morning-still.jpg`;
  return { src: `/media/live/${downloadName}`, width: 640, height: 360, alt, caption: `${time}｜${alt}`, downloadName };
});

export const streamRecap20261003Asa: StreamRecap = {
  id: "2026-10-03-asa-showroom", date: "2026-10-03", dateLabel: "2026.10.03（土）",
  theme: "朝の四次審査スタート", broadcastLabel: "6:30頃〜 約60分", platformLabel: "SHOWROOM",
  summary: "四次審査のSHOWROOMイベントが始まった朝。キラキラや投票報告へお礼を伝え、歌とやりとりで応援への気持ちを返しました。1.2倍DAYの案内と、次の21時40分からの配信も確認します。",
  image: gallery[1], gallery,
  galleryNote: "朝配信の実フレームから、表情やしぐさの異なる10枚を選びました。時刻は元録画の先頭からの目安です。",
  highlights: [
    { timestamp: "0:00:22", title: "朝の挨拶とキラキラへの感謝", body: "朝から来てくれたみんなへ挨拶し、届くキラキラにお礼を伝えました。四次審査の朝を、みんなとのやりとりで始めます。" },
    { timestamp: "0:07:28", title: "1.2倍DAYと晴れた朝", body: "この日は1.2倍DAYと案内し、応援を呼びかけました。久しぶりによく晴れた朝の日差しにも触れ、嬉しそうに話します。" },
    { timestamp: "0:12:50", title: "歌で勢いよくスタート", body: "歌いたかった曲を練習してきたと話し、朝の歌を届けました。歌詞の良さにも触れながら、みんなと配信を盛り上げます。" },
    { timestamp: "0:27:19", title: "みんなと盛り上がりたい", body: "歌いたかった曲で、みんなと盛り上がりたいと伝えました。朝から集まってくれたことに感謝し、良いスタートを切れた気持ちを話します。" },
    { timestamp: "0:33:54", title: "朝から来てもらえる幸せ", body: "歌のあと、朝から盛り上げてくれたみんなへお礼を伝えました。たくさん来てもらえて幸せだと、応援への感謝を返します。" },
    { timestamp: "0:47:15", title: "2日目の投票をお願い", body: "この日は投票2日目と確認し、毎日の応援を呼びかけました。12日まで投票が続くと案内し、無料ギフト審査にも触れます。" },
    { timestamp: "0:53:04", title: "最後も歌で元気に", body: "この曲で締めたかったと話し、終盤も歌を届けました。歌とやりとりを楽しみながら、朝の配信を締めくくります。" },
    { timestamp: "0:59:50", title: "次は21時40分から", body: "応援へのお礼とともに、次の配信は21時40分からと再案内しました。1.2倍DAYの夜にも力を貸してほしいと伝え、挨拶します。" },
  ],
  goals: [], ranking: [buildRankingNote(13, 1)],
  timeline: [
    { timestamp: "0:00:22", label: "朝の挨拶と応援への感謝" },
    { timestamp: "0:00:52", label: "次の配信は21時40分から" },
    { timestamp: "0:02:48", label: "投票2日目の応援を呼びかけ" },
    { timestamp: "0:07:28", label: "1.2倍DAYの案内" },
    { timestamp: "0:07:42", label: "晴れた朝の日差し" },
    { timestamp: "0:12:50", label: "最初の歌を届ける" },
    { timestamp: "0:27:19", label: "歌いたかった曲で盛り上がる" },
    { timestamp: "0:33:54", label: "朝から集まってくれたことへの感謝" },
    { timestamp: "0:41:27", label: "7時半までの朝枠と夜枠を確認" },
    { timestamp: "0:47:15", label: "毎日の投票をお願い" },
    { timestamp: "0:47:39", label: "無料ギフト審査に触れる" },
    { timestamp: "0:53:04", label: "終盤の歌" },
    { timestamp: "0:58:45", label: "ランキング読み上げとお礼" },
    { timestamp: "0:59:50", label: "夜の配信を再案内して挨拶" },
  ],
  nextNote: "配信時点では、次はこの日の21時40分からと案内していました。本人の10月2日告知画像では21:40〜22:40の予定です。最新の変更は本人の案内をご確認ください。",
  sourceLabel: "2026年10月3日 SHOWROOM朝配信（保存録画・自動文字起こし）", verifiedAt: "2026-10-03",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の録画から抽出した実フレーム10枚です。顔・身体の生成や補正は行っていません。",
    extra: "時刻は元録画に合わせた目安です。本文は発言の要約で、逐語引用ではありません。曲名は未確認のため記載せず、短尺動画は原音の検品待ちのため掲載していません。",
  }),
};
