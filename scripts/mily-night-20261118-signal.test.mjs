import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { DAILY_STREAM_ENTRIES, groupByBroadcastDate } from "../public/data-lab/assets/daily-archive-core.js";
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const sha256 = (path) => createHash("sha256").update(readFileSync(new URL(`../${path}`, import.meta.url))).digest("hex");

test("2026-11-18 night: API comment-log aggregate keeps viewers anonymous and wiring is intact", () => {
  const data = JSON.parse(read("public/data-lab/data/mily-night-20261118-aggregate.json"));
  const report = read("data-lab/reports/20261118-night/index.html");
  assert.equal(DAILY_STREAM_ENTRIES.filter((e) => e.file === "mily-night-20261118-aggregate.json").length, 1);
  assert.equal(data.nonOfficial, true);
  assert.equal(data.roomId, 573253);
  assert.equal(data.liveId, 23703128);
  assert.equal(data.dateJst, "2026-11-18");
  assert.equal(data.session, "night");
  assert.equal(data.finalServiceValueVerified, false);
  assert.equal(data.completeCoverageConfirmed, false);
  assert.equal(data.lastValidOnline, null);
  assert.deepEqual(data.metrics, {"stars":null,"visits":null,"comments":null,"firstVisits":null,"repeatVisits":null,"newFollows":null,"otherFree":null,"star100People":null,"recommendedCommentPeople":null});
  assert.deepEqual(data.observations.map((o) => [o.atJst, o.comments]), [
  [
    "2026-11-18T22:35:00+09:00",
    29
  ],
  [
    "2026-11-18T22:40:00+09:00",
    71
  ],
  [
    "2026-11-18T22:45:00+09:00",
    126
  ],
  [
    "2026-11-18T22:50:00+09:00",
    175
  ],
  [
    "2026-11-18T22:55:00+09:00",
    210
  ],
  [
    "2026-11-18T23:00:00+09:00",
    246
  ],
  [
    "2026-11-18T23:05:00+09:00",
    304
  ],
  [
    "2026-11-18T23:10:00+09:00",
    365
  ],
  [
    "2026-11-18T23:15:00+09:00",
    411
  ],
  [
    "2026-11-18T23:20:00+09:00",
    478
  ]
]);
  assert.ok(data.observations.every((o) => o.stars === null && o.visits === null));
  assert.deepEqual(data.finalObservedCommentCount, {
  "atJst": "2026-11-18T23:21:12+09:00",
  "comments": 495
});
  assert.deepEqual(data.commentLog, {
  "rawRows": 596,
  "duplicatesRemoved": 101,
  "uniqueComments": 495,
  "uniquePosters": 39,
  "countComments": 0,
  "lastCommentAtJst": "2026-11-18T23:21:12+09:00"
});
  assert.deepEqual(data.giftLog, {
  "entries": 69,
  "totalItems": 517,
  "lastGiftAtJst": "2026-11-18T23:20:51+09:00"
});
  assert.deepEqual(data.growthBySlot, [
  {
    "fromJst": "22:35:00",
    "toJst": "22:40:00",
    "commentsAdded": 42
  },
  {
    "fromJst": "22:40:00",
    "toJst": "22:45:00",
    "commentsAdded": 55
  },
  {
    "fromJst": "22:45:00",
    "toJst": "22:50:00",
    "commentsAdded": 49
  },
  {
    "fromJst": "22:50:00",
    "toJst": "22:55:00",
    "commentsAdded": 35
  },
  {
    "fromJst": "22:55:00",
    "toJst": "23:00:00",
    "commentsAdded": 36
  },
  {
    "fromJst": "23:00:00",
    "toJst": "23:05:00",
    "commentsAdded": 58
  },
  {
    "fromJst": "23:05:00",
    "toJst": "23:10:00",
    "commentsAdded": 61
  },
  {
    "fromJst": "23:10:00",
    "toJst": "23:15:00",
    "commentsAdded": 46
  },
  {
    "fromJst": "23:15:00",
    "toJst": "23:20:00",
    "commentsAdded": 67
  }
]);
  assert.deepEqual(data.eventPointObservations.start, {
  "at": "2026-11-18T22:30:39+09:00",
  "rank": 4,
  "points": 12644,
  "source": "room_display"
});
  assert.deepEqual(data.eventPointObservations.end, {
  "at": "2026-11-18T23:43:00+09:00",
  "rank": 4,
  "points": 28122,
  "source": "public_api_snapshot"
});
  assert.deepEqual(data.eventPointObservations.lastKnownBeforeFrame, {
  "at": "2026-11-18T10:45:00+09:00",
  "rank": 4,
  "points": 12693,
  "source": "public_api_snapshot"
});
  assert.equal(data.eventPointObservations.pointDifference.points, 15478);
  assert.equal(data.sourceIntegrity.observationsCsvSha256, sha256("public/data-lab/data/mily-night-20261118-observations.csv"));
  assert.equal(read("public/data-lab/data/mily-night-20261118-observations.csv"), "atJst,stars,visits,comments,firstVisits,repeatVisits,newFollows,otherFree,star100People,recommendedCommentPeople\n2026-11-18T22:35:00+09:00,,,29,,,,,,\n2026-11-18T22:40:00+09:00,,,71,,,,,,\n2026-11-18T22:45:00+09:00,,,126,,,,,,\n2026-11-18T22:50:00+09:00,,,175,,,,,,\n2026-11-18T22:55:00+09:00,,,210,,,,,,\n2026-11-18T23:00:00+09:00,,,246,,,,,,\n2026-11-18T23:05:00+09:00,,,304,,,,,,\n2026-11-18T23:10:00+09:00,,,365,,,,,,\n2026-11-18T23:15:00+09:00,,,411,,,,,,\n2026-11-18T23:20:00+09:00,,,478,,,,,,\n");
  for (const o of data.observations) assert.ok(report.includes(o.atJst.slice(11, 19)));
  assert.ok(!/@[A-Za-z0-9_]{3,}/.test(report));
  assert.ok(!JSON.stringify(data).includes("視聴者名"));
  assert.ok(!report.includes("ユーザーID") && !report.includes("ランキング") && !report.includes("順位表") && !report.includes("個別pt") && !report.includes("貢献度"));
  assert.deepEqual(groupByBroadcastDate().find((g) => g.date === "2026-11-18").entries.map((x) => x.slot), ["night", "morning"]);
  assert.ok(read("vite.config.ts").includes("data-lab/reports/20261118-night/index.html"));
  assert.match(read("data-lab/index.html"), /href="\/data-lab\/reports\/20261118-night\/">最新の配信レポート/);
  assert.match(read("public/data-lab/assets/daily-archive-core.js"), /night: "夜"/);
});

