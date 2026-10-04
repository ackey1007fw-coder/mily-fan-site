import{test}from'node:test';import assert from'node:assert/strict';
import{PublicationOutbox}from'./publication-notification-state.mjs';import{LiveStartOutbox}from'./showroom-start-notification.mjs';import{deliverPublication,deliverLiveStart}from'./notification-delivery.mjs';
const now=Date.parse('2026-10-04T13:30:05Z');
test('a lost posting result persists unknown and repeated runs never call the connector again',async()=>{
 const outbox=new PublicationOutbox(':memory:');outbox.seedExisting([]);let calls=0;const item={id:'new',title:'新記事',kind:'article',url:'https://mily-fan-site.vercel.app/stories/new/'};
 const adapters={now:()=>new Date(now).toISOString(),verifyPublic:async()=>({url:item.url,contentId:item.id,httpStatus:200,contentVisible:true,checkedAt:new Date(now).toISOString()}),publishThreads:async()=>{calls++;throw Error('network unavailable')}};
 try{assert.equal((await deliverPublication(outbox,item,adapters)).state,'unknown');assert.equal((await deliverPublication(outbox,item,adapters)).state,'duplicate_or_baseline');assert.equal(calls,1);assert.equal(outbox.get(item.id).state,'unknown');}finally{outbox.close()}
});
test('an actual start that ends before the connector call is never posted',async()=>{
 const outbox=new LiveStartOutbox(':memory:');let reads=0,calls=0;const event={kind:'showroom_live_started',source:'mily',room_id:573253,live_id:123,at:'2026-10-04T13:30:00Z'};
 try{const result=await deliverLiveStart(outbox,event,{now:()=>now,readExistingState:async()=>({state:{room_id:573253,live_id:123,live:++reads===1,checked_epoch:now/1000},endedEvents:[]}),publishThreads:async()=>{calls++;return{state:'success',permalink:'https://www.threads.com/@ackeytan_0720/post/real'}}});assert.equal(result.state,'failed');assert.equal(calls,0);assert.equal(outbox.get(123).reason,'live_ended_or_stale_before_send');}finally{outbox.close()}
});
