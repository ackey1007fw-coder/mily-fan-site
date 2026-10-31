import assert from "node:assert/strict";
import { readFile, stat, mkdir, writeFile } from "node:fs/promises";
import { resolve, join, extname, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";
assert.ok(process.env.PLAYWRIGHT_MODULE_ROOT);
const { chromium, webkit } = await import(pathToFileURL(join(process.env.PLAYWRIGHT_MODULE_ROOT, "playwright/index.mjs")).href);
const root = resolve("dist");
const output = join(process.env.SONG_CATALOG_ARTIFACT_DIR || "qa-artifacts", "night-20261030");
await mkdir(output, { recursive: true });
const data = JSON.parse(await readFile(join(root, "data-lab/data/mily-night-20261030-aggregate.json"), "utf8"));
const base = process.env.DATA_LAB_BASE_URL || "https://site.test";
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".csv": "text/csv", ".png": "image/png", ".jpg": "image/jpeg" };
const results = [];
try {
  for (const [name, engine] of [["chromium", chromium], ["webkit", webkit]]) {
    const browser = await engine.launch({ headless: true });
    try {
      for (const width of [390, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 950 } });
        const errors = [];
        page.on("pageerror", error => errors.push(error.message));
        if (!process.env.DATA_LAB_BASE_URL) await page.route("**/*", async route => {
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
        await page.goto(base + "/data-lab/reports/20261030-night/", { waitUntil: "networkidle" });
        await page.locator('#observation-charts[data-ready="true"]').waitFor();
        assert.match(await page.title(), /夜枠/);
        assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex,nofollow,noarchive");
        assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://mily-fan-site.vercel.app/data-lab/reports/20261030-night/");
        assert.equal(await page.locator("svg").count(), 3);
        assert.match(await page.locator(".notice").innerText(), /最終結果ではありません/);
        for (const metric of ["stars", "visits", "comments"]) {
          const points = await page.locator(`circle[data-series="${metric}"]`).evaluateAll(nodes => nodes.map(node => ({ atJst: node.dataset.at, value: Number(node.dataset.value), x: Number(node.getAttribute("cx")), y: Number(node.getAttribute("cy")) })));
          assert.deepEqual(points.map(p => [p.atJst, p.value]), data.observations.filter(p => p[metric] !== null).map(p => [p.atJst, p[metric]]));
          assert.ok(points.every(p => p.x >= 65 && p.x <= 745 && Number.isFinite(p.y)), "No invented points in missing tail");
        }
        assert.equal(await page.locator("svg polyline,svg path").count(), 0);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Report must not overflow viewport");
        const links = await page.locator("#downloads a").evaluateAll(nodes => nodes.map(n => n.getAttribute("href")));
        assert.equal(links.length, 2);
        for (const link of links) assert.equal(await page.evaluate(async url => (await fetch(url)).status, link), 200);
        await page.screenshot({ path: join(output, `${name}-${width}.png`), fullPage: true });
        await page.goto(base + "/data-lab/#daily-2026-10-30", { waitUntil: "networkidle" });
        const day = page.locator("#daily-2026-10-30");
        await day.waitFor();
        if (await day.evaluate(el => Boolean(el.closest("details:not([open])")))) await page.locator("#daily-past > summary").click(); // dates sit in one collapsed "過去の回", not per-date accordions
        await day.locator("svg circle").first().waitFor();
        assert.equal(await day.locator(".daily-stream-card").count(), 3);
        const card = day.locator(".daily-stream-card").filter({ has: page.locator("h4", { hasText: "夜" }) });
        assert.equal(await card.count(), 1);
        assert.match(await card.locator("h4").innerText(), /夜/);
        assert.equal(await card.locator(".daily-stream-number").innerText(), "300");
        assert.equal(await card.locator("svg circle").count(), 8);
        await page.goto(base + "/activities/live/#recap-2026-10-30-night-showroom", { waitUntil: "networkidle" });
        const recap = page.locator("#recap-2026-10-30-night-showroom");
        await recap.waitFor();
        assert.match(await recap.innerText(), /カメラに向けた笑顔/);
        assert.equal(await recap.locator("video,audio").count(), 0);
        assert.equal(errors.length, 0, errors.join("\n"));
        results.push({ engine: name, width, passed: true, head: process.env.PR_HEAD_SHA || null });
        await page.close();
      }
    } finally { await browser.close(); }
  }
} finally { await writeFile(join(output, "results.json"), JSON.stringify(results, null, 2) + "\n"); }
console.log(JSON.stringify(results, null, 2));
