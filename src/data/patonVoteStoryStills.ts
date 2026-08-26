/**
 * 2026-08-26 の本人Instagram Storyから取り出した静止画（batch b27-06 / b27-07）。
 * Gallery の photo set（media.ts）と Latest / NEWS が同じ公開派生を共有する。
 * 恒久permalinkがないため sourceUrl は null。
 */
export const patonVoteCollageStillPhoto = {
  id: "mily-b27-06",
  kind: "photo" as const,
  basePath: "/media/gallery/mily-b27-06-paton-vote-collage-still",
  widths: [480, 960, 1600] as const,
  width: 720,
  height: 1280,
  alt: "クマ耳フィルターの4枚コラージュ自撮り。予選ファイナルの毎日投票案内が重ねられている",
  caption:
    "2026年8月26日の本人Instagram Storyから取り出した、4枚コラージュの静止画。",
  provenance: "owner-provided" as const,
  sourceUrl: null,
  sourceDate: "2026-08-26",
  credit: null,
  aspect: "720 / 1280",
  published: true,
};

export const patonVoteMirrorStillPhoto = {
  id: "mily-b27-07",
  kind: "photo" as const,
  basePath: "/media/gallery/mily-b27-07-paton-vote-mirror-still",
  widths: [480, 960, 1600] as const,
  width: 720,
  height: 1280,
  alt: "紺のニットとベージュのスカートで鏡に映ったみりぃ。18:00からの投票開始案内が重ねられている",
  caption:
    "2026年8月26日の本人Instagram Storyから取り出した、鏡自撮りの静止画。",
  provenance: "owner-provided" as const,
  sourceUrl: null,
  sourceDate: "2026-08-26",
  credit: null,
  aspect: "720 / 1280",
  published: true,
};

function newsImageFromGalleryPhoto(item: {
  basePath: string;
  widths: readonly number[];
  width: number;
  height: number;
  alt: string;
}) {
  const largest = item.widths[item.widths.length - 1];
  return {
    kind: "image" as const,
    src: `${item.basePath}-${largest}.jpg`,
    width: item.width,
    height: item.height,
    alt: item.alt,
  };
}

/** Latest / NEWS 代表。Gallery の `-1600.jpg` と同じ公開ファイル。 */
export const patonVoteMirrorStillImage = newsImageFromGalleryPhoto(
  patonVoteMirrorStillPhoto,
);

/** 同じNEWSカードの2枚目。Gallery の `-1600.jpg` と同じ公開ファイル。 */
export const patonVoteCollageStillImage = newsImageFromGalleryPhoto(
  patonVoteCollageStillPhoto,
);
