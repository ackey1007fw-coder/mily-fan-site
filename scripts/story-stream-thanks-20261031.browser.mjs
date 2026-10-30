import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
const require = createRequire(import.meta.url);
const { chromium, webkit } = require(path.join(process.env.PLAYWRIGHT_MODULE_ROOT, "playwright"));
const port = 4187;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { stdio: "ignore" });
const poster = "/media/gallery/mily-b242-01-stream-thanks-story-poster.jpg";
const selector = `video[poster=\"${poster}\"]`;
const title = "応援への感謝と、ファイナルへの決意🩵 みりぃのStory";
const source = "https://www.instagram.com/mily_chan36";
try {
  let up = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try { if ((await fetch(base)).ok) { up = true; break; } } catch {}
    await delay(200);
  }
  assert.ok(up, "isolated preview server is ready");
  for (const [engine, launcher] of [["chromium", chromium], ["webkit", webkit]]) {
    const browser = await launcher.launch({ headless: true });
    try {
      for (const width of [390, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 1000 } });
        try {
          for (const route of ["/", "/news/"]) {
            await page.goto(base + route, { waitUntil: "domcontentloaded" });
            await page.getByRole("heading", { name: title, exact: true }).waitFor();
            const video = page.locator(selector);
            assert.equal(await video.count(), 1, "single Story player");
            assert.ok(await page.locator(`a[href=\"${source}\"]`).count() > 0);
            assert.equal(await video.getAttribute("preload"), "none");
            assert.ok(await video.evaluate(el => el.controls && el.playsInline && !el.autoplay));
            await video.scrollIntoViewIfNeeded();
            await video.evaluate(async el => { el.muted = true; await el.play(); });
            await page.waitForFunction(s => document.querySelector(s)?.currentTime > 0.1, selector);
            const result = await video.evaluate(el => ({ width: el.videoWidth, height: el.videoHeight, duration: el.duration, error: el.error?.code ?? null }));
            assert.deepEqual(result, { width: 480, height: 854, duration: 58.8, error: null });
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "no horizontal overflow");
            await video.evaluate(el => el.pause());
            const out = process.env.SONG_CATALOG_ARTIFACT_DIR;
            if (out) { fs.mkdirSync(out, { recursive: true }); await page.screenshot({ path: path.join(out, `story-20261031-${engine}-${width}-${route === "/" ? "home" : "news"}.png`) }); }
            console.log(JSON.stringify({ engine, width, route, ...result, passed: true }));
          }
        } finally { await page.close(); }
      }
    } finally { await browser.close(); }
  }
} finally { server.kill(); }
