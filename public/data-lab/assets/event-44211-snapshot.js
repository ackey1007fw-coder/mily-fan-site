/**
 * SHOWROOM event_id 44211 の公開ランキング読取。
 * 公式の最終発表ではない。Classic金グリッターpt・きら星カウンターとは混ぜない。
 * 私的情報・DM・視聴者名は置かない。掲載名は公開イベント順位の表示名。
 */
export const EVENT_44211_SNAPSHOT = Object.freeze({
  schemaVersion: 1,
  eventId: 44211,
  eventUrl: 'https://www.showroom-live.com/event/circle2026_sf',
  eventTitle: '【ミスサー枠】SDGs推進 TGC しずおか 2027 出演オーディション',
  phase: 'semifinal',
  phaseLabel: 'セミファイナル',
  observedAtJst: '2026-11-08T04:25:00+09:00',
  observedAtLabel: '2026年11月8日 4:25（日本時間）',
  totalEntries: 35,
  source: 'manual-snapshot',
  unofficial: true,
  notOfficialFinal: true,
  notGlitterPoints: true,
  notKiraStars: true,
  mily: Object.freeze({ rank: 9, point: 3696180, displayName: 'みりぃ', roomUrlKey: 'circle2026_0734' }),
  above: Object.freeze({ rank: 8, point: 4420589, displayName: '高乘美空' }),
  below: Object.freeze({ rank: 10, point: 3678165, displayName: '辻本祐佳' }),
  first: Object.freeze({ rank: 1, point: 9727643, displayName: '陣ノ内柚来' }),
});

export function pointGap(higher, lower) {
  if (!Number.isSafeInteger(higher) || !Number.isSafeInteger(lower) || higher < 0 || lower < 0) return null;
  return higher - lower;
}

export function event44211Gaps(snapshot = EVENT_44211_SNAPSHOT) {
  const mily = snapshot?.mily?.point;
  return {
    toAbove: pointGap(snapshot?.above?.point, mily),
    toBelow: pointGap(mily, snapshot?.below?.point),
    toFirst: pointGap(snapshot?.first?.point, mily),
  };
}

export function formatEventPoints(point) {
  if (!Number.isSafeInteger(point) || point < 0) return '未確認';
  return point.toLocaleString('ja-JP');
}

export function formatPointDelta(delta) {
  if (!Number.isSafeInteger(delta) || delta === 0) return '—';
  const sign = delta > 0 ? '+' : '−';
  return sign + formatEventPoints(Math.abs(delta));
}
