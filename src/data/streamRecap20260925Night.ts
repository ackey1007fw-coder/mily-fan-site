import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

const moments = [
  ["0:04:00", "紫のリボンで笑顔", "紫のリボンの帽子をかぶって話すみりぃ"],
  ["0:10:00", "リボンを整えて", "帽子のリボンを手で整えて笑うみりぃ"],
  ["0:13:00", "カメラへにっこり", "カメラに近づいてほほ笑むみりぃ"],
  ["0:22:00", "頬に手を添えて", "両手を頬に添えて笑うみりぃ"],
  ["0:25:00", "少し離れて笑顔", "少し離れた位置から笑顔を見せるみりぃ"],
  ["0:28:00", "両手を広げて", "両手を広げてにっこりするみりぃ"],
  ["0:52:00", "髪を整えながら", "髪を整えながら笑うみりぃ"],
  ["1:01:00", "予定表と一緒に", "予定表をカメラへ見せるみりぃ"],
  ["1:10:00", "あごに手を添えて", "あごに手を添えて話すみりぃ"],
  ["1:28:00", "締めくくりの笑顔", "終盤に笑顔で話すみりぃ"],
] as const;

const stills: StreamRecapImage[] = moments.map(([time, caption, alt], i) => ({
  src: `/media/live/mily-b163-${String(i + 1).padStart(2, "0")}-night.jpg`,
  width: 640,
  height: 360,
  alt,
  caption: `${time} ${caption}`,
  downloadName: `みりぃ_20260925夜_${String(i + 1).padStart(2, "0")}.jpg`,
}));

export const streamRecap20260925Night: StreamRecap = {
  id: "2026-09-25-night-showroom",
  date: "2026-09-25",
  dateLabel: "2026.09.25（金）",
  theme: "夜の四次審査作戦会議",
  broadcastLabel: "21:31頃〜 約90分",
  platformLabel: "SHOWROOM",
  summary: "紫のリボンの帽子をかぶって、四次審査までの過ごし方をみんなと相談。配信の魅力についても問いかけ、応援の言葉に耳を傾けながら夜の時間を過ごしました。",
  image: stills[3],
  gallery: stills,
  galleryZip: {
    src: "/media/live/mily-b163-night-stills.zip",
    filename: "みりぃ_20260925夜_スクショ10枚.zip",
    label: "10枚まとめて保存",
  },
  highlights: [
    {
      timestamp: "0:01:20",
      title: "四次審査までの相談",
      body: "四次審査が始まるまでの約1週間、配信の時間をどう組むかをみんなと考えたいと話しました。",
    },
    {
      timestamp: "0:06:20",
      title: "配信に来てくれる理由",
      body: "いつも足を運んでくれる人たちへ、どんなところを楽しみにしているのか問いかけました。",
    },
    {
      timestamp: "0:10:14",
      title: "リボン姿のおしゃべり",
      body: "帽子のリボンを整えながら、話やリアクションを楽しんでもらえているなら続けたいと笑顔で話しました。",
      clip: {
        src: "/media/live-clips/mily-b163-night-hat-talk.mp4",
        poster: "/media/live-clips/mily-b163-night-hat-talk-poster.jpg",
        width: 640,
        height: 360,
        durationSeconds: 14,
        sourceTimestamp: "0:10:14",
      },
      socialClip: {
        title: "紫リボンの帽子でおしゃべり", sourceTimestamp: "0:10:14", durationSeconds: 14,
        links: [
          { platform: "youtube", url: "https://www.youtube.com/watch?v=M9daXYmctro" },
          { platform: "tiktok", url: "https://www.tiktok.com/t/7689586946397506822" },
          { platform: "instagram", url: "https://www.instagram.com/reel/DdubDy2jnSe/" },
          { platform: "x", url: "https://x.com/ackey_RiRi_supp/status/2103597065037082959" },
        ],
      },
    },
    {
      timestamp: "0:13:00",
      title: "自分らしい明るさ",
      body: "元気や明るさについての反応に笑い、応援してくれる人たちへ感謝を伝えました。",
    },
    {
      timestamp: "0:23:42",
      title: "ファイナルへの思い",
      body: "ファイナルへ進みたいという目標を語り、自分の魅力にも気づきながら挑戦したいと話しました。",
    },
    {
      timestamp: "0:32:20",
      title: "応援の言葉が届いて",
      body: "自分の魅力をうまく見つけられない気持ちを打ち明けると、みんなから温かい言葉が。涙を見せながら感謝し、最後まで頑張ると伝えました。",
    },
    {
      timestamp: "0:53:20",
      title: "写真からスイーツの話へ",
      body: "SNSに載せた写真の話から、オレオがたっぷりのスイーツの感想へ。おいしかったと笑って、いつものにぎやかなおしゃべりが続きました。",
    },
    {
      timestamp: "1:00:00",
      title: "これからの配信時間を相談",
      body: "予定表を見せながら、翌朝は少し長めにおしゃべりしたいと話しました。開始時刻はその場では決めず、来られるときに遊びに来てほしいと呼びかけました。",
    },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:01:20", label: "四次審査までの時間の相談" },
    { timestamp: "0:02:23", label: "誕生日のお祝い" },
    { timestamp: "0:06:20", label: "配信の魅力をみんなに尋ねる" },
    { timestamp: "0:10:14", label: "リボンを整えながらのトーク" },
    { timestamp: "0:13:00", label: "自分らしい元気と明るさ" },
    { timestamp: "0:23:42", label: "ファイナルを目指す思い" },
    { timestamp: "0:32:20", label: "応援の言葉に涙と感謝" },
    { timestamp: "0:53:20", label: "SNSの写真とスイーツの話" },
    { timestamp: "1:00:00", label: "予定表を見せて翌朝の配信を相談" },
  ],
  nextNote: "配信時点では、翌朝は長めに配信したいと話していました。開始時刻は決めておらず、現在の予定ではありません。",
  sourceLabel: "2026年9月25日 SHOWROOM夜配信（保存録画・自動文字起こし確認）",
  verifiedAt: "2026-09-26",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は同じ録画の実フレーム10枚を掲載しています。",
    extra: "録画開始記録21:31:54、メディア実測5410.862秒。録画を分割して自動文字起こしし、主要な場面と実フレームを照合しました。全編手動聴取・逐語校正ではありません。時刻は録画先頭からの目安です。",
  }),
};
