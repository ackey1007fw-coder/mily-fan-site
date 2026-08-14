import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

describe("milly site identity", () => {
  it("uses milly spelling in package and repo metadata", async () => {
    const pkg = JSON.parse(await read("package.json"));
    const site = await read("src/data/site.ts");

    assert.equal(pkg.name, "milly-fan-site");
    assert.match(site, /milly-fan-site/);
    assert.doesNotMatch(pkg.name, /(^|[^l])mily([^l]|$)/);
  });

  it("keeps the unofficial disclaimer in the document title", async () => {
    const html = await read("index.html");
    assert.match(html, /<title>みりぃ ファンサイト（非公式）<\/title>/);
    assert.match(html, /公式・公認・本人運営ではありません/);
  });

  it("starts with empty unverified content collections", async () => {
    const news = await read("src/data/news.ts");
    const events = await read("src/data/events.ts");
    const socials = await read("src/data/socials.ts");
    const links = await read("src/data/links.ts");
    const highlights = await read("src/data/highlights.ts");

    assert.match(news, /export const news: NewsItem\[] = \[\];/);
    assert.match(events, /export const events: FanEvent\[] = \[\];/);
    assert.match(socials, /export const socials: SocialLink\[] = \[\];/);
    assert.match(links, /export const links: SiteLink\[] = \[\];/);
    assert.match(highlights, /export const highlights: Highlight\[] = \[\];/);
  });

  it("passes the site identity guard", () => {
    const result = spawnSync(
      process.execPath,
      [path.join(root, "scripts/check-site-identity.mjs"), "main"],
      { encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stderr || result.stdout);
  });
});
