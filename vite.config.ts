import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { createPortalFeed } from "./src/data/portalFeed.ts";
import { canonicalUrl, ogImageUrl, profileUrl, storyUrl } from "./src/data/site";

function siteMetadataPlugin(): Plugin {
  return {
    name: "site-metadata",
    transformIndexHtml(html) {
      return html
        .replaceAll("__SITE_CANONICAL__", canonicalUrl())
        .replaceAll("__PROFILE_CANONICAL__", profileUrl())
        .replaceAll(
          "__STORY_SECOND_ROUND_CANONICAL__",
          storyUrl("second-round-2026"),
        )
        .replaceAll(
          "__STORY_2026_08_18_RADIO_CANONICAL__",
          storyUrl("2026-08-18-radio"),
        )
        .replaceAll("__SITE_OG_IMAGE__", ogImageUrl());
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
  plugins: [react(), siteMetadataPlugin(), portalFeedPlugin()],
  build: {
    target: "es2020",
    minify: "esbuild",
    cssMinify: true,
    rollupOptions: {
      input: {
        home: "index.html",
        profile: "profile/index.html",
        storyRadio20260818: "stories/2026-08-18-radio/index.html",
        storySecondRound: "stories/second-round-2026/index.html",
      },
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
  },
});
