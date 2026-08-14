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

export const highlights: Highlight[] = [];
