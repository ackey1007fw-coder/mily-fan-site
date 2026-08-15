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
];
