import assert from 'node:assert/strict';
import {test} from 'node:test';
import {radioEpisode20261004 as recap} from '../src/data/radioEpisode20261004.ts';
import {radioEpisodes} from '../src/data/radioEpisodes.ts';
import {radioMusicEpisodes} from '../src/data/radioMusic.ts';
import {news} from '../src/data/news.ts';
import {readFileSync} from 'node:fs';

test('October 4 radio keeps unverified music, private messages and clips out of publication',()=>{
 assert.equal(radioEpisodes[0],recap);
 assert.equal(recap.nextEpisodeNote,'');
 assert.equal(radioMusicEpisodes.find(item=>item.id===recap.id),undefined);
 assert.match(recap.transcriptionNote,/全編の手動聴取・逐語校正は未実施/);
 assert.doesNotMatch(JSON.stringify(recap),/libfile_|drive\.google|\.ogg|\.flac|\.mp4|\.srt|C:\\|YouTube|youtube\.com/);
 assert.ok(recap.milyHighlights.every(item=>item.quote===undefined));
});
test('shop link belongs to program topic without attributing the introduction to Mily',()=>{
 const item=recap.timeline.find(item=>item.relatedLinks?.length);
 assert.equal(item.relatedLinks[0].url,'https://morisekken.handcrafted.jp/');
 assert.equal(recap.highlightsLabel,'番組の見どころ');
 const soap=recap.milyHighlights.find(item=>/石けん/.test(item.title));
 assert.ok(soap);
 assert.doesNotMatch(soap.body,/みりぃ|もこ|マナティ/);
 assert.match(recap.transcriptionNote,/紹介者は確定していません/);
 const page=readFileSync('src/ActivitiesPage.tsx','utf8');
 assert.match(page,/item\.relatedLinks\?\.map/);
 const entry=news.find(item=>item.id==='2026-10-04-radio-anniversary-recap');
 assert.equal(entry.relatedUrl,'https://mily-fan-site.vercel.app/activities/radio/#'+recap.id+'-mily-highlights');
 assert.equal(entry.media,undefined);
});

test('detailed October 4 recap covers the program and on-air letters without private material',()=>{
 assert.equal(recap.milyHighlights.length,16);
 assert.equal(recap.listenerMessages.length,5);
 assert.equal(recap.timeline.length,16);
 assert.deepEqual(recap.milyHighlights.map(item=>item.timestamp),recap.timeline.map(item=>item.timestamp));
 for(const topic of ['おめでとう','感謝','光','篠笛','防災','きっかけ']) {
  assert.ok(recap.milyHighlights.some(item=>(item.title+' '+item.body).includes(topic)),topic);
 }
 assert.match(recap.transcriptionNote,/放送内で紹介された内容を5つのまとまり/);
 assert.match(recap.transcriptionNote,/紹介総数や逐語表現を確定したものではありません/);
 assert.doesNotMatch(JSON.stringify([...recap.milyHighlights,...recap.listenerMessages]),/必須場面|現行候補|ASR|DM|大学名|Library|libfile_/);
 const page=readFileSync('src/ActivitiesPage.tsx','utf8');
 assert.match(page,/episode\.highlightsLabel \?\? "みりぃの見どころ"/);
});

test('anniversary topics, letters and timeline stay ordered within the program source range',()=>{
 const seconds=stamp=>stamp.split(':').reduce((value,part)=>value*60+Number(part),0);
 for(const items of [recap.milyHighlights,recap.listenerMessages,recap.timeline]) {
  assert.equal(new Set(items.map(item=>item.timestamp)).size,items.length,'No duplicate timestamps');
  for(const [index,item] of items.entries()) {
   assert.match(item.timestamp,/^\d+:[0-5]\d:[0-5]\d$/);
   const value=seconds(item.timestamp);
   assert.ok(value>=157&&value<=10843,'Exclude adjacent programs and station announcements');
   if(index>0)assert.ok(seconds(items[index-1].timestamp)<value,'Strict chronological order');
  }
 }
 assert.ok(recap.listenerMessages.every(item=>Object.keys(item).every(key=>['timestamp','title','body'].includes(key))));
 assert.doesNotMatch(JSON.stringify(recap.listenerMessages),/ラジオネーム|投稿者名|リスナー名|寝室|廊下|勤務|会社/);
});
