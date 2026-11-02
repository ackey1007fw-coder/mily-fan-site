import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { streamRecap20261025Asa as recap, morning20261025Gallery as gallery } from '../src/data/streamRecap20261025Asa.ts';
import { validateReportMedia } from './social-report-quality.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFileSync(new URL('../'+p,import.meta.url));
const approved=JSON.parse(read('scripts/mily-morning-20261025-approved-media.json'));
const manifest=JSON.parse(read('scripts/social-report-media-20261025-morning.json'));
test('10/25 approved photos: exact six images, representative 02, real metadata and bytes',async()=>{
 assert.equal(gallery.length,6);assert.equal(recap.image,gallery[1]);assert.equal(approved.representativeNumber,2);
 assert.equal(approved.faceEdited,false);assert.equal(approved.originalAudioClipsPublished,false);
 for(let i=0;i<gallery.length;i++){const item=gallery[i], record=approved.images[i];assert.equal(item.src,record.path);const bytes=read('public'+item.src);const info=await sharp(bytes).metadata();assert.equal(info.width,640);assert.equal(info.height,360);assert.equal(info.exif,undefined);assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256);assert.ok(item.alt);assert.ok(item.downloadName);}
 assert.equal(recap.galleryZip.src,approved.photosZip);assert.ok(read('public'+approved.photosZip).length>0);
 assert.ok(recap.highlights.some(x=>x.timestamp==='0:55:10'&&x.title==='朝のスクショタイム'));
 assert.ok(recap.highlights.every(x=>!x.clip));
});
test('10/25 Instagram cover: full approved photo pixels, complete seven-card order, grid safety',async()=>{
 await validateReportMedia(manifest,{root,recaps:[recap]});
 assert.equal(manifest.order.length,7);assert.equal(manifest.items[0].source,gallery[1].src);
 assert.deepEqual(manifest.items.slice(1).map(x=>x.source),gallery.map(x=>x.src));
});
test('10/25 lab: same six images, no stale non-publication claim, original metrics unchanged',()=>{
 const report=read('data-lab/reports/20261025-morning/index.html').toString();
 const data=JSON.parse(read('public/data-lab/data/mily-morning-20261025-aggregate.json'));
 assert.equal((report.match(/<figure>/g)||[]).length,6);for(const photo of gallery)assert.ok(report.includes(photo.src));
 assert.ok(report.indexOf(gallery[1].src)<report.indexOf(gallery[0].src));
 assert.ok(report.includes(recap.galleryZip.src));assert.equal(data.recap.publishedStills,6);
 assert.equal(data.metrics.stars,3767);assert.equal(data.metrics.visits,665);assert.equal(data.metrics.comments,553);assert.equal(data.observations.length,13);
 assert.equal(data.finalServiceValueVerified,false);assert.doesNotMatch(report,/録画・音声・全文文字起こし・写真は転載していません/);
});
