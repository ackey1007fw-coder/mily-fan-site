import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { streamRecaps } from '../src/data/streamRecaps.ts';
const ids = ['2026-10-01-morning-showroom', '2026-09-30-night-showroom', '2026-09-30-day-showroom', '2026-09-30-morning-showroom'];
const recaps = ids.map(id => { const item = streamRecaps.find(recap => recap.id === id); assert.ok(item, id); return item; });
const tools = process.env.PLAYWRIGHT_MODULE_ROOT;
assert.ok(tools);
const engines = await import(pathToFileURL(join(tools, 'playwright/index.mjs')).href);
const output = join(process.env.SONG_CATALOG_ARTIFACT_DIR || 'qa-artifacts', 'four-streams-20260930-20261001');
await mkdir(output, { recursive: true });
const origin = 'http://127.0.0.1:4181';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4181', '--strictPort'], { stdio: 'ignore' });
const results = [];
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try { ready = (await fetch(origin)).ok; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready);
  for (const [engine, width, height] of [['chromium', 320, 850], ['webkit', 390, 844], ['chromium', 1440, 1000]]) {
    const browser = await engines[engine].launch({ headless: true, ...(engine === 'chromium' && process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}) });
    try {
      const page = await browser.newPage({ viewport: { width, height } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.fulfill({ status: 204, body: '' }));
      for (const recap of recaps) {
      const clipData = recap.highlights.flatMap(item => item.clip ? [item.clip] : []);
      const hourlyCount = new Set(recap.gallery.map(image => image.galleryHour)).size;
      await page.goto(`${origin}/activities/live/#recap-${recap.id}`, { waitUntil: 'networkidle' });
      const card = page.locator(`#recap-${recap.id}`);
      await page.waitForFunction(id => document.getElementById(id)?.hasAttribute('open'), `recap-${recap.id}`);
      assert.equal(await card.getAttribute('open'), '');
      assert.equal(await card.getByRole('heading', { name: recap.theme, exact: true }).count(), 1);
      assert.equal(await card.locator('img').count(), recap.gallery.length + 1);
      assert.equal(await card.getByRole('heading', { name: /録画 \d:00〜の5枚/, level: 5 }).count(), hourlyCount);
      for (const image of await card.locator('img').all()) {
        await image.scrollIntoViewIfNeeded();
        // Lazy-loaded gallery images may not have a selected source until the next frame.
        await page.waitForFunction(img => img.complete && img.naturalWidth > 0, await image.elementHandle());
        await image.evaluate(img => img.decode());
        assert.equal(await image.evaluate(img => img.naturalWidth), 640);
      }
      const zip = card.getByRole('link', { name: recap.galleryZip.label, exact: true });
      assert.equal(await zip.getAttribute('href'), recap.galleryZip.src);
      assert.equal(await zip.getAttribute('download'), recap.galleryZip.filename);
      assert.equal((await page.request.get(origin + recap.galleryZip.src)).status(), 200);
      for (const link of recap.highlights.flatMap(h => h.socialClip?.links || [])) {
        const anchor = card.locator(`a[href="${link.url}"]`);
        assert.equal(await anchor.count(), 1);
        assert.equal(await anchor.getAttribute('target'), '_blank');
        assert.match(await anchor.getAttribute('rel'), /noopener/);
      }
      const videos = card.locator('video');
      assert.equal(await videos.count(), hourlyCount);
      for (let i = 0; i < clipData.length; i++) {
        const video = videos.nth(i);
        await video.scrollIntoViewIfNeeded();
        await video.evaluate(v => { v.muted = true; v.load(); });
        await video.evaluate(v => Promise.race([v.play(), new Promise((_, reject) => setTimeout(() => reject(new Error('Video playback timed out')), 15000))]));
        await page.waitForFunction(v => v.currentTime > 0, await video.elementHandle());
        assert.ok(Math.abs(await video.evaluate(v => v.duration) - clipData[i].durationSeconds) < .25);
        await video.evaluate(v => v.pause());
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      assert.deepEqual(errors, []);
      await card.locator(':scope > summary').scrollIntoViewIfNeeded();
      await page.screenshot({ path: join(output, `${recap.id}-${engine}-${width}.png`) });
      results.push({ id: recap.id, engine, width, stills: recap.gallery.length, playableClips: clipData.length, zip: '200', overflow: false, errors });
      }
    } finally { await browser.close(); }
  }
} finally {
  server.kill('SIGTERM');
  await writeFile(join(output, 'results.json'), JSON.stringify({ head: process.env.PR_HEAD_SHA || null, results }, null, 2));
}
console.log(JSON.stringify(results));
