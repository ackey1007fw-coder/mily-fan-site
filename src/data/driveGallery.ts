/** Owner-provided Google Drive media for Gallery batch b02.
 *
 * Safety rules for this registry:
 * - Individual file ids only. No folder id, no folder URL, no helper that could
 *   build one. The receiving folder is never addressable from this codebase.
 * - No Drive file names. Original names are operations metadata and are kept in
 *   docs/DRIVE-GALLERY.md, never in the client bundle.
 * - Nothing renders until `driveGalleryPublication.state` is flipped to
 *   "published" in its own reviewed commit. `visibleDriveGallery()` returns an
 *   empty list in every other state, so an accidental merge publishes nothing.
 * - `alt` describes what the file actually shows. `contentVerified: false`
 *   marks entries whose content could not be opened yet; they must be described
 *   and flipped to true before the publish commit.
 */
export type DriveGalleryKind = "photo" | "video";

/** "review" keeps the batch out of the site; "published" is the owner's gate. */
export type DriveGalleryPublicationState = "review" | "published";

export type DriveGalleryPublication = {
  state: DriveGalleryPublicationState;
};

/** Publication gate for the whole batch. Flip to "published" only after the
 *  owner confirms Drive sharing is read-only and every alt is verified. */
export const driveGalleryPublication: DriveGalleryPublication = {
  state: "review",
};

export type DriveGalleryItem = {
  /** Stable id, never reused. */
  id: string;
  kind: DriveGalleryKind;
  /** Individual Drive file id. Never a folder id. */
  fileId: string;
  /** Content-based description shown to visitors and screen readers. */
  alt: string;
  /** True when `alt` was written from the file's own content. */
  contentVerified: boolean;
};

const fileIdPattern = /^[A-Za-z0-9_-]{10,}$/;

/** Widths requested from Drive's thumbnail endpoint, ascending. */
export const DRIVE_THUMBNAIL_WIDTHS = [320, 640, 960] as const;

/** Matches the two/three column photo grid in Gallery.tsx. */
export const DRIVE_PHOTO_SIZES =
  "(min-width: 640px) 220px, (min-width: 360px) 45vw, 90vw";

function makeItem(
  id: string,
  kind: DriveGalleryKind,
  fileId: string,
  alt: string,
  contentVerified: boolean,
): DriveGalleryItem {
  if (!fileIdPattern.test(fileId)) {
    throw new Error(`invalid Drive file id for ${id}`);
  }
  if (alt.trim().length === 0) {
    throw new Error(`missing alt text for ${id}`);
  }
  return { id, kind, fileId, alt, contentVerified };
}

/** Placeholder wording for entries whose content is not confirmed yet.
 *  Never ship these: they are blocked by `contentVerified: false`. */
const PENDING_PHOTO = "オーナー提供の写真（内容の説明はオーナー確認待ち）";
const PENDING_VIDEO = "オーナー提供の動画（内容の説明はオーナー確認待ち）";

