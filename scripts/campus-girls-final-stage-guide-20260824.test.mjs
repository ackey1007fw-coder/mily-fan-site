import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { highlights } from "../src/data/highlights.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { verifyNews } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-08-24-campus-girls-final-stage-guide";
const EXISTING_8_24 = "2026-08-24-night-thanks-morning-stream";
const CAMPUS_RESULT_ID = "2026-08-22-campus-girls-second-stage-jury-award";
const SOURCE = "https://x.com/mily_chan36/status/2091669951946121636";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-08-24 CAMPUS GIRLS Final STAGE guide — Latest entry", () => {
  it("adds exactly one source-backed News item with the confirmed date", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(entry.date, "2026-08-24");
    assert.equal(entry.sameDayOrder, 3);
    assert.deepEqual(entry.activityIds, ["campus-girls"]);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, undefined);
    assert.equal(entry.ctaLabel, undefined);
    assert.equal(entry.media, undefined);
    assert.deepEqual(verifyNews(news), []);
  });

  it("summarizes the confirmed Final STAGE guide without inventing vote URLs", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}`;

    assert.match(entry.title, /CAMPUS GIRLS 2027/);
    assert.match(entry.title, /Final STAGE/);
    assert.match(entry.body, /8月24日/);
    assert.match(entry.body, /SNS審査は8月24日12:00〜8月30日12:00/);
    assert.match(entry.body, /Paton投票審査は8月26日18:00〜9月1日23:59/);
    assert.match(entry.body, /投票先の詳細は追って案内/);
    assert.match(entry.body, /CAMPUS GIRLSでは配信を行わない/);
    assert.match(entry.body, /Final STAGE期間を8月24日12:00〜8月30日23:59/);

    for (const phrase of [
      "paton.jp",
      "今すぐ投票",
      "投票する",
      "MISS CIRCLEの規定",
      "規定により禁止",
      "配信が禁止",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("ranks ahead of the earlier 8/24 night-thanks item via sameDayOrder", () => {
    const ordered = sortNewsByDateDesc(news).map((entry) => entry.id);

    assert.equal(ordered[0], NEWS_ID);
    assert.equal(ordered[1], "2026-08-24-makeup-stream");
    assert.equal(ordered[2], EXISTING_8_24);
    assert.ok(news.some((entry) => entry.id === EXISTING_8_24));
    assert.ok(news.some((entry) => entry.id === CAMPUS_RESULT_ID));
  });

  it("appears on the CAMPUS GIRLS Activity page through explicit activityIds", () => {
    const selected = selectActivityNews("campus-girls");

    assert.ok(selected.some((entry) => entry.id === NEWS_ID));
    assert.ok(selected.some((entry) => entry.id === CAMPUS_RESULT_ID));
    assert.ok(selected.every(({ activityIds }) => activityIds?.includes("campus-girls")));
  });

  it("does not add a new Highlight for this guide-only post", () => {
    assert.equal(
      highlights.some((entry) => entry.id.includes("final-stage-guide")),
      false,
    );
    assert.ok(
      highlights.some((entry) => entry.id === "campus-girls-2027-second-stage-jury-award"),
    );
  });

  it("keeps Portal Feed aligned with the new Latest lead", () => {
    const feed = createPortalFeed();
    const entry = feed.items.find((candidate) => candidate.id === `mily:news:${NEWS_ID}`);

    assert.ok(entry);
    assert.equal(entry.publishedAt, "2026-08-24T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.equal(entry.image, undefined);
  });

  it("documents the inventory bump and leaves vote URLs out of tracked sources", async () => {
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const newsSource = await readFile(path.join(root, "src/data/news.ts"), "utf8");

    assert.match(ops, /27件/);
    assert.match(ops, /Final STAGE案内/);
    assert.match(ops, /投票先URLは未公開のため未掲載/);
    assert.equal(newsSource.includes("paton.jp"), false);
    assert.equal(news.length, 27);
  });
});
