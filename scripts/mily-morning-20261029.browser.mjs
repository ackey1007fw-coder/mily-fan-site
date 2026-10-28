import assert from 'node:assert/strict';
import {join} from 'node:path';
export async function checkMorning20261029(page, baseUrl, output, engine, width) {
  await page.goto(`${baseUrl}/data-lab/reports/20261029-morning/`,{waitUntil:'networkidle'});
  assert.match(await page.title(),/10月29日朝/);
  assert.equal(await page.locator('[data-metric="stars"]').innerText(),'4,665');
  assert.equal(await page.locator('[data-metric="visits"]').innerText(),'649');
  assert.equal(await page.locator('#reference-metrics tbody tr').count(),9);
  assert.equal(await page.locator('#star-endpoints tbody tr').count(),8);
  assert.equal(await page.locator('#star-plot .observed-star').count(),8);
  assert.equal(await page.locator('#star-plot .observation-gap').count(),2);
  assert.equal(await page.locator('video,audio,img').count(),0);
  assert.match(await page.locator('#quality-heading').locator('..').innerText(),/全イベントの取得は未検証/);
  assert.match(await page.locator('main').innerText(),/6:32:47/);
  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex,nofollow,noarchive');
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://mily-fan-site.vercel.app/data-lab/reports/20261029-morning/');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Oct29 report must not overflow');
  await page.screenshot({path:join(output,`${engine}-${width}-morning-20261029.png`),fullPage:true});
  await page.getByRole('link',{name:'日付別ラボへ',exact:true}).click();
  const day=page.locator('#daily-2026-10-29');
  await day.waitFor({state:'visible'});
  if (await day.evaluate(el => Boolean(el.closest('details:not([open])')))) {
    await page.locator('#daily-past > summary').click();
  }
  const cards=day.locator('.daily-stream-card');
  assert.equal(await cards.count(),2);
  const morning=cards.last();
  await morning.locator('[data-missing="false"]').waitFor({state:'visible'});
  assert.equal(await morning.locator('.daily-stream-number').innerText(),'4,665');
  assert.equal(await morning.locator('svg circle').count(),36);
  await morning.getByRole('link',{name:'個別の分析・グラフを見る ↗',exact:true}).click();
  assert.match(page.url(),/\/data-lab\/reports\/20261029-morning\//);
}
