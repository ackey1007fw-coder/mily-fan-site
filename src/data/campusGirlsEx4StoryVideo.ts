import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./campusGirlsEx4StoryVideo.json" with { type: "json" };

/** 恒久的な公開permalinkがないため sourceUrl は持たない。
 * BGMが第三者楽曲のため音声なしで掲載する。
 */
export const campusGirlsEx4StoryVideo = manifest as MorningStoryVideo;
