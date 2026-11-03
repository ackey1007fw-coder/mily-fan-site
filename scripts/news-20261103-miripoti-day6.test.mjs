import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { news, sortNewsByDateDesc, newsDisplayMedia } from '../src/data/news.ts';
import { missCircleSemifinalWebVoteLink } from '../src/data/links.ts';
import { resolveNewsLinks } from '../src/lib/newsLinks.ts';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

test('2026-11-03 miripoti day 6 NEWS is a single sourced Latest item with owner-provided photos', () => {
  const items = news.filter((n) => n.id === '2026-11-03-x-miripoti-day6');
  assert.equal(items.length, 1);
  const item = items[0];
  assert.equal(item.date, '2026-11-03');
  assert.deepEqual(item.activityIds, ['miss-circle']);
  assert.match(item.title, /みりぽち/);
  // セミファイナル6日目・残り5日と、今年初みかんの写真2枚を本文に明記する。
  assert.match(item.body, /セミファイナルは6日目、残り5日です/);
  assert.match(item.body, /今年初のみかん🍊を頬のそばに持った自撮り写真2枚/);
  assert.match(item.body, /Web投票は11月8日まで、1日1票です/);
  // 出典は本人のX投稿（2026-11-03 0:00 JST）。
  assert.equal(item.source, 'https://x.com/Mily_chan36/status/2117270522547335564');
  assert.equal(item.sourceLabel, 'みりぃ本人のX投稿を見る（11月3日）');
  // CTAは公式ENTRY 734と既存のセミファイナルWEB投票リンクを再利用する。
  assert.deepEqual(
    item.additionalCtas?.map((c) => c.url),
    [
      'https://2026.misscircle.jp/entry/734',
      'https://liff.line.me/1656040756-GwmBkdPY/vote/misscircle2026/N/734',
    ],
  );
  // 写真はオーナー提供の2枚を自己ホストする（XメディアCDNのhotlinkはしない）。
  assert.equal(item.media?.kind, 'image');
  assert.equal(item.media?.src, '/media/news/mily-b250-01-20261103-first-mikan-classroom.jpg');
  assert.equal(item.media?.width, 1152);
  assert.equal(item.media?.height, 2048);
  assert.equal(item.additionalMedia?.length, 1);
  assert.equal(item.additionalMedia?.[0]?.src, '/media/news/mily-b250-02-20261103-first-mikan-wink.jpg');
  assert.equal(newsDisplayMedia(item).length, 2);
  for (const media of newsDisplayMedia(item)) {
    assert.equal(existsSync(path.join(root, 'public', media.src)), true, media.src);
    assert.doesNotMatch(media.src, /^https?:\/\//);
  }
  // 後日のNEWS追加で壊れないよう、この告知とそれ以前の記録で順序を確認する。
  assert.equal(sortNewsByDateDesc(news.filter(n => n.date < item.date || n.id === item.id))[0].id, item.id);
});

test('miripoti day 6 vote CTA uses the semifinal window', () => {
  const item = news.find(n => n.id === '2026-11-03-x-miripoti-day6');
  const start = Date.parse('2026-10-29T12:00:00+09:00');
  const end = Date.parse('2026-11-08T23:59:59.999+09:00');
  const vote = item.additionalCtas.find(cta => cta.url === missCircleSemifinalWebVoteLink.url);
  assert.equal(vote.linkId, missCircleSemifinalWebVoteLink.id);
  const urlsAt = now => resolveNewsLinks(item, now).additionalCtas.map(cta => cta.url);
  for (const now of [start, Date.parse('2026-11-03T00:00:00+09:00'), end]) {
    assert.deepEqual(urlsAt(now), item.additionalCtas.map(cta => cta.url));
  }
  for (const now of [start - 1, end + 1]) {
    assert.deepEqual(urlsAt(now), ['https://2026.misscircle.jp/entry/734']);
  }
});
