import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, RANKING_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

// The owner's own authorized recording of this night live. Photos and the three talk excerpts are from this live only.
// Handwritten names on the background sticky notes are hidden with flat paper-colored fills (no generative edits, no face or body edits).
const moments = [
  [10, "hoodie-hello", "グレーのパーカー姿でカメラを見るみりぃ", "ただいまのあいさつ"],
  [90, "teal-top", "パーカーを脱いで青緑のトップス姿になったみりぃ", "パーカーを脱いで"],
  [520, "hands-on-head", "両手を頭に乗せてカメラを見るみりぃ", "両手を頭に"],
  [1330, "soft-smile", "やわらかくほほえむみりぃ", "ふっとほほえむ"],
  [2430, "song-stretch", "片手を頭の後ろに回して笑うみりぃ", "歌い始め"],
  [2585, "song-arm-up", "片手を高く上げて歌うみりぃ", "腕を上げて歌う"],
  [2700, "close-smile", "カメラに近づいて笑うみりぃ", "笑顔が戻って"],
  [2830, "bright-smile", "明るい笑顔で話すみりぃ", "元気になったよ"],
  [3100, "big-smile", "大きく笑うみりぃ", "満面の笑み"],
  [3585, "goodbye-smile", "最後のあいさつで笑顔を見せるみりぃ", "最後のごあいさつ"],
] as const;
const clock = (s: number) => `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
export const night20261101Gallery: StreamRecapImage[] = moments.map(([seconds, slug, alt, label], i) => {
  const filename = `mily-b248-${String(i + 1).padStart(2, "0")}-20261101-night-${slug}.jpg`;
  return { src: `/media/live/${filename}`, width: 640, height: 360, alt, caption: `${clock(seconds)}｜${label}`, downloadName: filename };
});
const clip = (n: number, slug: string, durationSeconds: number, sourceTimestamp: string) => ({
  src: `/media/live-clips/mily-b248-${n}-20261101-night-${slug}.mp4`,
  poster: `/media/live/mily-b248-${n}-20261101-night-${slug}-cover.jpg`,
  width: 640,
  height: 360,
  durationSeconds,
  sourceTimestamp,
});

export const streamRecap1101Night: StreamRecap = {
  id: "2026-11-01-night-showroom",
  date: "2026-11-01",
  dateLabel: "2026.11.01（日）",
  theme: "夜の涙と負けん気宣言",
  broadcastLabel: "22:31頃〜 約60分",
  platformLabel: "SHOWROOM",
  summary: "うまくいかないことが重なった日の夜枠。涙ながらに不安な気持ちも正直に話したうえで「負ける気はさらさらない」と宣言しました。1曲歌って笑顔を取り戻し、また飛躍する時が来るから見ていてほしいと締めくくりました。",
  image: night20261101Gallery[8],
  gallery: night20261101Gallery,
  highlights: [
    { timestamp: "0:07:49", title: "それでも時間どおりに", body: "気持ちを整えるために配信時間をずらそうかとも考えたけれど、みんなに時間を伝えていたからと、予定どおり配信したことを明かしました。" },
    { timestamp: "0:09:40", title: "ラジオの振り返り", body: "この日のラジオを振り返り、公共の電波に乗せている以上、疲れを理由にしてはいけないと自分に言い聞かせていると話しました。" },
    { timestamp: "0:20:20", title: "優しさに触れると", body: "みんなの優しい言葉に触れると、涙が出てきてしまうと素直に打ち明けました。" },
    { timestamp: "0:28:00", title: "最後まで一緒に", body: "セミファイナルに残れていることも、ファイナル争いに参加できていることもみんなのおかげ。ここに来てくれる人たちが大好きだからこそ、最後まで一緒に駆け抜けてほしいと本音を伝えました。" },
    { timestamp: "0:36:59", title: "負ける気はさらさらない", body: "不安に見えるかもしれないけれど、負ける気はさらさらないと宣言。ファイナルに行っている未来が見えると笑い、「よし、泣くフェーズ終わり」と切り替えました。", quote: "負ける気はさらさらないのね", clip: clip(11, "never-give-up", 41.4, "0:36:59") },
    { timestamp: "0:39:43", title: "いつか見返す", body: "負けず嫌いな一面ものぞかせ、これまでばかにしてきた人もいつか見返してやると力強く話しました。このあと大好きな歌を1曲届けています（曲名は未確認）。", clip: clip(12, "prove-them-wrong", 32.0, "0:39:43") },
    { timestamp: "0:46:21", title: "泣いたぶんだけ跳ねる", body: "たくさん泣くことで飛躍する人間だから、今はバネを縮めている最中。一度どん底に落ちる期間があっても、そこから跳ねるところを見ていてほしいと話しました。", clip: clip(13, "spring-back", 29.5, "0:46:21") },
    { timestamp: "0:59:34", title: "また飛躍する時が来る", body: "ランキングの読み上げのあと、こういう時もあるけれど絶対にまた飛躍する時が来るから見ていてほしいと伝え、不安にさせたことを謝りながら、また明日と手を振りました。", quote: "絶対にまた飛躍する時が来るので" },
  ],
  goals: [],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:04", label: "ただいまのあいさつ" },
    { timestamp: "0:07:49", label: "予定どおり配信した理由" },
    { timestamp: "0:09:40", label: "ラジオの振り返り" },
    { timestamp: "0:20:20", label: "優しさに触れて涙" },
    { timestamp: "0:23:05", label: "気持ちをきちんと伝えたい" },
    { timestamp: "0:28:00", label: "本音：最後まで一緒に駆け抜けたい" },
    { timestamp: "0:36:59", label: "負ける気はさらさらない" },
    { timestamp: "0:37:48", label: "泣くフェーズ終わり" },
    { timestamp: "0:39:43", label: "いつか見返す" },
    { timestamp: "0:40:16", label: "1曲歌唱（曲名は未確認）" },
    { timestamp: "0:45:35", label: "香水の話" },
    { timestamp: "0:46:21", label: "泣いたぶんだけ跳ねる" },
    { timestamp: "0:47:45", label: "みんなのおかげで元気に" },
    { timestamp: "0:54:00", label: "ファンレベルの付箋を壁に" },
    { timestamp: "0:58:53", label: "ランキングの読み上げ" },
    { timestamp: "0:59:34", label: "また飛躍する時が来る・お別れ" },
  ],
  nextNote: "配信時点では、次の配信の時刻は案内せず、また明日会おうと呼びかけていました。",
  sourceLabel: "2026年11月1日 夜のSHOWROOM配信（保存録画の自動文字起こし・実フレーム確認）",
  verifiedAt: "2026-11-02",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当日の保存録画の実フレーム10枚を掲載しています。",
    publishedClips: true,
    extra: "見どころとタイムスタンプの時刻は録画先頭からの目安です。録画は22:31頃から約60分で、配信の正式な終了時刻は確認していません。背景の付箋に書かれた名前は、無地の紙色で隠しています。顔や身体の生成・補正はしていません。短尺3本は同じ回の録画から切り出した本人のトークで、元の音声を保持しています。歌唱は1曲確認しましたが、曲名は確認できていないため曲リストは作っていません。原音の全編手動聴取・逐語校正は未実施です。",
  }),
};
