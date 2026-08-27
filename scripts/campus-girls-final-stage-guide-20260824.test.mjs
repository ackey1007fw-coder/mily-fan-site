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
const VOTE_ANNOUNCEMENT_SOURCE =
  "https://x.com/mily_chan36/status/2092456392343138339";

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
    assert.equal(entry.sourceLabel, "8月24日のX投稿を見る");
    assert.deepEqual(entry.additionalSources, [
      {
        label: "8月26日のX投稿を見る",
        url: VOTE_ANNOUNCEMENT_SOURCE,
      },
    ]);
    assert.equal(entry.url, "https://paton.jp/event/entrant/11380");
    assert.equal(entry.ctaLabel, "Patonでみりぃに投票する");
    assert.equal(
      entry.media?.src,
      "/media/news/mily-b26-01-campus-girls-paton-portrait.jpg",
    );
    assert.deepEqual(
      entry.additionalMedia?.map(({ src }) => src),
      ["/media/news/mily-b26-02-campus-girls-paton-page.jpg", "/media/news/mily-b33-01-campus-girls-final-stage-flyer.jpg"],
    );
    assert.deepEqual(verifyNews(news), []);
  });

  it("preserves the original guide and adds the subsequently confirmed Paton destination", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}`;

    assert.match(entry.title, /CAMPUS GIRLS 2027/);
    assert.match(entry.title, /Final STAGE/);
    assert.match(entry.body, /8月24日/);
    assert.match(entry.body, /SNS審査は8月24日12:00〜8月30日12:00/);
    assert.match(entry.body, /Paton投票審査は8月26日18:00〜9月1日23:59/);
    assert.match(entry.body, /8月24日時点では投票先の詳細は追って案内/);
    assert.match(entry.body, /8月26日にPatonの三橋莉子（みりぃ）ページの公開を確認/);
    assert.match(entry.body, /みりぃ自身もXでこの応援ページを直接案内/);
    assert.match(entry.body, /投票にはPatonへのログインが必要/);
    assert.match(entry.body, /CAMPUS GIRLSでは配信を行わない/);
    assert.match(entry.body, /Final STAGE期間を8月24日12:00〜8月30日23:59/);

    for (const phrase of [
      "今すぐ投票",
      "MISS CIRCLEの規定",
      "規定により禁止",
      "配信が禁止",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("ranks ahead of the earlier 8/24 night-thanks item via sameDayOrder", () => {
    const ordered = sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "2026-08-27-miss-circle-showroom-story").filter((entry) => entry.id !== "2026-08-27-x-followers-100")).map((entry) => entry.id);
    assert.equal(ordered[0], "2026-08-26-girlsaward-showroom-6th");
    assert.equal(ordered[1], "2026-08-26-paton-vote-stories");
    assert.equal(ordered[2], "2026-08-26-instagram-followers-400");
    assert.equal(ordered[3], "2026-08-26-morning-stream-thanks");
    assert.equal(ordered[4], "2026-08-26-girl-award-event-fanroom");
    assert.equal(ordered[5], "2026-08-26-mixch-15x-day");
    assert.equal(ordered[6], "2026-08-26-stream-1000");
    assert.equal(ordered[7], "2026-08-25-mixch-confidence-message");
    assert.equal(ordered[8], "2026-08-25-motivation");
    assert.equal(ordered[9], "2026-08-24-seasidecircle-yes-tokyo");
    assert.equal(ordered[10], NEWS_ID);
    assert.equal(ordered[11], "2026-08-24-makeup-stream");
    assert.equal(ordered[12], EXISTING_8_24);
    assert.ok(news.some((entry) => entry.id === EXISTING_8_24));
    assert.ok(news.some((entry) => entry.id === CAMPUS_RESULT_ID));
  });

  it("appears on the CAMPUS GIRLS Activity page through explicit activityIds", () => {
    const selected = selectActivityNews("campus-girls", news, news.length);
    const preview = selectActivityNews("campus-girls");

    assert.equal(preview[0]?.id, "2026-08-26-paton-vote-stories");
    assert.ok(selected.some((entry) => entry.id === NEWS_ID));
    assert.ok(
      selectActivityNews("campus-girls", news, news.length).some(
        (entry) => entry.id === CAMPUS_RESULT_ID,
      ),
    );
    assert.ok(selected.every(({ activityIds }) => activityIds?.includes("campus-girls")));
  });

  it("integrates the overlapping 8/26 X post into the existing NEWS card", async () => {
    const matches = news.filter((entry) =>
      entry.additionalSources?.some(
        ({ url }) => url === VOTE_ANNOUNCEMENT_SOURCE,
      ),
    );
    const latest = await readFile(
      path.join(root, "src/components/Latest.tsx"),
      "utf8",
    );
    const activityPage = await readFile(
      path.join(root, "src/ActivitiesPage.tsx"),
      "utf8",
    );

    assert.equal(matches.length, 1);
    assert.equal(matches[0]?.id, NEWS_ID);
    assert.match(latest, /item\.additionalSources\?\.map/);
    assert.match(activityPage, /item\.additionalSources\?\.map/);
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
    assert.equal(
      entry.image,
      "https://mily-fan-site.vercel.app/media/news/mily-b26-01-campus-girls-paton-portrait.jpg",
    );
  });

  it("documents the now-confirmed Paton vote destination", async () => {
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const newsSource = await readFile(path.join(root, "src/data/news.ts"), "utf8");

    assert.match(ops, /43件/);
    assert.match(ops, /Final STAGE案内/);
    assert.match(ops, /8月26日の本人XによるPaton直接案内/);
    assert.match(ops, /Patonの三橋莉子（みりぃ）ページへの投票導線/);
    assert.equal(newsSource.includes("https://paton.jp/event/entrant/11380"), true);
    assert.equal(news.length, 43);
  });
});
