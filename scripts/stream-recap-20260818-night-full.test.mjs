import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { streamRecap20260818Night as recap } from "../src/data/streamRecap20260818Night.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const seconds = (value) => value.split(":").map(Number).reduce((n, v) => n * 60 + v, 0);

describe("2026-08-18 night full recap", () => {
  it("expands the existing registered song-only recap without a registry edit", () => {
    assert.equal(streamRecaps.filter(({ id }) => id === recap.id).length, 1);
    assert.equal(recap.date, "2026-08-18");
    assert.equal(recap.dateLabel, "2026.08.18（火）");
    assert.equal(recap.broadcastLabel, "22:10頃〜 約54分");
    assert.equal(recap.highlights.length, 8);
    assert.equal(recap.timeline.length, 16);
  });

  it("preserves the confirmed song routes while adding stream-wide context", () => {
    assert.equal(recap.songs?.length, 1);
    assert.equal(recap.songs?.[0]?.title, "ぼよよん行進曲");
    assert.equal(recap.songs?.[0]?.timestamp, "0:38:07");
    assert.equal(recap.songs?.[0]?.youtubeUrl, "https://www.youtube.com/watch?v=nAjJluQCSGE");
    assert.equal(recap.songs?.[0]?.karaoke?.youtubeUrl, "https://www.youtube.com/watch?v=8s8GcvwlhR8");
    assert.deepEqual(recap.ranking, [
      "配信終了時に、13位から1位までランキングを読み上げました。個人名は掲載していません。",
    ]);
    assert.match(recap.nextNote, /リハーサル後/);
  });

  it("keeps timestamps ordered and private media out of the recap", () => {
    const stamps = recap.timeline.map(({ timestamp }) => seconds(timestamp));
    assert.deepEqual(stamps, [...stamps].sort((a, b) => a - b));
    assert.equal(recap.image, undefined);
    assert.equal(recap.gallery, undefined);
    assert.equal(recap.galleryZip, undefined);
    assert.match(recap.transcriptionNote, /986行/);
    assert.match(recap.transcriptionNote, /全編の手動聴取/);
    assert.match(recap.transcriptionNote, /静止画は掲載していません/);
    assert.doesNotMatch(recap.transcriptionNote, /未承認|準備済み|掲載確認用|rights gate/i);
  });

  it("does not expose private recording, clip, or local references", () => {
    const text = JSON.stringify(recap);
    assert.doesNotMatch(text, /\.json3|C:\\\\|drive\.google|private-clips|stills-approval/i);
  });
});
