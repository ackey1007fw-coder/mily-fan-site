import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const dataset = JSON.parse(read("public/data-lab/data/fujiwara-support-20261017.json"));

test("Fujiwara breakdown is restricted to Mily and has a public, traceable X source", () => {
  assert.equal(dataset.official, false);
  assert.deepEqual(dataset.subject, { publicName: "三橋莉子", entry: 734 });
  assert.equal(dataset.source.url, "https://x.com/fuhito1109/status/2111415794869645818");
  assert.equal(dataset.phases.third.periodEnd, "2026-09-12");
  assert.equal(dataset.phases.fourth.periodEnd, "2026-10-12");
  assert.equal(Object.keys(dataset.phases).length, 2);
  assert.doesNotMatch(JSON.stringify(dataset), /viewer[_-]?id|contributor[_-]?id|chatgpt\.site|@gmail\.com|drive\.google\.com/i);
});

test("top 5 is inclusive of first place and three non-overlapping segments sum to total", () => {
  const cases = [
    ["third", 315052, 126101, 206151, 102843, 6058],
    ["fourth", 755120, 244495, 413760, 257981, 83379],
  ];
  for (const [phase, total, first, top5, middle, tail] of cases) {
    const row = dataset.phases[phase];
    assert.equal(row.totalPt, total);
    assert.equal(row.topOnePt, first);
    assert.equal(row.topFivePt, top5);
    assert.equal(row.ranks6to100Pt, middle);
    assert.equal(row.ranks101PlusPt, tail);
    assert.equal(top5 + middle + tail, total);
    assert.ok(first < top5, "first place is included in top five");
    for (const [field, value] of [
      ["topFiveSharePct", top5], ["ranks6to100SharePct", middle], ["ranks101PlusSharePct", tail],
    ]) {
      assert.equal(row[field], Math.round(value / total * 1000) / 10);
    }
    assert.equal(row.topOneSharePct, Math.round(first / total * 1000) / 10);
  }
  assert.equal(dataset.interpretation.changeInTotalPt, 440068);
  assert.equal(dataset.interpretation.ranks101PlusChangePt, 77321);
});

test("data lab presents an original two-period chart with attribution and stage isolation", () => {
  const page = read("data-lab/index.html");
  const css = read("public/data-lab/assets/styles.css");
  const naoka = JSON.parse(read("public/data-lab/data/naoka-20261012-update.json"));
  assert.equal(naoka.latest.srTotalPt, dataset.phases.fourth.totalPt);
  assert.match(page, /id="fujiwara-support"/);
  assert.match(page, /藤原史さん/);
  assert.match(page, /2111415794869645818/);
  assert.match(page, /fujiwara-support-20261017\.json/);
  assert.match(page, /413,760 pt（54\.8%）/);
  assert.match(page, /257,981 pt（34\.2%）/);
  assert.match(page, /83,379 pt（11\.0%）/);
  assert.match(page, /102,843 pt（32\.6%）/);
  assert.match(page, /三次審査/);
  assert.match(page, /四次審査/);
  assert.match(page, /noindex,nofollow,noarchive/);
  assert.match(css, /\.fujiwara-stats\{/);
  assert.match(css, /@media\(max-width:780px\)/);
  assert.doesNotMatch(page, /viewer[_-]?id|contributor[_-]?id|private[_-]?recording|chatgpt\.site|drive\.google\.com/i);
});
