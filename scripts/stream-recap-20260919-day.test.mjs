import test from 'node:test';
import assert from 'node:assert/strict';
import { streamRecaps, streamRecap20260919Day } from '../src/data/streamRecaps.ts';

test('9/19昼は同日の朝より先に表示し、次枠の変更可能性を残す', () => {
  const day = streamRecap20260919Day;
  assert.equal(streamRecaps.filter((r) => r.id === day.id).length, 1);
  assert.ok(streamRecaps.indexOf(day) < streamRecaps.findIndex((r) => r.id === '2026-09-19-asa-showroom'));
  assert.match(day.nextNote, /配信時点/);
  assert.match(day.nextNote, /22:30/);
  assert.match(day.nextNote, /遅れる可能性/);
  assert.match(day.nextNote, /ファンルーム/);
  assert.equal(day.songs, undefined);
  assert.match(day.transcriptionNote, /全編の手動聴取ではありません/);
});
