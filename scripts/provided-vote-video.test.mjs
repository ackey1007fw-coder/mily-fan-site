import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { providedVoteVideo } from "../src/data/providedVoteVideo.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { driveVideoView } from "../src/data/driveGallery.ts";
import { news } from "../src/data/news.ts";

test("provided vote video keeps unknown source dates and shares one asset across NEWS and Gallery", () => {
  const item = news.find(item => item.id === "2026-10-04-confirmed-vote-support-video");
  assert.equal(item.media, providedVoteVideo);
  assert.equal(galleryVideos.filter(item => item.id === providedVoteVideo.id).length, 1);
  assert.equal(galleryVideos.find(item => item.id === providedVoteVideo.id), providedVoteVideo);
  assert.equal(item.dateBasis, "confirmed-on");
  assert.equal(providedVoteVideo.sourceDate, null);
  assert.equal(providedVoteVideo.sourceUrl, null);
  assert.match(item.body, /撮影・投稿日時は未確認/);
  assert.match(item.body, /現在の日程を示すものではありません/);
  assert.equal(item.relatedUrl, "https://mily-fan-site.vercel.app/support/#vote-support-video");
  assert.doesNotMatch(JSON.stringify({ item, providedVoteVideo }), /drive\.google|libfile_|file_000|C:\\\\Users/);
});

test("published MP4 is the verified complete faststart derivative and uses a local actual-frame poster", async () => {
  const bytes = await readFile(new URL(`../public${providedVoteVideo.src}`, import.meta.url));
  assert.equal(bytes.length, 1540162);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), "37ecb6188db2e9aee486bb58f3fde1bbec027df956cbf0a45400ec6c46200e40");
  assert.equal(bytes.subarray(4, 8).toString("ascii"), "ftyp");
  assert.ok(bytes.indexOf(Buffer.from("moov")) < bytes.indexOf(Buffer.from("mdat")));
  const poster = await readFile(new URL(`../public${providedVoteVideo.poster}`, import.meta.url));
  assert.equal(poster.readUInt16BE(0), 0xffd8);
  const view = driveVideoView(providedVoteVideo).video;
  assert.equal(view.controls, true);
  assert.equal(view.playsInline, true);
  assert.equal(view.preload, "none");
  assert.equal(view.width, 512);
  assert.equal(view.height, 910);
  assert.equal("autoPlay" in view, false);
});
