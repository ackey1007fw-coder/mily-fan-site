import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sortNewsByDateDesc } from "../src/data/news.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("latest news ordering", () => {
  it("sorts a copy by descending date without mutating the input", () => {
    const input = [
      {
        id: "older",
        date: "2026-01-01",
        title: "古い",
        body: "old",
        source: "https://example.com/old",
      },
      {
        id: "newer",
        date: "2026-08-14",
        title: "新しい",
        body: "new",
        source: "https://example.com/new",
      },
      {
        id: "middle",
        date: "2026-05-01",
        title: "中間",
        body: "mid",
        source: "https://example.com/mid",
      },
    ];
    const originalOrder = input.map((item) => item.id);

    const sorted = sortNewsByDateDesc(input);

    assert.deepEqual(
      sorted.map((item) => item.id),
      ["newer", "middle", "older"],
    );
    assert.deepEqual(
      input.map((item) => item.id),
      originalOrder,
    );
    assert.notEqual(sorted, input);
  });
});

describe("source and url are not mixed", () => {
  it("uses required source for 出典を見る in Latest and Schedule", async () => {
    const latest = await readFile(
      path.join(root, "src/components/Latest.tsx"),
      "utf8",
    );
    const schedule = await readFile(
      path.join(root, "src/components/Schedule.tsx"),
      "utf8",
    );

    assert.match(latest, /sortNewsByDateDesc\(news\)/);
    assert.match(latest, /href=\{item\.source\}/);
    assert.match(latest, /出典を見る/);
    assert.match(latest, /関連リンク/);
    assert.doesNotMatch(latest, /href=\{item\.url\}[\s\S]{0,80}出典を見る/);

    assert.match(schedule, /href=\{item\.source\}/);
    assert.match(schedule, /出典を見る/);
    assert.match(schedule, /詳細/);
    assert.doesNotMatch(schedule, /詳細・出典/);
    assert.doesNotMatch(schedule, /href=\{item\.url\}[\s\S]{0,80}出典を見る/);
  });
});
