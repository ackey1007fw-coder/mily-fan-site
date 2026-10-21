import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
export const REPORTS=[
 {date:'20261020',slot:'night',title:'10月20日 夜の配信',recap:'2026-10-20-night-showroom',other:'20261021-morning'},
 {date:'20261021',slot:'morning',title:'10月21日 朝の配信',recap:'2026-10-21-morning-showroom',other:'20261020-night'},
];
const metrics={stars:'きら星',visits:'総訪問表示',comments:'コメント表示',firstVisits:'初訪問表示',repeatVisits:'2度訪問表示',newFollows:'新規follow表示',otherFree:'その他free表示',star100People:'星100貢献人数の表示',recommendedCommentPeople:'おすすめcomment人数の表示'};
const e=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n=x=>x===null||x===undefined?'未確認':Number(x).toLocaleString('ja-JP');
const time=x=>x.slice(11,19);
const seconds=(a,b)=>(Date.parse(b)-Date.parse(a))/1000;
const span=s=>s>=60?Math.floor(s/60)+'分'+Math.round(s%60)+'秒':Math.round(s)+'秒';
export function chart(d,key){
 const points=d.observations,a=Date.parse(d.screenStartedAtJst),b=Date.parse(d.endConfirmation.atJst);
 const max=Math.ceil(Math.max(...points.map(p=>p[key]))*1.1/10)*10,xx=t=>64+(Date.parse(t)-a)/(b-a)*738;
 const bands=[{fromJst:d.screenStartedAtJst,toJst:points[0].atJst},...d.counters.gaps,{fromJst:points.at(-1).atJst,toJst:d.endConfirmation.atJst}];
 let s='<svg viewBox="0 0 850 266" role="img" aria-label="'+metrics[key]+'の実観測'+points.length+'点。時計時刻に比例し、欠測は薄い帯、点の間は補間しません。">';
 for(const g of bands)s+='<rect x="'+xx(g.fromJst).toFixed(2)+'" y="20" width="'+Math.max(1,xx(g.toJst)-xx(g.fromJst)).toFixed(2)+'" height="188" fill="#c9a66d" opacity=".16"><title>有効観測なし '+time(g.fromJst)+'〜'+time(g.toJst)+'</title></rect>';
 for(let i=0;i<5;i++){const y=208-i*47;s+='<line x1="64" x2="802" y1="'+y+'" y2="'+y+'" stroke="#375566"/><text x="54" y="'+(y+5)+'" text-anchor="end" fill="#bfd0d9" font-size="13">'+n(Math.round(max*i/4))+'</text>';}
 for(const p of points)s+='<circle cx="'+xx(p.atJst).toFixed(2)+'" cy="'+(208-p[key]/max*188).toFixed(2)+'" r="3.4" fill="#8ce6c9"><title>'+time(p.atJst)+' / '+n(p[key])+'</title></circle>';
 for(const [t,anchor] of [[d.screenStartedAtJst,'start'],[d.endConfirmation.atJst,'end']])s+='<text x="'+xx(t).toFixed(2)+'" y="239" text-anchor="'+anchor+'" fill="#bfd0d9" font-size="13">'+time(t)+'</text>';
 const mid=new Date((a+b)/2+9*3600000).toISOString().slice(11,16);
 return s+'<text x="433" y="239" text-anchor="middle" fill="#bfd0d9" font-size="13">'+mid+'</text></svg>';
}
export function render(d,c){
 const last=d.lastValidOnline,first=d.observations[0],count=d.observations.length;
 const rows=Object.entries(metrics).map(([k,label])=>'<tr><th scope="row">'+label+'</th><td class="number">'+n(last[k])+'</td></tr>').join('');
 const gapRows=d.counters.gaps.map(g=>'<tr><td class="time">'+time(g.fromJst)+' → '+time(g.toJst)+'</td><td>'+span(g.seconds)+'</td></tr>').join('');
 const table=d.observations.map(p=>'<tr><th scope="row" class="time">'+time(p.atJst)+'</th>'+['stars','visits','comments'].map(k=>'<td class="number">'+n(p[k])+'</td>').join('')+'</tr>').join('');
 const transport=d.collectionQuality;
 const recording=d.recording;
 const recordingText=recording.summary||'録画は2ファイル。全区間の連続性は未検証です。';
 let covered=0;const delta={stars:0,visits:0,comments:0};
 for(const group of d.segments)for(let i=1;i<group.five_minute_window_endpoints.length;i++){
  const l=group.five_minute_window_endpoints[i-1],r=group.five_minute_window_endpoints[i],s=seconds(l.atJst,r.atJst);
  if(s<30||s>390||Math.abs(s-(r.elapsedSeconds-l.elapsedSeconds))>Math.max(30,s*.1))continue;
  covered+=s;for(const k in delta)delta[k]+=r[k]-l[k];
 }
 const pace=Object.keys(delta).map(k=>'<tr><th>'+metrics[k]+'</th><td class="number">+'+n(delta[k])+'</td><td class="number">'+(delta[k]/covered*60).toFixed(2)+'</td></tr>').join('');
 const plots=['stars','visits','comments'].map(k=>'<figure class="metric-panel" data-metric="'+k+'"><h3>'+metrics[k]+'</h3><div class="plot-wrap">'+chart(d,k)+'</div><figcaption>横軸は日本時間の保存時刻。薄い帯は開始前後・途中の有効観測不足です。終了確認時刻まで軸を確保し、未取得の末尾を見えるようにしています。</figcaption></figure>').join('');
 return '<!doctype html>\n<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><meta name="referrer" content="no-referrer"><meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\'; style-src \'self\'; img-src \'self\' data:; object-src \'none\'; base-uri \'none\'; form-action \'none\'"><title>'+c.title+'｜観測と欠測｜MILY SIGNAL（非公式）</title><link rel="canonical" href="__DATA_LAB_'+c.date+'_'+c.slot.toUpperCase()+'_CANONICAL__"><meta property="og:url" content="__DATA_LAB_'+c.date+'_'+c.slot.toUpperCase()+'_CANONICAL__"><meta property="og:image" content="__DATA_LAB_OG_IMAGE__"><link rel="stylesheet" href="/data-lab/assets/observation-report.css"></head><body><main>'+
 '<nav aria-label="レポートの移動"><a href="/data-lab/#daily-'+d.dateJst+'">日付別のラボへ</a><a href="/activities/live/#recap-'+c.recap+'">この回の配信メモ</a><a href="/data-lab/stream-timing/">時間帯の比較</a><a href="/data-lab/reports/'+c.other+'/">もう一方の配信</a></nav>'+
 '<div class="eyeline">MILY SIGNAL · '+d.dateJst+' · SHOWROOM</div><h1>'+c.title+'<br>'+count+'点の観測と、残る空白。</h1><p class="lead">保存できた画面の参考値を、時刻・9指標・取得範囲と一緒に振り返ります。録画の分割は同じ配信としてまとめています。</p>'+
 '<p class="notice">'+e(d.measurementNote)+'</p><div class="cards">'+['stars','visits','comments'].map(k=>'<div class="card"><small>'+metrics[k]+'</small><strong>'+n(last[k])+'</strong><small>'+time(last.atJst)+' 保存・画面参考値</small></div>').join('')+'</div>'+
 '<section id="observations"><h2>保存時刻に沿って見る</h2><p>画面の開始表示は'+time(d.screenStartedAtJst)+'。有効な観測は'+time(first.atJst)+'〜'+time(last.atJst)+'です。公式開始・終了秒とは区別しています。点同士は結ばず、未取得を0にしません。</p>'+
 '<input class="metric-radio" id="metric-stars" type="radio" name="metric" checked><input class="metric-radio" id="metric-visits" type="radio" name="metric"><input class="metric-radio" id="metric-comments" type="radio" name="metric"><div class="metric-controls" role="group" aria-label="観測グラフの指標"><label for="metric-stars">きら星</label><label for="metric-visits">総訪問表示</label><label for="metric-comments">コメント表示</label></div><div class="plots">'+plots+'</div></section>'+
 '<section><h2>9指標の最後の利用可能値</h2><p class="muted">'+time(last.atJst)+'保存／数値・画面経過の最後の進行 '+time(last.uiProgressAtJst)+'。表示の実人数、公式ギフト数・ポイント・確定最終値は未検証です。</p><div class="table-wrap"><table><thead><tr><th>画面の指標</th><th>参考表示</th></tr></thead><tbody>'+rows+'</tbody></table></div></section>'+
 '<section><h2>観測できた区間内の参考ペース</h2><p>欠測をまたぐ区間を外し、画面経過と保存時刻が整合する約'+(covered/60).toFixed(1)+'分の区間を合算しました。増分を実観測時間で割った値です。配信全体の平均や次回の予測には使えません。</p><div class="table-wrap"><table><thead><tr><th>指標</th><th>採用区間の増分合計</th><th>1分あたり</th></tr></thead><tbody>'+pace+'</tbody></table></div><p>'+e(d.comparisonNote)+'</p></section>'+
 '<section id="coverage"><h2>どこまで確認できたか</h2><div class="quality-grid"><article><h3>画面カウンター</h3><p>'+n(d.counters.rowsRead)+'行を照合し、'+n(d.counters.acceptedRows)+'行から'+count+'点を選択。最後の利用可能時刻以前の不完全・無効行'+n(d.counters.excludedBeforeCheckpoint)+'行、その時刻より後の'+n(d.counters.rowsAfterLastUsable)+'行を除きました。</p></article>'+
 '<article><h3>終了の観測</h3><p>'+time(d.endConfirmation.atJst)+'までに3回の明示オフライン表示を確認。終了状態を確認できても、直前の最終数値が揃ったことにはなりません。</p></article>'+
 '<article><h3>録画と本文</h3><p>'+e(recordingText)+'</p><p>全文・音声・原録画は公開していません。内容の振り返りは<a href="/activities/live/#recap-'+c.recap+'">配信メモ</a>へ。</p></article>'+
 '<article><h3>実保存ファイルとの照合</h3><p>受信フレーム '+n(transport.browserFrames.storedRecords)+'レコード、HTTP応答 '+n(transport.httpResponses.storedRecords)+'レコードを実ファイルで確認。古い状態表示だけで保存が止まったとは判断していません。</p><p class="muted">全イベントの完全取得・コメント件数ではありません。</p></article>'+
 '<article><h3>画面詳細は不完全</h3><p>'+(transport.dom.droppedFragments===null?'累積破棄数は未確定。':n(transport.dom.droppedFragments)+'断片の破棄記録。')+e(transport.dom.meaning)+'</p></article>'+
 '<article><h3>時刻と集計の境界</h3><p>10月12日終了の四次審査とは別配信です。新イベント正式ID、有料ギフト額、同時視聴者数、実ユニーク視聴者数は未取得です。</p></article></div>'+
 '<details><summary>途中の'+d.counters.gaps.length+'か所の空白を見る</summary><p>連続する有効画面の間隔が30秒を超えた区間。両端の間を補間しません。無効な行が挟まる区間も分速では分離しています。</p><div class="table-wrap"><table><thead><tr><th>有効観測の前後</th><th>間隔</th></tr></thead><tbody>'+gapRows+'</tbody></table></div></details></section>'+
 '<section><details><summary>掲載した'+count+'観測点の数値表</summary><div class="table-wrap"><table><thead><tr><th>保存時刻</th><th>きら星</th><th>総訪問</th><th>コメント</th></tr></thead><tbody>'+table+'</tbody></table></div></details></section>'+
 '<footer><p>出典：通常閲覧画面の保存カウンター（<a href="'+d.sourceUrl+'">閲覧元</a>）。確認日：2026年10月21日。現ページを開いて過去の値が再表示されるという意味ではありません。</p><p>ファンによる非公式の振り返りです。個別視聴者・コメント原文・非公開の保管先は含めていません。<a href="/data-lab/data/mily-'+c.slot+'-'+c.date+'-aggregate.json">匿名の集計JSON</a></p></footer></main>\n</body>\n</html>\n';
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 for(const c of REPORTS){const d=JSON.parse(readFileSync(resolve(root,'public/data-lab/data/mily-'+c.slot+'-'+c.date+'-aggregate.json'),'utf8'));const dir=resolve(root,'data-lab/reports/'+c.date+'-'+c.slot);mkdirSync(dir,{recursive:true});writeFileSync(resolve(dir,'index.html'),render(d,c));}
 console.log('Rendered both observation reports from their separate anonymous datasets.');
}
