import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { DAILY_STREAM_ENTRIES, groupByBroadcastDate } from "../public/data-lab/assets/daily-archive-core.js";
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const sha256 = (path) => createHash("sha256").update(readFileSync(new URL(`../${path}`, import.meta.url))).digest("hex");

test("2026-11-16 morning: API comment-log aggregate (incl. system announcements) keeps viewers anonymous and wiring is intact", () => {
  const data = JSON.parse(read("public/data-lab/data/mily-morning-20261116-aggregate.json"));
  const report = read("data-lab/reports/20261116-morning/index.html");
  assert.equal(DAILY_STREAM_ENTRIES.filter((e) => e.file === "mily-morning-20261116-aggregate.json").length, 1);
  assert.equal(data.nonOfficial, true);
  assert.equal(data.roomId, 573253);
  assert.equal(data.liveId, 23691998);
  assert.equal(data.dateJst, "2026-11-16");
  assert.equal(data.session, "morning");
  assert.equal(data.finalServiceValueVerified, false);
  assert.equal(data.completeCoverageConfirmed, false);
  assert.equal(data.lastValidOnline, null);
  assert.deepEqual(data.metrics, {"stars":null,"visits":null,"comments":null,"firstVisits":null,"repeatVisits":null,"newFollows":null,"otherFree":null,"star100People":null,"recommendedCommentPeople":null});
  assert.deepEqual(data.observations.map((o) => [o.atJst, o.comments]), [
  [
    "2026-11-16T05:55:00+09:00",
    30
  ],
  [
    "2026-11-16T06:00:00+09:00",
    82
  ],
  [
    "2026-11-16T06:05:00+09:00",
    120
  ],
  [
    "2026-11-16T06:10:00+09:00",
    186
  ],
  [
    "2026-11-16T06:15:00+09:00",
    221
  ],
  [
    "2026-11-16T06:20:00+09:00",
    285
  ],
  [
    "2026-11-16T06:25:00+09:00",
    331
  ],
  [
    "2026-11-16T06:30:00+09:00",
    377
  ],
  [
    "2026-11-16T06:35:00+09:00",
    436
  ]
]);
  assert.ok(data.observations.every((o) => o.stars === null && o.visits === null));
  assert.deepEqual(data.finalObservedCommentCount, {
  "atJst": "2026-11-16T06:37:44+09:00",
  "comments": 468
});
  assert.deepEqual(data.commentLog, {
  "rawRows": 556,
  "systemAnnouncements": 62,
  "duplicatesRemoved": 88,
  "uniqueComments": 468,
  "uniqueViewerComments": 406,
  "uniquePosters": 78,
  "countComments": 0,
  "lastCommentAtJst": "2026-11-16T06:37:44+09:00"
});
  assert.deepEqual(data.giftLog, {
  "entries": 23,
  "totalItems": 158,
  "lastGiftAtJst": "2026-11-16T06:36:28+09:00"
});
  assert.deepEqual(data.growthBySlot, [
  {
    "fromJst": "05:55:00",
    "toJst": "06:00:00",
    "commentsAdded": 52
  },
  {
    "fromJst": "06:00:00",
    "toJst": "06:05:00",
    "commentsAdded": 38
  },
  {
    "fromJst": "06:05:00",
    "toJst": "06:10:00",
    "commentsAdded": 66
  },
  {
    "fromJst": "06:10:00",
    "toJst": "06:15:00",
    "commentsAdded": 35
  },
  {
    "fromJst": "06:15:00",
    "toJst": "06:20:00",
    "commentsAdded": 64
  },
  {
    "fromJst": "06:20:00",
    "toJst": "06:25:00",
    "commentsAdded": 46
  },
  {
    "fromJst": "06:25:00",
    "toJst": "06:30:00",
    "commentsAdded": 46
  },
  {
    "fromJst": "06:30:00",
    "toJst": "06:35:00",
    "commentsAdded": 59
  }
]);
  assert.equal(data.sourceIntegrity.observationsCsvSha256, sha256("public/data-lab/data/mily-morning-20261116-observations.csv"));
  assert.equal(read("public/data-lab/data/mily-morning-20261116-observations.csv"), "atJst,stars,visits,comments,firstVisits,repeatVisits,newFollows,otherFree,star100People,recommendedCommentPeople\n2026-11-16T05:55:00+09:00,,,30,,,,,,\n2026-11-16T06:00:00+09:00,,,82,,,,,,\n2026-11-16T06:05:00+09:00,,,120,,,,,,\n2026-11-16T06:10:00+09:00,,,186,,,,,,\n2026-11-16T06:15:00+09:00,,,221,,,,,,\n2026-11-16T06:20:00+09:00,,,285,,,,,,\n2026-11-16T06:25:00+09:00,,,331,,,,,,\n2026-11-16T06:30:00+09:00,,,377,,,,,,\n2026-11-16T06:35:00+09:00,,,436,,,,,,\n");
  for (const o of data.observations) assert.ok(report.includes(o.atJst.slice(11, 19)));
  assert.ok(!/@[A-Za-z0-9_]{3,}/.test(report));
  assert.ok(!JSON.stringify(data).includes("視聴者名"));
  assert.ok(!report.includes("ユーザーID") && !report.includes("ランキング") && !report.includes("順位表") && !report.includes("個別pt") && !report.includes("貢献度"));
  assert.deepEqual(groupByBroadcastDate().find((g) => g.date === "2026-11-16").entries.map((x) => x.slot), [
  "morning"
]);
  assert.ok(read("vite.config.ts").includes("data-lab/reports/20261116-morning/index.html"));
  assert.match(read("data-lab/index.html"), /href="\/data-lab\/reports\/20261118-morning\/">最新の配信レポート/);
  assert.match(read("public/data-lab/assets/daily-archive-core.js"), /night: "夜"/);
});
