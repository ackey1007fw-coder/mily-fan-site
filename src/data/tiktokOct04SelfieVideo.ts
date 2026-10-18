import type { TikTokPostVideo } from "./tiktokGoodVibesVideo.ts";

/**
 * 2026-10-04の本人TikTok投稿。
 * オーナー指定の短縮URLから@seasidecircleの正式動画URLへリダイレクトを確認。
 * TikTok公開ページのitemStruct.createTimeで投稿日を確認。
 * 原動画・楽曲を再ホストせず、NEWSとGalleryで公式プレーヤーを共有する。
 */
export const tiktokOct04SelfieVideo: TikTokPostVideo & { sourceDate: string } = {
  kind: "tiktok",
  id: "mily-tiktok-7692539548055751957",
  postId: "7692539548055751957",
  sourceUrl: "https://www.tiktok.com/@seasidecircle/video/7692539548055751957",
  sourceDate: "2026-10-04",
  alt: "室内でブルーグレーのトップス姿のみりぃがカメラに向かって表情を見せる短い縦型動画",
  published: true,
};
