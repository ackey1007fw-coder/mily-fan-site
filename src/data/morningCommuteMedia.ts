import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import storyManifest from "./morningCommuteStoryVideo.json" with { type: "json" };
import xManifest from "./morningXVideo.json" with { type: "json" };

/** オーナー提供の短い朝Storyと、本人X投稿に添付された動画。 */
export const morningCommuteStoryVideo = storyManifest as MorningStoryVideo;
export const morningXVideo = xManifest as MorningStoryVideo;
