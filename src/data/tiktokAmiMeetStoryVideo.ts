import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./tiktokAmiMeetStoryVideo.json" with { type: "json" };

/**
 * 2026-09-22 のラジオDJネキみりぃTikTok（batch b141-02）。
 * 元素材はTikTok由来の短尺で、恒久的な投稿permalinkは確認できていない。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。
 * `sourceLabel`だけを持ち、`sourceUrl`は持たない。
 * 関連リンクは NEWS 側のラジオDJネキみりぃTikTokプロフィールであり、この動画の出典URLではない。
 */
export const tiktokAmiMeetStoryVideo = manifest as MorningStoryVideo;
