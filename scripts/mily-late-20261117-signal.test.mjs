import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { DAILY_STREAM_ENTRIES, groupByBroadcastDate } from "../public/data-lab/assets/daily-archive-core.js";
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const sha256 = (path) => createHash("sha256").update(readFileSync(new URL(`../${path}`, import.meta.url))).digest("hex");

test("2026-11-17 late: API comment-log aggregate keeps viewers anonymous and wiring is intact", () => {
  const data = JSON.parse(read("public/data-lab/data/mily-late-20261117-aggregate.json"));
  const report = read("data-lab/reports/20261117-late/index.html");
  assert.equal(DAILY_STREAM_ENTRIES.filter((e) => e.file === "mily-late-20261117-aggregate.json").length, 1);
  assert.equal(data.nonOfficial, true);
  assert.equal(data.roomId, 573253);
  assert.equal(data.liveId, 23695542);
  assert.equal(data.dateJst, "2026-11-17");
  assert.equal(data.session, "late");
  assert.equal(data.finalServiceValueVerified, false);
  assert.equal(data.completeCoverageConfirmed, false);
  assert.equal(data.lastValidOnline, null);
  assert.deepEqual(data.metrics, {"stars":null,"visits":null,"comments":null,"firstVisits":null,"repeatVisits":null,"newFollows":null,"otherFree":null,"star100People":null,"recommendedCommentPeople":null});
  assert.deepEqual(data.observations.map((o) => [o.atJst, o.comments]), [
  [
    "2026-11-17T00:35:00+09:00",
    41
  ],
  [
    "2026-11-17T00:40:00+09:00",
    97
  ],
  [
    "2026-11-17T00:45:00+09:00",
    147
  ],
  [
    "2026-11-17T00:50:00+09:00",
    178
  ],
  [
    "2026-11-17T00:55:00+09:00",
    235
  ],
  [
    "2026-11-17T01:00:00+09:00",
    290
  ],
  [
    "2026-11-17T01:05:00+09:00",
    340
  ],
  [
    "2026-11-17T01:10:00+09:00",
    376
  ],
  [
    "2026-11-17T01:15:00+09:00",
    410
  ],
  [
    "2026-11-17T01:20:00+09:00",
    449
  ]
]);
  assert.ok(data.observations.every((o) => o.stars === null && o.visits === null));
  assert.deepEqual(data.finalObservedCommentCount, {
  "atJst": "2026-11-17T01:21:37+09:00",
  "comments": 461
});
  assert.deepEqual(data.commentLog, {
  "rawRows": 481,
  "duplicatesRemoved": 20,
  "uniqueComments": 461,
  "uniquePosters": 28,
  "countComments": 0,
  "lastCommentAtJst": "2026-11-17T01:21:37+09:00"
});
  assert.deepEqual(data.giftLog, {
  "entries": 13,
  "totalItems": 49,
  "lastGiftAtJst": "2026-11-17T01:21:40+09:00"
});
  assert.deepEqual(data.growthBySlot, [
  {
    "fromJst": "00:35:00",
    "toJst": "00:40:00",
    "commentsAdded": 56
  },
  {
    "fromJst": "00:40:00",
    "toJst": "00:45:00",
    "commentsAdded": 50
  },
  {
    "fromJst": "00:45:00",
    "toJst": "00:50:00",
    "commentsAdded": 31
  },
  {
    "fromJst": "00:50:00",
    "toJst": "00:55:00",
    "commentsAdded": 57
  },
  {
    "fromJst": "00:55:00",
    "toJst": "01:00:00",
    "commentsAdded": 55
  },
  {
    "fromJst": "01:00:00",
    "toJst": "01:05:00",
    "commentsAdded": 50
  },
  {
    "fromJst": "01:05:00",
    "toJst": "01:10:00",
    "commentsAdded": 36
  },
  {
    "fromJst": "01:10:00",
    "toJst": "01:15:00",
    "commentsAdded": 34
  },
  {
    "fromJst": "01:15:00",
    "toJst": "01:20:00",
    "commentsAdded": 39
  }
]);
  assert.equal(data.sourceIntegrity.observationsCsvSha256, sha256("public/data-lab/data/mily-late-20261117-observations.csv"));
  assert.equal(read("public/data-lab/data/mily-late-20261117-observations.csv"), "atJst,stars,visits,comments,firstVisits,repeatVisits,newFollows,otherFree,star100People,recommendedCommentPeople\n2026-11-17T00:35:00+09:00,,,41,,,,,,\n2026-11-17T00:40:00+09:00,,,97,,,,,,\n2026-11-17T00:45:00+09:00,,,147,,,,,,\n2026-11-17T00:50:00+09:00,,,178,,,,,,\n2026-11-17T00:55:00+09:00,,,235,,,,,,\n2026-11-17T01:00:00+09:00,,,290,,,,,,\n2026-11-17T01:05:00+09:00,,,340,,,,,,\n2026-11-17T01:10:00+09:00,,,376,,,,,,\n2026-11-17T01:15:00+09:00,,,410,,,,,,\n2026-11-17T01:20:00+09:00,,,449,,,,,,\n");
  for (const o of data.observations) assert.ok(report.includes(o.atJst.slice(11, 19)));
  assert.ok(!/@[A-Za-z0-9_]{3,}/.test(report));
  assert.ok(!JSON.stringify(data).includes("視聴者名"));
  assert.ok(!report.includes("ユーザーID") && !report.includes("ランキング") && !report.includes("順位表") && !report.includes("個別pt") && !report.includes("貢献度"));
  assert.deepEqual(groupByBroadcastDate().find((g) => g.date === "2026-11-17").entries.map((x) => x.slot), [
  "night",
  "late"
]);
  assert.ok(read("vite.config.ts").includes("data-lab/reports/20261117-late/index.html"));
  assert.match(read("data-lab/index.html"), /href="\/data-lab\/reports\/20261118-night\/">最新の配信レポート/);
  assert.match(read("public/data-lab/assets/daily-archive-core.js"), /night: "夜"/);
});

