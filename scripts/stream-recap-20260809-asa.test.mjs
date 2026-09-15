import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { streamRecap20260809Asa as recap } from "../src/data/streamRecap20260809Asa.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const seconds = (value) => value.split(":").map(Number).reduce((n, v) => n * 60 + v, 0);

describe("2026-08-09 morning caption-audit recap", () => {
  it("registers one morning recap in chronological position", () => {
    assert.equal(streamRecaps.filter(({ id }) => id === recap.id).length, 1);
    assert.equal(recap.date, "2026-08-09");
    assert.equal(recap.dateLabel, "2026.08.09（日）");
    assert.equal(recap.broadcastLabel, "6:03頃〜 約31分");
    const current = streamRecaps.findIndex(({ id }) => id === recap.id);
    const newer = streamRecaps.findIndex(({ id }) => id === "2026-08-14-day");
    const older = streamRecaps.findIndex(({ id }) => id === "2026-08-08-shinya-guerrilla-0104");
    assert.ok(newer >= 0 && current > newer && older > current);
  });

  it("keeps only facts confirmed by the saved caption audit", () => {
    assert.equal(recap.highlights.length, 8);
    assert.equal(recap.timeline.length, 12);
    assert.equal(recap.goals.length, 0);
    assert.equal(recap.songs, undefined);
    assert.deepEqual(recap.ranking, [
      "配信中に、13位から1位までランキングを読み上げました。個人名は掲載していません。",
    ]);
    assert.match(recap.nextNote, /17時頃/);
  });

  it("keeps timestamps ordered and unapproved stills private", () => {
    const stamps = recap.timeline.map(({ timestamp }) => seconds(timestamp));
    assert.deepEqual(stamps, [...stamps].sort((a, b) => a - b));
    assert.equal(recap.image, undefined);
    assert.equal(recap.gallery, undefined);
    assert.equal(recap.galleryZip, undefined);
    assert.match(recap.transcriptionNote, /662行/);
    assert.match(recap.transcriptionNote, /全編の手動聴取は行っておらず/);
    assert.match(recap.transcriptionNote, /静止画は掲載していません。/);
    assert.doesNotMatch(recap.transcriptionNote, /未承認|承認待ち|準備済み|掲載確認用|実フレーム候補/);
  });

  it("does not expose private file references or local paths", () => {
    const text = JSON.stringify(recap);
    assert.doesNotMatch(text, /\.json3|C:\\\\|drive\.google/i);
  });
});
