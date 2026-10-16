import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { streamRecap20261016Asa as recap } from '../src/data/streamRecap20261016Asa.ts';

const tools = process.env.PLAYWRIGHT_MODULE_ROOT;
assert.ok(tools, 'Use the existing CI Playwright installation');
assert.match(process.env.PR_HEAD_SHA || '', /^[a-f0-9]{40}$/, 'Record the exact tested head');
const engines = await import(pathToFileURL(join(tools, 'playwright/index.mjs')).href);
const output = join(process.env.SONG_CATALOG_ARTIFACT_DIR || 'qa-artifacts', 'morning-20261016');
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
    const result = { engine, viewport: { width, height }, screenshots: [], pageErrors: [], consoleErrors: [], unavailableApiFixtures: [], passed: false };
    results.push(result);
    try {
      const page = await browser.newPage({ viewport: { width, height } });
      page.on('pageerror', error => result.pageErrors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') result.consoleErrors.push({ text: message.text(), url: message.location().url }); });
      // Follow the existing CI fixture: only the local build is exercised.
      await page.route('**/*', route => {
        const url = new URL(route.request().url());
        if (url.origin !== origin) {
          if (route.request().resourceType() === 'stylesheet') return route.fulfill({ status: 200, contentType: 'text/css', body: '' });
          return route.fulfill({ status: 204, body: '' });
        }
        // Vite preview has no serverless API. Use the same unavailable-API
        // fixture as the existing browser checks, without inventing live data.
        if (url.pathname.startsWith('/api/')) {
          result.unavailableApiFixtures.push(url.href);
          return route.fulfill({ status: 503, contentType: 'application/json', body: '{}' });
        }
        return route.continue();
      });
      await page.goto(`${origin}/activities/live/#recap-${recap.id}`, { waitUntil: 'networkidle' });
      const card = page.locator(`#recap-${recap.id}`);
      assert.equal(await card.getAttribute('open'), '');
      assert.equal(await card.getByRole('heading', { name: recap.theme, exact: true }).count(), 1);
      assert.ok((await card.innerText()).includes(recap.dateLabel));
      assert.ok((await card.innerText()).includes(recap.broadcastLabel));
      assert.ok((await card.innerText()).includes(recap.summary));
      const ids = await page.locator('details[id^="recap-"]').evaluateAll(cards => cards.map(item => item.id));
      assert.deepEqual(ids.slice(0, 3), [
        `recap-${recap.id}`, 'recap-2026-10-15-morning-showroom', 'recap-2026-10-14-night-showroom',
      ]);
      assert.equal(ids.filter(id => id === `recap-${recap.id}`).length, 1);
      assert.equal(await card.locator('video, audio').count(), 0);
      const images = card.locator('img');
      assert.equal(await images.count(), 1, 'The single approved frame must appear only once');
      await images.last().scrollIntoViewIfNeeded();
      await images.last().evaluate(image => image.decode());
      for (const image of await images.all()) {
        assert.equal(await image.getAttribute('src'), recap.image.src);
        const size = await image.evaluate(item => ({ width: item.naturalWidth, height: item.naturalHeight }));
        assert.deepEqual(size, { width: 380, height: 360 });
      }
      assert.equal(await card.locator('a[download]').count(), 0, 'No duplicate singleton gallery');
      const lab = card.getByRole('link', { name: 'MILY SIGNAL・10月16日朝の匿名分析 ↗', exact: true });
      assert.equal(await lab.getAttribute('href'), '/data-lab/#morning-20261016');
      assert.equal(await lab.getAttribute('rel'), 'noopener noreferrer');
      const labPage = await page.context().newPage();
      await labPage.goto(`${origin}/data-lab/#morning-20261016`);
      assert.equal(await labPage.locator('#morning-20261016').count(), 1);
      await labPage.close();
      const source = card.locator('[data-recap-source]');
      const verification = source.locator('[data-recap-verification]');
      assert.equal(await verification.getAttribute('open'), null);
      assert.ok((await source.innerText()).includes('出典：2026年10月16日 朝のSHOWROOM配信'));
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
      for (const text of ['全編の手動聴取は行っておらず', '完全収録は未確定です。', '実映像との厳密な同期は未確認です。', '配信終了時の最終値は未確定です。', '記録の確認日：2026.10.16']) assert.ok(details.includes(text), text);
      assert.ok(!details.includes('画角外'), 'Production instructions belong in the ledger');
      await capture('source-open');
      await card.locator(':scope > summary').click();
      assert.equal(await card.getAttribute('open'), null);
      await capture('card-closed');
      await card.locator(':scope > summary').click();
      assert.equal(await card.getAttribute('open'), '');
      assert.deepEqual(result.pageErrors, []);
      const unexpectedConsoleErrors = result.consoleErrors.filter(error =>
        !result.unavailableApiFixtures.includes(error.url) || !/^Failed to load resource:.*503/.test(error.text));
      assert.deepEqual(unexpectedConsoleErrors, []);
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
