/**
 * Latest updates. Keep this empty rather than filling unverified items.
 * The UI sorts a copy by date; do not rely on array order alone.
 * How to add an item: docs/CONTENT-OPS.md
 *
 * - source: optional confirmed 出典 URL（「出典を見る」）
 * - sourceLabel: optional label. Without source, it renders as non-link text.
 * - url: optional. Only when it differs from source（「関連リンク」）
 * - ctaLabel: optional. href is url ?? source
 */
import {
  morningStoryVideo,
  morningStory20260820,
} from "./morningStoryVideo.ts";

export type NewsVideoMedia = {
  kind: "video";
  src: string;
  poster: string;
  width: number;
  height: number;
  alt: string;
};

/** Self-hosted still image that belongs to the post itself, not the Gallery. */
export type NewsImageMedia = {
  kind: "image";
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type NewsMedia = NewsVideoMedia | NewsImageMedia;

export type NewsMessage = {
  label?: string;
  text: string;
};

export type NewsItem = {
  id: string;
  /** Display date, ISO `YYYY-MM-DD`. */
  date: string;
  title: string;
  body: string;
  source?: string;
  sourceLabel?: string;
  url?: string;
  ctaLabel?: string;
  media?: NewsMedia;
  message?: NewsMessage;
};

export const news: NewsItem[] = [
  {
    id: "2026-08-20-morning-message",
    date: "2026-08-20",
    title: "おはよう‼︎🌞 無理せず、今日も一緒に",
    body: "8月20日の朝、みりぃがXに投稿しました。「今日も自分のできることを無理せず」と伝え、「私もみんなと一緒に頑張るね」という言葉を届けています。",
    source: "https://x.com/mily_chan36/status/2090242507586322892",
    sourceLabel: "Xの投稿を見る",
    media: {
      kind: "image",
      src: "/media/news/mily-b08-01-do-what-you-can-morning.jpg",
      width: 1538,
      height: 2048,
      alt: "室内の鏡の前でスマートフォンを持って撮影するみりぃ",
    },
    message: {
      label: "みりぃの投稿",
      text: "おはよう‼︎🌞\n今日も自分のできることを無理せず。\n私もみんなと一緒に頑張るね🙂‍↕️\n#ミスサー #ミスサークルコンテスト #ミスサー2026 #ミスサークルコンテスト2026 #ミスサークル2026",
    },
  },
  {
    id: "2026-08-20-morning-story",
    date: "2026-08-20",
    title: "おはよう☀️ 今日も自分ができることを〜♪",
    body: "8月20日の朝、みりぃからInstagram Storyが届きました。「今日も自分ができることを〜♪」という言葉とともに、「おはよう」のひとコマです。",
    sourceLabel: morningStory20260820.sourceLabel,
    media: morningStory20260820,
    message: {
      label: "みりぃのメッセージ",
      text: "8/20 (木) 今日も自分ができることを〜♪",
    },
  },
  {
    id: "2026-08-19-second-round-result",
    date: "2026-08-19",
    title: "MISS CIRCLE CONTEST 2026 2次審査通過！三次審査進出へ✨",
    body: "みりぃが「MISS CIRCLE CONTEST 2026」の2次審査通過と、三次審査への進出を報告しました。毎日の投票やSHOWROOMでの応援への感謝とともに、「一緒に絶景観に行きましょう」とこれからの挑戦への言葉を届けています。",
    source: "https://x.com/Mily_chan36/status/2089996508691390948",
    sourceLabel: "Xの投稿を見る",
    url: "/stories/second-round-result-2026/",
    ctaLabel: "2次審査通過の記録を読む",
  },
  {
    id: "2026-08-19-well-rested-morning",
    date: "2026-08-19",
    title: "体調回復❤️‍🩹 元気に朝のごあいさつ☀️",
    body: "しっかり眠れて体調が回復したことを、みりぃが朝のX投稿で報告しました。心配してくれたみんなへのお礼と、「今日もみんなと一緒に頑張るぞぃ〜〜🍀」という言葉が届いています。",
    source: "https://x.com/Mily_chan36/status/2089841199280742669",
    sourceLabel: "Xの投稿を見る",
    media: {
      kind: "image",
      src: "/media/news/mily-b06-01-recovery-morning.jpg",
      width: 1162,
      height: 2048,
      alt: "ウインクしてピースするみりぃの自撮り。動物フィルターと朝のあいさつ文字入り",
    },
    message: {
      label: "みりぃの投稿",
      text: "おはよう〜☀️\n体調回復❤️‍🩹\nしっかり寝ました！！！\n\nみんな心配ありがとう🥹❣️\n今日もみんなと一緒に頑張るぞぃ〜〜🍀\n\n#ミスサー #ミスサークル #ミスサークルコンテスト #ミスサー2026 #ミスサークル2026 #ミスサークルコンテスト2026 #ミスコン",
    },
  },
  {
    id: "2026-08-18-evening-radio",
    date: "2026-08-18",
    title: "ラジオ配信ありがとうございました",
    body: "体は本調子ではないなかでもラジオ配信を届けてくれたみりぃから、見に来てくれた人へのお礼が届きました。翌日の配信は夜になる予定で、時間は当日改めて伝えるとのこと。",
    source: "https://x.com/Mily_chan36/status/2089721650522820667",
    sourceLabel: "Xの投稿を見る",
    url: "/stories/2026-08-18-radio/",
    ctaLabel: "配信の記録を読む",
  },
  {
    id: "2026-08-18-morning-update",
    date: "2026-08-18",
    title: "おはよう〜☀️ 10:50〜11:30配信予定",
    body: "「リビングで寝なかったよ😳（成長を感じるね）」から始まった朝の投稿。今日は大学の友達との予定の前に、10:50〜11:30まで配信予定。ビギナーイベントにも参加中です。",
    sourceLabel: "みりぃからの連絡💌",
    url: "https://www.showroom-live.com/r/circle2026_0734",
    ctaLabel: "SHOWROOMで応援する",
    media: {
      kind: "video",
      src: "/media/gallery/mily-b04-01-morning-showroom-ios.mp4",
      poster: "/media/gallery/mily-b04-01-morning-showroom-poster.jpg",
      width: 160,
      height: 284,
      alt: "朝の配信画面でピースをしながらウインクするみりぃの動画",
    },
    message: {
      label: "みりぃのメッセージ",
      text: "昨日は高校の友達。今日は大学の友達と予定があるから、【10:50〜11:30】まで配信しようかと思ってるよ〜‼️ ビギナーイベントも参加してみたの！！！ 気軽に遊びに来てね🍀✨ ぜひキラ星から応援お願いいたします🥺🙌🏻",
    },
  },
  {
    id: "2026-08-17-morning-story",
    date: "2026-08-17",
    title: "おはよう☀️ 朝のストーリー",
    body: "猫耳フィルターで「OHAYO!!」。みりぃから届いた朝のひとコマ。",
    sourceLabel: morningStoryVideo.sourceLabel,
    media: morningStoryVideo,
    message: {
      label: "みりぃのメッセージ",
      text: "8/17（月）今日からお仕事が始まる皆さん応援して…",
    },
  },
  {
    id: "2026-08-02-21st-birthday",
    date: "2026-08-02",
    title: "21歳の誕生日を迎えました",
    body: "21歳の誕生日。お祝いしてくれたみなさんへの感謝と、「考えていることを脳内に留めず行動に移す。」という21歳の抱負。",
    source: "https://www.instagram.com/p/DbiY3PHk1c8/",
    ctaLabel: "Instagramの投稿を見る",
  },
];

export function sortNewsByDateDesc(items: NewsItem[]): NewsItem[] {
  return [...items].sort((a, b) => {
    const byDate = b.date.localeCompare(a.date);
    if (byDate !== 0) return byDate;
    return a.id.localeCompare(b.id);
  });
}
