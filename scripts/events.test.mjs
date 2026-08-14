import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  groupEventsByYear,
  isUpcomingEvent,
  isValidDateOnly,
  isValidDateTime,
  isValidEventTimestamp,
  parseEventInstant,
} from "../src/data/events.ts";

describe("year-agnostic event grouping", () => {
  it("keeps 2026 and later years in the same collection", () => {
    const grouped = groupEventsByYear([
      {
        id: "b",
        title: "B",
        startAt: "2027-01-10",
        timezone: "Asia/Tokyo",
        kind: "event",
        source: "https://example.com/b",
      },
      {
        id: "a",
        title: "A",
        startAt: "2026-12-01",
        timezone: "Asia/Tokyo",
        kind: "event",
        source: "https://example.com/a",
      },
      {
        id: "c",
        title: "C",
        startAt: "2028-04-02",
        timezone: "Asia/Tokyo",
        kind: "event",
        source: "https://example.com/c",
      },
    ]);

    assert.deepEqual(
      grouped.map((group) => group.year),
      [2026, 2027, 2028],
    );
    assert.equal(grouped[0].events[0].id, "a");
  });
});

describe("event timestamp parsing", () => {
  it("applies JST end-of-day only to date-only values", () => {
    const dateOnly = "2026-08-14";
    assert.equal(
      parseEventInstant(dateOnly).getTime(),
      new Date("2026-08-14T23:59:59+09:00").getTime(),
    );
  });

  it("parses datetime values as-is without concatenating T23:59:59+09:00", () => {
    const datetime = "2026-08-14T20:00:00+09:00";
    const parsed = parseEventInstant(datetime);
    assert.equal(parsed.getTime(), new Date(datetime).getTime());
    assert.equal(Number.isNaN(parsed.getTime()), false);
    assert.equal(
      Number.isNaN(new Date(`${datetime}T23:59:59+09:00`).getTime()),
      true,
    );
  });

  it("rejects calendar overflow and impossible clock values", () => {
    assert.equal(isValidDateOnly("2026-02-31"), false);
    assert.equal(isValidDateTime("2026-08-14T99:00:00+09:00"), false);
    assert.equal(isValidEventTimestamp("2026-02-31"), false);
    assert.equal(isValidEventTimestamp("2026-08-14T20:00:00+09:00"), true);
    assert.throws(() => parseEventInstant("2026-02-31"));
    assert.throws(() => parseEventInstant("2026-08-14T99:00:00+09:00"));
  });

  it("treats date-only events as upcoming through the JST end of that day", () => {
    const event = {
      id: "date-only",
      title: "Date only",
      startAt: "2026-08-14",
      timezone: "Asia/Tokyo",
      kind: "event",
      source: "https://example.com/date",
    };

    assert.equal(
      isUpcomingEvent(event, new Date("2026-08-14T22:00:00+09:00")),
      true,
    );
    assert.equal(
      isUpcomingEvent(event, new Date("2026-08-15T00:00:00+09:00")),
      false,
    );
  });

  it("uses the datetime itself as the cutoff when no endAt is set", () => {
    const event = {
      id: "datetime",
      title: "Datetime",
      startAt: "2026-08-14T20:00:00+09:00",
      timezone: "Asia/Tokyo",
      kind: "stream",
      source: "https://example.com/datetime",
    };

    assert.equal(
      isUpcomingEvent(event, new Date("2026-08-14T19:59:59+09:00")),
      true,
    );
    assert.equal(
      isUpcomingEvent(event, new Date("2026-08-14T20:00:01+09:00")),
      false,
    );
  });
});
