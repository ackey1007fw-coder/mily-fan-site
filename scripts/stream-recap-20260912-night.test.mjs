import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { it } from 'node:test';
import sharp from 'sharp';
import { streamRecaps, streamRecap20260912Yoru } from '../src/data/streamRecaps.ts';
import { RANKING_NOTE } from '../src/data/streamRecapRules.ts';
import { withoutApprovedSongLinks } from './approved-song-links.mjs';
const recap = streamRecap20260912Yoru;
const seconds = value => value.split(':').map(Number).reduce((n, v) => n * 60 + v, 0);

it('registers September 12 night once, after the later September 13 morning and before September 12 morning', () => {
  assert.equal(streamRecaps.filter(r => r.id === recap.id).length, 1);
  const index = streamRecaps.indexOf(recap);
  assert.ok(index > streamRecaps.findIndex(r => r.id === '2026-09-13-asa-showroom'));
  assert.ok(index < streamRecaps.findIndex(r => r.id === '2026-09-12-asa-showroom'));
  assert.equal(recap.dateLabel, '2026.09.12（土）');
  assert.equal(recap.broadcastLabel, '20:40頃〜 約133分');
});

it('records eight performed songs in order without converting requests or brief references into performances', () => {
  assert.deepEqual(recap.songs.map(s => s.title), ['明日はきっといい日になる','ちっぽけな勇気','かわいいだけじゃだめですか？','生まれてはじめて','ケセラセラ','超最強','明日も','ありがとう']);
  assert.deepEqual(recap.songs.map(s => s.timestamp), ['0:09:01','0:22:21','0:32:56','0:52:22','0:59:01','1:15:53','1:22:13','1:34:08']);
  assert.ok(recap.songs.every((s, i, a) => i === 0 || seconds(s.timestamp) > seconds(a[i-1].timestamp)));
  assert.ok(recap.songs.every(s => withoutApprovedSongLinks(s.youtubeUrl) === '[approved song link]'));
  assert.match(recap.songs[0].youtubeVersionNote, /Short size/);
  assert.equal(recap.songs[1].youtubeUrl, 'https://www.youtube.com/watch?v=FKXBSuN-nQo');
  assert.equal(recap.songs[7].youtubeUrl, 'https://www.youtube.com/watch?v=VZBU8LvZ91Q');
});

it('keeps avatar achievement separate from the not-yet-announced contest result', () => {
  assert.deepEqual(recap.goals.find(g => g.item === 'アバター権'), { item:'アバター権',target:'獲得',statusThen:'達成を報告' });
  assert.equal(recap.goals.find(g => g.item === '三次審査').statusThen, '結果待ち');
  assert.match(recap.summary, /通過は結果待ち/);
  assert.deepEqual(recap.ranking, [RANKING_NOTE]);
});

it('publishes ten owner-approved real-frame stills and keeps karaoke excerpts unpublished', async () => {
  assert.equal(recap.gallery.length, 10);
  assert.equal(recap.image, recap.gallery[4]);
  assert.equal(recap.galleryZip.label, '10枚まとめて保存');
  assert.equal(new Set(recap.gallery.map(({ src }) => src)).size, 10);
  for (const still of recap.gallery) {
    assert.match(still.src, /\/mily-b113-/);
    const file = new URL(`../public${still.src}`, import.meta.url);
    const meta = await sharp(await readFile(file)).metadata();
    assert.equal(meta.width, 640);
    assert.equal(meta.height, 360);
    for (const field of ['exif','xmp','iptc']) assert.equal(meta[field], undefined);
    assert.ok(still.alt?.includes('みりぃ'));
    assert.ok(still.caption && still.downloadName);
  }
  const zip = await readFile(new URL(`../public${recap.galleryZip.src}`, import.meta.url));
  assert.equal(zip.readUInt32LE(0), 0x04034b50);
  for (const still of recap.gallery) assert.ok(zip.includes(Buffer.from(still.src.split('/').pop())));
  assert.ok(recap.songs.every(s => s.clip === undefined));
  assert.match(recap.transcriptionNote, /実フレーム10枚/);
  assert.match(recap.transcriptionNote, /歌唱動画は利用条件確認/);
});

it('distinguishes reconstructed recording positions, event deadline and historical next-slot notice', () => {
  assert.match(recap.transcriptionNote, /21:59はSHOWROOM審査の締切で、配信終了時刻ではありません/);
  assert.match(recap.transcriptionNote, /統合記録の先頭/);
  assert.match(recap.transcriptionNote, /全編手動聴取.*未実施/);
  assert.match(recap.nextNote, /^配信時点では、翌9月13日6:00〜6:30/);
  assert.equal(recap.timeline.at(-1).timestamp, '2:12:16');
  assert.ok(recap.timeline.every((t,i,a) => i===0 || seconds(t.timestamp) >= seconds(a[i-1].timestamp)));
});

it('preserves the recap field limits and excludes private source references', () => {
  assert.ok(recap.theme.length <= 16 && recap.summary.length <= 140);
  assert.ok(recap.highlights.length <= 8 && recap.timeline.length <= 16 && recap.nextNote.length <= 120);
  for (const h of recap.highlights) assert.ok(h.title.length <= 20 && h.body.length <= 100);
  for (const t of recap.timeline) assert.ok(t.label.length <= 32);
  assert.doesNotMatch(withoutApprovedSongLinks(JSON.stringify(recap)), /drive\.google|C:\\|partial\.mkv|live234|原本ファイル名|sha256/i);
});
