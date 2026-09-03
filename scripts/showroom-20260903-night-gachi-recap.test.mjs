import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  streamRecap20260902,
  streamRecap20260902Night,
  streamRecap20260903,
  streamRecap20260903Night,
  streamRecaps,
} from "../src/data/streamRecaps.ts";
import { events } from "../src/data/events.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { news } from "../src/data/news.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const THUMB_SRC = "/media/live/mily-b53-01-surprise-choker.jpg";
const THUMB_FILE = path.join(root, "public", THUMB_SRC.slice(1));
const THUMB_SHA256 =
  "4198e825fda0ee0a6dfc5146bc4330805f0f992a5d89c3e42db808c0f6fbf2c8";
const ZIP_SRC = "/media/live/mily-b53-gachi-night-stills.zip";
const ZIP_FILE = path.join(root, "public", ZIP_SRC.slice(1));

function jpegSize(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    throw new Error("not a jpeg");
  }
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      return {
        height: (buffer[offset + 5] << 8) | buffer[offset + 6],
        width: (buffer[offset + 7] << 8) | buffer[offset + 8],
      };
    }
    const length = (buffer[offset + 2] << 8) | buffer[offset + 3];
    offset += 2 + length;
  }
  throw new Error("jpeg size not found");
}

describe("2026-09-03 SHOWROOM三次初日夜配信メモ", () => {
  it("stores the first gachi-event night recap at the top of the archive", () => {
    const recap = streamRecap20260903Night;

    assert.equal(recap.date, "2026-09-03");
    assert.equal(recap.dateLabel, "2026.09.03（木）");
    assert.equal(recap.theme, "三次初日の夜配信");
    assert.equal(recap.broadcastLabel, "23:01頃〜 約49分");
    assert.equal(recap.platformLabel, "SHOWROOM");
    assert.equal(recap.verifiedAt, "2026-09-04");
    assert.match(recap.sourceLabel, /オーナー提供/);
    assert.match(recap.summary, /フルメイク/);
    assert.match(recap.summary, /投票/);
    assert.match(recap.transcriptionNote, /録音音声・画面録画・全文文字起こしは掲載していません/);
    assert.match(recap.transcriptionNote, /10枚/);
    assert.equal(streamRecaps[0], recap);
    assert.equal(streamRecaps[1], streamRecap20260903);
    assert.equal(streamRecaps[2], streamRecap20260902Night);
    assert.equal(streamRecaps[3], streamRecap20260902);
  });

  it("keeps a concise recap and withholds ranking names", () => {
    const recap = streamRecap20260903Night;

    assert.equal(recap.highlights.length, 6);
    assert.equal(recap.goals.length, 6);
    assert.equal(recap.ranking.length, 1);
    assert.equal(recap.timeline.length, 12);
    assert.ok(recap.highlights.some(({ title }) => /投票/.test(title)));
    assert.ok(recap.highlights.some(({ title }) => /キラキラ/.test(title)));
    assert.ok(recap.highlights.some(({ title }) => /1位/.test(title)));
    assert.ok(recap.highlights.some(({ title }) => /アバター権/.test(title)));
    assert.ok(recap.highlights.some(({ title }) => /チョーカー/.test(title)));
    assert.ok(recap.highlights.some(({ title }) => /7時/.test(title)));
    assert.ok(recap.goals.some(({ item }) => item === "三次通過"));
    assert.ok(recap.goals.some(({ item }) => item === "アバター権"));
    assert.match(recap.ranking[0], /個人名は掲載していません/);
    assert.equal(
      streamRecaps.every((item) => item.ranking.length === 1),
      true,
    );

    const highlightSeconds = recap.highlights.map(({ timestamp }) => {
      const [hour, minute, second] = timestamp.split(":").map(Number);
      return hour * 3600 + minute * 60 + second;
    });
    assert.deepEqual(
      highlightSeconds,
      [...highlightSeconds].sort((left, right) => left - right),
    );

    const seconds = recap.timeline.map(({ timestamp }) => {
      const [hour, minute, second] = timestamp.split(":").map(Number);
      return hour * 3600 + minute * 60 + second;
    });
    assert.deepEqual(seconds, [...seconds].sort((left, right) => left - right));
  });
});
