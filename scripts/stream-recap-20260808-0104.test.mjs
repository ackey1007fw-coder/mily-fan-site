import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { recap0808Late as recap } from "../src/data/streamRecap0808Late.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const seconds = (value) => value.split(":").map(Number).reduce((n, v) => n * 60 + v, 0);

describe("2026-08-08 01:04 caption-audit recap", () => {
  it("registers the later same-day stream before the 00:25 slot", () => {
    assert.equal(streamRecaps.filter(({ id }) => id === recap.id).length, 1);
    assert.equal(recap.date, "2026-08-08");
    assert.equal(recap.dateLabel, "2026.08.08（土）");
    assert.equal(recap.theme, "深夜のゲリラ相談");
    assert.equal(recap.broadcastLabel, "1:04頃〜 約41分");
    const later = streamRecaps.findIndex(({ id }) => id === recap.id);
    const earlier = streamRecaps.findIndex(({ id }) => id === "2026-08-08-shinya-radio-0025");
    assert.ok(later >= 0 && earlier >= 0 && later < earlier);
  });

  it("keeps confirmed editorial content and rejects false-positive songs", () => {
    assert.equal(recap.highlights.length, 8);
    assert.equal(recap.timeline.length, 9);
    assert.equal(recap.goals.length, 0);
    assert.equal(recap.songs, undefined);
    assert.deepEqual(recap.ranking, [
      "配信中にランキングを読み上げました。個人名は掲載していません。",
    ]);
    assert.match(recap.nextNote, /11時/);
  });
  it("keeps the timeline ordered and the unapproved still unpublished", () => {
    const stamps = recap.timeline.map(({ timestamp }) => seconds(timestamp));
    assert.deepEqual(stamps, [...stamps].sort((a, b) => a - b));
    assert.equal(recap.image, undefined);
    assert.equal(recap.gallery, undefined);
    assert.equal(recap.galleryZip, undefined);
    assert.match(recap.transcriptionNote, /736行/);
    assert.match(recap.transcriptionNote, /歌唱候補2件/);
    assert.match(recap.transcriptionNote, /全編の手動聴取は行っておらず/);
    assert.match(recap.transcriptionNote, /静止画は掲載していません/);
  });

  it("does not expose private source ids or local paths", () => {
    const text = JSON.stringify(recap);
    assert.doesNotMatch(text, /6fQ7U4Z1XhM|source-audio|\.json3|C:\\\\|drive\.google/i);
    assert.doesNotMatch(text, /ボーイフレンド|奏（かなで）/);
  });
});
