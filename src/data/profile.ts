/**
 * Profile facts stay empty until the site owner confirms a public source.
 * Do not infer occupation, birthday, hometown, affiliation, or readings.
 */
export type ProfileFact = {
  label: string;
  value: string;
  source?: string;
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
  summary:
    "このページには、いま確認できている名前だけを載せています。未確認の経歴・所属・身体情報は書きません。",
};
