import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { streamRecap1109Morning as recap } from '../src/data/streamRecap1109Morning.ts';
const root = process.env.PLAYWRIGHT_MODULE_ROOT;
assert.ok(root, 'Use CI browser tooling');
const engines = await import(pathToFileURL(join(root, 'playwright/index.mjs')).href);
const origin = 'http://127.0.0.1:4191';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4191', '--strictPort'], { stdio: 'ignore' });
try {
  let ready = false;
  for (let n = 0; n < 100; n++) {
    try { ready = (await fetch(origin)).ok; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready);
  for (const [engine, width] of [['chromium', 390], ['webkit', 390], ['chromium', 1440]]) {
    const browser = await engines[engine].launch({ headless: true });
    try {
      const context = await browser.newContext({ viewport: { width, height: 1000 } });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await context.route('**/*', route => {
        const url = new URL(route.request().url());
        if (url.origin !== origin) return route.fulfill({ status: 204, body: '' });
        if (url.pathname.startsWith('/api/')) return route.fulfill({ status: 503, contentType: 'application/json', body: '{}' });
        return route.continue();
      });
      const response = await page.goto(`${origin}/activities/live/#recap-${recap.id}`, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      const card = page.locator(`#recap-${recap.id}`);
      assert.equal(await card.count(), 1);
      await page.waitForFunction(id => document.getElementById(id)?.open, `recap-${recap.id}`);
      assert.equal(await card.getByRole('heading', { name: recap.theme, exact: true }).count(), 1);
      assert.ok((await card.innerText()).includes(recap.summary));
      assert.equal(await card.locator('img,video,audio').count(), 0);
      const verification = card.locator('[data-recap-verification]');
      await verification.locator(':scope > summary').click();
      const text = await verification.innerText();
      for (const phrase of ['手動聴取・逐語校正は未実施', '約49秒', '連続性は未確認']) assert.ok(text.includes(phrase), phrase);
      await card.locator(':scope > summary').click();
      assert.equal(await card.getAttribute('open'), null);
      await card.locator(':scope > summary').click();
      assert.equal(await card.getAttribute('open'), '');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      const rect = await card.boundingBox();
      assert.ok(rect.x >= -1 && rect.x + rect.width <= width + 1);
      assert.deepEqual(errors, []);
      console.log(`${engine} ${width}: morning recap, disclosure, repeat toggle, no overflow PASS`);
    } finally { await browser.close(); }
  }
} finally { server.kill('SIGTERM'); }
