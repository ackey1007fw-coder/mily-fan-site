import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import sharp from "sharp";
import { streamRecap20261012Night, streamRecaps } from "../src/data/streamRecaps.ts";
import { redhoodClips20261012 } from "../src/data/redhoodClips20261012.ts";
const evidence = JSON.parse(readFileSync("docs/REDHOOD-CLIPS-20261012.json", "utf8"));

test("approved five clips keep exact owner-approved media bytes and real covers", async () => {
  assert.equal(redhoodClips20261012.length, 5);
  for (const [i, c] of redhoodClips20261012.entries()) {
    const e = evidence.clips[i];
    assert.equal(c.id, e.id);
    assert.equal(c.width, 720); assert.equal(c.height, 1280);
    assert.equal(c.durationSeconds, [18,21,21,21,18][i]);
    const video = readFileSync("public" + c.src);
    const poster = readFileSync("public" + c.poster);
    assert.equal(video.length, e.bytes);
    assert.equal(createHash("sha256").update(video).digest("hex"), e.sha256);
    assert.equal(createHash("sha256").update(poster).digest("hex"), e.posterSha256);
    const m = await sharp(poster).metadata();
    assert.equal(m.width, 720); assert.equal(m.height, 1280);
    assert.ok(!m.exif);
    assert.ok(!Object.hasOwn(c, "sourceTimestamp"));
  }
});
test("five singing clips live only in this recap's existing song section", () => {
  const r = streamRecap20261012Night;
  assert.equal(r.songs.length,5); assert.equal(r.gallery.length,12);
  assert.equal(r.highlights.length,8); assert.equal(r.timeline.length,16);
  assert.deepEqual(r.songs.map(s => s.approvedClips?.length ?? 0), [0,2,1,1,1]);
  assert.deepEqual(r.songs.flatMap(s=>s.approvedClips??[]).map(c=>c.id),redhoodClips20261012.map(c=>c.id));
  assert.match(r.transcriptionNote,/承認済みの短い抜粋のみ掲載/);
  assert.match(r.transcriptionNote,/全編の手動実聴・逐語校正は未実施/);
  assert.ok(streamRecaps.filter(v=>v.id!==r.id).every(v=>(v.songs??[]).every(s=>!s.approvedClips)));
});
test("approved clips do not autoplay or fetch full videos before viewer interaction", () => {
  const ui=readFileSync("src/components/ApprovedSongClipList.tsx","utf8");
  assert.match(ui,/controls playsInline preload="none"/);
  assert.doesNotMatch(ui,/autoPlay|autoplay|iframe/);
  assert.match(ui,/video.pause/);
  assert.match(ui,/poster=\{clip.poster\}/);
  assert.match(ui,/object-contain/);
  assert.ok(ui.includes("data-src={clip.src}"));
  assert.ok(ui.includes("onClick={beginPlayback}"));
  assert.ok(!ui.includes("<source src={clip.src}"));
  const data=JSON.stringify(redhoodClips20261012);
  assert.doesNotMatch(data,/drive\.google|chatgpt\.site|user_id|viewer_id|ScreenRecording/i);
});
