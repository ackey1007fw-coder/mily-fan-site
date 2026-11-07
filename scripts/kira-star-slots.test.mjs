import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { KIRA_STAR_META, KIRA_STAR_SLOTS, formatKiraStars, kiraNote } from '../public/data-lab/assets/kira-star-slots.js';

const html = readFileSync(new URL('../data-lab/glitter/index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../public/data-lab/assets/glitter-progress.css', import.meta.url), 'utf8');
const js = readFileSync(new URL('../public/data-lab/assets/glitter-progress.js', import.meta.url), 'utf8');

test('kira slots keep unofficial max-in-log semantics and never treat missing as zero', () => {
  assert.equal(KIRA_STAR_META.unofficial, true);
  assert.equal(KIRA_STAR_META.notFinal, true);
  assert.equal(KIRA_STAR_META.notEventPoints, true);
  assert.equal(KIRA_STAR_META.notGlitterPoints, true);
  assert.equal(KIRA_STAR_META.missingIsZero, false);
  assert.equal(KIRA_STAR_SLOTS.length, 25);
  const byId = Object.fromEntries(KIRA_STAR_SLOTS.map((slot) => [slot.id, slot]));
  assert.equal(byId['2026-10-29-morning'].stars, 4665);
  assert.equal(byId['2026-10-29-noon'].stars, 4724);
  assert.equal(byId['2026-10-29-noon'].quality, 'reference');
  assert.equal(byId['2026-10-30-morning-1'].stars, 1898);
  assert.equal(byId['2026-10-30-morning-2'].stars, 961);
  assert.equal(byId['2026-11-02-noon'].note, '終了直前');
  assert.equal(byId['2026-11-03-noon'].stars, null);
  assert.equal(byId['2026-11-03-noon'].quality, 'missing');
  assert.equal(byId['2026-11-05-morning'].stars, 3564);
  assert.equal(byId['2026-11-05-night'].stars, 3313);
  assert.equal(byId['2026-11-06-morning'].stars, 4441);
  assert.equal(byId['2026-11-06-noon'].stars, 4824);
  assert.equal(byId['2026-11-06-night'].stars, 2691);
  assert.equal(byId['2026-11-07-morning'].stars, 5341);
  assert.equal(byId['2026-11-07-night'].stars, null);
  assert.equal(byId['2026-11-07-night'].note, '欠測');
  assert.equal(formatKiraStars(null), '欠測');
  assert.equal(formatKiraStars(5341), '5,341');
  assert.equal(kiraNote(byId['2026-11-07-night']), '欠測');
  assert.equal(kiraNote(byId['2026-11-03-noon']), '未取得');
  assert.equal(kiraNote(byId['2026-10-29-morning']), 'ログ上の最大');
  assert.ok(!KIRA_STAR_SLOTS.some((slot) => slot.quality === 'missing' && slot.stars === 0));
});

test('glitter page keeps kira stars on a separate unofficial board', () => {
  assert.match(html, /id="kira-stars"/);
  assert.match(html, /ルームの画面に出ていたきら星/);
  assert.match(html, /ログの中でいちばん大きかった数字/);
  assert.match(html, /最終値ではありません/);
  assert.match(html, /欠測で、0件だったわけではありません/);
  assert.match(html, /金グリッター週間ptとも別の数字/);
  assert.match(js, /fillKiraTable/);
  assert.match(css, /\.table-wrap\{overflow-x:auto/);
});
