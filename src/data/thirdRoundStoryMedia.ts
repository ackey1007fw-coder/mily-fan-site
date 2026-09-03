/**
 * 2026-09-03 の本人 Instagram Story で共有された三次審査案内（batch b50）。
 * オーナー提供素材から metadata を除去した公開派生。
 * 既存の三次審査 NEWS の additionalMedia 専用で、Gallery・media.ts・
 * galleryVideos・/stories/ には出さない。
 */
function storyImage(id: string, alt: string) {
  return {
    id,
    kind: "image" as const,
    src: `/media/news/${id}.jpg`,
    width: 864,
    height: 1536,
    alt,
    published: true,
    provenance: "owner-provided" as const,
    sourceDate: "2026-09-03",
    sourceUrl: null,
  } as const;
}

export const thirdRoundGoalsStoryImage = storyImage(
  "mily-b50-01-third-round-goals",
  "みりぃが三次審査の目標として、アバター権獲得、投票と100キラでの応援、ファイナルまで応援したい仲間との出会いを掲げた案内画像",
);

export const thirdRoundReviewScheduleStoryImage = storyImage(
  "mily-b50-02-third-round-review-schedule",
  "三次審査の各審査日程。WEB投票は9月3日12時から9月13日23時59分、SHOWROOM無料ギフト審査とイベント審査は9月3日5時から9月12日21時59分",
);

export const thirdRoundSupportMethodStoryVideo = {
  id: "mily-b50-03-third-round-support-method",
  kind: "video" as const,
  src: "/media/news/mily-b50-03-third-round-support-method.mp4",
  poster: "/media/news/mily-b50-03-third-round-support-method-poster.jpg",
  width: 512,
  height: 910,
  alt: "三次審査の応援方法として、1日1回のWEB投票、1日100個までの無料キラキラ星、指定ギフトを案内する縦型動画",
  published: true,
  provenance: "owner-provided" as const,
  sourceDate: "2026-09-03",
  sourceUrl: null,
} as const;

export const thirdRoundStoryAdditionalMedia = [
  thirdRoundGoalsStoryImage,
  thirdRoundReviewScheduleStoryImage,
  thirdRoundSupportMethodStoryVideo,
] as const;
