import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir,writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const root=process.env.PLAYWRIGHT_MODULE_ROOT;assert.ok(root);
assert.match(process.env.PR_HEAD_SHA||'',/^[a-f0-9]{40}$/);
const engines=await import(pathToFileURL(join(root,'playwright/index.mjs')).href);
const origin='http://127.0.0.1:4192';
const out=join(process.env.SONG_CATALOG_ARTIFACT_DIR||'qa-artifacts','night-20261022');await mkdir(out,{recursive:true});
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4192','--strictPort'],{stdio:'ignore'});
const results=[];
try{
 let ready=false;for(let i=0;i<100;i++){try{ready=(await fetch(origin)).ok;}catch{}if(ready)break;await new Promise(r=>setTimeout(r,100));}assert.ok(ready);
 for(const [engine,width,height] of [['chromium',320,740],['chromium',390,844],['webkit',390,844],['chromium',1440,1000]]){
  const browser=await engines[engine].launch({headless:true});
  try{
   const context=await browser.newContext({viewport:{width,height}});
   await context.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin!==origin)return route.fulfill({status:204,body:''});if(u.pathname.startsWith('/api/'))return route.fulfill({status:503,contentType:'application/json',body:'{}'});return route.continue();});
   const page=await context.newPage(),errors=[],imageResponses=[];page.on('pageerror',e=>errors.push(e.message));
   page.on('response',response=>{const path=new URL(response.url()).pathname;if(path.startsWith('/media/live/mily-b236-')&&path.endsWith('.png'))imageResponses.push({path,status:response.status(),contentType:response.headers()['content-type']});});
   page.on('requestfailed',request=>{const path=new URL(request.url()).pathname;if(path.startsWith('/media/live/mily-b236-'))imageResponses.push({path,failure:request.failure()});});
   await page.goto(origin+'/activities/live/#recap-2026-10-22-night-showroom',{waitUntil:'networkidle'});
   const card=page.locator('#recap-2026-10-22-night-showroom');await card.waitFor({state:'visible'});assert.equal(await card.getAttribute('open'),'');
   assert.equal(await card.locator('img').count(),11);
   for(const [index,img] of (await card.locator('img').all()).entries()){
    await img.scrollIntoViewIfNeeded();
    try{
     // Scrolling queues lazy loading; wait for its request before decoding.
     await page.waitForFunction(i=>i.complete&&i.naturalWidth>0,await img.elementHandle(),{timeout:15000});
     await img.evaluate(i=>i.decode());
     assert.deepEqual(await img.evaluate(i=>[i.naturalWidth,i.naturalHeight]),[640,360]);
    }catch(error){
     console.error('Night recap image failed',JSON.stringify({engine,width,index,...await img.evaluate(i=>({src:i.getAttribute('src'),currentSrc:i.currentSrc,complete:i.complete,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight})),imageResponses}));
     throw error;
    }
   }
   assert.equal(await card.locator('a[download]').count(),11);
   const videos=await card.locator('video').all();assert.equal(videos.length,3);
   for(const [i,video] of videos.entries()){
    assert.equal(await video.getAttribute('autoplay'),null);assert.equal(await video.getAttribute('preload'),'none');
    await video.scrollIntoViewIfNeeded();await video.evaluate(v=>{v.preload='metadata';v.load();});
    await page.waitForFunction(i=>document.querySelectorAll('#recap-2026-10-22-night-showroom video')[i]?.readyState>=1,i);
    const info=await video.evaluate(v=>[v.videoWidth,v.videoHeight,v.duration]);assert.deepEqual(info.slice(0,2),[720,1280]);assert.ok(Math.abs(info[2]-[18.2,10.8,11][i])<0.1);
    await video.evaluate(v=>{v.muted=true;return v.play();});await page.waitForFunction(i=>document.querySelectorAll('#recap-2026-10-22-night-showroom video')[i]?.currentTime>0.6,i);assert.equal(await video.evaluate(v=>v.error),null);await video.evaluate(v=>v.pause());
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.screenshot({path:join(out,`${engine}-${width}-live.png`)});
   await page.goto(origin+'/data-lab/reports/20261022-night/',{waitUntil:'networkidle'});assert.match(await page.locator('h1').innerText(),/10月22日 夜/);assert.equal(await page.locator('[data-metric]').count(),3);assert.ok((await page.locator('[data-metric]').allTextContents()).every(x=>x==='未確認'));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:join(out,`${engine}-${width}-lab.png`)});
   await page.goto(origin+'/activities/live/#recap-2026-10-22-morning-showroom',{waitUntil:'networkidle'});assert.equal(await page.locator('#recap-2026-10-22-morning-showroom').getAttribute('open'),'');
   assert.deepEqual(errors,[]);results.push({engine,width,photos:10,clips:3,nightLab:true,morningRecap:true});
  }finally{await browser.close();}
 }
}finally{server.kill('SIGTERM');await writeFile(join(out,'results.json'),JSON.stringify({head:process.env.PR_HEAD_SHA,scope:'CI production build; live deployment verified separately',results},null,2));}
console.log('October 22 night media, anonymous lab, and morning recap verified.');
