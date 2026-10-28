import { checkProgressReading } from "./mily-progress-reading.browser.mjs";
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
          // New day-by-day archive: verify real points, 3 metric switches and unknown final values.
          if (width === 390 || width === 1440) {
            await page.locator("#daily-stream-groups .daily-day").first().waitFor({ state: "visible" });
            assert.equal(await page.locator("#daily-stream-groups .daily-day").count(), 14, "Fourteen broadcast dates from 10/14 through 10/27");
            const day26 = page.locator("#daily-2026-10-26");
            assert.equal(await day26.count(), 1, "Oct 26 receives exactly one separate broadcast date");
            if (!(await day26.getAttribute("open") !== null)) await day26.locator("summary").click();
            const day26Card = day26.locator(".daily-stream-card");
            assert.equal(await day26Card.count(), 1, "Partial night memo is a single card");
            await day26Card.locator('[data-missing="false"]').waitFor({ state: "visible" });
            assert.equal(await day26Card.locator(".daily-stream-number").innerText(), "2,720", "Third-party screen stars remain separate from memo viewer figures");
            assert.equal(await day26Card.locator("svg.daily-plot").count(), 0, "No graph without measured time-series points");
            assert.match(await day26Card.locator(".daily-stream-chart").innerText(), /時刻付き観測が2点未満/);
            const day25 = page.locator("#daily-2026-10-25");
            if (!(await day25.getAttribute("open") !== null)) await day25.locator("summary").click();
            const day25Cards = day25.locator(".daily-stream-card");
            assert.equal(await day25Cards.count(), 2, "Night and morning stay separate");
            const day25Card = day25Cards.last();
            assert.equal(await day25Card.count(), 1, "10/25 morning must remain its own stream");
            await day25Card.locator('[data-missing="false"]').first().waitFor({ state: "visible" });
            assert.equal(await day25Card.locator(".daily-stream-number").innerText(), "3,767", "The nonfinal morning value is explicitly observed");
            await day25.locator("svg.daily-plot circle").first().waitFor({ state: "visible" });
            assert.equal(await day25.locator("svg.daily-plot circle").count(), 13, "Only 13 observed time points are plotted");
             const day24 = page.locator("#daily-2026-10-24");
             if (!(await day24.getAttribute("open") !== null)) await day24.locator("summary").click();
             const day24Radio = day24.locator(".daily-stream-card");
             assert.equal(await day24Radio.count(), 2, "Oct 24 afternoon and morning stay separate");
             await day24Radio.locator('[data-missing="false"]').first().waitFor({ state: "visible" });
             assert.equal(await day24Radio.first().locator(".daily-stream-number").innerText(), "3,904", "Noon last valid screen is not an official final");
             assert.equal(await day24Radio.last().locator(".daily-stream-number").innerText(), "4,718", "Morning last valid screen is not an official final");
             assert.equal(await day24Radio.locator("svg.daily-plot").count(), 2, "Noon and morning real observations each render a chart");
            const day22 = page.locator("#daily-2026-10-22");
            if (!(await day22.getAttribute("open") !== null)) await day22.locator("summary").click();
            const day22Cards = day22.locator(".daily-stream-card");
            assert.equal(await day22Cards.count(), 2, "Oct 22 night and morning remain separate");
            assert.deepEqual(await day22Cards.locator("h4").allTextContents(), ["夜の配信", "朝の配信"]);
            for (const [index, expected] of [[0, "未確認"], [1, "未取得"]]) {
              const card = day22Cards.nth(index);
              await card.locator('[data-missing="true"]').waitFor({ state: "visible" });
              assert.equal(await card.locator(".daily-stream-number").innerText(), expected);
            }
            assert.equal(await day22.locator("svg.daily-plot").count(), 0, "Missing counters must not produce a zero graph");
            const day20 = page.locator("#daily-2026-10-20");
            await day20.locator("summary").click();
            const today = day20.locator(".daily-stream-card").last();
            await today.locator("svg.daily-plot circle").first().waitFor({ state: "visible" });
            assert.equal(await today.locator("svg.daily-plot circle").count(), 35, "Only the 35 actually saved Oct 20 counter points");
            assert.match(await today.locator(".daily-stream-stat").innerText(), /2,545/);
            await page.locator('button[data-daily-metric="visits"]').click();
            assert.match(await today.locator(".daily-stream-stat").innerText(), /281/);
            assert.equal(await page.locator('button[data-daily-metric="visits"]').getAttribute("aria-pressed"), "true");
            await page.locator('button[data-daily-metric="comments"]').click();
            assert.match(await today.locator(".daily-stream-stat").innerText(), /254/);
            await page.locator('button[data-daily-metric="stars"]').click();
            const unknown = page.locator("#daily-2026-10-19");
            await unknown.locator("summary").click();
            await unknown.locator('[data-missing="true"]').waitFor({ state: "visible" });
            assert.match(await unknown.locator(".daily-stream-chart").innerText(), /時刻付き観測が2点未満/);
            const eighteenth = page.locator("#daily-2026-10-18");
            await eighteenth.locator("summary").click();
            assert.equal(await eighteenth.locator(".daily-stream-card").count(), 2, "Oct 18 night/morning remain distinct");
            assert.match(await eighteenth.locator(".daily-stream-card").first().locator("h4").innerText(), /夜/);
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Day archive must not cause horizontal overflow");
            await today.screenshot({ path: join(output, `${engine}-${width}-day-archive.png`) });
          }
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Data Lab has horizontal overflow");

          const labDocumentHeight = await page.evaluate(() => document.documentElement.scrollHeight);
          if (labDocumentHeight <= 30000) {
            await page.screenshot({
              path: join(output, `${engine}-${width}-data-lab.png`),
              fullPage: true,
            });
          } else {
            // Chromium/WebKit cannot take screenshots over 32767px tall.
            // Preserve evidence from the top, the newest velocity chart and the roster.
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.screenshot({ path: join(output, `${engine}-${width}-data-lab.png`), fullPage: false });
            const velocityCard = page.locator("#night-20261016-comment-velocity");
            assert.equal(await velocityCard.locator(".velocity-bar").count(), 8, "All eight speed bars must be visible in the DOM");
            await velocityCard.screenshot({ path: join(output, `${engine}-${width}-velocity.png`) });
            await page.locator("#roster").screenshot({ path: join(output, `${engine}-${width}-roster.png`) });
          }
          if (width === 390 || width === 1440) {
            const memoResponse = await page.goto(`${baseUrl}/data-lab/reports/20261026-night/`, { waitUntil: "networkidle" });
            assert.equal(memoResponse.status(), 200, "October 26 preliminary report is built and reachable");
            assert.match(await page.title(), /10月26日夜/);
            assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex,nofollow,noarchive");
            assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://mily-fan-site.vercel.app/data-lab/reports/20261026-night/");
            assert.match(await page.locator("#coverage").innerText(), /未確認/);
            assert.equal(await page.locator('[data-metric]').count(), 3);
            for (const metric of ["stars", "visits", "comments"]) assert.equal(await page.locator(`[data-metric="${metric}"]`).innerText(), "未確認");
            assert.equal(await page.locator('script[src="/mily-analytics-loader.js"]').count(), 1, "Report keeps analytics injection");

            const morningResponse = await page.goto(`${baseUrl}/data-lab/reports/20261022-morning/`, { waitUntil: "networkidle" });
            assert.equal(morningResponse.status(), 200);
            assert.equal(await page.locator('script[src="/mily-analytics-loader.js"]').count(), 1, "New report keeps analytics injection");
            assert.equal(await page.locator('[data-metric]').count(), 3);
            for (const metric of ["stars", "visits", "comments"]) assert.equal(await page.locator(`[data-metric="${metric}"]`).innerText(), "未取得");
            assert.match(await page.locator("#coverage").innerText(), /24分55.124秒/);
            assert.match(await page.locator("#recap").innerText(), /一日へのエール/);
            assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex,nofollow,noarchive");
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
            await page.screenshot({ path: join(output, `${engine}-${width}-oct22-morning.png`), fullPage: true });
            const progressResponse = await page.goto(`${baseUrl}/data-lab/progress/`, { waitUntil: "networkidle" });
            assert.equal(progressResponse.status(), 200);
            await checkProgressReading(page, { output, engine, width });
            assert.equal(await page.locator('[data-peer-rank]').count(), 9);
            const week = page.locator('#week-20261015-21');
            assert.equal(await week.locator('[data-week-day]').count(), 7);
            assert.equal(await week.locator('.week-fill').count(), 14);
            assert.match(await week.locator('[data-week-proof="total"]').innerText(), /136,547/);
            assert.match(await week.locator('[data-week-proof="above"]').innerText(), /7.*7日/);
            assert.match(await week.locator('[data-week-proof="rank"]').innerText(), /6.*16/);
            await week.locator('#week-fixed-cohort > summary').click();
            assert.equal(await week.locator('[data-week-peer]').count(), 16);
            await week.locator('#week-missing > summary').click();
            assert.match(await week.locator('#week-missing').innerText(), /19人/);
            assert.match(await week.locator('#week-missing').innerText(), /未掲載を0とせず/);
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Seven-day section must not overflow');
            await week.locator('.week-chart').screenshot({ path: join(output, `${engine}-${width}-seven-day-progress.png`) });

            const dailyPeers = page.locator('#daily-peers-20261021');
            assert.equal(await dailyPeers.locator('[data-daily-peer-entry]').count(), 23);
            assert.match(await dailyPeers.locator('[data-day-proof="points"]').innerText(), /30,020/);
            assert.match(await dailyPeers.locator('[data-day-proof="rank"]').innerText(), /4.*23/);
            assert.match(await dailyPeers.innerText(), /全35人中の4位でも/);
            assert.equal(await dailyPeers.locator('[data-unlisted-count="12"]').count(), 1);
            await dailyPeers.screenshot({ path: join(output, `${engine}-${width}-daily-peers.png`) });
            assert.match(await page.locator('#campaign-20261021').innerText(), /Green以上/);
            assert.match(await page.locator('#campaign-20261021').innerText(), /ブーストランキング/);
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
            await page.locator('#campaign-20261021').screenshot({ path: join(output, `${engine}-${width}-campaign-scope.png`) });
          }
          // Historical comment rhythms are a separate archive, not a larger
          // full-page screenshot of the already long main analysis view.
          const velocityPage = await page.goto(`${baseUrl}/data-lab/comment-velocity/`, { waitUntil: "networkidle" });
          assert.equal(velocityPage.status(), 200);
          assert.match(await page.title(), /コメント分速の記録/);
          assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex,nofollow,noarchive");
          await page.locator("#velocity-panel").waitFor({ state: "visible" });
          assert.equal(await page.locator("#velocity-run-picks button").count(), 7);
          assert.equal(await page.locator("#velocity-archive-body tr").count(), 15);
          assert.match(await page.locator("#velocity-selected-label").innerText(), /10\/16 夜/);
          assert.equal(await page.locator("#velocity-chart rect").count(), 8);
          assert.equal(await page.locator("#velocity-table-body tr").count(), 8);
          assert.equal(await page.locator("#velocity-mean").innerText(), "7.35");
          assert.equal(await page.locator("#velocity-max").innerText(), "10.84");
          await page.getByRole("button", { name: "四次審査期（10/12まで）" }).click();
          assert.equal(await page.locator("#velocity-run-picks button").count(), 6);
          assert.match(await page.locator("#velocity-selected-label").innerText(), /10\/12 夜/);
          assert.ok(await page.locator("#velocity-chart rect").count() > 8);
          await page.getByRole("button", { name: "10/13以降" }).click();
          const oct13Night = page.locator("#velocity-run-picks").getByRole("button", { name: /10\/13 夜/ });
          await oct13Night.click();
          assert.match(await page.locator("#velocity-selected-label").innerText(), /10\/13 夜/);
          assert.equal(await page.locator("#velocity-chart rect").count(), 10);
          await page.locator("#velocity-run-picks").getByRole("button", { name: /10\/16 夜/ }).click();
          assert.equal(await page.locator("#velocity-chart rect").count(), 8);
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Comment rhythm archive must not overflow the page");
          if ((engine === "webkit" && width === 390) || (engine === "chromium" && width === 1440)) {
            await page.screenshot({ path: join(output, `${engine}-${width}-comment-velocity-archive.png`), fullPage: true });
          }
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

          await page.goto(`${baseUrl}/data-lab/`, { waitUntil: "networkidle" });
          await page.getByRole("link", { name: "10/19朝の分析レポートを読む ↗", exact: true }).click();
          await page.waitForURL(`${baseUrl}/data-lab/reports/20261019-morning/`);
          assert.match(await page.title(), /10月19日朝の記録と金グリッター目標/);
          assert.match(await page.locator(".alert").innerText(), /朝配信だけの獲得ptではありません/);
          assert.match(await page.locator("#morning-findings").innerText(), /評価は保留/);
          await page.getByRole("link", { name: "今週の金グリ目標へ ↓", exact: true }).click();
          await page.waitForURL(`${baseUrl}/data-lab/reports/20261019-morning/#glitter-goal`);
          assert.ok(await page.getByRole("heading", { name: "次の金グリッターへ。今週の現在地", exact: true }).isVisible());
          assert.equal(await page.locator("#weekly-minimum").getAttribute("value"), "7089");
          assert.match(await page.locator("#glitter-goal").innerText(), /32,911/);
          assert.match(await page.locator("#glitter-goal").innerText(), /自動更新されません/);
          assert.equal(await page.locator("details").getAttribute("open"), null,
            "Invalid early zeroes must stay folded on initial load");
          await page.locator("details summary").click();
          assert.notEqual(await page.locator("details").getAttribute("open"), null);
          assert.ok(await page.getByRole("cell", { name: "無効・欠測", exact: true }).isVisible());
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
            `Morning report must not overflow at ${width}px in ${engine}`);
          await page.locator("details summary").click();
          await page.locator("#glitter-goal").screenshot({ path: join(output, `${engine}-${width}-morning-glitter-goal.png`) });
          await page.getByRole("link", { name: "前夜18日の画面実測を見る ↗", exact: true }).click();
          await page.waitForURL(`${baseUrl}/data-lab/reports/20261018-night/`);
          assert.match(await page.locator("h1").innerText(), /10月18日夜/);
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
            `October 18 night report must not overflow at ${width}px in ${engine}`);

          if (width === 390 || width === 1440) {
            for (const [route, count, recap, stars] of [
              ["20261020-night", 207, "2026-10-20-night-showroom", "7,087"],
              ["20261021-morning", 155, "2026-10-21-morning-showroom", "11,214"],
            ]) {
              const report = await page.goto(`${baseUrl}/data-lab/reports/${route}/`, { waitUntil: "networkidle" });
              assert.equal(report.status(), 200);
              assert.match(await page.locator("h1").innerText(), new RegExp(`${count}点`));
              assert.ok((await page.locator(".cards").innerText()).includes(stars));
              assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex,nofollow,noarchive");
              for (const key of ["stars", "visits", "comments"]) {
                await page.locator(`label[for="metric-${key}"]`).click();
                assert.ok(await page.locator(`.metric-panel[data-metric="${key}"]`).isVisible());
                assert.equal(await page.locator(`.metric-panel[data-metric="${key}"] circle`).count(), count);
              }
              assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Observation report overflow");
              await page.screenshot({ path: join(output, `${engine}-${width}-${route}.png`), fullPage: true });
              await page.locator(`nav a[href="/activities/live/#recap-${recap}"]`).click();
              await page.locator(`#recap-${recap}`).waitFor({ state: "visible" });
              assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "New recap overflow");
            }
          }

          if ([320, 1440].includes(width)) {
            await page.goto(`${baseUrl}/data-lab/reports/20261028-morning/`, {waitUntil:"networkidle"});
            assert.match(await page.locator("main").innerText(), /全239区間/);
            assert.equal(await page.locator("tbody tr").count(),9);
            assert.equal(await page.locator("main img").count(),0);
            assert.equal(await page.locator('script[src="/mily-analytics-loader.js"]').count(),1);
            assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
            await page.screenshot({path:join(output,`${engine}-${width}-morning-20261028.png`),fullPage:true});
            await page.goto(`${baseUrl}/data-lab/reports/20261027-night/`, {waitUntil:"networkidle"});
            assert.match(await page.locator("main").innerText(), /原音聴取0秒/);
            assert.equal(await page.locator("tbody tr").count(),9);
            assert.equal(await page.locator('script[src="/mily-analytics-loader.js"]').count(),1);
            const nightPhoto=page.locator("main img");await nightPhoto.scrollIntoViewIfNeeded();
            await page.waitForFunction(i=>i.complete&&i.naturalWidth>0,await nightPhoto.elementHandle());
            await nightPhoto.evaluate(i=>i.decode());
            assert.deepEqual(await nightPhoto.evaluate(i=>[i.naturalWidth,i.naturalHeight,i.width,i.height]),[180,305,180,305]);
            assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
            await page.screenshot({path:join(output,`${engine}-${width}-night-20261027.png`),fullPage:true});
            for (const [date, slot, visits, marker] of [
              ["20261025", "night", "239", "あっきーへのお礼"],
              ["20261026", "night", "110", "応援する側にプレッシャー"],
              ["20261027", "morning", "354", "今日も一緒に頑張ろう"],
            ]) {
              await page.goto(`${baseUrl}/data-lab/reports/${date}-${slot}/`, { waitUntil: "networkidle" });
              const supplement = page.locator("#asr-followup");
              assert.equal(await page.locator('script[src="/mily-analytics-loader.js"]').count(), 1);
              assert.match(await supplement.innerText(), /第三者SHOWROOM Emulator/);
              assert.match(await supplement.innerText(), /確定終値ではありません/);
              assert.match(await supplement.innerText(), /映像PTSの同期/);
              assert.ok((await supplement.innerText()).includes(marker));
              assert.ok((await supplement.locator("table").innerText()).includes(visits));
              assert.equal(await supplement.locator("tbody tr").count(), 9);
              assert.equal(await page.locator("video, audio").count(), 0);
              if (date === "20261025") {
                const photo = supplement.locator("img");
                await photo.scrollIntoViewIfNeeded();
                await page.waitForFunction(image => image.complete && image.naturalWidth > 0, await photo.elementHandle());
                await photo.evaluate(image => image.decode());
                assert.deepEqual(await photo.evaluate(image => [image.naturalWidth, image.naturalHeight]), [130, 200]);
                assert.ok(await photo.evaluate(image => image.getBoundingClientRect().width <= 130 && image.getBoundingClientRect().height <= 200));
              }
              assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
              await supplement.screenshot({ path: join(output, `${engine}-${width}-${date}-${slot}-followup.png`) });
            }
            await page.goto(`${baseUrl}/data-lab/reports/20261026-night/`, { waitUntil: "networkidle" });
            assert.match(await page.locator("h1").innerText(), /10月26日夜/);
            assert.equal(await page.locator('[data-metric="visits"]').innerText(), "未確認");
            assert.equal(await page.locator("svg, canvas, video, audio").count(), 0);
            await page.getByRole("link", { name: "LIVE STREAMのこの回へ", exact: true }).click();
            const card = page.locator("#recap-2026-10-26-night-showroom");
            await card.waitFor({ state: "visible" });
            await page.waitForFunction(() => document.getElementById("recap-2026-10-26-night-showroom")?.hasAttribute("open"));
            assert.match(await card.innerText(), /視聴メモ22:30頃〜（終了未確認）/);
            assert.match(await card.innerText(), /録画内の経過時刻ではありません/);
            assert.match(await card.innerText(), /22:47頃/);
            assert.match(await card.innerText(), /終盤（メモ範囲内）/);
            assert.equal(await card.locator("img, video, audio").count(), 0);
            const details = card.locator("[data-recap-verification]");
            await details.locator("summary").click();
            assert.match(await details.innerText(), /実尺・連続性・正式な配信開始終了は未確認/);
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Memo recap must not overflow");
            await card.screenshot({ path: join(output, `${engine}-${width}-night-20261026-live.png`) });
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
