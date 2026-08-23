import { ACTIVITIES_HUB_ROUTE } from "./activityRoute.ts";
import { SUPPORT_HUB_ROUTE } from "./supportHub.ts";

export const HOME_ROUTE = "/" as const;
export const NEWS_ARCHIVE_ROUTE = "/news/" as const;
export const STORIES_ARCHIVE_ROUTE = "/stories/" as const;
export const GALLERY_ARCHIVE_ROUTE = "/gallery/" as const;
export const PROFILE_ROUTE = "/profile/" as const;

export const HOME_NEWS_LIMIT = 3;
export const HOME_STORY_LIMIT = 3;
export const HOME_GALLERY_LIMIT = 6;

export const NEWS_ARCHIVE_INITIAL = 10;
export const GALLERY_ARCHIVE_INITIAL = 12;
export const ARCHIVE_PAGE_SIZE = 10;

export const HOME_NEWS_ARCHIVE_CTA = "最新情報をすべて見る";
export const HOME_STORY_ARCHIVE_CTA = "STORYをもっと見る";
export const HOME_GALLERY_ARCHIVE_CTA = "ギャラリーをすべて見る";
export const ARCHIVE_LOAD_MORE_LABEL = "もっと見る";

export const SUPPORT_GATEWAY_CTA = "応援・予定を見る";
export const ACTIVITIES_GATEWAY_CTA = "Activities Hubを見る";

export {
  ACTIVITIES_HUB_ROUTE,
  SUPPORT_HUB_ROUTE,
};
