import assert from 'node:assert/strict';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join, extname, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

assert.ok(process.env.PLAYWRIGHT_MODULE_ROOT, 'Isolated Playwright module path required');
const { chromium, webkit } = await import(pathToFileURL(join(process.env.PLAYWRIGHT_MODULE_ROOT, 'playwright/index.mjs')).href);
const root = resolve('dist');
const output = join(process.env.SONG_CATALOG_ARTIFACT_DIR || 'qa-artifacts', 'announced-stream-20261008');
const source = 'https://x.com/Mily_chan36/status/2107858042541023674';
const initialTime = new Date('2026-10-08T12:57:00+09:00');
const results = [];
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp4': 'video/mp4' };
await mkdir(output, { recursive: true });

try {
  for (const [engine, launcher] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await launcher.launch({ headless: true });
    try {
      for (const width of [320, 390, 430, 1440]) {
        for (const apiState of ['empty', 'unavailable']) {
          const page = await browser.newPage({ viewport: { width, height: 900 } });
          const errors = [];
          page.on('pageerror', error => errors.push(error.message));
          await page.clock.install({ time: initialTime });
          await page.clock.pauseAt(initialTime);
          await page.route('**/*', async route => {
            const url = new URL(route.request().url());
            if (url.hostname !== 'site.test') return route.fulfill({ status: 204, body: '' });
            if (url.pathname === '/api/mily-schedule' && apiState === 'empty') {
              return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, slots: [], roomUrl: null }) });
            }
            if (url.pathname.startsWith('/api/')) return route.fulfill({ status: 503, contentType: 'application/json', body: '{}' });
            let file = resolve(root, '.' + decodeURIComponent(url.pathname));
            const rel = relative(root, file);
            if (rel === '..' || rel.startsWith('..' + sep)) return route.fulfill({ status: 403, body: '' });
            try {
              if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
              await route.fulfill({ status: 200, contentType: mime[extname(file)] || 'application/octet-stream', body: await readFile(file) });
            } catch { await route.fulfill({ status: 404, body: 'Not found' }); }
          });
          for (const path of ['/', '/support/']) {
            await page.goto('https://site.test' + path, { waitUntil: 'networkidle' });
            const card = page.locator('#announced-stream');
            await card.waitFor();
            await card.scrollIntoViewIfNeeded();
            assert.equal(await card.count(), 1);
            assert.deepEqual(await card.locator('li span').allTextContents(), ['10/8(木) 14:40〜15:20', '10/8(木) 21:30〜22:10']);
            const text = await card.innerText();
            assert.match(text, /本人X/);
            assert.match(text, /JST/);
            assert.match(text, /実配信の記録ではありません/);
            assert.match(text, /1\.2倍DAY/);
            assert.doesNotMatch(text, /5:50|6:30|配信中|未案内/);
            assert.equal(await card.locator('img').count(), 0, 'Old poster must not represent the October 8 source');
            const link = card.locator(`a[href="${source}"]`);
            assert.equal(await link.count(), 1);
            assert.equal(await link.getAttribute('target'), '_blank');
            assert.match(await link.getAttribute('rel'), /noopener/);
            assert.ok((await link.boundingBox()).height >= 44);
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Document overflow');
            const overflow = await card.evaluate(element => [...element.querySelectorAll('h2,p,li,a')].filter(node => {
              const box = node.getBoundingClientRect();
              return box.width > 0 && (box.left < -1 || box.right > innerWidth + 1);
            }).map(node => node.tagName));
            assert.deepEqual(overflow, [], 'Announcement must fit the viewport');
            assert.deepEqual(errors, [], 'Page JavaScript errors');
            await card.screenshot({ path: join(output, `${engine}-${width}-${apiState}-${path === '/' ? 'home' : 'support'}.png`) });
            results.push({ engine, width, apiState, path, status: 'passed', slots: 2, overflow: false, errors: [...errors] });
          }
          // Keep the Support page mounted and cross both expiry boundaries without reloading.
          await page.clock.fastForward(Date.parse('2026-10-08T15:20:00+09:00') - initialTime.getTime());
          await page.waitForFunction(() => document.querySelectorAll('#announced-stream li').length === 1);
          assert.match(await page.locator('#announced-stream li').innerText(), /21:30〜22:10/);
          await page.clock.fastForward(Date.parse('2026-10-08T22:10:00+09:00') - Date.parse('2026-10-08T15:20:00+09:00'));
          await page.waitForFunction(() => !document.querySelector('#announced-stream'));
          results.push({ engine, width, apiState, path: '/support/', status: 'passed', mountedExpiry: ['15:20', '22:10'] });
          await page.close();
        }
      }
    } finally { await browser.close(); }
  }
} finally {
  await writeFile(join(output, 'results.json'), JSON.stringify({ head: process.env.PR_HEAD_SHA || null, builtFrom: 'PR CI merge ref', results }, null, 2));
}
console.log(JSON.stringify(results));
