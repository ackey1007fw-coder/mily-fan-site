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

export const socials: SocialLink[] = [];
