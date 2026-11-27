import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { activities } from "../src/data/activities.ts";
import {
  activitiesUrl,
  activityUrl,
  canonicalUrl,
  galleryUrl,
  newsUrl,
  profileUrl,
  radioMusicUrl,
  robotsTxt,
  site,
  siteOrigin,
  sitemapXml,
  songClipsUrl,
  storiesIndexUrl,
  storyUrl,
  supportUrl,
} from "../src/data/site.ts";
import { visibleStories } from "../src/data/stories.ts";
import {
  homePageMetadata,
  homePageStructuredData,
} from "../src/lib/homeMetadata.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = (relative) => readFileSync(path.join(root, relative), "utf8");

function sitemapLocs(xml) {
  return [...xml.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );
}

describe("home SEO copy and structured data", () => {
  it("puts 三橋莉子（みりぃ） and 非公式ファンサイト in the home title and description", () => {
    assert.equal(
      homePageMetadata.title,
      "三橋莉子（みりぃ）非公式ファンサイト｜ミスサークル2026応援",
    );
    assert.match(homePageMetadata.title, /三橋莉子（みりぃ）/);
    assert.match(homePageMetadata.title, /非公式ファンサイト/);
    assert.match(homePageMetadata.title, /ミスサークル2026/);
    assert.match(homePageMetadata.description, /非公式ファンサイト/);
    assert.match(homePageMetadata.description, /三橋莉子/);
    assert.match(homePageMetadata.description, /みりぃ/);
    assert.match(homePageMetadata.description, /ミスサークル/);
    assert.match(homePageMetadata.description, /MISS CIRCLE CONTEST/);
    assert.match(homePageMetadata.description, /本人運営ではありません/);
    assert.equal(homePageMetadata.canonical, canonicalUrl());
  });

  it("injects home metadata placeholders from the shared helper", () => {
    const html = source("index.html");
    const vite = source("vite.config.ts");
    assert.match(html, /<html lang="ja">/);
    assert.match(html, /<title>__HOME_PAGE_TITLE__<\/title>/);
    assert.match(html, /content="__HOME_PAGE_DESCRIPTION__"/);
    assert.match(html, /__HOME_JSON_LD__/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.match(html, /property="og:image" content="__SITE_OG_IMAGE__"/);
    assert.match(html, /rel="canonical" href="__SITE_CANONICAL__"/);
    assert.match(vite, /homePageMetadata\.title/);
    assert.match(vite, /homePageStructuredData\(\)/);
  });

  it("marks WebSite and Person JSON-LD as an unofficial fan site", () => {
    const data = homePageStructuredData();
    const graph = data["@graph"];
    const website = graph.find((node) => node["@type"] === "WebSite");
    const person = graph.find((node) => node["@type"] === "Person");
    assert.equal(graph.length, 2);
    assert.match(website.name, /非公式/);
    assert.match(website.description, /非公式ファンサイト/);
    assert.equal(website.url, canonicalUrl());
    assert.equal(person.name, "三橋莉子");
    assert.ok(person.alternateName.includes("みりぃ"));
    assert.match(person.description, /非公式ファンサイト/);
    assert.match(person.description, /本人運営ではありません/);
    assert.doesNotMatch(JSON.stringify(data), /公式サイト|本人運営です|公認/);
  });

  it("shows 三橋莉子（みりぃ） in the visible home h1 and no-JS fallback", () => {
    const hero = source("src/components/Hero.tsx");
    const html = source("index.html");
    assert.match(
      hero,
      /\{profile\.publicName\}（\{profile\.displayName\}）/,
    );
    assert.match(html, /<h1>三橋莉子（みりぃ）非公式ファンサイト<\/h1>/);
  });
});

describe("robots.txt and sitemap.xml for Search Console", () => {
  it("keeps robots.txt allowing crawlers and pointing at the production sitemap", () => {
    const robots = source("public/robots.txt");
    const origin = siteOrigin();
    assert.equal(robots, robotsTxt());
    assert.match(robots, /^User-agent: \*\nAllow: \/\n\nSitemap: /);
    assert.equal(
      robots.trim().split("\n").at(-1),
      `Sitemap: ${origin}/sitemap.xml`,
    );
    assert.doesNotMatch(robots, /Disallow: \//);
    assert.doesNotMatch(robots, /noindex/i);
  });

  it("lists every public indexable route as an absolute production URL", () => {
    const xml = source("public/sitemap.xml");
    const generated = sitemapXml();
    assert.equal(xml, generated);

    const locs = sitemapLocs(xml);
    const origin = siteOrigin();
    const expected = [
      canonicalUrl(),
      profileUrl(),
      activitiesUrl(),
      supportUrl(),
      newsUrl(),
      storiesIndexUrl(),
      galleryUrl(),
      ...activities.map((activity) => activityUrl(activity.route)),
      songClipsUrl(),
      radioMusicUrl(),
      ...visibleStories().map((story) => storyUrl(story.slug)),
    ];

    assert.equal(xml.includes("<urlset"), true);
    assert.ok(locs.length > 0);
    for (const loc of locs) {
      assert.ok(loc.startsWith(`${origin}/`), loc);
      assert.doesNotMatch(loc, /\/data-lab\//);
    }
    for (const loc of expected) {
      assert.ok(locs.includes(loc), `sitemap missing ${loc}`);
    }
    assert.equal(new Set(locs).size, locs.length);
  });

  it("does not add an X-Robots-Tag that would noindex production", () => {
    const vercel = source("vercel.json");
    assert.doesNotMatch(vercel, /X-Robots-Tag/i);
    assert.doesNotMatch(vercel, /noindex/i);
  });
});

describe("existing Search Console verification", () => {
  it("keeps the existing HTML verification file and does not add a placeholder token", () => {
    const files = readdirSync(path.join(root, "public")).filter((name) =>
      /^google[a-z0-9]+\.html$/i.test(name),
    );
    assert.ok(files.length >= 1, "existing GSC HTML verification file must remain");
    for (const file of files) {
      const body = source(path.join("public", file));
      assert.match(body, /^google-site-verification: google[a-z0-9]+\.html\s*$/);
      assert.ok(existsSync(path.join(root, "public", file)));
    }

    const scanned = [
      "index.html",
      "src/lib/homeMetadata.ts",
      "src/data/site.ts",
      "vite.config.ts",
    ];
    for (const relative of scanned) {
      const text = source(relative);
      assert.doesNotMatch(text, /VITE_GSC_VERIFICATION/);
      assert.doesNotMatch(text, /google-site-verification/);
      assert.doesNotMatch(text, /__GOOGLE_SITE_VERIFICATION__/);
    }
    assert.equal(existsSync(path.join(root, "src/lib/googleSiteVerification.ts")), false);
  });

  it("does not invent a new verification meta tag on public HTML", () => {
    assert.doesNotMatch(source("index.html"), /name="google-site-verification"/);
    assert.match(site.siteUrl, /^https:\/\/mily-fan-site\.vercel\.app$/);
  });
});
