import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { buildTranscriptionNote } from "./streamRecapRules.ts";

// The user's own authorized recording. Photos and talk excerpts are from this noon live only.
// The full recording and raw ASR are not included in this public repository.
const noonGallery: StreamRecapImage[] = [
  { src: "/media/live/mily-b241-01-20261029-noon-hands-pose.jpg", width: 640, height: 360, alt: "両手を頬に添えてポーズをとるみりぃ", caption: "0:04:25｜頬のそばに両手を添えて", downloadName: "mily-b241-01-20261029-noon-hands-pose.jpg" },
  { src: "/media/live/mily-b241-02-20261029-noon-smile.jpg", width: 640, height: 360, alt: "頬の横で両手を広げて笑顔を見せるみりぃ", caption: "0:06:40｜思わず笑顔に", downloadName: "mily-b241-02-20261029-noon-smile.jpg" },
  { src: "/media/live/mily-b241-03-20261029-noon-joy.jpg", width: 640, height: 360, alt: "横を向いて楽しそうに笑うみりぃ", caption: "0:10:20｜おしゃべり中の表情", downloadName: "mily-b241-03-20261029-noon-joy.jpg" },
  { src: "/media/live/mily-b241-04-20261029-noon-point.jpg", width: 640, height: 360, alt: "人差し指を立てて話すみりぃ", caption: "0:15:00｜指を立てて話す場面", downloadName: "mily-b241-04-20261029-noon-point.jpg" },
  { src: "/media/live/mily-b241-05-20261029-noon-side-smile.jpg", width: 640, height: 360, alt: "横向きに笑顔で会話を続けるみりぃ", caption: "0:20:00｜横顔と笑顔", downloadName: "mily-b241-05-20261029-noon-side-smile.jpg" },
  { src: "/media/live/mily-b241-06-20261029-noon-soft-smile.jpg", width: 640, height: 360, alt: "少し首をかしげて穏やかな表情のみりぃ", caption: "0:25:10｜柔らかな表情", downloadName: "mily-b241-06-20261029-noon-soft-smile.jpg" },
];

export const streamRecap20261029Noon: StreamRecap = {
  id: "2026-10-29-noon-showroom",
  date: "2026-10-29",
  dateLabel: "2026.10.29（木）",
  theme: "昼のセミファイナル初日",
  broadcastLabel: "録画開始14:47頃〜 約29分",
  platformLabel: "SHOWROOM",
  summary: "セミファイナル初日の昼枠。きら星の応援方法やファイナルを目指す思い、集まった人たちへの感謝を、同じ回の録画素材と自動文字起こしから非逐語でまとめました。",
  image: noonGallery[1],
  gallery: noonGallery,
  highlights: [
    { timestamp: "0:02:00", title: "昼枠の応援タイム", body: "きら星の応援について呼びかけ、短い昼枠に足を運んだ人たちへお礼を伝えていました。" },
    { timestamp: "0:06:38", title: "ファイナルへの思い", body: "次のステージに進みたい気持ちと、応援への感謝が語られました。", clip: { src: "/media/live-clips/mily-b241-07-20261029-noon-final-talk.mp4", poster: "/media/live/mily-b241-07-20261029-noon-final-talk-cover.jpg", width: 640, height: 360, durationSeconds: 16, sourceTimestamp: "0:06:38" } },
    { timestamp: "0:12:50", title: "きら星の送り方", body: "きら星の送り方や切り替えのタイミングについて、リスナーと確認する場面がありました。" },
    { timestamp: "0:17:05", title: "一緒に頑張りたい", body: "セミファイナルの話題と、ここからみんなで頑張りたいという呼びかけがありました。", clip: { src: "/media/live-clips/mily-b241-08-20261029-noon-together-talk.mp4", poster: "/media/live/mily-b241-08-20261029-noon-together-talk-cover.jpg", width: 640, height: 360, durationSeconds: 17, sourceTimestamp: "0:17:05" } },
    { timestamp: "0:28:36", title: "お礼と次枠の話", body: "応援へのお礼を伝え、配信時点では同日夜の枠についても案内していました。", clip: { src: "/media/live-clips/mily-b241-09-20261029-noon-thanks-talk.mp4", poster: "/media/live/mily-b241-09-20261029-noon-thanks-talk-cover.jpg", width: 640, height: 360, durationSeconds: 18, sourceTimestamp: "0:28:36" }, relatedLinks: [{ label: "昼枠の画面参考値と欠測", url: "/data-lab/reports/20261029-noon/" }] },
  ],
  goals: [],
  ranking: [],
  timeline: [],
  nextNote: "配信時点では10月29日夜22時頃の枠に言及。確定した予定として扱わず、最新の配信予定を別途確認してください。",
  sourceLabel: "2026年10月29日 昼のSHOWROOM配信（保存ASR88処理区間・画面観測の照合）",
  verifiedAt: "2026-10-29",
  transcriptionNote: buildTranscriptionNote({
    material: "保存された自動文字起こし88処理区間をもとにした非逐語要約です。",
    stills: "静止画は当日の保存録画の実フレーム6枚を掲載しています。",
    publishedClips: true,
    extra: "見どころの時刻は録画先頭からの目安で、速報ASRの日本時間との厳密な同期や正式な配信開始・終了時刻は確認していません。原音の全編手動聴取・逐語校正は未実施です。短尺3本は同回の録画内から切り出した本人トークで、元の音声のみを保持し、BGMや字幕、顔の生成・補正は加えていません。保存映像の実尺は29分17.507秒ですが、全編の無欠落を保証しません。14:47頃は録画処理の開始であり、正式な放送開始時刻ではありません。きら星4,724などの画面参考値は確定終値やイベントptではありません。",
  }),
};
