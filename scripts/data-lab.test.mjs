import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dataLabUrl, dataLabFinalNightUrl, dataLabOgImageUrl, site, sitemapXml } from "../src/data/site.ts";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("data-lab URLs follow a changed site origin without enabling indexing", () => {
  const previous = site.siteUrl;
  try {
    site.siteUrl = "https://signal.example.test///";
    assert.equal(dataLabUrl(), "https://signal.example.test/data-lab/");
    assert.equal(dataLabFinalNightUrl(), "https://signal.example.test/data-lab/reports/20261012-final-night/");
    assert.ok(!sitemapXml().includes(dataLabFinalNightUrl()));
    assert.equal(dataLabOgImageUrl(), "https://signal.example.test/data-lab/assets/og-card-20261013.png");
    assert.ok(!sitemapXml().includes(dataLabUrl()));
  } finally {
    site.siteUrl = previous;
  }
});

test("social card is a 1200 by 630 raster image", () => {
  const png = readFileSync(new URL("../public/data-lab/assets/og-card-20261013.png", import.meta.url));
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});

test("data-lab is part of the fan site, not an external private dashboard", () => {
  const route = read("src/lib/dataLabRoute.ts");
  const nav = read("src/lib/navigation.ts");
  const home = read("src/App.tsx");
  const gateway = read("src/components/DataLabGateway.tsx");
  const page = read("data-lab/index.html");

  assert.match(route, /DATA_LAB_ROUTE = "\/data-lab\/"/);
  assert.match(nav, /href: DATA_LAB_ROUTE, label: "データ分析"/);
  assert.match(home, /<DataLabGateway\s*\/>/);
  assert.match(gateway, /href=\{DATA_LAB_ROUTE\}/);
  assert.match(page, /href="\/" aria-label="みりぃファンサイトのホームに戻る"/);
  assert.match(page, /rel="canonical" href="__DATA_LAB_CANONICAL__"/);
  assert.match(page, /noindex,nofollow,noarchive/);
});

test("data-lab snapshot is limited to verified public contestants and frozen scores", () => {
  const snapshot = JSON.parse(read("public/data-lab/data/public-snapshot-20261012.json"));
  assert.equal(snapshot.meta.officialRosterCount, 70);
  assert.equal(snapshot.meta.showroomRoomsCount, 71);
  assert.equal(snapshot.meta.doNotTreatAsLive, true);
  assert.equal(snapshot.roster.length, 70);
  const shippedData = JSON.parse(read("public/data-lab/assets/data.js")
    .replace(/^\s*window\.MILY_SNAPSHOT\s*=\s*/, "")
    .replace(/;\s*$/, ""));
  assert.deepEqual(shippedData, snapshot, "Published JS data must match the vetted JSON snapshot");
  for (const person of snapshot.roster) {
    assert.deepEqual(Object.keys(person).sort(),
      ["entry", "name", "grade", "srRank", "gradeSrRank", "srPoints"].sort(),
      "Public roster must not gain audience-specific attributes");
  }
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
    "data-lab/index.html",
    "public/data-lab/assets/app.js",
    "public/data-lab/assets/data.js",
    "public/data-lab/data/public-snapshot-20261012.json",
  ];
  for (const path of paths) {
    const content = read(path);
    assert.doesNotMatch(content, /drive\.google\.com|@gmail\.com|viewer[_-]?id|private[_-]?recording|chatgpt\.site|audience[_-]?record|contributor[_-]?id/i, path);
  }
  const html = read(paths[0]);
  assert.match(html, /\/data-lab\/assets\/data\.js/);
  assert.match(html, /\/data-lab\/assets\/app\.js/);
  assert.match(html, /なおかさんの予測/);
});
