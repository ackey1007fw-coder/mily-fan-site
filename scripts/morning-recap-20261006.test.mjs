import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { news } from "../src/data/news.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
test("October 6 morning recap retains reviewed photos and confines activity media", async () => {
 const r=streamRecaps.find(r=>r.id==="2026-10-06-morning-showroom");assert.ok(r);assert.equal(streamRecaps.filter(x=>x.id===r.id).length,1);assert.equal(r.gallery.length,3);
 const sha=["a74b518d520a8a3aeefa7fe05fb3495d141a0e10b564b801d99a2f30489963c0","298d6a63073b7de8229a28ed153b3fb5500613aeee003e53b45e0bb7281fd573","d7b5fac875e1b3081393ddb9dd816b75da92732893629987fe57104006fd0c0f"];
 for(const [i,p] of r.gallery.entries()){const b=await readFile(new URL('../public'+p.src,import.meta.url));assert.equal(createHash('sha256').update(b).digest('hex'),sha[i]);const m=await sharp(b).metadata();assert.equal(m.width,640);assert.equal(m.height,360);assert.equal(m.exif,undefined);assert.equal(m.xmp,undefined);assert.doesNotMatch(p.caption,/歌唱中|投票のお礼を言う|心強/);}
 assert.equal(r.image.src,r.gallery[1].src);const n=news.find(n=>n.id==='2026-10-06-morning-showroom-recap');assert.ok(n);assert.equal(n.media.src,r.image.src);assert.ok(n.relatedUrl.endsWith('#recap-'+r.id));assert.deepEqual(n.activityMediaIds,['live-stream']);assert.ok(n.activityIds.includes('miss-circle'));assert.ok(selectActivityMedia('live-stream').some(m=>m.src===n.media.src));assert.ok(!selectActivityMedia('miss-circle').some(m=>m.src===n.media.src));
 const article=JSON.stringify(r.highlights);assert.doesNotMatch(article,/審査に関わ|総得票|心強|仲間にな|獲得しました|喉|鼻水|体温|薬|診断|保健室|オンライン授業|通学|キラ.{0,2}審査/);assert.doesNotMatch(JSON.stringify(r),/AppData|source-working-copy|live23517453/);assert.deepEqual(r.goals,[]);assert.deepEqual(r.ranking,[]);assert.match(r.transcriptionNote,/全文の実音聴取・逐語校正は未完了/);
});
