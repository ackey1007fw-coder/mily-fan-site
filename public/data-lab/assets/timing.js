import { METRICS, PHASES, explore } from './timing-core.mjs';
const $=id=>document.getElementById(id);
const number=(n,digits=1)=>n===null ? '不足' : n.toLocaleString('ja-JP',{minimumFractionDigits:0,maximumFractionDigits:digits});
const hourLabel=h=>`${String(h).padStart(2,'0')}:00〜${String(h+1).padStart(2,'0')}:00`;
const weekdays=['日','月','火','水','木','金','土'];
let dataset=null, metric='comments', result=null;
function el(tag,text,className) { const node=document.createElement(tag); if(text!==undefined)node.textContent=text;if(className)node.className=className;return node; }
function reset(id) {const node=$(id);node.replaceChildren();return node;}
function badge(item) {return el('span',`${item.n}配信 / ${item.days}日 · ${item.evidence}`,'badge'+(item.n<5?' sparse':''));}
function tenMinutes(value) {return number(value===null?null:value*10);}
function deltaText(value) {return value===null?'算出不可':`${value>=0?'+':''}${number(value)}%`;}
function candidateCard(item) {
 const card=el('article',undefined,'candidate');card.append(el('h3',hourLabel(item.hour)),badge(item));
 const pace=el('div',tenMinutes(item.value),'pace');pace.append(el('small',' / 10分換算'));card.append(pace);
 card.append(el('p',`${METRICS[metric].counter}の観測ペース`),el('p',`実績の幅 ${tenMinutes(item.min)}〜${tenMinutes(item.max)} / 10分`),el('p',`比較に使った観測 ${number(item.minutes)}分 · 基準との差 ${deltaText(item.growthPercent)}`));
 return card;
}
function renderOverview(phase,day) {
 const root=reset('timing-overview'), quick=[];
 for(const key of ['stars','visits','comments']) {
   const r=explore(dataset,{metric:key,phase,day}),top=r.candidates[0];
   quick.push(top ? `${METRICS[key].label}: ${top.hour}時台（${top.n}回・参考）` : `${METRICS[key].label}: 比較待ち`);
   const card=el('article',undefined,'overview-card');card.append(el('p',METRICS[key].label,'purpose'));
   if(top){card.append(el('h3',`${top.hour}時台`),el('div',`${tenMinutes(top.value)} / 10分`,'value'),badge(top),el('p',`観測ペースが高めの候補。${top.n<5?'まだ少数の実績です。':'5回以上でも未検証の傾向です。'} 開始時刻を保証するものではありません。`,'sub'));}
   else{card.append(el('h3','比較待ち'),el('p','同じ時間帯・異なる日で2回以上の実績が不足しています。','sub'));}
   const btn=el('button',`${METRICS[key].label}を詳しく見る →`);btn.type='button';btn.dataset.goal=key;
   btn.addEventListener('click',()=>{metric=key;render();$('detail-title').scrollIntoView({block:'start'});});card.append(btn);root.append(card);
 }
 $('timing-quicktake').textContent='この条件で試す候補: '+quick.join(' / ');$('timing-quicktake').hidden=false;
}
function renderCandidates() {
 const root=reset('timing-candidates');
 if(result.candidates.length) for(const c of result.candidates) root.append(candidateCard(c));
 else root.append(el('p','まだ時間帯を順位づけできません。1回だけの実績や未観測の時間を、確かなおすすめにはしません。','empty'));
 const extra=reset('timing-exploratory');
 if(result.exploratory.length) for(const c of result.exploratory)extra.append(candidateCard(c));
 else extra.append(el('p','この条件で表示できる1回だけの正の実績はありません。観測した0は下の表で確認できます。','empty'));
 const summary=reset('timing-summary');
 summary.append(el('strong',`${METRICS[metric].counter} / 10分換算の観測ペース`));
 summary.append(el('p',`${PHASES[result.phase]}。比較の基準に使える${result.baselineN}配信から計算。候補は各時間帯で10分以上観測できた配信に限ります。`));
}
function showCell(cell) {
 const root=reset('timing-cell-detail');root.append(el('strong',`${weekdays[cell.weekday]}曜日 ${hourLabel(cell.hour)}`));
 if(cell.value===null){root.append(el('p','比較に十分な観測がありません。訪問や応援が0だった、という意味ではありません。'));return;}
 root.append(el('p',`${METRICS[metric].counter} ${tenMinutes(cell.value)} / 10分換算。${cell.n}配信・${cell.days}日、観測合計${number(cell.minutes)}分。${cell.evidence}。`));
 root.append(el('p',`配信ごとの実績の幅 ${tenMinutes(cell.min)}〜${tenMinutes(cell.max)}。これは信頼区間ではありません。`));
 const dates=cell.streamIds.map(id=>dataset.sessions.find(s=>s.id===id)?.date).filter(Boolean);root.append(el('p',`対象日: ${[...new Set(dates)].join('、')}`));
}
function renderHeatmap() {
 const root=reset('timing-heatmap'),all=$('timing-all-hours').checked;
 const values=result.cells.filter(c=>c.value!==null).map(c=>c.value),max=values.length?Math.max(...values):0;
 const shown=result.hours.filter(h=>all || h.value!==null).map(h=>h.hour);
 if(!shown.length)shown.push(6,12,22);
 for(const hour of shown){const row=el('tr'),header=el('th',`${hour}時台`);header.scope='row';row.append(header);
   for(const day of [1,2,3,4,5,6,0]){
     const cell=result.cells.find(c=>c.weekday===day&&c.hour===hour),td=el('td');
     const level=cell.value===null?0:Math.max(1,Math.min(4,Math.ceil((max>0?cell.value/max:0)*4)));
     const btn=el('button',cell.value===null?'不足':tenMinutes(cell.value),`heat-${level}`);btn.type='button';
     btn.dataset.single=String(cell.n===1);btn.dataset.hour=String(hour);btn.dataset.weekday=String(day);
     btn.append(el('small',cell.value===null?'未観測・不足':`${cell.n}回`));
     btn.setAttribute('aria-label',`${weekdays[day]}曜日${hour}時台、${cell.value===null?'比較データ不足':METRICS[metric].counter+'10分換算'+tenMinutes(cell.value)+'、'+cell.n+'配信、'+cell.evidence}`);
     btn.addEventListener('click',()=>showCell(cell));td.append(btn);row.append(td);
   } root.append(row);
 }
 $('timing-caption').textContent=`${METRICS[metric].counter} / 10分換算の観測ペースと比較配信数（日本時間）`;
 $('timing-heatmap-note').textContent=`${PHASES[result.phase]}。セルを押すと対象日と実績の幅が分かります。破線は1回のみの実績です。`;
 reset('timing-cell-detail').append(el('p','セルを選んで根拠を確認できます。数値は過去の観測ペースです。'));
}
function renderTable() {
 const root=reset('timing-table');
 for(const h of result.hours.filter(h=>h.value!==null)){
   const row=el('tr');row.append(el('td',hourLabel(h.hour)),el('td',tenMinutes(h.value)));
   const n=el('td',`${h.n}回 / ${h.days}日`);n.append(el('small',h.evidence));
   row.append(n,el('td',`${number(h.minutes)}分`),el('td',deltaText(h.growthPercent)),el('td',`${tenMinutes(h.min)}〜${tenMinutes(h.max)}`));root.append(row);
 }
 if(!root.children.length){const row=el('tr'),cell=el('td','この条件では比較できる時間帯がありません。');cell.colSpan=6;row.append(cell);root.append(row);}
 $('timing-baseline').textContent=`相対差の基準: ${METRICS[metric].counter} ${tenMinutes(result.baseline)} / 10分換算（同じ期間・曜日条件の全時間帯を配信ごとに集計した中央値、${result.baselineN}配信）。時間帯をまたぐ${result.boundaryExcluded}区間は割り振らず除外。`;
}
function render() {
 if(!dataset)return;
 const phase=$('timing-phase').value,day=$('timing-day').value;
 result=explore(dataset,{metric,phase,day});
 for(const btn of document.querySelectorAll('[data-metric]'))btn.setAttribute('aria-pressed',String(btn.dataset.metric===metric));
 $('timing-metric-note').textContent=METRICS[metric].note;
 renderOverview(phase,day);renderCandidates();renderHeatmap();renderTable();
}
function renderProvenance() {
 const total=dataset.sessions.length,usable=dataset.sessions.filter(s=>s.windows.length).length;
 const date=dataset.dataThroughJst?.slice(0,16).replace('T',' ') ?? '未確認';
 $('timing-asof').textContent=`採用データの最終観測: ${date} JST · 対象${total}配信 / 区間あり${usable}配信 · 非公式の保存実績`;
 $('timing-unavailable').textContent=dataset.paidGifts.reason+' '+dataset.congestion.reason;
 const reasons={'clock_disagreement':'保存時計と画面経過秒の大きな不一致','invalid_or_reversed_time':'時刻未収録・無効・逆順','too_short_or_long_interval':'30秒未満または390秒超','known_gap':'既知の欠測と重なる区間','counter_regression':'カウンター逆行','regression_recovery':'逆行後の最初の復帰区間','duplicate_or_overlap_metric':'同じ指標・時間の重複','no_valid_metric':'使える指標なし','unsafe_boundary':'安全性未確認の境界','event_boundary':'審査区分の境界','unresolved_session':'配信識別が未確認','unresolved_discontinuities':'不連続の範囲が未確定'};
 $('timing-quality').textContent='元の公開資料から再集計しています。除外の内訳: '+Object.entries(dataset.exclusions).map(([k,n])=>`${reasons[k] ?? k} ${n}`).join(' / ')+'。理由別の件数は観測区間または指標の除外件数で、配信数や失われたコメント数ではありません。';
 const omitted=reset('timing-omitted');for(const s of dataset.sessions.filter(s=>!s.windows.length))omitted.append(el('p',`${s.date} ${s.slot==='night'?'夜':s.slot==='morning'?'朝':'昼'}: 時間帯の比較区間なし。数値を0で補っていません。`));
 const list=reset('timing-sources');for(const source of dataset.sources){if(!/^\/data-lab\/data\/[a-z0-9-]+\.json$/.test(source.path))throw new Error('Unexpected source path');const li=el('li'),link=el('a',source.path.split('/').pop());link.href=source.path;li.append(link,el('code',`SHA-256 ${source.sha256}`));list.append(li);}
}
async function load() {
 $('timing-error').hidden=true;$('timing-content').hidden=true;$('timing-quicktake').hidden=true;
 try{
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
   let response;try{response=await fetch('/data-lab/data/mily-stream-timing.json',{signal:controller.signal});}finally{clearTimeout(timer);}
   if(!response.ok)throw new Error('HTTP '+response.status);const loaded=await response.json();
   explore(loaded);dataset=loaded;renderProvenance();render();$('timing-content').hidden=false;
 }catch{dataset=null;$('timing-quicktake').hidden=true;$('timing-error').hidden=false;$('timing-asof').textContent='データ取得未確認。ゼロとして表示しません。';}
}
for(const btn of document.querySelectorAll('[data-metric]'))btn.addEventListener('click',()=>{metric=btn.dataset.metric;render();});
for(const id of ['timing-phase','timing-day','timing-all-hours'])$(id).addEventListener('change',render);
$('timing-retry').addEventListener('click',load);
load();
