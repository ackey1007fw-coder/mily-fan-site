import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import {
  ARCHIVE_LOAD_MORE_LABEL,
  ARCHIVE_PAGE_SIZE,
  HOME_NEWS_ARCHIVE_CTA,
  HOME_NEWS_LIMIT,
  NEWS_ARCHIVE_INITIAL,
  NEWS_ARCHIVE_ROUTE,
} from "../src/lib/homePortal.ts";
import { selectHomeHeroNews } from "../src/lib/patonVoteLiveCopy.ts";
const require = createRequire(import.meta.url);
const { chromium, webkit } = require(path.join(process.env.PLAYWRIGHT_MODULE_ROOT, "playwright"));
const port = 4187;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { stdio: "ignore" });
const poster = "/media/gallery/mily-b242-01-stream-thanks-story-v3-poster.jpg";
const selector = `video[poster=\"${poster}\"]`;
const title = "応援への感謝と、ファイナルへの決意🩵 みりぃのStory";
const source = "https://www.instagram.com/mily_chan36";
const now = new Date("2026-11-02T18:50:00+09:00");
const sortedNews = sortNewsByDateDesc(news);
const photoNews = news.find(item => item.id === "2026-11-02-x-entry-photo-change");
assert.ok(photoNews, "photo-change NEWS exists");
const heroNews = selectHomeHeroNews(news, now.getTime());
assert.ok(heroNews, "HOME has a current teaser");

async function revealNews(latest, newsTitle) {
  // Old articles remain reachable through pagination even after leaving HOME.
  for (let attempt = 0; attempt <= Math.ceil(news.length / ARCHIVE_PAGE_SIZE); attempt++) {
    if (await latest.getByText(newsTitle, { exact: true }).count()) return;
    const more = latest.getByRole("button", { name: ARCHIVE_LOAD_MORE_LABEL, exact: true });
    assert.equal(await more.count(), 1, `NEWS can reveal ${newsTitle}`);
    await more.click();
  }
  assert.fail(`NEWS did not reveal ${newsTitle}`);
}
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
          await page.clock.install({ time: now });
          await page.route("**/api/**", route => route.fulfill({ json: { ok: false, slots: [] } }));
          for (const route of ["/", "/news/"]) {
            await page.goto(base + route, { waitUntil: "domcontentloaded" });
            const latest = page.locator("#latest");
            await latest.locator("ul > li").first().waitFor();
            const initialNews = sortedNews.slice(0, route === "/" ? HOME_NEWS_LIMIT : NEWS_ARCHIVE_INITIAL);
            assert.deepEqual(
              await latest.locator(":scope > div > ul > li > p:nth-child(2)").allTextContents(),
              initialNews.map(item => item.title),
              "Latest preserves the current date order and page limit",
            );
            if (route === "/news/") await revealNews(latest, photoNews.title);
            const photoCard = latest.locator("li").filter({ has: page.getByText(photoNews.title, { exact: true }) });
            const photoVisible = route === "/news/" || initialNews.some(item => item.id === photoNews.id);
            assert.equal(await photoCard.count(), photoVisible ? 1 : 0, "photo-change NEWS appears once in its current display range");
            if (photoVisible) {
              assert.match(await photoCard.innerText(), /Xのアイコンと同じ写真/);
              assert.equal(await photoCard.locator("img, video").count(), 0, "photo-change notice does not republish an image");
              for (const url of [photoNews.source, ...photoNews.additionalCtas.map(cta => cta.url)]) {
                const link = photoCard.locator(`a[href="${url}"]`);
                assert.equal(await link.count(), 1, "source, ENTRY 734 and WEB vote links remain on the notice");
                assert.equal(await link.getAttribute("target"), "_blank");
                assert.match(await link.getAttribute("rel"), /noopener noreferrer/);
              }
            }
            if (route === "/news/") await revealNews(latest, title);
            const video = latest.locator(selector);
            if (route === "/") {
              assert.equal(await page.locator("#top aside").getByText(heroNews.title, { exact: true }).count(), 1, "HOME teaser follows the current NEWS selection");
              assert.equal(await page.locator("#top").getByRole("link", { name: "最新情報へ", exact: true }).getAttribute("href"), "#latest", "HOME text teaser links to playable Latest");
              assert.equal(await latest.getByRole("link", { name: HOME_NEWS_ARCHIVE_CTA, exact: true }).getAttribute("href"), NEWS_ARCHIVE_ROUTE, "HOME links to the complete NEWS archive");
              const storyVisible = initialNews.some(item => item.title === title);
              assert.equal(await video.count(), storyVisible ? 1 : 0, "Story follows the HOME Latest limit without duplication");
              if (!storyVisible) {
                assert.equal(await latest.getByText(title, { exact: true }).count(), 0, "out-of-range Story is absent from HOME Latest");
                assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "no horizontal overflow");
                console.log(JSON.stringify({ engine, width, route, storyVisible, passed: true }));
                continue;
              }
            }
            await latest.getByText(title, { exact: true }).waitFor();
            assert.equal(await video.count(), 1, "single Story player in Latest");
            assert.ok(await page.locator(`a[href=\"${source}\"]`).count() > 0);
            assert.equal(await video.getAttribute("preload"), "none");
            assert.ok(await video.evaluate(el => el.controls && el.playsInline && !el.autoplay));
            await video.scrollIntoViewIfNeeded();
            await video.evaluate(async el => { el.muted = true; await el.play(); });
            await page.waitForFunction(s => document.querySelector(s)?.currentTime > 0.1, `#latest ${selector}`);
            const result = await video.evaluate(el => ({ width: el.videoWidth, height: el.videoHeight, duration: el.duration, error: el.error?.code ?? null }));
            assert.equal(result.width, 480);
            assert.equal(result.height, 854);
            assert.equal(result.error, null);
            assert.ok(Math.abs(result.duration - 58.8) < 0.05, "58.8-second video");
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
