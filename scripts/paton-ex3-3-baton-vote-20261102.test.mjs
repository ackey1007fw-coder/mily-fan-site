import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { contest } from "../src/data/contest.ts";
import {
  campusGirlsFinalsExThreeDayThreePatonVoteLink,
  links,
} from "../src/data/links.ts";
import {
  campusGirlsFinalsExThreeDayThreePatonVote,
  isValidSupportEvent,
  supportEvents,
} from "../src/data/supportEvents.ts";
import {
  selectHomePrioritySupport,
  selectHomeUrgentVotes,
  selectHomeVoteActions,
} from "../src/lib/homePortal.ts";

const PATON_URL = "https://paton.jp/event/entrant/14102";
const at = (iso) => Date.parse(iso);

describe("Paton 本選EX3③（2026-11-02 のみ）", () => {
  it("registers the confirmed one-day window and the entrant page", () => {
    assert.equal(isValidSupportEvent(campusGirlsFinalsExThreeDayThreePatonVote), true);
    assert.equal(campusGirlsFinalsExThreeDayThreePatonVoteLink.url, PATON_URL);
    assert.deepEqual(campusGirlsFinalsExThreeDayThreePatonVote.schedule, {
      state: "confirmed-period",
      start: "2026-11-02T00:00:00+09:00",
      end: "2026-11-02T23:59:59+09:00",
      allDay: false,
      timezone: "Asia/Tokyo",
    });
    assert.match(campusGirlsFinalsExThreeDayThreePatonVote.note, /無料！拍手/);
  });

  it("shows a tonight-deadline block next to the button while MISS CIRCLE stays the main spotlight", () => {
    const now = at("2026-11-02T16:00:00+09:00");
    const spotlight = selectHomePrioritySupport({ contest, supportEvents, links, now });
    assert.ok(spotlight);
    assert.notEqual(spotlight.action.url, PATON_URL);
    assert.equal(spotlight.urgentVotes?.length, 1);
    const [urgent] = spotlight.urgentVotes;
    assert.equal(urgent.action.url, PATON_URL);
    assert.match(urgent.deadlineLabel, /^本日 11\/2 23:59（JST）締切$/);
  });

  it("puts the Paton vote first in hero actions with its deadline", () => {
    const [primary] = selectHomeVoteActions({
      contest,
      supportEvents,
      links,
      now: at("2026-11-02T23:59:00+09:00"),
    });
    assert.equal(primary.url, PATON_URL);
    assert.match(primary.deadlineLabel, /11\/2 23:59/);
  });

  it("disappears after 23:59 JST and is not shown on other days", () => {
    for (const iso of ["2026-11-03T00:00:00+09:00", "2026-11-01T23:59:00+09:00"]) {
      const urgent = selectHomeUrgentVotes({ supportEvents, links, now: at(iso) });
      assert.equal(urgent.some((vote) => vote.action.url === PATON_URL), false, iso);
      const [primary] = selectHomeVoteActions({ contest, supportEvents, links, now: at(iso) });
      assert.notEqual(primary.url, PATON_URL, iso);
    }
  });
});
