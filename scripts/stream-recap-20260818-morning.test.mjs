import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { streamRecap20260818Asa as recap } from "../src/data/streamRecap20260818Asa.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const seconds = (value) => value.split(":").map(Number).reduce((n, v) => n * 60 + v, 0);

describe("2026-08-18 morning newcomer-mission recap", () => {
  it("registers one recap between the same-day night and 8/17 night", () => {
    assert.equal(streamRecaps.filter(({ id }) => id === recap.id).length, 1);
    assert.equal(recap.date, "2026-08-18");
    assert.equal(recap.broadcastLabel, "10:52頃〜 約51分");
    const current = streamRecaps.findIndex(({ id }) => id === recap.id);
    const sameDayNight = streamRecaps.findIndex(({ id }) => id === "2026-08-18-night");
    const older = streamRecaps.findIndex(({ id }) => id === "2026-08-17-night-showroom");
    assert.ok(sameDayNight >= 0 && current > sameDayNight && older > current);
  });

  it("keeps only facts confirmed by the saved caption audit", () => {
    assert.equal(recap.highlights.length, 8);
    assert.equal(recap.timeline.length, 15);
    assert.equal(recap.goals.length, 0);
    assert.equal(recap.songs, undefined);
    assert.deepEqual(recap.ranking, [
      "配信終了時に、13位から1位までランキングを読み上げました。個人名は掲載していません。",
    ]);
  });

  it("keeps timestamps ordered and private stills unpublished", () => {
    const stamps = recap.timeline.map(({ timestamp }) => seconds(timestamp));
    assert.deepEqual(stamps, [...stamps].sort((a, b) => a - b));
    assert.equal(recap.image, undefined);
    assert.equal(recap.gallery, undefined);
    assert.equal(recap.galleryZip, undefined);
    assert.match(recap.transcriptionNote, /1115行/);
    assert.match(recap.transcriptionNote, /全編の手動聴取/);
    assert.match(recap.transcriptionNote, /静止画は掲載していません/);
    assert.doesNotMatch(recap.transcriptionNote, /未承認|準備済み|掲載確認用/);
  });

  it("does not expose private file references, source ids, or local paths", () => {
    const text = JSON.stringify(recap);
    assert.doesNotMatch(text, /\.json3|C:\\\\|drive\.google|youtube\.com\/watch\?v=/i);
  });
});
