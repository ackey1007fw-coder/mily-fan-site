import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {fourthRoundStreamSchedule as slots, fourthRoundScheduleNewsImage as image, FOURTH_ROUND_SCHEDULE_X_URL} from '../src/data/fourthRoundStreamSchedule.ts';
import {streamSchedule,upcomingSlots,slotStartMs,slotEndMs} from '../src/data/streamSchedule.ts';
import {news} from '../src/data/news.ts';
import {nextSupportEventBoundary} from '../src/lib/useSupportEventClock.ts';
import {isMilyPortraitPhoto} from '../src/lib/galleryItems.ts';
import {fourthRoundSchedulePhoto} from '../src/data/fourthRoundStreamSchedule.ts';
import {resolveNewsLinks} from '../src/lib/newsLinks.ts';
import {verifyNews} from './content-invariants.mjs';

test('first-party poster retains exactly its 13 source-confirmed JST slots',()=>{
 const posterSlots=slots.filter(s=>s.date<'2026-10-08');
 assert.equal(posterSlots.length,13);
 assert.equal(new Set(posterSlots.map(s=>`${s.date}T${s.time}`)).size,13);
 assert.equal(posterSlots.filter(s=>s.note?.includes('きっかけ')).length,2);
 assert.equal(posterSlots.some(s=>s.date==='2026-10-03'&&s.time==='14:45'),false);
 for(const date of new Set(posterSlots.map(s=>s.date))){
  assert.equal(posterSlots.filter(s=>s.date===date).reduce((n,s)=>n+(slotEndMs(s)-slotStartMs(s))/60000,0),120);
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
 assert.equal(upcomingSlots(slots,[],Date.parse('2026-10-07T22:30:00+09:00'))[0].date,'2026-10-08');
 assert.equal(nextSupportEventBoundary(Date.parse('2026-10-03T07:29:59+09:00')),Date.parse('2026-10-03T07:30:00+09:00'));
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
 assert.equal(upcomingSlots(slots.filter(s=>s.date<'2026-10-08'),[],now).length,0);
 assert.match(item.body,/本人画像では5日間の13枠/);
 assert.doesNotMatch(item.body,/13枠をHOMEの予定一覧に掲載しています/);
 assert.equal(resolveNewsLinks(item,now).cta.url,'/support/');
 assert.deepEqual(verifyNews([item]),[]);
 assert.ok(verifyNews([{...item,relatedUrl:'/unconfirmed/'}]).length>0);
});
