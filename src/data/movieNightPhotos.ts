/**
 * 2026-08-27 の本人Instagram通常投稿に添えられた写真5枚（batch b38）。
 * オーナーから掲載用ファイルとして直接受領し、Gallery と同じ公開派生を
 * Latest / NEWS でも共有する。SNS CDNは参照しない。
 */
export const MOVIE_NIGHT_INSTAGRAM_URL =
  "https://www.instagram.com/p/Dci0CvNE29X/";

export const MOVIE_NIGHT_INSTAGRAM_PROFILE_URL =
  "https://www.instagram.com/mily_chan36";

export const movieNightPhotos = [
  {
    id: "mily-b38-01",
    kind: "photo" as const,
    basePath: "/media/gallery/mily-b38-01-cinema-churro-selfie",
    widths: [480, 960, 1600] as const,
    width: 960,
    height: 1280,
    alt: "映画館でチュロスを手にカメラを見つめるみりぃの自撮り",
    caption: "2026年8月27日の本人Instagram投稿。映画館での一枚。",
    provenance: "owner-provided" as const,
    sourceUrl: MOVIE_NIGHT_INSTAGRAM_URL,
    sourceDate: "2026-08-27",
    credit: null,
    aspect: "960 / 1280",
    published: true,
  },
  {
    id: "mily-b38-02",
    kind: "photo" as const,
    basePath: "/media/gallery/mily-b38-02-cinema-poster",
    widths: [480, 960, 1600] as const,
    width: 959,
    height: 1280,
    alt: "映画館の上映案内に表示された『あの星が降る丘で、君とまた出会いたい。』のポスター",
    caption: "2026年8月27日の本人Instagram投稿。鑑賞した作品の上映案内。",
    provenance: "owner-provided" as const,
    sourceUrl: MOVIE_NIGHT_INSTAGRAM_URL,
    sourceDate: "2026-08-27",
    credit: null,
    aspect: "959 / 1280",
    published: true,
  },
  {
    id: "mily-b38-03",
    kind: "photo" as const,
    basePath: "/media/gallery/mily-b38-03-cinema-snacks-churro-raised",
    widths: [480, 960, 1600] as const,
    width: 960,
    height: 1280,
    alt: "映画館でドリンクとポップコーンを持ち、チュロスを掲げるみりぃ",
    caption: "2026年8月27日の本人Instagram投稿。映画館での一枚。",
    provenance: "owner-provided" as const,
    sourceUrl: MOVIE_NIGHT_INSTAGRAM_URL,
    sourceDate: "2026-08-27",
    credit: null,
    aspect: "960 / 1280",
    published: true,
  },
  {
    id: "mily-b38-04",
    kind: "photo" as const,
    basePath: "/media/gallery/mily-b38-04-cinema-snacks-side-glance",
    widths: [480, 960, 1600] as const,
    width: 960,
    height: 1280,
    alt: "映画館でドリンクとポップコーンを持ち、チュロスを肩に添えるみりぃ",
    caption: "2026年8月27日の本人Instagram投稿。映画館での一枚。",
    provenance: "owner-provided" as const,
    sourceUrl: MOVIE_NIGHT_INSTAGRAM_URL,
    sourceDate: "2026-08-27",
    credit: null,
    aspect: "960 / 1280",
    published: true,
  },
  {
    id: "mily-b38-05",
    kind: "photo" as const,
    basePath: "/media/gallery/mily-b38-05-cinema-snacks-front",
    widths: [480, 960, 1600] as const,
    width: 960,
    height: 1280,
    alt: "映画館でドリンクとポップコーンを持ち、チュロスを肩に添えてカメラを見るみりぃ",
    caption: "2026年8月27日の本人Instagram投稿。映画館での一枚。",
    provenance: "owner-provided" as const,
    sourceUrl: MOVIE_NIGHT_INSTAGRAM_URL,
    sourceDate: "2026-08-27",
    credit: null,
    aspect: "960 / 1280",
    published: true,
  },
] as const;

function newsImageFromGalleryPhoto(item: (typeof movieNightPhotos)[number]) {
  const largest = item.widths[item.widths.length - 1];
  const srcSet = (format: "jpg" | "webp") =>
    item.widths.map((width) => `${item.basePath}-${width}.${format} ${width}w`).join(", ");

  return {
    kind: "image" as const,
    src: `${item.basePath}-${largest}.jpg`,
    srcSet: srcSet("jpg"),
    webpSrcSet: srcSet("webp"),
    sizes: "(min-width: 640px) 24rem, 100vw",
    width: item.width,
    height: item.height,
    alt: item.alt,
  };
}

/** 投稿順のまま、同じNEWSカードで5枚を表示する。 */
export const movieNightNewsImages = movieNightPhotos.map(newsImageFromGalleryPhoto);
