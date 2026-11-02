import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { digestFacts, digestShareText, renderDigest } from './mily-progress-digest.mjs';
import { copyProgressText, initProgressShare } from '../public/data-lab/assets/progress-share.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const data=JSON.parse(read('public/data-lab/data/semifinal-talent-seven-days-20261015-21.json'));
const page=read('data-lab/progress/index.html');
const sourceText=digestShareText(data);
const resolved=sourceText.replaceAll('__DATA_LAB_PROGRESS_CANONICAL__','https://mily-fan-site.vercel.app/data-lab/progress/');
function ui(writeText) {
 const listeners=[];
 const button={dataset:{},hidden:true,disabled:false,addEventListener:(name,fn)=>listeners.push([name,fn])};
 const text={value:resolved,focused:false,selected:false,focus(){this.focused=true;},select(){this.selected=true;}};
 const manual={open:false},status={textContent:''};
 const elements={'progress-copy':button,'progress-share-text':text,'progress-share-manual':manual,'progress-copy-status':status};
 const root={getElementById:id=>elements[id]};
 const env={navigator:{clipboard:writeText===undefined?undefined:{writeText}}};
 return {root,env,button,text,manual,status,listeners,click:()=>listeners[0][1]()};
}
test('digest: concise facts are derived from the unchanged seven-day source',()=>{
 assert.deepEqual(digestFacts(data),{total:136547,above:7,days:7,cohort:16,missing:19,ratio:2.01});
 assert.ok(page.includes(renderDigest(data)));
 assert.equal((page.match(/data-digest-proof=/g)||[]).length,3);
 assert.ok(page.indexOf('id="at-a-glance"')<page.indexOf('id="week-20261015-21"'));
 assert.equal((page.match(/data-week-day=/g)||[]).length,7);
 assert.equal((page.match(/data-daily-peer-entry=/g)||[]).length,23);
 assert.equal((page.match(/data-peer-rank=/g)||[]).length,9);
});
test('digest: historical proof moves to its own period without deletion or duplication',()=>{
 const growth=page.match(/<section class="panel" id="growth">[\s\S]*?<\/section>/)?.[0];
 assert.ok(growth);
 for(const key of ['total-ratio','total-gain','outside-ratio']){
  assert.equal((page.match(new RegExp(`data-proof="${key}"`,'g'))||[]).length,1);
  assert.ok(growth.includes(`data-proof="${key}"`));
 }
 assert.match(growth,/第三者の公開集計/);
 assert.match(page,/数字は、明日も超えなければならないノルマではありません/);
});
test('digest: copied explanation retains exact period, metric, exclusions and source',()=>{
 for(const phrase of ['2026年10月15日〜21日','Classic・タレント','136,547pt','16ルーム（本人を含む）','7日すべて','2.01倍','19人','非公式','審査順位','配信効率','通過の保証ではありません'])assert.ok(sourceText.includes(phrase),phrase);
 assert.ok(sourceText.endsWith('__DATA_LAB_PROGRESS_CANONICAL__#at-a-glance'));
 assert.match(page,/textarea id="progress-share-text" readonly/);
 assert.match(page,/role="status" aria-live="polite"/);
 assert.match(page,/id="progress-copy"[^>]* hidden/);
 assert.match(page,/元データ・出典を確かめる/);
 assert.match(page,/8番目と9番目の平均/);
});
test('digest: missing or changed snapshot is not silently converted into positive claims',()=>{
 const missing=structuredClone(data);missing.days[0].participants.find(x=>x.entry===734).points=null;
 assert.throws(()=>digestFacts(missing));assert.throws(()=>renderDigest(missing));
 const changed=structuredClone(data);changed.days[0].participants.find(x=>x.entry===734).points+=1;
 assert.throws(()=>digestShareText(changed));
});
test('copy: await actual write and never read the clipboard',async()=>{
 let captured,release;const pending=new Promise(resolve=>{release=resolve;});let complete=false;
 const action=copyProgressText(resolved,async value=>{captured=value;await pending;}).then(ok=>{complete=true;return ok;});
 await Promise.resolve();assert.equal(complete,false);assert.equal(captured,resolved);
 release();assert.equal(await action,true);assert.equal(complete,true);
});
test('copy: rejection, unavailable API and unresolved templates do not claim success',async()=>{
 assert.equal(await copyProgressText(resolved,()=>Promise.reject(new Error('denied'))),false);
 assert.equal(await copyProgressText(resolved,undefined),false);
 let calls=0;
 for(const text of [null,'',' ',sourceText])assert.equal(await copyProgressText(text,()=>{calls++;}),false);
 assert.equal(calls,0);
});
test('copy UI: bind once, no startup write, explicit click and completion status',async()=>{
 const values=[];const u=ui(async value=>{values.push(value);});
 assert.equal(initProgressShare(u.root,u.env),true);assert.equal(initProgressShare(u.root,u.env),false);
 assert.equal(u.listeners.length,1);assert.deepEqual(values,[]);assert.equal(u.button.hidden,false);
 await u.click();assert.deepEqual(values,[resolved]);assert.match(u.status.textContent,/コピーしました/);
 assert.equal(u.manual.open,false);assert.equal(u.button.disabled,false);
 assert.equal(initProgressShare({getElementById:()=>null},{}),false);
});
test('copy UI: denial and unsupported browsers retain accessible manual fallback',async()=>{
 for(const writer of [undefined,async()=>{throw new Error('denied');}]){
  const u=ui(writer);initProgressShare(u.root,u.env);await u.click();
  assert.equal(u.manual.open,true);assert.equal(u.text.focused,true);assert.equal(u.text.selected,true);
  assert.match(u.status.textContent,/自動コピーできませんでした/);assert.doesNotMatch(u.status.textContent,/コピーしました/);
  assert.equal(u.button.disabled,false);
 }
});
test('copy UI: repeated click while pending does not write twice',async()=>{
 let calls=0,release;const pending=new Promise(r=>{release=r;});const u=ui(async()=>{calls++;await pending;});
 initProgressShare(u.root,u.env);const first=u.click();assert.equal(u.button.disabled,true);await u.click();
 assert.equal(calls,1);release();await first;assert.equal(u.button.disabled,false);
});
test('digest: publishing boundaries and progressive enhancement remain intact',()=>{
 const code=read('public/data-lab/assets/progress-share.js');
 assert.doesNotMatch(code,/fetch\s*\(|readText\s*\(|localStorage|sessionStorage|sendBeacon|navigator\.share|execCommand/);
 assert.match(page,/type="module" src="\/data-lab\/assets\/progress-share.js"/);
 assert.match(page,/href="\/data-lab\/assets\/progress-reading.css"/);
 assert.match(page,/script-src 'self'/);assert.match(page,/noindex,nofollow,noarchive/);
 assert.doesNotMatch(page+code,/@gmail\.com|drive\.google\.com|chatgpt\.site|C:\\Users|viewer[_-]?id|contributor[_-]?id|本人は焦|完璧主義|\uFFFD/);
});