test("2026-11-18 night: owner-approved stream stills (b272) are wired into the report", () => {
  const report = read("data-lab/reports/20261118-night/index.html");
  const ledger = read("docs/MEDIA.md");
  const files = [
    ["mily-b272-01-20261118-night-cheeks-hands-pose.jpg", 50694, "e8f896edc5f09536e274fbb011d6c60db75de988d90c211196ef346ea86fce26"],
    ["mily-b272-02-20261118-night-waving-smile.jpg", 50531, "39a75c809207098bb7adbfaea91482ac958e569d5ce505174bcf7e3e438557b7"],
    ["mily-b272-03-20261118-night-hands-spread-big-smile.jpg", 47591, "2d52e513162a770d28452d067d43a90bc5a33f927d08b439b8794e2e0c49facf"],
    ["mily-b272-04-20261118-night-hand-forehead-smile.jpg", 51701, "9078fc026c513a5d4cc7bf63ba0a0ddf8703a4c6281433941d48b646592067af"],
    ["mily-b272-05-20261118-night-cheek-hand-profile.jpg", 46764, "a60848f397c4a60e50bb740cb345f77d72f84d3da5786ad75dd0939b318f4a16"],
    ["mily-b272-06-20261118-night-hands-open-smile.jpg", 52205, "c33b0310c31771beb3572ba5040cec9fdbdcd31ef573c7c90329d9b86e82189c"],
    ["mily-b272-07-20261118-night-cat-ears-headband.jpg", 53376, "71ac0df276e1a872f86b622268d266c10cb34fcb6b42883da53c1bbaade242d2"],
    ["mily-b272-08-20261118-night-cat-ears-mittens.jpg", 44886, "0ce6c6c5c01234bc4498bda99704df7fb030ea0c4346fa7b600d67555d102ba3"],
    ["mily-b272-09-20261118-night-cat-ears-peace.jpg", 52529, "b9658e771634168a52743fa0b68168bf15f169c4d33cefad8f76bd2e6c92fa55"],
    ["mily-b272-10-20261118-night-cat-ears-waving-goodnight.jpg", 43110, "6d6cd00ccd240ded1cd7881cb5edcbc49b19b670309de469e5382453205e4fce"],
  ];
  for (const [file, bytes, hash] of files) {
    assert.ok(report.includes(`/media/live/${file}`), file);
    assert.equal(sha256(`public/media/live/${file}`), hash, file);
    assert.ok(ledger.includes(`| public/media/live/${file} | ${bytes} | ${hash} |`), file);
  }
  const lead = report.indexOf("/media/live/mily-b272-03-20261118-night-hands-spread-big-smile.jpg");
  assert.ok(lead >= 0);
  for (const [file] of files) if (file !== "mily-b272-03-20261118-night-hands-spread-big-smile.jpg") assert.ok(report.indexOf(`/media/live/${file}`) > lead, file);
});
