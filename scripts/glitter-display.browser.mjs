import assert from 'node:assert/strict';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join, extname, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
const tools = process.env.PLAYWRIGHT_MODULE_ROOT;
assert.ok(tools, 'Isolated Playwright module path required');
const { chromium, webkit } = await import(pathToFileURL(join(tools, 'playwright/index.mjs')).href);
const root = resolve('dist');
const output = process.env.GLITTER_ARTIFACT_DIR || 'qa-artifacts/glitter-display';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.avif':'image/avif','.mp4':'video/mp4'};
await mkdir(output, {recursive:true});
const results = [];
try {
 for (const [engine, launcher] of [['chromium',chromium],['webkit',webkit]]) {
  const browser = await launcher.launch({headless:true});
  try {
   for (const width of [390,1440]) {
    const page = await browser.newPage({viewport:{width,height:844}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',async route=>{
     const url=new URL(route.request().url());
     if(url.hostname!=='site.test')return route.fulfill({status:204,body:''});
     if(url.pathname.startsWith('/api/'))return route.fulfill({status:503,contentType:'application/json',body:'{}'});
     let file=resolve(root,'.'+decodeURIComponent(url.pathname));
     const rel=relative(root,file);if(rel==='..'||rel.startsWith('..'+sep))return route.fulfill({status:403,body:''});
     try {
      if((await stat(file)).isDirectory())file=join(file,'index.html');
      // Force the target to appear after the browser's initial fragment lookup.
      if(/\/assets\/support-[^/]+\.js$/.test(url.pathname))await new Promise(r=>setTimeout(r,700));
      await route.fulfill({status:200,contentType:mime[extname(file)]||'application/octet-stream',body:await readFile(file)});
     }catch{await route.fulfill({status:404,body:'Not found'});}
    });
    const checkLanding=async label=>{
     await page.waitForSelector('#show-glitter-guide');
     // Never scroll manually before this assertion: doing so hides the bug.
     await page.waitForFunction(()=>{
      const h=document.querySelector('#glitter-heading')?.getBoundingClientRect();
      const header=document.querySelector('header')?.getBoundingClientRect();
      return h&&header&&h.top>=header.height&&h.bottom<=innerHeight;
     },undefined,{timeout:15000});
     const state=await page.evaluate(()=>({scrollY,guideTop:document.querySelector('#show-glitter-guide').getBoundingClientRect().top,headingTop:document.querySelector('#glitter-heading').getBoundingClientRect().top,overflow:document.documentElement.scrollWidth>innerWidth+1}));
     assert.equal(state.overflow,false);assert.deepEqual(errors,[]);
     await page.screenshot({path:join(output,`${engine}-${width}-${label}.png`)});
     results.push({engine,width,label,...state,status:'passed'});
    };
    await page.goto('https://site.test/support/#show-glitter-guide',{waitUntil:'networkidle'});
    await checkLanding('cold-share-link');
    const weekly=page.getByLabel('今週の公式ランキングpt');
    await weekly.fill('15000');
    await page.getByLabel('今週の残り日数（今日を含む）').selectOption('5');
    // #glitter-calc is the h3; the labelled region also contains the results.
    const calculator=page.locator('[aria-labelledby="glitter-calc"]');
    assert.match(await calculator.innerText(),/25,000pt/);
    assert.match(await calculator.innerText(),/5,000pt/);
    const y=await page.evaluate(()=>scrollY);await page.waitForTimeout(200);
    assert.ok(Math.abs((await page.evaluate(()=>scrollY))-y)<2,'Calculator input must not force a jump to the heading');
    await page.goto('https://site.test/support/',{waitUntil:'networkidle'});
    assert.equal(await page.evaluate(()=>scrollY),0,'Plain Support stays at the top');
    await page.locator('[data-glitter-entry]').click();await checkLanding('top-entry');
    await page.goto('https://site.test/',{waitUntil:'networkidle'});
    await page.locator('a[href="/support/#show-glitter-guide"]').click();await checkLanding('home-entry');
    assert.deepEqual(errors,[]);await page.close();
   }
  }finally{await browser.close();}
 }
}finally{await writeFile(join(output,'results.json'),JSON.stringify({head:process.env.PR_HEAD_SHA||null,results},null,2));}
console.log(JSON.stringify(results));
