(() => {
'use strict';
const snap=window.MILY_SNAPSHOT;
if(!snap || !Array.isArray(snap.roster)) return;
const $ = (id) => document.getElementById(id);
// Make public-name search tolerant of spaces and full-width characters.
const normalizedText = value => String(value).normalize('NFKC').replace(/\s+/g,'').toLocaleLowerCase('ja-JP');
const fmt = new Intl.NumberFormat('ja-JP');
const toH = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const score = p => p===null ? '未取得' : fmt.format(p);
const my = snap.mily;
const peers = [...snap.srPeers].sort((a,b)=>a.srRank-b.srRank);
const max = Math.max(...peers.map(r => r.srPoints||0));
$('sr-chart').innerHTML = peers.map(r=>{
  const mine=r.entry===734;
  const width=Math.max(2,100*(r.srPoints||0)/max);
  return `<div class="bar-row ${mine?'is-mily':''}" aria-label="${toH(r.name)}、SHOWROOM ${r.srRank}位、${fmt.format(r.srPoints)}ポイント">
  <span class="n">${r.srRank}</span><span class="who" title="${toH(r.name)}">${toH(r.name)}${mine?' 🍅':''}</span>
  <span class="track" aria-hidden="true"><span class="bar" style="--pct:${width.toFixed(2)}%"></span></span>
  <span class="val">${fmt.format(r.srPoints)}</span></div>`;
}).join('');
const forecastNear=[...snap.forecastNearRanks].sort((a,b)=>a.rank-b.rank);
$('forecast-chart').innerHTML=forecastNear.map(r=>{
  const mine=r.entry===734;
  return `<div class="bar-row ${mine?'is-mily':''}" aria-label="予測順位${r.rank}位、${toH(r.name)}、総合指標${r.score.toFixed(2)}">
  <span class="n">${r.rank}</span><span class="who" title="${toH(r.name)}">${toH(r.name)}${mine?' 🍅':''}</span>
  <span class="track" aria-hidden="true"><span class="bar" style="--pct:${r.score.toFixed(2)}%"></span></span>
  <span class="val">${r.score.toFixed(2)}</span></div>`;
}).join('');

const roster=[...snap.roster].sort((a,b)=>a.srRank-b.srRank||a.entry-b.entry);
let currentGrade='all',search='',allShown=false;
const gradeLabels={all:'全学年','2年':'2年','3年':'3年','4年':'4年','未記載':'未記載'};
function renderTable(){
 const matches=roster.filter(r=>(currentGrade==='all'||r.grade===currentGrade)&&(normalizedText(`${r.name} ${r.entry}`).includes(search)));
 const visible=(search||currentGrade!=='all'||allShown) ? matches : matches.slice(0,20);
 const tbody=$('roster-body');
 tbody.innerHTML=visible.map(r=>{
 const mine=r.entry===734;
 const gradeRank=r.gradeSrRank===null?'—':`${r.gradeSrRank}位`;
 return `<tr class="${mine?'mily-row':''}"><td class="num">${r.srRank}位${r.srRank===52?'タイ':''}</td>
 <td><a href="https://2026.misscircle.jp/entry/${r.entry}" target="_blank" rel="noopener noreferrer">${toH(r.name)}</a>${mine?' <em>🍅</em>':''}<div class="dim">Entry ${r.entry}</div></td>
 <td>${toH(r.grade)}</td><td class="num">${gradeRank}</td>
 <td class="num">${r.srPoints===null?'<span class="dim">数値未取得</span>':fmt.format(r.srPoints)}</td></tr>`;
 }).join('');
 if(!matches.length) tbody.innerHTML='<tr><td class="empty" colspan="5">該当する出場者はいません。</td></tr>';
 $('roster-count').textContent=`${visible.length}人を表示（対象 ${matches.length}人／公式名簿 70人）`;
 const btn=$('show-all');
 btn.hidden=!!search||currentGrade!=='all'||allShown||matches.length<=20;
 btn.textContent=`残り${matches.length-20}人を見る`;
}
$('roster-search').addEventListener('input',e=>{search=normalizedText(e.target.value);renderTable();});
for(const btn of document.querySelectorAll('[data-grade]')){
 btn.addEventListener('click',()=>{
   currentGrade=btn.getAttribute('data-grade');
   for(const el of document.querySelectorAll('[data-grade]')){
      const active=el===btn;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));
   }
   renderTable();
 });
}
$('show-all').addEventListener('click',()=>{allShown=true;renderTable();});
renderTable();
// Forward-compatible entry: the layout PR moves the HTML template into Vite.
// Only inject this public, static archive link if the template has not included it.
const finalNightAnchor = $('now');
if (finalNightAnchor && !$('final-night')) {
  const finalNight = document.createElement('section');
  finalNight.id = 'final-night';
  finalNight.className = 'section';
  finalNight.innerHTML = `<div class="shell"><div class="section-head">
    <div><div class="eyeline">FINAL NIGHT · 2026.10.12</div>
    <h2>22:00まで、そしてその後。</h2>
    <p>21:59:23のきら星6,140個と、23:19:30の最終オンライン表示7,271個を区別。
    四次審査最終夜を、イベント対象時間と終了後に分けて分析しました。</p>
    </div></div><div class="card">
    <h3>最終夜の匿名データと推移グラフ</h3>
    <p>22:00前後の観測誤差や、イベント途中順位と確定値の違いも明記しています。</p>
    <p><a class="btn btn-primary" href="/data-lab/reports/20261012-final-night/">
    10/12夜の分析を読む ↗</a></p></div></div>`;
  finalNightAnchor.parentNode.insertBefore(finalNight, finalNightAnchor);
}
// This is a frozen public snapshot. Intentionally no remote API calls or analytics.
})();