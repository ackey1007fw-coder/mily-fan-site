import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./movieStoryVideo20261119.json" with { type: "json" };

/**
 * 2026-11-19 の Instagram Story（映画館での自撮り / batch b273-01）。
 *
 * HOME Latest / /news/ 専用。Gallery・galleryVideos・media.ts・/stories/・highlights
 * には追加しない。恒久permalinkがないため `sourceUrl` は持たない。
 */
export const movieStoryVideo20261119 = manifest as MorningStoryVideo;
