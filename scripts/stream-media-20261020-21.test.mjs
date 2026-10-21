import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { streamRecaps } from '../src/data/streamRecaps.ts';
import { validateReportMedia } from './social-report-quality.mjs';
const manifest = JSON.parse(readFileSync('scripts/stream-media-20261020-21.json', 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
test('Oct 20-21: four unique streams retain their own approved photos, talk and formal covers', async () => {
 assert.equal(manifest.groups.length, 4);
 assert.equal(new Set(manifest.groups.map(g => g.recapId)).size, 4);
 const allFiles = [];
 for (const group of manifest.groups) {
  const recap = streamRecaps.find(r => r.id === group.recapId);
  assert.ok(recap); assert.equal(recap.date, group.date);
  assert.equal(recap.gallery.length, 5);
  assert.equal(recap.image, recap.gallery[group.representative - 1]);
  const clips = recap.highlights.flatMap(h => h.clip ? [h.clip] : []);
  assert.equal(clips.length, 1); assert.ok(clips[0].durationSeconds <= 30);
  assert.deepEqual([clips[0].width, clips[0].height], [720, 1280]);
  assert.match(recap.transcriptionNote, /先頭0.3秒/);
  assert.match(recap.transcriptionNote, /手動聴取/);
  const clipItem = group.files.find(f => f.role === 'talk');
  const stillItems = group.files.filter(f => f.role === 'still');
  assert.deepEqual(recap.gallery.map(image => image.src), stillItems.map(file => '/media/live/' + file.name));
  assert.equal(clips[0].poster, '/media/live/' + group.files.find(f => f.role === 'talk-cover').name);
  assert.equal(clips[0].src, '/media/live/' + clipItem.name);
  assert.equal(clips[0].durationSeconds, clipItem.durationSeconds);
  for (const file of group.files) {
   const bytes = readFileSync('public/media/live/' + file.name);
   assert.equal(hash(bytes), file.sha256, file.name);
   assert.ok(!allFiles.includes(file.name)); allFiles.push(file.name);
   if (file.name.endsWith('.png')) {
    const metadata = await sharp(bytes).metadata();
    assert.deepEqual([metadata.width, metadata.height], [file.width, file.height]);
    assert.ok(!metadata.exif && !metadata.iptc && !metadata.xmp);
   }
  }
  const carousel = JSON.parse(readFileSync('scripts/social-report-media-' + group.code + '.json','utf8'));
  assert.equal(carousel.order.length,6);
  await validateReportMedia(carousel,{ root: process.cwd(), recaps: streamRecaps });
 }
 assert.equal(allFiles.length,52);
 assert.equal(streamRecaps[0].id, '2026-10-21-noon-showroom');
});
