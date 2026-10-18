import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./faceToFaceClassStoryVideo.json" with { type: "json" };

/**
 * 2026-09-24 の Instagram Story（対面授業へ向かう朝 / batch b146-01）。
 * Latest / NEWS と Gallery が同じ公開MP4とposterを共有する。
 * 恒久的なStory permalinkはないため sourceLabel のみを持つ。
 */
export const faceToFaceClassStoryVideo = manifest as MorningStoryVideo;
