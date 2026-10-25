import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { radioEpisode20261025 as recap } from "../src/data/radioEpisode20261025.ts";

const engines = await import(pathToFileURL(join(process.env.PLAYWRIGHT_MODULE_ROOT, "playwright/index.mjs")).href);
const output = join(process.env.SONG_CATALOG_ARTIFACT_DIR, "radio-talk-20261025");
await mkdir(output, { recursive: true });
const origin = "http://127.0.0.1:4194";
const server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", "4194", "--strictPort"], { stdio: "ignore" });
const results = [];
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try { ready = (await fetch(origin)).ok; } catch {}
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.ok(ready, "Built site starts");
  for (const [engine, width, height] of [["chromium", 320, 850], ["webkit", 390, 844], ["chromium", 1440, 1000]]) {
    const browser = await engines[engine].launch({ headless: true });
    try {
      const page = await browser.newPage({ viewport: { width, height } });
      const errors = [];
      const youtubeRequests = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.route("**/*", (route) => {
        const url = new URL(route.request().url());
        if (url.origin === origin) return route.continue();
        if (url.hostname.includes("youtube")) {
          youtubeRequests.push(url.href);
          // Validate the integration without requiring a third-party player in CI.
          return route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>Player integration fixture</title>" });
        }
        return route.fulfill({ status: 204, body: "" });
      });
      await page.goto(`${origin}/activities/radio/#radio-${recap.id}`, { waitUntil: "networkidle" });
      const article = page.locator(`#radio-${recap.id}`);
      await article.waitFor();
      const box = await article.boundingBox();
      assert.ok(box.y >= 0 && box.y < height / 2, "Direct episode link reaches its heading");
      assert.match(await article.innerText(), /2:15:00は12:15頃/);
      assert.match(await article.innerText(), /空回り\s+余裕も大事\s+前を向け/);
      assert.match(await article.innerText(), /音声の書き起こし/);
      assert.ok(recap.talkVideos.length >= 4, "All requested videos are ready");
      const cards = article.locator("[data-radio-talk-video]");
      assert.equal(await cards.count(), recap.talkVideos.length);
      assert.equal(await article.locator("iframe").count(), 0, "No iframe before viewer action");
      assert.equal(youtubeRequests.length, 0, "No YouTube request before viewer action");
      for (const video of recap.talkVideos) {
        const card = page.locator(`#${video.id}`);
        assert.equal(await card.getByRole("heading", { name: video.title, exact: true }).count(), 1);
        const link = card.getByRole("link");
        assert.equal(await link.getAttribute("href"), video.youtubeUrl);
        assert.equal(await link.getAttribute("target"), "_blank");
        assert.match(await link.getAttribute("rel"), /noopener noreferrer/);
        const image = card.locator("img");
        await image.scrollIntoViewIfNeeded();
        await image.evaluate((element) => element.decode());
        assert.equal(await image.evaluate((element) => element.naturalWidth > 0), true);
      }
      const clips = article.locator(`section[aria-labelledby="${recap.id}-talk-videos"]`);
      await clips.screenshot({ path: join(output, `${engine}-${width}-cards.png`) });
      const first = cards.first();
      await first.getByRole("button").focus();
      await page.keyboard.press("Enter");
      const frame = first.locator("iframe");
      await frame.waitFor();
      const embedUrl = new URL(await frame.getAttribute("src"));
      assert.equal(embedUrl.hostname, "www.youtube-nocookie.com");
      assert.equal(embedUrl.pathname, `/embed/${new URL(recap.talkVideos[0].youtubeUrl).searchParams.get("v")}`);
      assert.equal(embedUrl.searchParams.has("autoplay"), false);
      assert.doesNotMatch(await frame.getAttribute("allow"), /autoplay/);
      assert.equal(await frame.getAttribute("title"), recap.talkVideos[0].title);
      assert.equal(await first.getByRole("link").count(), 1, "YouTube fallback stays available");
      assert.equal(await page.evaluate(() => document.activeElement?.tagName), "IFRAME", "Keyboard activation moves focus to the player");
      assert.equal(await article.locator("iframe").count(), 1, "Only the requested video loads");
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "No horizontal overflow");
      assert.deepEqual(errors, []);
      results.push({ engine, width, videos: recap.talkVideos.length, status: "passed", verification: "Local layout and iframe integration; external playback is checked separately" });
    } finally {
      await browser.close();
    }
  }
} finally {
  server.kill("SIGTERM");
  await writeFile(join(output, "results.json"), JSON.stringify({ head: process.env.PR_HEAD_SHA || null, results }, null, 2));
}
console.log(JSON.stringify(results));
