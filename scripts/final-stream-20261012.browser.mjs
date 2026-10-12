import assert from 'node:assert/strict';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join, extname, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

assert.ok(process.env.PLAYWRIGHT_MODULE_ROOT);
const { chromium, webkit } = await import(pathToFileURL(join(process.env.PLAYWRIGHT_MODULE_ROOT, 'playwright/index.mjs')).href);
const root = resolve('dist');
const output = join(process.env.SONG_CATALOG_ARTIFACT_DIR || '../qa', 'final-stream-20261012');
const roomUrl = 'https://www.showroom-live.com/r/circle2026_0734';
const initialTime = new Date('2026-10-12T09:24:14+09:00');
const results = [];
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp4': 'video/mp4' };
await mkdir(output, { recursive: true });

try {
  for (const [engine, launcher] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await launcher.launch({ headless: true });
    try {
      for (const width of [390, 1440]) for (const apiState of ['empty', 'unavailable', 'matching', 'changed', 'next']) {
        const page = await browser.newPage({ viewport: { width, height: 1000 } });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.clock.install({ time: initialTime });
        await page.clock.pauseAt(initialTime);
        await page.route('**/*', async route => {
          const url = new URL(route.request().url());
          if (url.hostname !== 'site.test') return route.fulfill({ status: 204, body: '' });
          if (url.pathname === '/api/mily-schedule' && apiState !== 'unavailable') return route.fulfill({
            status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true,
              slots: ['matching', 'changed'].includes(apiState) ? [{ date: '2026-10-12', time: apiState === 'changed' ? '20:55' : '21:00' }] : [], source: { roomUrl } }),
          });
          if (url.pathname === '/api/mily-live' && apiState !== 'unavailable') return route.fulfill({
            status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, roomUrl,
              live: { state: 'offline', liveId: null, startedAt: null, observedAt: initialTime.toISOString() },
              next: { state: apiState === 'next' ? 'scheduled' : 'none', at: apiState === 'next' ? '2026-10-12T11:55:00.000Z' : null } }),
          });
          if (url.pathname.startsWith('/api/')) return route.fulfill({ status: 503, contentType: 'application/json', body: '{}' });
          let file = resolve(root, '.' + decodeURIComponent(url.pathname));
          const rel = relative(root, file);
          if (rel === '..' || rel.startsWith('..' + sep)) return route.fulfill({ status: 403, body: '' });
          try {
            if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
            await route.fulfill({ status: 200, contentType: mime[extname(file)] || 'application/octet-stream', body: await readFile(file) });
          } catch { await route.fulfill({ status: 404, body: 'Not found' }); }
        });
        for (const path of ['/', '/support/', '/activities/live/']) {
          await page.goto('https://site.test' + path, { waitUntil: 'networkidle' });
          const card = page.locator('#announced-stream');
          await card.waitFor();
          const expected = ['changed', 'next'].includes(apiState) ? '10/12(月) 20:55開始予定' : '10/12(月) 21:00〜21:59';
          assert.deepEqual(await card.locator('li span').allTextContents(), [expected]);
          assert.match(await card.innerText(), /少し早まる可能性/);
          assert.match(await card.innerText(), /SHOWROOM審査は10\/12 21:59まで。WEB投票は10\/12 23:59まで/);
          assert.equal(await card.locator(`a[href="${roomUrl}"]`).count(), 1);
          assert.equal(await card.locator('a[href="https://liff.line.me/1656040756-GwmBkdPY/vote/misscircle2026/N/734"]').count(), 1);
          assert.equal(await card.locator('a[href="https://www.showroom-live.com/event/circle2026_4th"]').count(), 1);
          assert.equal(await card.locator('a[href="/support/"]').count(), path === '/support/' ? 0 : 1);
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          if (path === '/support/') {
            const agenda = page.getByRole('region', { name: '2026年10月12日(月)の予定', exact: true });
            assert.equal(await agenda.locator('li').filter({ hasText: /SHOWROOM(?:配信予定|最終枠)/ }).count(), 1);
            assert.match(await agenda.innerText(), ['changed', 'next'].includes(apiState) ? /20:55/ : /21:00〜21:59/);
          }
          if (engine === 'chromium' && apiState === 'empty') {
            await card.scrollIntoViewIfNeeded();
            await card.screenshot({ path: join(output, `${width}-${path === '/' ? 'home' : path === '/support/' ? 'support' : 'live'}.png`) });
          }
          assert.deepEqual(errors, []);
          results.push({ engine, width, apiState, path, status: 'passed', overflow: false });
        }
        await page.goto('https://site.test/support/', { waitUntil: 'networkidle' });
        await page.clock.fastForward(Date.parse('2026-10-12T21:59:00+09:00') - initialTime.getTime());
        await page.waitForFunction(() => !document.querySelector('#announced-stream'));
        await page.clock.fastForward(60_000);
        assert.equal(await page.locator('aside[aria-label="MISS CIRCLE WEB投票のご案内"]').count(), 1);
        assert.match(await page.locator('aside[aria-label="MISS CIRCLE WEB投票のご案内"]').innerText(), /23:59/);
        await page.clock.fastForward(Date.parse('2026-10-13T00:00:00+09:00') - Date.parse('2026-10-12T22:00:00+09:00'));
        await page.waitForFunction(() => !document.querySelector('aside[aria-label="MISS CIRCLE WEB投票のご案内"]'));
        assert.deepEqual(errors, []);
        results.push({ engine, width, apiState, status: 'passed', mountedExpiry: ['21:59', '24:00'], voteRemainsAt22: true });
        await page.close();
      }
    } finally { await browser.close(); }
  }
} finally { await writeFile(join(output, 'results.json'), JSON.stringify({ head: process.env.PR_HEAD_SHA || null, results }, null, 2)); }
console.log(JSON.stringify({ passed: results.length }));
