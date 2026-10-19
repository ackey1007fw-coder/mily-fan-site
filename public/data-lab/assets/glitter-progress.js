import { planProgress, tokyoPeriods, REFRESH_MS } from './glitter-model.js';
const $ = id => document.getElementById(id);
const fmt = x => x === null || x === undefined ? '未確認' : x.toLocaleString('ja-JP');
const stamp = value => { const time = Date.parse(value); return Number.isFinite(time) ? new Intl.DateTimeFormat('ja-JP', {timeZone:'Asia/Tokyo',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(time) + ' JST' : '未確認'; };
const text = (id, value) => { $(id).textContent = value; };
let payload = null, loading = false, failed = false, lastAttempt = 0;
function render() {
  const now = Date.now();
  const raw = $('streams').value.trim();
  const streams = /^\d+$/.test(raw) ? Number(raw) : null;
  const view = planProgress(payload, now, streams, Number($('target').value));
  text('period', '集計週 ' + view.weekStart + ' 〜 ' + view.weekEnd + ' / 日本時間');
  text('remaining', fmt(view.remainingToMinimum)); text('weekly-points', fmt(view.weekly?.points)); text('weekly-rank', fmt(view.weekly?.rank));
  text('percent', view.percent === null ? '未確認' : view.percent.toFixed(1) + '%');
  $('progress').hidden = !view.weekly; $('progress').value = view.weekly?.points ?? 0;
  text('listed', view.weekly ? '今回のランキング掲載 ' + fmt(view.weekly.listedCount) + 'ルーム（上位割合の分母ではありません）' : '掲載数：未確認');
  const above = view.weekly;
  text('rank-gap', above?.nextRank && Number.isSafeInteger(above.gapToNextRank) && above.gapToNextRank >= 0 ? '直上 ' + above.nextRank + '位の ' + fmt(above.nextRankPoints) + 'pt まで、あと ' + fmt(above.gapToNextRank) + 'pt（同点になる差）' : above?.rank === 1 ? '現在1位です。以後の順位を保証する表示ではありません。' : '直上順位との差は未確認です。');
  text('daily-points', fmt(view.daily?.points)); text('daily-rank', fmt(view.daily?.rank));
  text('daily-remaining', view.dailyRemaining === null ? '4,000ptの最低条件まで：未確認' : view.dailyRemaining === 0 ? '最低ポイント条件は達成。順位条件は公式で別に確認！' : '4,000ptまで、あと ' + fmt(view.dailyRemaining) + 'pt');
  text('daily-average', fmt(view.dailyAverage));
  text('days-note', '目標 ' + fmt(view.target) + 'pt の残りを、今日を含む ' + view.daysRemaining + '日で割った追加ptの目安。今日すでに獲得したptも週間値に含まれています。');
  text('suggested-note', '42,000ptの参考目標まで：' + fmt(view.remainingToSuggested) + 'pt。42,000ptも金グリッター獲得を保証しません。');
  text('stream-plan', !view.weekly ? '今週の有効な公式値を取得できると試算できます。' : raw === '' ? '予定に合う配信回数を入力すると、1配信あたりの目安が出ます。' : view.perStream === null ? '残り配信回数は1〜99の整数で入力してください。' : '残り ' + streams + '配信なら、1配信あたり約 ' + fmt(view.perStream) + 'pt を追加する計算です。');
  text('weekly-time', '週間値の取得：' + (view.weekly ? stamp(view.weekly.observedAt) : '未確認（古い週・期限切れ・取得失敗は現在値に採用しません）'));
  text('daily-time', '日間値の取得：' + (view.daily ? stamp(view.daily.observedAt) : '未確認'));
  text('status', loading ? '公式ランキングを確認中です。' : view.weekly || view.daily ? (failed ? '再取得に失敗。10分以内の直近確認値だけを表示しています。' : '公式ランキングの途中値です。通常5分ごとに再取得。') + ((!view.weekly || !view.daily) ? ' 一部の数値は未確認です。' : '') : '現在値を取得できませんでした。ゼロではありません。公式ランキングで確認するか、再読み込みしてください。');
  $('refresh').disabled = loading;
}
async function load() {
  if (loading || document.hidden) return;
  loading = true; lastAttempt = Date.now(); render();
  const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch('/api/mily-glitter', {signal:controller.signal,credentials:'omit',cache:'no-cache'});
    if (!response.ok) throw new Error('unavailable');
    const data = await response.json();
    if (data?.schemaVersion !== 1 || !data.weekly || !data.daily) throw new Error('invalid');
    payload = data; failed = false;
  } catch { failed = true; } finally { clearTimeout(timer); loading = false; render(); }
}
$('refresh').addEventListener('click', load);
$('streams').addEventListener('input', render); $('target').addEventListener('change', render);
document.addEventListener('visibilitychange', () => { if (!document.hidden) {render(); if (Date.now() - lastAttempt >= REFRESH_MS || payload?.daily?.periodStart !== tokyoPeriods().today) load();} });
setInterval(() => { if (!document.hidden) {render(); if (Date.now() - lastAttempt >= REFRESH_MS || (payload?.daily?.periodStart !== tokyoPeriods().today && Date.now() - lastAttempt >= 30000)) load();} },30000);
render(); load();
