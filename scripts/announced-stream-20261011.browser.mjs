import assert from 'node:assert/strict';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join, extname, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

assert.ok(process.env.PLAYWRIGHT_MODULE_ROOT, 'Isolated Playwright module path required');
const { chromium, webkit } = await import(pathToFileURL(join(process.env.PLAYWRIGHT_MODULE_ROOT, 'playwright/index.mjs')).href);
const root = resolve('dist');
const output = join(process.env.SONG_CATALOG_ARTIFACT_DIR || 'qa-artifacts', 'announced-stream-20261011');
const source = 'https://x.com/Mily_chan36/status/2108935333199188393';
const roomUrl = 'https://www.showroom-live.com/r/circle2026_0734';
const initialTime = new Date('2026-10-11T06:29:59+09:00');
const results = [];
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp4': 'video/mp4' };
await mkdir(output, { recursive: true });

async function serveAsset(route, url) {
  let file = resolve(root, '.' + decodeURIComponent(url.pathname));
  const rel = relative(root, file);
  if (rel === '..' || rel.startsWith('..' + sep)) return route.fulfill({ status: 403, body: '' });
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    await route.fulfill({ status: 200, contentType: mime[extname(file)] || 'application/octet-stream', body: await readFile(file) });
  } catch { await route.fulfill({ status: 404, body: 'Not found' }); }
}

try {
  for (const [engine, launcher] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await launcher.launch({ headless: true });
    try {
      for (const width of [320, 390, 1440]) {
        for (const apiState of ['matching', 'empty', 'unavailable']) {
          const page = await browser.newPage({ viewport: { width, height: 900 } });
          const errors = [];
          page.on('pageerror', error => errors.push(error.message));
          await page.clock.install({ time: initialTime });
          await page.clock.pauseAt(initialTime);
          await page.route('**/*', async route => {
            const url = new URL(route.request().url());
            if (url.hostname !== 'site.test') return route.fulfill({ status: 204, body: '' });
            if (url.pathname === '/api/mily-schedule' && apiState !== 'unavailable') {
              return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, slots: apiState === 'matching' ? [{ date: '2026-10-11', time: '05:30' }, { date: '2026-10-11', time: '21:00' }] : [], source: { roomUrl } }) });
            }
            if (url.pathname === '/api/mily-live' && apiState === 'matching') {
              return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, roomUrl, live: { state: 'offline', liveId: null, startedAt: null, observedAt: new Date(await page.evaluate(() => Date.now())).toISOString() }, next: { state: 'scheduled', at: '2026-10-11T12:00:00.000Z' } }) });
            }
            if (url.pathname.startsWith('/api/')) return route.fulfill({ status: 503, contentType: 'application/json', body: '{}' });
            await serveAsset(route, url);
          });
          for (const path of ['/', '/support/']) {
            await page.goto('https://site.test' + path, { waitUntil: 'networkidle' });
            const card = page.locator('#announced-stream');
            await card.waitFor();
            await card.scrollIntoViewIfNeeded();
            assert.deepEqual(await card.locator('li span').allTextContents(), ['10/11(日) 05:30〜06:30', '10/11(日) 21:00〜22:00']);
            assert.equal(await card.locator('a[href="/support/"]').count(), path === '/' ? 1 : 0);
            const link = card.locator(`a[href="${source}"]`);
            assert.equal(await link.count(), 1);
            assert.equal(await link.getAttribute('target'), '_blank');
            assert.match(await link.getAttribute('rel'), /noopener/);
            assert.ok((await link.boundingBox()).height >= 44);
            assert.equal(await card.locator('img').count(), 0);
            assert.match(await card.innerText(), /実配信の記録ではありません/);
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          }
          await page.clock.fastForward(1000);
          await page.waitForFunction(() => document.querySelectorAll('#announced-stream li').length === 1);
          assert.deepEqual(await page.locator('#announced-stream li span').allTextContents(), ['10/11(日) 21:00〜22:00']);
          await page.clock.fastForward(Date.parse('2026-10-11T07:04:23+09:00') - Date.parse('2026-10-11T06:30:00+09:00'));
          for (const path of ['/', '/support/', '/activities/live/']) {
            await page.goto('https://site.test' + path, { waitUntil: 'networkidle' });
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
            const announcement = page.locator('#announced-stream');
            if (path !== '/activities/live/') {
              assert.deepEqual(await announcement.locator('li span').allTextContents(), ['10/11(日) 21:00〜22:00']);
              await announcement.scrollIntoViewIfNeeded();
              await announcement.screenshot({ path: join(output, `${engine}-${width}-${apiState}-${path === '/' ? 'home' : 'support'}.png`) });
            }
            const current = page.locator(path === '/' ? '#today' : path === '/support/' ? '#support-schedule' : '#activity-status');
            if (apiState === 'matching') {
              // The current API starts are retained, with the independently sourced end.
              assert.match(await page.locator('main').innerText(), /21:00〜22:00/);
              if (path === '/') assert.doesNotMatch(await current.innerText(), /05:30|5:34|終了時刻は確認できていません/);
            }
            assert.deepEqual(errors, []);
            results.push({ engine, width, apiState, path, status: 'passed', morningUpcoming: false, overflow: false });
          }
          await page.goto('https://site.test/support/', { waitUntil: 'networkidle' });
          await page.clock.fastForward(Date.parse('2026-10-11T22:00:00+09:00') - Date.parse('2026-10-11T07:04:23+09:00'));
          await page.waitForFunction(() => !document.querySelector('#announced-stream'));
          assert.deepEqual(errors, []);
          results.push({ engine, width, apiState, status: 'passed', mountedExpiry: ['06:30', '22:00'] });
          await page.close();
        }
      }
      // No known announcement/support boundary exists at this API-only slot's end.
      // Keep the page mounted and reuse the cached API response through periodic refreshes.
      const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const futureTime = new Date('2026-10-13T07:59:59+09:00');
      await page.clock.install({ time: futureTime });
      await page.clock.pauseAt(futureTime);
      await page.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.hostname !== 'site.test') return route.fulfill({ status: 204, body: '' });
        if (url.pathname === '/api/mily-schedule') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, slots: [{ date: '2026-10-13', time: '08:00', endTime: '08:01' }], source: { roomUrl } }) });
        if (url.pathname.startsWith('/api/')) return route.fulfill({ status: 503, contentType: 'application/json', body: '{}' });
        await serveAsset(route, url);
      });
      await page.goto('https://site.test/activities/live/', { waitUntil: 'networkidle' });
      const current = page.locator('section[aria-labelledby="live-current"]');
      await current.waitFor();
      assert.match(await current.innerText(), /10\/13\(火\) 08:00〜08:01/);
      await page.clock.fastForward(121_000);
      await page.waitForFunction(() => !document.querySelector('section[aria-labelledby="live-current"]')?.textContent.includes('08:00〜08:01'));
      assert.deepEqual(errors, []);
      results.push({ engine, width: 390, apiState: 'future-api-only', status: 'passed', mountedExpiry: '08:01', navigationOrFocus: false });
      await page.close();
    } finally { await browser.close(); }
  }
} finally {
  await writeFile(join(output, 'results.json'), JSON.stringify({ head: process.env.PR_HEAD_SHA || null, results }, null, 2));
}
console.log(JSON.stringify(results));
