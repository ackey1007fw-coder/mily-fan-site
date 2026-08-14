import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  canonicalUrl,
  ogImageUrl,
  robotsTxt,
  site,
  siteOrigin,
  sitemapXml,
} from "../src/data/site.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRelative(relative) {
  return readFileSync(path.join(root, relative), "utf8");
}

export function verifySiteUrlConsistency() {
  const errors = [];
  const origin = siteOrigin();
  const canonical = canonicalUrl();
  const ogImage = ogImageUrl();
  const html = readRelative("index.html");
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

  if (robots !== robotsTxt()) {
    errors.push("public/robots.txt must be generated from site.siteUrl");
  }
  if (!robots.includes(`Sitemap: ${origin}/sitemap.xml`)) {
    errors.push("public/robots.txt sitemap URL must follow site.siteUrl");
  }

  if (sitemap !== sitemapXml()) {
    errors.push("public/sitemap.xml must be generated from site.siteUrl");
  }
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) {
    errors.push("public/sitemap.xml loc must follow site.siteUrl");
  }

  if (!viteConfig.includes("canonicalUrl()") || !viteConfig.includes("ogImageUrl()")) {
    errors.push("vite.config.ts must replace metadata placeholders from site.siteUrl helpers");
  }

  const hardcodedOrigin = /https:\/\/mily-fan-site\.vercel\.app/;
  if (hardcodedOrigin.test(html)) {
    errors.push("index.html must not hardcode the public origin; use site.siteUrl placeholders");
  }

  if (!canonical.startsWith(origin) || !ogImage.startsWith(origin)) {
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
