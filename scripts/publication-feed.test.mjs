import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createPublicationFeed} from '../src/data/publicationFeed.ts';
import {publicationShare,newsPublicationUrl} from '../src/lib/publicationShare.ts';
import {notificationCopy} from './publication-notification-state.mjs';
test('public candidates retain content IDs, canonical article URLs and identical X/Threads copy across builds',()=>{
 const first=createPublicationFeed(),second=createPublicationFeed();assert.deepEqual(first,second);
 assert.equal(first.eventKind,'site_publication');assert.ok(first.items.length>20);
 const ids=new Set();for(const item of first.items){assert.ok(!ids.has(item.id));ids.add(item.id);assert.ok(item.title);assert.equal(new URL(item.url).origin,'https://mily-fan-site.vercel.app');assert.deepEqual(publicationShare(item.title,item.url),notificationCopy(item));}
 const day=first.items.find(x=>x.id==='mily:recap:2026-10-04-day-showroom');assert.ok(day.url.endsWith('#recap-2026-10-04-day-showroom'));
 assert.equal(newsPublicationUrl({id:'new-video',relatedUrl:'https://example.com/video'}),'https://mily-fan-site.vercel.app/news/#news-new-video');
});
