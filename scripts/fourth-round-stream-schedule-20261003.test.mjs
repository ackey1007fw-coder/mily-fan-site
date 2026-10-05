import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {fourthRoundStreamSchedule as slots, fourthRoundScheduleNewsImage as image, fourthRoundScheduleChangeNotice, FOURTH_ROUND_SCHEDULE_X_URL} from '../src/data/fourthRoundStreamSchedule.ts';
import {streamSchedule,upcomingSlots,slotStartMs,slotEndMs} from '../src/data/streamSchedule.ts';
import {news} from '../src/data/news.ts';
import {nextSupportEventBoundary} from '../src/lib/useSupportEventClock.ts';
import {isMilyPortraitPhoto} from '../src/lib/galleryItems.ts';
import {fourthRoundSchedulePhoto} from '../src/data/fourthRoundStreamSchedule.ts';
import {resolveNewsLinks} from '../src/lib/newsLinks.ts';
import {verifyNews} from './content-invariants.mjs';

test('first-party poster has exactly 13 source-confirmed JST slots and no eighth-day inference',()=>{
 assert.equal(slots.length,13);
 assert.equal(new Set(slots.map(s=>`${s.date}T${s.time}`)).size,13);
 assert.equal(slots.filter(s=>s.note?.includes('きっかけ')).length,2);
 assert.equal(slots.some(s=>s.date==='2026-10-08'),false);
 assert.equal(slots.some(s=>s.date==='2026-10-03'&&s.time==='14:45'),false);
 for(const date of new Set(slots.map(s=>s.date))){
  assert.equal(slots.filter(s=>s.date===date).reduce((n,s)=>n+(slotEndMs(s)-slotStartMs(s))/60000,0),120);
 }
 for(const slot of slots)assert.ok(streamSchedule.includes(slot));
});

test('every confirmed slot expires at its end and cannot remain next',()=>{
 for(const slot of slots){
  const end=slotEndMs(slot);
  assert.ok(upcomingSlots(slots,[],end-1).includes(slot));
  assert.ok(!upcomingSlots(slots,[],end).includes(slot));
  assert.ok(!upcomingSlots(slots,[],end+1).includes(slot));
 }
 assert.equal(upcomingSlots(slots,[],Date.parse('2026-10-03T07:30:00+09:00'))[0].time,'21:40');
 assert.equal(upcomingSlots(slots,[],Date.parse('2026-10-07T22:30:00+09:00')).length,0);
 assert.equal(nextSupportEventBoundary(Date.parse('2026-10-03T07:29:59+09:00')),Date.parse('2026-10-03T07:30:00+09:00'));
});

test('change notice links the newer first-party post without inferring replacement slots',()=>{
 assert.equal(fourthRoundScheduleChangeNotice.sourceUrl,'https://x.com/mily_chan36/status/2107125051904725482');
 assert.equal(fourthRoundScheduleChangeNotice.message,'配信時間の変更が案内されています。最新の時間は本人投稿をご確認ください。');
 assert.deepEqual(slots.filter(s=>s.date==='2026-10-06').map(s=>[s.time,s.endTime]),[['05:30','06:30'],['14:45','15:15'],['22:00','22:30']]);
 const component=readFileSync('src/components/AnnouncedStreamSchedule.tsx','utf8');
 assert.ok(component.indexOf('fourthRoundScheduleChangeNotice.message')<component.indexOf('<NewsImage'));
 assert.match(component,/href=\{fourthRoundScheduleChangeNotice.sourceUrl\}/);
});

test('NEWS links the complete poster and source without turning it into a stream recap',async()=>{
 const item=news.find(n=>n.id==='2026-10-02-fourth-round-stream-schedule');
 assert.equal(item.source,FOURTH_ROUND_SCHEDULE_X_URL);
 assert.equal(item.media,image);assert.equal(image.fullSizeSrc,image.src);
 assert.equal(isMilyPortraitPhoto(fourthRoundSchedulePhoto),false);
 assert.equal(fourthRoundSchedulePhoto.aspect,'1536 / 1024');
 const metadata=await sharp(`public${image.src}`).metadata();
 assert.equal(metadata.width,1536);assert.equal(metadata.height,1024);
 for(const key of ['exif','iptc','xmp','icc'])assert.equal(metadata[key],undefined);
 assert.match(item.body,/05:00〜23:59/);
 assert.match(readFileSync('src/components/AnnouncedStreamSchedule.tsx','utf8'),/実配信の記録ではありません/);
});

test('poster derivatives use actual widths and preserve original zoom target',async()=>{
 for(const [key,extension] of [['srcSet','jpg'],['webpSrcSet','webp']]){
  for(const candidate of image[key].split(', ')){
   const [path,descriptor]=candidate.split(' ');
   assert.equal((await sharp(`public${path}`).metadata()).width,Number(descriptor.slice(0,-1)));
   assert.ok(path.endsWith(`.${extension}`));
  }
 }
 assert.match(image.sizes,/100vw/);assert.equal(image.fullSizeSrc,image.src);
});

test('historical schedule NEWS stays truthful after all slots expire and links Support',()=>{
 const item=news.find(n=>n.id==='2026-10-02-fourth-round-stream-schedule');
 const now=Date.parse('2026-10-08T12:00:00+09:00');
 assert.equal(upcomingSlots(slots,[],now).length,0);
 assert.match(item.body,/本人画像では5日間の13枠/);
 assert.doesNotMatch(item.body,/13枠をHOMEの予定一覧に掲載しています/);
 assert.equal(resolveNewsLinks(item,now).cta.url,'/support/');
 assert.deepEqual(verifyNews([item]),[]);
 assert.ok(verifyNews([{...item,relatedUrl:'/unconfirmed/'}]).length>0);
});
