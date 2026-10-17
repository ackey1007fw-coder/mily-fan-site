import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { streamRecap20261016Night as recap } from "../src/data/streamRecap20261016Night.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const ledger = JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));
const lab = JSON.parse(read("public/data-lab/data/mily-night-20261016-aggregate.json"));

test("October 16 night is an independent latest article above the preserved morning and previous night", () => {
  assert.equal(streamRecaps[0], recap);
  assert.deepEqual(streamRecaps.slice(0, 4).map(x => x.id), [
    "2026-10-16-night-showroom", "2026-10-16-morning-showroom",
    "2026-10-15-night-showroom", "2026-10-15-morning-showroom",
  ]);
  assert.equal(streamRecaps.filter(x => x.id === recap.id).length, 1);
  assert.equal(recap.dateLabel, "2026.10.16（金）");
  assert.equal(recap.broadcastLabel, "録画開始21:49頃〜 約67分");
  assert.equal(recap.verifiedAt, "2026-10-17");
});

test("the article preserves ASR uncertainty, historical schedules and the separate measurements", () => {
  assert.equal(lab.live_id, 23562541);
  assert.equal(lab.observed_screen.confirmed_final, false);
  assert.ok(recap.highlights.some(x => x.relatedLinks?.some(link => link.url === "/data-lab/#night-20261016")));
  assert.doesNotMatch(JSON.stringify(recap), /2,858|2858|\b329\b/);
  for (const text of ["全編の手動聴取は行っておらず", "完全収録は未確定", "203処理チャンク", "厳密な同期は未確認", "配信終了時の最終値は未確定", "四次審査集計には加えていません"]) {
    assert.ok(recap.transcriptionNote.includes(text), text);
  }
  const labSource = read("docs/DATA-LAB.md").split("## 2026-10-16 夜配信")[1].split("\n## ")[0];
  assert.equal(labSource.match(/ASR(\d+)処理行/)[1], recap.transcriptionNote.match(/自動文字起こし(\d+)処理チャンク/)[1]);
  assert.ok(recap.highlights.every(x => x.quote === undefined));
  assert.equal(recap.songs, undefined);
  assert.deepEqual(recap.goals, []);
  assert.match(recap.ranking[0], /^配信中にランキングを読み上げました。個人名は掲載していません。$/);
  assert.match(recap.nextNote, /^配信時点では/);
  assert.doesNotMatch(recap.nextNote, /\d{1,2}時/);
  for (const items of [recap.highlights, recap.timeline, recap.gallery.map(x => ({ timestamp: x.caption.split("｜")[0] }))]) {
    const times = items.map(x => x.timestamp.split(":").reduce((a, n) => a * 60 + Number(n), 0));
    assert.deepEqual(times, [...times].sort((a, b) => a - b));
    assert.ok(times.every(x => x < 4041.002));
  }
});

test("all eight selected recording frames decode at their declared size without metadata or substitution", async () => {
  const expected = [
    "c061d858ebdb2129212e7db21c0ed3f69835c5b69a8ca6a833fe41c3e6971a22",
    "8600cd4e377959d1415befd6dd2e5c020a0be867f35536b1b7b78aa5e93e1af9",
    "fe955ad330ca74294155e4b332c294252e05af1531024116e2cd0871210c4957",
    "7dce501f25c474c82c38b69498e370d8c0f6453ba2d0a1e24b86d3a90c3cfe2d",
    "6930ea82566b47df835b556e2d0698cd192d1c65a84cc3ec2bdfa5126b054028",
    "14ea29081622bf4a5219a47f7e05b23932bea4bab8e4844d21192a6c8fa6a3e0",
    "3cc8d66c3c20f63eb87702feba8607e349f339b94969683c16372fd3b7f9359b",
    "ba35b82f38171944520015ef0fc6d60073b88233d7094b1ed2a37984f9dbbcb5",
  ];
  assert.equal(recap.gallery.length, 8);
  assert.equal(recap.image, recap.gallery[4]);
  assert.equal(new Set(recap.gallery.map(x => x.src)).size, 8);
  for (const [i, image] of recap.gallery.entries()) {
    const bytes = readFileSync(new URL("../public" + image.src, import.meta.url));
    const meta = await sharp(bytes).metadata();
    assert.equal(meta.width, image.width);
    assert.equal(meta.height, image.height);
    assert.equal(meta.width, 640);
    assert.equal(meta.height, 360);
    assert.equal(meta.format, "jpeg");
    assert.equal(meta.exif, undefined);
    assert.equal(meta.xmp, undefined);
    await sharp(bytes).raw().toBuffer();
    assert.equal(createHash("sha256").update(bytes).digest("hex"), expected[i]);
    assert.equal(image.downloadName, image.src.split("/").at(-1));
  }
});

test("the verification record exactly matches the public recap while raw material stays private", () => {
  const entry = ledger.find(x => x.id === recap.id);
  assert.equal(ledger[0], entry);
  assert.equal(ledger.filter(x => x.id === recap.id).length, 1);
  assert.equal(entry.source, recap.sourceLabel);
  assert.equal(entry.originalNote, recap.transcriptionNote);
  assert.deepEqual(entry.display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
  assert.match(entry.processingNote, /背景の付箋.*文字/);
  assert.match(entry.processingNote, /顔.*加工.*なし/);
  for (const re of [/drive\.google/i, /@gmail/i, /[A-Z]:\\Users\\/i, /viewer[_-]?id/i, /comment[_-]?text/i, /\.mkv/i, /https?:\/\//i]) {
    assert.doesNotMatch(JSON.stringify(recap), re);
  }
});
