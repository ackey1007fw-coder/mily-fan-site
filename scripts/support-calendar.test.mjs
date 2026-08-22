import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { news } from "../src/data/news.ts";
import { radioProgram } from "../src/data/radio.ts";
import { secondRoundStoryVideo } from "../src/data/secondRoundStoryVideo.ts";
import { stories } from "../src/data/stories.ts";
import { tiktokRadioVideo } from "../src/data/tiktokRadioVideo.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import {
  adaptContestSchedule,
  adaptFanEvents,
  adaptRadioProgram,
  adaptStreamSlots,
  buildSupportCalendar,
  displayStatus,
  liveSupportEvents,
} from "../src/lib/supportCalendar.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const now = Date.parse("2026-08-22T12:00:00+09:00");

const contestFixture = {
  contestName: "fixture contest",
  entryNumber: "fixture entry",
  entryUrl: "https://example.com/entry",
  currentPhase: {
    name: "fixture phase",
    start: "2026-08-23",
    end: "2026-08-25",
    source: "https://example.com/phase",
  },
  lastVerifiedAt: "2026-08-22",
};

function build(overrides = {}) {
  return buildSupportCalendar({
    contest: contestFixture,
    supportEvents: [],
    fanEvents: [],
    streamSlots: [],
    streamAvailability: "ok",
    includeRadio: false,
    now,
    daysAhead: 14,
    ...overrides,
  });
}

describe("Support Calendar derivation", () => {
  it("keeps ScheduleItem as a derived lib type, never stored data", async () => {
    assert.equal(existsSync(path.join(root, "src/data/schedule.ts")), false);
    const source = await readFile(path.join(root, "src/lib/supportCalendar.ts"), "utf8");
    assert.match(source, /export type ScheduleItem/);
    assert.match(source, /adaptContestSchedule\(input\.contest\)/);
  });

  it("derives MISS CIRCLE dates only from contest.currentPhase", () => {
    const result = adaptContestSchedule(contestFixture);
    assert.equal(result.pending.length, 0);
    assert.deepEqual(result.items[0].span, {
      start: contestFixture.currentPhase.start,
      end: contestFixture.currentPhase.end,
    });
    assert.equal(result.items[0].origin, "contest");
    assert.equal(result.items[0].activityId, "miss-circle");
  });

  it("keeps null contest dates off the date axis and in pending", () => {
    const result = build({
      contest: {
        ...contestFixture,
        currentPhase: { ...contestFixture.currentPhase, start: null, end: null },
      },
    });
    assert.equal(result.days.flatMap(({ items }) => items).length, 0);
    assert.deepEqual(result.pending.map(({ reason }) => reason), ["date-pending"]);
  });

  it("keeps date-pending SupportEvents out of dated days", () => {
    const result = build({
      contest: { ...contestFixture, currentPhase: null },
      supportEvents: [
        {
          id: "pending-fixture",
          activityId: "live-stream",
          kind: "stream-event",
          title: "date pending fixture",
          schedule: { state: "date-pending" },
          source: "https://example.com/pending",
          verifiedAt: "2026-08-22",
        },
      ],
    });
    assert.equal(result.days.length, 0);
    assert.equal(result.pending[0].reason, "date-pending");
  });

  it("never infers a FanEvent activity from title, venue, or kind", () => {
    const [item] = adaptFanEvents([
      {
        id: "misleading-fixture",
        title: "MISS CIRCLE RADIO SHOWROOM",
        listedAt: "2026-08-22",
        startAt: "2026-08-24T10:00:00+09:00",
        timezone: "Asia/Tokyo",
        kind: "stream",
        venue: "CAMPUS GIRLS LIVE",
        source: "https://example.com/fan-event",
      },
    ]);
    assert.equal(item.activityId, null);
    assert.equal(item.origin, "fan-event");
  });

  it("keeps ok + zero slots distinct from unavailable without hiding static items", () => {
    const empty = build({ streamSlots: [], streamAvailability: "ok" });
    const unavailable = build({
      streamSlots: [{ date: "2026-08-24", time: "20:00" }],
      streamAvailability: "unavailable",
    });
    assert.equal(empty.availability.showroomSchedule, "ok");
    assert.equal(unavailable.availability.showroomSchedule, "unavailable");
    assert.equal(
      empty.days.flatMap(({ items }) => items).filter(({ origin }) => origin === "contest")
        .length,
      1,
    );
    assert.equal(
      unavailable.days
        .flatMap(({ items }) => items)
        .filter(({ origin }) => origin === "contest").length,
      1,
    );
    assert.equal(
      unavailable.days
        .flatMap(({ items }) => items)
        .filter(({ origin }) => origin === "showroom-schedule").length,
      0,
    );
  });

  it("keeps static items during loading and omits unconfirmed SHOWROOM rows", () => {
    const result = build({
      streamSlots: [{ date: "2026-08-24", time: "20:00" }],
      streamAvailability: "loading",
    });
    assert.equal(result.availability.showroomSchedule, "loading");
    assert.ok(
      result.days
        .flatMap(({ items }) => items)
        .some(({ origin }) => origin === "contest"),
    );
    assert.equal(
      result.days
        .flatMap(({ items }) => items)
        .some(({ origin }) => origin === "showroom-schedule"),
      false,
    );
  });

  it("connects the five domain sources without copying their schedules", () => {
    const result = build({
      supportEvents: [
        {
          id: "period-fixture",
          activityId: "live-stream",
          kind: "support-campaign",
          title: "support fixture",
          schedule: {
            state: "confirmed-period",
            start: "2026-08-24",
            end: "2026-08-24",
            allDay: true,
            timezone: "Asia/Tokyo",
          },
          source: "https://example.com/support",
          verifiedAt: "2026-08-22",
        },
      ],
      fanEvents: [
        {
          id: "fan-fixture",
          title: "fan event fixture",
          listedAt: "2026-08-22",
          startAt: "2026-08-25T19:00:00+09:00",
          timezone: "Asia/Tokyo",
          kind: "appearance",
          source: "https://example.com/fan-event",
        },
      ],
      streamSlots: [{ date: "2026-08-26", time: "20:00" }],
      includeRadio: true,
      daysAhead: 8,
    });
    const items = result.days.flatMap(({ items }) => items);
    assert.deepEqual(
      new Set(items.map(({ origin }) => origin)),
      new Set([
        "contest",
        "support-event",
        "fan-event",
        "showroom-schedule",
        "radio-program",
      ]),
    );
    assert.equal(
      items.find(({ origin }) => origin === "fan-event")?.activityId,
      null,
    );
  });

  it("keeps SHOWROOM endTime null instead of inventing a duration", () => {
    const [slot] = adaptStreamSlots([
      { date: "2026-08-24", time: "20:00", note: "fixture" },
    ]);
    assert.equal(slot.origin, "showroom-schedule");
    assert.equal(slot.activityId, "live-stream");
    assert.equal(slot.endTime, null);
    assert.equal(slot.span, null);
  });

  it("derives radio occurrences from the shared program definition", () => {
    const slots = adaptRadioProgram(
      Date.parse("2026-08-22T12:00:00+09:00"),
      8,
    );
    assert.ok(slots.length > 0);
    for (const slot of slots) {
      assert.equal(slot.origin, "radio-program");
      assert.equal(slot.activityId, "radio");
      assert.equal(slot.title, radioProgram.programName);
      assert.equal(slot.startTime, radioProgram.scheduledStart);
      assert.equal(slot.endTime, radioProgram.scheduledEnd);
      assert.match(slot.note, /本人の出演時間とは限りません/);
    }
  });
});

