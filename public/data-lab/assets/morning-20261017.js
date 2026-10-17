(() => {
"use strict";
const DATA_URL = "/data-lab/data/mily-morning-20261017-aggregate.json";
const NS = "http://www.w3.org/2000/svg";
const METRICS = {
  stars: {label:"きら星",unit:"個",color:"#9fead8"},
  total_visits: {label:"総訪問表示",unit:"",color:"#ffceaa"},
  comments: {label:"コメント",unit:"件",color:"#d3c4ff"}
};
const fmt = value => new Intl.NumberFormat("ja-JP").format(value);
const time = iso => new Date(iso).toLocaleTimeString("ja-JP",{timeZone:"Asia/Tokyo",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false});
const elem = (name,attrs={},value="") => {
  const el = document.createElementNS(NS,name);
  for(const [key,v] of Object.entries(attrs))el.setAttribute(key,String(v));
  if(value)el.textContent = value;
  return el;
};
const make = (name,text,cls) => {
  const n=document.createElement(name);
  if(cls)n.className=cls;
  n.textContent=text;
  return n;
};
const parse = iso => new Date(iso).getTime();
const pointsFor = data => data.segments.flatMap((segment,i) => segment.five_minute_window_endpoints.map(point => ({...point,segment:i})));
function validate(data) {
  if(data?.live_id!==23564059 || data?.room_id!==573253 || data?.data_quality?.valid_online_observations!==515 || data?.segments?.length!==2)return false;
  if(data.observed_screen.confirmed_final !== false || data.gap.per_minute_series_available !== false)return false;
  const pts=pointsFor(data);
  if(pts.length!==22 || pts.some(p=>!Number.isSafeInteger(p.stars)||!Number.isSafeInteger(p.total_visits)||!Number.isSafeInteger(p.comments)))return false;
  if(data.segments[0].count+data.segments[1].count!==515)return false;
  if(parse(data.gap.end_jst)-parse(data.gap.start_jst) < 120*60*1000)return false;
  for(const segment of data.segments) {
    const ps=segment.five_minute_window_endpoints;
    for(let i=1;i<ps.length;i++){
      if(parse(ps[i].observed_at_jst)<=parse(ps[i-1].observed_at_jst))return false;
      for(const metric of Object.keys(METRICS))if(ps[i][metric]<ps[i-1][metric])return false;
    }
  }
  return true;
}
function renderChart(data,metric) {
  const svg=document.getElementById("a17-chart-svg");
  const caption=document.getElementById("a17-chart-caption");
  const key=METRICS[metric];
  if(!svg||!key)return;
  svg.replaceChildren();
  const {segments,gap}=data;
  const points=pointsFor(data);
  const min=parse(points[0].observed_at_jst),max=parse(points.at(-1).observed_at_jst);
  const maxY=Math.max(1,points.at(-1)[metric]);
  const nice=maxY>5000?2000:maxY>2000?500:maxY>500?250:100;
  const top=Math.ceil((maxY*1.07)/nice)*nice;
  const x=ms=>62+(ms-min)/(max-min)*752;
  const y=n=>284-n/top*238;
  const gapLeft=x(parse(gap.start_jst)),gapRight=x(parse(gap.end_jst));
  svg.append(elem("rect",{x:gapLeft,y:37,width:gapRight-gapLeft,height:252,fill:"#778593",opacity:".12"}));
  svg.append(elem("line",{x1:gapLeft,y1:37,x2:gapLeft,y2:290,stroke:"#f9c59a","stroke-dasharray":"4 5","stroke-width":"1.4"}));
  svg.append(elem("line",{x1:gapRight,y1:37,x2:gapRight,y2:290,stroke:"#f9c59a","stroke-dasharray":"4 5","stroke-width":"1.4"}));
  svg.append(elem("text",{x:(gapLeft+gapRight)/2,y:157,"text-anchor":"middle",fill:"#ffd7af","font-size":18,"font-weight":"700"},"約123分"));
  svg.append(elem("text",{x:(gapLeft+gapRight)/2,y:180,"text-anchor":"middle",fill:"#ced9e1","font-size":14},"カウンター欠測"));
  for(let i=0;i<=4;i++){
    const val=top*i/4;
    const yp=y(val);
    svg.append(elem("line",{x1:62,y1:yp,x2:814,y2:yp,stroke:"#446474","stroke-width":1,"stroke-dasharray":i===0?"none":"4 8"}));
    svg.append(elem("text",{x:55,y:yp+5,fill:"#bcd2d9","text-anchor":"end","font-size":13},fmt(val)));
  }
  svg.append(elem("text",{x:62,y:23,fill:key.color,"font-size":14,"font-weight":"750"},key.label+"（累積表示）"));
  for(const point of points){
    const circle=elem("circle",{cx:x(parse(point.observed_at_jst)),cy:y(point[metric]),r:5.2,fill:key.color,stroke:"#072233","stroke-width":1.6});
    circle.append(elem("title",{},time(point.observed_at_jst)+" "+key.label+" "+fmt(point[metric])+key.unit+"（"+(point.segment===0?"前半":"復旧後")+"の実測）"));
    svg.append(circle);
  }
  [
    [segments[0].start_jst,"06:05","start"],
    [segments[0].end_jst,"06:16","middle"],
    [segments[1].start_jst,"08:19","middle"],
    [segments[1].end_jst,"09:38","end"]
  ].forEach(([date,label,anchor])=>svg.append(elem("text",{x:x(parse(date)),y:317,"text-anchor":anchor==="start"?"start":anchor==="end"?"end":"middle",fill:"#bed5dc","font-size":14},label)));
  svg.setAttribute("aria-label",`${key.label}の実測グラフ。06:05〜06:16および08:19〜09:38の保存観測点のみ。06:16〜08:19の約123分は欠測。最後の画面参考表示は${fmt(points.at(-1)[metric])}${key.unit}。配信終了時の確定値ではありません。`);
  caption.textContent=`${key.label}：前半${segments[0].five_minute_window_endpoints.length}点、復旧後${segments[1].five_minute_window_endpoints.length}点。点の間に線は引かず、約123分の欠測から分速を計算しません。総訪問表示はユニーク視聴者人数とは限りません。`;
}
function renderTable(data){
  const tbody=document.getElementById("a17-table-body");
  if(!tbody)return;
  tbody.replaceChildren();
  data.segments.forEach((seg,i)=>{
    const group=document.createElement("tr");
    group.className="a17-segment-row";
    const cell=make("th",seg.label+" / 有効画面"+fmt(seg.count)+"件（抽出点"+seg.five_minute_window_endpoints.length+"件）");
    cell.setAttribute("scope","rowgroup");cell.setAttribute("colspan","4");
    group.append(cell);tbody.append(group);
    for(const p of seg.five_minute_window_endpoints){
      const tr=document.createElement("tr");
      const c1=make("th",time(p.observed_at_jst));c1.setAttribute("scope","row");
      tr.append(c1,make("td",fmt(p.stars)),make("td",fmt(p.total_visits)),make("td",fmt(p.comments)));
      tbody.append(tr);
    }
    if(i===0){
      const row=make("tr","","a17-gap-row");
      const td=make("td","06:16:18〜08:19:04（約123分）は分単位の欠測。0件ではありません。");
      td.colSpan=4;row.append(td);tbody.append(row);
    }
  });
}
async function init(){
  try{
    const response=await fetch(DATA_URL,{credentials:"same-origin",cache:"no-cache"});
    if(!response.ok)throw Error("HTTP "+response.status);
    const data=await response.json();
    if(!validate(data))throw Error("Invalid public aggregate");
    renderTable(data);
    for(const button of document.querySelectorAll("[data-a17-metric]")){
      button.addEventListener("click",()=>{
        const key=button.getAttribute("data-a17-metric");
        for(const other of document.querySelectorAll("[data-a17-metric]"))other.setAttribute("aria-pressed",String(other===button));
        renderChart(data,key);
      });
    }
    renderChart(data,"stars");
  }catch(e){
    const chart=document.getElementById("a17-chart-svg");
    const table=document.getElementById("a17-table-body");
    const desc=document.getElementById("a17-chart-caption");
    if(chart){chart.replaceChildren(elem("text",{x:25,y:70,fill:"#ffc1a9","font-size":17},"グラフを読み込めませんでした。上の確認済み概要をご覧ください。"));}
    if(table){table.replaceChildren();const row=document.createElement("tr");const cell=make("td","観測表の読み込みに失敗しました。");cell.colSpan=4;row.append(cell);table.append(row);}
    if(desc)desc.textContent="データを読み込めなかったため、補完・推定したグラフは表示しません。";
  }
}
init();
})();
