import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { radioEpisode20261115 as recap } from "../src/data/radioEpisode20261115.ts";
import { radioEpisodes } from "../src/data/radioEpisodes.ts";

describe("November 15 radio: public recap", () => {
  it("is the newest episode and keeps all times sorted within the three-hour program", () => {
    assert.equal(radioEpisodes[0], recap);
    assert.equal(recap.date, "2026-11-15");
    assert.equal(recap.theme, "成長");
    assert.ok(recap.presenters.includes("みりぃ"));
    for (const rows of [recap.milyHighlights, recap.listenerMessages, recap.timeline]) {
      const times = rows.map(({ timestamp }) => {
        assert.match(timestamp, /^\d+:[0-5]\d:[0-5]\d$/);
        return timestamp.split(":").reduce((n, part) => n * 60 + Number(part), 0);
      });
      assert.equal(new Set(times).size, times.length);
      assert.deepEqual(times, times.toSorted((a, b) => a - b));
      assert.ok(times.every((time) => time >= 0 && time < 3 * 60 * 60));
    }
  });

  it("keeps the poem and the source limits visible", () => {
    const poem = recap.milyHighlights.find(({ quote }) => quote);
    assert.equal(poem.quote, "まっすぐで\n素直な心\nまるで雪");
    assert.equal(poem.quoteNote, "音声の書き起こし");
    assert.match(recap.transcriptionNote, /自動文字起こし/);
    assert.match(recap.transcriptionNote, /全編の手動聴取・逐語校正は行っていません/);
  });

  it("publishes no recording, transcript, private path, listener name, or unposted video link", () => {
    const text = JSON.stringify(recap);
    assert.doesNotMatch(text, /libfile_|drive\.google|C:\\|\.ogg|\.wav|\.m4a|\.jsonl|\.part|@ackey|youtube\.com|youtu\.be|ラジオネーム|トマト|弟|勤務先|住所/);
    assert.equal(recap.talkVideos, undefined, "clip links are added only after they are posted");
    assert.equal(recap.aftershowPhoto, undefined);
  });
});
