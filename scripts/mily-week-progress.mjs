import assert from "node:assert/strict";

export function summarizeWeek(data) {
  assert.equal(data.schema, "mily-official-seven-day-cohort-v1");
  assert.equal(data.genreId, 103);
  assert.equal(data.days.length, 7);
  const ids = data.roster.map(r => r.roomId);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(data.roster.map(r => r.entry)).size, ids.length);
  assert.equal(ids.length, data.rosterSource.count);
  const mine = data.roster.find(r => r.entry === 734);
  assert.equal(mine?.roomId, 573253);
  const median = values => {
    if (!values.length) return null;
    const sorted = [...values].sort((a,b) => a-b), i = Math.floor(sorted.length/2);
    return sorted.length % 2 ? sorted[i] : (sorted[i-1]+sorted[i])/2;
  };
  const days = data.days.map((day,i) => {
    assert.equal(day.date, new Date(Date.UTC(2026,9,15+i)).toISOString().slice(0,10));
    assert.equal(day.participants.length, ids.length);
    assert.deepEqual([...day.participants.map(r=>r.roomId)].sort((a,b)=>a-b), [...ids].sort((a,b)=>a-b));
    for (const row of day.participants) {
      assert.equal(data.roster.find(r=>r.roomId===row.roomId)?.entry, row.entry);
      assert.ok(row.points === null || (Number.isSafeInteger(row.points) && row.points >= 0));
    }
    assert.equal(day.paginationComplete, true);
    assert.ok(day.sources.length > 0);
    for (const [j,source] of day.sources.entries()) {
      const u = new URL(source.url);
      assert.equal(u.hostname, "www.showroom-live.com");
      assert.equal(u.pathname, `/api/genre_ranking/103/daily/${day.date.replaceAll("-","")}`);
      assert.equal(Number(u.searchParams.get("page")), j+1);
      assert.equal(source.nextPage, j === day.sources.length-1 ? 0 : j+2);
      assert.match(source.sha256, /^[a-f0-9]{64}$/);
      assert.match(source.retrievedAtJst, /\+09:00$/);
    }
    assert.equal(day.sources.reduce((s,x)=>s+x.rows,0), day.rankingRecords);
    const listed = day.participants.filter(r=>r.points!==null);
    const mily = listed.find(r=>r.entry===734);
    return {date:day.date, listedCount:listed.length, unlistedCount:ids.length-listed.length,
      milyPoints:mily?.points??null, listedMedian:median(listed.map(r=>r.points)),
      withinListedRank:mily ? 1+listed.filter(r=>r.points>mily.points).length : null};
  });
  const all = data.roster.map(row => {
    const points = data.days.map(day=>day.participants.find(r=>r.roomId===row.roomId).points);
    const observedDays = points.filter(x=>x!==null).length;
    return {...row, points, observedDays, total:observedDays===7 ? points.reduce((s,x)=>s+x,0) : null};
  });
  const complete = all.filter(r=>r.total!==null).sort((a,b)=>b.total-a.total || a.entry-b.entry);
  const excluded = all.filter(r=>r.total===null);
  const mily = all.find(r=>r.entry===734);
  const fixedDailyMedians = days.map((_,i)=>median(complete.map(r=>r.points[i])));
  const aboveFixedMedianDays = days.filter((d,i)=>d.milyPoints!==null && fixedDailyMedians[i]!==null && d.milyPoints>fixedDailyMedians[i]).length;
  const completeMedian = median(complete.map(r=>r.total));
  const completeRank = mily.total===null ? null : 1+complete.filter(r=>r.total>mily.total).length;
  return {days, complete, excluded, mily, fixedDailyMedians, aboveFixedMedianDays, completeMedian, completeRank,
    ratioToCompleteMedian: mily.total!==null && completeMedian>0 ? Number((mily.total/completeMedian).toFixed(2)) : null};
}

