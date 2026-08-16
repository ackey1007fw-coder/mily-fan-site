/**
 * Latest updates. Keep this empty rather than filling unverified items.
 * The UI sorts a copy by date; do not rely on array order alone.
 * How to add an item: docs/CONTENT-OPS.md
 *
 * - source: required 出典 URL（「出典を見る」）
 * - url: optional. Only when it differs from source（「関連リンク」）
 * - ctaLabel: optional. href is url ?? source
 */
export type NewsItem = {
  id: string;
  /** Display date, ISO `YYYY-MM-DD`. */
  date: string;
  title: string;
  body: string;
  source: string;
  url?: string;
  ctaLabel?: string;
};

export const news: NewsItem[] = [
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
