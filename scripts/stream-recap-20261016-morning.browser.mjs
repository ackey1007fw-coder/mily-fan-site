import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { streamRecap20261016Asa as recap } from '../src/data/streamRecap20261016Asa.ts';
import { streamRecap20261016Night as latestRecap } from '../src/data/streamRecap20261016Night.ts';
import { streamRecap20261017Asa as longRecap } from '../src/data/streamRecap20261017Asa.ts';
import { streamRecaps } from '../src/data/streamRecaps.ts';

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
      const context = await browser.newContext({ viewport: { width, height } });
      const page = await context.newPage();
      page.on('pageerror', error => result.pageErrors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') result.consoleErrors.push({ text: message.text(), url: message.location().url }); });
      // Follow the existing CI fixture: only the local build is exercised.
      await context.route('**/*', route => {
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
      const morningIndex = ids.indexOf(`recap-${recap.id}`);
      assert.ok(morningIndex >= 0);
      assert.deepEqual(ids.slice(morningIndex, morningIndex + 4), [
        `recap-${recap.id}`, 'recap-2026-10-15-night-showroom',
        'recap-2026-10-15-morning-showroom', 'recap-2026-10-14-night-showroom',
      ]);
      assert.equal(ids.filter(id => id === `recap-${recap.id}`).length, 1);
      assert.equal(await card.locator('video, audio').count(), 0);
      const images = card.locator('img');
      assert.equal(await images.count(), 6, 'Representative plus five gallery images');
      await page.waitForTimeout(850);
      for (const image of await images.all()) {
        await image.scrollIntoViewIfNeeded();
        await page.waitForTimeout(850);
        await image.evaluate(item => item.decode());
        const src = await image.getAttribute('src');
        assert.ok([recap.image, ...recap.gallery].some(item => item.src === src));
        const size = await image.evaluate(item => ({ width: item.naturalWidth, height: item.naturalHeight }));
        assert.deepEqual(size, { width: 640, height: 360 });
      }
      assert.equal(await card.locator('a[download]').count(), 5, 'Every gallery image can be saved');
      assert.deepEqual(await card.locator('img').evaluateAll(items => [...new Set(items.map(item => item.getAttribute('src')))]), [recap.image.src, ...recap.gallery.filter(item => item !== recap.image).map(item => item.src)]);
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
      const nightCard = page.locator('#recap-2026-10-15-night-showroom');
      assert.equal(await nightCard.count(), 1, 'Night recap must not be duplicated');
      assert.equal(await nightCard.locator('img').count(), 3, 'Night representative plus two gallery images');
      assert.equal(await nightCard.locator('video, audio').count(), 0);
      await nightCard.locator(':scope > summary').click();
      assert.equal(await nightCard.getAttribute('open'), '');
      for (const image of await nightCard.locator('img').all()) {
        await image.scrollIntoViewIfNeeded();
        await page.waitForTimeout(850);
        await image.evaluate(item => item.decode());
        assert.ok(await image.evaluate(item => item.naturalWidth === 640 && item.naturalHeight === 360));
      }
      const nightContent = await nightCard.innerText();
      for (const snippet of ['夜の四次審査突破と感謝', 'セミファイナル', 'ラジオ']) assert.ok(nightContent.includes(snippet), snippet);
      const nightLab = nightCard.locator('a[href="/data-lab/#night-20261015"]');
      assert.equal(await nightLab.count(), 1, 'Link to the independent night data lab');
      const nextMorning = nightCard.locator('a[href="/activities/live/#recap-2026-10-16-morning-showroom"]');
      assert.equal(await nextMorning.count(), 1, 'Related morning article');
      const nightSource = nightCard.locator('[data-recap-source]');
      assert.ok((await nightSource.innerText()).includes('出典：2026年10月15日 夜のSHOWROOM配信'));
      const nightVerification = nightSource.locator('[data-recap-verification]');
      await nightVerification.locator(':scope > summary').click();
      assert.equal(await nightVerification.getAttribute('open'), '');
      assert.ok((await nightVerification.innerText()).includes('総訪問と配信終了時の数値は未取得'));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        'Night recap must not overflow the viewport');
      const nightBounds = await nightCard.boundingBox();
      assert.ok(nightBounds && nightBounds.x >= -1 && nightBounds.x + nightBounds.width <= width + 1);
      const nightFile = `${engine}-${width}-night-20261015.png`;
      await nightCard.screenshot({ path: join(output, nightFile) });
      result.screenshots.push(nightFile);

      // Verify a real reader can FIND the night recap above the expanded morning story.
      await page.goto(`${origin}/activities/live/`, { waitUntil: 'networkidle' });
      const jumpNav = page.getByRole('navigation', { name: '最新の配信メモへ移動' });
      assert.equal(await jumpNav.count(), 1, 'Recent recap jump menu exists above cards');
      const jumpLinks = jumpNav.locator('a[href^="#recap-"]');
      assert.equal(await jumpLinks.count(), 3);
      assert.deepEqual(
        await jumpLinks.evaluateAll(links => links.map(link => link.getAttribute('href'))),
        streamRecaps.slice(0, 3).map(item => '#recap-' + item.id),
        'The newest-three jump menu follows the real current archive instead of freezing on older articles',
      );
      const jumpScreenshot = `${engine}-${width}-recent-links.png`;
      await jumpNav.screenshot({ path: join(output, jumpScreenshot) });
      result.screenshots.push(jumpScreenshot);
      const selectedJump = await jumpLinks.last().getAttribute('href');
      assert.ok(selectedJump?.startsWith('#recap-'));
      await jumpLinks.last().click();
      await page.waitForFunction(href => {
        const target = document.querySelector(href);
        return location.hash === href && target?.open;
      }, selectedJump);
      await page.waitForTimeout(850);
      const selectedTop = await page.locator(selectedJump).evaluate(el => el.getBoundingClientRect().top);
      assert.ok(selectedTop >= -30 && selectedTop < height * 0.8,
        'A current newest-three jump brings its actual target into view, top=' + selectedTop);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        'Jump menu and night recap do not overflow the screen');

      // Verify a cold-load deep link, including the in-app-browser mobile widths.
      await page.goto(`${origin}/activities/live/#recap-2026-10-15-night-showroom`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.getElementById('recap-2026-10-15-night-showroom')?.open);
      await page.waitForTimeout(850);
      const directTop = await nightCard.evaluate(el => el.getBoundingClientRect().top);
      assert.ok(directTop >= -30 && directTop < height * 0.8,
        'Cold-link night recap becomes visible, top=' + directTop);

      // Exercise the new night article through the same reader flow on all three viewports.
      await page.goto(`${origin}/activities/live/#recap-${latestRecap.id}`, { waitUntil: 'networkidle' });
      const latestCard = page.locator(`#recap-${latestRecap.id}`);
      assert.equal(await latestCard.count(), 1);
      assert.equal(await latestCard.getAttribute('open'), '');
      assert.equal(await latestCard.getByRole('heading', { name: latestRecap.theme, exact: true }).count(), 1);
      assert.ok((await latestCard.innerText()).includes(latestRecap.summary));
      assert.equal(await latestCard.locator('video, audio').count(), 0);
      assert.equal(await latestCard.locator('img').count(), latestRecap.gallery.length + 1);
      assert.equal(await latestCard.locator('a[download]').count(), latestRecap.gallery.length);
      for (const image of await latestCard.locator('img').all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(item => item.decode());
        assert.ok(await image.evaluate(item => item.naturalWidth === 640 && item.naturalHeight === 360));
      }
      assert.equal(await latestCard.locator('a[href="/data-lab/#night-20261016"]').count(), 1);
      const latestVerification = latestCard.locator('[data-recap-verification]');
      assert.equal(await latestVerification.getAttribute('open'), null);
      await latestVerification.locator(':scope > summary').click();
      for (const snippet of ['全編の手動聴取は行っておらず', '完全収録は未確定', '配信終了時の最終値は未確定', '記録の確認日：2026.10.17']) {
        assert.ok((await latestVerification.innerText()).includes(snippet), snippet);
      }
      await latestCard.locator(':scope > summary').scrollIntoViewIfNeeded();
      const latestTop = await latestCard.evaluate(el => el.getBoundingClientRect().top);
      assert.ok(latestTop >= -30 && latestTop < height * 0.8);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      const latestFile = `${engine}-${width}-night-20261016.png`;
      await latestCard.screenshot({ path: join(output, latestFile) });
      result.screenshots.push(latestFile);
      // Verify the new 10/17 long-morning article in the same Chromium/WebKit/mobile matrix.
      await page.goto(`${origin}/activities/live/#recap-${longRecap.id}`, { waitUntil: 'networkidle' });
      const longCard = page.locator(`#recap-${longRecap.id}`);
      assert.equal(await longCard.count(), 1);
      assert.equal(await longCard.getAttribute('open'), '');
      assert.equal(await longCard.getByRole('heading', { name: longRecap.theme, exact: true }).count(), 1);
      assert.ok((await longCard.innerText()).includes(longRecap.summary));
      assert.equal(await longCard.locator('video, audio').count(), 0);
      assert.equal(await longCard.locator('img').count(), longRecap.gallery.length + 1);
      assert.equal(await longCard.locator('a[download]').count(), longRecap.gallery.length);
      const longImages = await longCard.locator('img').all();
      assert.equal(longImages.length, 12);
      for (const image of longImages) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(item => item.decode());
        assert.ok(await image.evaluate(item => item.naturalWidth === 640 && item.naturalHeight === 360));
        const src = await image.getAttribute('src');
        assert.ok(longRecap.gallery.some(item => item.src === src));
      }
      assert.equal(await longCard.locator('a[href="/data-lab/reports/20261017-morning/"]').count(), 1);
      const longSource = longCard.locator('[data-recap-source]');
      assert.ok((await longSource.innerText()).includes('2026年10月17日 朝のSHOWROOMロング配信'));
      const longProof = longSource.locator('[data-recap-verification]');
      assert.equal(await longProof.getAttribute('open'), null);
      await longProof.locator(':scope > summary').click();
      const details17 = await longProof.innerText();
      for (const sentence of ['654処理チャンク','約123分','全編の手動聴取と逐語校正は行っていません']) {
        assert.ok(details17.includes(sentence), sentence);
      }
      await longCard.locator(':scope > summary').scrollIntoViewIfNeeded();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      const longBounds = await longCard.boundingBox();
      assert.ok(longBounds && longBounds.x >= -1 && longBounds.x + longBounds.width <= width + 1);
      const longFile = `${engine}-${width}-morning-20261017-long.png`;
      await longCard.screenshot({ path: join(output, longFile) });
      result.screenshots.push(longFile);

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
