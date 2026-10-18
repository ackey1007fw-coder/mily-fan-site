(() => {
"use strict";
const URL = "/data-lab/data/mily-morning-20261018-aggregate.json";
const NS = "http://www.w3.org/2000/svg";
const METRICS = {
  stars: {label:"きら星",unit:"個",color:"#9ceadd"},
  visits:{label:"総訪問表示",unit:"",color:"#ffcf9b"},
  comments:{label:"コメント",unit:"件",color:"#cfb1f6"}
};
const fmt = v => new Intl.NumberFormat("ja-JP").format(v);
const toMs = s => Date.parse(s);
const time = s => new Date(s).toLocaleTimeString("ja-JP", {timeZone:"Asia/Tokyo",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false});
const short = s => time(s).slice(0,5);
const node = (tag,text,cls) => {const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
const svg = (tag,attrs={},text) => {const e=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));if(text!==undefined)e.textContent=text;return e;};
function valid(d){
 if(d?.schema!=="mily-anonymous-live-observations-v1"||d.roomId!==573253||d.liveId!==23568147||d.session!=="morning"||d.nonOfficial!==true)return false;
 if(d.counters?.totalRows!==906||d.counters.validRows!==812||d.counters.excludedRows!==94||d.counters.observations?.length!==39||d.counters.gaps?.length!==5)return false;
 if(d.commentVelocity?.intervals?.length!==12 || d.lastValidOnline?.stars!==9887||d.lastValidOnline?.visits!==1603||d.lastValidOnline?.comments!==961)return false;
 if(d.quality?.dataCoverageComplete!==false||d.quality?.websocket?.completeSourceCoverageVerified!==false)return false;
 if(d.quality?.visibleDom?.totalKnownDroppedFragments!==113143)return false;
 const edges=d.counters.gapBoundaryObservations;
 if(!Array.isArray(edges)||edges.length!==10||d.quality.partialBoundaryTotal!==10||d.quality.partialBoundaryKnown!==9)return false;
 for(let i=0;i<edges.length;i++){
  const p=edges[i];
  if(p.gapIndex!==Math.floor(i/2)||p.side!==(i%2===0?"before":"after")||!Number.isFinite(toMs(p.atJst)))return false;
  if(!["stars","visits","comments"].every(k=>p[k]===null||(Number.isSafeInteger(p[k])&&p[k]>=0)))return false;
  if(p.safeForVelocity!==false)return false;
 }
 if(edges[0].stars!==null||edges[0].visits!==null||edges[0].comments!==null)return false;
 const a=d.counters.observations;
 for(let i=0;i<a.length;i++){
   if(!Number.isFinite(toMs(a[i].atJst)))return false;
   if(["stars","visits","comments"].some(k=>!Number.isSafeInteger(a[i][k])||a[i][k]<0))return false;
   if(i && (toMs(a[i].atJst)<=toMs(a[i-1].atJst)||["stars","visits","comments"].some(k=>a[i][k]<a[i-1][k])))return false;
 }
 if(toMs(a[a.length-1].atJst)!==toMs(d.lastValidOnline.atJst))return false;
 for(const p of d.commentVelocity.intervals){
   if(!(p.minutes>=3.16&&p.minutes<=5.2)||p.commentsIncrease<0||Math.abs(p.commentsIncrease/p.minutes-p.observedAveragePerMinute)>.06)return false;
 }
 return true;
}
function chart(d,key){
 const target=document.getElementById("m18-chart"),caption=document.getElementById("m18-caption");
 if(!target||!METRICS[key])return;
 const obs=d.counters.observations,metric=METRICS[key];
 const first=toMs(obs[0].atJst),last=toMs(obs[obs.length-1].atJst);
 const max=Math.max(1,...obs.map(p=>p[key])),yMax=Math.ceil(max*1.08/(max>4000?500:max>1000?200:100))*(max>4000?500:max>1000?200:100);
 const x=t=>68+((t-first)/Math.max(1,last-first))*740, y=v=>286-238*v/yMax;
 target.replaceChildren();
 // Missing time bands are visually explicit. No paths or line connecting observations.
 d.counters.gaps.forEach(g=>{
   const start=Math.max(first,toMs(g.fromJst)),end=Math.min(last,toMs(g.toJst));
   if(end<=start)return;
   const rect=svg("rect",{x:x(start),y:42,width:Math.max(1,x(end)-x(start)),height:244,fill:"#be8969","fill-opacity":"0.20"});
   rect.append(svg("title",{},short(g.fromJst)+"〜"+short(g.toJst)+" 観測なし"));
   target.append(rect);
 });
 for(let i=0;i<=4;i++){
   const v=yMax*i/4;
   target.append(svg("line",{x1:68,y1:y(v),x2:808,y2:y(v),stroke:"#416173","stroke-dasharray":i?"3 6":"none"}));
   target.append(svg("text",{x:60,y:y(v)+4,fill:"#b6d4dd","text-anchor":"end","font-size":12},fmt(v)));
 }
 target.append(svg("text",{x:69,y:23,fill:metric.color,"font-size":15,"font-weight":800},metric.label+"／画面表示"));
 // Distinguish verified, partial, and untrusted gap-edge values.
 d.counters.gapBoundaryObservations.forEach(p=>{
   if(!Number.isSafeInteger(p[key]))return;
   const ring=svg("circle",{cx:x(toMs(p.atJst)),cy:y(p[key]),r:6,fill:"#102e3c",stroke:"#ffe0a8","stroke-width":2.2,"stroke-dasharray":"2 3"});
   ring.append(svg("title",{},time(p.atJst)+"／"+metric.label+" "+fmt(p[key])+metric.unit+"。欠測境界の部分観測であり9指標完全ではありません。"));
   target.append(ring);
 });
 obs.forEach(p=>{
   const point=svg("circle",{cx:x(toMs(p.atJst)),cy:y(p[key]),r:5.3,fill:metric.color,stroke:"#0c2533","stroke-width":1.5});
   point.append(svg("title",{},time(p.atJst)+"｜"+metric.label+" "+fmt(p[key])+metric.unit+"（参考表示）"));
   target.append(point);
 });
 for(let i=0;i<=4;i++){
   const t=first+(last-first)*i/4;
   target.append(svg("text",{x:x(t),y:321,fill:"#bdd4db","text-anchor":i===0?"start":i===4?"end":"middle","font-size":13},short(new Date(t).toISOString())));
 }
 target.setAttribute("aria-label",metric.label+"の実測39点。観測ギャップ5区間を色付きで表示。点を線で結ばず、値を補完していません。");
 caption.textContent=metric.label+"｜完全観測39点と境界の部分観測。オレンジの帯は30秒超の欠測、輪郭の点は部分観測。逆行未検証のゼロは採用せず、間の変化は推定しません。";
}
function table(d){
 const body=document.getElementById("m18-observations");body.replaceChildren();
 for(const p of d.counters.observations){
   const tr=node("tr"),h=node("th",time(p.atJst));h.scope="row";
   tr.append(h,node("td",fmt(p.stars)),node("td",fmt(p.visits)),node("td",fmt(p.comments)));
   body.append(tr);
 }
}
function pace(d){
 const bars=document.getElementById("m18-pace-bars"),tab=document.getElementById("m18-pace-table");
 bars.replaceChildren();tab.replaceChildren();
 const arr=d.commentVelocity.intervals,mx=Math.max(1,...arr.map(p=>p.observedAveragePerMinute));
 for(const p of arr){
   const title=short(p.fromJst)+"〜"+short(p.toJst);
   const b=node("div",undefined,"bar"),track=node("span",undefined,"track"),fill=node("span",undefined,"fill");
   fill.style.width=Math.max(2,100*p.observedAveragePerMinute/mx)+"%";
   track.append(fill);b.append(node("span",title),track,node("b",p.observedAveragePerMinute.toFixed(2)));bars.append(b);
   const tr=node("tr"),th=node("th",title);th.scope="row";
   tr.append(th,node("td","+"+fmt(p.commentsIncrease)),node("td",p.minutes.toFixed(2)),node("td",p.observedAveragePerMinute.toFixed(2)+" 件"));tab.append(tr);
 }
}

function nineMetrics(d){
 const e=document.getElementById("m18-nine-metrics");if(!e)return;e.replaceChildren();
 const night=d.comparison.nightLastValidOnline,morning=d.lastValidOnline;
 const fields=[
 ["きら星","stars"],["総訪問表示","visits"],["投稿表示","comments"],
 ["初訪問表示","firstVisits"],["2度訪問表示","repeatVisits"],["新規follow表示","newFollows"],
 ["その他free表示","otherFree"],["星100貢献人数","star100People"],["おすすめcomment人数","recommendedCommentPeople"]
 ];
 fields.forEach(([label,key])=>{
  const tr=node("tr"),th=node("th",label);th.scope="row";
  const show=value=>Number.isSafeInteger(value)?fmt(value):"未確認";
  tr.append(th,node("td",show(night[key])),node("td",show(morning[key])));e.append(tr);
 });
}
function gapBoundary(d){
 const e=document.getElementById("m18-boundary-table");if(!e)return;e.replaceChildren();
 const fmtValue=v=>Number.isSafeInteger(v)?fmt(v):"未確認";
 d.counters.gapBoundaryObservations.forEach(p=>{
  const tr=node("tr"),h=node("th",(p.gapIndex+1)+" / "+(p.side==="before"?"欠測前":"再観測後"));h.scope="row";
  tr.append(h,node("td",time(p.atJst)),node("td",fmtValue(p.stars)),node("td",fmtValue(p.visits)),node("td",fmtValue(p.comments)));e.append(tr);
 });
}
function gaps(d){
 const e=document.getElementById("m18-gap-cards");e.replaceChildren();
 for(const g of d.counters.gaps){
   const box=node("div",undefined,"gap-card"),duration=g.seconds>=60?(g.seconds/60).toFixed(1)+"分":g.seconds.toFixed(1)+"秒";
   box.append(node("strong",short(g.fromJst)+"〜"+short(g.toJst)),node("div","観測の空白 約"+duration),node("small","点の間の推移は不明。0・直線補完をしていません。"));
   e.append(box);
 }
}
function failure(){
 const t=document.getElementById("m18-chart");
 if(t)t.replaceChildren(svg("text",{x:20,y:70,fill:"#fdd3b8","font-size":16},"匿名データを検証できませんでした。数値は推定しません。"));
 for(const id of ["m18-observations","m18-pace-table","m18-pace-bars","m18-gap-cards","m18-boundary-table","m18-nine-metrics"]){
   const e=document.getElementById(id);if(e)e.replaceChildren(node("p","読み込みに失敗しました。未確認データを補完しません。"));
 }
}
async function main(){
 try{
  const response=await fetch(URL,{credentials:"same-origin",cache:"no-cache"});
  if(!response.ok)throw Error("HTTP "+response.status);
  const data=await response.json();
  if(!valid(data))throw Error("Dataset invalid");
  table(data);pace(data);gaps(data);nineMetrics(data);gapBoundary(data);
  const buttons=document.querySelectorAll("[data-m18-metric]");
  buttons.forEach(b=>b.addEventListener("click",()=>{buttons.forEach(other=>other.setAttribute("aria-pressed",String(other===b)));chart(data,b.dataset.m18Metric);}));
  chart(data,"stars");
 }catch(_){failure();}
}
main();
})();
