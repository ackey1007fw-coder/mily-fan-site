import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, join, extname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
const root=process.cwd();
const moduleRoot=process.env.PLAYWRIGHT_MODULE_ROOT ?? join(root,'node_modules');
const {chromium,webkit}=await import(pathToFileURL(join(moduleRoot,'playwright/index.mjs')).href);
const dist=resolve(root,'dist');
const contentTypes={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.mp4':'video/mp4','.json':'application/json'};
const server=createServer(async(req,res)=>{
 const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 let p=resolve(dist,'.'+path);
 if(!p.startsWith(dist+sep)&&p!==dist){res.writeHead(403);res.end();return;}
 try{
  if(path.startsWith('/api/')){res.writeHead(200,{'Content-Type':'application/json'});res.end('{}');return;}
  // Match the production multipage build, not the HOME fallback for directories.
  if(path.endsWith('/')) p=join(p,'index.html');
  let bytes;try{bytes=await readFile(p);}catch{
   if(extname(path)){res.writeHead(404);res.end();return;}
   p=join(dist,'index.html');bytes=await readFile(p);
  }
  // Native players can request byte ranges when beginning or seeking MP4 files.
  const range=req.headers.range;
  if(range&&extname(p)==='.mp4'){
   const match=/^bytes=(\d+)-(\d*)$/.exec(range);
   if(!match){res.writeHead(416);res.end();return;}
   const start=Number(match[1]),end=Math.min(match[2]?Number(match[2]):bytes.length-1,bytes.length-1);
   if(start>end||start>=bytes.length){res.writeHead(416);res.end();return;}
   res.writeHead(206,{'Content-Type':'video/mp4','Accept-Ranges':'bytes','Content-Range':`bytes ${start}-${end}/${bytes.length}`,'Content-Length':end-start+1});
   res.end(req.method==='HEAD'?undefined:bytes.subarray(start,end+1));return;
  }
  res.writeHead(200,{'Content-Type':contentTypes[extname(p)]??'application/octet-stream','Content-Length':bytes.length});
  res.end(req.method==='HEAD'?undefined:bytes);
 }catch{res.writeHead(500);res.end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin=`http://127.0.0.1:${server.address().port}`;
const output=resolve(process.env.SONG_CATALOG_ARTIFACT_DIR??join(root,'test-artifacts'),'redhood-five');
await mkdir(output,{recursive:true});
const result=[];
try {
 for(const [engine,browserType] of [['chromium',chromium],['webkit',webkit]]) {
  const browser=await browserType.launch({headless:true});
  try{
   for(const width of [390,1440]) {
    const page=await browser.newPage({viewport:{width,height:900}});
    const mediaRequests=[];
    const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.stack||String(e)));
    page.on('request',r=>{if(r.url().includes('mily-b220-')&&r.url().endsWith('.mp4'))mediaRequests.push(r.url());});
    await page.route('**/*',route=>route.request().url().startsWith(origin)?route.continue():route.fulfill({status:200,body:'{}'}));
    await page.goto(origin+'/activities/live/#recap-2026-10-12-final-night-showroom',{waitUntil:'networkidle'});
    const recap=page.locator('#recap-2026-10-12-final-night-showroom');
    await recap.waitFor({state:'visible'});
    const videos=recap.locator('[data-approved-song-clips] video');
    assert.equal(await videos.count(),5);
    assert.equal(mediaRequests.length,0,'No video bytes should be requested before user interaction');
    const sources=await videos.evaluateAll(nodes=>nodes.map(v=>({poster:v.getAttribute('poster'),src:v.querySelector('source')?.getAttribute('data-src'),initialSrc:v.querySelector('source')?.getAttribute('src'),preload:v.preload,autoplay:v.autoplay,inline:v.playsInline,controls:v.controls,width:v.getAttribute('width'),height:v.getAttribute('height')})));
    for(const s of sources){assert.equal(s.initialSrc,null);assert.equal(s.preload,'none');assert.equal(s.autoplay,false);assert.equal(s.inline,true);assert.equal(s.controls,true);assert.equal(s.width,'720');assert.equal(s.height,'1280');assert.match(s.src,/^\/media\/live\/mily-b220-\d+-redhood-/);assert.match(s.poster,/-cover\.jpg$/);}
    assert.equal(new Set(sources.map(s=>s.src)).size,5);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    const first=videos.nth(0),second=videos.nth(1);
    // Wait for real playback before the next interaction. play() resolution and
    // React's media event delivery are separate browser tasks (especially WebKit).
    await first.evaluate(v=>{v.muted=true;});
    await recap.locator('[data-load-approved-clip]').nth(0).click();
    await page.waitForFunction(()=>{
      const v=document.querySelector('[data-approved-song-clips] video');
      return v && !v.paused && v.readyState>=2 && v.currentTime>0;
    },undefined,{timeout:15000});
    await second.evaluate(v=>{v.muted=true;});
    await recap.locator('[data-load-approved-clip]').nth(0).click();
    await page.waitForFunction(()=>{
      const v=document.querySelectorAll('[data-approved-song-clips] video');
      return v.length===5 && v[0].paused && !v[1].paused && v[1].readyState>=2;
    },undefined,{timeout:15000});
    assert.equal(await first.locator('source').getAttribute('src'),sources[0].src);
    assert.equal(await second.locator('source').getAttribute('src'),sources[1].src);
    assert.ok(await first.evaluate(v=>v.paused),'Playing another excerpt should pause the preceding one');
    assert.ok(await second.evaluate(v=>!v.paused),'The requested excerpt must stay playing');
    await second.evaluate(v=>v.pause());
    await recap.locator('[data-approved-song-clips]').first().screenshot({path:join(output,`${engine}-${width}.png`)});
    // WebKit native media-control layout (observed on Windows and Linux) emits this
    // duration-format warning before metadata is available. Keep it in the QA
    // output; do not suppress application errors or any playback assertion.
    const nativeControlWarnings=pageErrors.filter(e=>engine==='webkit'
      && e.includes('Temporal.Duration properties must be finite and of consistent sign')
      && e.includes('performScheduledLayout') && !e.includes(origin));
    assert.deepEqual(pageErrors.filter(e=>!nativeControlWarnings.includes(e)),[],'No application runtime errors');
    if(nativeControlWarnings.length)console.warn(JSON.stringify({engine,width,nativeControlWarnings}));
    result.push({engine,width,videos:sources.length,preload:'none',overflow:false,exclusivePlayback:true,nativeControlWarnings:nativeControlWarnings.length});
    await page.close();
   }
  }finally{await browser.close();}
 }
 console.log(JSON.stringify(result,null,2));
}finally{server.close();}
