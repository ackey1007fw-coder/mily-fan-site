import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("data-lab is part of the fan site, not an external private dashboard", () => {
  const route = read("src/lib/dataLabRoute.ts");
  const nav = read("src/lib/navigation.ts");
  const home = read("src/App.tsx");
  const gateway = read("src/components/DataLabGateway.tsx");
  const page = read("public/data-lab/index.html");

  assert.match(route, /DATA_LAB_ROUTE = "\/data-lab\/"/);
  assert.match(nav, /href: DATA_LAB_ROUTE, label: "データ分析"/);
  assert.match(home, /<DataLabGateway\s*\/>/);
  assert.match(gateway, /href=\{DATA_LAB_ROUTE\}/);
  assert.match(page, /href="\/" aria-label="みりぃファンサイトのホームに戻る"/);
  assert.match(page, /rel="canonical" href="https:\/\/mily-fan-site\.vercel\.app\/data-lab\/"/);
  assert.match(page, /noindex,nofollow,noarchive/);
});

test("data-lab snapshot is limited to verified public contestants and frozen scores", () => {
  const snapshot = JSON.parse(read("public/data-lab/data/public-snapshot-20261012.json"));
  assert.equal(snapshot.meta.officialRosterCount, 70);
  assert.equal(snapshot.meta.showroomRoomsCount, 71);
  assert.equal(snapshot.meta.doNotTreatAsLive, true);
  assert.equal(snapshot.roster.length, 70);
  assert.equal(new Set(snapshot.roster.map((person) => person.entry)).size, 70);
  assert.ok(!snapshot.roster.some((person) => person.entry === 1013));
  const mily = snapshot.roster.find((person) => person.entry === 734);
  assert.ok(mily);
  assert.match(mily.name, /三橋/);
  assert.equal(mily.grade, "3年");
  assert.equal(mily.srRank, 15);
  assert.equal(snapshot.mily.forecastRank, 15);
  assert.equal(snapshot.mily.forecastScore, 28.54);
});

test("data-lab never imports private analysis URLs or personal audience records", () => {
  const paths = [
    "public/data-lab/index.html",
    "public/data-lab/assets/app.js",
    "public/data-lab/assets/data.js",
    "public/data-lab/data/public-snapshot-20261012.json",
  ];
  for (const path of paths) {
    const content = read(path);
    assert.doesNotMatch(content, /chatgpt\.site|tasty-mite|ackey1007fw@gmail|viewer[_-]?id|private[_-]?recording/i, path);
    assert.doesNotMatch(content, /\bmilly\b/i, path);
  }
  const html = read(paths[0]);
  assert.match(html, /assets\/data\.js/);
  assert.match(html, /assets\/app\.js/);
  assert.match(html, /なおかさんの予測/);
});
