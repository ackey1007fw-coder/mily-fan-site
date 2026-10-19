import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const entries = [
  {"filename": "mily-b229-01-night-smile-greeting-00075s.jpg", "sha256": "882c8dbffacd19feac4716a79aa2afddb86f0e0a87130a617332f34804d08408", "bytes": 24771, "time": "0:01:15", "seq": 1},
  {"filename": "mily-b229-02-night-both-hands-wave-01101s.jpg", "sha256": "d9bb24a18c0931a9cf73703720afada65992a95cad3463788a7e48eb5cc5b089", "bytes": 25034, "time": "0:18:21", "seq": 2},
  {"filename": "mily-b229-03-night-side-smile-01275s.jpg", "sha256": "b27d17aabbb4f9c46725b49a1d5b41797178db61118b885a842963f2947c2d5f", "bytes": 30122, "time": "0:21:15", "seq": 3},
  {"filename": "mily-b229-04-night-farewell-wave-02923s.jpg", "sha256": "d79d1fc9c206041fe3f8800b87664103e3636ca3fe6a907d3402a51baf37a9ca", "bytes": 25302, "time": "0:48:43", "seq": 4},
  {"filename": "mily-b229-05-morning-overhead-heart-early-01425s.jpg", "sha256": "5e2187db61f328efd3bfbe22884f785a3366cc61ad7bdd9bf2d141c68b391042", "bytes": 42432, "time": "0:23:45", "seq": 5},
  {"filename": "mily-b229-06-morning-bright-smile-02148s.jpg", "sha256": "64e3c5ad04e35eb7551510ccf1e12cc0001e7123cb3b907b6a65dde2c4505b32", "bytes": 29151, "time": "0:35:48", "seq": 6},
  {"filename": "mily-b229-07-morning-hair-up-pose-02184s.jpg", "sha256": "332420ffd5a86bf5b0e9a872c007ad10027b1a16a45e1c96b8ce44ac03414157", "bytes": 45278, "time": "0:36:24", "seq": 7},
  {"filename": "mily-b229-08-morning-close-up-smile-02504s.jpg", "sha256": "3a61da82725407766dabf9c50985d3df78e9bebf1df5b065470ffe9836b7f0e5", "bytes": 33353, "time": "0:41:44", "seq": 8},
  {"filename": "mily-b229-09-morning-small-hand-heart-02762s.jpg", "sha256": "8191c5678d5d8cbe1a82d47bc75e1b75e2ae26209bb818627ef7b3d7cd0499ed", "bytes": 30197, "time": "0:46:02", "seq": 9},
  {"filename": "mily-b229-10-morning-overhead-heart-02882s.jpg", "sha256": "fba2b660a8220388218298b5e0b711bdf7e96433a35b987b5f926d693f095ca8", "bytes": 44657, "time": "0:48:02", "seq": 10},
  {"filename": "mily-b229-11-morning-large-hand-heart-02942s.jpg", "sha256": "4153264d6b9d8e32aa9c80835bc4e76e11afbd99d535663aee451497d50628ff", "bytes": 34830, "time": "0:49:02", "seq": 11},
  {"filename": "mily-b229-12-morning-happy-hands-03140s.jpg", "sha256": "ffb7e4e146421e713a08ef466fa80f51fd290eac9d3eb9356faa2604dc09b955", "bytes": 29492, "time": "0:52:20", "seq": 12},
];
const byId = {
  "2026-10-17-night-showroom": entries.slice(0, 4),
  "2026-10-18-morning-showroom": entries.slice(4),
};
test("exactly the 12 checked-in b229 derivatives are present, with no raw files or ZIP", async () => {
  const target = "public/media/live";
  const onDisk = readdirSync(target).filter((name) => name.startsWith("mily-b229-")).sort();
  assert.deepEqual(onDisk, entries.map((e) => e.filename).sort());
  for (const entry of entries) {
    const file = path.join(target, entry.filename);
    const b = readFileSync(file);
    assert.equal(b.length, entry.bytes, entry.filename);
    assert.equal(createHash("sha256").update(b).digest("hex"), entry.sha256);
    const metadata = await sharp(b).metadata();
    assert.equal(metadata.width, 640);
    assert.equal(metadata.height, 360);
    assert.equal(metadata.format, "jpeg");
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);
  }
});
test("night and morning link only their own photos, in recording-time order", () => {
  for (const [id, source] of Object.entries(byId)) {
    const recap = streamRecaps.find((r) => r.id === id);
    assert.ok(recap, id);
    assert.equal(recap.gallery.length, source.length);
    assert.ok(recap.gallery.every((g, i) => g.src === "/media/live/" + source[i].filename));
    assert.ok(recap.gallery.every((g, i) => g.downloadName === source[i].filename));
    assert.deepEqual(
      recap.gallery.map((g) => g.caption.split("｜")[0]),
      source.map((e) => e.time),
    );
    assert.ok(recap.gallery.every((g) => g.alt.includes("みりぃ")));
    assert.ok(recap.gallery.every((g) => !/視聴者|ランキング|名前/.test(g.alt + g.caption)));
    assert.match(recap.transcriptionNote, new RegExp("実フレーム" + source.length + "枚"));
    assert.match(recap.sourceLabel, /実フレーム/);
    assert.equal(recap.galleryZip, undefined);
  }
  assert.equal(streamRecaps.find((r) => r.id === "2026-10-18-morning-showroom").image.src, "/media/live/" + entries[10].filename);
  assert.equal(streamRecaps.find((r) => r.id === "2026-10-17-night-showroom").image.src, "/media/live/" + entries[0].filename);
  assert.equal(streamRecaps.find((r) => r.id === "2026-10-17-morning-showroom").id, "2026-10-17-morning-showroom");
});
