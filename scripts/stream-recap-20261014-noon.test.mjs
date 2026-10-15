import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import sharp from "sharp";
import { streamRecap20261014Noon } from "../src/data/streamRecap20261014Noon.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

test("October 14 noon recap uses original visual evidence without inventing a transcript",()=>{
  const recap=streamRecap20261014Noon;
  assert.equal(recap.date,"2026-10-14");
  assert.equal(recap.id,"2026-10-14-noon-showroom");
  assert.equal(recap.theme,"昼の笑顔とピース");
  assert.equal(recap.broadcastLabel,"録画開始12:19頃〜 約105分");
  assert.equal(recap.platformLabel,"SHOWROOM");
  assert.equal(streamRecaps[0].id,"2026-10-15-morning-showroom");
  assert.equal(streamRecaps[2],recap);
  assert.equal(streamRecaps[3].id,"2026-10-14-morning-showroom");
  assert.equal(streamRecaps[4].id,"2026-10-13-night-showroom");
  assert.equal(recap.highlights.length,6);
  assert.deepEqual(recap.goals,[]);
  assert.deepEqual(recap.ranking,[]);
  assert.equal(recap.nextNote,"");
  assert.ok(recap.transcriptionNote.includes("音声の聞き取り・全文照合は行っていません"));
  assert.ok(recap.transcriptionNote.includes("録画先頭からの経過時間"));
  assert.ok(recap.transcriptionNote.includes("視聴者名・アバター"));
  assert.ok(recap.summary.includes("ピース"));
  assert.ok(recap.summary.includes("ウインク"));
  assert.ok(!recap.summary.includes("本人が語った"));
});
test("All eight self-hosted stills match the same 640x360 recording, preserve identity and privacy",async()=>{
  const recap=streamRecap20261014Noon;
  assert.equal(recap.gallery?.length,8);
  assert.equal(recap.image,recap.gallery[7]);
  for(const still of recap.gallery){
    assert.match(still.src,/^\/media\/live\/mily-b221-\d{2}-20261014-noon-[a-z-]+\.jpg$/);
    assert.equal(still.downloadName,still.src.split("/").at(-1));
    assert.match(still.alt,/みりぃ/);
    assert.doesNotMatch(still.alt,/視聴者|コメント|アバター|ランキング/);
    const bytes=readFileSync(new URL("../public"+still.src,import.meta.url));
    const meta=await sharp(bytes).metadata();
    assert.equal(meta.width,640);
    assert.equal(meta.height,360);
    assert.equal(meta.format,"jpeg");
    assert.equal(meta.exif,undefined,"Stills must contain no private EXIF");
  }
});
test("Analytics are public anonymous aggregates without supporter names or link to detailed Native Site",()=>{
  const recap=streamRecap20261014Noon;
  const json=JSON.stringify(recap);
  assert.doesNotMatch(json,/chatgpt\.site|drive\.google|@gmail\.com|viewer[_-]?id|comment_text|gift_log/);
  assert.ok(json.includes("13:29〜13:35頃"));
  assert.ok(json.includes("607"));
  assert.ok(recap.highlights.some(h=>h.title.includes("きら星")));
  const dataLabLink=recap.highlights.flatMap(h=>h.relatedLinks??[])[0];
  assert.equal(dataLabLink.url,"/data-lab/#noon-20261014");
});
