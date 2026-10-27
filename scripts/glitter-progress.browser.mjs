import assert from 'node:assert/strict';
import {readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join,extname,relative,sep} from 'node:path';
import {pathToFileURL} from 'node:url';
const tools=process.env.PLAYWRIGHT_MODULE_ROOT;
assert.ok(tools,'Isolated browser tooling required');
const {chromium,webkit}=await import(pathToFileURL(join(tools,'playwright/index.mjs')).href);
const root=resolve('dist'),output=process.env.GLITTER_ARTIFACT_DIR||'qa-artifacts/glitter-progress';
await mkdir(output,{recursive:true});
const now=Date.parse('2026-10-19T09:33:49+09:00');
const fixture=()=>({schemaVersion:1,genre:{id:103,name:'タレント'},roomId:573253,generatedAt:new Date(now).toISOString(),sourceUrl:'https://www.showroom-live.com/ranking',...Object.fromEntries(['weekly','daily'].map(kind=>[kind,{state:'ok',periodStart:'2026-10-19',periodEnd:kind==='weekly'?'2026-10-25':'2026-10-19',observedAt:new Date(now).toISOString(),points:7089,rank:18,listedCount:83,nextRank:17,nextRankPoints:8049,gapToNextRank:960,cutoffRank:null,rankCondition:'unverified'}]))});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4'};
const results=[];
try {for(const [engine,launcher] of [['chromium',chromium],['webkit',webkit]]){
 const browser=await launcher.launch({headless:true});
 try {for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:900}});const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(value=>{Date.now=()=>value;},now);
  let payload=fixture(),failed=false;
  await page.route('**/*',async route=>{const url=new URL(route.request().url());
   if(url.hostname!=='site.test')return route.fulfill({status:204,body:''});
   if(url.pathname==='/api/mily-glitter')return route.fulfill({status:failed?503:200,contentType:'application/json',body:JSON.stringify(payload)});
   if(url.pathname.startsWith('/api/'))return route.fulfill({status:503,contentType:'application/json',body:'{}'});
   let file=resolve(root,'.'+decodeURIComponent(url.pathname));const rel=relative(root,file);
   if(rel==='..'||rel.startsWith('..'+sep))return route.fulfill({status:403,body:''});
   try{if((await stat(file)).isDirectory())file=join(file,'index.html');return route.fulfill({status:200,contentType:mime[extname(file)]||'application/octet-stream',body:await readFile(file)});}catch{return route.fulfill({status:404,body:'Missing'});}
  });
  await page.goto('https://site.test/data-lab/glitter/',{waitUntil:'networkidle'});
  await page.waitForFunction(() => document.querySelector('#weekly-points')?.textContent === '7,089' && !document.querySelector('#refresh')?.disabled);
  assert.equal(await page.locator('#remaining').innerText(),'32,911');
  assert.equal(await page.locator('#weekly-points').innerText(),'7,089');
  assert.equal(await page.locator('#weekly-rank').innerText(),'18');
  assert.match(await page.locator('#rank-gap').innerText(),/960pt/);
  assert.equal(await page.locator('#daily-average').innerText(),'4,702');
  assert.ok(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)));
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://mily-fan-site.vercel.app/data-lab/glitter/');
  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex,nofollow,noarchive');
  await page.screenshot({path:join(output,`progress-${engine}-${width}.png`),fullPage:true});
  await page.locator('#streams').fill('12');assert.match(await page.locator('#stream-plan').innerText(),/2,743pt/);
  await page.locator('#target').selectOption('42000');assert.match(await page.locator('#stream-plan').innerText(),/2,910pt/);
  await page.locator('#streams').fill('0');assert.match(await page.locator('#stream-plan').innerText(),/1〜99/);
  failed=true;await page.locator('#refresh').click();await page.waitForFunction(()=>!document.querySelector('#refresh').disabled);
  assert.match(await page.locator('#status').innerText(),/再取得に失敗/);assert.equal(await page.locator('#remaining').innerText(),'32,911');
  failed=false;payload.daily.state='unavailable';payload.daily.points=null;
  await page.locator('#refresh').click();await page.waitForFunction(()=>!document.querySelector('#refresh').disabled);
  assert.equal(await page.locator('#remaining').innerText(),'32,911');assert.equal(await page.locator('#daily-points').innerText(),'未確認');
  payload.weekly.observedAt=new Date(now-600000).toISOString();
  await page.locator('#refresh').click();await page.waitForFunction(()=>!document.querySelector('#refresh').disabled);
  assert.equal(await page.locator('#remaining').innerText(),'未確認');assert.equal(await page.locator('#progress').isVisible(),false);
  payload=fixture();payload.weekly.periodStart='2026-10-12';payload.weekly.periodEnd='2026-10-18';
  await page.locator('#refresh').click();await page.waitForFunction(()=>!document.querySelector('#refresh').disabled);
  assert.equal(await page.locator('#remaining').innerText(),'未確認');assert.equal(await page.locator('#daily-points').innerText(),'7,089');
  await page.goto('https://site.test/data-lab/',{waitUntil:'networkidle'});assert.equal(await page.locator('a[href="/data-lab/glitter/"]').count(),1);
  await page.goto('https://site.test/support/',{waitUntil:'networkidle'});assert.equal(await page.locator('a[href="/data-lab/glitter/"]').count(),1);
  assert.deepEqual(errors,[]);results.push({engine,width,checks:'fresh, layout, sources, calculator, failed refresh, partial, stale, previous week, both entry links',status:'passed'});await page.close();
 }}finally{await browser.close();}
}}finally{await writeFile(join(output,'progress-results.json'),JSON.stringify({head:process.env.PR_HEAD_SHA||null,results},null,2));}
console.log(JSON.stringify(results));
