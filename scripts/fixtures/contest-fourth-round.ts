import { contest, type Contest } from "../../src/data/contest.ts";

// Historical input for fourth-round selectors. Never replace the live contest
// export or use this snapshot as proof of the current qualification status.
export const fourthRoundContest: Contest = {
  ...contest,
  currentPhase: {
    name: "4次審査",
    start: "2026-10-02",
    end: "2026-10-12",
    source: "https://www.misscircle.jp/",
  },
  lastVerifiedAt: "2026-10-01",
};
