export const CAMPUS_GIRLS_FINAL_STAGE_STORY_SOURCE_LABEL =
  "Instagram Story";
export const CAMPUS_GIRLS_FINAL_STAGE_STORY_SOURCE_DATE = "2026-08-28";
export const CAMPUS_GIRLS_FINAL_STAGE_INSTAGRAM_PROFILE_URL =
  "https://www.instagram.com/mily_chan36";
export const CAMPUS_GIRLS_FINAL_STAGE_INSTAGRAM_CTA_LABEL =
  "Instagramプロフィールを見る";

type CampusGirlsFinalStageStoryBase = {
  id: string;
  alt: string;
  src: string;
  width: number;
  height: number;
  title: string;
  provenance: "owner-provided";
  sourceLabel: typeof CAMPUS_GIRLS_FINAL_STAGE_STORY_SOURCE_LABEL;
  sourceDate: typeof CAMPUS_GIRLS_FINAL_STAGE_STORY_SOURCE_DATE;
  published: true;
  recordLabel?: "投稿時点の記録";
};

export type CampusGirlsFinalStageStoryImage =
  CampusGirlsFinalStageStoryBase & {
    kind: "image";
  };

export type CampusGirlsFinalStageStoryVideo =
  CampusGirlsFinalStageStoryBase & {
    kind: "video";
    poster: string;
  };

/**
 * 2026-08-28 の本人Instagram Story 3点（batch b40）。
 * HOME / Support が共有する既存PatonVoteGuideだけで表示し、
 * NEWS・Gallery・/stories/・Highlightsには重複掲載しない。
 */
export const campusGirlsFinalStageDetailsStoryImage = {
  id: "mily-b40-01-campus-girls-final-stage-details",
  kind: "image",
  alt: "CAMPUS GIRLS 2027 予選A Final STAGEの配信審査、SNS審査、Paton投票審査、面接審査と特典をまとめたInstagram Story画像",
  src: "/media/news/mily-b40-01-campus-girls-final-stage-details.jpg",
  width: 1080,
  height: 1919,
  title: "予選A Final STAGE 審査の詳細",
  provenance: "owner-provided",
  sourceLabel: CAMPUS_GIRLS_FINAL_STAGE_STORY_SOURCE_LABEL,
  sourceDate: CAMPUS_GIRLS_FINAL_STAGE_STORY_SOURCE_DATE,
  published: true,
} as const satisfies CampusGirlsFinalStageStoryImage;

export const campusGirlsFinalStagePatonRecordStoryVideo = {
  id: "mily-b40-02-paton-vote-day3-second-record",
  kind: "video",
  alt: "Paton投票3日目にみりぃが2位と表示されたランキング画面。他出場者の顔と名前はモザイク処理済み",
  src: "/media/news/mily-b40-02-paton-vote-day3-second-record.mp4",
  poster:
    "/media/news/mily-b40-02-paton-vote-day3-second-record-poster.jpg",
  width: 720,
  height: 1280,
  title: "Paton投票3日目・2位",
  provenance: "owner-provided",
  sourceLabel: CAMPUS_GIRLS_FINAL_STAGE_STORY_SOURCE_LABEL,
  sourceDate: CAMPUS_GIRLS_FINAL_STAGE_STORY_SOURCE_DATE,
  published: true,
  recordLabel: "投稿時点の記録",
} as const satisfies CampusGirlsFinalStageStoryVideo;

export const campusGirlsFinalStageMovieRecordStoryVideo = {
  id: "mily-b40-03-movie-exam-first-overall-seventh-record",
  kind: "video",
  alt: "ムービー審査でみりぃが1位、総合7位と表示されたランキング画面。他出場者の顔と名前はモザイク処理済み",
  src: "/media/news/mily-b40-03-movie-exam-first-overall-seventh-record.mp4",
  poster:
    "/media/news/mily-b40-03-movie-exam-first-overall-seventh-record-poster.jpg",
  width: 720,
  height: 1280,
  title: "ムービー審査1位・総合7位",
  provenance: "owner-provided",
  sourceLabel: CAMPUS_GIRLS_FINAL_STAGE_STORY_SOURCE_LABEL,
  sourceDate: CAMPUS_GIRLS_FINAL_STAGE_STORY_SOURCE_DATE,
  published: true,
  recordLabel: "投稿時点の記録",
} as const satisfies CampusGirlsFinalStageStoryVideo;

export const campusGirlsFinalStageRankingStoryVideos = [
  campusGirlsFinalStagePatonRecordStoryVideo,
  campusGirlsFinalStageMovieRecordStoryVideo,
] as const;

export const campusGirlsFinalStageStorySeries = [
  campusGirlsFinalStageDetailsStoryImage,
  ...campusGirlsFinalStageRankingStoryVideos,
] as const;
