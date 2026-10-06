import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE_WITHOUT_RANGE } from "./streamRecapRules.ts";

const gallery = [
  ["01", "0:07:00", "カメラへ笑顔を向けるみりぃ"],
  ["02", "0:32:20", "カメラへ少し身を寄せるみりぃ"],
  ["03", "1:20:00", "胸元で手を合わせるみりぃ"],
].map(([index, time, alt]) => {
  const downloadName = `mily-b193-${index}-20261005-night-still.jpg`;
  return { src: `/media/live/${downloadName}`, width: 640, height: 360, alt, caption: `${time}｜${alt}`, downloadName };
});

export const streamRecap20261005Night: StreamRecap = {
  id: "2026-10-05-night-showroom", date: "2026-10-05", dateLabel: "2026.10.05（月）",
  theme: "夜の歌とコメントへのお礼",
  broadcastLabel: "録画開始21:30頃〜 約81分", platformLabel: "SHOWROOM",
  summary: "投票報告へのお礼から、虫の出来事を話す雑談へ。同じ話題を後の時間にも説明し、コメントへの応答を挟んで歌の案内や授業の話へ移ります。終盤はお礼と翌日への挨拶。当日の実写真3枚と、自動文字起こしに基づく要約です。",
  image: gallery[0], gallery,
  galleryNote: "当日の保存録画から選んだ実写真3枚です。写真の時刻は録画の先頭からの目安で、写っている表情・仕草のみを紹介しています。",
  highlights: [
    { timestamp: "0:03:29", title: "投票報告へのお礼から", body: "挨拶と投票報告へのお礼から始まった夜配信。コメントを読みながら応答していきます。個別のお礼を挟みつつ、雑談が続く流れです。" },
    { timestamp: "0:06:49", title: "虫の話をあらためて説明", body: "序盤には虫の出来事を話し、コメントへの応答が続きました。12分台には同じ話題をあらためて説明。コメントへの応答が続きました。" },
    { timestamp: "0:32:11", title: "応答を挟んで、夜の一曲目へ", body: "32分ごろには夜の一曲目への案内がありました。歌へ入る直前にもコメントへのお礼や案内文の訂正が入り、会話を続けながら歌の時間へ移っていきます。曲名は未確認のため掲載していません。" },
    { timestamp: "0:56:19", title: "次の曲を届けようとする案内", body: "56分ごろにも、コメントを受けて次の曲を届けようとする案内があります。歌の前後も応援へのお礼とやり取りが続き、会話と歌の案内が交互に入る夜になりました。" },
    { timestamp: "1:14:29", title: "後半には授業の話題も", body: "後半には授業が話題となり、コメントとやり取りしました。" },
    { timestamp: "1:18:14", title: "終盤も応答しながら、お礼の時間へ", body: "終盤はランキングの読み上げとお礼の時間へ。レベル上昇にも反応しながら、今後も来てほしいと伝えます。最後までコメントとのやり取りを挟みつつ、応援へのお礼を重ねました。" },
    { timestamp: "1:20:27", title: "翌日への案内と、就寝前の挨拶", body: "最後には翌日の配信に触れ、就寝前の挨拶で締めくくられました。この回の案内は過去の会話として扱い、現在の日程は応援案内でご確認ください。" },
  ],
  goals: [], ranking: [RANKING_NOTE_WITHOUT_RANGE],
  timeline: [
    { timestamp: "0:03:29", label: "投票報告へのお礼" },
    { timestamp: "0:06:49", label: "虫の出来事とコメントへの応答" },
    { timestamp: "0:12:47", label: "同じ話題をあらためて説明" },
    { timestamp: "0:32:11", label: "夜の一曲目への案内" },
    { timestamp: "0:56:19", label: "次の曲への案内" },
    { timestamp: "1:14:29", label: "授業の話題" },
    { timestamp: "1:18:14", label: "終盤の読み上げとお礼" },
    { timestamp: "1:20:27", label: "翌日への挨拶" },
  ],
  nextNote: "", sourceLabel: "2026年10月5日 夜のSHOWROOM配信（保存録画・自動文字起こし）", verifiedAt: "2026-10-07",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画の実写真3枚です。",
    extra: "保存録画を41区間に分けた自動文字起こしの要約です。全文の実音聴取・逐語校正は未完了です。時刻は録画内の目安で、歌唱の正確な境界は確定していません。本人・第三者の私生活の細部、視聴者名、曲名・歌詞、ギフト数量や順位は掲載していません。録画開始と長さは参考で、配信全体の無欠落を保証するものではありません。写真から発言や感情を推定していません。",
  }),
};
