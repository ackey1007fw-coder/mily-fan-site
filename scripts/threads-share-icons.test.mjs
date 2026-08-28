import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  siteSharePayload,
  threadsShareUrl,
} from "../src/lib/siteShare.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

describe("Threads site sharing", () => {
  it("encodes the public copy and canonical URL in the Threads post intent", () => {
    const payload = siteSharePayload();
    const href = threadsShareUrl(payload);
    const parsed = new URL(href);

    assert.equal(parsed.protocol, "https:");
    assert.equal(parsed.hostname, "www.threads.com");
    assert.equal(parsed.pathname, "/intent/post");
    assert.equal(parsed.searchParams.get("text"), payload.text);
    assert.equal(parsed.searchParams.get("url"), payload.url);
    assert.ok(href.includes(encodeURIComponent(payload.text)));
    assert.ok(href.includes(encodeURIComponent(payload.url)));
    assert.doesNotMatch(href, /https:\/\/mily-fan-site\.vercel\.app\//);
  });

  it("wires the Threads control to the shared site payload", async () => {
    const ui = await read("src/components/SiteShare.tsx");

    assert.match(ui, /threadsShareUrl/);
    assert.match(ui, /const THREADS_SHARE_HREF = threadsShareUrl\(SHARE\)/);
    assert.match(ui, /href=\{THREADS_SHARE_HREF\}/);
    assert.match(ui, /Threadsでこのサイトをシェア/);
  });
});

describe("direct SNS brand icons", () => {
  it("renders X, LINE, Facebook, and Threads as inline SVG brand glyphs", async () => {
    const ui = await read("src/components/SiteShare.tsx");

    assert.match(ui, /const X_ICON_PATH/);
    assert.match(ui, /const LINE_ICON_PATH/);
    assert.match(ui, /const FACEBOOK_ICON_PATH/);
    assert.match(ui, /const THREADS_ICON_PATH/);
    assert.match(ui, /<BrandIcon path=\{X_ICON_PATH\} \/>/);
    assert.match(ui, /<BrandIcon path=\{LINE_ICON_PATH\} \/>/);
    assert.match(ui, /<BrandIcon path=\{FACEBOOK_ICON_PATH\} \/>/);
    assert.match(ui, /<BrandIcon path=\{THREADS_ICON_PATH\} \/>/);
    assert.equal((ui.match(/<BrandIcon path=\{/g) ?? []).length, 4);
    assert.match(ui, /viewBox="0 0 24 24"/);
    assert.match(ui, /fill="currentColor"/);
    assert.match(ui, /aria-hidden="true"/);
    assert.doesNotMatch(ui, /<img/);
  });

  it("keeps the icon controls touch-sized and wrapping on narrow screens", async () => {
    const ui = await read("src/components/SiteShare.tsx");

    assert.match(ui, /const socialActionClassName/);
    assert.match(ui, /h-11/);
    assert.match(ui, /w-11/);
    assert.match(ui, /flex-wrap/);
    assert.doesNotMatch(ui, /overflow-x-auto/);
  });
});
