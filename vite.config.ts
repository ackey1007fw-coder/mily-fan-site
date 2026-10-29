import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { injectVercelWebAnalytics } from "./src/lib/vercelWebAnalytics.ts";
import { createPortalFeed } from "./src/data/portalFeed.ts";
import { canonicalUrl, dataLabUrl, dataLabFinalNightUrl, dataLabOgImageUrl, ogImageUrl, profileUrl, storyUrl } from "./src/data/site";
import { radioMusicPageMetadata, radioMusicPageStructuredData } from "./src/lib/radioMusicMetadata.ts";
import { songClipsPageMetadata, songClipsPageStructuredData } from "./src/lib/songClipsMetadata.ts";
import {
  activityPageMetadata,
  activityPageStructuredData,
} from "./src/lib/activityMetadata.ts";
import {
  archivePageMetadata,
  archivePageStructuredData,
} from "./src/lib/archiveMetadata.ts";
import {
  GALLERY_ARCHIVE_ROUTE,
  NEWS_ARCHIVE_ROUTE,
  STORIES_ARCHIVE_ROUTE,
} from "./src/lib/homePortal.ts";
import {
  supportPageMetadata,
  supportPageStructuredData,
} from "./src/lib/supportMetadata.ts";

function siteMetadataPlugin(): Plugin {
  return {
    name: "site-metadata",
    transformIndexHtml(html, context) {
      const activityMetadata = html.includes("__ACTIVITY_CANONICAL__")
        ? activityPageMetadata(context.path)
        : null;
      const newsMetadata = archivePageMetadata(NEWS_ARCHIVE_ROUTE);
      const storiesMetadata = archivePageMetadata(STORIES_ARCHIVE_ROUTE);
      const galleryMetadata = archivePageMetadata(GALLERY_ARCHIVE_ROUTE);

      return html
        .replaceAll("__SITE_CANONICAL__", canonicalUrl())
        .replaceAll("__DATA_LAB_CANONICAL__", dataLabUrl())
        .replaceAll("__DATA_LAB_PROGRESS_CANONICAL__", `${dataLabUrl()}progress/`)
        .replaceAll("__DATA_LAB_GLITTER_CANONICAL__", `${dataLabUrl()}glitter/`)
        .replaceAll("__DATA_LAB_TIMING_CANONICAL__", `${dataLabUrl()}stream-timing/`)
        .replaceAll("__DATA_LAB_FINAL_NIGHT_CANONICAL__", dataLabFinalNightUrl())
        .replaceAll("__DATA_LAB_20261025_NIGHT_CANONICAL__", `${dataLabUrl()}reports/20261025-night/`)
        .replaceAll("__DATA_LAB_20261029_NOON_CANONICAL__", `${dataLabUrl()}reports/20261029-noon/`)
        .replaceAll("__DATA_LAB_20261028_MORNING_CANONICAL__", `${dataLabUrl()}reports/20261028-morning/`)
        .replaceAll("__DATA_LAB_20261027_NIGHT_CANONICAL__", `${dataLabUrl()}reports/20261027-night/`)
        .replaceAll("__DATA_LAB_20261027_MORNING_CANONICAL__", `${dataLabUrl()}reports/20261027-morning/`)
        .replaceAll("__DATA_LAB_20261026_NIGHT_CANONICAL__", `${dataLabUrl()}reports/20261026-night/`)
        .replaceAll("__DATA_LAB_20261025_MORNING_CANONICAL__", `${dataLabUrl()}reports/20261025-morning/`)
        .replaceAll("__DATA_LAB_20261024_NOON_CANONICAL__", `${dataLabUrl()}reports/20261024-noon/`)
        .replaceAll("__DATA_LAB_20261024_MORNING_CANONICAL__", `${dataLabUrl()}reports/20261024-morning/`)
        .replaceAll("__DATA_LAB_20261023_MORNING_CANONICAL__", `${dataLabUrl()}reports/20261023-morning/`)
        .replaceAll("__DATA_LAB_20261022_NIGHT_CANONICAL__", `${dataLabUrl()}reports/20261022-night/`)
        .replaceAll("__DATA_LAB_20261022_MORNING_CANONICAL__", `${dataLabUrl()}reports/20261022-morning/`)
        .replaceAll("__DATA_LAB_20261021_MORNING_CANONICAL__", `${dataLabUrl()}reports/20261021-morning/`)
        .replaceAll("__DATA_LAB_20261020_NIGHT_CANONICAL__", `${dataLabUrl()}reports/20261020-night/`)
        .replaceAll("__DATA_LAB_20261020_MORNING_CANONICAL__", `${dataLabUrl()}reports/20261020-morning/`)
        .replaceAll("__DATA_LAB_20261019_MORNING_CANONICAL__", `${dataLabUrl()}reports/20261019-morning/`)
        .replaceAll("__DATA_LAB_20261018_NIGHT_CANONICAL__", `${dataLabUrl()}reports/20261018-night/`)
        .replaceAll("__DATA_LAB_20261017_NIGHT_CANONICAL__", `${dataLabUrl()}reports/20261017-night/`)
        .replaceAll("__DATA_LAB_20261018_MORNING_CANONICAL__", `${dataLabUrl()}reports/20261018-morning/`)
        .replaceAll("__DATA_LAB_OG_IMAGE__", dataLabOgImageUrl())
        .replaceAll("__PROFILE_CANONICAL__", profileUrl())
        .replaceAll(
          "__STORY_SECOND_ROUND_CANONICAL__",
          storyUrl("second-round-2026"),
        )
        .replaceAll(
          "__STORY_2026_08_18_RADIO_CANONICAL__",
          storyUrl("2026-08-18-radio"),
        )
        .replaceAll(
          "__STORY_SECOND_ROUND_RESULT_CANONICAL__",
          storyUrl("second-round-result-2026"),
        )
        .replaceAll(
          "__STORY_CAMPUS_GIRLS_SECOND_STAGE_JURY_AWARD_CANONICAL__",
          storyUrl("campus-girls-2027-second-stage-jury-award"),
        )
        .replaceAll(
          "__STORY_2026_08_23_MUSICAL_SPECIAL_CANONICAL__",
          storyUrl("2026-08-23-musical-special"),
        )
        .replaceAll(
          "__STORY_2026_08_25_MOTIVATION_CANONICAL__",
          storyUrl("2026-08-25-motivation"),
        )
        .replaceAll(
          "__STORY_2026_10_15_SEMIFINAL_CANONICAL__",
          storyUrl("2026-10-15-semifinal"),
        )
        .replaceAll("__ACTIVITY_PAGE_TITLE__", activityMetadata?.title ?? "")
        .replaceAll(
          "__ACTIVITY_PAGE_DESCRIPTION__",
          activityMetadata?.description ?? "",
        )
        .replaceAll(
          "__ACTIVITY_CANONICAL__",
          activityMetadata?.canonical ?? "",
        )
        .replaceAll(
          "__ACTIVITY_JSON_LD__",
          activityMetadata
            ? JSON.stringify(activityPageStructuredData(context.path), null, 2)
            : "",
        )
        .replaceAll("__SUPPORT_PAGE_TITLE__", supportPageMetadata.title)
        .replaceAll(
          "__SUPPORT_PAGE_DESCRIPTION__",
          supportPageMetadata.description,
        )
        .replaceAll("__SUPPORT_CANONICAL__", supportPageMetadata.canonical)
        .replaceAll(
          "__SUPPORT_JSON_LD__",
          JSON.stringify(supportPageStructuredData(), null, 2),
        )
        .replaceAll("__NEWS_PAGE_TITLE__", newsMetadata?.title ?? "")
        .replaceAll(
          "__NEWS_PAGE_DESCRIPTION__",
          newsMetadata?.description ?? "",
        )
        .replaceAll("__NEWS_CANONICAL__", newsMetadata?.canonical ?? "")
        .replaceAll(
          "__NEWS_JSON_LD__",
          JSON.stringify(archivePageStructuredData(NEWS_ARCHIVE_ROUTE), null, 2),
        )
        .replaceAll("__STORIES_PAGE_TITLE__", storiesMetadata?.title ?? "")
        .replaceAll(
          "__STORIES_PAGE_DESCRIPTION__",
          storiesMetadata?.description ?? "",
        )
        .replaceAll("__STORIES_CANONICAL__", storiesMetadata?.canonical ?? "")
        .replaceAll(
          "__STORIES_JSON_LD__",
          JSON.stringify(
            archivePageStructuredData(STORIES_ARCHIVE_ROUTE),
            null,
            2,
          ),
        )
        .replaceAll("__GALLERY_PAGE_TITLE__", galleryMetadata?.title ?? "")
        .replaceAll(
          "__GALLERY_PAGE_DESCRIPTION__",
          galleryMetadata?.description ?? "",
        )
        .replaceAll("__GALLERY_CANONICAL__", galleryMetadata?.canonical ?? "")
        .replaceAll(
          "__GALLERY_JSON_LD__",
          JSON.stringify(
            archivePageStructuredData(GALLERY_ARCHIVE_ROUTE),
            null,
            2,
          ),
        )
        .replaceAll("__SONG_CLIPS_PAGE_TITLE__", songClipsPageMetadata.title)
        .replaceAll("__SONG_CLIPS_PAGE_DESCRIPTION__", songClipsPageMetadata.description)
        .replaceAll("__SONG_CLIPS_CANONICAL__", songClipsPageMetadata.canonical)
        .replaceAll(
          "__SONG_CLIPS_JSON_LD__",
          JSON.stringify(songClipsPageStructuredData(), null, 2),
        )
        .replaceAll("__RADIO_MUSIC_PAGE_TITLE__", radioMusicPageMetadata.title)
        .replaceAll("__RADIO_MUSIC_PAGE_DESCRIPTION__", radioMusicPageMetadata.description)
        .replaceAll("__RADIO_MUSIC_CANONICAL__", radioMusicPageMetadata.canonical)
        .replaceAll(
          "__RADIO_MUSIC_JSON_LD__",
          JSON.stringify(radioMusicPageStructuredData(), null, 2),
        )
        .replaceAll("__SITE_OG_IMAGE__", ogImageUrl());
    },
  };
}

