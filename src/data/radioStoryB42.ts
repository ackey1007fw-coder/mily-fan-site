import type { ActivityId } from "./activities.ts";
import type { DriveGalleryVideo } from "./driveGallery.ts";
import liveBroadcastManifest from "./seasideCircleLiveBroadcastStoryVideo.json" with { type: "json" };
import messageFormManifest from "./seasideCircleMessageFormStoryVideo.json" with { type: "json" };

export type RadioStoryVideo = DriveGalleryVideo & {
  provenance: "owner-provided";
  sourceLabel: string;
  sourceDate: string;
  activityIds: ActivityId[];
  caption: string;
  published: boolean;
};

/**
 * 2026-08-30 の湘南シーサイドサークル Instagram Story動画（batch b42）。
 * Radio Activity専用。恒久的なStory permalinkはないため、出典は
 * 非リンクlabelだけを持つ。
 */
export const seasideCircleMessageFormStoryVideo =
  messageFormManifest as RadioStoryVideo;

export const seasideCircleLiveBroadcastStoryVideo =
  liveBroadcastManifest as RadioStoryVideo;

export const radioStoryVideos: RadioStoryVideo[] = [
  seasideCircleMessageFormStoryVideo,
  seasideCircleLiveBroadcastStoryVideo,
];

export function visibleRadioStoryVideos(
  items: RadioStoryVideo[] = radioStoryVideos,
): RadioStoryVideo[] {
  return items.filter((item) => item.published);
}
