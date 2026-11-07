/**
 * きら星はルーム画面の参考カウンター。公式確定数・イベントpt・金グリッターptではない。
 * 値はログに残っていた最大で、終了時の最終値ではない。欠測は null（0 にしない）。
 *
 * 10/29〜11/5朝: オーナー提供 kira.csv
 * 11/5夜〜11/7朝: 同じログ方針で確認できた最大値
 * 11/7夜: この表の対象ログには無く、欠測
 */
export const KIRA_STAR_META = Object.freeze({
  year: 2026,
  unofficial: true,
  metric: 'room-star-counter-max-in-log',
  notFinal: true,
  notEventPoints: true,
  notGlitterPoints: true,
  missingIsZero: false,
  rangeLabel: '10/29〜11/7',
});

export const KIRA_STAR_SLOTS = Object.freeze([
  Object.freeze({ id: '2026-10-29-morning', label: '10/29朝', stars: 4665, note: '', quality: 'max-in-log' }),
  Object.freeze({ id: '2026-10-29-noon', label: '10/29昼', stars: 4724, note: '参考', quality: 'reference' }),
  Object.freeze({ id: '2026-10-30-morning-1', label: '10/30朝①', stars: 1898, note: '参考', quality: 'reference' }),
  Object.freeze({ id: '2026-10-30-morning-2', label: '10/30朝②', stars: 961, note: '途中', quality: 'in-progress' }),
  Object.freeze({ id: '2026-10-30-night', label: '10/30夜', stars: 300, note: '途中', quality: 'in-progress' }),
  Object.freeze({ id: '2026-10-31-noon', label: '10/31昼', stars: 2751, note: '途中', quality: 'in-progress' }),
  Object.freeze({ id: '2026-11-01-morning', label: '11/1朝', stars: 2453, note: '途中', quality: 'in-progress' }),
  Object.freeze({ id: '2026-11-01-noon', label: '11/1昼', stars: 1248, note: '途中', quality: 'in-progress' }),
  Object.freeze({ id: '2026-11-01-night', label: '11/1夜', stars: 2641, note: '途中', quality: 'in-progress' }),
  Object.freeze({ id: '2026-11-02-morning', label: '11/2朝', stars: 2383, note: '途中', quality: 'in-progress' }),
  Object.freeze({ id: '2026-11-02-noon', label: '11/2昼', stars: 3360, note: '終了直前', quality: 'near-end' }),
  Object.freeze({ id: '2026-11-02-night', label: '11/2夜', stars: 3853, note: '', quality: 'max-in-log' }),
  Object.freeze({ id: '2026-11-03-morning', label: '11/3朝', stars: 3643, note: '', quality: 'max-in-log' }),
  Object.freeze({ id: '2026-11-03-noon', label: '11/3昼', stars: null, note: '未取得', quality: 'missing' }),
  Object.freeze({ id: '2026-11-03-night', label: '11/3夜', stars: 2453, note: '', quality: 'max-in-log' }),
  Object.freeze({ id: '2026-11-04-morning', label: '11/4朝', stars: 3975, note: '', quality: 'max-in-log' }),
  Object.freeze({ id: '2026-11-04-noon', label: '11/4昼', stars: 3862, note: '途中(15:07)', quality: 'in-progress' }),
  Object.freeze({ id: '2026-11-04-night', label: '11/4夜', stars: 3643, note: '途中', quality: 'in-progress' }),
  Object.freeze({ id: '2026-11-05-morning', label: '11/5朝', stars: 3564, note: '途中', quality: 'in-progress' }),
  Object.freeze({ id: '2026-11-05-night', label: '11/5夜', stars: 3313, note: '', quality: 'max-in-log' }),
  Object.freeze({ id: '2026-11-06-morning', label: '11/6朝', stars: 4441, note: '', quality: 'max-in-log' }),
  Object.freeze({ id: '2026-11-06-noon', label: '11/6昼', stars: 4824, note: '', quality: 'max-in-log' }),
  Object.freeze({ id: '2026-11-06-night', label: '11/6夜', stars: 2691, note: '', quality: 'max-in-log' }),
  Object.freeze({ id: '2026-11-07-morning', label: '11/7朝', stars: 5341, note: '', quality: 'max-in-log' }),
  Object.freeze({ id: '2026-11-07-night', label: '11/7夜', stars: null, note: '欠測', quality: 'missing' }),
]);

export function formatKiraStars(stars) {
  if (stars === null || stars === undefined) return '欠測';
  if (typeof stars !== 'number' || !Number.isSafeInteger(stars) || stars < 0) return '未確認';
  return stars.toLocaleString('ja-JP');
}

export function kiraNote(slot) {
  if (!slot) return 'ログ上の最大';
  if (slot.quality === 'missing') return slot.note || '欠測';
  return slot.note || 'ログ上の最大';
}
