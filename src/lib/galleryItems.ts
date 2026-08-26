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

export function selectGalleryEntries(): GalleryEntry[] {
  const photos = visibleMedia(media);
  const drive = driveGallerySections(visibleDriveGallery());
  const standalone = visibleGalleryVideos();
  const mixch = standalone.filter(isMixchMovie);
  const selfHosted = standalone.filter(isSelfHostedGalleryVideo);

  // Mixch outbound cards are newest owner-named visuals. Keep them at the
  // front so Home preview and Gallery's initial window show them instead of
  // burying them behind 60+ photos.
  return [
    ...mixch.map((item) => ({
      kind: "mixch" as const,
      key: item.id,
      item,
    })),
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
