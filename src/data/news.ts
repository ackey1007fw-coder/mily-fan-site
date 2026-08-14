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

export const news: NewsItem[] = [];

export function sortNewsByDateDesc(items: NewsItem[]): NewsItem[] {
  return [...items].sort((a, b) => {
    const byDate = b.date.localeCompare(a.date);
    if (byDate !== 0) return byDate;
    return a.id.localeCompare(b.id);
  });
}
