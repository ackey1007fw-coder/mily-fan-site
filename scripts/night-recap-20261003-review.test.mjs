import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { streamRecap20261003Night as recap } from '../src/data/streamRecap20261003Night.ts';

const manifest = JSON.parse(readFileSync('docs/MILY_NIGHT_MEDIA_20261003.json', 'utf8').replace(/^\uFEFF/, ''));
test('unverified next-slot text stays out of historical announcement while disclosure remains', () => {
  assert.equal(recap.nextNote, '');
  assert.match(recap.transcriptionNote, /全編手動聴取・逐語校正は未実施/);
  assert.match(recap.transcriptionNote, /翌日の時刻は確定掲載していません/);
  assert.equal(recap.songs, undefined);
});
test('b185 intake binds all published images to reviewed recording frames and approval scope', async () => {
  assert.equal(manifest.batch, 'b185');
  assert.equal(manifest.recap_id, recap.id);
  assert.equal(manifest.photos.length, 10);
  assert.equal(manifest.owner_approval.sns_posting, false);
  assert.equal(manifest.source.manual_audio_review, false);
  assert.ok(manifest.privacy_review.images_individually_reviewed);
  for (const key of ['viewer_names', 'viewer_comments', 'viewer_avatars', 'third_party_people', 'face_generation_or_correction', 'upscale']) assert.equal(manifest.privacy_review[key], false);
  const hashes = [];
  for (const [index, photo] of manifest.photos.entries()) {
    assert.equal(recap.gallery[index].src, `/media/live/${photo.file}`);
    const seconds = photo.source_seconds;
    const captionTime = `${Math.floor(seconds / 3600)}:${String(Math.floor(seconds % 3600 / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    assert.ok(recap.gallery[index].caption.startsWith(`${captionTime}｜`));
    assert.deepEqual(photo.source_size, [640, 360]);
    assert.deepEqual(photo.crop, [0, 0, 420, 360]);
    assert.deepEqual(photo.size, [420, 360]);
    assert.match(photo.visual_review, /checked/);
    const bytes = readFileSync(`public/media/live/${photo.file}`);
    const hash = createHash('sha256').update(bytes).digest('hex');
    assert.equal(hash, photo.sha256); hashes.push(hash);
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.width, 420); assert.equal(metadata.height, 360);
    for (const key of ['exif', 'iptc', 'xmp']) assert.equal(metadata[key], undefined);
  }
  assert.equal(new Set(hashes).size, 10);
});
test('retained b185 cover is inventoried and preserves the exact source photo pixels', async () => {
  const cover = manifest.cover;
  const bytes = readFileSync(`public/media/live/${cover.file}`);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), cover.sha256);
  const metadata = await sharp(bytes).metadata();
  assert.deepEqual([metadata.width, metadata.height], cover.size);
  for (const key of ['exif', 'iptc', 'xmp']) assert.equal(metadata[key], undefined);
  assert.equal(cover.source_photo, manifest.photos[9].file);
  const [left, top, right, bottom] = cover.photo_bounds;
  const region = await sharp(bytes).extract({ left, top, width: right - left, height: bottom - top }).removeAlpha().raw().toBuffer();
  const source = await sharp(readFileSync(`public/media/live/${cover.source_photo}`)).removeAlpha().raw().toBuffer();
  assert.deepEqual(region, source);
  assert.ok(cover.source_pixels_identical);
  assert.equal(cover.sns_posted, false);
  const mediaDoc = readFileSync('docs/MEDIA.md', 'utf8');
  assert.match(mediaDoc, /b185/); assert.match(mediaDoc, /MILY_NIGHT_MEDIA_20261003\.json/);
});