describe("displayStatus boundaries in Asia/Tokyo", () => {
  it("uses inclusive confirmed-period boundaries", () => {
    const schedule = {
      state: "confirmed-period",
      start: "2026-08-22T10:00:00+09:00",
      end: "2026-08-22T12:00:00+09:00",
      allDay: false,
      timezone: "Asia/Tokyo",
    };
    const start = Date.parse(schedule.start);
    const end = Date.parse(schedule.end);
    assert.equal(displayStatus(schedule, start - 1), "upcoming");
    assert.equal(displayStatus(schedule, start), "live");
    assert.equal(displayStatus(schedule, end), "live");
    assert.equal(displayStatus(schedule, end + 1), "ended");
  });

  it("never creates live for a timed confirmed-instant", () => {
    const schedule = {
      state: "confirmed-instant",
      at: "2026-08-22T12:00:00+09:00",
      allDay: false,
      timezone: "Asia/Tokyo",
    };
    const at = Date.parse(schedule.at);
    assert.equal(displayStatus(schedule, at - 1), "upcoming");
    assert.equal(displayStatus(schedule, at), "ended");
    assert.equal(displayStatus(schedule, at + 1), "ended");
  });

  it("uses the JST civil day for an all-day instant", () => {
    const schedule = {
      state: "confirmed-instant",
      at: "2026-08-22",
      allDay: true,
      timezone: "Asia/Tokyo",
    };
    assert.equal(
      displayStatus(schedule, Date.parse("2026-08-21T23:59:59.999+09:00")),
      "upcoming",
    );
    assert.equal(
      displayStatus(schedule, Date.parse("2026-08-22T00:00:00+09:00")),
      "live",
    );
    assert.equal(
      displayStatus(schedule, Date.parse("2026-08-22T23:59:59.999+09:00")),
      "live",
    );
    assert.equal(
      displayStatus(schedule, Date.parse("2026-08-23T00:00:00+09:00")),
      "ended",
    );
  });

  it("removes a passed deadline from NOW", () => {
    const deadline = {
      id: "deadline-fixture",
      activityId: "miss-circle",
      kind: "deadline",
      title: "deadline fixture",
      schedule: {
        state: "confirmed-instant",
        at: "2026-08-22T12:00:00+09:00",
        allDay: false,
        timezone: "Asia/Tokyo",
      },
      source: "https://example.com/deadline",
      verifiedAt: "2026-08-22",
    };
    assert.deepEqual(liveSupportEvents([deadline], Date.parse(deadline.schedule.at)), []);
  });
});

describe("Activity media derivation", () => {
  it("includes media reached only through related STORY slugs", () => {
    const media = selectActivityMedia("miss-circle", { newsItems: [] });
    assert.ok(media.includes(secondRoundStoryVideo));
  });

  it("deduplicates one shared manifest by id and returns the canonical object", () => {
    const media = selectActivityMedia("miss-circle", {
      newsItems: [
        {
          id: "fixture-related-news",
          date: "2026-08-22",
          title: "fixture",
          body: "fixture",
          media: secondRoundStoryVideo,
          activityIds: ["miss-circle"],
        },
      ],
      storyItems: stories,
    });
    assert.equal(
      media.filter(({ id }) => id === secondRoundStoryVideo.id).length,
      1,
    );
    assert.equal(media.find(({ id }) => id === secondRoundStoryVideo.id), secondRoundStoryVideo);
  });

  it("reuses the existing TikTok manifest object for explicitly related NEWS", () => {
    const tiktokNews = news.find(({ media }) => media === tiktokRadioVideo);
    assert.ok(tiktokNews);
    const media = selectActivityMedia("radio", {
      newsItems: [{ ...tiktokNews, activityIds: ["radio"] }],
      storyItems: [],
    });
    assert.deepEqual(media, [tiktokRadioVideo]);
    assert.equal(media[0], tiktokRadioVideo);
  });
});
