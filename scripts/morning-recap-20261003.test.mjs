import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {streamRecap20261003Asa as recap} from '../src/data/streamRecap20261003Asa.ts';
import {streamRecaps} from '../src/data/streamRecaps.ts';
import {news} from '../src/data/news.ts';
import {verifyNews} from './content-invariants.mjs';
import {resolveNewsLinks} from '../src/lib/newsLinks.ts';

test('October 3 morning recap keeps source seconds aligned with reviewed ten stills',()=>{
 const manifest=JSON.parse(readFileSync('docs/MILY_MORNING_MEDIA_20261003.json'));
 assert.ok(streamRecaps.includes(recap));assert.equal(recap.gallery.length,10);
 assert.equal(recap.highlights.length,8);assert.equal(recap.songs,undefined);
 const times=recap.gallery.map(photo=>{const file=photo.src.split('/').at(-1);const source=manifest.photos.find(x=>x.file===file);assert.ok(source.source_identical);assert.match(photo.caption,new RegExp(`^${Math.floor(source.source_seconds/3600)}:${String(Math.floor(source.source_seconds%3600/60)).padStart(2,'0')}:${String(source.source_seconds%60).padStart(2,'0')}`));return source.source_seconds;});
 assert.deepEqual(times,[...times].sort((a,b)=>a-b));
 assert.ok(!JSON.stringify(recap).includes('stream-review-ackey'));
 assert.ok(!JSON.stringify(recap).includes('gift-details'));
});

test('current morning NEWS leads to its recap while historical fixtures stay historical',()=>{
 const item=news.find(x=>x.id==='2026-10-03-morning-showroom-recap');
 assert.deepEqual(verifyNews([item]),[]);
 assert.equal(item.relatedUrl,'https://mily-fan-site.vercel.app/activities/live/#recap-'+recap.id);
 assert.match(item.body,/スクショ10枚/);assert.equal(item.media.src,recap.image.src);
 assert.equal(resolveNewsLinks(item,Date.parse('2026-10-03T09:00:00+09:00')).additionalCtas[0].url,'/support/');
 assert.ok(verifyNews([{...item,additionalCtas:[{label:'unconfirmed',url:'/unconfirmed/'}]}]).length>0);
});
