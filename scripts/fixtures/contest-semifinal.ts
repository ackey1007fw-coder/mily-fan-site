import { contest, type Contest } from "../../src/data/contest.ts";

// Historical input for semifinal selectors. Never replace the live contest
// export or use this snapshot as proof of the current qualification status.
export const semifinalContest: Contest = {
  ...contest,
  currentPhase: {
    name: "セミファイナル進出",
    start: "2026-10-29",
    end: "2026-11-08",
    source: "https://www.misscircle.jp/",
  },
  lastVerifiedAt: "2026-10-28",
};
