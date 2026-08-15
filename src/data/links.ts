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

export const links: SiteLink[] = [
  {
    id: "miss-circle-2026-734",
    label: "MISS CIRCLE CONTEST 2026 ENTRY 734",
    url: "https://2026.misscircle.jp/entry/734",
    note: "コンテストのエントリーページです。投票方法や最新情報はリンク先でご確認ください。",
  },
  {
    id: "fm-smw-staff",
    label: "FM湘南マジックウェイブ スタッフ",
    url: "https://fm-smw.jp/staff",
    note: "Mily（ミリー）と湘南シーサイドサークルの記載があるスタッフページです。",
  },
];
