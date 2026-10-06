import test from 'node:test';
import assert from 'node:assert/strict';
import { news, sortNewsByDateDesc } from '../src/data/news.ts';
import { selectActivityNews } from '../src/lib/activityContent.ts';
import { news as historicalNews } from './fixtures/news-before-b183.ts';

test('official event update reaches current NEWS and only MISS CIRCLE while historical records remain', () => {
  const id = '2026-10-07-fourth-round-official-update';
  const item = news.find(x => x.id === id);
  assert.ok(item);
  assert.equal(news.filter(x => x.id === id).length, 1);
  assert.equal(item.date, '2026-10-07');
  assert.equal(item.source, 'https://www.showroom-live.com/event/circle2026_4th');
  assert.equal(sortNewsByDateDesc(news)[0], item);
  assert.deepEqual(item.activityIds, ['miss-circle']);
  assert.ok(selectActivityNews('miss-circle', news).includes(item));
  assert.ok(!selectActivityNews('live-stream', news).includes(item));
  assert.equal(item.media, undefined);
  assert.equal(item.additionalMedia, undefined);
  assert.doesNotMatch(item.body, /出演確定|順位確定|別集計|JST/);
  assert.ok(!historicalNews.some(x => x.id === id));
  for (const old of historicalNews) assert.ok(news.includes(old), old.id);
});
