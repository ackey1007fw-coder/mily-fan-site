import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

describe("2026-10-14 X red riding hood lip video", () => {
  it("keeps the owner-provided X URL and one date-scoped NEWS item", async () => {
    const source = await read("src/data/news.ts");
    const id = 'id: "2026-10-14-x-redhood-lip-gloss-video"';
    assert.equal(source.split(id).length - 1, 1);
    const item = source.slice(source.indexOf(id), source.indexOf(id) + 1000);
    assert.match(item, /date: "2026-10-14"/);
    assert.match(item, /xEmbed: \{/);
    assert.match(item, /postId: "2110302889927430480"/);
    assert.match(item, /https:\/\/x\.com\/mily_chan36\/status\/2110302889927430480/);
    assert.match(item, /赤ずきん/);
    assert.match(item, /リップ/);
    assert.doesNotMatch(item, /src: "\/media\//);
    assert.ok(source.includes('id: "2026-10-13-x-first-cosplay-red-riding-hood"'));
  });

  it("uses an official X embed and a permanent fallback link, without hotlinking X CDN", async () => {
    const latest = await read("src/components/Latest.tsx");
    assert.ok(latest.includes("{item.xEmbed ? ("));
    assert.match(latest, /platform\.twitter\.com\/embed\/Tweet\.html/);
    assert.match(latest, /dnt=true/);
    assert.match(latest, /loading="lazy"/);
    assert.match(latest, /href=\{item\.xEmbed\.sourceUrl\}/);
    assert.match(latest, /Xで元の動画を見る/);
    assert.doesNotMatch(latest, /video\.twimg\.com/);
  });
});
