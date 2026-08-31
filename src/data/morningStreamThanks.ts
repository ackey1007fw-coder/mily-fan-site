/**
 * 2026-08-31 本人X投稿の朝配信お礼SHOWROOM画面（batch b44-01）。
 * 確認済みの公開X投稿。みりぃが白・黄・青の花束を持ち微笑んでいる。
 * 視聴者名が多数写るSHOWROOM画面のため、Galleryには出さず
 * NEWS `2026-08-31-morning-stream-thanks` の代表画像だけに使う。
 * fallback は `/media/news/`、responsive派生は既存の
 * `/media/gallery/` 480/960/1600を参照する。
 */
export const MORNING_STREAM_THANKS_X_URL =
  "https://x.com/Mily_chan36/status/2094192106105659650";

const RESPONSIVE_BASE_PATH = "/media/gallery/mily-b44-01-morning-stream-thanks";
const RESPONSIVE_WIDTHS = [480, 960, 1600] as const;
const ALT =
  "SHOWROOM配信画面で、白と黄と青の花束を持ち、濃いピンストライプのノースリーブで微笑むみりぃ。背景はベージュの壁。";
const CAPTION = "2026年8月31日の本人X投稿。朝配信へのお礼。";

function responsiveSrcSet(format: "jpg" | "webp"): string {
  return RESPONSIVE_WIDTHS
    .map((width) => `${RESPONSIVE_BASE_PATH}-${width}.${format} ${width}w`)
    .join(", ");
}

/** Latest / NEWS専用。Gallery一覧には登録しない。 */
export const morningStreamThanksImage = {
  id: "mily-b44-01-morning-stream-thanks",
  kind: "image" as const,
  src: "/media/news/mily-b44-01-morning-stream-thanks.jpg",
  srcSet: responsiveSrcSet("jpg"),
  webpSrcSet: responsiveSrcSet("webp"),
  sizes: "(min-width: 640px) 24rem, 100vw",
  width: 1262,
  height: 2048,
  alt: ALT,
  caption: CAPTION,
  provenance: "sns-post" as const,
  sourceUrl: MORNING_STREAM_THANKS_X_URL,
  sourceDate: "2026-08-31",
} as const;
