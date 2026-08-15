/**
 * MISS CIRCLE CONTEST の現在状態。
 *
 * - 一次ソース（ENTRY 734 ページ / 本人SHOWROOMルーム等）で確認できた値だけを
 *   入れる。未確認のフィールドは null（推測して埋めない）。
 * - 審査フェーズが進んだら currentPhase を更新し、lastVerifiedAt に確認日を
 *   記録する。期間が公表されていなければ start / end は null のまま。
 */
export type ContestPhase = {
  /** フェーズ名（一次ソースの表記に合わせる） */
  name: string;
  /** 開始日 "YYYY-MM-DD"。未確認なら null */
  start: string | null;
  /** 終了日 "YYYY-MM-DD"。未確認なら null */
  end: string | null;
  /** フェーズ名を確認した一次ソースURL */
  source: string;
};

export type Contest = {
  contestName: string;
  entryNumber: string;
  entryUrl: string;
  currentPhase: ContestPhase | null;
  /** 上記の内容を最後に確認した日 "YYYY-MM-DD" */
  lastVerifiedAt: string;
};

export const contest: Contest = {
  contestName: "MISS CIRCLE CONTEST 2026",
  entryNumber: "ENTRY 734",
  entryUrl: "https://2026.misscircle.jp/entry/734",
  // ENTRY 734 ページから解決した本人SHOWROOMルーム名
  // 「🔥2次審査🩵三橋莉子🍅✨ #ミスサークル2026」で「2次審査」を確認（2026-08-15）。
  // 期間は一次ソースで未確認のため null。
  currentPhase: {
    name: "2次審査",
    start: null,
    end: null,
    source: "https://www.showroom-live.com/r/circle2026_0734",
  },
  lastVerifiedAt: "2026-08-15",
};
