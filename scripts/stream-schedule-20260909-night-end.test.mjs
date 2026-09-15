import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  slotEndMs,
  streamSchedule,
  upcomingSlots,
} from "../src/data/streamSchedule.ts";

const target = () =>
  streamSchedule.find(
    ({ date, time }) => date === "2026-09-09" && time === "21:30",
  );

describe("2026-09-09 night confirmed end time", () => {
  it("keeps the source-backed 21:30-23:00 slot", () => {
    const slot = target();
    assert.ok(slot);
    assert.equal(slot.endTime, "23:00");
    assert.equal(slotEndMs(slot), Date.parse("2026-09-09T23:00:00+09:00"));
  });

  it("keeps the slot until the confirmed end and removes it at 23:00", () => {
    const slot = target();
    assert.ok(slot);
    const justBeforeEnd = Date.parse("2026-09-09T22:59:59+09:00");
    const atEnd = Date.parse("2026-09-09T23:00:00+09:00");
    assert.equal(upcomingSlots([slot], [], justBeforeEnd).length, 1);
    assert.equal(upcomingSlots([slot], [], atEnd).length, 0);
  });
});
