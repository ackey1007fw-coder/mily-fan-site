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
    note: "投票方法・最新情報はENTRY 734ページへ。",
  },
  {
    id: "fm-smw-staff",
    label: "FM湘南マジックウェイブ スタッフ",
    url: "https://fm-smw.jp/staff",
    note: "Mily（ミリー） / 湘南シーサイドサークル",
  },
  {
    id: "fm-smw-mily-profile",
    label: "MilyのFMプロフィール",
    url: "https://fm-smw.jp/staff/mily%EF%BC%88%E3%83%9F%E3%83%AA%E3%83%BC%EF%BC%89",
    note: "FM湘南マジックウェイブ / Mily（ミリー）",
  },
  {
    id: "fm-smw-ssc-program",
    label: "湘南シーサイドサークル",
    url: "https://fm-smw.jp/program/%E3%80%8E-%E6%B9%98%E5%8D%97%E3%82%B7%E3%83%BC%E3%82%B5%E3%82%A4%E3%83%89%E3%82%B5%E3%83%BC%E3%82%AF%E3%83%AB-%E3%80%8F%E3%80%80%EF%BC%83ssc",
    note: "FM湘南マジックウェイブ / 湘南シーサイドサークル",
  },
  {
    id: "fm-smw-ssc-instagram",
    label: "湘南シーサイドサークル Instagram",
    url: "https://www.instagram.com/seasidecircle",
    note: "湘南シーサイドサークル @seasidecircle",
  },
];
