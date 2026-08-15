/**
 * Optional highlights / past milestones.
 * Year-agnostic: add items from any year into this same list.
 */
export type Highlight = {
  id: string;
  year: number;
  title: string;
  body?: string;
  source: string;
};

export const highlights: Highlight[] = [
  {
    id: "2026-miss-circle-contest-entry",
    year: 2026,
    title: "MISS CIRCLE CONTEST 2026 にエントリー",
    body: "ENTRY 734 として出場しています。応援よろしくお願いします。",
    source: "https://2026.misscircle.jp/entry/734",
  },
];
