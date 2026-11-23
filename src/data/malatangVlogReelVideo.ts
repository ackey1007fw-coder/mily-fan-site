import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./malatangVlogReelVideo.json" with { type: "json" };

/** オーナー指定で取得した本人のInstagramリール。音声なしで掲載する。
 * 出典URLはNEWS側の source に記録する。
 */
export const malatangVlogReelVideo = manifest as MorningStoryVideo;
