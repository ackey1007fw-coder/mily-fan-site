import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./followers400StoryVideo.json" with { type: "json" };

/**
 * 2026-08-26 の Instagram Story（フォロワー400人への感謝 / batch b27-04）。
 *
 * HOME Latest / /news/ 専用。Gallery・galleryVideos・media.ts・/stories/・highlights
 * には追加しない。恒久permalinkがないため `sourceUrl` は持たない。
 */
export const followers400StoryVideo = manifest as MorningStoryVideo;
