import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import { streamRecaps } from '../src/data/streamRecaps.ts';

const recordings = [
  ['2026-10-01-morning-showroom', 3452.660, 178],
  ['2026-09-30-night-showroom', 15366.729, 177],
  ['2026-09-30-day-showroom', 3937.008, 176],
  ['2026-09-30-morning-showroom', 5952.768, 175],
];
const seconds = time => time.split(':').reduce((total, part) => total * 60 + Number(part), 0);

test('four separate recaps preserve recording bounds and five stills plus one scene per hour', () => {
  const recordingIds = recordings.map(([id]) => id);
  assert.deepEqual(streamRecaps.filter(recap => recordingIds.includes(recap.id)).map(recap => recap.id), recordingIds);
  const assets = new Set();
  for (const [id, duration, batch] of recordings) {
    const recap = streamRecaps.find(item => item.id === id);
    assert.ok(recap, id);
    const hours = Math.ceil(duration / 3600);
    assert.equal(recap.gallery.length, hours * 5);
    for (let hour = 0; hour < hours; hour++) {
      const images = recap.gallery.filter(image => image.galleryHour === hour);
      assert.equal(images.length, 5);
      for (const image of images) {
        const time = seconds(image.caption.split('｜')[0]);
        assert.ok(time >= hour * 3600 && time < Math.min((hour + 1) * 3600, duration));
        assert.ok(image.src.startsWith(`/media/live/mily-b${batch}-`));
        assert.ok(!assets.has(image.src), 'Do not reuse another recording’s still');
        assets.add(image.src);
      }
    }
    const clips = recap.highlights.flatMap(item => item.clip ? [item.clip] : []);
    assert.equal(clips.length, hours);
    assert.deepEqual(clips.map(clip => Math.floor(seconds(clip.sourceTimestamp) / 3600)), Array.from({ length: hours }, (_, hour) => hour));
    for (const clip of clips) {
      const start = seconds(clip.sourceTimestamp);
      assert.ok(clip.durationSeconds > 0 && start + clip.durationSeconds <= duration);
      assert.ok(clip.src.startsWith(`/media/live-clips/mily-b${batch}-`));
    }
    assert.ok(recap.transcriptionNote.includes('全編の手動聴取は行っておらず'));
    assert.match(recap.transcriptionNote, /最後(?:の|まで)/);
  }
  assert.equal(assets.size, 50);
});

test('each new recap ships decodable original-size JPEGs and faststart video assets', async () => {
  for (const [id] of recordings) {
    const recap = streamRecaps.find(item => item.id === id);
    for (const image of recap.gallery) {
      const bytes = await readFile(new URL('../public' + image.src, import.meta.url));
      const info = await sharp(bytes).metadata();
      assert.equal(info.format, 'jpeg');
      assert.equal(info.width, 640);
      assert.equal(info.height, 360);
      assert.equal(info.exif, undefined);
      assert.equal(info.iptc, undefined);
      assert.equal(info.xmp, undefined);
    }
    const zip = await readFile(new URL('../public' + recap.galleryZip.src, import.meta.url));
    assert.equal(zip.subarray(0, 2).toString(), 'PK');
    for (const image of recap.gallery) assert.ok(zip.includes(Buffer.from(image.downloadName)));
    for (const clip of recap.highlights.flatMap(item => item.clip ? [item.clip] : [])) {
      const bytes = await readFile(new URL('../public' + clip.src, import.meta.url));
      assert.equal(bytes.subarray(4, 8).toString(), 'ftyp');
      const moov = bytes.indexOf(Buffer.from('moov'));
      const mdat = bytes.indexOf(Buffer.from('mdat'));
      assert.ok(moov > 0 && mdat > moov);
      const poster = await sharp(await readFile(new URL('../public' + clip.poster, import.meta.url))).metadata();
      assert.equal(poster.width, 640);
      assert.equal(poster.height, 360);
    }
  }
});
