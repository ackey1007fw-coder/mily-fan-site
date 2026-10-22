import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const d = JSON.parse(read("public/data-lab/data/semifinal-talent-daily-20261021.json"));
const page = read("data-lab/progress/index.html");
const listed = d.listedParticipants;
const proof = key => {
 const match = page.match(new RegExp(`data-day-proof="${key}"[^>]*>([\\s\\S]*?)</strong>`));
 assert.ok(match);
 return Number.parseFloat(match[1].replace(/<[^>]*>/g, "").replaceAll(",", ""));
};
test("daily cohort: official roster joins by room ID, not selected names or points", () => {
 assert.equal(d.targetDate, "2026-10-21"); assert.equal(d.genreId, 103);
 assert.equal(d.rosterSource.count, 35); assert.equal(d.roster.length, 35);
 assert.equal(new Set(d.roster.map(r => r.roomId)).size, 35);
 assert.equal(new Set(d.roster.map(r => r.entry)).size, 35);
 assert.equal(listed.length, 23); assert.equal(d.unlistedParticipants.length, 12);
 const combined = [...listed, ...d.unlistedParticipants];
 assert.equal(new Set(combined.map(r => r.roomId)).size, 35);
 assert.deepEqual(combined.map(r => r.roomId).sort((a,b)=>a-b), d.roster.map(r=>r.roomId).sort((a,b)=>a-b));
 for (const row of combined) assert.equal(d.roster.find(r=>r.entry===row.entry)?.roomId, row.roomId);
 assert.equal(d.mily.entry, 734); assert.equal(d.mily.roomId, 573253);
});
test("daily cohort: pagination receipts and source hashes describe the exact day", () => {
 assert.equal(d.rankingRecordsRetrieved, 240); assert.equal(d.paginationComplete, true);
 assert.deepEqual(d.rankingSources.map(r=>r.rows), [100,100,40]);
 assert.deepEqual(d.rankingSources.map(r=>r.nextPage), [2,3,0]);
 assert.equal(d.rosterSource.url, "https://2026.misscircle.jp/list/semifinal");
 for (const [i, source] of d.rankingSources.entries()) {
  const u = new URL(source.url);
  assert.equal(u.hostname, "www.showroom-live.com");
  assert.equal(u.pathname, "/api/genre_ranking/103/daily/20261021");
  assert.equal(u.searchParams.get("page"), String(i+1));
  assert.match(source.retrievedAtJst, /^2026-10-22T14:57:1[78].*\+09:00$/);
  assert.match(source.sha256, /^[a-f0-9]{64}$/);
 }
 assert.match(d.rosterSource.sha256, /^[a-f0-9]{64}$/);
});
test("daily cohort: subset rank and median arithmetic agree with all listed rows", () => {
 for (const row of listed) {
  assert.ok(Number.isSafeInteger(row.points) && row.points>=0);
  assert.equal(row.withinListedRank, 1 + listed.filter(x=>x.points>row.points).length);
 }
 assert.deepEqual(listed.map(r=>r.points), [...listed].sort((a,b)=>b.points-a.points).map(r=>r.points));
 assert.equal(d.mily.points, 30020); assert.equal(d.mily.genreRank, 35);
 assert.equal(d.mily.withinListedRank, 4);
 const median = [...listed].sort((a,b)=>a.points-b.points)[11].points;
 assert.equal(median, 10090); assert.equal(d.listedMedianPoints, median);
 assert.equal(d.milyToListedMedianRatio, Number((d.mily.points/median).toFixed(2)));
 assert.equal(proof("points"), d.mily.points); assert.equal(proof("rank"), 4);
 assert.equal(proof("median-ratio"), d.milyToListedMedianRatio);
});
test("daily cohort: every listed participant is shown on the same zero-based scale", () => {
 const matches = [...page.matchAll(/data-daily-peer-entry="(\d+)" data-daily-peer-points="(\d+)"[^>]*>(.*?)<\/div>/g)];
 assert.equal(matches.length, 23);
 assert.deepEqual(matches.map(m=>Number(m[1])), listed.map(r=>r.entry));
 for (const [i,m] of matches.entries()) {
  assert.equal(Number(m[2]), listed[i].points);
  assert.ok(Math.abs(Number(m[3].match(/width:([\d.]+)%/)[1])-listed[i].points/150000*100)<1e-6);
  assert.equal(Number(m[3].match(/<strong>([\d,]+)pt<\/strong>/)[1].replaceAll(",", "")), listed[i].points);
 }
 assert.equal((page.match(/data-peer-rank=/g)||[]).length, 9, "Historical nine-row comparison is retained separately");
});
test("daily cohort: missing participants never become zeros or an all-roster rank", () => {
 assert.ok(d.unlistedParticipants.every(r=>r.points===null));
 assert.equal(d.coverage.coversAllSemifinalists, false);
 assert.equal(d.boundaries.allSemifinalistsRank, null);
 for (const key of ["isContestRank","isLivePopularityIndex","isSpecificBroadcastTotal","equalBroadcastDuration","campaignEffectMeasured","unlistedMeansZero","dailyBoundaryTimeVerified","missingMorningCountersRecovered"]) assert.equal(d.boundaries[key], false);
 for (const phrase of ["全35人中の4位でも", "未掲載の12人", "配信時間をそろえた効率比較ではありません", "盛り上がり度とは別指標", "日間集計の境界時刻は今回確認していません", "10月22日朝の欠測を復元したデータでもありません"]) assert.ok(page.includes(phrase), phrase);
 assert.ok(page.includes('href="#daily-peers-20261021"'));
});
test("daily cohort: output remains aggregate-only and source-linked", () => {
 assert.equal(d.analysisIsOfficialContestResult, false);
 assert.equal(d.snapshotOnly, true); assert.equal(d.automaticRefresh, false);
 assert.match(page, /name="robots" content="noindex,nofollow,noarchive"/);
 assert.ok(page.includes("/data-lab/data/semifinal-talent-daily-20261021.json"));
 const text = page + JSON.stringify(d);
 assert.doesNotMatch(text, /@gmail\.com|drive\.google\.com|chatgpt\.site|C:\\Users|viewer[_-]?id|contributor[_-]?id|本人は焦|完璧主義/);
 assert.ok(listed.every(r=>!("name" in r) && !("room_name" in r)));
 for (const tag of page.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.match(tag[0], /rel="noopener noreferrer"/);
});
