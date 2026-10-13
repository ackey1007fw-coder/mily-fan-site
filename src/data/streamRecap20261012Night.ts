import type { StreamRecap } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildRankingNote,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

// 10/12夜の本人保存映像から、閲覧者UIのない実フレームだけを採用。
// 写真時刻は録画先頭基準。配信全体の開始時刻ではありません。
const moments = [
  [1, "0:00:50", "赤いフードをかぶって話すみりぃ"],
  [2, "0:07:00", "赤ずきん姿でほほえむみりぃ"],
  [3, "0:11:20", "胸元に手を添えて笑うみりぃ"],
  [4, "0:17:00", "前髪を整えるみりぃ"],
  [5, "0:22:00", "笑顔で手を動かすみりぃ"],
  [6, "0:31:00", "三つ編みに触れながら話すみりぃ"],
  [7, "0:39:40", "目元に手を添えて話すみりぃ"],
  [8, "0:47:00", "フードを後ろに下ろして話すみりぃ"],
  [9, "0:52:30", "両手を広げて笑顔を見せるみりぃ"],
  [10, "0:57:00", "赤いフード姿でカメラに笑顔を向けるみりぃ"],
  [11, "1:10:40", "両手を合わせて笑うみりぃ"],
  [12, "2:13:40", "両手を頬に添えてほほえむみりぃ"],
] as const;

const gallery = moments.map(([index, time, alt]) => {
  const downloadName =
    `mily-b218-${String(index).padStart(2, "0")}-20261012-final-night-still.jpg`;
  return {
    src: `/media/live/${downloadName}`,
    width: 640,
    height: 360,
    alt,
    caption: `${time}｜${alt}`,
    downloadName,
  };
});

