import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { streamRecap20260810Asa as recap } from "../src/data/streamRecap20260810Asa.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const seconds = (value) => value.split(":").map(Number).reduce((n, v) => n * 60 + v, 0);

describe("2026-08-10 morning split-recording recap", () => {
  it("registers one morning recap in chronological position", () => {
    assert.equal(streamRecaps.filter(({ id }) => id === recap.id).length, 1);
    assert.equal(recap.date, "2026-08-10");
    assert.equal(recap.dateLabel, "2026.08.10（月）");
    assert.equal(recap.broadcastLabel, "10:00頃〜 約32分");
    const current = streamRecaps.findIndex(({ id }) => id === recap.id);
    const newer = streamRecaps.findIndex(({ id }) => id === "2026-08-14-day");
    const older = streamRecaps.findIndex(({ id }) => id === "2026-08-09-asa-showroom");
    assert.ok(newer >= 0 && current > newer && older > current);
  });

  it("keeps only facts confirmed by the saved caption audit", () => {
    assert.equal(recap.highlights.length, 8);
    assert.equal(recap.timeline.length, 13);
    assert.equal(recap.goals.length, 0);
    assert.equal(recap.songs, undefined);
    assert.deepEqual(recap.ranking, [
      "配信終了時に、12位から1位までランキングを読み上げました。個人名は掲載していません。",
    ]);
    assert.match(recap.nextNote, /21:00/);
  });
  it("keeps the recording gap explicit and unapproved stills private", () => {
    const stamps = recap.timeline.map(({ timestamp }) => seconds(timestamp));
    assert.deepEqual(stamps, [...stamps].sort((a, b) => a - b));
    assert.equal(recap.image, undefined);
    assert.equal(recap.gallery, undefined);
    assert.equal(recap.galleryZip, undefined);
    assert.match(recap.summary, /確認できない区間/);
    assert.match(recap.transcriptionNote, /2分割録画/);
    assert.match(recap.transcriptionNote, /完全な連続録画とは扱っていません/);
    assert.match(recap.transcriptionNote, /未承認/);
  });

  it("does not expose private file references or local paths", () => {
    const text = JSON.stringify(recap);
    assert.doesNotMatch(text, /\.json3|C:\\\\|drive\.google|youtube\.com\/watch\?v=/i);
  });
});