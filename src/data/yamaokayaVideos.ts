import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import dashManifest from "./yamaokayaUmihotaruDashVideo.json" with { type: "json" };
import walkManifest from "./yamaokayaNightWalkVideo.json" with { type: "json" };
import driveManifest from "./yamaokayaNightDriveVideo.json" with { type: "json" };

/** オーナー指定で取得した本人のInstagram投稿（2026-11-26、山岡家と海ほたる）
 * カルーセル内の動画3点。いずれも音声なしで掲載する。
 * 出典URLはNEWS側の source に記録する。
 */
export const yamaokayaUmihotaruDashVideo = dashManifest as MorningStoryVideo;
export const yamaokayaNightWalkVideo = walkManifest as MorningStoryVideo;
export const yamaokayaNightDriveVideo = driveManifest as MorningStoryVideo;
