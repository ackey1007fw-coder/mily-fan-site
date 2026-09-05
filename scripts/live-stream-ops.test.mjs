import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

function timeInSeconds(label) {
  const match = label.match(/(\d+):(\d{2})(?::(\d{2}))?/);
  assert.ok(match, `time is missing from ${label}`);
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3] ?? 0);
}

function recapSortKey(recap) {
  return `${recap.date}T${String(timeInSeconds(recap.broadcastLabel)).padStart(5, "0")}`;
}

describe("LIVE STREAM 配信メモ共通ルール", () => {
  it("keeps every recap within the shared content contract", () => {
    assert.ok(streamRecaps.length > 0);
    assert.equal(new Set(streamRecaps.map((recap) => recap.id)).size, streamRecaps.length);

    for (const recap of streamRecaps) {
      assert.match(recap.id, /^\d{4}-\d{2}-\d{2}-.+/);
      assert.match(recap.date, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(recap.dateLabel.trim());
      assert.ok(recap.theme.trim());
      assert.ok(recap.broadcastLabel.trim());
      assert.ok(recap.platformLabel.trim());
      assert.ok(recap.summary.trim());
      assert.ok(recap.highlights.length >= 3 && recap.highlights.length <= 8);
      assert.ok(recap.goals.length <= 5);
      assert.ok(recap.timeline.length > 0);
      assert.ok(recap.nextNote.trim());
      assert.ok(recap.sourceLabel.trim());
      assert.match(recap.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(recap.transcriptionNote.trim());

      assert.ok(recap.image, `${recap.id} needs a representative still`);
      assert.ok(recap.image.width > 0 && recap.image.height > 0);
      assert.ok(recap.image.alt.trim());

      const highlightKeys = recap.highlights.map(({ timestamp, title }) => `${timestamp}:${title}`);
      assert.equal(new Set(highlightKeys).size, highlightKeys.length);
      for (const highlight of recap.highlights) {
        assert.match(highlight.timestamp, /^\d+:\d{2}:\d{2}$/);
        assert.ok(highlight.title.trim());
        assert.ok(highlight.body.trim());
      }

      if (recap.gallery) {
        assert.ok(recap.gallery.length > 0);
        assert.equal(new Set(recap.gallery.map((still) => still.src)).size, recap.gallery.length);
        for (const still of recap.gallery) {
          assert.ok(still.width > 0 && still.height > 0);
          assert.ok(still.alt.trim());
        }
      }
    }

    const order = streamRecaps.map(recapSortKey);
    assert.deepEqual(order, [...order].sort().reverse());
  });

  it("keeps the page on one shared preview/details template", async () => {
    const page = await read("src/ActivitiesPage.tsx");
    const guide = await read("docs/LIVE-STREAM-OPS.md");
    const contentOps = await read("docs/CONTENT-OPS.md");

    assert.match(page, /const STREAM_PREVIEW_HIGHLIGHTS = 3/);
    assert.match(page, /recap\.highlights\.slice\(0, STREAM_PREVIEW_HIGHLIGHTS\)/);
    assert.match(page, /recap\.highlights\.slice\(STREAM_PREVIEW_HIGHLIGHTS\)/);
    assert.match(page, /<StreamRecapArticle recap=\{recap\} \/>/);
    assert.match(page, /aspect-\[4\/3\]/);
    assert.doesNotMatch(page, /defaultOpen/);

    assert.match(guide, /一覧では全カードを閉じた状態/);
    assert.match(guide, /見どころ全体は3〜8件/);
    assert.match(contentOps, /docs\/LIVE-STREAM-OPS\.md/);
  });
});
