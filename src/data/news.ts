/**
 * Latest updates. Keep this empty rather than filling unverified items.
 * The UI sorts a copy by date; do not rely on array order alone.
 */
export type NewsItem = {
  id: string;
  /** Display date, ISO `YYYY-MM-DD`. */
  date: string;
  title: string;
  body: string;
  source: string;
  url?: string;
};

export const news: NewsItem[] = [
  {
    id: "2026-08-02-21st-birthday",
    date: "2026-08-02",
    title: "21歳の誕生日を迎えました",
    body: "みりぃが21歳の誕生日を迎えました。お祝いしてくれたみなさんへの感謝とともに、21歳の抱負として「考えていることを脳内に留めず行動に移す。」と綴っています。",
    source: "https://www.instagram.com/p/DbiY3PHk1c8/",
  },
];

export function sortNewsByDateDesc(items: NewsItem[]): NewsItem[] {
  return [...items].sort((a, b) => {
    const byDate = b.date.localeCompare(a.date);
    if (byDate !== 0) return byDate;
    return a.id.localeCompare(b.id);
  });
}
