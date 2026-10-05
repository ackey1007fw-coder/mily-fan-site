import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

const moments = [
  [1, "0:00:30", "紫のヘアピンを付けて画面を見るみりぃ"],
  [2, "0:03:00", "笑顔で手を振るみりぃ"],
  [3, "0:09:00", "画面を見ながら笑うみりぃ"],
  [4, "0:15:00", "カメラへ話しかけるみりぃ"],
  [5, "0:21:00", "両手で髪を整えるみりぃ"],
  [6, "0:24:00", "頭の上に両手を添えるみりぃ"],
  [7, "0:33:00", "頬に手を添えるみりぃ"],
  [8, "0:38:00", "カメラに近づいて話すみりぃ"],
] as const;
const gallery = moments.map(([index, time, alt]) => {
  const downloadName = `mily-b192-${String(index).padStart(2, "0")}-20261005-morning-still.jpg`;
  return { src: `/media/live/${downloadName}`, width: 640, height: 360, alt, caption: `${time}｜${alt}`, downloadName };
});

/** 保存録画全21区間のローカル自動文字起こしを元に要約。手動聴取は未実施。 */
export const streamRecap20261005Asa: StreamRecap = {
  id: "2026-10-05-asa-showroom", date: "2026-10-05", dateLabel: "2026.10.05（月）",
  theme: "朝の挨拶と歌のおしゃべり", broadcastLabel: "録画開始6:00頃〜 約40分", platformLabel: "SHOWROOM",
  summary: "紫のヘアピンで朝の挨拶。投票報告や指ハートへのお礼、定期券のおしゃべり、歌の練習について話しました。保存録画の自動文字起こしから8つの場面を要約し、当日の実写真8枚と振り返ります。",
  image: gallery[1], gallery,
  galleryNote: "当日の保存録画から選んだ実フレーム8枚です。写真の時刻は録画の先頭からの目安です。",
  highlights: [
    { timestamp: "0:00:22", title: "ヘアピンを付けて朝の挨拶", body: "今日はピンで髪を留めていると話し、朝早く来てくれたみんなへ挨拶とお礼を伝えました。紫のヘアピンは当日の写真にも写っています。" },
    { timestamp: "0:01:35", title: "投票報告に、ありがとう", body: "投票を済ませたという報告にお礼を返し、応援の協力もお願いしました。届いた応援へ何度もありがとうを伝えた場面です。" },
    { timestamp: "0:06:38", title: "学生の定期券のおしゃべり", body: "学生の間は定期券がお得という話になりました。通学にまつわる身近なおしゃべりを挟みながら、朝のやりとりが続きます。" },
    { timestamp: "0:09:22", title: "朝に歌いたい曲を選ぶ", body: "朝に歌いたくなる曲や、可愛い曲を歌おうかと話しました。歌うのが苦手だから練習してきたという説明もあり、選曲のおしゃべりから歌へつながります。" },
    { timestamp: "0:18:01", title: "初めて来た人へ自己紹介", body: "ミスサークルに出場していることを紹介し、初めて来てくれた人へお礼を伝えました。朝の時間に立ち寄ってくれたみんなとのやりとりが続きます。" },
    { timestamp: "0:24:00", title: "指ハートに、ありがとう", body: "朝から届いた指ハートを見て、幸せだと話しました。その後は、うれしい思いを込めて歌うと伝え、歌につなげています。" },
    { timestamp: "0:31:38", title: "一人で歌えるように練習", body: "アイドル系の歌は、一人で歌えるように練習していると話しました。歌を聴いてくれた人へお礼を返しながら、練習のおしゃべりが続きます。" },
    { timestamp: "0:36:00", title: "朝の応援へお礼", body: "終盤は、来てくれた人や応援してくれた人へ順にお礼を伝えました。歌えたことや届いたギフトにも触れ、うれしかったと話しています。" },
  ],
  goals: [], ranking: [],
  timeline: [
    { timestamp: "0:00:22", label: "ヘアピンの話と朝の挨拶" },
    { timestamp: "0:01:35", label: "投票報告へのお礼" },
    { timestamp: "0:06:38", label: "学生の定期券の話" },
    { timestamp: "0:09:22", label: "朝に歌いたい曲を選ぶ" },
    { timestamp: "0:13:05", label: "可愛い曲を練習してきた話" },
    { timestamp: "0:18:01", label: "初めて来た人へ自己紹介" },
    { timestamp: "0:24:00", label: "指ハートへのお礼" },
    { timestamp: "0:26:16", label: "うれしい思いを込めて歌う" },
    { timestamp: "0:31:38", label: "一人で歌えるように練習" },
    { timestamp: "0:36:00", label: "来てくれたみんなへお礼" },
  ],
  nextNote: "",
  sourceLabel: "2026年10月5日 朝のSHOWROOM配信（保存録画・自動文字起こし）", verifiedAt: "2026-10-05",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の録画から選んだ実フレーム8枚です。",
    extra: "保存録画40分05秒の全区間をローカルで自動文字起こしし、そのテキストを元に要約しました。手動聴取・逐語校正は未実施で、不確かな曲名・固有名詞・順位・数量は掲載していません。歌唱はありますが、曲名の原音確認は未完了です。6:00頃は録画開始時刻、約40分は保存録画の長さです。配信の実開始や完全収録を確定していません。写真と本文の時刻は録画の先頭からの目安です。",
  }),
};
