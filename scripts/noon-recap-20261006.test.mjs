import test from 'node:test';
import assert from 'node:assert/strict';
import { streamRecaps } from '../src/data/streamRecaps.ts';
import { news } from '../src/data/news.ts';
import { RANKING_NOTE_WITHOUT_RANGE } from '../src/data/streamRecapRules.ts';
test('October 6 noon retains text-only recap and directs latest news to its archive',()=>{
const r=streamRecaps.find(r=>r.id==='2026-10-06-noon-showroom');assert.ok(r);assert.equal(streamRecaps.filter(x=>x.id===r.id).length,1);assert.ok(streamRecaps.indexOf(r)<streamRecaps.findIndex(x=>x.id==='2026-10-06-morning-showroom'));assert.equal(r.image,undefined);assert.ok(!r.gallery?.length);assert.ok(!r.songs?.length);assert.equal(r.highlights.length,7);assert.deepEqual(r.ranking,[RANKING_NOTE_WITHOUT_RANGE]);assert.deepEqual(r.goals,[]);assert.match(r.summary,/保存録画は約42分/);assert.match(r.transcriptionNote,/30秒・21分・40分付近は黒画面/);assert.match(r.transcriptionNote,/配信全体の尺ではありません/);assert.doesNotMatch(JSON.stringify(r),/AppData|source-working-copy|live23518525|微熱|体温|薬|大学|合計で30万|全編.*ラジオ/);const n=news.find(x=>x.id==='2026-10-06-noon-showroom-recap');assert.ok(n);assert.equal(n.media,undefined);assert.equal(n.additionalMedia,undefined);assert.ok(n.relatedUrl.endsWith('#recap-'+r.id));assert.equal(n.ctaLabel,'昼の配信まとめを見る');
});
