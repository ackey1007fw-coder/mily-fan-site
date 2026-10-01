import assert from "node:assert/strict";
import { test } from "node:test";
import { contest } from "../src/data/contest.ts";
import { links, missCircleShowroomEventLink, missCircleFourthRoundShowroomEventLink } from "../src/data/links.ts";
import { supportEvents, missCircleFourthRoundWebVote, missCircleFourthRoundShowroomReview } from "../src/data/supportEvents.ts";
import { selectHomeVoteActions, selectHomeVoteSpotlight } from "../src/lib/homePortal.ts";
import { displayStatus } from "../src/lib/supportCalendar.ts";

const input = (time) => ({ contest, supportEvents, links, now: Date.parse(time) });
test("fourth-round voting switches at noon JST and stops after its last second", () => {
  const early = input("2026-10-02T11:59:59+09:00");
  assert.equal(selectHomeVoteActions(early)[0].url, contest.entryUrl);
  assert.equal(selectHomeVoteSpotlight(early).action.url, contest.entryUrl);
  const live = input("2026-10-02T12:00:00+09:00");
  assert.equal(selectHomeVoteSpotlight(live).state, "live");
  assert.equal(selectHomeVoteActions(live)[0].url, "https://liff.line.me/1656040756-GwmBkdPY/vote/misscircle2026/N/734");
  assert.equal(displayStatus(missCircleFourthRoundWebVote.schedule, Date.parse("2026-10-12T23:59:59+09:00")), "live");
  assert.equal(selectHomeVoteActions(input("2026-10-13T00:00:00+09:00"))[0].url, contest.entryUrl);
});
test("SHOWROOM has a different deadline and fourth-round destination while third-round stays intact", () => {
  assert.equal(missCircleFourthRoundShowroomReview.ctaLinkId, missCircleFourthRoundShowroomEventLink.id);
  assert.equal(missCircleFourthRoundShowroomEventLink.url, "https://www.showroom-live.com/event/circle2026_4th");
  assert.equal(missCircleShowroomEventLink.url, "https://www.showroom-live.com/event/circle2026_3rd");
  const now = Date.parse("2026-10-12T22:00:00+09:00");
  assert.equal(displayStatus(missCircleFourthRoundShowroomReview.schedule, now), "ended");
  assert.equal(displayStatus(missCircleFourthRoundWebVote.schedule, now), "live");
});
