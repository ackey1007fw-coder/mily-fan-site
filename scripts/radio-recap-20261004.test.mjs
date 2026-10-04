import assert from 'node:assert/strict';
import {test} from 'node:test';
import {radioEpisode20261004 as recap} from '../src/data/radioEpisode20261004.ts';
import {radioEpisodes} from '../src/data/radioEpisodes.ts';
import {radioMusicEpisodes} from '../src/data/radioMusic.ts';
import {news} from '../src/data/news.ts';
import {readFileSync} from 'node:fs';

test('October 4 radio keeps unverified music, private messages and clips out of publication',()=>{
 assert.equal(radioEpisodes[0],recap);
 assert.deepEqual(recap.listenerMessages,[]);assert.equal(recap.nextEpisodeNote,'');
 assert.equal(radioMusicEpisodes.find(item=>item.id===recap.id),undefined);
 assert.match(recap.transcriptionNote,/全編の手動聴取・逐語校正は未実施/);
 assert.doesNotMatch(JSON.stringify(recap),/libfile_|drive\.google|\.ogg|\.flac|\.mp4|\.srt|C:\\|YouTube|youtube\.com/);
 assert.ok(recap.milyHighlights.every(item=>item.quote===undefined));
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
