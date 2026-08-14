/**
 * Latest updates. Keep this empty rather than filling unverified items.
 * Newer items belong at the front of the array.
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
