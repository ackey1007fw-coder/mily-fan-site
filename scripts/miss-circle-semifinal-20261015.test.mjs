import assert from "node:assert/strict";
import test from "node:test";
import { news } from "../src/data/news.ts";
import { highlights } from "../src/data/highlights.ts";
import { activities } from "../src/data/activities.ts";

const X_URL = "https://x.com/mily_chan36/status/2110646575051747453";
const ROOM_URL = "https://www.showroom-live.com/room/fan_club?room_id=573253";

test("10月15日の本人報告をNEWSに1件だけ追加し、本人XとStoryを統合する", () => {
  const matching = news.filter(({ id }) => id === "2026-10-15-miss-circle-semifinal-advance");
  assert.equal(matching.length, 1);
  const item = matching[0];

  assert.equal(item.date, "2026-10-15");
  assert.equal(item.sameDayOrder, 1718);
  assert.deepEqual(item.activityIds, ["miss-circle"]);
  assert.equal(item.source, X_URL);
  assert.deepEqual(item.xEmbed, {
    postId: "2110646575051747453",
    sourceUrl: X_URL,
    alt: "4次審査突破とセミファイナル進出を報告するみりぃのX投稿",
  });
  assert.match(item.title, /4次審査突破.*セミファイナル進出/);
  assert.match(item.body, /Instagram Story/);
  assert.match(item.message?.text ?? "", /たくさん/);
  assert.match(item.message?.text ?? "", /次も私らしく頑張ります！/);
  assert.match(item.body, /Story自体の投稿日は確認できていません/);
  assert.match(item.body, /ファンルーム個別投稿は本文と時刻を直接照合できていない/);
  assert.equal(item.additionalCtas?.find(({ url }) => url === ROOM_URL)?.label, "本人のSHOWROOMファンルームを見る");
  assert.equal(item.additionalSources?.[0]?.url, "https://www.misscircle.jp/");
  assert.match(item.body, /10月下旬〜11月上旬（予定）/);
  assert.equal(item.media, undefined, "転載許可済みの公開派生ファイルがないため、Storyや別日写真を自己ホストしたとは装わない");
});

test("進出記録をMISS CIRCLEの歩みに追加し、従来の4次審査投稿を残す", () => {
  const result = highlights.filter(({ id }) => id === "miss-circle-2026-semifinal-advance");
  assert.equal(result.length, 1);
  assert.equal(result[0].source, X_URL);
  assert.match(result[0].title, /4次審査突破・セミファイナル進出/);

  const activity = activities.find(({ id }) => id === "miss-circle");
  assert.ok(activity?.relatedHighlightIds.includes(result[0].id));
  assert.ok(activity.relatedHighlightIds.includes("miss-circle-2026-third-round"));
  assert.ok(news.some(({ id }) => id === "2026-10-13-x-first-cosplay-red-riding-hood"));
  assert.ok(news.some(({ id }) => id === "2026-10-15-x-sleep-check-in"));
});