export const streamRecap20261012Night: StreamRecap = {
  id: "2026-10-12-final-night-showroom",
  date: "2026-10-12",
  dateLabel: "2026.10.12（月）",
  theme: "夜の赤ずきんと最終エール",
  broadcastLabel: "録画開始21:00頃〜 約138分",
  platformLabel: "SHOWROOM",
  summary:
    "MISS CIRCLE CONTEST 2026四次審査の最終夜。赤ずきん姿で登場し、歌と応援への感謝を届けました。SHOWROOM審査終了後も配信を続け、これからの挑戦や楽しいおしゃべりを交わしました。",
  image: gallery[9],
  gallery,
  galleryNote:
    "当日の保存録画から選んだ実フレーム12枚です。写真の時刻は録画先頭からの目安で、配信全体の開始時刻とは異なります。",
  galleryZip: {
    src: "/media/live/mily-b218-13-20261012-final-night-stills.zip",
    filename: "mily_20261012_final_night_screenshots_12.zip",
    label: "12枚まとめて保存",
  },
  songs: [
    {
      title: "超最強",
      artist: "超ときめき♡宣伝部",
      timestamp: "0:24:20",
      youtubeUrl: "https://www.youtube.com/watch?v=Yeahpo-0Ub4",
    },
    {
      title: "ヘビーローテーション",
      artist: "AKB48",
      timestamp: "0:32:20",
      youtubeUrl: "https://www.youtube.com/watch?v=lkHlnWFnA0c",
    },
    {
      title: "とくべチュ、して",
      artist: "＝LOVE",
      timestamp: "0:40:00",
      youtubeUrl: "https://www.youtube.com/watch?v=F3P8vcZkIh4",
    },
    {
      title: "Mela!",
      artist: "緑黄色社会",
      timestamp: "0:49:02",
      youtubeUrl: "https://www.youtube.com/watch?v=aRDURmIYBZ4",
    },
    {
      title: "ファンサ",
      artist: "mona（CV：夏川椎菜）",
      timestamp: "0:56:21",
      youtubeUrl: "https://www.youtube.com/watch?v=lzyDD8bMDKs",
    },
  ],
  highlights: [
    {
      timestamp: "0:05:10",
      title: "赤ずきん姿をお披露目",
      body:
        "赤いフードと三つ編み姿で登場。初めての仮装について話し、衣装を見せながら楽しく交流しました。",
    },
    {
      timestamp: "0:09:24",
      title: "衣装とトマトのおしゃべり",
      body:
        "赤ずきんの衣装を話題にし、トマトのモチーフにも触れながら、にぎやかな会話が続きました。",
    },
    {
      timestamp: "0:31:48",
      title: "最終夜の応援に感謝",
      body:
        "コメントやきら星で届く応援に何度もお礼を伝え、最後まで一緒に過ごす時間を大切にしていました。",
    },
    {
      timestamp: "0:40:20",
      title: "歌を届けるひととき",
      body:
        "会話の合間に歌う場面があり、歌い終わると再びリスナーとのやり取りに戻りました。",
    },
    {
      timestamp: "0:56:04",
      title: "締切間際のラストナンバー",
      body:
        "審査終了が近づく中、最後の一曲へ。歌が終わった後には、練習してきた曲への思いも話しました。",
    },
    {
      timestamp: "1:00:22",
      title: "走り切ったあとのお礼",
      body:
        "審査の終了を迎え、皆さんと走り切れたことに感謝。配信はここで終わらず、交流が続きました。",
    },
    {
      timestamp: "1:07:30",
      title: "応援してくれた人たちへ",
      body:
        "配信中にランキングを読み上げながら、最終日まで見守った人たちにお礼を伝えました。",
    },
    {
      timestamp: "1:22:09",
      title: "これからも続く挑戦",
      body:
        "これからも楽しみながら活動を続けたいという気持ちを話し、応援の輪を広げたいと語りました。",
    },
  ],
  goals: [],
  ranking: [buildRankingNote(undefined, undefined, "during")],
  timeline: [
    { timestamp: "0:00:50", label: "赤ずきん姿で配信" },
    { timestamp: "0:05:10", label: "初めての仮装の話" },
    { timestamp: "0:09:24", label: "衣装とトマトの話題" },
    { timestamp: "0:17:00", label: "前髪を整える仕草" },
    { timestamp: "0:22:00", label: "笑顔と手振り" },
    { timestamp: "0:31:48", label: "応援への感謝" },
    { timestamp: "0:40:20", label: "歌唱のひととき" },
    { timestamp: "0:47:00", label: "フードを下ろしておしゃべり" },
    { timestamp: "0:52:30", label: "笑顔で手を広げるみりぃ" },
    { timestamp: "0:56:04", label: "審査終了前の最後の歌" },
    { timestamp: "1:00:22", label: "審査終了後のお礼" },
    { timestamp: "1:07:30", label: "ランキング読み上げと感謝" },
    { timestamp: "1:22:09", label: "これからの活動への思い" },
    { timestamp: "1:29:50", label: "楽しさを語る交流" },
    { timestamp: "2:13:40", label: "手を頬に添えたポーズ" },
    { timestamp: "2:16:30", label: "最後の挨拶" },
  ],
  nextNote:
    "配信時点では、翌朝5:50頃から配信する予定にも触れていました。最新の予定は本人の告知をご確認ください。",
  sourceLabel:
    "2026年10月12日 夜のSHOWROOM最終日配信（保存録画・自動文字起こし）",
  verifiedAt: "2026-10-13",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画から切り出した実フレーム12枚です。",
    extra:
      "配信全体の自動文字起こし411チャンクと保存映像の実フレームを照合しました。全編の手動実聴・逐語校正は未実施です。歌唱した5曲の曲名は自動文字起こしの歌唱区間を原曲の公表歌詞と照合し、アーティスト公式YouTubeの動画で確認しました。歌詞、個別のリスナー名、ギフトや順位の未確定数値は掲載していません。録画開始21:00頃は配信全体の開始時刻を確定する情報ではなく、約138分は保存録画の長さです。SHOWROOM審査は21:59までで、その後もおしゃべりが続きました。",
  }),
};
