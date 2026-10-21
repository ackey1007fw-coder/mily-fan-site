// Shared, deterministic calculation for the timing page and offline data build.
// Only anonymized, already-published counters are accepted. No network or DOM access.
export const METRICS = {
  comments: { label: '会話・盛り上がり', counter: 'コメント', unit: '件', note: '累積コメント表示の増加。感情や満足度を測る指標ではありません。' },
  stars: { label: 'きら星', counter: 'きら星表示', unit: '', note: '画面上の参考表示。公式イベントptや確定した贈呈個数ではありません。' },
  visits: { label: '訪問', counter: '総訪問表示', unit: '', note: '総訪問表示の増加。ユニーク視聴者数・同時視聴者数ではありません。' },
  firstVisits: { label: '初訪問', counter: '初訪問表示', unit: '', note: '画面の初訪問表示の増加。実人数の確定値ではありません。' },
  otherFree: { label: 'その他無料ギフト', counter: 'その他free表示', unit: '', note: 'きら星と別の無料ギフト表示。有料ギフトや金額へ換算しません。' },
  newFollows: { label: '新規フォロー', counter: '新規follow表示', unit: '', note: '保存した画面上の増加。取り消しや未観測区間は推定しません。' }
};
export const PHASES = { after: '10/13以降（正式イベントID未確認）', fourth: '四次審査期（10/12 22時まで）', afterFinal: '10/12 22時以降（審査終了後）' };
const KEYS = Object.keys(METRICS);
const BOUNDARY = Date.parse('2026-10-12T22:00:00+09:00');
const NEXT_DAY = Date.parse('2026-10-13T00:00:00+09:00');
export const MIN_BIN_SECONDS = 600;
const validNumber = x => typeof x === 'number' && Number.isFinite(x) && x >= 0;
export function timestamp(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:\+09:00|Z)$/.test(value)) return null;
  const n = Date.parse(value);
  if (!Number.isFinite(n)) return null;
  const local = new Date(n + (value.endsWith('Z') ? 0 : 32400000)).toISOString();
  return local.slice(0,19) === value.slice(0,19) ? n : null;
}
function jst(ms) { return new Date(ms + 32400000).toISOString(); }
function phaseAt(ms) { return ms < BOUNDARY ? 'fourth' : ms < NEXT_DAY ? 'afterFinal' : 'after'; }
export function intervalPhase(from, to) {
  const a = timestamp(from), b = timestamp(to);
  return a !== null && b !== null && b > a && phaseAt(a) === phaseAt(b - 1) ? phaseAt(a) : null;
}
export function median(values) {
  const a = values.filter(validNumber).sort((x,y) => x-y);
  if (!a.length) return null;
  const mid = Math.floor(a.length/2);
  return a.length % 2 ? a[mid] : (a[mid-1] + a[mid])/2;
}
export function relativeChange(value, baseline) {
  return validNumber(value) && validNumber(baseline) && baseline > 0 ? (value/baseline - 1)*100 : null;
}
function normalizePoint(p, date) {
  const raw = p.atJst ?? p.observed_at_jst ?? p.window_end_observed_at_jst;
  const at = typeof raw === 'string' && /^\d\d:\d\d:\d\d/.test(raw) ? `${date}T${raw}+09:00` : raw;
  return { at, values: { comments:p.comments, stars:p.stars, visits:p.visits ?? p.total_visits,
    firstVisits:p.firstVisits ?? p.first_visits, otherFree:p.otherFree ?? p.other_free,
    newFollows:p.newFollows ?? p.new_follows } };
}
export function buildDataset(sources) {
  const byId = new Map(), exclusions = {}, provenance = [];
  const reject = reason => { exclusions[reason] = (exclusions[reason] || 0) + 1; };
  const history = sources.find(s => Array.isArray(s.data.sessions));
  const historyIds = new Set((history?.data.sessions || []).map(s => s.live_id));
  function session(id, date, slot) {
    if (!Number.isSafeInteger(id) || !/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new Error('Invalid session identity');
    const old = byId.get(id);
    if (old && (old.date !== date || old.slot !== slot)) throw new Error('Conflicting session identity');
    if (!old) byId.set(id, { id, date, slot, windows: [], notes: ['保存できた観測区間のみ。配信全体・公式確定値ではありません。'] });
    return byId.get(id);
  }
  function add(s, from, to, delta, source, elapsedSeconds = null, gaps = []) {
    const a = timestamp(from), b = timestamp(to);
    if (a === null || b === null || b <= a) { reject('invalid_or_reversed_time'); return; }
    const seconds = (b-a)/1000;
    if (seconds < 30 || seconds > 390) { reject('too_short_or_long_interval'); return; }
    if (elapsedSeconds !== null && (!validNumber(elapsedSeconds) || Math.abs(seconds-elapsedSeconds) > Math.max(30,seconds*.1))) { reject('clock_disagreement'); return; }
    const phase = intervalPhase(from,to);
    if (!phase) { reject('event_boundary'); return; }
    if (gaps.some(g => { const x=timestamp(g.fromJst ?? g.start_jst), y=timestamp(g.toJst ?? g.end_jst); return x===null || y===null || (a<y && b>x); })) { reject('known_gap'); return; }
    const clean = Object.fromEntries(KEYS.map(k => [k, validNumber(delta[k]) ? delta[k] : null]));
    // Reject overlapping observations per metric. Multiple sources cannot double-count a stream.
    for(const k of KEYS) if(clean[k]!==null && s.windows.some(w => w.delta[k]!==null && a<timestamp(w.to) && b>timestamp(w.from))) { clean[k]=null; reject('duplicate_or_overlap_metric'); }
    if (KEYS.every(k=>clean[k]===null)) { reject('no_valid_metric'); return; }
    s.windows.push({ from,to,seconds,phase,delta:clean,source });
  }
  if (history) for(const h of history.data.sessions) {
    const s=session(h.live_id,h.date_jst,h.slot);
    for(const w of h.observed_windows || []) add(s,w.from,w.to,{comments:w.added_comments},history.path,w.duration_seconds);
  }
  for(const src of sources) {
    provenance.push({path:src.path,sha256:src.sha256});
    if (src === history) continue;
    const d=src.data, date=d.dateJst ?? d.date_jst, slot=d.session ?? d.slot ?? (src.path.includes('morning')?'morning':null);
    const id=d.liveId ?? d.live_id ?? history?.data.sessions.find(s=>s.date_jst===date && s.slot===slot)?.live_id;
    if (!id) { reject('unresolved_session'); continue; }
    const s=session(id,date,slot);
    const groups=d.segments?.map(g=>g.five_minute_window_endpoints) ?? [d.counters?.observations ?? d.five_minute_window_endpoints ?? []];
    const gaps=d.counters?.gaps ?? (d.gap ? [d.gap] : []);
    if (d.counters?.discontinuities?.length) { s.notes.push('不連続区間のある元資料は時間帯計算を保留しています。'); reject('unresolved_discontinuities'); continue; }
    for(const points of groups) {
      const high = {}, recovering = {};
      for(const k of KEYS) high[k] = points.length ? normalizePoint(points[0],date).values[k] : null;
      for(let i=1;i<points.length;i++) {
        const left=normalizePoint(points[i-1],date), right=normalizePoint(points[i],date), delta={};
        for(const k of KEYS) delta[k]=validNumber(left.values[k]) && validNumber(right.values[k]) && right.values[k]>=left.values[k] ? right.values[k]-left.values[k] : null;
        for(const k of KEYS) {
          const value=right.values[k];
          if(validNumber(value) && validNumber(high[k]) && value<high[k]) { delta[k]=null;recovering[k]=true;reject('counter_regression'); }
          else if(validNumber(value)) { if(recovering[k]) {delta[k]=null;reject('regression_recovery');} recovering[k]=false;high[k]=value; }
        }
        if(historyIds.has(id)) delta.comments=null;
        if(points[i-1].safeForVelocity===false || points[i].safeForVelocity===false || points[i-1].regressionUnverified || points[i].regressionUnverified) { reject('unsafe_boundary'); continue; }
        const elapsed = validNumber(points[i-1].elapsedSeconds) && validNumber(points[i].elapsedSeconds)
          ? points[i].elapsedSeconds - points[i-1].elapsedSeconds : null;
        add(s,left.at,right.at,delta,src.path,elapsed,gaps);
      }
    }
    if (!groups.some(g=>g?.length>1)) s.notes.push('時間帯比較に必要な複数の観測時刻・数値が不足しています。');
    if (d.observed_screen?.screen_clock_lag_seconds_approx) s.notes.push('画面時計の遅れの記録があります。時刻は保存観測時刻です。');
  }
  const sessions=[...byId.values()].sort((a,b)=>a.date.localeCompare(b.date)||a.id-b.id);
  const ends=sessions.flatMap(s=>s.windows.map(w=>timestamp(w.to)));
  return { schema:'mily-stream-timing-v1', methodologyVersion:1, nonOfficial:true,
    dataThroughJst:ends.length ? jst(Math.max(...ends)).slice(0,-1)+'+09:00' : null,
    comparisonMeaning:'observed_clock_time_not_causal_start_time', fullCoverage:false,
    paidGifts:{available:false,reason:'時間帯ごとの有料ギフト額・正式イベントptの検証済み系列がありません。'},
    congestion:{available:false,reason:'配信サービス全体の混雑データは未接続。莉子さん自身の保存実績を表示します。'},
    minObservedSecondsPerStreamAndHour:MIN_BIN_SECONDS, sources:provenance, exclusions,sessions };
}
function matchesDay(day, filter) {
  return filter === 'all' || filter === 'weekday' && day>=1 && day<=5 || filter === 'weekend' && (day===0 || day===6) || String(day)===String(filter);
}
export function explore(dataset, {metric='comments',phase='after',day='all'}={}) {
  if(dataset?.schema!=='mily-stream-timing-v1' || !Array.isArray(dataset.sessions)) throw new Error('Unexpected timing schema');
  if(!Object.hasOwn(METRICS,metric) || !Object.hasOwn(PHASES,phase)) throw new Error('Invalid timing filter');
  const bins=new Map(), baselineStreams=new Map(), seen=new Set(); let boundaryExcluded=0;
  for(const s of dataset.sessions) {
    if(seen.has(s.id)) throw new Error('Duplicate session'); seen.add(s.id);
    const accepted=[];
    for(const w of s.windows) {
      const a=timestamp(w.from), b=timestamp(w.to), value=w.delta?.[metric];
      if(a===null || b===null || b-a<30000 || b-a>390000 || intervalPhase(w.from,w.to)!==phase || !validNumber(value)) continue;
      const local=jst(a), end=jst(b-1), weekday=new Date(a+32400000).getUTCDay();
      if(!matchesDay(weekday,day)) continue;
      if(local.slice(0,13)!==end.slice(0,13)) {boundaryExcluded++; continue;}
      if(accepted.some(p=>a<p.b && b>p.a)) continue;
      accepted.push({a,b});
      const hour=Number(local.slice(11,13)), seconds=(b-a)/1000;
      for(const key of [`hour:${hour}`,`cell:${weekday}:${hour}`]) {
        if(!bins.has(key)) bins.set(key,new Map());
        const entries=bins.get(key); const e=entries.get(s.id) ?? {id:s.id,date:local.slice(0,10),seconds:0,delta:0,windows:0};
        e.seconds+=seconds;e.delta+=value;e.windows++;entries.set(s.id,e);
      }
      const base=baselineStreams.get(s.id) ?? {delta:0,seconds:0};base.delta+=value;base.seconds+=seconds;baselineStreams.set(s.id,base);
    }
  }
  const baseline=median([...baselineStreams.values()].filter(s=>s.seconds>=MIN_BIN_SECONDS).map(s=>s.delta/s.seconds*60));
  function summarize(key) {
    const all=[...(bins.get(key)?.values() ?? [])];
    const selected=all.filter(s=>s.seconds>=MIN_BIN_SECONDS), rates=selected.map(s=>s.delta/s.seconds*60);
    const n=selected.length, days=new Set(selected.map(s=>s.date)).size, value=median(rates);
    return {value,n,days,minutes:selected.reduce((a,s)=>a+s.seconds,0)/60,excludedShortStreams:all.length-n,
      min:rates.length?Math.min(...rates):null,max:rates.length?Math.max(...rates):null,
      growthPercent:relativeChange(value,baseline),streamIds:selected.map(s=>s.id),
      evidence:n===0?'不足':n===1?'1回のみ・探索':n<5?'少数データ・参考':'複数回の傾向（未検証）'};
  }
  const hours=Array.from({length:24},(_,hour)=>({hour,...summarize(`hour:${hour}`)}));
  const cells=Array.from({length:7},(_,weekday)=>Array.from({length:24},(_,hour)=>({weekday,hour,...summarize(`cell:${weekday}:${hour}`)}))).flat();
  const eligible=hours.filter(h=>h.n>=2 && h.days>=2 && h.value>0).sort((a,b)=>b.value-a.value||b.n-a.n||a.hour-b.hour);
  const exploratory=hours.filter(h=>h.n===1 && h.value>0).sort((a,b)=>b.value-a.value||a.hour-b.hour);
  return {metric,phase,day,baseline,baselineN:[...baselineStreams.values()].filter(s=>s.seconds>=MIN_BIN_SECONDS).length,
    hours,cells,candidates:eligible.slice(0,3),exploratory:exploratory.slice(0,3),boundaryExcluded};
}
