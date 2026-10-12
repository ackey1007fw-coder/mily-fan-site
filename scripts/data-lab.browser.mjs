import assert from "node:assert/strict";
import { readFile, stat, mkdir, writeFile } from "node:fs/promises";
import { resolve, join, extname, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";

assert.ok(process.env.PLAYWRIGHT_MODULE_ROOT, "CI Playwright modules must be installed");
const { chromium, webkit } = await import(
  pathToFileURL(join(process.env.PLAYWRIGHT_MODULE_ROOT, "playwright/index.mjs")).href
);
const root = resolve("dist");
const output = join(process.env.SONG_CATALOG_ARTIFACT_DIR || "qa-artifacts", "data-lab");
const mime = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml",
  ".jpg": "image/jpeg", ".png": "image/png",
};
const results = [];
await mkdir(output, { recursive: true });

try {
  for (const [engine, launch] of [["chromium", chromium], ["webkit", webkit]]) {
    const browser = await launch.launch({ headless: true });
    try {
      for (const width of [320, 390, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 950 } });
        const errors = [];
        page.on("pageerror", error => errors.push(error.message));
        await page.route("**/*", async route => {
          const url = new URL(route.request().url());
          if (url.hostname !== "site.test") return route.fulfill({ status: 204, body: "" });
          if (url.pathname.startsWith("/api/")) {
            return route.fulfill({ status: 503, contentType: "application/json", body: "{}" });
          }
          let file = resolve(root, "." + decodeURIComponent(url.pathname));
          const rel = relative(root, file);
          if (rel === ".." || rel.startsWith(".." + sep)) return route.fulfill({ status: 403, body: "" });
          try {
            if ((await stat(file)).isDirectory()) file = join(file, "index.html");
            return route.fulfill({
              status: 200,
              contentType: mime[extname(file)] || "application/octet-stream",
              body: await readFile(file),
            });
          } catch {
            return route.fulfill({ status: 404, body: "Not found" });
          }
        });

        try {
          await page.goto("https://site.test/data-lab/", { waitUntil: "networkidle" });
          assert.match(await page.title(), /MILY SIGNAL/);
          assert.match(await page.locator("h1").innerText(), /データ/);
          assert.equal(await page.locator("#sr-chart .bar-row").count(), 10);
          assert.equal(await page.locator("#forecast-chart .bar-row").count(), 6);
          assert.equal(await page.locator("#roster-body tr").count(), 20);

          await page.locator("#roster-search").fill("734");
          assert.equal(await page.locator("#roster-body tr").count(), 1);
          assert.match(await page.locator("#roster-body").innerText(), /三橋/);
          await page.locator("#roster-search").fill("");
          await page.locator('button[data-grade="3年"]').click();
          assert.equal(await page.locator("#roster-body tr").count(), 27);
          assert.equal(await page.locator('button[data-grade="3年"]').getAttribute("aria-pressed"), "true");

          await page.locator('button[data-grade="all"]').click();
          await page.locator("#show-all").click();
          assert.equal(await page.locator("#roster-body tr").count(), 70);
          assert.equal(await page.locator('#roster-body tr.mily-row').count(), 1);
          assert.equal(await page.locator('a[aria-label="みりぃファンサイトのホームに戻る"]').getAttribute("href"), "/");
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Data Lab has horizontal overflow");

          await page.screenshot({
            path: join(output, `${engine}-${width}-data-lab.png`),
            fullPage: true,
          });
          await page.goto("https://site.test/", { waitUntil: "networkidle" });
          assert.ok(await page.locator('a[href="/data-lab/"]').count() >= 2, "Home card and nav links must exist");
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Home has horizontal overflow");
          assert.deepEqual(errors, [], "Browser JavaScript must not throw");
          results.push({ engine, width, roster: 70, grade3: 27, search: "ok", overflow: false });
        } finally {
          await page.close();
        }
      }
    } finally {
      await browser.close();
    }
  }
} finally {
  await writeFile(
    join(output, "results.json"),
    JSON.stringify({ head: process.env.PR_HEAD_SHA || null, results }, null, 2)
  );
}
console.log(JSON.stringify({ passed: results.length, results }));