export const driveGallery: DriveGalleryItem[] = [
  makeItem(
    "mily-drive-b02-p01",
    "photo",
    "15mJln0TawgXBhMdwjvAH9c-JmOOjagen",
    "喫茶店のテーブルでノートパソコンを開き、モーニングの案内を並べた様子",
    true,
  ),
  makeItem("mily-drive-b02-p02", "photo", "1nSY1Ita1Qd8JgEIxTC67WN3kpIn1r1bf", PENDING_PHOTO, false),
  makeItem("mily-drive-b02-p03", "photo", "1GwIaJaaVH4a3p7Sag-QkzV34Yd8II2W6", PENDING_PHOTO, false),
  makeItem("mily-drive-b02-p04", "photo", "1vwsymU09O8b7JmcJQye6AHPNisqw7uDK", PENDING_PHOTO, false),
  makeItem("mily-drive-b02-p05", "photo", "1QomdecFKM-YHvmCmrSeNSkgbDkgQ4ipd", PENDING_PHOTO, false),
  makeItem("mily-drive-b02-p06", "photo", "1XPa8nBM5M0aAIKwvNuPwzg2KZsDd551F", PENDING_PHOTO, false),
  makeItem("mily-drive-b02-p07", "photo", "1CXJ31A14QyIt8sE-8JIb3h0RpGstTZYo", PENDING_PHOTO, false),
  makeItem("mily-drive-b02-p08", "photo", "1i9HzEYc2G1zYzXevhxMGO37r1n3-hRg2", PENDING_PHOTO, false),
  makeItem("mily-drive-b02-p09", "photo", "1gg0BrXS0qi1kU6EENH05dXO4JTPjcG9l", PENDING_PHOTO, false),
  makeItem("mily-drive-b02-p10", "photo", "1BiGT84RirHiqZXECOI0xBEJ24o8ZvdS-", PENDING_PHOTO, false),
  makeItem(
    "mily-drive-b02-p11",
    "photo",
    "1dci-XApsoy9mZCl5EUaRA9QrYCOedPqW",
    "カフェのテーブルに広げた英語のプリントとメニュー",
    true,
  ),
  makeItem(
    "mily-drive-b02-p12",
    "photo",
    "1XR5hF30ST0XslV_Ug-j2Ti7Fak9HWFal",
    "ノートパソコンでニュース記事を開き、水のボトルを置いた机",
    true,
  ),
  makeItem(
    "mily-drive-b02-p13",
    "photo",
    "1TAE5CchA-oZne04Z8Ec0umWA5-GYZPYD",
    "ノートパソコンと書き込んだノートを広げた勉強机（自撮りの小窓つき）",
    true,
  ),
  makeItem(
    "mily-drive-b02-p14",
    "photo",
    "1t9f0SfNlXWAdmo7N42UptwAvADLdIEhP",
    "自習スペースの木の机に並べたノートパソコン・ノート・プリントと飲み物",
    true,
  ),
  makeItem(
    "mily-drive-b02-p15",
    "photo",
    "1xxvHXV8X7Y77Vy5dtNxErw6swFNUiVeO",
    "キャップとパーカー姿で自習スペースに着いたみりぃさん（机にはノートパソコンとプリント）",
    true,
  ),
  makeItem(
    "mily-drive-b02-p16",
    "photo",
    "1kOpnhpq3pXPpySomlsdZ4TVujdVbhalf",
    "机に並んだマスキングテープ・ペン・カフェオーレの紙パックとデジタル時計",
    true,
  ),
  makeItem(
    "mily-drive-b02-p17",
    "photo",
    "1AGvkAGXTDAVCMfJYcHOceAVUhcs3oCrE",
    "ノートパソコンのキーボードの横に開いた英単語帳",
    true,
  ),
  makeItem(
    "mily-drive-b02-p18",
    "photo",
    "1ljwP-du24LjNI_haziuz_mP6WxK2cKue",
    "タブレットにベートーヴェンの資料を表示した勉強机と文具",
    true,
  ),
  makeItem(
    "mily-drive-b02-p19",
    "photo",
    "1lDfynh4Rg0zBzHUyrzx0n085RG7Sp-8S",
    "国際関係の用語を書き込んだルーズリーフとボールペン",
    true,
  ),
  makeItem(
    "mily-drive-b02-p20",
    "photo",
    "1FB9pGilf__JN0q_nvHXSQA_DGzMKIkzD",
    "タブレットにショパンの資料を表示した机とリングノート",
    true,
  ),
  makeItem(
    "mily-drive-b02-p21",
    "photo",
    "1NR_dCXli-RcJhT0zr6dgiapu1LuDjQFx",
    "2次関数の教科書とタブレットの手書きノートを並べた勉強机",
    true,
  ),
  makeItem(
    "mily-drive-b02-p22",
    "photo",
    "1GEgggZ309GX9hR-LzNNCo9CS13LDAdcQ",
    "夕暮れの海の写真を表示したタブレットと2冊のリングノート",
    true,
  ),
  makeItem(
    "mily-drive-b02-p23",
    "photo",
    "1EE-h7ucCWtTX1hl0HcHxZaT8QDoS4fxG",
    "赤ペンで丸つけをした漢字の問題集",
    true,
  ),
  makeItem(
    "mily-drive-b02-p24",
    "photo",
    "1tHqVo-BKzmg35-uWno8nXGpgIyDpsbUF",
    "フットサルのコート図とルールを書き込んだ手書きノート",
    true,
  ),
  makeItem(
    "mily-drive-b02-p25",
    "photo",
    "1dGHTN70k2mzAYp7uXBOGPxIvzYGZcB32",
    "アプリのホーム画面を開いたタブレットと文具を置いた机",
    true,
  ),
  makeItem(
    "mily-drive-b02-p26",
    "photo",
    "1INEtqv1Zo3cqg7SjSkEMO0OhoFyUl9qe",
    "色ペンを並べた国語のプリントとタブレットの本文表示",
    true,
  ),
  makeItem(
    "mily-drive-b02-p27",
    "photo",
    "1NFcrsJE_wNd-ggpyAMYVqwKAFs-6if5i",
    "関数のグラフを書いたノートとタブレット、数学の教科書",
    true,
  ),
  makeItem(
    "mily-drive-b02-p28",
    "photo",
    "1Pd0Vhzd3YwiXWWmz5axLOn4EnVnsWz8C",
    "抹茶ラテのボトルを置いて、マーカーを引いた政治・経済の参考書",
    true,
  ),
  makeItem(
    "mily-drive-b02-p29",
    "photo",
    "13U4ZrSCTvWv_CjSiUhpFoPiknoY70U8X",
    "英単語帳を手に持って開いたところ（自撮りの小窓つき）",
    true,
  ),
  makeItem(
    "mily-drive-b02-p30",
    "photo",
    "1rPncAwzXNXJ3Q3k27mHqabrE048VmT7J",
    "英語の勉強メモを書いたルーズリーフと腕時計・ペン",
    true,
  ),
  makeItem(
    "mily-drive-b02-p31",
    "photo",
    "1mVHBCIS8Zg1gHw-a64hG9dNvX_iaLQnE",
    "薄暗い部屋で開いた英単語帳のページ",
    true,
  ),
  makeItem(
    "mily-drive-b02-p32",
    "photo",
    "1N1OBEatPjJlVG6MJv_gOr-mDjX3U2_Bf",
    "物理基礎の加速度の公式を書いたリングノート",
    true,
  ),
  makeItem(
    "mily-drive-b02-p33",
    "photo",
    "1NxM-Hj1Rvswlac2XoTak0ynrFY3cOMAP",
    "窓辺で英単語帳を手に持って開いたところ",
    true,
  ),
  makeItem(
    "mily-drive-b02-p34",
    "photo",
    "1KlWnOUfrPdV8MHLlj4MbDJQSPdZ2EEDc",
    "照明の下で参考書を見開きにして手に持ったところ",
    true,
  ),
  makeItem(
    "mily-drive-b02-p35",
    "photo",
    "1nn8r92n7pgTXSP1M0CBJduR9hl8KkNvZ",
    "蛍光ペンを並べた国語のプリントとタブレットの文書",
    true,
  ),
  makeItem(
    "mily-drive-b02-p36",
    "photo",
    "1q7Wfu-Ex-X7KKE_hbCDur19fPYv1TQuF",
    "キャップ姿で花束を持ち、ピースサインをするみりぃさんとバースデープレート",
    true,
  ),
  makeItem(
    "mily-drive-b02-p37",
    "photo",
    "18JaQazARzuBAm6pWET0DkLC2p_TE6z9-",
    "腕時計とペンを添えた英語の勉強メモ（別アングル）",
    true,
  ),
  makeItem(
    "mily-drive-b02-p38",
    "photo",
    "1kPTc8AtS_JoYupNZIB9SG8vrQHpD20O6",
    "フットサルの戦術を図解した手書きノート（別アングル）",
    true,
  ),
  makeItem(
    "mily-drive-b02-p39",
    "photo",
    "10DO4MQMvM4ywAR_sgqlRHnIw-uHQsUiJ",
    "夜のイチョウ並木で、イチョウの落ち葉を顔の前にかざすみりぃさん",
    true,
  ),
  makeItem(
    "mily-drive-b02-p40",
    "photo",
    "15UWR9PG6EWNbcjve9kf5kt_80T7lpyyI",
    "2つの花束と「Happy Birthday」と書かれたバースデープレート",
    true,
  ),
  makeItem(
    "mily-drive-b02-p41",
    "photo",
    "1KcQY5IU609PLEgfk2ZnVk4n5PfRD0nsc",
    "水色の包みの花束を抱えて立つみりぃさん",
    true,
  ),
  makeItem(
    "mily-drive-b02-p42",
    "photo",
    "1n2nSU6-g-e6cSZXnzltm09lDaz835Ueu",
    "花束を抱えて笑うみりぃさん",
    true,
  ),
  makeItem(
    "mily-drive-b02-p43",
    "photo",
    "1b_qcLW6WqVzxgiegcN8FHsi5QSVWTqyL",
    "ギフトボックスに入ったネックレスとショップの紙袋",
    true,
  ),
  makeItem(
    "mily-drive-b02-p44",
    "photo",
    "1PnK8PD4Zqz9Zlq1u7hwUBlevUqxMf0cV",
    "花束を持ってカメラに向かって表情をつくるみりぃさん",
    true,
  ),
  makeItem(
    "mily-drive-b02-p45",
    "photo",
    "1qJlOc3rJYHv1--Fxg159l2ZM2-3koIlC",
    "花束を肩に抱えて立つみりぃさんの全身",
    true,
  ),
  makeItem(
    "mily-drive-b02-p46",
    "photo",
    "13IIL8T0w4wbouL6WtNBi2cK8vdJICJ9t",
    "白い背景でファーのベストを着て腕を組むみりぃさん",
    true,
  ),
  makeItem("mily-drive-b02-v01", "video", "1En1SlMRb9sjZHu7CLncIowopiKXbwl8d", PENDING_VIDEO, false),
  makeItem("mily-drive-b02-v02", "video", "16U67BF5lcHH22rwVx6kzXocFRJibIvfc", PENDING_VIDEO, false),
  makeItem("mily-drive-b02-v03", "video", "1OYI5Cv0frvKTPlHm75CpGaFJYMLMJpDp", PENDING_VIDEO, false),
  makeItem("mily-drive-b02-v04", "video", "1SS3vNeUinVFpa4gl9pm8XhWYtHjjwyD0", PENDING_VIDEO, false),
  makeItem("mily-drive-b02-v05", "video", "1unD-yKtP8tXQ2t4DFZofHQtEF62co2RM", PENDING_VIDEO, false),
  makeItem(
    "mily-drive-b02-v06",
    "video",
    "1StqV8JTbJY67PIpPk7aFdCZZYqa7gdHA",
    "ピンクのキャップでマイクの前に座り、テーマ「部活動」を紹介する縦動画",
    true,
  ),
  makeItem(
    "mily-drive-b02-v07",
    "video",
    "1vokzkXO7htHnAypw1QbAxK6R8gZYslmr",
    "「おはよう」の挨拶とラジオ放送の予告を表示した短い自撮り動画",
    true,
  ),
  makeItem("mily-drive-b02-v08", "video", "143Q5mOfSUNz7WOb53aQ-E1K6UJ55TvuL", PENDING_VIDEO, false),
  makeItem(
    "mily-drive-b02-v09",
    "video",
    "1yb-k263WGAog6dRGGvPlZrtLPUqs1tYO",
    "ジャケット姿で「OHAYO!」と表示して呼びかける自撮り動画",
    true,
  ),
  makeItem(
    "mily-drive-b02-v10",
    "video",
    "11cYNJfbBBrNFHxh3m_Ap0ZeUNgtoQvZd",
    "車内でキャップをかぶり「OHAYO!」と表示して挨拶する縦動画",
    true,
  ),
  makeItem(
    "mily-drive-b02-v11",
    "video",
    "1h6d2n47nJX1isjQFyzoFngNk1gzS3kOl",
    "湘南シーサイドサークルの10:00〜13:00放送を、バレーボール風の映像とともに案内する縦動画",
    true,
  ),
];

