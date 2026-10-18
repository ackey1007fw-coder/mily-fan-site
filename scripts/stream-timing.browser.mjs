import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const artifact=resolve(process.env.SONG_CATALOG_ARTIFACT_DIR || fileURLToPath(new URL('../artifacts/stream-timing/',import.meta.url)));
const moduleRoot=process.env.PLAYWRIGHT_MODULE_ROOT;
assert.ok(moduleRoot,'CI Playwright modules must be installed');
const {chromium,webkit}=await import(pathToFileURL(resolve(moduleRoot,'playwright/index.mjs')).href);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');const clean=decodeURIComponent(url.pathname);let path=resolve(root,'.'+clean);
  if(path!==root && !path.startsWith(root+sep)){res.writeHead(403).end();return;}
  if((await stat(path)).isDirectory())path=resolve(path,'index.html');
  res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream'}).end(await readFile(path));
 }catch{res.writeHead(404).end('Not found');}
});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
const base=`http://127.0.0.1:${server.address().port}`;
await mkdir(artifact,{recursive:true});
const results=[];
try{
 for(const [engineName,engine] of [['chromium',chromium],['webkit',webkit]]){
  const browser=await engine.launch({headless:true});
  try{
   for(const width of [390,1366]){
    const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1});
    await context.route('**/_vercel/**',route=>route.fulfill({status:200,contentType:'application/javascript',body:''}));
    const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
    try{
     const response=await page.goto(base+'/data-lab/stream-timing/',{waitUntil:'networkidle'});assert.equal(response.status(),200);
     await page.locator('#timing-content').waitFor({state:'visible'});
     assert.ok((await page.locator('#timing-overview').innerText()).includes('6時台'));
     assert.equal(await page.locator('#timing-overview article').count(),3);
     assert.equal(await page.locator('#timing-candidates article').count(),3);
     assert.ok((await page.locator('#timing-asof').innerText()).includes('対象18配信'));
     assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex,nofollow,noarchive');
     assert.ok((await page.locator('link[rel=canonical]').getAttribute('href')).endsWith('/data-lab/stream-timing/'));
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false,'document overflow');
     await page.screenshot({path:resolve(artifact,`stream-timing-${engineName}-${width}.png`),fullPage:true});
     for(const key of ['stars','visits','firstVisits','otherFree','newFollows','comments']){
      await page.locator(`[data-metric="${key}"]`).click();assert.equal(await page.locator(`[data-metric="${key}"]`).getAttribute('aria-pressed'),'true');
      assert.ok((await page.locator('#timing-summary').innerText()).includes('10分換算'));
     }
     await page.locator('#timing-phase').selectOption('afterFinal');assert.equal(await page.locator('#timing-candidates article').count(),0);
     await page.locator('#timing-phase').selectOption('fourth');assert.ok((await page.locator('#timing-summary').innerText()).includes('四次審査期'));
     await page.locator('#timing-phase').selectOption('after');await page.locator('#timing-day').selectOption('weekday');
     assert.ok((await page.locator('#timing-summary').innerText()).includes('配信から計算'));
     await page.locator('#timing-day').selectOption('0');assert.equal(await page.locator('#timing-candidates article').count(),0);
     await page.locator('#timing-day').selectOption('all');await page.locator('#timing-all-hours').check();assert.equal(await page.locator('#timing-heatmap tr').count(),24);
     await page.locator('button[data-hour="6"][data-weekday="0"]').click();assert.ok((await page.locator('#timing-cell-detail').innerText()).includes('2026-10-18'));
     await page.locator('button[data-hour="0"][data-weekday="0"]').click();assert.ok((await page.locator('#timing-cell-detail').innerText()).includes('0だった、という意味ではありません'));
     await page.locator('[data-metric="firstVisits"]').click();await page.locator('button[data-hour="22"][data-weekday="6"]').click();assert.ok((await page.locator('#timing-cell-detail').innerText()).includes('0 / 10分換算'));
     await page.locator('[data-metric="stars"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('[data-metric="stars"]').getAttribute('aria-pressed'),'true');
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false,'filtered overflow');
     await page.locator('.back').click();assert.equal(new URL(page.url()).pathname,'/data-lab/');assert.ok(await page.locator('a[href="/data-lab/stream-timing/"]').count()>=1);
     assert.deepEqual(errors,[]);
     results.push({engine:engineName,width,passed:true});
    }finally{await context.close();}
   }
   const failed=await browser.newContext({viewport:{width:390,height:844}});
   try{await failed.route('**/mily-stream-timing.json',route=>route.fulfill({status:503,body:'Unavailable'}));const page=await failed.newPage();await page.goto(base+'/data-lab/stream-timing/');await page.locator('#timing-error').waitFor({state:'visible'});assert.equal(await page.locator('#timing-content').isVisible(),false);assert.ok((await page.locator('#timing-asof').innerText()).includes('ゼロとして表示しません'));results.push({engine:engineName,case:'fetch failure',passed:true});}finally{await failed.close();}
  }finally{await browser.close();}
 }
 await writeFile(resolve(artifact,'stream-timing-browser-result.json'),JSON.stringify({head:process.env.PR_HEAD_SHA || null,results},null,2)+'\n');
 console.log(JSON.stringify({result:'PASS',checks:results.length,results}));
}finally{await new Promise(done=>server.close(done));}
