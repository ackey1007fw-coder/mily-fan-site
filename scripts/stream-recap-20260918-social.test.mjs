import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { streamRecaps, streamRecap20260918Asa as morning, streamRecap20260918Day as day } from "../src/data/streamRecaps.ts";
import { streamSongPosts } from "../src/data/streamSongPosts.ts";
import { approvedTalkLinks, withoutApprovedTalkLinks } from "./approved-talk-links.mjs";

const expected = [
  { recap: morning, highlight: "0:48:11", start: "0:48:11", seconds: 23.7, title: "「みりぃ」ってどういう意味？", urls: approvedTalkLinks.slice(0, 4) },
  { recap: day, highlight: "0:00:25", start: "0:01:11", seconds: 27.85, title: "はじめまして！みりぃです。", urls: approvedTalkLinks.slice(4) },
];

test("9/18朝・昼の対応する見どころに公開済み4媒体のトーク導線を1組ずつ置く", () => {
  assert.equal(approvedTalkLinks.length, 8);
  assert.equal(new Set(approvedTalkLinks).size, 8);
  for (const row of expected) {
    const found = row.recap.highlights.filter(x => x.socialClip);
    assert.equal(found.length, 1);
    assert.equal(found[0].timestamp, row.highlight);
    const clip = found[0].socialClip;
    assert.equal(clip.title, row.title);
    assert.equal(clip.sourceTimestamp, row.start);
    assert.equal(clip.durationSeconds, row.seconds);
    assert.deepEqual(clip.links.map(l => l.platform), ["youtube", "tiktok", "instagram", "x"]);
    assert.deepEqual(clip.links.map(l => l.url), row.urls);
    assert.equal(clip.src, undefined);
    assert.equal(found[0].clip, undefined);
  }
});

test("トーク投稿を歌唱台帳へ混ぜず、既存本文・スクショ・歌唱保留を保持する", () => {
  assert.equal(morning.songs[0].title, "ぼよよん行進曲");
  assert.equal(morning.songs[0].clip, undefined);
  assert.equal(day.songs, undefined);
  assert.equal(streamSongPosts.some(x => [morning.id, day.id].includes(x.recapId)), false);
  for (const { recap } of expected) {
    assert.equal(recap.gallery.length, 12);
    assert.ok(recap.gallery.includes(recap.image));
    assert.equal(recap.highlights.length, 8);
  }
  assert.ok(streamRecaps.indexOf(day) < streamRecaps.indexOf(morning));
});

test("許可済みURL以外を除外せず、SNSは新しいタブで開くリンクだけにする", async () => {
  assert.equal(withoutApprovedTalkLinks(approvedTalkLinks.join(" ")).trim(), "");
  const unknown = "https://example.com/private-source";
  assert.equal(withoutApprovedTalkLinks(unknown), unknown);
  const component = await readFile(new URL("../src/components/StreamSocialClipLinks.tsx", import.meta.url), "utf8");
  assert.match(component, /target="_blank"/);
  assert.match(component, /rel="noopener noreferrer"/);
  assert.match(component, /sourceTimestamp/);
  assert.match(component, /durationSeconds/);
  assert.doesNotMatch(component, /<iframe|<video|<img|fetch\(/);
});
