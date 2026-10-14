import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import sharp from "sharp";
const root = new URL("../public/media/live/", import.meta.url);
const pairs = [
  ["mily-b223-01-20261014-night-double-peace.mp4", "mily-b223-02-20261014-night-double-peace-cover.jpg"],
  ["mily-b223-03-20261014-night-heart.mp4", "mily-b223-04-20261014-night-heart-cover.jpg"],
];
test("October 14 night social videos and their matching official covers exist", async () => {
  for (const [clip, cover] of pairs) {
    const video = readFileSync(new URL(clip,root));
    assert.ok(video.length>200000,clip);
    assert.equal(video.toString("ascii",4,8),"ftyp");
    assert.ok(video.includes(Buffer.from("moov")),clip);
    const jpg=readFileSync(new URL(cover,root));
    const meta=await sharp(jpg).metadata();
    assert.equal(meta.width,720);
    assert.equal(meta.height,1280);
    assert.equal(meta.format,"jpeg");
    assert.equal(meta.exif,undefined);
  }
});
