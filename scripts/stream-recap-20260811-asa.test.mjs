import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { streamRecap20260811Asa as recap } from "../src/data/streamRecap20260811Asa.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const seconds = (value) => value.split(":").map(Number).reduce((n, v) => n * 60 + v, 0);

describe("2026-08-11 morning saved-caption recap", () => {
  it("registers one morning recap in chronological position", () => {
    assert.equal(streamRecaps.filter(({ id }) => id === recap.id).length, 1);
    assert.equal(recap.date, "2026-08-11");
    assert.equal(recap.dateLabel, "2026.08.11（火）");
    assert.equal(recap.broadcastLabel, "6:33頃〜 約88分");
    const current = streamRecaps.findIndex(({ id }) => id === recap.id);
    const newer = streamRecaps.findIndex(({ id }) => id === "2026-08-14-day");
    const older = streamRecaps.findIndex(({ id }) => id === "2026-08-10-night-showroom");
    assert.ok(newer >= 0 && current > newer && older > current);
  });

  it("keeps only facts confirmed by the saved caption audit", () => {
    assert.equal(recap.highlights.length, 8);
    assert.equal(recap.timeline.length, 12);
    assert.equal(recap.goals.length, 0);
    assert.equal(recap.songs, undefined);
    assert.deepEqual(recap.ranking, [
      "配信終了時に、13位から1位までランキングを読み上げました。個人名は掲載していません。",
    ]);
    assert.match(recap.nextNote, /時刻未定/);
    assert.match(recap.nextNote, /ファンルーム/);
  });

  it("keeps unapproved stills private and captions scoped honestly", () => {
    const stamps = recap.timeline.map(({ timestamp }) => seconds(timestamp));
    assert.deepEqual(stamps, [...stamps].sort((a, b) => a - b));
    assert.equal(recap.image, undefined);
    assert.equal(recap.gallery, undefined);
    assert.equal(recap.galleryZip, undefined);
    assert.match(recap.transcriptionNote, /1,655行/);
    assert.match(recap.transcriptionNote, /全編の手動聴取/);
    assert.match(recap.transcriptionNote, /未承認/);
  });

  it("does not expose private file references, source ids, or local paths", () => {
    const text = JSON.stringify(recap);
    assert.doesNotMatch(text, /\.json3|C:\\\\|drive\.google|youtube\.com\/watch\?v=/i);
  });
});