const esc = value => String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
const fmt = value => value===null ? "未取得" : new Intl.NumberFormat("ja-JP",{maximumFractionDigits:2}).format(value);
export function renderWeek(data) {
  const s = summarizeWeek(data);
  // This immutable dated report has editorial statements tied to this snapshot.
  // Refuse to silently reuse that wording after a source change.
  assert.equal(s.complete.length, 16); assert.equal(s.excluded.length, 19);
  assert.equal(s.mily.observedDays, 7); assert.equal(s.mily.total, 136547);
  assert.equal(s.aboveFixedMedianDays, 7); assert.equal(s.completeRank, 6);
  const max = Math.ceil(Math.max(...s.days.map(d=>d.milyPoints??0),...s.fixedDailyMedians.map(x=>x??0),1)/10000)*10000;
  const width = x => x===null ? null : (x/max*100).toFixed(8);
  const bars = s.days.map((d,i)=>`<div class="week-day" data-week-day="${d.date}"><h3>${d.date.slice(5).replace("-","/")}</h3><div><div class="week-line"><span>みりぃ</span><div class="week-track">${d.milyPoints===null?"":`<span class="week-fill" style="width:${width(d.milyPoints)}%"></span>`}</div><strong>${fmt(d.milyPoints)}${d.milyPoints===null?"":"pt"}</strong></div><div class="week-line"><span>16ルーム中央値</span><div class="week-track"><span class="week-fill week-median" style="width:${width(s.fixedDailyMedians[i])}%"></span></div><strong>${fmt(s.fixedDailyMedians[i])}pt</strong></div></div></div>`).join("\n");
  const rows = s.days.map((d,i)=>`<tr data-week-table-date="${d.date}"><th scope="row">${d.date.slice(5).replace("-","/")}</th><td>${fmt(d.milyPoints)}</td><td>${fmt(s.fixedDailyMedians[i])}</td><td>${d.listedCount} / ${data.roster.length}</td><td>${fmt(d.listedMedian)}</td><td>${fmt(d.withinListedRank)}番目</td></tr>`).join("\n");
  const fixed = s.complete.map(r=>`<tr data-week-peer="${r.entry}" data-week-total="${r.total}"><th scope="row">${r.entry===734?"みりぃ":"Entry "+r.entry}</th><td>${fmt(r.total)}</td><td>${1+s.complete.filter(x=>x.total>r.total).length}番目</td></tr>`).join("\n");
  const omitted = s.excluded.map(r=>`Entry ${r.entry}（掲載${r.observedDays}/7日）`).join("、");
  const first=data.days[0].sources[0].retrievedAtJst,last=data.days.at(-1).sources.at(-1).retrievedAtJst;
  return `<section class="panel week-panel" id="week-20261015-21">
<div class="section-label">SEVEN DAYS / 2026.10.15–10.21</div>
<h2>1日だけでなく、7日分の積み重ね。</h2>
<p>10月22日の確認時点で直近の完了日まで、対象日を先に7日間に固定しました。良い日だけを抜き出さず、SHOWROOM Classic・タレントの日間ジャンルptを並べています。</p>
<div class="kpis"><article class="kpi"><small>みりぃの日間pt・7日分合計</small><strong data-week-proof="total">${fmt(s.mily.total)}<em>pt</em></strong><p>公式の週間ランキングとは別の独自合算です。</p></article><article class="kpi"><small>固定16ルームの中央値を上回った日</small><strong data-week-proof="above">${s.aboveFixedMedianDays}<em> / 7日</em></strong><p>比較相手を日ごとに入れ替えない確認でも、7日とも上回りました。</p></article><article class="kpi"><small>全7日で掲載確認できた16ルーム内</small><strong data-week-proof="rank">${fmt(s.completeRank)}<em>番目 / 16</em></strong><p>35人全体の順位や、審査順位ではありません。</p></article></div>
<div class="finding"><p><strong>確認できる成果：</strong>この7日間は、毎日みりぃのポイントが記録されています。同じ16ルームの中央値との比較でも、1日だけでなく7日すべてで上回りました。届いた応援の記録であり、努力量・人気・人としての価値を順位付けするものではありません。</p></div>
<h3>同じ16ルームを基準に、毎日の応援を見る</h3><p class="note">棒はすべて0〜${fmt(max)}ptの同じ目盛り。緑はみりぃ、灰色は全7日で掲載確認できた同じ16ルーム（本人を含む）の各日中央値です。各日の掲載人数が変わっても、この灰色の比較対象は変えません。</p>
<div class="week-chart" role="group" aria-label="7日分の本人ポイントと固定16ルーム中央値">${bars}</div>
<div class="week-scale" aria-hidden="true"><span>0pt</span><span>${fmt(max)}pt</span></div>
<div class="table-scroll"><table><caption>単位：pt。右3列はその日に掲載確認できた対象内の参考比較で、日ごとに対象数が変わります。</caption><thead><tr><th>対象日</th><th>みりぃ</th><th>固定16中央値</th><th>当日の掲載数 / 名簿</th><th>当日掲載対象の中央値</th><th>当日掲載対象内</th></tr></thead><tbody>${rows}</tbody></table></div>
<h3>7日合計も、同じ対象だけで比べる</h3><p>全7日分が揃った${s.complete.length}ルームの7日合計中央値は<strong data-week-proof="fixed-median">${fmt(s.completeMedian)}pt</strong>。みりぃの合計はその<strong data-week-proof="fixed-ratio">${fmt(s.ratioToCompleteMedian)}倍</strong>でした。日間ptの合計であり、配信時間をそろえた効率比較ではありません。</p>
<details id="week-fixed-cohort"><summary>比較した16ルームすべての合計を見る</summary><div class="table-scroll"><table><caption>固定16ルーム内の独自集計。公式順位ではありません。</caption><thead><tr><th>対象</th><th>7日合計pt</th><th>固定対象内</th></tr></thead><tbody>${fixed}</tbody></table></div></details>
<details id="week-missing"><summary>合計比較から除いた19ルームと、その理由</summary><div><p>公式名簿35人のうち${s.excluded.length}人は、少なくとも1日、このジャンルの日間ランキングへの掲載を確認できませんでした。未掲載を0とせず、7日合計と合計順位は出していません。</p><p>${omitted}</p><p class="note">未掲載の理由は未確認です。全日掲載されたルームだけに絞ると対象に偏りが生じるため、16ルームの結果をセミファイナル全体へ一般化しません。</p></div></details>
<div class="pending"><b>比較の範囲を混ぜません。</b><p>10/21だけの「23ルーム内4番目」と、7日分が揃った「16ルーム内6番目」は、期間も対象も違います。順位低下を示すものではありません。日間集計の境界時刻は未確認で、各対象日は公式データの日付ラベルに従っています。</p><p>この数値は盛り上がり度・審査pt・新規ファン数ではなく、きっかけ配信の効果や通過確率も示しません。配信時間やギフト条件はそろえていません。10/22朝の未取得カウンターを復元したものでもありません。</p></div>
<details id="week-share-summary"><summary>この記録を短く伝えるなら</summary><div><p>10/15〜21の7日間で、みりぃには合計136,547ptの応援が記録されていました。全7日分が確認できた同じ16ルームの中央値と比べても、毎日上回っています。全員の審査順位や通過を保証する数字ではないけれど、ひとつの瞬間だけでは見えない、積み重なった応援がここにあります。</p></div></details>
<p class="sources">出典：<a href="https://2026.misscircle.jp/list/semifinal" target="_blank" rel="noopener noreferrer">公式セミファイナル名簿</a>と<a href="https://www.showroom-live.com/ranking" target="_blank" rel="noopener noreferrer">SHOWROOM Classicランキング</a>。${data.roster.length}人をルームIDで照合。各日の全ページを取得し、名簿の全員を掲載値または未取得として保持しました。<a href="/data-lab/data/semifinal-talent-seven-days-20261015-21.json">採用した集計JSON・日別取得URL・原応答ハッシュ</a>。</p><p class="note">取得窓（日本時間）：${esc(first)}〜${esc(last)}。自動更新ではない固定記録です。本人以外はEntry番号で表示しています。</p>
</section>`;
}
