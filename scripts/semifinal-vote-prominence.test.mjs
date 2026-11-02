import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { contest } from "../src/data/contest.ts";
import { links, missCircleSemifinalWebVoteLink } from "../src/data/links.ts";
import { isValidSupportEvent, supportEvents, missCircleSemifinalWebVote, missCircleFourthRoundWebVote } from "../src/data/supportEvents.ts";
import { selectHomeVoteSpotlight, selectHomePrioritySupport, selectHomeVoteAction } from "../src/lib/homePortal.ts";

const start = Date.parse("2026-10-29T12:00:00+09:00");
const end = Date.parse("2026-11-08T23:59:59.999+09:00");
const input = (now) => ({ contest, links, supportEvents, now });
const voteUrl = "https://liff.line.me/1656040756-GwmBkdPY/vote/misscircle2026/N/734";

describe("semifinal vote prominence", () => {
  it("registers one sourced semifinal event and its own link without changing old rounds", () => {
    assert.ok(isValidSupportEvent(missCircleSemifinalWebVote));
    assert.equal(supportEvents.filter(({ id }) => id === missCircleSemifinalWebVote.id).length, 1);
    assert.equal(links.filter(({ id }) => id === missCircleSemifinalWebVoteLink.id).length, 1);
    assert.equal(missCircleSemifinalWebVote.source, "https://www.misscircle.jp/");
    assert.equal(missCircleSemifinalWebVote.verifiedAt, "2026-10-31");
    assert.equal(missCircleSemifinalWebVote.ctaLinkId, missCircleSemifinalWebVoteLink.id);
    assert.equal(missCircleSemifinalWebVoteLink.url, voteUrl);
    assert.equal(Date.parse(missCircleSemifinalWebVote.schedule.start), start);
    assert.equal(Date.parse(missCircleSemifinalWebVote.schedule.end), end);
    assert.equal(missCircleFourthRoundWebVote.schedule.end, "2026-10-12T23:59:59.999+09:00");
  });
  it("does not advertise an active vote before the confirmed opening", () => {
    assert.equal(selectHomeVoteSpotlight(input(Date.parse("2026-10-28T23:59:59+09:00"))), null);
    const before = selectHomeVoteSpotlight(input(start - 1));
    assert.equal(before.state, "upcoming");
    assert.equal(before.action.url, contest.entryUrl);
    assert.match(before.title, /12:00/);
  });
  for (const now of [start, Date.parse("2026-10-31T04:00:00+09:00"), end]) {
    it(`prioritizes ENTRY 734 during the semifinal at ${new Date(now).toISOString()}`, () => {
      const vote = selectHomeVoteSpotlight(input(now));
      const priority = selectHomePrioritySupport(input(now));
      assert.equal(vote.state, "live");
      assert.equal(vote.eventId, missCircleSemifinalWebVote.id);
      assert.equal(vote.action.url, voteUrl);
      assert.equal(vote.action.mobileLabel, "WEB投票する");
      assert.match(vote.eyebrow, /セミファイナル/);
      assert.match(vote.note, /11\/8.*23:59/);
      assert.equal(priority.kind, "vote");
      assert.match(priority.title, /三橋莉子にWEB投票をお願いします/);
      assert.equal(priority.dailyVote, undefined, "Do not carry fourth-round rewards into the semifinal");
      assert.equal(selectHomeVoteAction(input(now)).url, voteUrl);
    });
  }
  it("removes the live spotlight and direct primary vote link at the exact expiry", () => {
    assert.equal(selectHomeVoteSpotlight(input(end + 1)), null);
    assert.equal(selectHomeVoteAction(input(end + 1)).url, contest.entryUrl);
    assert.equal(selectHomePrioritySupport(input(end + 1)), null);
  });
});
