import type { TikTokPostVideo } from "./tiktokGoodVibesVideo.ts";

/**
 * 2026-10-07の本人TikTok投稿。
 * オーナー指定の短縮URLから@seasidecircleの正式動画URLへリダイレクトを確認。
 * TikTok公開ページのitemStruct.createTimeで投稿日を確認。
 * 原動画・楽曲を再ホストせず、NEWSとGalleryで公式プレーヤーを共有する。
 */
export const tiktokOct07RibbonVideo: TikTokPostVideo & { sourceDate: string } = {
  kind: "tiktok",
  id: "mily-tiktok-7693884484030123284",
  postId: "7693884484030123284",
  sourceUrl: "https://www.tiktok.com/@seasidecircle/video/7693884484030123284",
  sourceDate: "2026-10-07",
  alt: "紺色のカーディガンと青いシュシュ姿のみりぃが、カメラに向かって手のポーズを見せる縦型動画",
  published: true,
};
