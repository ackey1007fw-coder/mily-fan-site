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
  facts: [
    {
      label: "MISS CIRCLE CONTEST 2026",
      value: "ENTRY 734",
      source: "https://2026.misscircle.jp/entry/734",
    },
    {
      label: "公開活動",
      value:
        "FM湘南マジックウェイブのスタッフページに、Mily（ミリー）と担当番組「湘南シーサイドサークル」の記載があります。",
      source: "https://fm-smw.jp/staff",
    },
  ],
  summary: "確認できた公開情報を、少しずつまとめています。未確認のことは書きません。",
};
