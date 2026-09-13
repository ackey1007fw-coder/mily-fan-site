import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { radioEpisodes, radioEpisode20260830, radioEpisode20260913 } from "../src/data/radioEpisodes.ts";

describe("radio recap archive", () => {
  it("retains the previous episode and lists the new broadcast first", () => {
    assert.equal(radioEpisodes[0], radioEpisode20260913);
    assert.ok(radioEpisodes.includes(radioEpisode20260830));
    assert.equal(new Set(radioEpisodes.map(({ id }) => id)).size, radioEpisodes.length);
    assert.deepEqual(radioEpisodes.map(({ date }) => date),
      radioEpisodes.map(({ date }) => date).toSorted().reverse());
  });
  it("records only the verified September 13 broadcast context", () => {
    assert.equal(radioEpisode20260913.date, "2026-09-13");
    assert.equal(radioEpisode20260913.theme, "一人○○");
    assert.ok(radioEpisode20260913.presenters.includes("みりぃ"));
    assert.match(radioEpisode20260913.transcriptionNote, /録音開始/);
    assert.doesNotMatch(JSON.stringify(radioEpisode20260913), /drive\.google|youtu\.be|youtube\.com|C:\\\\|\.ogg/);
  });
});
