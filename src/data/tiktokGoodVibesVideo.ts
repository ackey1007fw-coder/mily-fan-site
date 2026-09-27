export type TikTokPostVideo = {
  kind: "tiktok";
  id: string;
  postId: string;
  sourceUrl: string;
  sourceDate: string;
  alt: string;
  published: boolean;
};

/** Official player keeps attribution and licensed post audio on TikTok. */
export const tiktokGoodVibesVideo: TikTokPostVideo = {
  kind: "tiktok",
  id: "mily-tiktok-7689042883369880853",
  postId: "7689042883369880853",
  sourceUrl: "https://www.tiktok.com/@seasidecircle/video/7689042883369880853",
  sourceDate: "2026-09-24",
  alt: "青い服のみりぃがカメラに向かって表情や手振りを見せる短い縦型動画",
  published: true,
};
