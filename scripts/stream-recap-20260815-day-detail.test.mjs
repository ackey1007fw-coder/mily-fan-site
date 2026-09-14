import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { streamRecap20260815Day as recap } from "../src/data/streamRecap20260815Day.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const seconds = (value) => value.split(":").map(Number).reduce((n, v) => n * 60 + v, 0);

describe("2026-08-15 day full-ASR recap detail", () => {
  it("keeps the confirmed song while expanding the existing recap", () => {
    assert.equal(streamRecaps.filter(({ id }) => id === recap.id).length, 1);
    assert.equal(recap.id, "2026-08-15-day");
    assert.equal(recap.theme, "昼の歌と最終日前の応援");
    assert.equal(recap.broadcastLabel, "11:30頃〜 約59分");
    assert.deepEqual(recap.songs?.map(({ title, timestamp }) => [title, timestamp]), [["SWEET MEMORIES", "0:47:57"]]);
  });

  it("adds only full-ASR-confirmed editorial detail", () => {
    assert.equal(recap.highlights.length, 8);
    assert.equal(recap.timeline.length, 15);
    assert.deepEqual(recap.ranking, ["配信終了時に、13位から1位までランキングを読み上げました。個人名は掲載していません。"]);
    assert.match(recap.summary, /2次審査/);
    assert.match(recap.summary, /WEB投票/);
    assert.match(recap.summary, /SWEET MEMORIES/);
    assert.match(recap.nextNote, /22:30/);
    assert.equal(recap.verifiedAt, "2026-09-15");
  });

  it("keeps the timeline ordered and private media unpublished", () => {
    const stamps = recap.timeline.map(({ timestamp }) => seconds(timestamp));
    assert.deepEqual(stamps, [...stamps].sort((a, b) => a - b));
    assert.equal(recap.image, undefined);
    assert.equal(recap.gallery, undefined);
    assert.equal(recap.galleryZip, undefined);
    assert.match(recap.transcriptionNote, /30\/30チャンク/);
    assert.match(recap.transcriptionNote, /1,086区間/);
    assert.match(recap.transcriptionNote, /全編の手動聴取は実施していません/);
  });

  it("does not expose private source material or viewer identities", () => {
    const text = JSON.stringify(recap);
    assert.doesNotMatch(text, /source-audio|source-video|asr-adaptive|\.webm|C:\\|drive\.google/i);
    assert.doesNotMatch(text, /viewer[_ -]?name|視聴者名|コメント欄|アイコン/i);
  });
});
