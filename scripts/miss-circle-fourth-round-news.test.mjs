import assert from "node:assert/strict";
import { test } from "node:test";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";

test("fourth-round advancement has one dated, sourced NEWS record", () => {
  const items = news.filter(({ id }) => id === "2026-09-16-miss-circle-fourth-round");
  assert.equal(items.length, 1);
  const item = items[0];
  assert.equal(item.date, "2026-09-16");
  assert.deepEqual(item.activityIds, ["miss-circle"]);
  assert.equal(item.source, "https://2026.misscircle.jp/list/4");
  assert.equal(item.additionalSources[0].url, "https://2026.misscircle.jp/entry/734");
  assert.match(item.body, /9月16日に公式サイトの更新を確認/);
  assert.match(item.body, /正確な公開時刻は記載されていません/);
  assert.equal(item.sameDayOrder, undefined);
  assert.equal(item.media, undefined);
  assert.equal(item.additionalCtas, undefined);
  assert.equal(sortNewsByDateDesc(items)[0], item);
});
