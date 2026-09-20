import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { streamRecap20260920Asa as recap, streamRecaps } from "../src/data/streamRecaps.ts";

test("9/20朝配信を最新のStreamRecapとして実素材つきで掲載する", () => {
  assert.equal(streamRecaps[0], recap);
  assert.equal(recap.date, "2026-09-20");
  assert.equal(recap.broadcastLabel, "5:30頃〜 約113分");
  assert.equal(recap.gallery.length, 10);
  assert.ok(recap.gallery.includes(recap.image));
  assert.match(recap.galleryZip.src, /mily-b134-morning-stills\.zip$/);
  assert.equal(recap.songs.length, 1);
  assert.equal(recap.songs[0].title, "weeeek");
  assert.equal(recap.songs[0].artist, "NEWS");
  assert.equal(recap.songs[0].clip, undefined);
});

test("次枠は配信時点の可能性だけを残し、第三者の事情を公開しない", async () => {
  assert.equal(recap.nextNote, "配信時点では、同日14〜15時頃に配信できる可能性があり、改めて連絡すると案内していました。");
  const ops = await readFile(new URL("../docs/CONTENT-OPS.md", import.meta.url), "utf8");
  const section = ops.split("## 2026-09-20 朝SHOWROOM配信レポート")[1].split("\n## ")[0];
  assert.match(section, /14〜15時頃/);
  assert.match(section, /改めて連絡/);
  assert.doesNotMatch(JSON.stringify(recap) + section, /友人|友達|病名|症状|体調/);
});

test("b134の全公開派生を正本の素材台帳へ登録する", async () => {
  const ledger = await readFile(new URL("../docs/MEDIA.md", import.meta.url), "utf8");
  const section = ledger.split('id="batch-b134"')[1].split("## 素材台帳（batch b135")[0];
  const clip = recap.highlights.find(row => row.clip).clip;
  const paths = [...recap.gallery.map(image => image.src), recap.galleryZip.src, clip.src, clip.poster];
  assert.equal(paths.length, 13);
  for (const path of paths) {
    const bytes = await readFile(new URL(`../public${path}`, import.meta.url));
    const row = section.split("\n").find(line => line.includes(`\`${path.slice(7)}\``));
    assert.ok(row, path);
    assert.ok(row.includes(`| ${bytes.length} |`), path);
    assert.ok(row.includes(createHash("sha256").update(bytes).digest("hex").slice(0, 12)), path);
  }
  assert.match(section, /owner-provided/);
  assert.match(section, /明示依頼/);
  assert.match(section, /原録画の再視聴・時刻の再照合は実施していない/);
});

test("公開SNSへは本人トークだけを4媒体へ案内し、歌唱動画を混ぜない", () => {
  const row = recap.highlights.find(x => x.socialClip);
  assert.ok(row);
  assert.equal(row.timestamp, "1:30:32");
  assert.equal(row.clip.durationSeconds, 16.1);
  assert.deepEqual(row.socialClip.links.map(x => x.platform), ["youtube", "tiktok", "instagram", "x"]);
  assert.equal(row.socialClip.links.length, 4);
  assert.doesNotMatch(JSON.stringify(recap), /1NNS7mXlBDE|live23450098|mily_showroom_2026/);
});
