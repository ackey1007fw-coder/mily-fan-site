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
  // ENTRY 734 ページから解決した本人SHOWROOMルーム名の公開表記をそのまま採用する。
  //   2026-08-15: 「🔥2次審査🩵三橋莉子🍅✨ #ミスサークル2026」→「2次審査」
  //   2026-08-16: 「🔥2次最終日🩵三橋莉子🍅✨ #ミスサークル2026」→「2次最終日」
  //     （Watch public sources が検知。Issue #9）
  //   2026-08-19: 主催者の三次審査進出者一覧（list/3）と本人Xの報告で
  //     2次審査通過・三次審査進出が確定 →「3次審査進出」
  // 「最終日」表記から締切日を推定して end に入れることはしない。
  // 三次審査の日程・審査方法は未公表のため start / end は null のまま。
  // 期間が一次ソースで公表されたら start / end を埋める。
  currentPhase: {
    name: "3次審査進出",
    start: null,
    end: null,
    source: "https://2026.misscircle.jp/list/3",
  },
  lastVerifiedAt: "2026-08-19",
};
