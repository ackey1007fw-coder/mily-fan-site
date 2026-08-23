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
import { visibleGalleryVideos } from "../data/galleryVideos.ts";
import { media, visibleMedia, type MediaItem } from "../data/media.ts";

export type GalleryEntry =
  | { kind: "media"; key: string; item: MediaItem }
  | { kind: "drive-photo"; key: string; item: DrivePhotoView }
  | { kind: "video"; key: string; item: DriveVideoView };

export function selectGalleryEntries(): GalleryEntry[] {
  const photos = visibleMedia(media);
  const drive = driveGallerySections(visibleDriveGallery());
  const videos = [
    ...visibleGalleryVideos().map(driveVideoView),
    ...drive.videos,
  ];

  return [
    ...photos.map((item) => ({
      kind: "media" as const,
      key: item.id,
      item,
    })),
    ...drive.photos.map((item) => ({
      kind: "drive-photo" as const,
      key: item.key,
      item,
    })),
    ...videos.map((item) => ({
      kind: "video" as const,
      key: item.key,
      item,
    })),
  ];
}

export function selectGalleryPreview(limit: number): GalleryEntry[] {
  return selectGalleryEntries().slice(0, limit);
}
