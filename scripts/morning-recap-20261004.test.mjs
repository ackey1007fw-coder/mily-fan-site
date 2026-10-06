import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {streamRecap20261004Asa as recap} from '../src/data/streamRecap20261004Asa.ts';
import {streamRecaps} from '../src/data/streamRecaps.ts';
import {news} from '../src/data/news.ts';
import {verifyNews} from './content-invariants.mjs';
import {resolveNewsLinks} from '../src/lib/newsLinks.ts';
import {selectActivityMedia} from '../src/lib/activityMedia.ts';
import {selectActivityNews} from '../src/lib/activityContent.ts';

test('October 4 morning is linked without inventing the next slot, rank or gift count',()=>{
 assert.equal(streamRecaps.find(item=>item.id===recap.id),recap);assert.equal(recap.nextNote,'');assert.deepEqual(recap.ranking,[]);assert.equal(recap.songs,undefined);
 assert.match(recap.transcriptionNote,/手動聴取・逐語校正は未実施/);
 assert.match(recap.transcriptionNote,/時刻は復号音声・元録画の先頭/);
 assert.doesNotMatch(JSON.stringify(recap),/drive\.google|libfile_|C:\\|14:45|4818|5000|\.wav|\.mkv/);
});
test('recording start is not presented as the confirmed broadcast start',()=>{
 assert.equal(recap.broadcastLabel,'録画開始5:55頃〜 約44分');
 assert.match(recap.transcriptionNote,/配信の実開始時刻は未確認/);
 assert.match(recap.transcriptionNote,/約44分も保存録画の長さ/);
});
test('morning photo stays in accepted surfaces while miss-circle NEWS relation remains',()=>{
 const item=news.find(x=>x.id==='2026-10-04-morning-showroom-recap');
 assert.equal(selectActivityNews('miss-circle').length,3);
 assert.ok(selectActivityNews('miss-circle',news,news.length).some(x=>x.id===item.id));
 const sources={newsItems:[item],storyItems:[]};
 assert.ok(selectActivityMedia('live-stream',sources).some(x=>x.src===item.media.src));
 for(const id of ['miss-circle','radio','campus-girls'])assert.ok(!selectActivityMedia(id,sources).some(x=>x.src===item.media.src));
 assert.equal(item.media.src,recap.image.src);
 const legacy={...item};delete legacy.activityMediaIds;
 assert.ok(selectActivityMedia('miss-circle',{newsItems:[legacy],storyItems:[]}).some(x=>x.src===item.media.src));
});
test('morning news reaches the actual recap and uses the same representative frame',()=>{
 const item=news.find(x=>x.id==='2026-10-04-morning-showroom-recap');assert.deepEqual(verifyNews([item]),[]);
 assert.equal(item.media.src,recap.image.src);assert.equal(item.relatedUrl,'https://mily-fan-site.vercel.app/activities/live/#recap-'+recap.id);
 assert.equal(resolveNewsLinks(item,Date.parse('2026-10-04T14:00:00+09:00')).cta.url,item.relatedUrl);
});
test('all selected images are distinct real JPEGs with source-relative times',()=>{
 const manifest=JSON.parse(readFileSync('docs/MILY_MORNING_MEDIA_20261004.json','utf8'));
 assert.equal(new Set(recap.gallery.map(x=>x.src)).size,manifest.photos.length);
 for(const image of recap.gallery){const source=manifest.photos.find(x=>image.src.endsWith(x.file));assert.ok(source);const bytes=readFileSync('public'+image.src);assert.equal(bytes.length,source.bytes);assert.equal(bytes.readUInt16BE(0),0xffd8);assert.equal(image.width,source.width);assert.equal(image.height,source.height);}
 assert.equal(recap.image.src,recap.gallery[1].src);
});
