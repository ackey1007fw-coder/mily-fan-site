import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const page = read("data-lab/progress/index.html");
const support = JSON.parse(read("public/data-lab/data/fujiwara-support-20261017.json"));
const snapshot = JSON.parse(read("public/data-lab/data/public-snapshot-20261012.json"));
const { third, fourth } = support.phases;
const proof = (key) => {
  const m = page.match(new RegExp(`data-proof="${key}"[^>]*>([\\s\\S]*?)</strong>`));
  assert.ok(m, key);
  return Number.parseFloat(m[1].replace(/<[^>]*>/g, "").replaceAll(",", ""));
};

test("progress: published growth is derived from the two original phase rows", () => {
  assert.equal(support.official, false);
  assert.equal(support.subject.entry, 734);
  assert.equal(proof("third-total"), third.totalPt);
  assert.equal(proof("fourth-total"), fourth.totalPt);
  assert.equal(proof("total-gain"), fourth.totalPt - third.totalPt);
  assert.equal(proof("total-ratio"), Number((fourth.totalPt / third.totalPt).toFixed(2)));
  assert.equal(proof("outside-ratio"), Number(((fourth.totalPt - fourth.topFivePt) / (third.totalPt - third.topFivePt)).toFixed(2)));
});

test("progress: contribution bands sum exactly, without adding the top person twice", () => {
  for (const phase of [third, fourth]) {
    assert.equal(phase.topFivePt + phase.ranks6to100Pt + phase.ranks101PlusPt, phase.totalPt);
    assert.ok(phase.topOnePt <= phase.topFivePt);
    assert.equal((Date.parse(phase.periodEnd) - Date.parse(phase.periodStart)) / 86400000 + 1, 10);
  }
  for (const field of ["topFivePt", "ranks6to100Pt", "ranks101PlusPt", "outsideTopFive"]) {
    const row = page.match(new RegExp(`data-band="${field}"[^>]*>[\\s\\S]*?</tr>`))[0];
    const cells = [...row.matchAll(/<td>([\d,]+)<\/td>/g)].map((m) => Number(m[1].replaceAll(",", "")));
    const expected = [third, fourth].map((p) => field === "outsideTopFive" ? p.totalPt - p.topFivePt : p[field]);
    assert.deepEqual(cells, expected);
  }
});

test("progress: the two proportion bars use exact amounts rather than rounded shares", () => {
  const bars = [...page.matchAll(/<div class="bands">(.*?)<\/div>/g)];
  assert.equal(bars.length, 2);
  for (const [i, phase] of [third, fourth].entries()) {
    const widths = [...bars[i][1].matchAll(/width:([\d.]+)%/g)].map((m) => Number(m[1]));
    assert.equal(widths.length, 3);
    [phase.topFivePt, phase.ranks6to100Pt, phase.ranks101PlusPt].forEach((v, j) => assert.ok(Math.abs(widths[j] - v / phase.totalPt * 100) < 1e-6));
    assert.ok(Math.abs(widths.reduce((a, b) => a + b, 0) - 100) < 1e-6);
  }
});

test("progress: peer selection is the predetermined four places on either side", () => {
  assert.equal(snapshot.meta.srRetrievedJst, "2026-10-12 16:53 JST");
  assert.equal(snapshot.meta.showroomScoreCoverage, 50);
  assert.equal(snapshot.meta.showroomRoomsCount, 71);
  assert.equal(snapshot.meta.officialRosterCount, 70);
  assert.equal(snapshot.meta.doNotTreatAsLive, true);
  assert.equal(snapshot.mily.srRank, 15);
  const rows = [...page.matchAll(/data-peer-rank="(\d+)" data-peer-entry="(\d+)" data-peer-points="(\d+)"[^>]*>(.*?)<\/div>/g)];
  assert.deepEqual(rows.map((m) => Number(m[1])), [11, 12, 13, 14, 15, 16, 17, 18, 19]);
  for (const m of rows) {
    const source = snapshot.srPeers.find((p) => p.entry === Number(m[2]));
    assert.ok(source);
    assert.equal(Number(m[1]), source.srRank);
    assert.equal(Number(m[3]), source.srPoints);
    const width = Number(m[4].match(/width:([\d.]+)%/)[1]);
    assert.ok(Math.abs(width - source.srPoints / 1000000 * 100) < 1e-6);
    const visible = Number(m[4].match(/<strong>([\d,]+)pt<\/strong>/)[1].replaceAll(",", ""));
    assert.equal(visible, source.srPoints);
  }
});

test("progress: historical comparisons and unverified campaign effects remain distinct", () => {
  for (const text of ["現在順位・最新配信の比較ではありません", "公式の認定最終値ではありません", "直近のイベント効果・ライバル比較は、まだ未検証", "未取得を0として順位付けしません", "同じ配信時間にそろえた効率比較ではありません", "ファン人数・新規人数・定着率は分かりません"]) assert.ok(page.includes(text), text);
  assert.doesNotMatch(page, /forecastScore|voteEstimate|勝率|絶対に通過|必ず勝てる|本人は焦|完璧主義/);
});

test("progress: new HTML is a built route with privacy and source boundaries intact", () => {
  const config = read("vite.config.ts");
  assert.match(config, /dataLabProgress:\s*"data-lab\/progress\/index.html"/);
  assert.ok(config.includes('.replaceAll("__DATA_LAB_PROGRESS_CANONICAL__", `${dataLabUrl()}progress/`)'));
  assert.match(page, /name="robots" content="noindex,nofollow,noarchive"/);
  assert.match(page, /href="__DATA_LAB_PROGRESS_CANONICAL__"/);
  assert.match(page, /href="\/data-lab\/"/);
  assert.ok(page.includes(support.source.url));
  assert.ok(page.includes(snapshot.sources.showroomEvent));
  assert.doesNotMatch(page, /drive\.google\.com|@gmail\.com|viewer[_-]?id|contributor[_-]?id|chatgpt\.site|C:\\Users/i);
  for (const tag of page.matchAll(/<a\b[^>]+target="_blank"[^>]*>/g)) assert.match(tag[0], /rel="noopener noreferrer"/);
  assert.ok(page.endsWith("</html>\n"));
});
