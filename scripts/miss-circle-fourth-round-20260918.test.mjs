import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { contest } from "../src/data/contest.ts";
import {
  isValidSupportEvent,
  missCircleFourthRoundShowroomReview,
  missCircleFourthRoundWebVote,
  supportEvents,
} from "../src/data/supportEvents.ts";
import { contestOfficialWindowLines } from "../src/lib/contestPhaseDisplay.ts";
import { selectHomeVoteAction } from "../src/lib/homePortal.ts";
import { selectContestNowHero } from "../src/lib/homeToday.ts";
import { links } from "../src/data/links.ts";
import { displayStatus } from "../src/lib/supportCalendar.ts";
import { selectSupportNow } from "../src/lib/supportHub.ts";

const WEB_START = Date.parse("2026-10-02T12:00:00+09:00");
const WEB_END = Date.parse("2026-10-12T23:59:59+09:00");
const SHOWROOM_START = Date.parse("2026-10-03T05:00:00+09:00");
const SHOWROOM_END = Date.parse("2026-10-12T21:59:59+09:00");
const unknownLive = {
  state: "unknown",
  startedAt: null,
  observedAt: null,
  roomUrl: null,
  next: { state: "unknown", at: null },
};

function nowItems(now) {
  return selectSupportNow({
    supportEvents,
    live: unknownLive,
    radio: null,
    now,
  });
}

describe("MISS CIRCLE 2026 fourth round", () => {
  it("uses the official fourth-round phase and date-only ContestPhase", () => {
    assert.deepEqual(contest.currentPhase, {
      name: "4次審査",
      start: "2026-10-02",
      end: "2026-10-12",
      source: "https://www.misscircle.jp/",
    });
    assert.equal(contest.lastVerifiedAt, "2026-09-18");
    assert.deepEqual(contestOfficialWindowLines(contest.currentPhase), [
      "WEB投票 10/2 12:00〜10/12 23:59",
      "SHOWROOM審査 10/3 5:00〜10/12 21:59",
      "SHOWROOMは10/12 21:59終了",
    ]);
    assert.deepEqual(
      contestOfficialWindowLines({
        ...contest.currentPhase,
        start: "2027-10-02",
        end: "2027-10-12",
      }),
      [],
    );
  });

  it("keeps the fourth round out of HOME NOW until one day before it starts", () => {
    const heroAt = (now) =>
      selectContestNowHero({
        contest,
        liveVote: selectHomeVoteAction({ contest, supportEvents, links, now }),
        now,
      });

    assert.equal(heroAt(Date.parse("2026-09-23T00:00:00+09:00")), null);
    assert.equal(heroAt(Date.parse("2026-09-30T23:59:59+09:00")), null);
    assert.equal(
      heroAt(Date.parse("2026-10-01T00:00:00+09:00"))?.key,
      "now:contest",
    );
  });

  it("registers official windows without guessing fourth-round CTA URLs", () => {
    for (const event of [
      missCircleFourthRoundWebVote,
      missCircleFourthRoundShowroomReview,
    ]) {
      assert.equal(isValidSupportEvent(event), true);
      assert.equal(event.source, "https://www.misscircle.jp/");
      assert.equal(event.verifiedAt, "2026-09-18");
      assert.equal(event.ctaLinkId, undefined);
      assert.equal(supportEvents.filter(({ id }) => id === event.id).length, 1);
    }
    assert.equal(missCircleFourthRoundWebVote.schedule.start, "2026-10-02T12:00:00+09:00");
    assert.equal(missCircleFourthRoundWebVote.schedule.end, "2026-10-12T23:59:59+09:00");
    assert.equal(missCircleFourthRoundShowroomReview.schedule.start, "2026-10-03T05:00:00+09:00");
    assert.equal(missCircleFourthRoundShowroomReview.schedule.end, "2026-10-12T21:59:59+09:00");
  });

  it("keeps the final minute live and removes each NOW item one second later", () => {
    assert.equal(displayStatus(missCircleFourthRoundWebVote.schedule, WEB_START - 1), "upcoming");
    assert.equal(displayStatus(missCircleFourthRoundWebVote.schedule, WEB_END), "live");
    assert.equal(displayStatus(missCircleFourthRoundWebVote.schedule, WEB_END + 1), "ended");
    assert.equal(displayStatus(missCircleFourthRoundShowroomReview.schedule, SHOWROOM_START - 1), "upcoming");
    assert.equal(displayStatus(missCircleFourthRoundShowroomReview.schedule, SHOWROOM_END), "live");
    assert.equal(displayStatus(missCircleFourthRoundShowroomReview.schedule, SHOWROOM_END + 1), "ended");

    assert.equal(
      nowItems(WEB_END).some(({ key }) => key === `now:support-event:${missCircleFourthRoundWebVote.id}`),
      true,
    );
    assert.equal(
      nowItems(WEB_END + 1).some(({ key }) => key === `now:support-event:${missCircleFourthRoundWebVote.id}`),
      false,
    );
  });
});
