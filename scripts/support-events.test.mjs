import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { contest } from "../src/data/contest.ts";
import { events } from "../src/data/events.ts";
import { links } from "../src/data/links.ts";
import {
  isValidSupportEvent,
  isValidSupportEventSchedule,
  supportEvents,
} from "../src/data/supportEvents.ts";

const baseEvent = {
  id: "fixture-support-event",
  activityId: "live-stream",
  kind: "support-campaign",
  title: "確認済みfixture",
  schedule: {
    state: "confirmed-period",
    start: "2026-08-22T10:00:00+09:00",
    end: "2026-08-22T12:00:00+09:00",
    allDay: false,
    timezone: "Asia/Tokyo",
  },
  source: "https://example.com/fixture",
  verifiedAt: "2026-08-22",
};

describe("SupportEvent foundation", () => {
  it("requires source and verifiedAt", () => {
    assert.equal(isValidSupportEvent(baseEvent), true);
    assert.equal(isValidSupportEvent({ ...baseEvent, source: "" }), false);
    assert.equal(isValidSupportEvent({ ...baseEvent, source: undefined }), false);
    assert.equal(isValidSupportEvent({ ...baseEvent, verifiedAt: "" }), false);
    assert.equal(isValidSupportEvent({ ...baseEvent, verifiedAt: "2026-02-30" }), false);
  });

  it("accepts only a non-empty optional share callout", () => {
    assert.equal(
      isValidSupportEvent({ ...baseEvent, shareText: "応援をお願いします" }),
      true,
    );
    assert.equal(isValidSupportEvent({ ...baseEvent, shareText: "" }), false);
    assert.equal(isValidSupportEvent({ ...baseEvent, shareText: 1 }), false);
  });

  it("accepts only CTA link ids from the central links registry", () => {
    const knownLinkId = links[0]?.id;
    assert.ok(knownLinkId, "CTA registry fixture must exist");
    assert.equal(isValidSupportEvent({ ...baseEvent, ctaLinkId: knownLinkId }), true);
    assert.equal(
      isValidSupportEvent({ ...baseEvent, ctaLinkId: `${knownLinkId}-typo` }),
      false,
    );
    assert.equal(isValidSupportEvent({ ...baseEvent, ctaLinkId: "deleted-link" }), false);
  });

  it("keeps support event ids unique", () => {
    assert.equal(
      new Set(supportEvents.map(({ id }) => id)).size,
      supportEvents.length,
    );
  });

  it("validates confirmed periods and requires a real end at or after start", () => {
    assert.equal(isValidSupportEventSchedule(baseEvent.schedule), true);
    assert.equal(
      isValidSupportEventSchedule({ ...baseEvent.schedule, end: undefined }),
      false,
    );
    assert.equal(
      isValidSupportEventSchedule({
        ...baseEvent.schedule,
        end: "2026-08-22T09:59:59+09:00",
      }),
      false,
    );
    assert.equal(
      isValidSupportEventSchedule({
        ...baseEvent.schedule,
        start: "2026-02-30T10:00:00+09:00",
      }),
      false,
    );
  });

  it("keeps confirmed instants lengthless", () => {
    const instant = {
      state: "confirmed-instant",
      at: "2026-08-22T12:00:00+09:00",
      allDay: false,
      timezone: "Asia/Tokyo",
    };
    assert.equal(isValidSupportEventSchedule(instant), true);
    assert.equal(isValidSupportEventSchedule({ ...instant, end: instant.at }), false);
  });

  it("keeps date-pending free of invented dates", () => {
    assert.equal(isValidSupportEventSchedule({ state: "date-pending" }), true);
    assert.equal(
      isValidSupportEventSchedule({ state: "date-pending", at: "2026-08-22" }),
      false,
    );
    assert.equal(
      isValidSupportEventSchedule({ state: "date-pending", start: "2026-08-22" }),
      false,
    );
  });

  it("rejects Activity state and current-phase copies", () => {
    for (const field of [
      "currentPhase",
      "currentRank",
      "active",
      "ongoing",
      "start",
      "end",
      "deadline",
    ]) {
      assert.equal(isValidSupportEvent({ ...baseEvent, [field]: "copied" }), false, field);
    }
  });

  it("does not duplicate schedules owned by contest or events", () => {
    const domainSpans = new Set();
    if (contest.currentPhase?.start && contest.currentPhase.end) {
      domainSpans.add(`${contest.currentPhase.start}|${contest.currentPhase.end}`);
    }
    for (const event of events) {
      if (event.endAt) domainSpans.add(`${event.startAt}|${event.endAt}`);
    }

    for (const event of supportEvents) {
      assert.equal(isValidSupportEvent(event), true, event.id);
      if (event.schedule.state === "confirmed-period") {
        assert.equal(
          domainSpans.has(`${event.schedule.start}|${event.schedule.end}`),
          false,
          event.id,
        );
      }
    }
  });
});
