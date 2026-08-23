import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  activitiesUrl,
  activityUrl,
  canonicalUrl,
  ogImageUrl,
  profileUrl,
  robotsTxt,
  site,
  siteOrigin,
  sitemapXml,
  storyUrl,
  supportUrl,
  newsUrl,
  storiesIndexUrl,
  galleryUrl,
} from "../src/data/site.ts";
import { activities } from "../src/data/activities.ts";

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
  const supportCanonical = supportUrl();
  const newsCanonical = newsUrl();
  const storiesIndexCanonical = storiesIndexUrl();
  const galleryCanonical = galleryUrl();
  const archivePages = [
    {
      canonical: newsCanonical,
      html: readRelative("news/index.html"),
      input: 'news: "news/index.html"',
      label: "NEWS archive",
      placeholder: "NEWS",
    },
    {
      canonical: storiesIndexCanonical,
      html: readRelative("stories/index.html"),
      input: 'storiesIndex: "stories/index.html"',
      label: "STORY archive",
      placeholder: "STORIES",
    },
    {
      canonical: galleryCanonical,
      html: readRelative("gallery/index.html"),
      input: 'gallery: "gallery/index.html"',
      label: "Gallery archive",
      placeholder: "GALLERY",
    },
  ];
  const activityPages = [
    {
      canonical: activitiesUrl(),
      html: readRelative("activities/index.html"),
      input: 'activities: "activities/index.html"',
      label: "Activities Hub",
    },
    ...activities.map((activity) => ({
      canonical: activityUrl(activity.route),
      html: readRelative(`${activity.route.slice(1)}index.html`),
      input: `activities/${activity.route.split("/").filter(Boolean).at(-1)}/index.html`,
      label: activity.label,
    })),
  ];
  const storyCanonical = storyUrl("second-round-2026");
  const radioStoryCanonical = storyUrl("2026-08-18-radio");
  const resultStoryCanonical = storyUrl("second-round-result-2026");
  const campusGirlsStoryCanonical = storyUrl(
    "campus-girls-2027-second-stage-jury-award",
  );
  const ogImage = ogImageUrl();
  const html = readRelative("index.html");
  const profileHtml = readRelative("profile/index.html");
  const supportHtml = readRelative("support/index.html");
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
  if (!supportHtml.includes('href="__SUPPORT_CANONICAL__"')) {
    errors.push("support/index.html canonical href must use __SUPPORT_CANONICAL__");
  }
  if (
    !supportHtml.includes('property="og:url"') ||
    !supportHtml.includes('content="__SUPPORT_CANONICAL__"')
  ) {
    errors.push("support/index.html og:url must use __SUPPORT_CANONICAL__");
  }
  if (!supportHtml.includes('content="__SITE_OG_IMAGE__"')) {
    errors.push("support/index.html images must use __SITE_OG_IMAGE__");
  }
  if (!supportHtml.includes("__SUPPORT_JSON_LD__")) {
    errors.push("support/index.html must include generated JSON-LD");
  }
  if (!supportHtml.includes("非公式")) {
    errors.push("Support metadata must state that the site is unofficial");
  }
  for (const archivePage of archivePages) {
    const key = archivePage.placeholder;
    if (!archivePage.html.includes(`href="__${key}_CANONICAL__"`)) {
      errors.push(`${archivePage.label} canonical must use __${key}_CANONICAL__`);
    }
    if (
      !archivePage.html.includes('property="og:url"') ||
      !archivePage.html.includes(`content="__${key}_CANONICAL__"`)
    ) {
      errors.push(`${archivePage.label} og:url must use __${key}_CANONICAL__`);
    }
    if (!archivePage.html.includes('content="__SITE_OG_IMAGE__"')) {
      errors.push(`${archivePage.label} images must use __SITE_OG_IMAGE__`);
    }
    if (!archivePage.html.includes(`__${key}_JSON_LD__`)) {
      errors.push(`${archivePage.label} must include generated JSON-LD`);
    }
    if (!archivePage.html.includes("非公式")) {
      errors.push(`${archivePage.label} metadata must state that the site is unofficial`);
    }
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
  for (const activityPage of activityPages) {
    if (!activityPage.html.includes('href="__ACTIVITY_CANONICAL__"')) {
      errors.push(`${activityPage.label} canonical must use __ACTIVITY_CANONICAL__`);
    }
    if (
      !activityPage.html.includes('property="og:url"') ||
      !activityPage.html.includes('content="__ACTIVITY_CANONICAL__"')
    ) {
      errors.push(`${activityPage.label} og:url must use __ACTIVITY_CANONICAL__`);
    }
    if (!activityPage.html.includes('content="__SITE_OG_IMAGE__"')) {
      errors.push(`${activityPage.label} images must use __SITE_OG_IMAGE__`);
    }
    if (!activityPage.html.includes("__ACTIVITY_JSON_LD__")) {
      errors.push(`${activityPage.label} must include generated JSON-LD`);
    }
    if (!activityPage.html.includes("非公式")) {
      errors.push(`${activityPage.label} metadata must state that the site is unofficial`);
    }
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
  if (!sitemap.includes(`<loc>${supportCanonical}</loc>`)) {
    errors.push("public/sitemap.xml must include the Support canonical URL");
  }
  for (const archivePage of archivePages) {
    if (!sitemap.includes(`<loc>${archivePage.canonical}</loc>`)) {
      errors.push(`public/sitemap.xml must include ${archivePage.label}`);
    }
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
  for (const activityPage of activityPages) {
    if (!sitemap.includes(`<loc>${activityPage.canonical}</loc>`)) {
      errors.push(`public/sitemap.xml must include ${activityPage.label}`);
    }
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
    !viteConfig.includes("ogImageUrl()") ||
    !viteConfig.includes("activityPageMetadata(context.path)")
  ) {
    errors.push("vite.config.ts must replace metadata placeholders from site.siteUrl helpers");
  }
  if (
    !viteConfig.includes("supportPageMetadata.canonical") ||
    !viteConfig.includes("supportPageStructuredData()") ||
    !viteConfig.includes('support: "support/index.html"')
  ) {
    errors.push("vite.config.ts must include Support metadata and its physical input");
  }
  if (
    !viteConfig.includes("archivePageMetadata") ||
    !viteConfig.includes('news: "news/index.html"') ||
    !viteConfig.includes('storiesIndex: "stories/index.html"') ||
    !viteConfig.includes('gallery: "gallery/index.html"')
  ) {
    errors.push("vite.config.ts must include NEWS / STORY / Gallery archive inputs");
  }
  for (const activityPage of activityPages) {
    if (!viteConfig.includes(activityPage.input)) {
      errors.push(`vite.config.ts must include the physical input for ${activityPage.label}`);
    }
  }
  for (const archivePage of archivePages) {
    if (!viteConfig.includes(archivePage.input)) {
      errors.push(`vite.config.ts must include the physical input for ${archivePage.label}`);
    }
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
  if (hardcodedOrigin.test(supportHtml)) {
    errors.push(
      "support/index.html must not hardcode the public origin; use site.siteUrl placeholders",
    );
  }
  for (const archivePage of archivePages) {
    if (hardcodedOrigin.test(archivePage.html)) {
      errors.push(`${archivePage.label} HTML must not hardcode the public origin`);
    }
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
  for (const activityPage of activityPages) {
    if (hardcodedOrigin.test(activityPage.html)) {
      errors.push(`${activityPage.label} HTML must not hardcode the public origin`);
    }
  }

  if (
    !canonical.startsWith(origin) ||
    !profileCanonical.startsWith(origin) ||
    !supportCanonical.startsWith(origin) ||
    !newsCanonical.startsWith(origin) ||
    !storiesIndexCanonical.startsWith(origin) ||
    !galleryCanonical.startsWith(origin) ||
    !storyCanonical.startsWith(origin) ||
    !radioStoryCanonical.startsWith(origin) ||
    !resultStoryCanonical.startsWith(origin) ||
    !campusGirlsStoryCanonical.startsWith(origin) ||
    activityPages.some((activityPage) => !activityPage.canonical.startsWith(origin)) ||
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
