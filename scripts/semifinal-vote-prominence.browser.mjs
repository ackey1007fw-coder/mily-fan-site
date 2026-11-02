import assert from "node:assert/strict";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { extname, join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

assert.ok(process.env.PLAYWRIGHT_MODULE_ROOT, "Use existing isolated Playwright tooling");
const { chromium, webkit } = await import(pathToFileURL(join(process.env.PLAYWRIGHT_MODULE_ROOT, "playwright/index.mjs")).href);
const root = resolve("dist");
const output = join(process.env.SONG_CATALOG_ARTIFACT_DIR || "qa-artifacts", "semifinal-vote-prominence");
const voteUrl = "https://liff.line.me/1656040756-GwmBkdPY/vote/misscircle2026/N/734";
const selector = 'aside[aria-label="MISS CIRCLE WEB投票のご案内"]';
const results = [];
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".mp4": "video/mp4" };
await mkdir(output, { recursive: true });

async function prepare(browser, width, time) {
  const page = await browser.newPage({ viewport: { width, height: width < 640 ? 844 : 1000 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.clock.install({ time: new Date(time) });
  await page.clock.pauseAt(new Date(time));
  await page.route("**/*", async route => {
    const url = new URL(route.request().url());
    if (url.hostname !== "site.test") return route.fulfill({ status: 204, body: "" });
    if (url.pathname.startsWith("/api/")) return route.fulfill({ status: 503, contentType: "application/json", body: "{}" });
    let file = resolve(root, "." + decodeURIComponent(url.pathname));
    const rel = relative(root, file);
    if (rel === ".." || rel.startsWith(".." + sep)) return route.fulfill({ status: 403, body: "" });
    try {
      if ((await stat(file)).isDirectory()) file = join(file, "index.html");
      return route.fulfill({ status: 200, contentType: mime[extname(file)] || "application/octet-stream", body: await readFile(file) });
    } catch { return route.fulfill({ status: 404, body: "Not found" }); }
  });
  return { page, errors };
}

try {
  for (const [engine, launcher] of [["chromium", chromium], ["webkit", webkit]]) {
    const browser = await launcher.launch({ headless: true });
    try {
      for (const width of [320, 390, 768, 1440]) {
        const { page, errors } = await prepare(browser, width, "2026-10-31T04:00:00+09:00");
        try {
          for (const path of ["/", "/support/"]) {
            await page.goto("https://site.test" + path, { waitUntil: "networkidle" });
            const card = page.locator(selector);
            await card.waitFor();
            assert.equal(await card.count(), 1);
            assert.equal(await card.getAttribute("data-vote-state"), "live");
            assert.match(await card.innerText(), /三橋莉子にWEB投票をお願いします/);
            assert.match(await card.innerText(), /WEB投票 受付中/);
            assert.match(await card.innerText(), /11\/8.*23:59/);
            const cta = card.locator(`a[href="${voteUrl}"]`);
            assert.equal(await cta.count(), 1);
            assert.equal(await cta.getAttribute("target"), "_blank");
            assert.match(await cta.getAttribute("rel"), /noopener/);
            assert.match(await cta.getAttribute("rel"), /noreferrer/);
            const box = await cta.boundingBox();
            assert.ok(box.height >= 56, "Large vote button remains touch-friendly");
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "No horizontal overflow");
            if (path === "/") {
              const photo = await page.locator("#top figure").first().boundingBox();
              assert.ok(box.y + box.height <= photo.y, "Voting comes before the portrait");
              assert.ok(box.y + box.height < (width < 640 ? 760 : 1000), "Primary CTA is visible without scrolling");
            }
            // The existing fixed dock belongs to HOME; SUPPORT keeps its page-top spotlight.
            if (width < 640 && path === "/") {
              const dock = page.locator("div.fixed.inset-x-0.bottom-0");
              assert.equal(await dock.count(), 1);
              const primary = dock.locator(`a[href="${voteUrl}"]`);
              assert.equal(await primary.count(), 1);
              const voteBox = await primary.boundingBox();
              const supportBox = await dock.locator('a[href="/support/"]').boundingBox();
              assert.ok(voteBox.height >= 48 && voteBox.width > supportBox.width, "Vote is the dominant fixed action");
              await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
              const fixedBox = await primary.boundingBox();
              assert.ok(fixedBox.y >= 0 && fixedBox.y + fixedBox.height <= 844, "Fixed vote remains in view after scrolling");
              await page.evaluate(() => window.scrollTo(0, 0));
            }
            assert.deepEqual(errors, []);
            await page.screenshot({ path: join(output, `${engine}-${width}-${path === "/" ? "home" : "support"}.png`) });
            results.push({ engine, width, path, state: "live", passed: true });
          }
        } finally { await page.close(); }
      }
      for (const [state, time] of [["opening", "2026-10-29T11:59:59.999+09:00"], ["expiry", "2026-11-08T23:59:59.999+09:00"]]) {
        const { page, errors } = await prepare(browser, 390, time);
        try {
          await page.goto("https://site.test/", { waitUntil: "networkidle" });
          await page.locator(selector).waitFor();
          assert.equal(await page.locator(selector).getAttribute("data-vote-state"), state === "opening" ? "upcoming" : "live");
          await page.clock.runFor(1);
          if (state === "opening") {
            await page.waitForFunction(s => document.querySelector(s)?.getAttribute("data-vote-state") === "live", selector);
            assert.equal(await page.locator(`${selector} a[href="${voteUrl}"]`).count(), 1);
          } else {
            await page.waitForFunction(s => !document.querySelector(s), selector);
            assert.equal(await page.locator(`div.fixed.inset-x-0.bottom-0 a[href="${voteUrl}"]`).count(), 0);
            await page.reload({ waitUntil: "networkidle" });
            assert.equal(await page.locator(selector).count(), 0, "Expiry remains correct after reload");
          }
          assert.deepEqual(errors, []);
          results.push({ engine, state, withoutReload: true, passed: true });
        } finally { await page.close(); }
      }
    } finally { await browser.close(); }
  }
} finally {
  await writeFile(join(output, "results.json"), JSON.stringify({ head: process.env.PR_HEAD_SHA || null, results }, null, 2));
}
console.log(`Semifinal vote prominence: ${results.length} browser cases passed.`);
