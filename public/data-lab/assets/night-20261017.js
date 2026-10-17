(() => {
"use strict";
const URL = "/data-lab/data/mily-night-20261017-aggregate.json";
const NS = "http://www.w3.org/2000/svg";
const METRICS = {
 stars:{label:"きら星",unit:"個",color:"#a4eddd"},
 visits:{label:"総訪問表示",unit:"",color:"#f9c49b"},
 comments:{label:"コメント",unit:"件",color:"#d8b8fc"}
};
const fmt = v => new Intl.NumberFormat("ja-JP").format(v);
const millis = iso => Date.parse(iso);
const show = iso => new Date(iso).toLocaleTimeString("ja-JP",{timeZone:"Asia/Tokyo",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false});
const short = iso => show(iso).slice(0,5);
function node(tag,text,cls) {
 const el = document.createElement(tag);
 if(cls)el.className=cls;
 if(text!==undefined)el.textContent=text;
 return el;
}
function svgNode(tag,attrs={},text) {
 const el=document.createElementNS(NS,tag);
 Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));
 if(text!==undefined)el.textContent=text;
 return el;
}
function valid(data) {
 if(data?.schema!=="mily-anonymous-live-observations-v1"||data.roomId!==573253||data.liveId!==23567037||data.session!=="night")return false;
 if(data.counters?.totalRows!==629||data.counters?.validRows!==595||data.counters?.observations?.length!==50)return false;
 if(data.commentVelocity?.intervals?.length!==9 || data.lastValidOnline?.stars!==2970||data.lastValidOnline?.visits!==90||data.lastValidOnline?.comments!==453)return false;
 const a=data.counters.observations;
 if(millis(a[a.length-1].atJst)!==millis(data.lastValidOnline.atJst))return false;
 for(let i=0;i<a.length;i++){
  if(!Number.isFinite(millis(a[i].atJst)))return false;
  for(const k of Object.keys(METRICS))if(!Number.isSafeInteger(a[i][k])||a[i][k]<0)return false;
  if(i>0 && (millis(a[i].atJst)<=millis(a[i-1].atJst)||Object.keys(METRICS).some(k=>a[i][k]<a[i-1][k])))return false;
 }
 for(const v of data.commentVelocity.intervals){
  if(!Number.isFinite(v.observedAveragePerMinute)||v.observedAveragePerMinute<0||v.minutes<=0||v.commentsIncrease<0)return false;
  if(Math.abs(v.observedAveragePerMinute-v.commentsIncrease/v.minutes)>.04)return false;
 }
 return true;
}
function plot(data,metric){
 const svg=document.getElementById("n17-chart-svg");
 const desc=document.getElementById("n17-chart-caption");
 const m=METRICS[metric],obs=data.counters.observations;
 if(!svg||!m)return;
 svg.replaceChildren();
 const low=millis(obs[0].atJst),high=millis(obs[obs.length-1].atJst);
 const max=Math.max(1,...obs.map(p=>p[metric]));
 const step=max>5000?2000:max>2000?500:max>500?200:max>150?50:max>40?20:10;
 const top=Math.ceil(max*1.07/step)*step;
 const x=ms=>62+(ms-low)/Math.max(1,high-low)*740;
 const y=n=>282-n/top*233;
 for(let i=0;i<=4;i++){
  const val=top*i/4;
  svg.append(svgNode("line",{x1:62,y1:y(val),x2:802,y2:y(val),stroke:"#466170","stroke-dasharray":i===0?"none":"4 7"}));
  svg.append(svgNode("text",{x:54,y:y(val)+5,fill:"#bbd6dc","text-anchor":"end","font-size":13},fmt(val)));
 }
 svg.append(svgNode("text",{x:62,y:24,fill:m.color,"font-size":15,"font-weight":750},m.label+"（画面累積表示）"));
 obs.forEach(p=>{
  const c=svgNode("circle",{cx:x(millis(p.atJst)),cy:y(p[metric]),r:5.4,fill:m.color,stroke:"#0b2637","stroke-width":1.6});
  c.append(svgNode("title",{},show(p.atJst)+" / "+m.label+" "+fmt(p[metric])+m.unit+"（非公式参考値）"));
  svg.append(c);
 });
 for(const [ix,label,anchor] of [[0,short(obs[0].atJst),"start"],[12,short(obs[12].atJst),"middle"],[24,short(obs[24].atJst),"middle"],[36,short(obs[36].atJst),"middle"],[49,short(obs[49].atJst),"end"]]){
  svg.append(svgNode("text",{x:x(millis(obs[ix].atJst)),y:313,fill:"#c4d6df","text-anchor":anchor,"font-size":13},label));
 }
 svg.setAttribute("aria-label",m.label+"の実測点50個。"+short(obs[0].atJst)+"から"+short(obs[49].atJst)+"まで。最後の有効表示 "+fmt(obs[49][metric])+m.unit+"。公式確定値ではありません。");
 if(desc)desc.textContent=m.label+"：有効な595観測の中から約1分ごとの50点を表示。点の間はつながず、観測外を補完していません。";
}
function renderObservations(data) {
 const tbody=document.getElementById("n17-table-body");
 if(!tbody)return;
 tbody.replaceChildren();
 data.counters.observations.forEach(p=>{
  const tr=node("tr"),head=node("th",show(p.atJst));
  head.scope="row";
  tr.append(head,node("td",fmt(p.stars)),node("td",fmt(p.visits)),node("td",fmt(p.comments)));
  tbody.append(tr);
 });
}
function renderVelocity(data) {
 const bars=document.getElementById("n17-velocity-bars");
 const tbody=document.getElementById("n17-velocity-table");
 const list=data.commentVelocity.intervals;
 const max=Math.max(1,...list.map(p=>p.observedAveragePerMinute));
 if(bars)bars.replaceChildren();
 if(tbody)tbody.replaceChildren();
 list.forEach(p=>{
  const period=short(p.fromJst)+"–"+short(p.toJst);
  const rate=p.observedAveragePerMinute.toFixed(2);
  if(bars){
   const row=node("div",undefined,"n17-bar-row");
   const track=node("span",undefined,"n17-bar-track");
   const fill=node("span",undefined,"n17-bar-fill");
   fill.style.width=Math.max(2,100*p.observedAveragePerMinute/max)+"%";
   track.append(fill);
   row.append(node("span",period),track,node("b",rate+" /分"));
   bars.append(row);
  }
  if(tbody){
   const tr=node("tr"),th=node("th",period);th.scope="row";
   tr.append(th,node("td","+"+fmt(p.commentsIncrease)),node("td",p.minutes.toFixed(2)),node("td",rate+" 件"));
   tbody.append(tr);
  }
 });
}
function failure(){
 const chart=document.getElementById("n17-chart-svg"),table=document.getElementById("n17-table-body");
 const pace=document.getElementById("n17-velocity-table"),bars=document.getElementById("n17-velocity-bars");
 const caption=document.getElementById("n17-chart-caption");
 if(chart)chart.replaceChildren(svgNode("text",{x:25,y:62,fill:"#ffddbb","font-size":16},"匿名データを読み込めませんでした。概要は上部をご覧ください。"));
 for(const body of [table,pace])if(body){const tr=node("tr"),td=node("td","データの確認ができませんでした。推測値は表示しません。");td.colSpan=4;tr.append(td);body.replaceChildren(tr);}
 if(bars)bars.replaceChildren(node("p","データを読み込めませんでした。"));
 if(caption)caption.textContent="検証に失敗したため、補完・推定した図表は表示しません。";
}
async function main(){
 try{
  const response=await fetch(URL,{credentials:"same-origin",cache:"no-cache"});
  if(!response.ok)throw Error("HTTP "+response.status);
  const data=await response.json();
  if(!valid(data))throw Error("Invalid aggregate");
  renderObservations(data);
  renderVelocity(data);
  const buttons=document.querySelectorAll("[data-n17-metric]");
  buttons.forEach(button=>button.addEventListener("click",()=>{
   buttons.forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
   plot(data,button.getAttribute("data-n17-metric"));
  }));
  plot(data,"stars");
 }catch(_){failure();}
}
main();
})();
