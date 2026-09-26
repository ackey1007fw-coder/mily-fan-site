import assert from 'node:assert/strict';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join, extname, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
const tools = process.env.PLAYWRIGHT_MODULE_ROOT;
assert.ok(tools, 'Isolated Playwright module path required');
const { chromium, webkit } = await import(pathToFileURL(join(tools, 'playwright/index.mjs')).href);
const root = resolve('dist');
const output = join(process.env.AD_REWARD_ARTIFACT_DIR || process.env.SONG_CATALOG_ARTIFACT_DIR || 'qa-artifacts', 'ad-reward');
const lottery = 'https://www.showroom-live.com/lottery/ad_reward/2';
const room = process.env.AD_REWARD_ROOM_URL;
assert.match(room || '', /^https:\/\/www\.showroom-live\.com\/r\/[a-z0-9_]+$/);
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
        for (const route of ['/','/support/#showroom-ad-reward']) {
          await page.goto('https://site.test'+route,{waitUntil:'networkidle'});
          const support=route.startsWith('/support/');
          const card=page.locator(support?'#showroom-ad-reward':'[data-ad-reward-teaser], .ad-reward-teaser');
          await card.waitFor(); await card.scrollIntoViewIfNeeded();
          const primary=card.locator(`a[href="${lottery}"]`);
          assert.equal(await primary.count(),1);
          assert.equal(await primary.getAttribute('target'),'_blank');
          assert.match(await primary.getAttribute('rel'),/noopener/);
          assert.ok((await primary.boundingBox()).height>=44);
          if(support) {
            assert.equal(await card.locator('ol > li').count(),3);
            assert.equal(await card.locator(`a[href="${room}"]`).count(),1);
            const summary=card.locator('summary').first();
            await summary.focus(); await page.keyboard.press('Enter');
            assert.equal(await card.locator('details').first().getAttribute('open'),'');
            await page.keyboard.press('Enter');
            await card.scrollIntoViewIfNeeded();
          } else {
            assert.equal(await card.locator('a[href="/support/#showroom-ad-reward"]').count(),1);
          }
          assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Document overflow');
          const overflow=await card.evaluate(el=>[...el.querySelectorAll('h2,h3,p,li,summary,a')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.left < -1||r.right>innerWidth+1);}).map(e=>e.tagName));
          assert.deepEqual(overflow,[],'Guide content must fit the viewport');
          assert.deepEqual(errors,[],'Page JavaScript errors');
          await card.screenshot({path:join(output,`${engine}-${width}-${support?'support':'home'}.png`)});
          results.push({engine,width,route,status:'passed',errors:[...errors]});
        }
        await page.close();
      }
    } finally { await browser.close(); }
  }
} finally {
  await writeFile(join(output,'results.json'),JSON.stringify({head:process.env.PR_HEAD_SHA||null,results},null,2));
}
console.log(JSON.stringify(results));
