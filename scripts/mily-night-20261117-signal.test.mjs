import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { DAILY_STREAM_ENTRIES, groupByBroadcastDate } from "../public/data-lab/assets/daily-archive-core.js";
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const sha256 = (path) => createHash("sha256").update(readFileSync(new URL(`../${path}`, import.meta.url))).digest("hex");

test("2026-11-17 night: API comment-log aggregate (captured until 22:32) keeps viewers anonymous and wiring is intact", () => {
  const data = JSON.parse(read("public/data-lab/data/mily-night-20261117-aggregate.json"));
  const report = read("data-lab/reports/20261117-night/index.html");
  assert.equal(DAILY_STREAM_ENTRIES.filter((e) => e.file === "mily-night-20261117-aggregate.json").length, 1);
  assert.equal(data.nonOfficial, true);
  assert.equal(data.roomId, 573253);
  assert.equal(data.liveId, 23698513);
  assert.equal(data.dateJst, "2026-11-17");
  assert.equal(data.session, "night");
  assert.equal(data.finalServiceValueVerified, false);
  assert.equal(data.completeCoverageConfirmed, false);
  assert.equal(data.lastValidOnline, null);
  assert.deepEqual(data.metrics, {"stars":null,"visits":null,"comments":null,"firstVisits":null,"repeatVisits":null,"newFollows":null,"otherFree":null,"star100People":null,"recommendedCommentPeople":null});
  assert.deepEqual(data.observations.map((o) => [o.atJst, o.comments]), [
  [
    "2026-11-17T21:35:00+09:00",
    28
  ],
  [
    "2026-11-17T21:40:00+09:00",
    66
  ],
  [
    "2026-11-17T21:45:00+09:00",
    103
  ],
  [
    "2026-11-17T21:50:00+09:00",
    143
  ],
  [
    "2026-11-17T21:55:00+09:00",
    177
  ],
  [
    "2026-11-17T22:00:00+09:00",
    210
  ],
  [
    "2026-11-17T22:05:00+09:00",
    239
  ],
  [
    "2026-11-17T22:10:00+09:00",
    275
  ],
  [
    "2026-11-17T22:15:00+09:00",
    309
  ],
  [
    "2026-11-17T22:20:00+09:00",
    340
  ],
  [
    "2026-11-17T22:25:00+09:00",
    387
  ],
  [
    "2026-11-17T22:30:00+09:00",
    422
  ]
]);
  assert.ok(data.observations.every((o) => o.stars === null && o.visits === null));
  assert.deepEqual(data.finalObservedCommentCount, {
  "atJst": "2026-11-17T22:32:31+09:00",
  "comments": 459
});
  assert.deepEqual(data.commentLog, {
  "rawRows": 464,
  "duplicatesRemoved": 5,
  "uniqueComments": 459,
  "uniquePosters": 40,
  "countComments": 0,
  "lastCommentAtJst": "2026-11-17T22:32:31+09:00"
});
  assert.deepEqual(data.giftLog, {
  "entries": 23,
  "totalItems": 153,
  "lastGiftAtJst": "2026-11-17T22:26:51+09:00"
});
  assert.deepEqual(data.growthBySlot, [
  {
    "fromJst": "21:35:00",
    "toJst": "21:40:00",
    "commentsAdded": 38
  },
  {
    "fromJst": "21:40:00",
    "toJst": "21:45:00",
    "commentsAdded": 37
  },
  {
    "fromJst": "21:45:00",
    "toJst": "21:50:00",
    "commentsAdded": 40
  },
  {
    "fromJst": "21:50:00",
    "toJst": "21:55:00",
    "commentsAdded": 34
  },
  {
    "fromJst": "21:55:00",
    "toJst": "22:00:00",
    "commentsAdded": 33
  },
  {
    "fromJst": "22:00:00",
    "toJst": "22:05:00",
    "commentsAdded": 29
  },
  {
    "fromJst": "22:05:00",
    "toJst": "22:10:00",
    "commentsAdded": 36
  },
  {
    "fromJst": "22:10:00",
    "toJst": "22:15:00",
    "commentsAdded": 34
  },
  {
    "fromJst": "22:15:00",
    "toJst": "22:20:00",
    "commentsAdded": 31
  },
  {
    "fromJst": "22:20:00",
    "toJst": "22:25:00",
    "commentsAdded": 47
  },
  {
    "fromJst": "22:25:00",
    "toJst": "22:30:00",
    "commentsAdded": 35
  }
]);
  assert.deepEqual(data.eventPointObservations.end, {
  "at": "2026-11-17T22:52:00+09:00",
  "rank": 4,
  "points": 7683,
  "source": "room_display_after_stream",
  "note": "配信終了後のルーム表示。時刻は視聴記録による概数。"
});
  assert.deepEqual(data.eventPointObservations.afterFrameObservation, {
  "at": "2026-11-18T06:26:00+09:00",
  "rank": 4,
  "points": 7683,
  "source": "public_api_snapshot"
});
  assert.equal(data.sourceIntegrity.observationsCsvSha256, sha256("public/data-lab/data/mily-night-20261117-observations.csv"));
  assert.equal(read("public/data-lab/data/mily-night-20261117-observations.csv"), "atJst,stars,visits,comments,firstVisits,repeatVisits,newFollows,otherFree,star100People,recommendedCommentPeople\n2026-11-17T21:35:00+09:00,,,28,,,,,,\n2026-11-17T21:40:00+09:00,,,66,,,,,,\n2026-11-17T21:45:00+09:00,,,103,,,,,,\n2026-11-17T21:50:00+09:00,,,143,,,,,,\n2026-11-17T21:55:00+09:00,,,177,,,,,,\n2026-11-17T22:00:00+09:00,,,210,,,,,,\n2026-11-17T22:05:00+09:00,,,239,,,,,,\n2026-11-17T22:10:00+09:00,,,275,,,,,,\n2026-11-17T22:15:00+09:00,,,309,,,,,,\n2026-11-17T22:20:00+09:00,,,340,,,,,,\n2026-11-17T22:25:00+09:00,,,387,,,,,,\n2026-11-17T22:30:00+09:00,,,422,,,,,,\n");
  for (const o of data.observations) assert.ok(report.includes(o.atJst.slice(11, 19)));
  assert.ok(!/@[A-Za-z0-9_]{3,}/.test(report));
  assert.ok(!JSON.stringify(data).includes("視聴者名"));
  assert.ok(!report.includes("ユーザーID") && !report.includes("ランキング") && !report.includes("順位表") && !report.includes("個別pt") && !report.includes("貢献度"));
  assert.deepEqual(groupByBroadcastDate().find((g) => g.date === "2026-11-17").entries.map((x) => x.slot), [
  "night",
  "late"
]);
  assert.ok(read("vite.config.ts").includes("data-lab/reports/20261117-night/index.html"));
  assert.match(read("data-lab/index.html"), /href="\/data-lab\/reports\/20261118-night\/">最新の配信レポート/);
  assert.match(read("public/data-lab/assets/daily-archive-core.js"), /night: "夜"/);
});
