import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";
const load=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("10/12 Naoka update is independently attributed, near-entry only, and historic snapshots survive",()=>{
 const html=load("data-lab/index.html"),j=JSON.parse(load("public/data-lab/data/naoka-20261012-update.json"));
 const old=JSON.parse(load("public/data-lab/data/public-snapshot-20261012.json"));
 assert.equal(old.mily.forecastRank,15);assert.equal(old.mily.forecastScore,28.54);
 assert.equal(j.latest.rank,16);assert.equal(j.latest.score,27.83);assert.equal(j.latest.entry,734);
 assert.equal(j.latest.srTotalPt,755120);assert.equal(j.latest.nonPaidGrowthVsRound2Pct,201.7);
 assert.equal(j.near.length,7);assert.deepEqual(j.near.map(x=>x.rank),[13,14,15,16,17,18,19]);
 assert.equal(j.population.forecastRows,71);assert.equal(j.population.officialRosterCount,70);
 for(const key of ['id="naoka-update"','339,253','201.7%','27.83','28.54','No.734','thehillofReina'])assert.ok(html.includes(key),key);
 assert.equal((html.match(/class="naoka-bar-row/g)||[]).length,7);
 for(const s of [html,JSON.stringify(j)])assert.doesNotMatch(s,/viewer[_-]?id|@gmail\.com|drive\.google|chatgpt\.site|individualGift|private[_-]?record/i);
});
