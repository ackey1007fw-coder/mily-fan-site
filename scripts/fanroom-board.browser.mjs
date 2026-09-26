import assert from 'node:assert/strict';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join, extname, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
const tools = process.env.PLAYWRIGHT_MODULE_ROOT;
assert.ok(tools, 'Isolated Playwright module path required');
const { chromium, webkit } = await import(pathToFileURL(join(tools, 'playwright/index.mjs')).href);
const root = resolve('dist');
const output = join(process.env.SONG_CATALOG_ARTIFACT_DIR || 'qa-artifacts', 'fanroom-board');
await mkdir(output, { recursive: true });
const results = [];
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.png':'image/png', '.webp':'image/webp', '.avif':'image/avif', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.mp4':'video/mp4' };
try {
  for (const [engine, launcher] of [['chromium',chromium], ['webkit',webkit]]) {
    const browser = await launcher.launch({ headless: true });
    try {
      for (const width of [320,390,1440]) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        const errors=[]; page.on('pageerror', e=>errors.push(e.message));
        await page.route('**/*', async route => {
          const url=new URL(route.request().url());
          if(url.hostname!=='site.test') return route.fulfill({status:204,body:''});
          if(url.pathname.startsWith('/api/')) return route.fulfill({status:503,contentType:'application/json',body:'{}'});
          let file=resolve(root,'.'+decodeURIComponent(url.pathname));
          const rel=relative(root,file); if(rel.startsWith('..'+sep)||rel==='..') return route.fulfill({status:403,body:''});
          try { if((await stat(file)).isDirectory())file=join(file,'index.html'); await route.fulfill({status:200,contentType:mime[extname(file)]||'application/octet-stream',body:await readFile(file)}); }
          catch { await route.fulfill({status:404,body:'Not found'}); }
        });
        for (const route of ['/','/news/']) {
          await page.goto('https://site.test'+route,{waitUntil:'networkidle'});
          const photo=page.locator('img[src*="mily-b167-01-night-thanks-board"]').first();
          await photo.scrollIntoViewIfNeeded();
          await page.waitForFunction(() => {
            const img=document.querySelector('img[src*="mily-b167-01-night-thanks-board"]');
            return img && img.complete && img.naturalWidth > 0;
          });
          await photo.evaluate(img => img.decode());
          const card=photo.locator('xpath=ancestor::li[1]');
          assert.match(await card.innerText(), /9月27日.*5:30〜.*22:30〜/);
          assert.match(await card.innerText(), /みんなと絶対にファイナル行くんだから/);
          const link=card.getByRole('link',{name:'SHOWROOMで最新の案内を見る'});
          assert.equal(await link.getAttribute('href'),'https://www.showroom-live.com/r/circle2026_0734');
          assert.equal(await link.getAttribute('target'),'_blank');
          assert.match(await link.getAttribute('rel'),/noopener/);
          const imageState=await photo.evaluate(img=>({loaded:img.complete&&img.naturalWidth>0,ratio:img.getBoundingClientRect().width/img.getBoundingClientRect().height,fit:getComputedStyle(img).objectFit}));
          assert.ok(imageState.loaded);
          assert.ok(Math.abs(imageState.ratio-1206/666)<0.01,'Photo keeps its full composition');
          assert.equal(imageState.fit,'contain');
          assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Document overflow');
          assert.deepEqual(errors,[],'Page JavaScript errors');
          await card.screenshot({path:join(output,`${engine}-${width}-${route==='/'?'home':'news'}.png`)});
          results.push({engine,width,route,status:'passed',imageState,errors:[...errors]});
        }
        await page.close();
      }
    } finally { await browser.close(); }
  }
} finally {
  await writeFile(join(output,'results.json'),JSON.stringify({head:process.env.PR_HEAD_SHA||null,results},null,2));
}
console.log(JSON.stringify(results));
