import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {streamRecap20261004Asa as recap} from '../src/data/streamRecap20261004Asa.ts';
import {streamRecaps} from '../src/data/streamRecaps.ts';
import {news} from '../src/data/news.ts';
import {verifyNews} from './content-invariants.mjs';
import {resolveNewsLinks} from '../src/lib/newsLinks.ts';

test('October 4 morning is linked without inventing the next slot, rank or gift count',()=>{
 assert.equal(streamRecaps[0],recap);assert.equal(recap.nextNote,'');assert.deepEqual(recap.ranking,[]);assert.equal(recap.songs,undefined);
 assert.match(recap.transcriptionNote,/手動聴取・逐語校正は未実施/);
 assert.match(recap.transcriptionNote,/時刻は復号音声・元録画の先頭/);
 assert.doesNotMatch(JSON.stringify(recap),/drive\.google|libfile_|C:\\|14:45|4818|5000|\.wav|\.mkv/);
});
test('morning news reaches the actual recap and uses the same representative frame',()=>{
 const item=news.find(x=>x.id==='2026-10-04-morning-showroom-recap');assert.deepEqual(verifyNews([item]),[]);
 assert.equal(item.media.src,recap.image.src);assert.equal(item.relatedUrl,'https://mily-fan-site.vercel.app/activities/live/#recap-'+recap.id);
 assert.equal(resolveNewsLinks(item,Date.parse('2026-10-04T14:00:00+09:00')).cta.url,item.relatedUrl);
});
test('all selected images are distinct real JPEGs with source-relative times',()=>{
 const manifest=JSON.parse(readFileSync('docs/MILY_MORNING_MEDIA_20261004.json','utf8'));
 assert.equal(new Set(recap.gallery.map(x=>x.src)).size,manifest.photos.length);
 for(const image of recap.gallery){const source=manifest.photos.find(x=>image.src.endsWith(x.file));assert.ok(source);const bytes=readFileSync('public'+image.src);assert.equal(bytes.length,source.bytes);assert.equal(bytes.readUInt16BE(0),0xffd8);assert.equal(image.width,640);assert.equal(image.height,360);}
 assert.equal(recap.image.src,recap.gallery[5].src);
});
