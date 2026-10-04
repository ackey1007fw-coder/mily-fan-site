import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LiveStartOutbox,liveStartEligible,liveStartCopy,MILY_ROOM_URL} from './showroom-start-notification.mjs';
const now=Date.parse('2026-10-04T13:30:05Z');
const event={kind:'showroom_live_started',source:'mily',room_id:573253,live_id:123,at:'2026-10-04T13:30:00Z'};
const state={room_id:573253,live:true,live_id:123,checked_epoch:now/1000,next_live:now/1000};
test('existing detector state gates actual target live and excludes schedules, stale data and ended sessions',()=>{
 assert.equal(liveStartEligible(event,state,[],now),true);
 for(const change of[{live:false},{live:'true'},{room_id:1},{live_id:124},{checked_epoch:now/1000-31}])assert.equal(liveStartEligible(event,{...state,...change},[],now),false);
 assert.equal(liveStartEligible({...event,at:'2026-10-04T13:28:00Z'},state,[],now),false);
 assert.equal(liveStartEligible({...event,source:'another'},state,[],now),false);
 assert.equal(liveStartEligible(event,state,[{kind:'showroom_live_ended',room_id:573253,previous_live_id:123,at:'2026-10-04T13:30:04Z'}],now),false);
});
test('an ended live ID stays terminal even if a later start is regenerated after reconnect',()=>{
 const later=Date.parse('2026-10-04T13:30:20Z');
 const restarted={...event,at:'2026-10-04T13:30:15Z'};
 const cached={...state,checked_epoch:later/1000};
 const ended=[{kind:'showroom_live_ended',room_id:573253,previous_live_id:123,at:'2026-10-04T13:30:10Z'}];
 assert.equal(liveStartEligible(restarted,cached,ended,later),false);
 const outbox=new LiveStartOutbox(':memory:');try{assert.equal(outbox.claim(restarted,cached,ended,later),false);assert.equal(outbox.get(123),undefined);}finally{outbox.close()}
});
test('one live session claims once, another session with the same official URL remains eligible',()=>{
 const outbox=new LiveStartOutbox(':memory:');try{
 assert.equal(outbox.claim(event,state,[],now),true);assert.equal(outbox.claim(event,state,[],now),false);
 assert.equal(outbox.claim({...event,live_id:124},{...state,live_id:124},[],now),true);
 const copy=liveStartCopy();assert.equal(copy.url,MILY_ROOM_URL);assert.equal(new URL(copy.manualXUrl).searchParams.get('url'),MILY_ROOM_URL);
 }finally{outbox.close()}
});
