/**
 * Mixch outbound player cards.
 *
 * Mixch has no official oEmbed / iframe embed. Playing Mixch `_movie_mps` files
 * on this site would hotlink Mixch CDN and take CAMPUS GIRLS contest views off
 * Mixch. These objects are the NEWS + Gallery shared source for Mixch movies:
 * poster + play overlay, click opens the Mixch page. Files stay on Mixch.
 *
 * Allowed only for owner-named public movies on the confirmed person account.
 */
export const CONFIRMED_MIXCH_ACCOUNT_URL = "https://mixch.tv/u/10114673";

export type MixchMovie = {
  id: string;
  kind: "mixch";
  mixchUrl: string;
  /** Official Mixch thumbnail (thumbnailUrl / og:image). The only SNS-thumbnail exception. */
  poster: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  published: boolean;
  sourceDate: string;
  accountUrl: typeof CONFIRMED_MIXCH_ACCOUNT_URL;
};

export function isMixchMovie(item: { kind: string }): item is MixchMovie {
  return item.kind === "mixch";
}

/** 2026-08-26 Mixch「今日は1.5倍デーだってよ？！」 https://mixch.tv/m/nxqYblH8 */
export const mixch15xDayMovie: MixchMovie = {
  id: "mixch-m-nxqYblH8",
  kind: "mixch",
  mixchUrl: "https://mixch.tv/m/nxqYblH8",
  poster:
    "https://d2jtsb989t238a.cloudfront.net/m/kin373og30ocd8fg4r0d8dyje9odes85znm6qypd8x1q37chbuob27vp5jopaixjf7t1p60xnf5u4wiartxfocwe32x74j9ud2jo65m9hadotecymvax5gehlal1osab/thumb_normal",
  width: 480,
  height: 853,
  alt: "Mixch動画「今日は1.5倍デーだってよ？！」のサムネイル。再生するとMixchで開きます",
  title: "今日は1.5倍デーだってよ？！",
  published: true,
  sourceDate: "2026-08-26",
  accountUrl: CONFIRMED_MIXCH_ACCOUNT_URL,
};

/** 2026-08-25 Mixch「自信のないあなたへ」 https://mixch.tv/m/ZY4hSt3K */
export const mixchConfidenceMessageMovie: MixchMovie = {
  id: "mixch-m-ZY4hSt3K",
  kind: "mixch",
  mixchUrl: "https://mixch.tv/m/ZY4hSt3K",
  poster:
    "https://d2jtsb989t238a.cloudfront.net/m/zccboujbxfe3nq1gzwmfil2cb3p4ur8ogue3fky0r9toxgs1i9pj5u02r3ci35rpaw19ris2nrrdig2aefv629baj4tuhh7utpz70vvaqixh4sworf4ufu08bvdd2h8f/thumb_normal",
  width: 480,
  height: 853,
  alt: "Mixch動画「自信のないあなたへ」のサムネイル。再生するとMixchで開きます",
  title: "自信のないあなたへ",
  published: true,
  sourceDate: "2026-08-25",
  accountUrl: CONFIRMED_MIXCH_ACCOUNT_URL,
};

/** Newest first. NEWS and Gallery import these objects; do not copy Mixch files. */
export const mixchMovies: MixchMovie[] = [
  mixch15xDayMovie,
  mixchConfidenceMessageMovie,
];
