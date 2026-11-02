import assert from "node:assert/strict";
import { readFile, stat, mkdir, writeFile } from "node:fs/promises";
import { resolve, join, extname, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";
assert.ok(process.env.PLAYWRIGHT_MODULE_ROOT);
const { chromium, webkit } = await import(pathToFileURL(join(process.env.PLAYWRIGHT_MODULE_ROOT, "playwright/index.mjs")).href);
const root = resolve("dist");
const output = join(process.env.SONG_CATALOG_ARTIFACT_DIR || "qa-artifacts", "noon-20261031");
await mkdir(output, { recursive: true });
const base = process.env.RECAP_BASE_URL || "https://site.test";
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp" };
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
            return route.fulfill({ status: 200, contentType: mime[extname(file)] || "application/octet-stream", body: await readFile(file) });
          } catch { return route.fulfill({ status: 404, body: "Not found" }); }
        });
        await page.goto(base + "/activities/live/#recap-2026-10-31-noon-showroom", { waitUntil: "networkidle" });
        const recap = page.locator("#recap-2026-10-31-noon-showroom");
        await recap.waitFor();
        const text = await recap.innerText();
        assert.match(text, /昼の感謝とファイナルへの決意/);
        assert.match(text, /切断後も同じ枠で再開/);
        assert.match(text, /通過結果の発表ではありません/);
        assert.match(text, /15:21頃600/);
        assert.match(text, /実人数・総訪問数・確定終値とは区別/);
        assert.equal(await recap.locator("video,audio,iframe,img").count(), 0);
        // Nested disclosures may be closed; inspect their text without inventing UI visibility.
        const full = await recap.textContent();
        assert.match(full, /21:00〜21:50/);
        assert.match(full, /提供された視聴確認メモ/);
        assert.match(full, /ポイント数の確定値は未確認/);
        assert.match(full, /【後報】同日15:52の本人ファンルーム告知で21:05〜21:50へ変更/);
        assert.doesNotMatch(full, /21:55|5分押し/);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "No horizontal overflow");
        assert.equal(errors.length, 0, errors.join("\n"));
        await recap.screenshot({ path: join(output, `${name}-${width}.png`) });
        results.push({ engine: name, width, passed: true, base, head: process.env.PR_HEAD_SHA || null });
        await page.close();
      }
    } finally { await browser.close(); }
  }
} finally { await writeFile(join(output, "results.json"), JSON.stringify(results, null, 2) + "\n"); }
console.log(JSON.stringify(results, null, 2));
