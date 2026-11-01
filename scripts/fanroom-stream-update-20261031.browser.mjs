import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
const require = createRequire(import.meta.url);
const { chromium, webkit } = require(path.join(process.env.PLAYWRIGHT_MODULE_ROOT, 'playwright'));
const base = 'http://127.0.0.1:4188';
const TITLE = '夜は21:05から仮装配信🎃 10月31日のSHOWROOM案内';
const LOAD_MORE = 'もっと見る';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4188','--strictPort'],{stdio:'ignore'});
try {
  let ready = false;
  for (let i=0;i<60;i++) { try { if ((await fetch(base)).ok) { ready=true; break; } } catch {} await delay(200); }
  assert.ok(ready);
  for (const [engine, launcher] of [['chromium',chromium],['webkit',webkit]]) {
    const browser = await launcher.launch();
    try {
      for (const width of [390,1440]) {
        const page = await browser.newPage({viewport:{width,height:1000}});
        await page.clock.install({time:new Date('2026-10-31T11:00:00+09:00')});
        await page.route('**/api/**',route=>route.fulfill({json:{ok:false,slots:[]}}));
        for (const route of ['/','/news/','/support/','/activities/live/']) {
          await page.goto(base+route,{waitUntil:'domcontentloaded'});
          if (route === '/' || route === '/news/') {
            const card = page.locator('#latest').getByText(TITLE,{exact:true});
            if (route === '/' && (await card.count()) === 0) {
              assert.equal(await page.locator('#latest li').count(), 3, 'HOME keeps three latest NEWS cards');
            } else {
              if (route === '/news/') {
                const more = page.getByRole('button',{name:LOAD_MORE,exact:true});
                for (let i=0; !(await card.count()) && await more.count() && i<40; i++) await more.click();
              }
              await card.waitFor();
              const latest = await page.locator('#latest').innerText();
              assert.match(latest,/15:52更新.*21:05〜21:50/);
              assert.match(latest,/朝の案内の履歴/);
            }
          }
          if (route !== '/news/') {
            const notice = page.locator('#announced-stream');
            await notice.getByText('10月31日・本人告知の配信予定',{exact:true}).waitFor();
            assert.match(await notice.innerText(),/14:45〜15:15/);
            assert.match(await notice.innerText(),/21:05〜21:50/);
            assert.doesNotMatch(await notice.innerText(),/07:00〜07:30|21:00/);
            const link=notice.getByRole('link',{name:'本人ファンルームで最新の案内を見る'});
            assert.equal(await link.getAttribute('href'),'https://www.showroom-live.com/room/fan_club?room_id=573253');
            assert.match(await link.getAttribute('rel'),/noopener/);
          }
          if (route === '/support/') {
            const calendar = page.locator('section[aria-labelledby="selected-day-schedule-heading"]');
            assert.match(await calendar.innerText(), /21:05〜21:50/);
            assert.doesNotMatch(await calendar.innerText(), /21:00/);
          }
          assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1),'no horizontal overflow');
        }
        await page.clock.fastForward(11*60*60*1000);
        await page.locator('#announced-stream').waitFor({state:'detached',timeout:10000});
        assert.equal(await page.locator('#announced-stream').count(),0,'finished slots vanish without reload');
        console.log(JSON.stringify({engine,width,passed:true}));
        await page.close();
      }
    } finally { await browser.close(); }
  }
} finally { server.kill(); }
