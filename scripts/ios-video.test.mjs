import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { news } from "../src/data/news.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("2026-08-18 iOS in-app video compatibility", () => {
  it("uses a new cache-busted media URL", () => {
    const item = news.find((entry) => entry.id === "2026-08-18-morning-update");
    assert.ok(item?.media);
    assert.equal(
      item.media.src,
      "/media/gallery/mily-b04-01-morning-showroom-ios.mp4",
    );
    assert.notEqual(
      item.media.src,
      "/media/gallery/mily-b04-01-morning-showroom.mp4",
    );
  });

  it("builds the compatibility derivative with Baseline H.264, AAC-LC and faststart", async () => {
    const source = await readFile(path.join(root, "scripts/build-ios-video.mjs"), "utf8");
    assert.match(source, /baseline/);
    assert.match(source, /aac_low/);
    assert.match(source, /yuv420p/);
    assert.match(source, /fps=30/);
    assert.match(source, /\+faststart/);
    assert.match(source, /anullsrc/);
  });
});
