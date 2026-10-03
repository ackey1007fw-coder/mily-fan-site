import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { streamRecaps } from '../src/data/streamRecaps.ts';
import { radioEpisodes } from '../src/data/radioEpisodes.ts';
import { recapSourceDisclosure, recapGalleryNote } from '../src/lib/recapSourceDisclosure.ts';
import { RECAP_FIGURES_NOTE } from '../src/data/streamRecapRules.ts';

test('historical figure scope survives even without a structured goals section', () => {
  const morning = streamRecaps.find(recap => recap.id === '2026-08-18-morning-showroom');
  assert.equal(morning.goals.length, 0);
  assert.match(morning.summary, /3000/);
  for (const recap of [...streamRecaps, ...radioEpisodes]) {
    if (recap.transcriptionNote.includes(RECAP_FIGURES_NOTE)) {
      assert.ok(recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote).verification.includes(RECAP_FIGURES_NOTE), recap.id);
    }
  }
});

test('caption summaries preserve YouTube provenance and do not invent saved material', () => {
  const youtube = streamRecaps.find(recap => recap.id === '2026-08-08-shinya-radio-0025');
  assert.match(recapSourceDisclosure(youtube.sourceLabel, youtube.transcriptionNote).material, /YouTubeの自動字幕/);
  for (const recap of [...streamRecaps, ...radioEpisodes]) {
    const first = recap.transcriptionNote.split('。')[0];
    if (/自動字幕/.test(first) && /YouTube/.test(`${first} ${recap.sourceLabel}`)) {
      const material = recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote).material;
      assert.match(material, /YouTubeの自動字幕/);
      assert.doesNotMatch(material, /保存された/);
    }
  }
  assert.match(recapSourceDisclosure('SHOWROOM', '保存済みの日本語自動字幕をもとに整理しています。').material, /保存された/);
  assert.equal(recapSourceDisclosure('SHOWROOM', '日本語自動字幕をもとに整理しています。').material, '自動字幕をもとにした要約です。');
});

test('all existing recap verification records are preserved in the operational ledger', () => {
  const ledger = JSON.parse(readFileSync('docs/RECAP-VERIFICATION-LEDGER.json', 'utf8'));
  for (const recap of [...streamRecaps, ...radioEpisodes]) {
    const record = ledger.find(item => item.id === recap.id);
    assert.ok(record, recap.id);
    assert.equal(record.originalNote, recap.transcriptionNote);
    assert.equal(record.source, recap.sourceLabel);
    assert.equal(record.verifiedAt, recap.verifiedAt);
    assert.deepEqual(record.display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
  }
});
test('source summaries distinguish video, reports, ASR and saved subtitles', () => {
  const summary = id => { const recap = streamRecaps.find(item => item.id === id); return recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote).material; };
  assert.match(summary('2026-10-03-night-showroom'), /自動文字起こし/);
  assert.match(summary('2026-09-02-morning-showroom'), /提供動画/);
  assert.doesNotMatch(summary('2026-09-02-morning-showroom'), /自動/);
  assert.match(summary('2026-08-12-asa-showroom'), /自動字幕/);
  const report = streamRecaps.find(item => item.transcriptionNote.startsWith('オーナー提供の配信レポート'));
  assert.match(recapSourceDisclosure(report.sourceLabel, report.transcriptionNote).material, /提供レポートと文字起こし抜粋/);
});
test('reliability details retain unlistened, confirmed short audio, split recordings and reused images', () => {
  const details = id => { const recap = [...streamRecaps, ...radioEpisodes].find(item => item.id === id); return recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote).verification.join(''); };
  assert.match(details('2026-10-03-night-showroom'), /全編手動聴取・逐語校正は未実施/);
  assert.match(details('2026-10-03-night-showroom'), /翌日の時刻は確定掲載していません/);
  assert.match(details('2026-10-03-asa-showroom'), /トーク短尺の原音はオーナー確認済み/);
  assert.match(details('2026-08-12-asa-showroom'), /最初の2本には保存字幕がない/);
  assert.match(details('2026-10-01-day-showroom'), /この回の録画から抽出したスクショではありません/);
  assert.match(details('2026-09-27-kawaii'), /全編を人手で逐語校正したものではありません/);
  assert.match(details('2026-09-13-solo-theme'), /今回の加筆では音声の手動聴取・全文校正は行っていません/);
  assert.doesNotMatch(details('2026-10-03-night-showroom'), /顔の生成|コメント画面も載せていません/);
  for (const recap of [...streamRecaps, ...radioEpisodes]) {
    const display = details(recap.id);
    for (const sentence of recap.transcriptionNote.split('。').slice(1)) {
      if (/未|不明|不確|欠|連続収録|ではありません|誤り/.test(sentence)) assert.ok(display.includes(sentence), `${recap.id}: ${sentence}`);
    }
  }
});
test('mixed-image gallery provenance survives while processing explanation moves out', () => {
  assert.match(recapGalleryNote('本人提供写真と当日録画の2枚です。顔の生成・補正は行っていません。', 2), /本人提供写真と当日録画/);
  assert.doesNotMatch(recapGalleryNote('この回の写真です。不要な背景を切り出しました。', 10), /切り出/);
  const component = readFileSync('src/components/RecapSourceInfo.tsx', 'utf8');
  assert.match(component, /<details/); assert.match(component, /出典・確認状況/);
  assert.doesNotMatch(component, /<details[^>]*\bopen[=\s>]/);
});
