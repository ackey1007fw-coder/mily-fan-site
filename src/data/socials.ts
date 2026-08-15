/**
 * Official-looking personal accounts only, after the site owner confirms them.
 * Unconfirmed URLs must not be added.
 */
export type SocialPlatform =
  | "x"
  | "instagram"
  | "youtube"
  | "tiktok"
  | "showroom"
  | "other";

export type SocialLink = {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  confirmed: true;
};

export const socials: SocialLink[] = [
  {
    id: "x-mily-chan36",
    platform: "x",
    label: "@Mily_chan36",
    url: "https://x.com/Mily_chan36",
    confirmed: true,
  },
  {
    id: "instagram-mily-chan36",
    platform: "instagram",
    label: "@mily_chan36",
    url: "https://www.instagram.com/mily_chan36",
    confirmed: true,
  },
  {
    id: "tiktok-mily-chan36",
    platform: "tiktok",
    label: "@mily_chan36",
    url: "https://www.tiktok.com/@mily_chan36",
    confirmed: true,
  },
  {
    // ENTRY 734 ページのリンクから解決し、ルーム名「三橋莉子」で本人確認済み
    // （2026-08-15、コンテスト用ルームのため終了後に変わる可能性あり）
    id: "showroom-circle2026-0734",
    platform: "showroom",
    label: "SHOWROOM #ミスサークル2026",
    url: "https://www.showroom-live.com/r/circle2026_0734",
    confirmed: true,
  },
];
