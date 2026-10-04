import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

const moments = [
  [1, "0:00:30", "笑顔のみりぃ", 290, "privacy-crop"],
  [4, "0:11:00", "ホワイトボードを掲げるみりぃ", 640, "still"],
  [5, "0:15:00", "頬のそばに指を添えるみりぃ", 280, "privacy-crop"],
  [6, "0:19:00", "大きな笑顔のみりぃ", 290, "privacy-crop"],
] as const;
const gallery = moments.map(([index, time, alt, width, variant]) => {
  const downloadName = `mily-b188-${String(index).padStart(2, "0")}-20261004-morning-${variant}.jpg`;
  return { src: `/media/live/${downloadName}`, width, height: 360, alt, caption: `${time}｜${alt}`, downloadName };
});

/** 当日録画の全入力を処理した自動文字起こしの要約。逐語校正は未実施。 */
export const streamRecap20261004Asa: StreamRecap = {
  id: "2026-10-04-asa-showroom", date: "2026-10-04", dateLabel: "2026.10.04（日）",
  theme: "朝の応援とラジオへ向かう準備", broadcastLabel: "5:55頃〜 約44分", platformLabel: "SHOWROOM",
  summary: "ラジオへ向かう前の早朝枠。キラキラ星や投票報告にお礼を伝え、ファイナリストを目指す気持ちを話しました。挨拶が交わされるコメント欄への喜び、プロフィールからの投票案内、最後のみんなの一日へのエールまで、ホワイトボードと笑顔の約44分を振り返ります。",
  image: gallery[1], gallery,
  galleryNote: "当日の録画から選んだ実フレーム4枚です。時刻は元録画の先頭からの目安です。",
  highlights: [
    { timestamp: "0:00:14", title: "早朝に来てくれたみんなへありがとう", body: "朝早くから集まってくれたことへお礼を伝え、キラキラ星での応援をお願いしました。早起きしたみんなとのやりとりから、朝の配信が始まります。" },
    { timestamp: "0:01:35", title: "早起きとファイナリストへの思い", body: "このあとラジオへ行くことを話し、その前に早起きして配信した朝。ファイナリストを目指したい気持ちも伝え、応援を呼びかけました。結果の報告ではなく、この配信で話した目標です。" },
    { timestamp: "0:03:54", title: "自己紹介と応援の案内", body: "きっかけ配信で自己紹介し、応援方法を案内しました。活動を知ってもらうための紹介を交えながら、朝の時間を届けます。" },
    { timestamp: "0:13:30", title: "投票報告にも、ありがとう", body: "コメントで届いた投票報告にお礼を伝えました。キラキラ星だけでなく、投票で力を貸してもらえたことへの喜びを、やりとりの中で返しています。" },
    { timestamp: "0:22:56", title: "挨拶があると、コメントもしやすくなる", body: "挨拶をしてもらうと自分も挨拶したくなり、コメントもしやすくなると話しました。気軽に言葉を交わせる雰囲気への喜びを伝え、これからもよろしくと呼びかけます。" },
    { timestamp: "0:25:12", title: "プロフィールから、WEB投票へ", body: "キラキラ星とWEB投票での応援をお願いし、プロフィールのリンクから投票ページへ進めることを説明しました。質問に応じて案内しました。現在の投票先や受付期間は、このサイトの応援案内で確認できます。" },
    { timestamp: "0:42:17", title: "また来て、もっとおしゃべりを", body: "朝の応援に感謝し、通常配信でもまた来てほしいと呼びかけました。名前を呼ぶだけでなく、みんなとお話しする時間も取りたいという気持ちを伝えています。" },
    { timestamp: "0:43:23", title: "みんなの一日へエール", body: "今日もみんなにとって良い一日になるようにと声をかけ、来てくれたことへの感謝で朝の配信を締めくくりました。" },
  ],
  goals: [], ranking: [],
  timeline: [
    { timestamp: "0:00:14", label: "早朝の挨拶とキラキラ星の応援案内" },
    { timestamp: "0:01:35", label: "このあとラジオへ行く話" },
    { timestamp: "0:02:19", label: "早起きとファイナリストを目指す気持ち" },
    { timestamp: "0:03:54", label: "自己紹介と応援方法の案内" },
    { timestamp: "0:13:30", label: "投票報告へのお礼" },
    { timestamp: "0:22:56", label: "挨拶しやすいコメント欄への喜び" },
    { timestamp: "0:25:12", label: "プロフィールからのWEB投票案内" },
    { timestamp: "0:42:17", label: "通常配信でもまたおしゃべりを" },
    { timestamp: "0:43:23", label: "みんなの一日へのエールとお礼" },
  ],
  nextNote: "",
  sourceLabel: "2026年10月4日 朝のSHOWROOM配信（自動文字起こし）", verifiedAt: "2026-10-04",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の録画から選んだ実フレーム4枚です。",
    extra: "保存録画の音声全体を9分割で自動文字起こしし、本文を要約しています。全編の手動聴取・逐語校正は未実施で、固有名詞や細かな発言には認識誤りの可能性があります。認識が不確かな箇所や個人名、ギフト個数、順位、曲名は掲載していません。時刻は復号音声・元録画の先頭からの目安で、放送時刻とは異なります。次の配信時刻は確定していないため、現在の予定として掲載していません。",
  }),
};
