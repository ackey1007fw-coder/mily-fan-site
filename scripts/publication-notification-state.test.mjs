import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PublicationOutbox, notificationCopy, publicationUrl } from './publication-notification-state.mjs';

const now = '2026-10-04T12:00:00Z';
const item = { id:'new-article', title:'新しい記事', kind:'article', url:'https://mily-fan-site.vercel.app/activities/live/#recap-new' };
const proof = { url:item.url, contentId:item.id, httpStatus:200, contentVisible:true, checkedAt:now };

test('two connections cannot claim the same publication, URL aliases, or redeploys twice', () => {
  const dir = mkdtempSync(join(tmpdir(),'mily-notices-')); const path = join(dir,'outbox.sqlite');
  const first = new PublicationOutbox(path), second = new PublicationOutbox(path);
  try {
    assert.equal(first.claim(item,proof,now),true);
    assert.equal(second.claim(item,proof,now),false);
    const alias = {...item,id:'renamed-id'};
    assert.equal(second.claim(alias,{...proof,contentId:alias.id},now),false);
    first.finish(item.id,{state:'unknown',reason:'response_not_received'},now);
    assert.equal(second.claim(item,proof,now),false);
    assert.equal(second.get(item.id).state,'unknown');
  } finally { first.close();second.close();rmSync(dir,{recursive:true}); }
});

test('baseline suppresses old articles and no send is claimed without fresh visible production evidence', () => {
  const outbox = new PublicationOutbox(':memory:');
  try {
    outbox.seedExisting([item]);
    assert.equal(outbox.claim(item,proof,now),false);
    const next = {...item,id:'next',url:item.url+'-next'};
    for (const change of [{httpStatus:404},{contentVisible:false},{checkedAt:'2026-10-04T11:54:59Z'},{contentId:'wrong'}]) {
      assert.throws(()=>outbox.claim(next,{...proof,url:next.url,contentId:next.id,...change},now));
    }
    assert.throws(()=>publicationUrl('https://example.com/article'));
    assert.throws(()=>publicationUrl('/article?preview=1'));
  } finally {outbox.close();}
});

test('success requires a real permalink; failures and uncertain results are never retried automatically', () => {
  const outbox = new PublicationOutbox(':memory:');
  try {
    assert.equal(outbox.claim(item,proof,now),true);
    assert.throws(()=>outbox.finish(item.id,{state:'success',permalink:'https://www.threads.com/@profile'},now));
    outbox.finish(item.id,{state:'success',permalink:'https://www.threads.com/@profile/post/verified'},now);
    assert.equal(outbox.get(item.id).permalink,'https://www.threads.com/@profile/post/verified');
    assert.throws(()=>outbox.finish(item.id,{state:'failed',reason:'retry'},now));
    const copy = notificationCopy(item); const manual = new URL(copy.manualXUrl);
    assert.equal(manual.searchParams.get('text'),copy.text);
    assert.equal(manual.searchParams.get('url'),copy.url);
  } finally {outbox.close();}
});
