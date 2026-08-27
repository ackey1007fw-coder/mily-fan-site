import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { mixchConfidenceMessageMovie } from "../src/data/mixchMovies.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { verifyNews } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_ID = "2026-08-25-mixch-confidence-message";
const X_SOURCE =
  "https://x.com/mily_chan36/status/2092031986810728533";
const MIXCH_URL = "https://mixch.tv/m/ZY4hSt3K";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-08-25 Mixch confidence message NEWS", () => {
  it("keeps the X source and Mixch CTA, and adds Mixch outbound media", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(news.filter((candidate) => candidate.source === X_SOURCE).length, 1);
    assert.equal(news.filter((candidate) => candidate.url === MIXCH_URL).length, 1);
    assert.equal(entry.date, "2026-08-25");
    assert.equal(entry.sameDayOrder, 1);
    assert.deepEqual(entry.activityIds, ["campus-girls"]);
    assert.equal(entry.source, X_SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, MIXCH_URL);
    assert.equal(
      entry.ctaLabel,
      "Mixchで「自信のないあなたへ」を見る",
    );
    assert.equal(entry.media, mixchConfidenceMessageMovie);
    assert.equal(entry.media.kind, "mixch");
    assert.equal(entry.media.mixchUrl, MIXCH_URL);
    assert.equal(typeof entry.media.src, "undefined");
    assert.equal(entry.additionalMedia, undefined);
    assert.deepEqual(verifyNews(news), []);
  });

  it("summarizes the video and the immediate reply without inventing intent", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}`;

    assert.match(entry.title, /自信のないあなたへ/);
    assert.match(entry.title, /Mixch/);
    assert.match(entry.body, /8月25日の朝/);
    assert.match(entry.body, /周りの人の良いところ/);
    assert.match(entry.body, /一つひとつ足跡が残っている/);
    assert.match(entry.body, /自分に自信がなく不安だからこそ/);
    assert.match(entry.body, /キャンガルでも絶対に発信したいと思っていたこの大切な動画/);
    assert.match(entry.body, /CAMPUS GIRLS/);
    assert.match(entry.body, /一緒に頑張りたい/);

    for (const phrase of [
      "に違いない",
      "強い決意がある",
      "優勝戦略",
      "必ず優勝",
      "自信を取り戻せる",
      "人生が変わる",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("keeps the short X post transcription separate from the summary", () => {
    const entry = item();

    assert.ok(entry.message);
    assert.equal(entry.message.label, "みりぃのX投稿");
    assert.equal(
      entry.message.text,
      "#ミクチャ で動画を投稿したよ！見に来てね！\n" +
        "【自信のないあなたへ】\n" +
        MIXCH_URL,
    );
    assert.notEqual(entry.message.text, entry.body);
  });

  it("follows the 8/26 Mixch NEWS and still leads 8/25 before motivation", () => {
    const ordered = sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-27-mixch-expressive").filter((entry) => entry.id !== "2026-08-27-paton-vote-how-to").filter((entry) => entry.id !== "2026-08-27-x-followers-100").filter((entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "2026-08-27-miss-circle-showroom-story").filter((entry) => entry.id !== "2026-08-27-movie-night"));
    const feed = createPortalFeed();
    const feedItem = feed.items.find(
      (candidate) => candidate.id === `mily:news:${NEWS_ID}`,
    );

    assert.equal(ordered[0]?.id, "2026-08-26-girlsaward-showroom-6th");
    assert.equal(ordered[1]?.id, "2026-08-26-paton-vote-stories");
    assert.equal(ordered[2]?.id, "2026-08-26-instagram-followers-400");
    assert.equal(ordered[3]?.id, "2026-08-26-morning-stream-thanks");
    assert.equal(ordered[4]?.id, "2026-08-26-girl-award-event-fanroom");
    assert.equal(ordered[5]?.id, "2026-08-26-mixch-15x-day");
    assert.equal(ordered[6]?.id, "2026-08-26-stream-1000");
    assert.equal(ordered[7]?.id, NEWS_ID);
    assert.equal(ordered[8]?.id, "2026-08-25-motivation");
    assert.deepEqual(
      ordered.filter(({ date }) => date === "2026-08-25").map(({ id }) => id),
      [NEWS_ID, "2026-08-25-motivation"],
    );
    assert.ok(feedItem);
    assert.equal(feedItem.publishedAt, "2026-08-25T00:00:00+09:00");
    assert.equal(feedItem.sourceUrl, X_SOURCE);
    assert.equal(feedItem.summary, item().body);
    assert.equal(feedItem.image, undefined);
  });

  it("appears on the existing CAMPUS GIRLS Activity page after the newer Mixch NEWS", () => {
    const selected = selectActivityNews("campus-girls");

    const selectedAll = selectActivityNews("campus-girls", news, news.length);
    assert.equal(selected[0]?.id, "2026-08-27-paton-vote-how-to");
    assert.equal(selected[1]?.id, "2026-08-27-mixch-expressive");
    assert.equal(selected[2]?.id, "2026-08-26-paton-vote-stories");
    assert.equal(selectedAll[3]?.id, "2026-08-26-mixch-15x-day");
    assert.equal(selectedAll[4]?.id, NEWS_ID);
    assert.ok(selected.every(({ activityIds }) => activityIds?.includes("campus-girls")));
  });

  it("reuses the existing external-link and CTA rendering", async () => {
    const latest = await readFile(
      path.join(root, "src/components/Latest.tsx"),
      "utf8",
    );
    const activities = await readFile(
      path.join(root, "src/ActivitiesPage.tsx"),
      "utf8",
    );

    assert.match(latest, /href=\{item\.source\}/);
    assert.match(latest, /resolveNewsLinks\(item, now\)/);
    assert.match(latest, /href=\{resolvedLinks\.cta\.url\}/);
    assert.match(latest, /resolvedLinks\.cta\.label/);
    assert.match(activities, /resolveNewsLinks\(item, now\)/);
    assert.match(activities, /resolvedLinks\.cta\.label/);
  });

  it("does not add a downloaded Mixch mp4 and documents Mixch outbound cards", async () => {
    const [mediaSource, storiesSource, ops] = await Promise.all([
      readFile(path.join(root, "src/data/media.ts"), "utf8"),
      readFile(path.join(root, "src/data/stories.ts"), "utf8"),
      readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8"),
    ]);

    for (const source of [mediaSource, storiesSource]) {
      assert.doesNotMatch(source, /ZY4hSt3K/);
      assert.doesNotMatch(source, /VDojsMY5/);
      assert.doesNotMatch(source, /_movie_mps/);
    }
    assert.equal(news.length, 47);
    assert.match(ops, /47件/);
    assert.match(ops, /Mixch「自信のないあなたへ」/);
    assert.match(ops, /Mixch outbound player card/);
    assert.match(ops, /Mixchファイルは自己ホストしていない/);
    assert.match(ops, /2092481552475460058/);
    assert.match(ops, /関連メディアにはMixchカードを出さない/);
  });
});
