import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
const require = createRequire(path.join(process.env.PLAYWRIGHT_MODULE_ROOT || path.resolve('node_modules'), '__night_resolver.cjs'));
const { chromium, webkit } = require('playwright');
const root = path.resolve('dist');
const artifacts = process.env.SONG_CATALOG_ARTIFACT_DIR || path.resolve('.artifacts/night-20261029');
fs.mkdirSync(artifacts, { recursive: true });
const mime = { '.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.csv':'text/csv; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp' };
// This server is isolated to the built static tree and owned by this test only.
const server = http.createServer((req,res) => {
  try {
    const url = new URL(req.url,'http://localhost');
    const file = path.resolve(root,'.' + decodeURIComponent(url.pathname) + (url.pathname.endsWith('/')?'index.html':''));
    if (!file.startsWith(root+path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404);res.end('Not found');return; }
    res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  } catch { res.writeHead(400);res.end('Invalid request'); }
});
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const results=[];
try {
  for (const [engineName,engine,width] of [['chromium',chromium,320],['webkit',webkit,390],['chromium',chromium,768],['chromium',chromium,1280]]) {
    const browser=await engine.launch({headless:true});
    try {
      const page=await browser.newPage({viewport:{width,height:900}});
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      const response=await page.goto(base+'/data-lab/reports/20261029-night/',{waitUntil:'networkidle'});
      assert.equal(response.status(),200);
      assert.equal(await page.locator('svg').count(),4);
      assert.equal(await page.locator('circle[data-series="stars"]').count(),206);
      assert.equal(await page.locator('circle[data-series="star100People"]').count(),206);
      assert.equal(await page.locator('circle[data-series="otherFree"]').count(),206);
      assert.equal(await page.locator('rect[data-increase]').count(),12);
      assert.match(await page.locator('h1').innerText(),/206/);
      assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex,nofollow,noarchive');
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://mily-fan-site.vercel.app/data-lab/reports/20261029-night/');
      const bounds=await page.evaluate(()=>({screen:innerWidth,body:document.body.scrollWidth,root:document.documentElement.scrollWidth}));
      assert.ok(bounds.body<=width+1 && bounds.root<=width+1,JSON.stringify(bounds));
      const json=await (await page.request.get(base+'/data-lab/data/mily-night-20261029-aggregate.json')).json();
      assert.equal(json.metrics.comments,null);assert.equal(json.observations.length,206);
      const csv=await page.request.get(base+'/data-lab/data/mily-night-20261029-observations.csv');assert.equal(csv.status(),200);
      assert.equal((await csv.text()).trim().split(/\r?\n/).length,207);
      const allText=await page.locator('main').innerText();
      assert.ok(!allText.includes('__DATA_LAB_'));assert.match(allText,/0として/);
      await page.locator('a[href="#increments"]').click();
      assert.ok(page.url().endsWith('#increments'));
      await page.evaluate(()=>window.scrollTo(0,0));
      await page.screenshot({path:path.join(artifacts,`night-20261029-${engineName}-${width}.png`),fullPage:true});
      assert.deepEqual(errors,[]);
      results.push({engine:engineName,width,passed:true,pageOverflow:false,svgCount:4,observations:206});
    } finally {await browser.close();}
  }
} finally { server.closeAllConnections();await new Promise(resolve=>server.close(resolve)); }
fs.writeFileSync(path.join(artifacts,'night-20261029-browser.json'),JSON.stringify({head:process.env.PR_HEAD_SHA||null,results},null,2));
console.log(JSON.stringify({night20261029:'PASS',results},null,2));
