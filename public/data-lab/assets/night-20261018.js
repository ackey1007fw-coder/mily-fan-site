"use strict";
(async()=>{
 const svg=document.getElementById("n18-svg"),caption=document.getElementById("n18-caption"),table=document.getElementById("n18-points"),pace=document.getElementById("n18-pace");
 const ns="http://www.w3.org/2000/svg";
 const el=(t,v)=>{let e=document.createElement(t);e.textContent=String(v);return e};
 const drawSvg=(t,attrs={})=>{const e=document.createElementNS(ns,t);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));return e};
 const time=s=>s.slice(5,10).replace("-","/")+" "+s.slice(11,19);
 const row=(p)=>{const tr=el("tr","");for(const v of p)tr.append(el("td",v));return tr};
 try{
  const response=await fetch("/data-lab/data/mily-night-20261018-aggregate.json",{cache:"no-store"});
  if(!response.ok)throw Error("No data");
  const data=await response.json();if(data.liveId!==23571625||data.nonOfficial!==true||data.counters.observations.length!==25)throw Error("Wrong session");
  const pts=data.counters.observations;table.replaceChildren(...pts.map(p=>row([time(p.atJst),p.stars,p.visits,p.comments])));
  pace.replaceChildren(...data.commentVelocity.intervals.map(v=>row([time(v.fromJst)+"〜"+time(v.toJst),v.commentsIncrease,v.minutes.toFixed(2),v.observedAveragePerMinute.toFixed(2)])));
  const labels={stars:"きら星",visits:"総訪問表示",comments:"コメント"};
  const render=k=>{
   const max=Math.max(1,...pts.map(p=>p[k])),t0=Date.parse(pts[0].atJst),t1=Date.parse(pts.at(-1).atJst);
   svg.replaceChildren(drawSvg("line",{x1:64,y1:25,x2:64,y2:296,stroke:"#9bb4c5"}),drawSvg("line",{x1:64,y1:296,x2:815,y2:296,stroke:"#9bb4c5"}));
   pts.forEach(p=>{const circle=drawSvg("circle",{cx:(64+745*(Date.parse(p.atJst)-t0)/(t1-t0)).toFixed(2),cy:(296-250*p[k]/max).toFixed(2),r:5,fill:"#f7cf80",stroke:"#152738","stroke-width":1.3});let title=drawSvg("title");title.textContent=time(p.atJst)+" "+labels[k]+" "+p[k];circle.append(title);svg.append(circle)});
   const x1=drawSvg("text",{x:66,y:326,fill:"#d1dce7","font-size":14});x1.textContent=time(pts[0].atJst);svg.append(x1);
   const x2=drawSvg("text",{x:813,y:326,fill:"#d1dce7","font-size":14,"text-anchor":"end"});x2.textContent=time(pts.at(-1).atJst);svg.append(x2);
   caption.textContent=labels[k]+"・25点の実在する画面観測。点と点の間を直線で補完しません。";
   for(const b of document.querySelectorAll("[data-n18-metric]"))b.setAttribute("aria-pressed",String(b.dataset.n18Metric===k));
  };
  render("stars");for(const b of document.querySelectorAll("[data-n18-metric]"))b.addEventListener("click",()=>render(b.dataset.n18Metric));
 }catch(_err){svg.replaceChildren();let warn=drawSvg("text",{x:25,y:64,fill:"#f4d5cc"});warn.textContent="データが取得できません。0として扱いません。";svg.append(warn);caption.textContent="読込失敗。過去配信の数字で補完しません。";table.replaceChildren(row(["取得不可","―","―","―"]));pace.replaceChildren(row(["取得不可","―","―","―"]))}
})();
