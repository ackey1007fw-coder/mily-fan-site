import assert from "node:assert/strict";
import { test } from "node:test";
import { news } from "../src/data/news.ts";

const SOURCE = "https://x.com/Mily_chan36/status/2115639888062345707";

test("10月29日のセミファイナル投票期間の本人X投稿を、画像なし・呼びかけなしで1件だけ掲載する", () => {
  const matching = news.filter(({ source }) => source === SOURCE);
  assert.equal(matching.length, 1);
  const item = matching[0];
  assert.equal(item.id, "2026-10-29-x-miss-circle-semifinal-period");
  assert.equal(item.date, "2026-10-29");
  assert.equal(item.sameDayOrder, 1200);
  assert.deepEqual(item.activityIds, ["miss-circle"]);
  assert.match(item.body, /投票期間は10\/29〜11\/8/);
  assert.match(item.body, /35名/);
  assert.match(item.body, /12名/);
  assert.equal(item.media, undefined);
  assert.equal(item.xEmbed, undefined);
  assert.equal(item.relatedUrl, undefined);
  assert.equal(item.additionalCtas, undefined);
  const text = [item.title, item.body, item.message?.text ?? ""].join("\n");
  assert.doesNotMatch(text, /公式|公認|清き|お願いします|投票してね|ください！/);
});
