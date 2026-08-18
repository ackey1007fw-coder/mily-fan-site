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
import { morningStoryVideo } from "./morningStoryVideo.ts";

export type NewsMedia = {
  kind: "video";
  src: string;
  poster: string;
  width: number;
  height: number;
  alt: string;
};

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
