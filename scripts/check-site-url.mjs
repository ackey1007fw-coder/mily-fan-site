import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  canonicalUrl,
  ogImageUrl,
  profileUrl,
  robotsTxt,
  site,
  siteOrigin,
  sitemapXml,
  storyUrl,
} from "../src/data/site.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRelative(relative) {
  return readFileSync(path.join(root, relative), "utf8");
}

function normalizeNewlines(value) {
  return value.replaceAll("\r\n", "\n");
}

export function verifySiteUrlConsistency() {
  const errors = [];
  const origin = siteOrigin();
  const canonical = canonicalUrl();
  const profileCanonical = profileUrl();
  const storyCanonical = storyUrl("second-round-2026");
  const radioStoryCanonical = storyUrl("2026-08-18-radio");
  const resultStoryCanonical = storyUrl("second-round-result-2026");
  const campusGirlsStoryCanonical = storyUrl(
    "campus-girls-2027-second-stage-jury-award",
  );
  const ogImage = ogImageUrl();
  const html = readRelative("index.html");
  const profileHtml = readRelative("profile/index.html");
  const storyHtml = readRelative("stories/second-round-2026/index.html");
  const radioStoryHtml = readRelative("stories/2026-08-18-radio/index.html");
  const resultStoryHtml = readRelative(
    "stories/second-round-result-2026/index.html",
  );
  const campusGirlsStoryHtml = readRelative(
    "stories/campus-girls-2027-second-stage-jury-award/index.html",
  );
  const robots = readRelative("public/robots.txt");
  const sitemap = readRelative("public/sitemap.xml");
  const viteConfig = readRelative("vite.config.ts");

  if (!origin.startsWith("https://")) {
    errors.push(`site.siteUrl must be an https origin (got "${site.siteUrl}")`);
  }

  if (html.includes('rel="canonical"') === false) {
    errors.push("index.html is missing a canonical link");
  }
  if (!html.includes('href="__SITE_CANONICAL__"')) {
    errors.push("index.html canonical href must use __SITE_CANONICAL__ from site.siteUrl");
  }
  if (!html.includes('property="og:url"') || !html.includes('content="__SITE_CANONICAL__"')) {
    errors.push("index.html og:url must use __SITE_CANONICAL__ from site.siteUrl");
  }
  if (!html.includes('property="og:image"') || !html.includes('content="__SITE_OG_IMAGE__"')) {
    errors.push("index.html og:image must use __SITE_OG_IMAGE__ from site.siteUrl");
  }
  if (!html.includes('name="twitter:image"') || !html.includes('content="__SITE_OG_IMAGE__"')) {
    errors.push("index.html twitter:image must use __SITE_OG_IMAGE__ from site.siteUrl");
  }
  if (!profileHtml.includes('href="__PROFILE_CANONICAL__"')) {
    errors.push("profile/index.html canonical href must use __PROFILE_CANONICAL__");
  }
  if (
    !profileHtml.includes('property="og:url"') ||
    !profileHtml.includes('content="__PROFILE_CANONICAL__"')
  ) {
    errors.push("profile/index.html og:url must use __PROFILE_CANONICAL__");
  }
  if (!profileHtml.includes('content="__SITE_OG_IMAGE__"')) {
    errors.push("profile/index.html images must use __SITE_OG_IMAGE__");
  }
  if (!storyHtml.includes('href="__STORY_SECOND_ROUND_CANONICAL__"')) {
    errors.push("story canonical href must use __STORY_SECOND_ROUND_CANONICAL__");
  }
  if (
    !storyHtml.includes('property="og:url"') ||
    !storyHtml.includes('content="__STORY_SECOND_ROUND_CANONICAL__"')
  ) {
    errors.push("story og:url must use __STORY_SECOND_ROUND_CANONICAL__");
  }
  if (!storyHtml.includes('content="__SITE_OG_IMAGE__"')) {
    errors.push("story images must use __SITE_OG_IMAGE__");
  }
  if (!radioStoryHtml.includes('href="__STORY_2026_08_18_RADIO_CANONICAL__"')) {
    errors.push("radio story canonical href must use __STORY_2026_08_18_RADIO_CANONICAL__");
  }
  if (
    !radioStoryHtml.includes('property="og:url"') ||
    !radioStoryHtml.includes('content="__STORY_2026_08_18_RADIO_CANONICAL__"')
  ) {
    errors.push("radio story og:url must use __STORY_2026_08_18_RADIO_CANONICAL__");
  }
  if (!radioStoryHtml.includes('content="__SITE_OG_IMAGE__"')) {
    errors.push("radio story images must use __SITE_OG_IMAGE__");
  }
  if (!resultStoryHtml.includes('href="__STORY_SECOND_ROUND_RESULT_CANONICAL__"')) {
    errors.push(
      "second-round result story canonical href must use __STORY_SECOND_ROUND_RESULT_CANONICAL__",
    );
  }
  if (
    !resultStoryHtml.includes('property="og:url"') ||
    !resultStoryHtml.includes('content="__STORY_SECOND_ROUND_RESULT_CANONICAL__"')
  ) {
    errors.push(
      "second-round result story og:url must use __STORY_SECOND_ROUND_RESULT_CANONICAL__",
    );
  }
  if (!resultStoryHtml.includes('content="__SITE_OG_IMAGE__"')) {
    errors.push("second-round result story images must use __SITE_OG_IMAGE__");
  }
  if (
    !campusGirlsStoryHtml.includes(
      'href="__STORY_CAMPUS_GIRLS_SECOND_STAGE_JURY_AWARD_CANONICAL__"',
    )
  ) {
    errors.push(
      "CAMPUS GIRLS story canonical href must use its siteUrl placeholder",
    );
  }
  if (
    !campusGirlsStoryHtml.includes('property="og:url"') ||
    !campusGirlsStoryHtml.includes(
      'content="__STORY_CAMPUS_GIRLS_SECOND_STAGE_JURY_AWARD_CANONICAL__"',
    )
  ) {
    errors.push("CAMPUS GIRLS story og:url must use its siteUrl placeholder");
  }
  if (!campusGirlsStoryHtml.includes('content="__SITE_OG_IMAGE__"')) {
    errors.push("CAMPUS GIRLS story images must use __SITE_OG_IMAGE__");
  }

  if (normalizeNewlines(robots) !== robotsTxt()) {
    errors.push("public/robots.txt must be generated from site.siteUrl");
  }
  if (!robots.includes(`Sitemap: ${origin}/sitemap.xml`)) {
    errors.push("public/robots.txt sitemap URL must follow site.siteUrl");
  }

  if (normalizeNewlines(sitemap) !== sitemapXml()) {
    errors.push("public/sitemap.xml must be generated from site.siteUrl");
  }
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) {
    errors.push("public/sitemap.xml loc must follow site.siteUrl");
  }
  if (!sitemap.includes(`<loc>${profileCanonical}</loc>`)) {
    errors.push("public/sitemap.xml must include the profile canonical URL");
  }
  if (!sitemap.includes(`<loc>${storyCanonical}</loc>`)) {
    errors.push("public/sitemap.xml must include the story canonical URL");
  }
  if (!sitemap.includes(`<loc>${radioStoryCanonical}</loc>`)) {
    errors.push("public/sitemap.xml must include the radio story canonical URL");
  }
  if (!sitemap.includes(`<loc>${resultStoryCanonical}</loc>`)) {
    errors.push(
      "public/sitemap.xml must include the second-round result story canonical URL",
    );
  }
  if (!sitemap.includes(`<loc>${campusGirlsStoryCanonical}</loc>`)) {
    errors.push(
      "public/sitemap.xml must include the CAMPUS GIRLS story canonical URL",
    );
  }

  if (
    !viteConfig.includes("canonicalUrl()") ||
    !viteConfig.includes("profileUrl()") ||
    !viteConfig.includes('storyUrl("second-round-2026")') ||
    !viteConfig.includes('storyUrl("2026-08-18-radio")') ||
    !viteConfig.includes('storyUrl("second-round-result-2026")') ||
    !viteConfig.includes(
      'storyUrl("campus-girls-2027-second-stage-jury-award")',
    ) ||
    !viteConfig.includes("ogImageUrl()")
  ) {
    errors.push("vite.config.ts must replace metadata placeholders from site.siteUrl helpers");
  }

  const hardcodedOrigin = new RegExp(
    origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  if (hardcodedOrigin.test(html)) {
    errors.push("index.html must not hardcode the public origin; use site.siteUrl placeholders");
  }
  if (hardcodedOrigin.test(profileHtml)) {
    errors.push(
      "profile/index.html must not hardcode the public origin; use site.siteUrl placeholders",
    );
  }
  if (hardcodedOrigin.test(storyHtml)) {
    errors.push(
      "story HTML must not hardcode the public origin; use site.siteUrl placeholders",
    );
  }
  if (hardcodedOrigin.test(radioStoryHtml)) {
    errors.push(
      "radio story HTML must not hardcode the public origin; use site.siteUrl placeholders",
    );
  }
  if (hardcodedOrigin.test(resultStoryHtml)) {
    errors.push(
      "second-round result story HTML must not hardcode the public origin; use site.siteUrl placeholders",
    );
  }
  if (hardcodedOrigin.test(campusGirlsStoryHtml)) {
    errors.push(
      "CAMPUS GIRLS story HTML must not hardcode the public origin; use site.siteUrl placeholders",
    );
  }

  if (
    !canonical.startsWith(origin) ||
    !profileCanonical.startsWith(origin) ||
    !storyCanonical.startsWith(origin) ||
    !radioStoryCanonical.startsWith(origin) ||
    !resultStoryCanonical.startsWith(origin) ||
    !campusGirlsStoryCanonical.startsWith(origin) ||
    !ogImage.startsWith(origin)
  ) {
    errors.push("canonical and og image URLs must stay on site.siteUrl");
  }

  return errors;
}

const invoked = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invoked === fileURLToPath(import.meta.url)) {
  const errors = verifySiteUrlConsistency();
  if (errors.length > 0) {
    console.error("\nPublic metadata is out of sync with site.siteUrl:");
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }
  console.log(`site-url: metadata follows ${siteOrigin()}`);
}
