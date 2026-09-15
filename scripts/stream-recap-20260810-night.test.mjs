import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { streamRecap20260810Night as recap } from "../src/data/streamRecap20260810Night.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const seconds = (value) => value.split(":").map(Number).reduce((n, v) => n * 60 + v, 0);

describe("2026-08-10 night saved-caption recap", () => {
  it("registers the night recap in chronological position", () => {
    assert.equal(streamRecaps.filter(({ id }) => id === recap.id).length, 1);
    assert.equal(recap.date, "2026-08-10");
    assert.equal(recap.dateLabel, "2026.08.10（月）");
    assert.equal(recap.broadcastLabel, "21:00頃〜 約88分");
    const current = streamRecaps.findIndex(({ id }) => id === recap.id);
    const morning = streamRecaps.findIndex(({ id }) => id === "2026-08-10-asa-showroom");
    const older = streamRecaps.findIndex(({ id }) => id === "2026-08-09-asa-showroom");
    assert.ok(current >= 0 && morning > current && older > current);
  });

  it("keeps only facts confirmed by the saved caption audit", () => {
    assert.equal(recap.highlights.length, 8);
    assert.equal(recap.timeline.length, 11);
    assert.equal(recap.goals.length, 0);
    assert.equal(recap.songs, undefined);
    assert.deepEqual(recap.ranking, [
      "配信終了時に、13位から1位までランキングを読み上げました。個人名は掲載していません。",
    ]);
    assert.match(recap.nextNote, /翌朝6:30/);
  });

  it("keeps unapproved stills and unconfirmed singing out of public fields", () => {
    const stamps = recap.timeline.map(({ timestamp }) => seconds(timestamp));
    assert.deepEqual(stamps, [...stamps].sort((a, b) => a - b));
    assert.equal(recap.image, undefined);
    assert.equal(recap.gallery, undefined);
    assert.equal(recap.galleryZip, undefined);
    assert.match(recap.transcriptionNote, /未承認/);
    assert.match(recap.transcriptionNote, /songsには登録していません/);
  });

  it("does not expose private file references, source ids, or local paths", () => {
    const text = JSON.stringify(recap);
    assert.doesNotMatch(text, /\.json3|C:\\\\|drive\.google|youtube\.com\/watch\?v=/i);
  });
});