import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { featuredPhoto, srcSetFor } from "../src/data/media.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = (relative) => readFileSync(path.join(root, relative), "utf8");

const FONT_CSS =
  "https://fonts.googleapis.com/css2?family=Figtree:wght@500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap";

function htmlEntries(dir = root) {
  const found = [];
  for (const name of readdirSync(dir)) {
    if (["node_modules", "dist", "public", ".git"].includes(name)) continue;
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) found.push(...htmlEntries(full));
    else if (name === "index.html") found.push(full);
  }
  return found;
}

function attr(tag, name) {
  return tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
}

describe("head performance", () => {
  const fontPages = htmlEntries().filter((file) =>
    readFileSync(file, "utf8").includes("fonts.googleapis.com/css2"),
  );

  it("loads Google Fonts without a render-blocking stylesheet", () => {
    assert.ok(fontPages.length > 0);
    for (const file of fontPages) {
      const html = readFileSync(file, "utf8");
      const label = path.relative(root, file);
      const head = html.slice(0, html.indexOf("</head>"));
      const withoutNoscript = head.replace(/<noscript>[\s\S]*?<\/noscript>/g, "");
      const fontLinks = withoutNoscript.match(/<link\b[^>]*fonts\.googleapis\.com\/css2[^>]*>/g) ?? [];

      assert.equal(fontLinks.length, 1, label);
      assert.equal(attr(fontLinks[0], "rel"), "preload", label);
      assert.equal(attr(fontLinks[0], "as"), "style", label);
      assert.equal(attr(fontLinks[0], "href"), FONT_CSS, label);
      assert.match(fontLinks[0], /onload="this\.onload=null;this\.rel='stylesheet'"/, label);
      assert.ok(
        head.includes(`<noscript>\n`) && head.includes(`<link href="${FONT_CSS}" rel="stylesheet" />`),
        `${label}: noscript fallback`,
      );
      assert.match(head, /<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin \/>/, label);
      assert.doesNotMatch(head, /http-equiv="Content-Security-Policy"/, `${label}: inline onload needs no CSP`);
    }
  });

  it("preloads exactly the hero image the home page renders", () => {
    const photo = featuredPhoto();
    assert.ok(photo);
    const hero = source("src/components/Hero.tsx");
    const sizes = hero.match(/type="image\/webp"[\s\S]*?sizes="([^"]+)"/)?.[1];
    assert.ok(sizes);

    const html = source("index.html");
    const preloads = html.match(/<link\b[^>]*rel="preload"[^>]*as="image"[^>]*>/g) ?? [];
    assert.equal(preloads.length, 1);
    const [preload] = preloads;
    assert.equal(attr(preload, "type"), "image/webp");
    assert.equal(attr(preload, "imagesrcset"), srcSetFor(photo, "webp"));
    assert.equal(attr(preload, "imagesizes"), sizes);
    assert.equal(attr(preload, "fetchpriority"), "high");

    for (const candidate of srcSetFor(photo, "webp").split(", ")) {
      const url = candidate.split(" ")[0];
      assert.ok(existsSync(path.join(root, "public", url)), url);
    }
  });
});
