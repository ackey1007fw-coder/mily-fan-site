import assert from "node:assert/strict";
import test from "node:test";
import { news } from "../src/data/news.ts";
import { redRidingHoodNewsImages } from "../src/data/redRidingHoodPhotos.ts";

test("赤ずきんの既存NEWSからXとInstagramの両投稿を開ける", () => {
  const matching = news.filter(({ id }) => id === "2026-10-13-x-first-cosplay-red-riding-hood");
  assert.equal(matching.length, 1, "同じ写真の記事を重複させない");
  const item = matching[0];

  assert.equal(item.date, "2026-10-13", "Instagramの未確認投稿日をXの確認済み日付と混同しない");
  assert.match(item.source, /x\.com\/Mily_chan36\/status\/2109783240366288956/);
  assert.deepEqual(item.additionalSources, [{
    label: "赤ずきんと四次審査への思い（Instagram）",
    url: "https://www.instagram.com/p/DeeMBKZk67F/",
  }]);
  assert.match(item.body, /Instagramの投稿日は未確認/);
  assert.match(item.message?.text ?? "", /みりぃの下剋上はまだまだこれからです。/);
  assert.equal(item.media?.src, redRidingHoodNewsImages[0].src);
  assert.equal(item.additionalMedia?.length, 3, "既存の本人実写真4枚を維持する");
});
