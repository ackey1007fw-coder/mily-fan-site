import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const expected = [
  ["heavyrotation", "0bf81e95d046ae76c271f6b589d4dac10c0cfc24", "9b21914fa3a8debc47f854f00466b3be11ea8cdc603da01782b26d4750c0ca87", 2503519, 18, "f63b7087f503d8fa442b820acfaa392260f9c156", "a4dead697b0d8d7ce541248effc9bbb8ee888025866813d37f0910f6a2ab5ee8"],
  ["waving", "34f4d4590047bc8b074090dd4728c02b0e149215", "e9d702ae2bb689828e6158f4e5ec7012a4b3f00b04d8398c0b4d80b969dc67fa", 2910991, 21, "d29195e21bcf2b8e3e7ea74e450a5fbe38d64bb8", "608a0fe9be4247b2797c1445f8d587c915e436aa0fe4affe0c11b297306307c4"],
  ["tokubetyu", "7bd1ff45a4f48120fc4a44dc2f2488eeea1d20db", "effa490a3dfa90ac962fc4d22f9e0d9ced38eb4e87cd1d2697bdcf057162e04d", 2572339, 21, "1f1be67e529d74de6e6b34dd19fb9f6cfa720159", "53ebd054d9ce1b9cda8b8f9e913436d06c70707773f79a89c2cc07ce0d5d276c"],
  ["mela", "0d68431d0868ee208a890325b167ab1f5953287a", "95ed00c79bcc0c89306479021eb31513ed79220c0fcf56c5b2116576bc65dc96", 2540711, 21, "b3220a70f9a2f198ec68b17cd0f15f2b540a6c14", "0e477e9bb0d1da06d1b66c2c46045fd184ce4b47b962d155d55449d492fe87be"],
  ["fansa", "9c33e169725970a7a1adb0f0c7364e2da4026920", "e75b835c9be652d6768df1130a2f64665f3eb79602278fb077be15eeb554381b", 2549900, 18, "b98ae2e36454bdeb06ecce8909e006d8674b0e6d", "a49434f12526c846cd40d57d94d086e60e6154be1a3b2940204df06bad9670f2"],
];
const sha256 = data => createHash("sha256").update(data).digest("hex");
const gitBlobSha = data => createHash("sha1").update(Buffer.from(`blob ${data.length}\0`)).update(data).digest("hex");

test("only the 2026-10-12 night report receives exactly five real Red Riding Hood shorts", () => {
  const recap = streamRecaps[0];
  assert.equal(recap.id, "2026-10-12-final-night-showroom");
  assert.equal(streamRecaps[1].id, "2026-10-12-asa-showroom");
  assert.equal(recap.shortClips?.length, 5);
  assert.equal(new Set(recap.shortClips.map(c => c.src)).size, 5);
  assert.equal(new Set(recap.shortClips.map(c => c.poster)).size, 5);
  assert.deepEqual(recap.shortClips.map(c => c.durationSeconds), [18,21,21,21,18]);
  assert.ok(recap.shortClips.every(c => c.width === 720 && c.height === 1280 && c.approximateClockLabel && c.detail));
  assert.ok(streamRecaps.slice(1).every(c => !c.shortClips?.length));
  assert.equal(recap.songs?.length, 5);
  assert.equal(recap.gallery?.length, 12);
});

test("all 10 published media assets exactly match the approved file hashes and source stills", async () => {
  const items = streamRecaps[0].shortClips;
  for (const [i,clip] of items.entries()) {
    const [label,videoBlob,videoHash,bytes,duration,coverBlob,coverHash]=expected[i];
    assert.match(clip.src, new RegExp(`/mily-b220-0${i+1}-20261012-.+-short\\.mp4$`));
    assert.match(clip.poster, new RegExp(`/mily-b220-0${i+1}-20261012-.+-cover\\.jpg$`));
    assert.ok(clip.downloadName.endsWith(".mp4"));
    const videoPath = path.join(root, "public", clip.src.slice(1));
    const coverPath = path.join(root, "public", clip.poster.slice(1));
    assert.ok(existsSync(videoPath),label+" video");
    assert.ok(existsSync(coverPath),label+" cover");
    const video = readFileSync(videoPath),cover = readFileSync(coverPath);
    assert.equal(video.length,bytes);
    assert.equal(sha256(video),videoHash);
    assert.equal(gitBlobSha(video),videoBlob);
    assert.equal(sha256(cover),coverHash);
    assert.equal(gitBlobSha(cover),coverBlob);
    assert.equal(cover[0],255);
    assert.equal(cover[1],216);
    const meta=await sharp(coverPath).metadata();
    assert.equal(meta.width,720);
    assert.equal(meta.height,1280);
    assert.equal(meta.format,"jpeg");
    assert.ok(!meta.exif,"No EXIF or geolocation should leak");
    assert.equal(clip.durationSeconds,duration);
  }
});

test("the existing LIVE STREAM player is safe, responsive, non-autoplay and separate from private logs", () => {
  const page=readFileSync(path.join(root,"src/ActivitiesPage.tsx"),"utf8");
  assert.match(page, /recap\.shortClips\.map/);
  assert.match(page, /controls\s+playsInline\s+preload="none"/);
  assert.match(page, /poster=\{short\.poster\}/);
  assert.match(page, /download=\{short\.downloadName\}/);
  assert.match(page, /aria-label=\{`みりぃの赤ずきんショート動画/);
  assert.doesNotMatch(page, /autoPlay/);
  const published=JSON.stringify(streamRecaps[0].shortClips);
  assert.doesNotMatch(published,/viewer_id|display_name|user_id|chatgpt\.site|drive\.google\.com|\.mkv|\.jsonl/i);
});
