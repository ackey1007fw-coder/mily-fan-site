import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { streamRecap20261008Asa as recap } from '../src/data/streamRecap20261008Asa.ts';

const tools = process.env.PLAYWRIGHT_MODULE_ROOT;
assert.ok(tools, 'Use the existing CI Playwright installation');
assert.match(process.env.PR_HEAD_SHA || '', /^[a-f0-9]{40}$/, 'Record the exact tested head');
const engines = await import(pathToFileURL(join(tools, 'playwright/index.mjs')).href);
const output = join(process.env.SONG_CATALOG_ARTIFACT_DIR || 'qa-artifacts', 'morning-20261008');
await mkdir(output, { recursive: true });
const origin = 'http://127.0.0.1:4180';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4180', '--strictPort'], { stdio: 'ignore' });
const results = [];
let failure = null;
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try { ready = (await fetch(origin)).ok; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, 'The existing CI build must be available');
  for (const [engine, width, height] of [['chromium', 320, 850], ['webkit', 390, 844], ['chromium', 1440, 1000]]) {
    const browser = await engines[engine].launch({ headless: true });
    const result = { engine, viewport: { width, height }, screenshots: [], pageErrors: [], consoleErrors: [], passed: false };
    results.push(result);
    try {
      const page = await browser.newPage({ viewport: { width, height } });
      page.on('pageerror', error => result.pageErrors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') result.consoleErrors.push(message.text()); });
      // Follow the existing CI fixture: only the local build is exercised.
      await page.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.fulfill({ status: 204, body: '' }));
      await page.goto(`${origin}/activities/live/#recap-${recap.id}`, { waitUntil: 'networkidle' });
      const card = page.locator(`#recap-${recap.id}`);
      assert.equal(await card.getAttribute('open'), '');
      assert.equal(await card.getByRole('heading', { name: recap.theme, exact: true }).count(), 1);
      assert.ok((await card.innerText()).includes('2026.10.08（木）'));
      assert.ok((await card.innerText()).includes('録画開始5:51頃〜 約43分'));
      assert.ok((await card.innerText()).includes(recap.summary));
      assert.equal(await card.locator('img, video, audio').count(), 0);
      const ids = await page.locator('details[id^="recap-"]').evaluateAll(cards => cards.map(item => item.id));
      assert.equal(ids[0], `recap-${recap.id}`);
      assert.equal(ids[1], 'recap-2026-10-07-noon-showroom');
      assert.ok(!ids.includes('recap-2026-10-07-night-showroom'));
      assert.equal(await page.locator('#recap-2026-10-07-noon-showroom img').count(), 3);
      const source = card.locator('[data-recap-source]');
      const verification = source.locator('[data-recap-verification]');
      assert.equal(await verification.getAttribute('open'), null);
      assert.ok((await source.innerText()).includes('出典：2026年10月8日 朝のSHOWROOM配信'));
      const capture = async state => {
        await card.locator(':scope > summary').scrollIntoViewIfNeeded();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        const bounds = await card.boundingBox();
        assert.ok(bounds && bounds.x >= -1 && bounds.x + bounds.width <= width + 1);
        const filename = `${engine}-${width}-${state}.png`;
        await card.screenshot({ path: join(output, filename) });
        result.screenshots.push(filename);
      };
      await capture('source-closed');
      await verification.locator(':scope > summary').click();
      assert.equal(await verification.getAttribute('open'), '');
      const details = await verification.innerText();
      for (const text of ['会話の詳細は未確認です。', '42分37.908秒', '映像は黒画面', '配信全体の開始・終了を確定していません。', '記録の確認日：2026.10.08']) assert.ok(details.includes(text), text);
      await capture('source-open');
      await card.locator(':scope > summary').click();
      assert.equal(await card.getAttribute('open'), null);
      await capture('card-closed');
      await card.locator(':scope > summary').click();
      assert.equal(await card.getAttribute('open'), '');
      assert.deepEqual(result.pageErrors, []);
      assert.deepEqual(result.consoleErrors, []);
      result.passed = true;
    } finally { await browser.close(); }
  }
} catch (error) {
  failure = error.message;
  throw error;
} finally {
  server.kill('SIGTERM');
  await writeFile(join(output, 'results.json'), JSON.stringify({ head: process.env.PR_HEAD_SHA, scope: 'GitHub CI local build; not Vercel Preview', recap: recap.id, failure, results }, null, 2));
}
console.log(JSON.stringify(results));
