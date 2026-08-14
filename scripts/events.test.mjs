import assert from "node:assert/strict";
import { describe, it } from "node:test";

function eventYear(startAt) {
  return Number.parseInt(startAt.slice(0, 4), 10);
}

function groupEventsByYear(items) {
  const grouped = new Map();
  for (const item of items) {
    const year = eventYear(item.startAt);
    const bucket = grouped.get(year);
    if (bucket) bucket.push(item);
    else grouped.set(year, [item]);
  }
  return [...grouped.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, events]) => ({ year, events }));
}

describe("year-agnostic event grouping", () => {
  it("keeps 2026 and later years in the same collection", () => {
    const grouped = groupEventsByYear([
      { id: "b", startAt: "2027-01-10" },
      { id: "a", startAt: "2026-12-01" },
      { id: "c", startAt: "2028-04-02" },
    ]);

    assert.deepEqual(
      grouped.map((group) => group.year),
      [2026, 2027, 2028],
    );
    assert.equal(grouped[0].events[0].id, "a");
  });
});
