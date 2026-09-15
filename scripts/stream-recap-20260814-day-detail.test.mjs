import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { streamRecap20260814Day as recap } from "../src/data/streamRecap20260814Day.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const seconds = (value) => value.split(":").map(Number).reduce((n, v) => n * 60 + v, 0);

describe("2026-08-14 day full-ASR recap detail", () => {
  it("keeps the existing slot and the two confirmed songs", () => {
    assert.equal(streamRecaps.filter(({ id }) => id === recap.id).length, 1);
    assert.equal(recap.id, "2026-08-14-day");
    assert.equal(recap.dateLabel, "2026.08.14（金）");
    assert.equal(recap.theme, "昼の歌と感謝");
    assert.equal(recap.broadcastLabel, "11:31頃〜 約59分");
    assert.deepEqual(
      recap.songs?.map(({ title, timestamp }) => [title, timestamp]),
      [
        ["愛をこめて花束を", "0:26:13"],
        ["生まれてはじめて", "0:49:47"],
      ],
    );
  });

  it("adds only ASR-confirmed editorial detail", () => {
    assert.equal(recap.highlights.length, 8);
    assert.equal(recap.timeline.length, 16);
    assert.deepEqual(recap.ranking, [
      "配信終了時に、13位から1位までランキングを読み上げました。個人名は掲載していません。",
    ]);
    assert.match(recap.summary, /2週間/);
    assert.match(recap.summary, /元気/);
    assert.match(recap.nextNote, /22:30〜23:30/);
    assert.equal(recap.verifiedAt, "2026-09-14");
  });

  it("keeps timeline ordered and unapproved stills unpublished", () => {
    const stamps = recap.timeline.map(({ timestamp }) => seconds(timestamp));
    assert.deepEqual(stamps, [...stamps].sort((a, b) => a - b));
    assert.equal(recap.image, undefined);
    assert.equal(recap.gallery, undefined);
    assert.equal(recap.galleryZip, undefined);
    assert.match(recap.transcriptionNote, /30\/30区間/);
    assert.match(recap.transcriptionNote, /966区間/);
    assert.match(recap.transcriptionNote, /全編の手動聴取は行っておらず/);
    assert.match(recap.transcriptionNote, /静止画は掲載していません/);
  });

  it("does not expose private source material or viewer identities", () => {
    const text = JSON.stringify(recap);
    assert.doesNotMatch(text, /source-audio|source-video|asr-adaptive|\.webm|C:\\\\|drive\.google/i);
    assert.doesNotMatch(text, /viewer[_ -]?name|視聴者名|コメント欄|アイコン/i);
  });
});
