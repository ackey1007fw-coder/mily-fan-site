import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { streamRecaps, streamRecap20260921Radio as recap, streamRecap20260920Night } from "../src/data/streamRecaps.ts";
import { approvedTalkLinks, withoutApprovedTalkLinks } from "./approved-talk-links.mjs";

test("9/21のSHOWROOMラジオ回を重複なく時系列で追加する", () => {
  assert.equal(streamRecaps.filter((r) => r.id === recap.id).length, 1);
  assert.ok(streamRecaps.indexOf(recap) >= 0);
  assert.ok(streamRecaps.indexOf(recap) < streamRecaps.indexOf(streamRecap20260920Night));
  assert.equal(recap.date, "2026-09-21");
  assert.equal(recap.dateLabel, "2026.09.21（月）");
  assert.equal(recap.platformLabel, "SHOWROOM");
  assert.equal(recap.broadcastLabel, "21:30頃〜 約36分");
  assert.match(recap.summary, /ラジオ形式/);
});

test("ラジオ回の写真を複製せず、歌唱や原録画を公開しない", () => {
  for (const key of ["image", "gallery", "galleryZip", "songs"]) assert.equal(recap[key], undefined);
  assert.ok(recap.highlights.every((h) => h.clip === undefined));
  assert.doesNotMatch(withoutApprovedTalkLinks(JSON.stringify(recap)), /https?:\/\/|live\d{6,}|PL[A-Za-z0-9_-]{10,}|C:\\\\Users\\\\/);
  assert.match(recap.transcriptionNote, /18分割/);
  assert.match(recap.transcriptionNote, /817区間/);
  assert.match(recap.transcriptionNote, /静止画は掲載していません/);
  assert.match(recap.transcriptionNote, /全編の手動聴取・逐語校正ではなく/);
  assert.match(recap.transcriptionNote, /字幕はトークの要約/);
});

test("確認済み短尺2本を4媒体ずつ案内し、歌唱リンクと混ぜない", () => {
  const clips = recap.highlights.flatMap((h) => h.socialClip ? [h.socialClip] : []);
  assert.equal(clips.length, 2);
  assert.deepEqual(clips.map((c) => c.sourceTimestamp), ["0:02:32", "0:09:25"]);
  assert.deepEqual(clips.map((c) => c.durationSeconds), [9.6, 23.1]);
  const urls = clips.flatMap((c) => c.links.map((l) => l.url));
  assert.equal(new Set(urls).size, 8);
  for (const clip of clips) {
    assert.deepEqual(clip.links.map((l) => l.platform), ["youtube", "tiktok", "instagram", "x"]);
    for (const link of clip.links) assert.ok(approvedTalkLinks.includes(link.url));
  }
  const doc = readFileSync(new URL("../docs/LIVE-TALK-POSTS-20260921.md", import.meta.url), "utf8");
  for (const url of urls) assert.ok(doc.includes(url));
  assert.match(doc, /タイトル・カバー/);
  assert.match(doc, /第三者/);
});

test("ランキング範囲と翌朝案内を当時の記録として維持する", () => {
  assert.equal(recap.ranking.length, 1);
  assert.match(recap.ranking[0], /13位から1位/);
  assert.match(recap.ranking[0], /個人名は掲載していません/);
  assert.match(recap.nextNote, /配信時点では/);
  assert.match(recap.nextNote, /翌朝/);
  assert.match(recap.nextNote, /後でファンルーム/);
  assert.match(recap.sourceLabel, /2026年9月21日 SHOWROOM夜ラジオ配信/);
});

test("SNS案内でラジオ短尺に本人の表情があると誤認させない", () => {
  const ui = readFileSync(new URL("../src/components/StreamSocialClipLinks.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(ui, /声と表情/);
  assert.match(ui, /配信のひとコマ/);
});
