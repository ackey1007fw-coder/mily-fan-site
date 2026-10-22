import assert from 'node:assert/strict';
import { join } from 'node:path';

// Runs in the existing browser suite. Clipboard outcomes are simulated; no real message is sent.
export async function checkProgressReading(page, { output, engine, width }) {
 const digest=page.locator('#at-a-glance');
 const copy=page.locator('#progress-copy'), status=page.locator('#progress-copy-status');
 await copy.waitFor({state:'visible'});
 assert.equal(await digest.locator('.digest-facts article').count(),3);
 assert.match(await digest.locator('[data-digest-proof="days"]').innerText(),/7.*7日/);
 assert.match(await digest.locator('[data-digest-proof="total"]').innerText(),/136,547/);
 assert.match(await digest.locator('[data-digest-proof="ratio"]').innerText(),/2\.01/);
 assert.match(await digest.locator('.digest-scope').innerText(),/19人/);
 assert.match(await digest.locator('.digest-scope').innerText(),/本人を含む固定16ルーム/);
 assert.match(await digest.locator('.digest-message').innerText(),/ノルマではありません/);
 assert.equal(await page.locator('#growth [data-proof="total-ratio"]').count(),1);
 const text=await page.locator('#progress-share-text').inputValue();
 for(const phrase of ['2026年10月15日〜21日','136,547pt','16ルーム（本人を含む）','19人','非公式','通過の保証ではありません'])assert.ok(text.includes(phrase),phrase);
 assert.ok(text.endsWith('https://mily-fan-site.vercel.app/data-lab/progress/#at-a-glance'));
 assert.ok(!text.includes('__DATA_LAB_'));
 const assertLayout=async()=>{
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No page overflow');
  assert.ok(await digest.locator('.digest-number').evaluateAll(nodes=>nodes.every(n=>n.scrollWidth<=n.clientWidth+1)),'Digest numbers must fit');
  assert.ok((await copy.boundingBox()).height>=44,'Touch target must remain usable');
 };
 await assertLayout();
 await digest.screenshot({path:join(output,`${engine}-${width}-progress-digest.png`)});
 if(width===390){
  await page.setViewportSize({width:320,height:950});
  try {await assertLayout();await digest.screenshot({path:join(output,`${engine}-320-progress-digest.png`)});}
  finally {await page.setViewportSize({width,height:950});}
 }
 await page.locator('#progress-reading-guide > summary').click();
 assert.match(await page.locator('#progress-reading-guide').innerText(),/8番目と9番目の平均/);
 await page.locator('#progress-reading-guide > summary').click();
 await page.evaluate(()=>{
  window.__progressCopyWrites=[];
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.__progressCopyWrites.push(value);}}});
 });
 await copy.click();
 await page.waitForFunction(()=>document.getElementById('progress-copy-status').textContent.startsWith('コピーしました'));
 assert.deepEqual(await page.evaluate(()=>window.__progressCopyWrites),[text]);
 assert.equal(await copy.isEnabled(),true);
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new DOMException('denied','NotAllowedError');}}}));
 await copy.click();
 await page.waitForFunction(()=>document.getElementById('progress-share-manual').open);
 assert.match(await status.innerText(),/自動コピーできませんでした/);
 assert.equal(await page.evaluate(()=>document.activeElement?.id),'progress-share-text');
 assert.equal(await page.locator('#progress-share-text').inputValue(),text);
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:undefined}));
 await copy.click();
 assert.match(await status.innerText(),/自動コピーできませんでした/);
 assert.equal(await copy.isEnabled(),true);
 await assertLayout();
 // Block script downloads to confirm that the static digest and manual fallback survive.
 const blockScripts=async route=>route.request().resourceType()==='script'?route.abort():route.fallback();
 await page.route('**/*',blockScripts);
 try {
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.locator('#progress-copy').isVisible(),false);
  assert.match(await page.locator('#at-a-glance').innerText(),/136,547/);
  await page.locator('#progress-share-manual > summary').click();
  assert.equal(await page.locator('#progress-share-text').inputValue(),text);
  assert.equal(await page.locator('#progress-share-text').isVisible(),true);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 } finally {
  await page.unroute('**/*',blockScripts);
  await page.reload({waitUntil:'networkidle'});
  await page.locator('#progress-copy').waitFor({state:'visible'});
 }
}
