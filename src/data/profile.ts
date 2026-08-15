/**
 * Profile facts stay empty until the site owner confirms a public source.
 * Do not infer occupation, birthday, hometown, affiliation, or readings.
 */
export type ProfileFact = {
  label: string;
  value: string;
  source: string;
};

export type Profile = {
  displayName: string;
  legalName: string;
  facts: ProfileFact[];
  summary: string;
};

export const profile: Profile = {
  displayName: "みりぃ",
  legalName: "三橋莉子",
  facts: [],
  summary: "みりぃさんのプロフィールは、これから少しずつ充実させていきます。",
};
