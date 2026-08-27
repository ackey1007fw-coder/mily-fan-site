/**
 * Gallery の表示用selector。
 *
 * 正本は既存の media / driveGallery / galleryVideos のまま。
 * ここでは並べ方と件数だけを決める。別配列へコピーしない。
 */
import {
  driveGallerySections,
  driveVideoView,
  visibleDriveGallery,
  type DrivePhotoView,
  type DriveVideoView,
} from "../data/driveGallery.ts";
import {
  isSelfHostedGalleryVideo,
  visibleGalleryVideos,
} from "../data/galleryVideos.ts";
import { isMixchMovie, type MixchMovie } from "../data/mixchMovies.ts";
import { media, visibleMedia, type MediaItem } from "../data/media.ts";

export type GalleryEntry =
  | { kind: "media"; key: string; item: MediaItem }
  | { kind: "drive-photo"; key: string; item: DrivePhotoView }
  | { kind: "video"; key: string; item: DriveVideoView }
  | { kind: "mixch"; key: string; item: MixchMovie };

function partition<T>(items: T[], pred: (item: T) => boolean): [T[], T[]] {
  const matched: T[] = [];
  const rest: T[] = [];
  for (const item of items) {
    (pred(item) ? matched : rest).push(item);
  }
  return [matched, rest];
}

function mentionsMily(text: string): boolean {
  return /みりぃ/.test(text);
}

/** SHOWROOM配信画面のスクリーンショット（メイク / ラジオ枠）。 */
export function isShowroomUiScreenshot(item: MediaItem): boolean {
  return /makeup-showroom|evening-radio-showroom/.test(item.basePath);
}

/** ラジオ出演者3人が並ぶスタジオショット。 */
export function isRadioTrioPhoto(item: MediaItem): boolean {
  return /seaside-circle-musical-special/.test(item.basePath);
}

/** 人物が写っていない空・建物の写真。 */
export function isSkyOrLandscapePhoto(item: MediaItem): boolean {
  return /skytree|dragon-cloud/.test(item.basePath);
}

/** みりぃ本人が写っていない物撮り。 */
export function isObjectWithoutPerson(item: MediaItem): boolean {
  if (mentionsMily(item.alt) || mentionsMily(item.caption ?? "")) return false;
  return /necklace|birthday-cake|kakigori-closeup|cinema-poster/.test(item.basePath);
}

/** みりぃの顔・姿が主役の写真。 */
export function isMilyPortraitPhoto(item: MediaItem): boolean {
  if (item.kind !== "photo") return false;
  if (isShowroomUiScreenshot(item)) return false;
  if (isRadioTrioPhoto(item)) return false;
  if (isSkyOrLandscapePhoto(item)) return false;
  if (isObjectWithoutPerson(item)) return false;
  return true;
}

export function isDrivePortraitPhoto(item: DrivePhotoView): boolean {
  return mentionsMily(item.img.alt);
}

export function selectGalleryEntries(): GalleryEntry[] {
  const photos = visibleMedia(media);
  const drive = driveGallerySections(visibleDriveGallery());
  const standalone = visibleGalleryVideos();
  const mixch = standalone.filter(isMixchMovie);
  const selfHosted = standalone.filter(isSelfHostedGalleryVideo);

  const [mediaPortraits, laterMedia] = partition(photos, isMilyPortraitPhoto);
  const [drivePortraits, laterDrive] = partition(
    drive.photos,
    isDrivePortraitPhoto,
  );

  // 本人写真を先頭にし、HOME preview と Gallery 初期窓が Mixch / 画面写真 / 空に
  // ならないようにする。Mixch outbound は残すが、ポートレートの後ろ
  // （動画ブロック側）へ送る。配列のコピーは作らず、既存正本を並べ替えるだけ。
  return [
    ...mediaPortraits.map((item) => ({
      kind: "media" as const,
      key: item.id,
      item,
    })),
    ...drivePortraits.map((item) => ({
      kind: "drive-photo" as const,
      key: item.key,
      item,
    })),
    ...laterMedia.map((item) => ({
      kind: "media" as const,
      key: item.id,
      item,
    })),
    ...laterDrive.map((item) => ({
      kind: "drive-photo" as const,
      key: item.key,
      item,
    })),
    ...mixch.map((item) => ({
      kind: "mixch" as const,
      key: item.id,
      item,
    })),
    ...selfHosted.map(driveVideoView).map((item) => ({
      kind: "video" as const,
      key: item.key,
      item,
    })),
    ...drive.videos.map((item) => ({
      kind: "video" as const,
      key: item.key,
      item,
    })),
  ];
}

export function selectGalleryPreview(limit: number): GalleryEntry[] {
  return selectGalleryEntries().slice(0, limit);
}
