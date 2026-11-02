import assert from 'node:assert/strict';
import { test } from 'node:test';
import { news, sortNewsByDateDesc } from '../src/data/news.ts';
import { missCircleWebVoteLink, missCircleSemifinalWebVoteLink } from '../src/data/links.ts';
import { resolveNewsLinks } from '../src/lib/newsLinks.ts';

test('2026-11-02 entry photo change NEWS is a single sourced Latest item', () => {
  const items = news.filter((n) => n.id === '2026-11-02-x-entry-photo-change');
  assert.equal(items.length, 1);
  const item = items[0];
  assert.equal(item.date, '2026-11-02');
  assert.deepEqual(item.activityIds, ['miss-circle']);
  assert.match(item.title, /投票ページの写真が変わりました/);
  // 新しい写真は本人のXアイコンと同じで、過去の写真が使われたことを本文に明記する。
  assert.match(item.body, /Xのアイコンと同じ写真/);
  assert.match(item.body, /前に撮ってもらった写真/);
  assert.match(item.body, /🍁を持っている人を探さないでね/);
  assert.match(item.body, /Web投票は11月8日まで、1日1票です/);
  // 出典は本人のX投稿、追加出典は本人のファンルーム。
  assert.equal(item.source, 'https://x.com/Mily_chan36/status/2117041571904577712');
  assert.deepEqual(
    item.additionalSources?.map((s) => s.url),
    ['https://www.showroom-live.com/room/fan_club?room_id=573253'],
  );
  // CTAは公式ENTRY 734と既存のWEB投票リンクを再利用する。
  assert.deepEqual(
    item.additionalCtas?.map((c) => c.url),
    [
      'https://2026.misscircle.jp/entry/734',
      'https://liff.line.me/1656040756-GwmBkdPY/vote/misscircle2026/N/734',
    ],
  );
  // 写真は添付しない（X/Instagram画像の転載・自動取得をしない）。
  assert.equal(item.media, undefined);
  // 後日のNEWS追加で壊れないよう、この告知とそれ以前の記録で順序を確認する。
  assert.equal(sortNewsByDateDesc(news.filter(n => n.date < item.date || n.id === item.id))[0].id, item.id);
});

test('photo notice uses the semifinal window while old NEWS retains its original expiry', () => {
  const item = news.find(n => n.id === '2026-11-02-x-entry-photo-change');
  const start = Date.parse('2026-10-29T12:00:00+09:00');
  const end = Date.parse('2026-11-08T23:59:59.999+09:00');
  const vote = item.additionalCtas.find(cta => cta.url === missCircleSemifinalWebVoteLink.url);
  assert.equal(vote.linkId, missCircleSemifinalWebVoteLink.id);
  const urlsAt = now => resolveNewsLinks(item, now).additionalCtas.map(cta => cta.url);
  for (const now of [start, Date.parse('2026-11-02T18:50:00+09:00'), end]) {
    assert.deepEqual(urlsAt(now), item.additionalCtas.map(cta => cta.url));
  }
  for (const now of [start - 1, end + 1]) {
    assert.deepEqual(urlsAt(now), ['https://2026.misscircle.jp/entry/734']);
  }
  const legacy = { ...item, additionalCtas: [{ label: missCircleWebVoteLink.label, url: missCircleWebVoteLink.url }] };
  assert.deepEqual(resolveNewsLinks(legacy, Date.parse('2026-11-02T18:50:00+09:00')), {});
  for (const cta of [{ ...vote, linkId: 'unknown-link' }, { ...vote, url: 'https://example.com/invalid' }]) {
    assert.deepEqual(resolveNewsLinks({ ...item, additionalCtas: [cta] }, start), {});
  }
});
