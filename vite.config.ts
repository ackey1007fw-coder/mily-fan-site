import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { canonicalUrl, ogImageUrl } from "./src/data/site";

function siteMetadataPlugin(): Plugin {
  return {
    name: "site-metadata",
    transformIndexHtml(html) {
      return html
        .replaceAll("__SITE_CANONICAL__", canonicalUrl())
        .replaceAll("__SITE_OG_IMAGE__", ogImageUrl());
    },
  };
}

export default defineConfig({
  plugins: [react(), siteMetadataPlugin()],
  build: {
    target: "es2020",
    minify: "esbuild",
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
  },
});
