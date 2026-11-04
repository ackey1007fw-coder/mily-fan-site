import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap1104Morning as recap } from "../src/data/streamRecap1104Morning.ts";
import { streamRecap1103Night as night } from "../src/data/streamRecap1103Night.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";
import unavailable from "../api/mily-b252-media-unavailable.js";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const text = JSON.stringify(recap);

test("11/4 morning: newest card above the 11/3 night, recording-relative timestamps", () => {
  assert.equal(streamRecaps[0], recap);
  assert.equal(streamRecaps[1], night);
  assert.equal(recap.id, "2026-11-04-morning-showroom");
  assert.equal(recap.dateLabel, "2026.11.04（水）");
  assert.equal(recap.broadcastLabel, "6:41頃〜 約35分");
  assert.equal(recap.timestampBasis, undefined);
  assert.match(recap.transcriptionNote, /配信全区間の収録と正式な終了時刻は確認していません/);
  assert.match(recap.transcriptionNote, /歌唱場面の動画は掲載していません/);
});

test("11/4 morning: privacy hold removes every media entry while preserving the recap", () => {
  assert.equal(recap.gallery, undefined);
  assert.equal(recap.image, undefined);
  assert.equal(recap.highlights.filter(h => h.clip || h.socialClip).length, 0);
  assert.doesNotMatch(text, /\/media\/|\.mp4|\.jpg/);
  assert.match(recap.transcriptionNote, /掲載を保留/);
  assert.match(recap.transcriptionNote, /短尺原音の視聴者名・コメント読み上げを確認/);
  assert.equal(recap.highlights.length, 8);
  assert.equal(recap.timeline.length, 13);
  assert.equal(recap.songs, undefined);
  assert.equal(recap.singingExcerpts, undefined);
});

test("11/4 morning: all 16 previously published b252 URLs have an exact privacy response", () => {
  const manifest = read("docs/MEDIA.md").split("## b251：")[0];
  const filenames = [...manifest.matchAll(/`(mily-b252-[^`]+\.(?:jpg|mp4))`/g)].map(m => m[1]);
  assert.equal(filenames.length, 16);
  const routes = JSON.parse(read("vercel.json")).rewrites;
  assert.equal(routes.length, 16);
  assert.match(JSON.parse(read("package.json")).scripts.build, /vite build && node scripts\/withhold-b252-media\.mjs$/);
  for (const name of filenames) {
    const dir = name.endsWith("mp4") ? "live-clips" : "live";
    assert.deepEqual(routes.find(r => r.source === `/media/${dir}/${name}`), {
      source: `/media/${dir}/${name}`,
      destination: "/api/mily-b252-media-unavailable",
    });
  }
});

test("11/4 morning: GET, HEAD and Range cannot return held media or cache the response", () => {
  for (const req of [{ method: "GET" }, { method: "HEAD" }, { method: "GET", headers: { range: "bytes=0-1023" } }]) {
    const headers = {};
    let body;
    const res = { setHeader: (k, v) => { headers[k] = v; }, end: value => { body = value; } };
    unavailable(req, res);
    assert.equal(res.statusCode, 410);
    for (const h of ["Cache-Control", "CDN-Cache-Control", "Vercel-CDN-Cache-Control"]) assert.equal(headers[h], "no-store");
    assert.equal(headers["X-Robots-Tag"], "noindex, nofollow, noarchive");
    if (req.method === "HEAD") assert.equal(body, undefined);
    else assert.match(body, /現在確認中/);
    assert.equal(headers["Location"], undefined);
  }
});

test("11/4 morning: no viewer names, private details, paths or raw numbers", () => {
  assert.doesNotMatch(text, /あっきー|アッキー|とくぞー|ダニー|ダニ|ちゃま|チャマ|フランク|こぶた|小豚|キサラギ|ゆうひ|ゆう子|ニコニコ|みのる|いと〜|イトー|伊藤|ネズミ|ねずみ|青猫|マコ|まこ|クッキー|夏凪|里季|教員|先生|大学|1限|会議|drive[.]google|C:\\\\Users|live_id|23642484|\.mkv|\.ts"/);
  assert.deepEqual(recap.goals, []);
  assert.match(recap.nextNote, /^配信時点/);
  const ledger = JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));
  const record = ledger.find(r => r.id === recap.id);
  assert.equal(ledger.filter(r => r.id === recap.id).length, 1);
  assert.equal(record.originalNote, recap.transcriptionNote);
  assert.deepEqual(record.display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
});
