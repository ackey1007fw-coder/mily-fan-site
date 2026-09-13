import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { streamRecap20260806Asa } from "../src/data/streamRecap20260806Asa.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const recap = streamRecap20260806Asa;
const seconds = (value) => value.split(":").map(Number).reduce((n, v) => n * 60 + v, 0);

describe("2026-08-06 morning archive expansion", () => {
  it("keeps the existing recap id and expands the audited text record", () => {
    assert.equal(streamRecaps.filter(({ id }) => id === recap.id).length, 1);
    assert.equal(recap.dateLabel, "2026.08.06（木）");
    assert.equal(recap.broadcastLabel, "10:02頃〜 約180分");
    assert.equal(recap.highlights.length, 8);
    assert.equal(recap.timeline.length, 13);
    assert.equal(recap.goals.length, 0);
    assert.match(recap.summary, /リコピン/);
    assert.match(recap.nextNote, /ゲリラ配信/);
  });

  it("preserves the verified song and reference karaoke without publishing a clip", () => {
    assert.equal(recap.songs.length, 1);
    const [song] = recap.songs;
    assert.equal(song.title, "かわいいだけじゃだめですか？");
    assert.equal(song.artist, "CUTIE STREET");
    assert.equal(song.timestamp, "2:22:56");
    assert.equal(song.youtubeUrl, "https://www.youtube.com/watch?v=d0rOHgzCe6s");
    assert.equal(song.karaoke?.youtubeUrl, "https://www.youtube.com/watch?v=YYGsvfQcDIg");
    assert.equal(song.clip, undefined);
  });
  it("records ranking timing and timeline positions without claiming the readout ended the stream", () => {
    assert.deepEqual(recap.ranking, [
      "配信中に、13位から1位までランキングを読み上げました。個人名は掲載していません。",
    ]);
    assert.ok(recap.timeline.every((item, index, all) => index === 0 || seconds(item.timestamp) >= seconds(all[index - 1].timestamp)));
    assert.equal(recap.timeline.find(({ label }) => label.includes("ゲリラ配信"))?.timestamp, "2:54:21");
    assert.equal(recap.timeline.find(({ label }) => label.includes("ランキング"))?.timestamp, "2:55:55");
  });

  it("keeps unapproved stills and private archive material out of the public recap", () => {
    assert.equal(recap.image, undefined);
    assert.equal(recap.gallery, undefined);
    assert.equal(recap.galleryZip, undefined);
    assert.match(recap.transcriptionNote, /静止画は掲載していません/);
    assert.match(recap.transcriptionNote, /全編の手動聴取は実施していません/);
    assert.doesNotMatch(JSON.stringify(recap), /drive\.google|Jt17kOA|\.webm|approval-stills|transcript_chunks|C:\\/i);
  });
});