test("2026-11-17 late: owner-approved stream stills (b271) are wired into the report", () => {
  const report = read("data-lab/reports/20261117-late/index.html");
  const ledger = read("docs/MEDIA.md");
  const files = [
    ["mily-b271-01-20261117-late-hands-heart-open.jpg", 23815, "447939319db0876a694a46afa481d85e52bdd0f6c9fa9f956fa1a705ad36176a"],
    ["mily-b271-02-20261117-late-hands-heart-smile.jpg", 25283, "44500b6dd5380e9517ffcdaf0b1b61c90452bf2c39f7c1868e38fd34fc6b55b8"],
    ["mily-b271-03-20261117-late-compact-gesture.jpg", 23563, "4d1129edad89889d7cfd14ac43526e027897af00be5324d6a4dd07f91652296a"],
    ["mily-b271-04-20261117-late-hands-heart-front.jpg", 26168, "fcf6ef001dec50017d11ef88b080aa281f51b2079e5d4cd265805a18160f0c61"],
    ["mily-b271-05-20261117-late-peace-laugh.jpg", 26056, "f8b97be8831195a11341e0cd21992926e1f6c4a208aa0b3fda3572c368c5119d"],
    ["mily-b271-06-20261117-late-hands-heart-bright.jpg", 27770, "f0ea9f9f66202aa1b67ea842e3dcf1a1e305d1c19c1b5ade2bd9fa6cfb8bfb9f"],
    ["mily-b271-07-20261117-late-compact-close.jpg", 25523, "a5933e203b3f799fc1260f3a8f32dee005b04f9f61d1fdb382f334a64816cdeb"],
    ["mily-b271-08-20261117-late-hands-heart-close.jpg", 28073, "8f9ca7a7045730d767f28a4285b7596653d3c04ecdacccb3d16378fe4ef5cff3"],
    ["mily-b271-09-20261117-late-hands-heart-big-smile.jpg", 25070, "e239ceffe42869b6f15660d9732a0715fe68f9bd380b6a3860241b08c76239c2"],
    ["mily-b271-10-20261117-late-hands-heart-closing.jpg", 24112, "2d1d5e40016b30aafeb0ef9d0502edbd46188bd5d6345eab4796513ef6cb6c68"],
  ];
  for (const [file, bytes, hash] of files) {
    assert.ok(report.includes(`/media/live/${file}`), file);
    assert.equal(sha256(`public/media/live/${file}`), hash, file);
    assert.ok(ledger.includes(`| public/media/live/${file} | ${bytes} | ${hash} |`), file);
  }
  const lead = report.indexOf("/media/live/mily-b271-09-20261117-late-hands-heart-big-smile.jpg");
  assert.ok(lead >= 0);
  for (const [file] of files) if (file !== "mily-b271-09-20261117-late-hands-heart-big-smile.jpg") assert.ok(report.indexOf(`/media/live/${file}`) > lead, file);
});