function webAnalyticsHtmlPlugin(): Plugin {
  return {
    name: "vercel-web-analytics-html",
    transformIndexHtml(html) {
      return injectVercelWebAnalytics(html);
    },
  };
}

function portalFeedPlugin(): Plugin {
  return {
    name: "portal-feed",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "portal-feed.json",
        source: `${JSON.stringify(createPortalFeed(), null, 2)}\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), siteMetadataPlugin(), webAnalyticsHtmlPlugin(), portalFeedPlugin()],
  build: {
    target: "es2020",
    minify: "esbuild",
    cssMinify: true,
    rollupOptions: {
      input: {
        home: "index.html",
        dataLab: "data-lab/index.html",
        dataLabProgress: "data-lab/progress/index.html",
        dataLabGlitter: "data-lab/glitter/index.html",
        dataLabTiming: "data-lab/stream-timing/index.html",
        dataLabVelocity: "data-lab/comment-velocity/index.html",
        dataLabMorning20261017: "data-lab/reports/20261017-morning/index.html",
        dataLabNight20261017: "data-lab/reports/20261017-night/index.html",
        dataLabMorning20261018: "data-lab/reports/20261018-morning/index.html",
        dataLabNight20261018: "data-lab/reports/20261018-night/index.html",
        dataLabNight20261025: "data-lab/reports/20261025-night/index.html",
        dataLabNoon20261029: "data-lab/reports/20261029-noon/index.html",
        dataLabMorning20261028: "data-lab/reports/20261028-morning/index.html",
        dataLabNight20261027: "data-lab/reports/20261027-night/index.html",
        dataLabMorning20261027: "data-lab/reports/20261027-morning/index.html",
        dataLabNight20261026: "data-lab/reports/20261026-night/index.html",
        dataLabMorning20261025: "data-lab/reports/20261025-morning/index.html",
        dataLabNoon20261024: "data-lab/reports/20261024-noon/index.html",
        dataLabMorning20261024: "data-lab/reports/20261024-morning/index.html",
        dataLabMorning20261023: "data-lab/reports/20261023-morning/index.html",
        dataLabNight20261022: "data-lab/reports/20261022-night/index.html",
        dataLabMorning20261022: "data-lab/reports/20261022-morning/index.html",
          dataLabMorning20261021: "data-lab/reports/20261021-morning/index.html",
        dataLabNight20261020: "data-lab/reports/20261020-night/index.html",
        dataLabMorning20261020: "data-lab/reports/20261020-morning/index.html",
        dataLabMorning20261019: "data-lab/reports/20261019-morning/index.html",
        dataLabFinalNight: "data-lab/reports/20261012-final-night/index.html",
        profile: "profile/index.html",
        activities: "activities/index.html",
        support: "support/index.html",
        news: "news/index.html",
        storiesIndex: "stories/index.html",
        gallery: "gallery/index.html",
        activityMissCircle: "activities/miss-circle/index.html",
        activityRadio: "activities/radio/index.html",
        activityRadioMusic: "activities/radio/music/index.html",
        activityLive: "activities/live/index.html",
        activityLiveClips: "activities/live/clips/index.html",
        activityCampusGirls: "activities/campus-girls/index.html",
        storyRadio20260818: "stories/2026-08-18-radio/index.html",
        storySecondRound: "stories/second-round-2026/index.html",
        storySecondRoundResult: "stories/second-round-result-2026/index.html",
        storyCampusGirlsSecondStageJuryAward:
          "stories/campus-girls-2027-second-stage-jury-award/index.html",
        storySeasideMusical:
          "stories/2026-08-23-musical-special/index.html",
        storyMotivation20260825: "stories/2026-08-25-motivation/index.html",
        storySemifinal20261015: "stories/2026-10-15-semifinal/index.html",
      },
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
  },
});
