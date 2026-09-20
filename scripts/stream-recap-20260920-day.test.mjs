import test from 'node:test';
import assert from 'node:assert/strict';
import { streamRecaps, streamRecap20260920Day } from '../src/data/streamRecaps.ts';

test('9/20昼レポートを最新枠として1件だけ掲載する', () => {
  const recap = streamRecap20260920Day;
  assert.equal(streamRecaps.filter((r) => r.id === recap.id).length, 1);
  assert.equal(streamRecaps[0], recap);
  assert.equal(recap.date, '2026-09-20');
  assert.equal(recap.broadcastLabel, '14:41頃〜 約64分');
});

test('9/20昼は実フレーム10枚とZIPだけを公開し、全文や非公開IDを出さない', () => {
  const recap = streamRecap20260920Day;
  assert.equal(recap.gallery?.length, 10);
  assert.equal(recap.galleryZip?.src, '/media/live/mily-b136-afternoon-stills.zip');
  assert.ok(recap.gallery?.every((image) => image.width === 640 && image.height === 360));
  assert.ok(recap.gallery?.every((image) => image.src.startsWith('/media/live/mily-b136-')));
  const publicText = JSON.stringify(recap);
  assert.doesNotMatch(publicText, /live\d{6,}|PL[A-Za-z0-9_-]{10,}|C:\\\\Users\\\\/);
});

test('9/20昼の歌唱曲は自動認識だけでは曲名一覧へ追加しない', () => {
  const recap = streamRecap20260920Day;
  assert.equal(recap.songs?.length, 1);
  assert.equal(recap.songs?.[0]?.title, '生まれてはじめて');
  assert.equal(recap.songs?.[0]?.timestamp, '0:56:41');
  assert.match(recap.transcriptionNote, /1,347区間/);
  assert.match(recap.transcriptionNote, /全編の手動聴取・逐語校正ではありません/);
  assert.match(recap.transcriptionNote, /別モデルでも歌詞断片を照合/);
  assert.match(recap.transcriptionNote, /権利確認を別ゲート/);
  assert.match(recap.nextNote, /配信時点/);
  assert.match(recap.nextNote, /夜にも配信する予定/);
});


test('9/20昼のトーク短尺2本から4媒体へ案内する', () => {
  const clips = streamRecap20260920Day.highlights
    .map((item) => item.socialClip)
    .filter(Boolean);
  assert.equal(clips.length, 2);
  for (const clip of clips) {
    assert.equal(clip.links.length, 4);
    assert.deepEqual(new Set(clip.links.map((link) => link.platform)), new Set(['youtube', 'tiktok', 'instagram', 'x']));
  }
});
