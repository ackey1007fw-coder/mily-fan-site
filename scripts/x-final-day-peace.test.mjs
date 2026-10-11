import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDir = path.join(root, "public/media/gallery");
const prefix = "mily-b215-01-20261011-twin-braids-peace";

describe("2026-10-11 X final-day post and owner-provided clip", () => {
  it("keeps one shared X video source in NEWS and Gallery", async () => {
    const videoSource = await readFile(path.join(root, "src/data/xFinalDayPeaceVideo.ts"), "utf8");
    const news = await readFile(path.join(root, "src/data/news.ts"), "utf8");
    const gallery = await readFile(path.join(root, "src/data/galleryVideos.ts"), "utf8");

    assert.match(videoSource, /2109297721366773862/);
    assert.match(videoSource, /sourceDate: "2026-10-11"/);
    assert.match(videoSource, /published: true/);
    assert.match(videoSource, /owner-provided/);
    assert.match(news, /2026-10-11-x-fourth-round-final-day-peace/);
    assert.match(news, /xFinalDayPeaceVideo/);
    assert.match(news, /21:59/);
    assert.match(news, /23:59/);
    assert.match(news, /今日の朝の私を添えて/);
    assert.equal((gallery.match(/^  xFinalDayPeaceVideo,$/gm) ?? []).length, 1);
  });

  it("publishes the sanitized silent MP4 and real-frame poster at the referenced paths", async () => {
    const [mp4, poster] = await Promise.all([
      readFile(path.join(galleryDir, prefix + ".mp4")),
      readFile(path.join(galleryDir, prefix + "-poster.jpg")),
    ]);
    assert.ok(mp4.length > 10_000);
    assert.ok(poster.length > 10_000);
    assert.equal(mp4.toString("ascii", 4, 8), "ftyp");
    assert.equal(poster[0], 0xff);
    assert.equal(poster[1], 0xd8);
    assert.equal((await stat(path.join(galleryDir, prefix + ".mp4"))).size, mp4.length);
  });
});
