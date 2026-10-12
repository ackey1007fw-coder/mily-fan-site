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
const baseUrl = process.env.DATA_LAB_BASE_URL || "https://site.test";
await mkdir(output, { recursive: true });

try {
  for (const [engine, launch] of [["chromium", chromium], ["webkit", webkit]]) {
    const browser = await launch.launch({ headless: true });
    try {
      for (const width of [320, 390, 768, 1023, 1024, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 950 } });
        const errors = [];
        page.on("pageerror", error => errors.push(error.message));
        if (!process.env.DATA_LAB_BASE_URL) await page.route("**/*", async route => {
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
          await page.goto(`${baseUrl}/data-lab/`, { waitUntil: "networkidle" });
          assert.match(await page.title(), /MILY SIGNAL/);
          const head = await page.evaluate(() => ({
            canonical: document.querySelector('link[rel="canonical"]').href,
            ogUrl: document.querySelector('meta[property="og:url"]').content,
            ogImage: document.querySelector('meta[property="og:image"]').content,
            twitterImage: document.querySelector('meta[name="twitter:image"]').content,
            card: document.querySelector('meta[name="twitter:card"]').content,
            robots: document.querySelector('meta[name="robots"]').content,
          }));
          assert.equal(head.canonical, "https://mily-fan-site.vercel.app/data-lab/");
          assert.equal(head.ogUrl, head.canonical);
          assert.equal(head.ogImage, "https://mily-fan-site.vercel.app/data-lab/assets/og-card-20261013.png");
          assert.equal(head.twitterImage, head.ogImage);
          assert.equal(head.card, "summary_large_image");
          assert.equal(head.robots, "noindex,nofollow,noarchive");
          const cardSize = await page.evaluate(async imageUrl => {
            const image = new Image();
            image.src = imageUrl;
            await image.decode();
            return { width: image.naturalWidth, height: image.naturalHeight };
          }, `${baseUrl}${new URL(head.ogImage).pathname}`);
          assert.deepEqual(cardSize, { width: 1200, height: 630 });
          assert.match(await page.locator("h1").innerText(), /データ/);
          assert.equal(await page.locator("#sr-chart .bar-row").count(), 10);
          assert.ok((await page.locator("#sr-chart .is-mily .bar").boundingBox()).width > 10, "SR chart bars must be visibly rendered");
          assert.equal(await page.locator("#forecast-chart .bar-row").count(), 6);
          assert.equal(await page.locator("#roster-body tr").count(), 20);

          await page.locator("#roster-search").fill("734");
          assert.equal(await page.locator("#roster-body tr").count(), 1);
          assert.match(await page.locator("#roster-body").innerText(), /三橋/);
          await page.locator("#roster-search").fill("三橋莉子");
          assert.equal(await page.locator("#roster-body tr").count(), 1, "Unspaced Japanese name must match");
          await page.locator("#roster-search").fill("三橋　莉子");
          assert.equal(await page.locator("#roster-body tr").count(), 1, "Full-width space must match");
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
          await page.goto(`${baseUrl}/data-lab`, { waitUntil: "networkidle" });
          const reportLink = page.getByRole("link", { name: "10/12最終夜の分析を読む ↗", exact: true });
          assert.equal(await reportLink.getAttribute("href"), "/data-lab/reports/20261012-final-night/");
          assert.equal(await page.locator("#sr-chart .bar-row").count(), 10);
          const reportVariants = [];
          for (const suffix of ["/", ""]) {
            const reportPath = `/data-lab/reports/20261012-final-night${suffix}`;
            const response = await page.goto(`${baseUrl}${reportPath}`, { waitUntil: "networkidle" });
            assert.equal(response.status(), 200, `Report must load at ${reportPath}`);
            assert.match(await page.title(), /最終夜配信/);
            assert.match(await page.locator("h1").innerText(), /22:00/);
            assert.equal(await page.locator(".final-table").count(), 2);
            assert.equal(await page.locator("svg.plot polyline").count(), 1);
            assert.match(await page.locator("#ranking").innerText(), /712,986/);
            assert.match(await page.locator("#ranking").innerText(), /公式最終順位・確定ポイントではありません/);
            assert.match(await page.locator(".final-grid").innerText(), /1,121〜1,131/);
            const reportHead = await page.evaluate(() => ({
              canonical: document.querySelector('link[rel="canonical"]')?.href,
              ogUrl: document.querySelector('meta[property="og:url"]')?.content,
              ogImage: document.querySelector('meta[property="og:image"]')?.content,
              twitterImage: document.querySelector('meta[name="twitter:image"]')?.content,
              card: document.querySelector('meta[name="twitter:card"]')?.content,
              robots: document.querySelector('meta[name="robots"]')?.content,
              css: document.querySelector('link[rel="stylesheet"]')?.getAttribute("href"),
              favicon: document.querySelector('link[rel="icon"]')?.getAttribute("href"),
              background: getComputedStyle(document.documentElement).getPropertyValue("--bg").trim(),
            }));
            assert.equal(reportHead.canonical, `${head.canonical}reports/20261012-final-night/`);
            assert.equal(reportHead.ogUrl, reportHead.canonical);
            assert.equal(reportHead.ogImage, head.ogImage);
            assert.equal(reportHead.twitterImage, head.ogImage);
            assert.equal(reportHead.card, "summary_large_image");
            assert.equal(reportHead.robots, head.robots);
            assert.equal(reportHead.css, "/data-lab/assets/styles.css");
            assert.equal(reportHead.favicon, "/data-lab/assets/favicon.svg");
            assert.equal(reportHead.background, "#081a27", "Shared CSS must actually be applied");
            const internalUrls = await page.locator("a[href],link[href],img[src]").evaluateAll(elements =>
              elements.map(element => element.getAttribute("href") || element.getAttribute("src"))
                .filter(url => !url.startsWith("https:") && !url.startsWith("http:"))
            );
            assert.ok(internalUrls.every(url => url.startsWith("/") || url.startsWith("#")),
              "Internal resources and navigation must be independent of the document URL");
            const dataLink = page.getByRole("link", { name: "固定観測値JSON", exact: true });
            assert.equal(await dataLink.getAttribute("href"), "/data-lab/data/final-night-sources-20261012.json");
            const data = await page.evaluate(async href => {
              const response = await fetch(href);
              return { status: response.status, contentType: response.headers.get("content-type"), json: await response.json() };
            }, await dataLink.getAttribute("href"));
            assert.equal(data.status, 200);
            assert.match(data.contentType, /application\/json/);
            assert.deepEqual(data.json.counter_observations.map(point => point.stars), [6140, 6150, 7271]);
            assert.equal(data.json.uncertainty.official_final_event_rank, null);
            assert.deepEqual(data.json.uncertainty.post_cutoff_stars_range, [1121, 1131]);
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
              "Final-night report must not overflow horizontally");
            await page.screenshot({ path: join(output, `${engine}-${width}-final-night${suffix ? "" : "-slashless"}.png`), fullPage: true });
            reportVariants.push({ path: reportPath, metadata: reportHead, dataStatus: data.status });
            assert.equal(await page.locator(".final-top a").first().getAttribute("href"), "/data-lab/");
            await page.getByRole("link", { name: "データラボへ戻る", exact: true }).click();
            await page.waitForURL(`${baseUrl}/data-lab/`);
            await page.waitForSelector("#sr-chart .bar-row");
          }

          await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
          assert.ok(await page.locator('a[href="/data-lab/"]').count() >= 2, "Home card and nav links must exist");
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Home has horizontal overflow");
          const header = page.locator("header").first();
          const nav = page.getByRole("navigation", { name: "サイトナビ", exact: true });
          const menu = page.getByRole("button", { name: "メニュー", exact: true });
          const headerHeight = (await header.boundingBox()).height;
          assert.ok(headerHeight <= 70, `Header must remain compact at ${width}px (got ${headerHeight}px)`);
          if (width >= 1024) {
            assert.ok(await nav.isVisible());
            assert.equal(await menu.isVisible(), false);
            const links = await nav.locator("a").evaluateAll(elements => elements.map(element => {
              const box = element.getBoundingClientRect();
              return { top: box.top, right: box.right };
            }));
            assert.equal(links.length, 8);
            assert.ok(links.every(link => Math.abs(link.top - links[0].top) < 1), "All desktop links must share one row");
            assert.ok(links.every(link => link.right <= width), "Desktop links must fit the viewport");
          } else {
            assert.ok(await menu.isVisible());
            assert.equal(await nav.isVisible(), false);
            await menu.click();
            assert.equal(await menu.getAttribute("aria-expanded"), "true");
            const disclosure = page.getByRole("navigation", { name: "サイトメニュー", exact: true });
            assert.equal(await disclosure.locator("a").count(), 8);
            assert.ok(await disclosure.getByRole("link", { name: "データ分析", exact: true }).isVisible());
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
            await page.keyboard.press("Escape");
            assert.equal(await menu.getAttribute("aria-expanded"), "false");
          }
          await page.screenshot({ path: join(output, `${engine}-${width}-header.png`) });
          await page.evaluate(() => window.scrollTo({ top: 500, behavior: "instant" }));
          await page.waitForFunction(() =>
            window.scrollY >= 400 && Math.abs(document.querySelector("header").getBoundingClientRect().top) < 1
          );
          assert.ok(Math.abs((await header.boundingBox()).y) < 1, "Header must stick to the viewport");
          assert.deepEqual(errors, [], "Browser JavaScript must not throw");
          results.push({ engine, width, roster: 70, grade3: 27, search: "ok", overflow: false, headerHeight, navigation: width >= 1024 ? "single-row" : "disclosure", metadata: head, reportVariants });
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
