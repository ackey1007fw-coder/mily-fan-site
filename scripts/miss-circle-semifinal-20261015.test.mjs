import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { news, newsDisplayMedia } from "../src/data/news.ts";
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
  assert.match(item.body, /本人投稿2件を公開画面で確認した内容の要約/);
  assert.match(item.body, /感謝と次の審査への意気込み/);
  assert.match(item.body, /個別投稿の正確な日本時間と固定リンクは確認できない/);
  assert.equal(item.additionalCtas?.find(({ url }) => url === ROOM_URL)?.label, "本人のSHOWROOMファンルームを見る");
  assert.equal(item.additionalSources?.[0]?.url, "https://www.misscircle.jp/");
  assert.match(item.body, /審査期間は10月29日〜11月8日/);
  assert.match(item.body, /WEB投票は10月29日12:00〜11月8日23:59/);
  assert.match(item.body, /SHOWROOM審査は10月29日5:00〜11月7日21:59/);
  assert.match(item.body, /締切日が異なります/);
  assert.doesNotMatch(item.body, /10月下旬〜11月上旬|日程未確定/);
  assert.deepEqual(item.media, {
    kind: "video",
    src: "/media/gallery/mily-b224-01-semifinal-schedule-story.mp4",
    poster: "/media/gallery/mily-b224-01-semifinal-schedule-story-poster.jpg",
    width: 512,
    height: 910,
    alt: "セミファイナル審査の期間とWEB投票・SHOWROOM審査の日程が記された、音声なしの縦型告知動画",
  });
  assert.deepEqual(newsDisplayMedia(item), [item.media]);
  const mp4 = readFileSync(new URL("../public/media/gallery/mily-b224-01-semifinal-schedule-story.mp4", import.meta.url));
  const poster = readFileSync(new URL("../public/media/gallery/mily-b224-01-semifinal-schedule-story-poster.jpg", import.meta.url));
  assert.equal(createHash("sha256").update(mp4).digest("hex"), "2185d89708e31a129b92bba8ec3eeff71031ce9e5eb03199cf7ee1bcc71e4c55");
  assert.equal(createHash("sha256").update(poster).digest("hex"), "c4ea59f7a32da1c752258d0ad618d5fb0cc7b36901ebeaaf4011ceddcc219425");
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
