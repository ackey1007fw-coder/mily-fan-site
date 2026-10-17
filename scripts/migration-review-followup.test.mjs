import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { streamRecap20260920Asa } from '../src/data/streamRecap20260920Asa.ts';
import { streamRecap20260922Night } from '../src/data/streamRecap20260922Night.ts';

test('9/20 talk uses the existing social delivery without duplicate local player', () => {
  const highlight = streamRecap20260920Asa.highlights.find(h => h.timestamp === '1:30:32');
  assert.equal(highlight.clip, undefined);
  assert.equal(highlight.socialClip.links.length, 4);
});

test('short excerpts do not contradict the full-recording disclosure', () => {
  assert.match(streamRecap20260922Night.transcriptionNote, /録音音声・画面録画の全編と全文文字起こしは掲載していません/);
  assert.match(streamRecap20260922Night.transcriptionNote, /短尺は原音を使ったファン編集/);
});

test('related links reuse the safe accessible external-link component', () => {
  const page = readFileSync(new URL('../src/ActivitiesPage.tsx', import.meta.url), 'utf8');
  assert.match(page, /highlight\.relatedLinks\.map\(\(link\) => <ExternalLink/);
  const component = readFileSync(new URL('../src/components/ExternalLink.tsx', import.meta.url), 'utf8');
  assert.match(component, /新しいタブで開きます/);
});
