import assert from "node:assert/strict";
import { join } from "node:path";

/** Reuse CI's existing isolated browser/context; no new worker or external requests. */
export async function checkStreamBlackoutNotice({ context, base, output, scenario }) {
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.setDefaultTimeout(15000);
  try {
    await page.clock.setFixedTime(new Date("2026-09-26T08:00:00+09:00"));
    await page.goto(`${base}/`, { waitUntil: "networkidle" });
    const summary = page.locator("#stream-ng-summary");
    await summary.waitFor({ state: "visible" });
    assert.match(await summary.innerText(), /9:30〜19:00/);
    assert.match(await summary.innerText(), /配信未定/);
    assert.match(await summary.innerText(), /配信確定ではありません/);
    await summary.screenshot({ path: join(output, `${scenario.name}-stream-ng-home.png`) });
    const pagesBefore = context.pages().length;
    await summary.getByRole("link").click();
    await page.locator("#stream-ng").waitFor({ state: "visible" });
    assert.equal(context.pages().length, pagesBefore);
    assert.equal(new URL(page.url()).hash, "#stream-ng");
    const notice = page.locator("#stream-ng");
    assert.equal(await notice.locator("[data-ng-date]").count(), 7);
    assert.match(await notice.innerText(), /NG時間外は配信予定ではありません/);
    assert.match(await notice.innerText(), /掲示時刻は未確認/);
    const octoberFirst = notice.locator('[data-ng-date="2026-10-01"]');
    assert.match(await octoberFirst.innerText(), /14:00〜16:30/);
    assert.match(await octoberFirst.innerText(), /16:30〜22:30/);
    assert.equal(await notice.locator("img,video,iframe").count(), 0);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await notice.screenshot({ path: join(output, `${scenario.name}-stream-ng-week.png`) });

    // Exercise date-boundary updates without a reload, even when upstream APIs fail.
    await page.clock.setFixedTime(new Date("2026-10-03T00:00:00+09:00"));
    await page.evaluate(() => window.dispatchEvent(new Event("focus")));
    const archived = notice.locator("details");
    await archived.waitFor();
    assert.equal(await archived.getAttribute("open"), null);
    await archived.locator("summary").click();
    assert.match(await archived.innerText(), /対象期間は終了しました/);
    assert.match(await archived.innerText(), /10\/3以降のNG時間は、この掲示では分かりません/);
    await page.goto(`${base}/`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("#stream-ng-summary").count(), 0);
    assert.deepEqual(errors, []);
  } finally {
    await page.close();
  }
}
