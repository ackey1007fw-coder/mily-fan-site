import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const indexablePages = [
  ["index.html", "/"],
  ["profile/index.html", "/profile/"],
  ["news/index.html", "/news/"],
  ["activities/live/index.html", "/activities/live/"],
  ["activities/index.html", "/activities/"],
  ["gallery/index.html", "/gallery/"],
];

function source(relative) {
  return readFileSync(path.join(projectRoot, relative), "utf8");
}

describe("indexable pages have a safe no-JavaScript navigation fallback", () => {
  const sitemap = source("public/sitemap.xml");
  const parsedLocs = [...sitemap.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)]
    .map((match) => new URL(match[1]).pathname);
  const locs = new Set(parsedLocs);
  const fallbackRoutes = new Map(indexablePages.map(([file, route]) => [route, file]));

  for (const [file, route] of indexablePages) {
    it(route + " offers truthful nonofficial no-JS information and local links", () => {
      const html = source(file);
      // <head> の <noscript> は Web フォントの no-JS 読み込み用。本文の fallback は1つだけ。
      assert.equal(html.slice(html.indexOf("<body")).match(/<noscript>/g)?.length, 1);
      const fallback = html.match(/<div id="root">\s*<noscript>([\s\S]*?)<\/noscript>\s*<\/div>/)?.[1];
      assert.ok(fallback, "no-JS fallback must be inside #root in " + file);
      assert.match(fallback, /<h1>.*<\/h1>/);
      assert.match(fallback, /<nav aria-label="[^"]+">/);
      assert.match(fallback, /非公式/);
      assert.match(fallback, /本人運営ではありません/);
      assert.match(fallback, /JavaScriptが必要|JavaScriptが無効/);
      assert.match(html, /<meta name="robots" content="index, follow"/);
      assert.ok(locs.has(route), "indexable route missing from sitemap: " + route);
      const hrefs = [...fallback.matchAll(/<a href="([^"]+)"/g)].map(m => m[1]);
      assert.ok(hrefs.length >= 2);
      for (const href of hrefs) {
        assert.ok(href.startsWith("/"), file + ": only local absolute paths are allowed");
        assert.ok(locs.has(href), file + ": fallback link missing from sitemap: " + href);
        const linkedFile = fallbackRoutes.get(href);
        assert.ok(linkedFile, file + ": no-JS link leads to a page without a fallback: " + href);
        assert.match(source(linkedFile), /<noscript>/, file + ": destination is blank without JS: " + href);
      }
      assert.doesNotMatch(fallback, /<script|<iframe|<img|<form|[?&](?:token|key)=/i);
    });
  }

  it("keeps intentionally noindex analysis areas outside fallback and sitemap scope", () => {
    for (const file of ["data-lab/index.html", "data-lab/comment-velocity/index.html"]) {
      const html = source(file);
      assert.match(html, /name="robots" content="noindex/);
      assert.doesNotMatch(html, /<noscript>/);
    }
    assert.equal(locs.has("/data-lab/"), false);
    assert.equal(locs.has("/data-lab/comment-velocity/"), false);
  });
});
