import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {streamRecaps} from '../src/data/streamRecaps.ts';
import {recapSourceDisclosure} from '../src/lib/recapSourceDisclosure.ts';

test('October 28 semifinal-eve memo is separate from the morning and previous night',()=>{
  const id='2026-10-28-night-showroom';
  const matches=streamRecaps.filter(item=>item.id===id);
  assert.equal(matches.length,1);
  const recap=matches[0];
  const position=streamRecaps.indexOf(recap);
  const morning=streamRecaps.findIndex(item=>item.id==='2026-10-28-morning-showroom');
  const previous=streamRecaps.findIndex(item=>item.id==='2026-10-27-night-showroom');
  assert.ok(position>=0 && morning>position && previous>morning);
  assert.equal(recap.date,'2026-10-28');
  assert.equal(recap.dateLabel,'2026.10.28（水）');
  assert.equal(recap.timestampBasis,'memo-clock');
  assert.equal(recap.broadcastLabel,'視聴メモ21:51頃〜（終了未確認）');
  assert.deepEqual(recap.timeline,[]);
  assert.deepEqual(recap.ranking,[]);
  assert.deepEqual(recap.goals,[]);
  assert.equal(recap.nextNote,'');
  for(const field of ['image','gallery','galleryZip','songs']) assert.equal(recap[field],undefined);
  assert.deepEqual(recap.highlights.map(item=>item.timestamp),['21:51頃','22:12頃','22:32頃','22:42頃','22:53頃']);
  assert.ok(recap.highlights.every(item=>!item.quote && !item.clip && !item.socialClip));
  assert.match(recap.highlights[3].body,/ファイナルに進みたい/);
  assert.equal(recap.sourceLabel,'2026年10月28日 夜のSHOWROOM配信（オーナーによる提供視聴メモ）');
  assert.match(recap.sourceLabel,/提供視聴メモ/);
  assert.match(recap.transcriptionNote,/21:41頃から21:51頃の内容は未確認/);
  assert.match(recap.transcriptionNote,/原音聴取・映像確認・ASR全文読解・逐語校正は未実施/);
  assert.match(recap.transcriptionNote,/計測定義が未確認/);
  assert.match(recap.transcriptionNote,/確定終値・総訪問数・実人数に転用していません/);
  assert.doesNotMatch(JSON.stringify(recap),/あっきー|アッキー|drive\.google|\.jsonl|C:\\\\Users|3人まで|12時から|8月1日/);
});

test('October 28 night has one matching verification-ledger record',()=>{
  const recap=streamRecaps.find(item=>item.id==='2026-10-28-night-showroom');
  assert.ok(recap);
  const ledger=JSON.parse(readFileSync(new URL('../docs/RECAP-VERIFICATION-LEDGER.json',import.meta.url),'utf8'));
  const records=ledger.filter(item=>item.id===recap.id);
  assert.equal(records.length,1);
  const record=records[0];
  assert.equal(record.source,recap.sourceLabel);
  assert.equal(record.verifiedAt,recap.verifiedAt);
  assert.equal(record.originalNote,recap.transcriptionNote);
  assert.deepEqual(record.display,recapSourceDisclosure(recap.sourceLabel,recap.transcriptionNote));
});
