import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { news, newsDisplayMedia, sortNewsByDateDesc } from "../src/data/news.ts";
import {
  mixchExpressiveMovie,
  mixch15xDayMovie,
  mixchConfidenceMessageMovie,
} from "../src/data/mixchMovies.ts";
import { visibleGalleryVideos } from "../src/data/galleryVideos.ts";
import { events } from "../src/data/events.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import { selectGalleryEntries } from "../src/lib/galleryItems.ts";
import { verifyNews } from "./content-invariants.mjs";
import { readFile } from "node:fs/promises";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_ID = "2026-08-27-mixch-expressive";
const MIXCH_URL = "https://mixch.tv/m/VDojsMY5";
const X_SOURCE = "https://x.com/mily_chan36/status/2092838411602407646";
const MESSAGE =
  "#ミクチャ で動画を投稿したよ！見に来てね！\n" +
  "表情豊かなみりぃと魅力的でしょう？？？？(^з^)-☆ 絶対に本戦に行こう\u{203C}\u{FE0F}勝ち進もう\u{203C}\u{FE0F}#キャンガル #キャンパスガールズ2027 #キャンパスガールズ #キャ https://mixch.tv/m/VDojsMY5";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-08-27 Mixch expressive NEWS", () => {
  it("adds one JST-dated NEWS item with X source, Mixch CTA, and shared outbound media", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(news.filter((candidate) => candidate.source === X_SOURCE).length, 1);
    assert.equal(entry.date, "2026-08-27");
    assert.equal(entry.sameDayOrder, undefined);
    assert.deepEqual(entry.activityIds, ["campus-girls"]);
    assert.equal(entry.source, X_SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, MIXCH_URL);
    assert.equal(entry.ctaLabel, "Mixchで見る");
    assert.equal(entry.media, mixchExpressiveMovie);
    assert.equal(entry.media.kind, "mixch");
    assert.equal(entry.media.mixchUrl, MIXCH_URL);
    assert.equal(entry.media.accountUrl, "https://mixch.tv/u/10114673");
    assert.equal(typeof entry.media.src, "undefined");
    assert.equal(entry.source.includes("?s="), false);
    assert.deepEqual(verifyNews(news), []);
  });

  it("summarizes the caption without inventing a win, ranking, or schedule slot", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}`;

    assert.match(entry.title, /表情豊かなみりぃと魅力的でしょう？？？？/);
    assert.match(entry.title, /絶対に本戦に行こう/);
    assert.match(entry.body, /8月27日/);
    assert.match(entry.body, /Mixch/);
    assert.match(entry.body, /表情豊かなみりぃと魅力的でしょう？/);
    assert.match(entry.body, /絶対に本戦に行こう/);
    assert.match(entry.body, /勝ち進もう/);
    assert.match(entry.body, /CAMPUS GIRLS/);

    for (const phrase of [
      "優勝",
      "1位",
      "順位",
      "Paton",
      "SHOWROOM",
      "行った",
      "行ってきた",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("keeps the X announcement verbatim with Mixch-page double-exclamation code points", async () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃのX投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.message.text.split("\n").length, 2);
    assert.match(entry.message.text, /^#ミクチャ で動画を投稿したよ！見に来てね！\n/u);
    assert.match(entry.message.text, /\(\^з\^\)-☆/);
    assert.equal(entry.message.text.includes("\u{203C}\u{FE0F}"), true);
    assert.equal(entry.message.text.includes("!"), false);

    const newsSource = await readFile(path.join(root, "src/data/news.ts"), "utf8");
    assert.match(newsSource, /\\u\{203C\}\\u\{FE0F\}/);
  });

  it("follows the Paton guide and X followers NEWS, then leads the morning Stories", () => {
    const ordered = sortNewsByDateDesc(news);
    assert.equal(ordered[0]?.id, "2026-08-27-paton-vote-how-to");
    assert.equal(ordered[1]?.id, "2026-08-27-x-followers-100");
    assert.equal(ordered[2]?.id, NEWS_ID);
    assert.equal(ordered[3]?.id, "2026-08-27-seaside-circle-movie-theme-story");
    assert.equal(ordered[4]?.id, "2026-08-27-miss-circle-showroom-story");
    assert.deepEqual(
      ordered.filter(({ date }) => date === "2026-08-27").map(({ id }) => id),
      [
        "2026-08-27-paton-vote-how-to",
        "2026-08-27-x-followers-100",
        NEWS_ID,
        "2026-08-27-seaside-circle-movie-theme-story",
        "2026-08-27-miss-circle-showroom-story",
      ],
    );
  });

  it("appears on CAMPUS GIRLS and is derived into the Portal Feed without a local image", () => {
    const selected = selectActivityNews("campus-girls");
    const feed = createPortalFeed();
    const feedItem = feed.items.find(
      (candidate) => candidate.id === `mily:news:${NEWS_ID}`,
    );

    assert.equal(selected[0]?.id, "2026-08-27-paton-vote-how-to");
    assert.equal(selected[1]?.id, NEWS_ID);
    assert.equal(selected[2]?.id, "2026-08-26-paton-vote-stories");
    assert.ok(feedItem);
    assert.equal(feedItem.publishedAt, "2026-08-27T00:00:00+09:00");
    assert.equal(feedItem.sourceUrl, X_SOURCE);
    assert.equal(feedItem.image, undefined);
  });

  it("shares one object between NEWS and Gallery and stays off Activity media", () => {
    const gallery = selectGalleryEntries().filter((entry) => entry.kind === "mixch");

    assert.equal(item().media, mixchExpressiveMovie);
    assert.equal(gallery[0]?.item, mixchExpressiveMovie);
    assert.equal(gallery[1]?.item, mixch15xDayMovie);
    assert.equal(gallery[2]?.item, mixchConfidenceMessageMovie);

    const activityMedia = selectActivityMedia("campus-girls");
    assert.equal(activityMedia.includes(mixchExpressiveMovie), false);
    assert.equal(
      activityMedia.some((media) => media.kind === "mixch"),
      false,
    );
    assert.equal(newsDisplayMedia(item()).includes(mixchExpressiveMovie), true);
    assert.equal(visibleGalleryVideos().includes(mixchExpressiveMovie), true);
  });

  it("does not add Mixch movies to events or streamSchedule or copy files", async () => {
    assert.deepEqual(events, []);
    assert.deepEqual(streamSchedule, []);
    assert.equal(JSON.stringify(events).includes("VDojsMY5"), false);
    assert.equal(JSON.stringify(streamSchedule).includes("VDojsMY5"), false);

    const publicFiles = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"));
    const originalFiles = (
      await readdir(path.join(root, "media/original"), { recursive: true }).catch(
        () => [],
      )
    ).map((file) => String(file).replaceAll("\\", "/"));

    for (const file of [...publicFiles, ...originalFiles]) {
      assert.equal(file.includes("_movie_mps"), false, file);
      assert.equal(file.includes("VDojsMY5"), false, file);
      assert.equal(file.includes("mixch-expressive"), false, file);
    }

    assert.equal(mixchExpressiveMovie.poster.startsWith("/media/"), false);
    assert.match(mixchExpressiveMovie.poster, /thumb_normal/);
  });
});
