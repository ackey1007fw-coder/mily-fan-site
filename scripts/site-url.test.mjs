import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canonicalUrl,
  ogImageUrl,
  robotsTxt,
  site,
  siteOrigin,
  sitemapXml,
} from "../src/data/site.ts";
import { verifySiteUrlConsistency } from "./check-site-url.mjs";

describe("site.siteUrl metadata source of truth", () => {
  it("derives canonical, OG, robots, and sitemap URLs from site.siteUrl", () => {
    const origin = siteOrigin();
    assert.equal(origin, "https://mily-fan-site.vercel.app");
    assert.equal(canonicalUrl(), `${origin}/`);
    assert.equal(ogImageUrl(), `${origin}${site.ogImagePath}`);
    assert.match(robotsTxt(), new RegExp(`Sitemap: ${origin}/sitemap.xml`));
    assert.match(sitemapXml(), new RegExp(`<loc>${canonicalUrl()}</loc>`));
  });

  it("fails when public metadata drifts from site.siteUrl", () => {
    assert.deepEqual(verifySiteUrlConsistency(), []);
  });
});
