import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import sharp from "sharp";
import { streamRecap20261014Night } from "../src/data/streamRecap20261014Night.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const ledger = JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));

test("October 14 night stays newest and preserves missing online counters", () => {
  const recap = streamRecap20261014Night;
  assert.equal(recap.id, "2026-10-14-night-showroom");
  assert.equal(recap.date, "2026-10-14");
  assert.equal(recap.theme, "夜のお風呂上がりとハート");
  assert.equal(streamRecaps[0], recap);
  assert.equal(streamRecaps[1].id, "2026-10-14-noon-showroom");
  assert.equal(streamRecaps[2].id, "2026-10-14-morning-showroom");
  assert.equal(streamRecaps[3].id, "2026-10-13-night-showroom");
  assert.match(recap.summary, /お風呂上がり/);
  assert.equal(recap.highlights.length, 7);
  assert.equal(recap.timeline.length, 10);
  assert.deepEqual(recap.goals, []);
  assert.deepEqual(recap.ranking, []);
  assert.match(recap.transcriptionNote, /音声の実聴・全文照合は行っていません/);
  assert.match(recap.transcriptionNote, /未取得/);
  assert.match(recap.transcriptionNote, /完全収録とは断定しません/);
});

test("Ten October 14 night stills match the actual recording without viewer UI", async () => {
  const recap = streamRecap20261014Night;
  assert.equal(recap.gallery?.length, 10);
  assert.equal(recap.image, recap.gallery[6]);
  assert.match(recap.image.alt, /ハート/);
  for (const still of recap.gallery) {
    assert.match(still.src, /^\/media\/live\/mily-b222-\d{2}-20261014-night-[a-z-]+\.jpg$/);
    assert.equal(still.downloadName, still.src.split("/").at(-1));
    assert.match(still.alt, /みりぃ/);
    assert.doesNotMatch(still.alt, /視聴者|リスナー|コメント|ランキング/);
    assert.match(still.caption, /^\d+:\d{2}:\d{2}｜/);
    const bytes = readFileSync(new URL("../public" + still.src, import.meta.url));
    const meta = await sharp(bytes).metadata();
    assert.equal(meta.width, 640);
    assert.equal(meta.height, 360);
    assert.equal(meta.format, "jpeg");
    assert.equal(meta.exif, undefined, "Stills must not contain EXIF metadata");
  }
});

test("October 14 night report and ledger withhold private data and invented counts", () => {
  const recap = JSON.stringify(streamRecap20261014Night);
  for (const forbidden of [/chatgpt\.site/i, /drive\.google/i, /@gmail/i, /\.mkv/i, /viewer[_-]?id/i, /comment_text/i, /gift_log/i, /new_event_id/i]) {
    assert.doesNotMatch(recap, forbidden);
  }
  assert.match(recap, /未取得/);
  assert.ok(!recap.includes("3,866"));
  const entry = ledger.find(x => x.id === "2026-10-14-night-showroom");
  assert.ok(entry);
  assert.match(entry.originalNote, /未取得/);
  assert.equal(entry.galleryNote, streamRecap20261014Night.galleryNote);
});
