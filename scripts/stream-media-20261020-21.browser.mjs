import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const root = process.env.PLAYWRIGHT_MODULE_ROOT;
assert.ok(root); assert.match(process.env.PR_HEAD_SHA || '', /^[a-f0-9]{40}$/);
const engines = await import(pathToFileURL(join(root, 'playwright/index.mjs')).href);
const groups = JSON.parse(await readFile('scripts/stream-media-20261020-21.json','utf8')).groups;
const singing = JSON.parse(await readFile('scripts/stream-singing-20261020-21.json','utf8')).clips;
const origin = 'http://127.0.0.1:4189';
const output = join(process.env.SONG_CATALOG_ARTIFACT_DIR || 'qa-artifacts','media-20261020-21');
await mkdir(output,{recursive:true});
const server = spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4189','--strictPort'],{stdio:'ignore'});
const results=[];
async function waitVideo(page, recapId, src, mode){
 await page.waitForFunction(({recapId,src,mode})=>{
  const card=document.getElementById('recap-'+recapId);
  const v=[...(card?.querySelectorAll('video')||[])].find(v=>v.querySelector('source')?.getAttribute('src')===src);
  return !!v && (mode==='metadata'?v.readyState>=1:v.currentTime>0.5);
 },{recapId,src,mode},{timeout:30000});
}
try {
 let ready=false;
 for(let i=0;i<100;i++){try{ready=(await fetch(origin)).ok;}catch{}if(ready)break;await new Promise(r=>setTimeout(r,100));}
 assert.ok(ready);
 for(const [engine,width,height] of [['chromium',390,844],['webkit',390,844],['chromium',1440,1000]]){
  for(const g of groups){
   // Isolate each recap in a fresh browser process to avoid cross-stream decoder/image-memory contention.
   const browser=await engines[engine].launch({headless:true});
   try {
    const context=await browser.newContext({viewport:{width,height}});
   await context.route('**/*',route=>{
    const u=new URL(route.request().url());
    if(u.origin!==origin)return route.fulfill({status:204,body:''});
    if(u.pathname.startsWith('/api/'))return route.fulfill({status:503,contentType:'application/json',body:'{}'});
    return route.continue();
   });
    const page=await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(origin+'/activities/live/#recap-'+g.recapId,{waitUntil:'networkidle'});
    const card=page.locator('#recap-'+g.recapId);
    await card.waitFor({state:'visible'});assert.equal(await card.getAttribute('open'),'');
    assert.equal(await card.locator('img').count(),6);
    for(const img of await card.locator('img').all()){
     await img.scrollIntoViewIfNeeded();
     // An occasional Chromium decode() rejection on Linux is not proof of an invalid JPEG.
     // Use the browser's actually loaded natural dimensions as the authoritative image gate,
     // and preserve a diagnostic flag instead of silently assuming decode() passed.
     const status=await img.evaluate(async i=>{
      let decoded=true,decodeError='';
      try{await i.decode();}catch(e){decoded=false;decodeError=String(e);}
      return {decoded,decodeError,complete:i.complete,width:i.naturalWidth,height:i.naturalHeight,src:i.currentSrc};
     });
     if(!status.decoded) {
      console.warn('Image decode fallback:',engine,width,g.recapId,status.src,status.decodeError);
      results.push({engine,width,recap:g.recapId,imageDecodeFallback:true,imageSrc:status.src});
     }
     assert.equal(status.complete,true,'Image still loading: '+status.src);
     assert.deepEqual([status.width,status.height],[640,360],'Image invalid or not loaded: '+status.src);
    }
    const clip=g.files.find(f=>f.role==='talk');
    assert.equal(await card.locator('video').count(),1+singing.filter(c=>c.recapId===g.recapId).length);
    const video=card.locator('video:has(source[src="/media/live/'+clip.name+'"])');assert.equal(await video.count(),1);
    assert.equal(await video.locator('source').getAttribute('src'),'/media/live/'+clip.name);
    assert.equal(await video.getAttribute('autoplay'),null);assert.equal(await video.getAttribute('preload'),'none');
    assert.equal(await card.locator('a[download]').count(),5);
    await video.scrollIntoViewIfNeeded();await video.evaluate(v=>{v.preload='metadata';v.load();});
    await waitVideo(page,g.recapId,'/media/live/'+clip.name,'metadata');
    const info=await video.evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight}));
    assert.ok(Math.abs(info.duration-clip.durationSeconds)<0.1);assert.deepEqual([info.width,info.height],[720,1280]);
    await video.evaluate(v=>{v.muted=true;return v.play();});
    await waitVideo(page,g.recapId,'/media/live/'+clip.name,'play');
    assert.equal(await video.evaluate(v=>v.error),null);
    await video.evaluate(v=>v.pause());
    for(const song of singing.filter(c=>c.recapId===g.recapId)){
     const sv=card.locator('video:has(source[src="'+song.video.src+'"])');
     assert.equal(await sv.count(),1);assert.equal(await sv.getAttribute('poster'),song.poster.src);
     assert.equal(await sv.getAttribute('autoplay'),null);await sv.scrollIntoViewIfNeeded();
     await sv.evaluate(v=>{v.preload='metadata';v.load();});
     await waitVideo(page,g.recapId,song.video.src,'metadata');
     assert.deepEqual(await sv.evaluate(v=>[v.videoWidth,v.videoHeight]),[720,1280]);
     assert.ok(Math.abs(await sv.evaluate(v=>v.duration)-28)<0.25);
     await sv.evaluate(v=>{v.muted=true;return v.play();});
     await waitVideo(page,g.recapId,song.video.src,'play');
     assert.equal(await sv.evaluate(v=>v.error),null);await sv.evaluate(v=>v.pause());
     results.push({engine,width,recap:g.recapId,clip:song.id,passed:true});
    }
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await card.locator(':scope > summary').scrollIntoViewIfNeeded();
    const filename=engine+'-'+width+'-'+g.code+'.png';await page.screenshot({path:join(output,filename)});
    await card.locator(':scope > summary').click();assert.equal(await card.getAttribute('open'),null);
    results.push({engine,width,recap:g.recapId,passed:true,screenshot:filename,...info});
    assert.deepEqual(errors,[]);
    await page.close();
   }finally{await browser.close();}
  }
 }
}finally{
 server.kill('SIGTERM');
 await writeFile(join(output,'results.json'),JSON.stringify({head:process.env.PR_HEAD_SHA,scope:'CI local build; production is separate',results},null,2));
}
console.log('Four stream media verified in Chromium mobile/desktop and WebKit mobile.');
