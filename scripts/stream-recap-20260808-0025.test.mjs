import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { recap20260808Shinya as recap } from "../src/data/streamRecap0808Shinya.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const seconds = (value) => value.split(":").map(Number).reduce((n, v) => n * 60 + v, 0);

describe("2026-08-08 00:25 private-caption audit recap", () => {
  it("registers the separate late-night radio slot once", () => {
    assert.equal(streamRecaps.filter(({ id }) => id === recap.id).length, 1);
    assert.equal(recap.date, "2026-08-08");
    assert.equal(recap.dateLabel, "2026.08.08（土）");
    assert.equal(recap.theme, "深夜の相談ラジオ");
    assert.equal(recap.broadcastLabel, "0:25頃〜 約32分");
    assert.equal(recap.platformLabel, "SHOWROOM");
  });

  it("keeps only caption-confirmed editorial content", () => {
    assert.equal(recap.highlights.length, 8);
    assert.equal(recap.timeline.length, 10);
    assert.equal(recap.goals.length, 0);
    assert.deepEqual(recap.ranking, []);
    assert.equal(recap.songs, undefined);
    assert.match(recap.summary, /WEB投票/);
    assert.match(recap.nextNote, /確定していません/);
  });
  it("keeps the timeline ordered and the unapproved still unpublished", () => {
    const stamps = recap.timeline.map(({ timestamp }) => seconds(timestamp));
    assert.deepEqual(stamps, [...stamps].sort((a, b) => a - b));
    assert.equal(recap.image, undefined);
    assert.equal(recap.gallery, undefined);
    assert.equal(recap.galleryZip, undefined);
    assert.match(recap.transcriptionNote, /606行/);
    assert.match(recap.transcriptionNote, /全編の手動聴取は実施していません/);
    assert.match(recap.transcriptionNote, /静止画は掲載していません/);
  });

  it("does not expose private source ids or local paths", () => {
    const text = JSON.stringify(recap);
    assert.doesNotMatch(text, /TFjQ91r4JH0|source-360p|\.json3|C:\\\\|drive\.google/i);
    assert.doesNotMatch(text, /視聴者名|コメント欄|アイコン/);
  });
});