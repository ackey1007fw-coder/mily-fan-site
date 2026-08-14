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
  url?: string;
  source?: string;
};

export const news: NewsItem[] = [];
