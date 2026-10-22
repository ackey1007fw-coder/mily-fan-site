import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildRankingNote, buildTranscriptionNote } from "./streamRecapRules.ts";

const moments = [
  [62, "リボンを両手で整えるみりぃ"],
  [540, "カメラの近くで笑顔を見せるみりぃ"],
  [714, "指で丸を作って笑うみりぃ"],
  [718, "口元に両手を添えて笑うみりぃ"],
  [2160, "片手を頭の後ろに添えたみりぃ"],
  [2700, "ヘアバンドに手を添えて話すみりぃ"],
  [4320, "前を向いて笑顔を見せるみりぃ"],
  [4860, "頬の近くに指を添えたみりぃ"],
  [5220, "口元の横に両手を広げるみりぃ"],
  [5400, "首をかしげて笑うみりぃ"],
] as const;
const clock = (s: number) => `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
export const night20261022Gallery: StreamRecapImage[] = moments.map(([seconds, alt], i) => {
  const filename = `mily-b236-${String(i + 1).padStart(2, "0")}-20261022-night-${String(seconds).padStart(5, "0")}s.png`;
  return { src: `/media/live/${filename}`, width: 640, height: 360, alt, caption: `録画内 ${clock(seconds)}頃`, downloadName: filename };
});
const clip = (number: number, slug: string, durationSeconds: number, sourceTimestamp: string) => ({
  src: `/media/live/mily-b236-${number}-20261022-night-${slug}.mp4`,
  poster: `/media/live/mily-b236-${number}-20261022-night-${slug}-cover.jpg`,
  width: 720, height: 1280, durationSeconds, sourceTimestamp,
});

export const streamRecap20261022Night: StreamRecap = {
  id: "2026-10-22-night-showroom", date: "2026-10-22", dateLabel: "2026.10.22（木）",
  theme: "夜のリボンと笑顔", broadcastLabel: "録画開始21:02頃〜 約95分", platformLabel: "SHOWROOM",
  summary: "紫のリボンのヘアバンドを紹介し、笑顔でおしゃべりを楽しんだ夜。歌の時間をはさみ、もっと楽しんでもらえる配信にしたいという思いと、次の配信への案内を届けました。",
  image: night20261022Gallery[1], gallery: night20261022Gallery,
  galleryZip: { src: "/media/live/mily-b236-14-20261022-night-stills.zip", filename: "mily-b236-14-20261022-night-stills.zip", label: "この回の写真10枚をまとめて保存" },
  highlights: [
    { timestamp: "0:07:32", title: "紫リボンのヘアバンド", body: "リボンの付いたヘアバンドを紹介。耳の部分を動かしながら、見ている人たちとやり取りしました。", clip: clip(11, "headband", 18.2, "0:07:28") },
    { timestamp: "0:23:06", title: "ハロウィンの話題へ", body: "ハロウィンを話題にし、どんな仮装がおすすめかをみんなに尋ねました。" },
    { timestamp: "0:55:00", title: "おしゃべりから歌の時間へ", body: "会話をはさみながら歌を届け、聴いてくれた人たちにお礼を伝えました。" },
    { timestamp: "1:26:51", title: "楽しめる配信にしたい", body: "来てくれた人たちに感謝を伝え、みんなが楽しいと思える配信にしていきたいと話しました。", clip: clip(12, "together", 10.8, "1:26:50") },
    { timestamp: "1:31:05", title: "ランキングと感謝", body: "ランキングを読み上げながら、その夜の応援や一緒に過ごした時間に感謝を伝えました。", relatedLinks: [{ label: "この回の記録と確認範囲", url: "/data-lab/reports/20261022-night/" }] },
    { timestamp: "1:33:27", title: "翌朝の配信を案内", body: "翌朝のきっかけ配信と通常配信を案内し、また来てほしいと呼びかけました。" },
    { timestamp: "1:34:55", title: "笑顔で、おやすみ", body: "最後は両手を振り、笑顔でおやすみの挨拶を届けました。", clip: clip(13, "goodnight", 11, "1:34:55") },
  ],
  goals: [{ item: "配信", target: "楽しめる配信", statusThen: "意欲を語りました" }],
  songs: [
    { title: "イイじゃん", artist: "M!LK", timestamp: "0:55:00", youtubeUrl: "https://www.youtube.com/watch?v=GW-XMhRQDFI" },
    { title: "夜に駆ける", artist: "YOASOBI", timestamp: "1:01:19", youtubeUrl: "https://www.youtube.com/watch?v=x8VYWazR5mE" },
  ],
  ranking: [buildRankingNote(undefined, undefined, "during")],
  timeline: [
    { timestamp: "0:07:32", label: "ヘアバンドを紹介" },
    { timestamp: "0:23:06", label: "ハロウィンの話題" },
    { timestamp: "0:55:00", label: "歌の時間" },
    { timestamp: "1:26:51", label: "楽しめる配信への思い" },
    { timestamp: "1:31:05", label: "ランキングとお礼" },
    { timestamp: "1:33:27", label: "翌朝の案内" },
    { timestamp: "1:34:55", label: "おやすみの挨拶" },
  ],
  nextNote: "配信時点では、翌朝5:30からきっかけ配信、6:30から1時間の通常配信と案内していました。",
  sourceLabel: "2026年10月22日 夜のSHOWROOM配信（保存録画の実フレーム・自動文字起こし参照）",
  verifiedAt: "2026-10-22",
  transcriptionNote: buildTranscriptionNote({ material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は同じ夜配信の実フレーム10枚を掲載しています。", publishedClips: true,
    extra: "保存メディアの実尺は95分26.763秒です。自動文字起こし194区間を生成し、本文の該当区間と3本のトーク候補区間を照合しました。音声の手動聴取・全文の逐語校正は未実施です。短尺3本は同じ録画の原音を保持し、先頭0.3秒に当日の本人写真による表紙を表示しています。背景の紙の文字を判読できないよう処理し、本人の顔は生成・補正していません。曲名は自動文字起こしの該当区間と公式楽曲情報を照合した参考記録で、全曲を網羅するものではありません。歌唱音源の自己ホストは追加していません。時刻は保存録画先頭からの目安で、配信の正確な開始・終了や全区間の連続性は未確認です。" }),
};