/** Items rendered on the site. Empty unless the batch is explicitly published,
 *  so an accidental merge cannot surface Drive media. */
export function visibleDriveGallery(
  items: DriveGalleryItem[] = driveGallery,
  publication: DriveGalleryPublication = driveGalleryPublication,
): DriveGalleryItem[] {
  if (publication.state !== "published") {
    return [];
  }
  return items;
}

/** Entries still waiting for an owner-confirmed description. Must be empty
 *  before `driveGalleryPublication.state` is flipped to "published". */
export function unverifiedDriveGallery(
  items: DriveGalleryItem[] = driveGallery,
): DriveGalleryItem[] {
  return items.filter((item) => !item.contentVerified);
}

export function driveThumbnailUrl(fileId: string, width = 640): string {
  const safeWidth = Math.max(160, Math.min(1600, Math.round(width)));
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w${safeWidth}`;
}

export function driveThumbnailSrcSet(
  fileId: string,
  widths: readonly number[] = DRIVE_THUMBNAIL_WIDTHS,
): string {
  return widths
    .map((width) => `${driveThumbnailUrl(fileId, width)} ${width}w`)
    .join(", ");
}

export function drivePreviewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview`;
}

export function driveFileViewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/view`;
}

/* ------------------------------------------------------------------ *
 * Render model
 *
 * Gallery.tsx only spreads these objects onto elements, so the security and
 * performance contract (sandbox, referrer policy, responsive widths, no
 * autoplay, fallback link) is testable without a DOM.
 * ------------------------------------------------------------------ */

/** Minimum permissions the Google Drive preview player needs to run.
 *  No allow-popups, no allow-downloads, and no autoplay permission. */
export const DRIVE_VIDEO_SANDBOX =
  "allow-scripts allow-same-origin allow-presentation";

export type DrivePhotoView = {
  key: string;
  alt: string;
  linkHref: string;
  linkLabel: string;
  img: {
    src: string;
    srcSet: string;
    sizes: string;
    alt: string;
    loading: "lazy";
    decoding: "async";
    referrerPolicy: "no-referrer";
  };
};

export type DriveVideoView = {
  key: string;
  frame: {
    src: string;
    title: string;
    sandbox: string;
    loading: "lazy";
    referrerPolicy: "no-referrer";
  };
  fallback: {
    href: string;
    label: string;
  };
};

export function drivePhotoView(item: DriveGalleryItem): DrivePhotoView {
  return {
    key: item.id,
    alt: item.alt,
    linkHref: driveFileViewUrl(item.fileId),
    linkLabel: `${item.alt}（Google Driveで拡大表示）`,
    img: {
      src: driveThumbnailUrl(item.fileId, DRIVE_THUMBNAIL_WIDTHS[1]),
      srcSet: driveThumbnailSrcSet(item.fileId),
      sizes: DRIVE_PHOTO_SIZES,
      alt: item.alt,
      loading: "lazy",
      decoding: "async",
      referrerPolicy: "no-referrer",
    },
  };
}

export function driveVideoView(item: DriveGalleryItem): DriveVideoView {
  return {
    key: item.id,
    frame: {
      src: drivePreviewUrl(item.fileId),
      title: item.alt,
      sandbox: DRIVE_VIDEO_SANDBOX,
      loading: "lazy",
      referrerPolicy: "no-referrer",
    },
    fallback: {
      href: driveFileViewUrl(item.fileId),
      label: "Google Driveで動画を開く",
    },
  };
}

export type DriveGallerySections = {
  photos: DrivePhotoView[];
  videos: DriveVideoView[];
  hasAny: boolean;
};

/** Split the already-gated item list into the two rendered sections. */
export function driveGallerySections(
  items: DriveGalleryItem[],
): DriveGallerySections {
  const photos = items
    .filter((item) => item.kind === "photo")
    .map(drivePhotoView);
  const videos = items
    .filter((item) => item.kind === "video")
    .map(driveVideoView);
  return { photos, videos, hasAny: photos.length > 0 || videos.length > 0 };
}

/** True only when the owner has flipped the batch gate. */
export function isDriveGalleryPublished(
  publication: DriveGalleryPublication,
): boolean {
  return publication.state === "published";
}
