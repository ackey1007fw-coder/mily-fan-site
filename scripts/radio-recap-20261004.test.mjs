import assert from 'node:assert/strict';
import {test} from 'node:test';
import {radioEpisode20261004 as recap} from '../src/data/radioEpisode20261004.ts';
import {radioEpisodes} from '../src/data/radioEpisodes.ts';
import {radioMusicEpisodes} from '../src/data/radioMusic.ts';
import {news} from '../src/data/news.ts';
import {readFileSync} from 'node:fs';

test('October 4 radio keeps unverified music, private messages and clips out of publication',()=>{
 assert.equal(radioEpisodes[0],recap);
 assert.ok(recap.listenerMessages.length > 0);assert.equal(recap.nextEpisodeNote,'');
 assert.equal(radioMusicEpisodes.find(item=>item.id===recap.id),undefined);
 assert.match(recap.transcriptionNote,/全編の手動聴取・逐語校正は未実施/);
 assert.doesNotMatch(JSON.stringify(recap),/libfile_|drive\.google|\.ogg|\.flac|\.mp4|\.srt|C:\\|YouTube|youtube\.com/);
 assert.ok(recap.milyHighlights.every(item=>item.quote===undefined));
});
test('anniversary follow-up covers distinct program topics and anonymous on-air messages in order',()=>{
 const text=recap.milyHighlights.map(item=>item.title+' '+item.body).join('\n');
 for(const topic of ['番組の始まり','研修','妄想会議','目指せアクター','休み時間','防災フェア','篠笛','胸キュン選手権','今日の一句','エンディング']) assert.ok(text.includes(topic),topic);
 const seconds=stamp=>stamp.split(':').reduce((value,part)=>value*60+Number(part),0);
 for(const items of [recap.milyHighlights,recap.listenerMessages,recap.timeline]) {
  assert.equal(new Set(items.map(item=>item.timestamp)).size,items.length);
  assert.ok(items.every((item,index)=>index===0||seconds(items[index-1].timestamp)<seconds(item.timestamp)));
  assert.ok(items.every(item=>seconds(item.timestamp)>=157&&seconds(item.timestamp)<=10843));
 }
 assert.match(recap.transcriptionNote,/原音実聴による全件確認ではありません/);
 assert.ok(recap.listenerMessages.every(item=>Object.keys(item).every(key=>['timestamp','title','body'].includes(key))));
 assert.doesNotMatch(JSON.stringify(recap.listenerMessages),/ラジオネーム|投稿者名|リスナー名|寝室|廊下|勤務|会社/);
 for(const stamp of ['1:08:34','2:22:09','2:53:47']) assert.ok(recap.milyHighlights.some(item=>item.timestamp===stamp));
});
test('shop link belongs to program topic without attributing the introduction to Mily',()=>{
 const item=recap.timeline.find(item=>item.relatedLinks?.length);
 assert.equal(item.relatedLinks[0].url,'https://morisekken.handcrafted.jp/');
 assert.ok(!recap.milyHighlights.some(item=>/石鹸/.test(item.title+' '+item.body)));
 assert.match(recap.transcriptionNote,/紹介者は確定していません/);
 const page=readFileSync('src/ActivitiesPage.tsx','utf8');
 assert.match(page,/item\.relatedLinks\?\.map/);
 const entry=news.find(item=>item.id==='2026-10-04-radio-anniversary-recap');
 assert.equal(entry.relatedUrl,'https://mily-fan-site.vercel.app/activities/radio/#'+recap.id+'-mily-highlights');
 assert.equal(entry.media,undefined);
});
