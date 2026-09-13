import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { streamRecap20260806Night } from "../src/data/streamRecap20260806Night.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const recap = streamRecap20260806Night;
const seconds = (value) => value.split(":").map(Number).reduce((n, v) => n * 60 + v, 0);

describe("2026-08-06 night private-caption audit", () => {
  it("registers the later August 6 slot before the morning recap", () => {
    assert.equal(streamRecaps.filter(({ id }) => id === recap.id).length, 1);
    const index = streamRecaps.indexOf(recap);
    assert.ok(index > streamRecaps.findIndex(({ id }) => id === "2026-08-07-day"));
    assert.ok(index < streamRecaps.findIndex(({ id }) => id === "2026-08-06-asa"));
    assert.equal(recap.dateLabel, "2026.08.06（木）");
    assert.equal(recap.broadcastLabel, "23:31頃〜 約93分");
  });

  it("keeps discussion and requests separate from confirmed performances", () => {
    assert.deepEqual(recap.songs, []);
    assert.ok(recap.highlights.some(({ title }) => title === "昼枠の歌を振り返る"));
    assert.ok(recap.timeline.some(({ label }) => label === "リクエスト曲を次枠へ持ち越し"));
  });
  it("keeps highlights, timeline, and ranking in recording order", () => {
    assert.equal(recap.highlights.length, 8);
    assert.equal(recap.timeline.length, 13);
    const highlightTimes = recap.highlights.map(({ timestamp }) => seconds(timestamp));
    const timelineTimes = recap.timeline.map(({ timestamp }) => seconds(timestamp));
    assert.deepEqual(highlightTimes, [...highlightTimes].sort((a, b) => a - b));
    assert.deepEqual(timelineTimes, [...timelineTimes].sort((a, b) => a - b));
    assert.match(recap.ranking[0], /^配信中に、13位から1位までランキング/);
  });

  it("keeps the historical next-slot notice and current schedule separate", () => {
    assert.match(recap.nextNote, /^配信時点では、次の配信を13:30頃から/);
    assert.match(recap.transcriptionNote, /自動字幕1766行/);
    assert.match(recap.transcriptionNote, /全編の手動聴取は実施していません/);
  });

  it("publishes no unapproved stills or private archive references", () => {
    assert.equal(recap.image, undefined);
    assert.equal(recap.gallery, undefined);
    assert.equal(recap.galleryZip, undefined);
    assert.doesNotMatch(JSON.stringify(recap), /drive\.google|C:\\|video_id|source\.info|ja-orig\.vtt/i);
  });
});
