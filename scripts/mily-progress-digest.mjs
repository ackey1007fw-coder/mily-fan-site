import assert from 'node:assert/strict';
import { summarizeWeek } from './mily-week-progress.mjs';
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = value => new Intl.NumberFormat('ja-JP', {maximumFractionDigits:2}).format(value);
export function digestFacts(data) {
  const s = summarizeWeek(data);
  // This editorial summary belongs to this fixed snapshot, not future dates.
  assert.equal(s.mily.observedDays, 7); assert.equal(s.complete.length, 16);
  assert.equal(s.excluded.length, 19); assert.equal(s.aboveFixedMedianDays, 7);
  assert.equal(s.mily.total, 136547); assert.equal(s.ratioToCompleteMedian, 2.01);
  return {total:s.mily.total, above:s.aboveFixedMedianDays, days:s.days.length,
    cohort:s.complete.length, missing:s.excluded.length, ratio:s.ratioToCompleteMedian};
}
export function digestShareText(data) {
  const f = digestFacts(data);
  return `みりぃの積み重ね｜2026年10月15日〜21日の記録\n\nSHOWROOM Classic・タレントの日間ptは、7日分合計${fmt(f.total)}pt。全7日分が確認できた同じ${f.cohort}ルーム（本人を含む）の各日中央値を、${f.above}日すべてで上回りました。7日合計は、この${f.cohort}ルームの合計中央値の約${f.ratio.toFixed(2)}倍です。\n\n名簿35人中、未掲載のある${f.missing}人は合計比較から除外しています。公式データの非公式な独自集計で、審査順位・盛り上がり度・配信効率や通過の保証ではありません。\n\nここまで届いた応援を、ひとつの瞬間だけでなく積み重ねで。\n出典・比較条件：__DATA_LAB_PROGRESS_CANONICAL__#at-a-glance`;
}
export function renderDigest(data) {
  const f=digestFacts(data);
  return `<section class="progress-digest" id="at-a-glance" aria-labelledby="digest-title">
<p class="section-label">まず30秒で / 2026.10.15–10.21の固定記録</p>
<h2 id="digest-title">ここまで届いた応援を、<br>3つの事実で。</h2>
<div class="digest-facts">
<article><h3>1日だけではない記録</h3><p class="digest-number" data-digest-proof="days">${f.above}<span> / ${f.days}日</span></p><p>同じ${f.cohort}ルームの各日中央値を、7日すべてで上回りました。</p></article>
<article><h3>7日分の応援の合計</h3><p class="digest-number" data-digest-proof="total">${fmt(f.total)}<span>pt</span></p><p>公式の日間ジャンルptを独自に合算。公式週間ランキングとは別です。</p></article>
<article><h3>7日合計の中央値に対して</h3><p class="digest-number" data-digest-proof="ratio">${f.ratio.toFixed(2)}<span>倍</span></p><p>全7日分が揃った同じ${f.cohort}ルームの、合計の中央値との比較です。</p></article>
</div>
<p class="digest-scope">比較対象は本人を含む固定${f.cohort}ルーム。名簿35人のうち、未掲載のある${f.missing}人は合計比較から除外しています。全員の順位・審査順位・盛り上がり度・配信効率・通過の保証ではありません。</p>
<p class="digest-message">この数字は、明日も超えなければならないノルマではありません。ここまで届いた応援を、振り返るための記録です。</p>
<div class="progress-actions"><a class="progress-action" href="#week-20261015-21">7日分のグラフへ</a><a href="/data-lab/data/semifinal-talent-seven-days-20261015-21.json">元データ・出典を確かめる</a></div>
<details id="progress-reading-guide"><summary>「中央値」と比較範囲の読み方</summary><div><p>中央値は、数字を小さい順に並べたときの真ん中の値です。16ルームなら8番目と9番目の平均です。「毎日の中央値」と「7日合計の中央値」は、別々に計算しています。</p><p>単日の23ルーム内4番目と、7日合計の16ルーム内6番目は、期間も相手も違います。順位が下がったという意味ではありません。比較は届いた応援の参考で、人の価値や努力量の順位ではありません。</p></div></details>
<div class="progress-share" id="progress-share"><button class="progress-action" type="button" id="progress-copy" aria-controls="progress-share-manual" hidden>要点と出典リンクをコピー</button><p id="progress-copy-status" class="note" role="status" aria-live="polite" aria-atomic="true"></p>
<details id="progress-share-manual"><summary>送る文章を確認・手動でコピー</summary><div><label for="progress-share-text">期間・対象・注意書き付きの要約</label><textarea id="progress-share-text" readonly rows="10" spellcheck="false">${esc(digestShareText(data))}</textarea><p class="note">コピーは送信ではありません。送信先のアプリに貼り付け、内容を確認して使えます。</p></div></details></div>
</section>`;
}
