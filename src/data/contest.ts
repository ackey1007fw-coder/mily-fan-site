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
  /** 現在の審査を共有するときに使う、確認済みの企画ハッシュタグ。 */
  shareHashtag?: string;
  entryNumber: string;
  entryUrl: string;
  currentPhase: ContestPhase | null;
  /** 上記の内容を最後に確認した日 "YYYY-MM-DD" */
  lastVerifiedAt: string;
};

export const contest: Contest = {
  contestName: "MISS CIRCLE CONTEST 2026",
  shareHashtag: "#ミスサークル2026",
  entryNumber: "ENTRY 734",
  entryUrl: "https://2026.misscircle.jp/entry/734",
  // ENTRY 734 ページから解決した本人SHOWROOMルーム名の公開表記をそのまま採用する。
  //   2026-08-15: 「🔥2次審査🩵三橋莉子🍅✨ #ミスサークル2026」→「2次審査」
  //   2026-08-16: 「🔥2次最終日🩵三橋莉子🍅✨ #ミスサークル2026」→「2次最終日」
  //     （Watch public sources が検知。Issue #9）
  //   2026-08-19: 主催者の三次審査進出者一覧（list/3）と本人Xの報告で
  //     2次審査通過・三次審査進出が確定 →「3次審査進出」
  //   2026-08-26: 主催者公式 https://www.misscircle.jp/ の SCHEDULE で
  //     三次審査の審査期間 9/3〜9/13 を確認。WEB投票審査は
  //     09/03 12:00〜09/13 23:59。SHOWROOM審査は「後日発表予定」のまま
  //     なので時刻は書かない。ContestPhase は日付のみ保持する。
  // 「最終日」表記から締切日を推定して end に入れることはしない。
  currentPhase: {
    name: "3次審査進出",
    start: "2026-09-03",
    end: "2026-09-13",
    source: "https://www.misscircle.jp/",
  },
  lastVerifiedAt: "2026-08-26",
};
