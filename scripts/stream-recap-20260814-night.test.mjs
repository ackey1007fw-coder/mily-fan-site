import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { streamRecap20260814Night as recap } from "../src/data/streamRecap20260814Night.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const seconds = (value) => value.split(":").map(Number).reduce((n, v) => n * 60 + v, 0);

describe("2026-08-14 22:31 automatic-caption recap", () => {
  it("registers the night slot once before the same-day daytime slot", () => {
    assert.equal(streamRecaps.filter(({ id }) => id === recap.id).length, 1);
    assert.equal(recap.date, "2026-08-14");
    assert.equal(recap.dateLabel, "2026.08.14（金）");
    assert.equal(recap.theme, "夜の歌リクエスト相談");
    assert.equal(recap.broadcastLabel, "22:31頃〜 約60分");
    const night = streamRecaps.findIndex(({ id }) => id === recap.id);
    const day = streamRecaps.findIndex(({ id }) => id === "2026-08-14-day");
    assert.ok(night >= 0 && day >= 0 && night < day);
  });

  it("keeps only the confirmed editorial record", () => {
    assert.equal(recap.highlights.length, 8);
    assert.equal(recap.timeline.length, 14);
    assert.equal(recap.goals.length, 0);
    assert.equal(recap.songs, undefined);
    assert.deepEqual(recap.ranking, [
      "配信終了時に、13位から1位までランキングを読み上げました。個人名は掲載していません。",
    ]);
    assert.match(recap.nextNote, /11時半.*12時半/);
  });

  it("keeps the timeline ordered and leaves stills unpublished", () => {
    const stamps = recap.timeline.map(({ timestamp }) => seconds(timestamp));
    assert.deepEqual(stamps, [...stamps].sort((a, b) => a - b));
    assert.equal(recap.image, undefined);
    assert.equal(recap.gallery, undefined);
    assert.equal(recap.galleryZip, undefined);
    assert.match(recap.transcriptionNote, /1123行/);
    assert.match(recap.transcriptionNote, /1フレーズ/);
    assert.match(recap.transcriptionNote, /全編の手動聴取は行っておらず/);
    assert.match(recap.transcriptionNote, /静止画は掲載していません/);
  });

  it("does not expose private source ids or local paths", () => {
    const text = JSON.stringify(recap);
    assert.doesNotMatch(text, /source\.ja-orig|\.json3|C:\\\\|drive\.google|youtube\.com\/watch\?v=/i);
  });
});
