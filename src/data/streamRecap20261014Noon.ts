import type { StreamRecap } from "./streamRecaps.ts";
import { buildTranscriptionNote } from "./streamRecapRules.ts";

// 2026-10-14 昼SHOWROOM。オーナー提供スクショと同日保存録画の実フレームで視覚確認。
// 音声内容は未確認。経過時刻は録画先頭基準で、正確な配信開始・終了時刻ではない。
// 配信画面の視聴者名・アバターはpublicに出さず、本人の元映像から8枚を選定。
const moments = [
  [1, "0:00:00", "カメラに近づいて笑顔を見せるみりぃ", "opening-smile"],
  [2, "0:10:00", "視線を少し下に向けて話すみりぃ", "talking"],
  [3, "0:20:00", "顔を近づけて目を輝かせるみりぃ", "close-smile"],
  [4, "0:50:00", "クッションを前に笑うみりぃ", "cushion-smile"],
  [5, "1:00:00", "クッションを抱えながら上を見つめるみりぃ", "cushion-thoughtful"],
  [6, "1:10:00", "顎に指を添えながら横を向くみりぃ", "finger-chin"],
  [7, "1:42:00", "髪に手を添えてほほえむみりぃ", "hair-touch"],
  [8, "1:43:40", "両手を口元に添えて笑顔を見せるみりぃ", "hand-cupped-smile"],
] as const;

const gallery = moments.map(([index, time, alt, slug]) => {
  const downloadName = `mily-b221-${String(index).padStart(2, "0")}-20261014-noon-${slug}.jpg`;
  return {
    src: `/media/live/${downloadName}`,
    width: 640,
    height: 360,
    alt,
    caption: `${time}｜${alt}`,
    downloadName,
  };
});

export const streamRecap20261014Noon: StreamRecap = {
  id: "2026-10-14-noon-showroom",
  date: "2026-10-14",
  dateLabel: "2026.10.14（水）",
  theme: "昼の笑顔とピース",
  broadcastLabel: "録画開始12:19頃〜 約105分",
  platformLabel: "SHOWROOM",
  summary:
    "昼休憩のひとときに配信したみりぃ。笑顔やピース、ウインクを見せる提供スクショと、クッションを抱えたりカメラに近づいたりする同日の保存映像をもとに、表情豊かな昼の場面を振り返ります。",
  image: gallery[7],
  gallery,
  galleryNote:
    "同日の保存録画から選んだ、視聴者名・コメント・アバターが表示されない実フレーム8枚です。時刻は録画先頭からの経過時間で、配信の正確な時刻を示すものではありません。",
  highlights: [
    {
      timestamp: "0:00:00",
      title: "笑顔で始まる昼の時間",
      body: "カメラに顔を近づけ、やわらかな笑顔を見せています。昼の配信が始まった頃の実映像から選びました。",
    },
    {
      timestamp: "0:20:00",
      title: "ぐっと近づく表情",
      body: "カメラに近づいて、目を大きく開きながらほほえむ姿も。表情の変化を実フレームで残しました。",
    },
    {
      timestamp: "0:50:00",
      title: "クッションといっしょに",
      body: "クッションを抱えながら、正面へ笑顔を向ける場面。リラックスした姿が映っています。",
    },
    {
      timestamp: "1:00:00",
      title: "ふと見上げるまなざし",
      body: "クッションを抱えたまま、少し上へ視線を動かす姿。ポーズの変化が印象に残る一枚です。",
    },
    {
      timestamp: "1:10:00",
      title: "13:30台のきら星の山",
      body: "匿名集計では13:29〜13:35頃にきら星表示が607増加。増加のきっかけとなった話題は未確認です。",
    },
    {
      timestamp: "1:43:40",
      title: "両手を添えた笑顔",
      body: "録画終盤には、両手を口元へ添えてほほえむ姿も。画面の下に視聴者表示のない元映像から選びました。",
    },
  ],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:00:00", label: "カメラに近づいて笑顔" },
    { timestamp: "0:10:00", label: "視線を落とすおしゃべり姿" },
    { timestamp: "0:20:00", label: "カメラの近くでほほえむ" },
    { timestamp: "0:50:00", label: "クッションと笑顔" },
    { timestamp: "1:00:00", label: "クッションを抱えて見上げる" },
    { timestamp: "1:10:00", label: "顎に指を添えた仕草" },
    { timestamp: "1:42:00", label: "髪に手を添える場面" },
    { timestamp: "1:43:40", label: "両手を口元に添えて笑顔" },
  ],
  nextNote: "",
  sourceLabel:
    "2026年10月14日 昼のSHOWROOM配信（保存録画・提供スクリーンショット照合）",
  verifiedAt: "2026-10-14",
  transcriptionNote: buildTranscriptionNote({
    material:
      "オーナー提供の配信画面スクリーンショットと、同日の保存録画の実映像から視覚的に確認した内容です。音声の聞き取り・全文照合は行っていません。",
    stills:
      "静止画は当日の保存録画から切り出した実フレーム8枚です。顔の生成補正・加工はしていません。",
    extra:
      "録画処理開始12:19頃から約105分という長さは配信そのものの開始・終了を確定するものではありません。各時刻は録画先頭からの経過時間です。元の配信画面スクリーンショットには視聴者名・アバターが映るため、公開写真としては使用していません。匿名集計のきら星増加は観測上の参考値で、原因となった発言内容は未確認です。",
  }),
};
