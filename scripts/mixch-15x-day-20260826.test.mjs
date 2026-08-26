import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import {
  mixch15xDayMovie,
  mixchConfidenceMessageMovie,
} from "../src/data/mixchMovies.ts";
import { events } from "../src/data/events.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import { selectGalleryEntries } from "../src/lib/galleryItems.ts";
import { verifyNews } from "./content-invariants.mjs";
import { readFile } from "node:fs/promises";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_ID = "2026-08-26-mixch-15x-day";
const MIXCH_URL = "https://mixch.tv/m/nxqYblH8";
const CAPTION =
  "今日は1.5倍デーだってよ？！😳🫶️❤️私はみんなと絶景見に行くよ。絶対にね。#キャンガル #キャンガル2027 #キャンパスガールズ #キャンパスガールズ2027 #campusgirls #campusgirls2027";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-08-26 Mixch 1.5x day NEWS", () => {
  it("adds one JST-dated Mixch-sourced NEWS item with shared outbound media", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(entry.date, "2026-08-26");
    assert.equal(entry.sameDayOrder, undefined);
    assert.deepEqual(entry.activityIds, ["campus-girls"]);
    assert.equal(entry.source, MIXCH_URL);
    assert.equal(entry.sourceLabel, "Mixchの動画を見る");
    assert.equal(entry.url, undefined);
    assert.equal(entry.ctaLabel, "Mixchで見る");
    assert.equal(entry.media, mixch15xDayMovie);
    assert.equal(entry.media.kind, "mixch");
    assert.equal(entry.media.mixchUrl, MIXCH_URL);
    assert.equal(typeof entry.media.src, "undefined");
    assert.deepEqual(verifyNews(news), []);
  });

  it("summarizes the caption without inventing a trip, location, slot, or X URL", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${JSON.stringify(entry)}`;

    assert.match(entry.title, /1\.5倍デー/);
    assert.match(entry.body, /8月26日/);
    assert.match(entry.body, /Mixch/);
    assert.match(entry.body, /1\.5倍デー/);
    assert.match(entry.body, /絶景を見に行く/);
    assert.match(entry.body, /CAMPUS GIRLS/);
    assert.equal(entry.message?.text, CAPTION);

    for (const phrase of [
      "行った",
      "行ってきた",
      "場所",
      "箱根",
      "江の島",
      "10:00",
      "SHOWROOM",
      "x.com/",
      "twitter.com/",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("does not invent an X URL and keeps Mixch as source and CTA", () => {
    const entry = item();
    assert.match(entry.source, /^https:\/\/mixch\.tv\/m\/nxqYblH8$/);
    assert.equal(entry.source.includes("x.com"), false);
    assert.equal(entry.source.includes("instagram.com"), false);
  });

  it("leads 2026-08-26 NEWS above the 10:00 stream item via source-array order", () => {
    const ordered = sortNewsByDateDesc(news);
    assert.equal(ordered[0]?.id, NEWS_ID);
    assert.equal(ordered[1]?.id, "2026-08-26-stream-1000");
    assert.deepEqual(
      ordered.filter(({ date }) => date === "2026-08-26").map(({ id }) => id),
      [NEWS_ID, "2026-08-26-stream-1000"],
    );
  });

  it("appears on CAMPUS GIRLS and is derived into the Portal Feed without a local image", () => {
    const selected = selectActivityNews("campus-girls");
    const feed = createPortalFeed();
    const feedItem = feed.items.find(
      (candidate) => candidate.id === `mily:news:${NEWS_ID}`,
    );

    assert.equal(selected[0]?.id, NEWS_ID);
    assert.ok(feedItem);
    assert.equal(feedItem.publishedAt, "2026-08-26T00:00:00+09:00");
    assert.equal(feedItem.sourceUrl, MIXCH_URL);
    assert.equal(feedItem.image, undefined);
  });

  it("does not add Mixch movies to events or streamSchedule", () => {
    assert.deepEqual(events, []);
    assert.deepEqual(streamSchedule, []);
    assert.equal(
      JSON.stringify(events).includes("nxqYblH8"),
      false,
    );
    assert.equal(
      JSON.stringify(streamSchedule).includes("nxqYblH8"),
      false,
    );
  });
});

describe("Mixch outbound player cards — shared objects and markup", () => {
  it("shares one object per movie between NEWS and Gallery", () => {
    const confidence = news.find(
      (entry) => entry.id === "2026-08-25-mixch-confidence-message",
    );
    const day15x = item();
    const gallery = selectGalleryEntries().filter((entry) => entry.kind === "mixch");

    assert.equal(day15x.media, mixch15xDayMovie);
    assert.equal(confidence.media, mixchConfidenceMessageMovie);
    assert.equal(gallery[0]?.item, mixch15xDayMovie);
    assert.equal(gallery[1]?.item, mixchConfidenceMessageMovie);
    assert.equal(
      selectActivityMedia("campus-girls").includes(mixch15xDayMovie),
      true,
    );
    assert.equal(
      selectActivityMedia("campus-girls").includes(mixchConfidenceMessageMovie),
      true,
    );
  });

  it("links Mixch cards to mixch.tv/m/ pages and never uses _movie_mps as video src", async () => {
    const files = [
      "src/components/MixchOutboundCard.tsx",
      "src/components/Latest.tsx",
      "src/components/Gallery.tsx",
      "src/ActivitiesPage.tsx",
    ];
    const sources = await Promise.all(
      files.map((relative) => readFile(path.join(root, relative), "utf8")),
    );

    for (const source of sources) {
      assert.doesNotMatch(source, /_movie_mps/);
      assert.doesNotMatch(source, /<iframe/);
    }

    const card = sources[0];
    assert.match(card, /href=\{movie\.mixchUrl\}/);
    assert.match(card, /from "\.\/ExternalLink"/);
    assert.doesNotMatch(card, /<video/);
    assert.match(card, /Mixchで「\{movie\.title\}」を見る/);

    const external = await readFile(
      path.join(root, "src/components/ExternalLink.tsx"),
      "utf8",
    );
    assert.match(external, /rel="noopener noreferrer"/);
    assert.match(external, /target="_blank"/);

    const latest = sources[1];
    assert.match(latest, /kind === "mixch"/);
    assert.match(latest, /MixchOutboundCard/);
  });

  it("does not copy Mixch movie files into public/media or media/original", async () => {
    const publicFiles = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"));
    const originalFiles = (await readdir(path.join(root, "media/original"), { recursive: true }).catch(() => []))
      .map((file) => String(file).replaceAll("\\", "/"));

    for (const file of [...publicFiles, ...originalFiles]) {
      assert.equal(file.includes("_movie_mps"), false, file);
      assert.equal(file.includes("ZY4hSt3K"), false, file);
      assert.equal(file.includes("nxqYblH8"), false, file);
      assert.equal(file.includes("mixch-15x"), false, file);
      assert.equal(file.includes("mixch-confidence"), false, file);
    }

    assert.equal(mixch15xDayMovie.poster.startsWith("/media/"), false);
    assert.equal(mixchConfidenceMessageMovie.poster.startsWith("/media/"), false);
    assert.match(mixch15xDayMovie.poster, /thumb_normal/);
    assert.match(mixchConfidenceMessageMovie.poster, /thumb_normal/);
  });
});
