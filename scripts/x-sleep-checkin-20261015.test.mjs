import assert from "node:assert/strict";
import test from "node:test";
import { news, newsDisplayMedia, sortNewsByDateDesc } from "../src/data/news.ts";

const targetId = "2026-10-15-x-sleep-check-in";
const targetUrl = "https://x.com/mily_chan36/status/2110577902387622329";

test("10月15日の本人X・睡眠の呼びかけをNEWSに1件だけ掲載", () => {
  const matches = news.filter((item) => item.id === targetId || item.source === targetUrl);
  assert.equal(matches.length, 1, "同じX投稿をNEWSで重複させない");
  const item = matches[0];

  assert.equal(item.id, targetId);
  assert.equal(item.date, "2026-10-15");
  assert.equal(item.sameDayOrder, 1245, "元投稿の12:45 JSTを同日順に利用する");
  assert.equal(item.source, targetUrl);
  assert.equal(item.sourceLabel, "みりぃ本人のX投稿を見る");
  assert.match(item.title, /睡眠時間確保/);
  assert.match(item.body, /10月15日12:45（日本時間）/);
  assert.match(item.body, /人生初めてレベルのオール/);
  assert.match(item.body, /プルプル/);
  assert.equal(item.message?.text, "一緒に睡眠時間確保しようね🥺🥺🥺");
  assert.equal(sortNewsByDateDesc(news)[0]?.id, targetId, "最新の本人X投稿を先頭に置く");
});

test("写真のない本人X投稿には別日の素材を流用しない", () => {
  const item = news.find((entry) => entry.id === targetId);
  assert.ok(item);
  assert.equal(item.media, undefined);
  assert.equal(item.additionalMedia, undefined);
  assert.equal(item.xEmbed, undefined, "動画用のXプレーヤーをテキスト投稿に流用しない");
  assert.deepEqual(newsDisplayMedia(item), []);
  assert.equal(item.activityIds, undefined, "配信・審査等の分類を推測で付けない");
});
