/**
 * Extra fan-site links (not the person's own SNS).
 * Keep empty until a destination is confirmed and clearly unofficial.
 */
export type SiteLink = {
  id: string;
  label: string;
  url: string;
  note?: string;
};

export const links: SiteLink[] = [];
