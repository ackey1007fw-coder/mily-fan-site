import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const moduleRoot = process.env.PLAYWRIGHT_MODULE_ROOT;
assert.ok(moduleRoot, "Use the existing isolated browser tooling");
const { chromium } = await import(pathToFileURL(join(moduleRoot, "playwright/index.mjs")).href);
const output = join(process.env.SONG_CATALOG_ARTIFACT_DIR || "qa-artifacts", "provided-vote-video");
await mkdir(output, { recursive: true });
const server = createServer(async (req, res) => {
  try {
    let path = new URL(req.url, "http://local").pathname;
    if (path.startsWith("/api/")) { res.writeHead(503, { "Content-Type": "application/json" }); res.end("{}"); return; }
    if (path.endsWith("/")) path += "index.html";
    const bytes = await readFile(resolve(root, "dist", "." + path));
    const type = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".mp4": "video/mp4" }[extname(path)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type, "Content-Length": bytes.length }); res.end(bytes);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true });
const videoPath = "/media/gallery/mily-b187-01-vote-support.mp4";
const voteUrl = "https://liff.line.me/1656040756-GwmBkdPY/vote/misscircle2026/N/734";
const results = [];
try {
  for (const width of [390, 1440]) for (const [state, time] of [
    ["before", "2026-10-02T11:59:59.999+09:00"],
    ["start", "2026-10-02T12:00:00+09:00"],
    ["last-ms", "2026-10-12T23:59:59.999+09:00"],
    ["ended", "2026-10-13T00:00:00+09:00"],
  ]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = []; page.on("pageerror", error => errors.push(error.message));
    await page.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.fulfill({ status: 204, body: "" }));
    await page.clock.install({ time: new Date(Date.parse(time) - 1000) });
    await page.clock.pauseAt(new Date(time));
    await page.goto(origin + "/support/#vote-support-video", { waitUntil: "domcontentloaded" });
    const card = page.locator("#vote-support-video"); await card.waitFor();
    const video = card.locator(`video[src="${videoPath}"]`);
    assert.equal(await video.count(), 1, "Historical NEWS anchor retains its video at every boundary");
    assert.match(await card.innerText(), /撮影・投稿日時は未確認/);
    assert.equal(await card.locator(`a[href="${voteUrl}"]`).count(), ["start", "last-ms"].includes(state) ? 1 : 0);
    if (["before", "ended"].includes(state)) assert.equal(await card.locator('a[href="https://2026.misscircle.jp/entry/734"]').count(), 1);
    if (state === "ended") {
      assert.match(await card.innerText(), /WEB投票期間は終了しました/);
      assert.equal(await page.locator("#fourth-round-guide").count(), 0);
      await page.clock.resume();
      await video.scrollIntoViewIfNeeded();
      await video.evaluate(video => video.play());
      await page.waitForFunction(path => document.querySelector(`video[src="${path}"]`)?.ended, videoPath, { timeout: 15000 });
      assert.equal(await video.evaluate(video => video.currentTime), 5, "Past NEWS still plays the whole video after voting ends");
    }
    if (state === "last-ms") {
      await page.clock.runFor(1);
      await page.waitForFunction(url => !document.querySelector(`#vote-support-video a[href="${url}"]`), voteUrl);
      assert.equal(await video.count(), 1, "Video survives the expiry timer without reloading");
      assert.match(await card.innerText(), /WEB投票期間は終了しました/);
    }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
    await card.screenshot({ path: join(output, `${state}-${width}.png`) });
    results.push({ width, state, time, status: "passed", videoRetained: true, expiryTimerChecked: state === "last-ms", fullPlaybackChecked: state === "ended" });
    await page.close();
  }
  // The October 5 owner-provided X video exercises the landscape NEWS player.
  for (const width of [390, 1440]) for (const route of ["/", "/news/"]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = []; page.on("pageerror", error => errors.push(error.message));
    await page.route("**/*", request => new URL(request.request().url()).origin === origin ? request.continue() : request.fulfill({ status: 204, body: "" }));
    await page.goto(origin + route, { waitUntil: "domcontentloaded" });
    const card = page.locator("li").filter({ hasText: "みりぽち4日目！車内からの短い動画" });
    await card.waitFor();
    assert.equal(await card.count(), 1);
    const video = card.locator('video[src="/media/news/mily-b191-01-car-vote-day4.mp4"]');
    assert.equal(await video.count(), 1);
    assert.match(await card.innerText(), /音声なし/);
    assert.match(await card.innerText(), /『4日目』は投稿時点の案内/);
    assert.equal(await card.locator('a[href="https://x.com/Mily_chan36/status/2106908009385640372"]').count(), 1);
    assert.equal(await card.locator('a[href="https://mily-fan-site.vercel.app/support/"]').count(), 1);
    assert.equal(await video.getAttribute("preload"), "none");
    await video.scrollIntoViewIfNeeded();
    await video.evaluate(video => video.play());
    await page.waitForFunction(() => document.querySelector('video[src="/media/news/mily-b191-01-car-vote-day4.mp4"]')?.ended, null, { timeout: 15000 });
    const playback = await video.evaluate(video => ({ width: video.videoWidth, height: video.videoHeight, duration: video.duration, ended: video.ended, controls: video.controls, inline: video.playsInline, autoplay: video.autoplay, error: video.error?.code, ratio: video.getBoundingClientRect().width / video.getBoundingClientRect().height }));
    assert.equal(playback.width, 910); assert.equal(playback.height, 512);
    assert.ok(Math.abs(playback.duration - 58 / 30) < 0.01);
    assert.ok(Math.abs(playback.ratio - 910 / 512) < 0.02);
    assert.ok(playback.ended && playback.controls && playback.inline && !playback.autoplay && !playback.error);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
    await card.screenshot({ path: join(output, `car-x-${route === "/" ? "home" : "news"}-${width}.png`) });
    results.push({ width, route, status: "passed", landscapeVideo: playback });
    await page.close();
  }
  await writeFile(join(output, "results.json"), JSON.stringify({ head: process.env.PR_HEAD_SHA || null, results }, null, 2));
  console.log(`Provided vote video: ${results.length} boundary cases passed; expired archive video plays to 5 seconds.`);
} finally { await browser.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
