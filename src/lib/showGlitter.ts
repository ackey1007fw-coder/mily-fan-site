/** SHOWROOM公式のSHOWグリッター条件。ジャンル順位は別途公式画面で確認する。 */
export const SHOW_GLITTER = {
  dailyMin: 4_000,
  dailyTopPercent: 20,
  weeklyMin: 40_000,
  weeklyTopPercent: 10,
  /** 非公式の余裕を持たせた目安。獲得を保証しない。 */
  suggestedWeekly: 42_000,
} as const;

/** 数値未入力と0ptを区別。非公式の配信カウンターは渡さないこと。 */
export function parseOfficialPoints(value: string): number | null {
  if (!/^\d+$/.test(value.trim())) return null;
  const points = Number(value);
  return Number.isSafeInteger(points) ? points : null;
}

/** ポイント到達の試算のみ。ジャンル順位と特典の有効性は判定しない。 */
export function planShowGlitterWeek(
  officialWeeklyPoints: number | null,
  daysRemaining: number,
): {
  remainingToMinimum: number;
  dailyAverageToMinimum: number;
  dailyAverageToSuggested: number;
  percentOfMinimum: number;
} | null {
  if (
    officialWeeklyPoints === null ||
    !Number.isSafeInteger(officialWeeklyPoints) ||
    officialWeeklyPoints < 0 ||
    !Number.isInteger(daysRemaining) ||
    daysRemaining < 1 ||
    daysRemaining > 7
  ) return null;
  const remainingToMinimum = Math.max(0, SHOW_GLITTER.weeklyMin - officialWeeklyPoints);
  const remainingToSuggested = Math.max(0, SHOW_GLITTER.suggestedWeekly - officialWeeklyPoints);
  return {
    remainingToMinimum,
    dailyAverageToMinimum: Math.ceil(remainingToMinimum / daysRemaining),
    dailyAverageToSuggested: Math.ceil(remainingToSuggested / daysRemaining),
    percentOfMinimum: Math.min(100, (officialWeeklyPoints / SHOW_GLITTER.weeklyMin) * 100),
  };
}
