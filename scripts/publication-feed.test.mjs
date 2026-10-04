import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createPublicationFeed} from '../src/data/publicationFeed.ts';
import {publicationShare,newsPublicationUrl} from '../src/lib/publicationShare.ts';
import {notificationCopy} from './publication-notification-state.mjs';
import {PublicationOutbox} from './publication-notification-state.mjs';
import {news} from '../src/data/news.ts';
test('public candidates retain content IDs, canonical article URLs and identical X/Threads copy across builds',()=>{
 const first=createPublicationFeed(),second=createPublicationFeed();assert.deepEqual(first,second);
 assert.equal(first.eventKind,'site_publication');assert.ok(first.items.length>20);
 const ids=new Set();for(const item of first.items){assert.ok(!ids.has(item.id));ids.add(item.id);assert.ok(item.title);assert.equal(new URL(item.url).origin,'https://mily-fan-site.vercel.app');assert.deepEqual(publicationShare(item.title,item.url),notificationCopy(item));}
 const day=first.items.find(x=>x.id==='mily:recap:2026-10-04-day-showroom');assert.ok(day.url.endsWith('#recap-2026-10-04-day-showroom'));
 assert.equal(newsPublicationUrl({id:'new-video',relatedUrl:'https://example.com/video'}),'https://mily-fan-site.vercel.app/news/#news-new-video');
});
test('separate important notices sharing a general support CTA retain distinct targets and both claim',()=>{
 const first={id:'important-a',title:'告知A',kind:'important',relatedUrl:'https://mily-fan-site.vercel.app/support/'};
 const second={id:'important-b',title:'告知B',kind:'important',relatedUrl:first.relatedUrl};
 const a={...first,url:newsPublicationUrl(first)},b={...second,url:newsPublicationUrl(second)};
 assert.ok(a.url.endsWith('#news-important-a'));assert.ok(b.url.endsWith('#news-important-b'));assert.notEqual(a.url,b.url);
 const outbox=new PublicationOutbox(':memory:');const now='2026-10-04T13:30:00Z';
 try{outbox.seedExisting([a]);assert.equal(outbox.claim(b,{url:b.url,contentId:b.id,httpStatus:200,contentVisible:true,checkedAt:now},now),true);}finally{outbox.close()}
});
test('verified current recap wrappers share the exact article copy and URL with the feed',()=>{
 const feed=createPublicationFeed();const wrappers=news.filter(item=>item.publicationArticle);
 assert.ok(wrappers.length>=3);
 for(const wrapper of wrappers){const article=feed.items.find(item=>item.id===wrapper.publicationArticle.id);assert.ok(article);assert.equal(newsPublicationUrl(wrapper),article.url);assert.deepEqual(publicationShare(wrapper.title,newsPublicationUrl(wrapper)),{text:article.text,url:article.url,manualXUrl:article.manualXUrl});}
});
