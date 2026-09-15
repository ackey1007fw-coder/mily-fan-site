import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { streamRecap20260815Night as recap } from "../src/data/streamRecap20260815Night.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const seconds = (value) => value.split(":").map(Number).reduce((n, v) => n * 60 + v, 0);

describe("2026-08-15 night caption-audit recap", () => {
  it("registers one night recap before the same-day daytime recap", () => {
    assert.equal(streamRecaps.filter(({ id }) => id === recap.id).length, 1);
    assert.equal(recap.date, "2026-08-15");
    assert.equal(recap.dateLabel, "2026.08.15（土）");
    assert.equal(recap.broadcastLabel, "22:31頃〜 約60分");
    const current = streamRecaps.findIndex(({ id }) => id === recap.id);
    const newer = streamRecaps.findIndex(({ id }) => id === "2026-08-18-night");
    const daytime = streamRecaps.findIndex(({ id }) => id === "2026-08-15-day");
    assert.ok(newer >= 0 && current > newer && daytime > current);
  });

  it("keeps only facts confirmed by the saved caption audit", () => {
    assert.equal(recap.highlights.length, 8);
    assert.equal(recap.timeline.length, 14);
    assert.equal(recap.goals.length, 0);
    assert.equal(recap.songs, undefined);
    assert.deepEqual(recap.ranking, [
      "配信終了時に、13位から1位までランキングを読み上げました。個人名は掲載していません。",
    ]);
    assert.match(recap.nextNote, /翌朝6時/);
    assert.match(recap.nextNote, /10時から13時/);
  });

  it("keeps timestamps ordered and unpublished stills neutral", () => {
    const stamps = recap.timeline.map(({ timestamp }) => seconds(timestamp));
    assert.deepEqual(stamps, [...stamps].sort((a, b) => a - b));
    assert.equal(recap.image, undefined);
    assert.equal(recap.gallery, undefined);
    assert.equal(recap.galleryZip, undefined);
    assert.match(recap.transcriptionNote, /1,182行/);
    assert.match(recap.transcriptionNote, /全編の手動聴取/);
    assert.match(recap.transcriptionNote, /静止画は掲載していません/);
    assert.doesNotMatch(recap.transcriptionNote, /未承認|準備済み|掲載確認用/);
    assert.match(recap.transcriptionNote, /songsには登録していません/);
  });

  it("does not expose private file references, source ids, or local paths", () => {
    const text = JSON.stringify(recap);
    assert.doesNotMatch(text, /\.json3|C:\\\\|drive\.google|youtube\.com\/watch\?v=/i);
  });
});
