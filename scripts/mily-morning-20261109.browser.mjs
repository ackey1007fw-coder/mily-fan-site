import assert from "node:assert/strict";
import { readFile, stat, mkdir, writeFile } from "node:fs/promises";
import { resolve, join, extname, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";

assert.ok(process.env.PLAYWRIGHT_MODULE_ROOT);
const { chromium, webkit } = await import(pathToFileURL(join(process.env.PLAYWRIGHT_MODULE_ROOT, "playwright/index.mjs")).href);
const root = resolve("dist");
const output = join(process.env.SONG_CATALOG_ARTIFACT_DIR || "qa-artifacts", "morning-20261109");
await mkdir(output, { recursive: true });
const base = process.env.RECAP_BASE_URL || "https://site.test";
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".mp4": "video/mp4", ".zip": "application/zip" };
const results = [];
try {
  for (const [name, engine] of [["chromium", chromium], ["webkit", webkit]]) {
    const browser = await engine.launch({ headless: true });
    try {
      for (const width of [320, 390, 1280]) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        const errors = [];
        page.on("pageerror", error => errors.push(error.message));
        if (!process.env.RECAP_BASE_URL) await page.route("**/*", async route => {
          const url = new URL(route.request().url());
          if (url.hostname !== "site.test") return route.fulfill({ status: 204, body: "" });
          if (url.pathname.startsWith("/api/")) return route.fulfill({ status: 503, contentType: "application/json", body: "{}" });
          let file = resolve(root, "." + decodeURIComponent(url.pathname));
          const rel = relative(root, file);
          if (rel === ".." || rel.startsWith(".." + sep)) return route.fulfill({ status: 403, body: "" });
          try {
            if ((await stat(file)).isDirectory()) file = join(file, "index.html");
            const body = await readFile(file);
            const range = route.request().headers().range?.match(/^bytes=(\d+)-(\d*)$/);
            if (range) {
              const start = Number(range[1]);
              const end = range[2] ? Math.min(Number(range[2]), body.length - 1) : body.length - 1;
              return route.fulfill({ status: 206, contentType: mime[extname(file)] || "application/octet-stream", headers: { "Content-Range": `bytes ${start}-${end}/${body.length}`, "Accept-Ranges": "bytes" }, body: body.subarray(start, end + 1) });
            }
            return route.fulfill({ status: 200, contentType: mime[extname(file)] || "application/octet-stream", body });
          } catch { return route.fulfill({ status: 404, body: "Not found" }); }
        });
        await page.goto(base + "/activities/live/#recap-2026-11-09-morning-showroom", { waitUntil: "networkidle" });
        const recap = page.locator("#recap-2026-11-09-morning-showroom");
        await recap.waitFor();
        assert.equal(await recap.getAttribute("open"), "");
        assert.match(await recap.innerText(), /朝の結果待ちとこれから/);
        assert.equal(await recap.locator("img").count(), 11);
        assert.equal(await recap.locator("video").count(), 3);
        assert.equal(await recap.locator("audio,iframe").count(), 0);
        for (const image of await recap.locator("img").all()) {
          await image.scrollIntoViewIfNeeded();
          await image.evaluate(img => img.decode());
          assert.deepEqual(await image.evaluate(img => [img.naturalWidth, img.naturalHeight]), [640, 360]);
        }
        const downloads = recap.locator("a[download]");
        assert.equal(await downloads.count(), 11);
        const zip = recap.locator('a[download="mily-20261109-morning-photos.zip"]');
        const zipStatus = await zip.evaluate(async link => { const r = await fetch(link.href); return { status: r.status, bytes: (await r.arrayBuffer()).byteLength }; });
        assert.equal(zipStatus.status, 200);
        assert.ok(zipStatus.bytes > 100000);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "No horizontal overflow");
        assert.equal(errors.length, 0, errors.join("\n"));
        await recap.locator("summary").first().screenshot({ path: join(output, `${name}-${width}-cover.png`) });
        await recap.locator('section').filter({ hasText: 'この回のスクショ' }).last().screenshot({ path: join(output, `${name}-${width}-gallery.png`) });
        results.push({ engine: name, width, passed: true, imageCount: 11, galleryCount: 10, videoCount: 3, zipStatus, base, head: process.env.PR_HEAD_SHA || null });
        await page.close();
      }
    } finally { await browser.close(); }
  }
} finally { await writeFile(join(output, "results.json"), JSON.stringify(results, null, 2) + "\n"); }
console.log(JSON.stringify(results, null, 2));
