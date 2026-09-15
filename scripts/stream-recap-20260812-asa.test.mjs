import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { streamRecap20260812Asa as recap } from "../src/data/streamRecap20260812Asa.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const seconds = (value) => value.split(":").map(Number).reduce((n, v) => n * 60 + v, 0);

describe("2026-08-12 morning restarted-fragments recap", () => {
  it("registers one morning recap in chronological position", () => {
    assert.equal(streamRecaps.filter(({ id }) => id === recap.id).length, 1);
    assert.equal(recap.date, "2026-08-12");
    assert.equal(recap.dateLabel, "2026.08.12（水）");
    assert.equal(recap.broadcastLabel, "10:16頃〜 約31分");
    const current = streamRecaps.findIndex(({ id }) => id === recap.id);
    const newer = streamRecaps.findIndex(({ id }) => id === "2026-08-14-day");
    const older = streamRecaps.findIndex(({ id }) => id === "2026-08-11-asa-showroom");
    assert.ok(newer >= 0 && current > newer && older > current);
  });

  it("keeps only facts confirmed by the third-fragment caption audit", () => {
    assert.equal(recap.highlights.length, 8);
    assert.equal(recap.timeline.length, 10);
    assert.equal(recap.goals.length, 0);
    assert.equal(recap.songs, undefined);
    assert.deepEqual(recap.ranking, [
      "配信終了時に、13位から1位までランキングを読み上げました。個人名は掲載していません。",
    ]);
    assert.match(recap.nextNote, /夜21時/);
    assert.match(recap.nextNote, /クイズ/);
  });

  it("keeps fragment limits explicit and the unapproved still private", () => {
    const stamps = recap.timeline.map(({ timestamp }) => seconds(timestamp));
    assert.deepEqual(stamps, [...stamps].sort((a, b) => a - b));
    assert.equal(recap.image, undefined);
    assert.equal(recap.gallery, undefined);
    assert.equal(recap.galleryZip, undefined);
    assert.match(recap.transcriptionNote, /3本/);
    assert.match(recap.transcriptionNote, /最初の2本には保存字幕がない/);
    assert.match(recap.transcriptionNote, /3本目録画先頭/);
    assert.match(recap.transcriptionNote, /未承認/);
  });

  it("does not expose private file references, source ids, or local paths", () => {
    const text = JSON.stringify(recap);
    assert.doesNotMatch(text, /\.json3|C:\\\\|drive\.google|youtube\.com\/watch\?v=/i);
  });
});
