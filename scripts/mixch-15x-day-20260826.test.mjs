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
import {
  selectGalleryEntries,
  selectGalleryPreview,
} from "../src/lib/galleryItems.ts";
import {
  GALLERY_ARCHIVE_INITIAL,
  HOME_GALLERY_LIMIT,
} from "../src/lib/homePortal.ts";
import { verifyNews } from "./content-invariants.mjs";
import { readFile } from "node:fs/promises";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_ID = "2026-08-26-mixch-15x-day";
const MIXCH_URL = "https://mixch.tv/m/nxqYblH8";
const X_SOURCE = "https://x.com/mily_chan36/status/2092481552475460058";
/** Mixch page / X caption cluster: flushed face + heart hands + Fitzpatrick 1-2 + heavy heart exclamation + VS16 */
const MIXCH_PAGE_EMOJI = "\u{1F633}\u{1FAF6}\u{1F3FB}\u{2763}\u{FE0F}";
const MESSAGE =
  "おすすめの動画を見つけたよ！ #ミクチャ\n" +
  `今日は1.5倍デーだってよ？！${MIXCH_PAGE_EMOJI}私はみんなと絶景見に行くよ。絶対にね。#キャンガル #キャンガル2027 #キャンパスガールズ #キャンパスガールズ2027 ${MIXCH_URL}`;

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-08-26 Mixch 1.5x day NEWS", () => {
  it("adds one JST-dated NEWS item with X source, Mixch CTA, and shared outbound media", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(news.filter((candidate) => candidate.source === X_SOURCE).length, 1);
    assert.equal(entry.date, "2026-08-26");
    assert.equal(entry.sameDayOrder, undefined);
    assert.deepEqual(entry.activityIds, ["campus-girls"]);
    assert.equal(entry.source, X_SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, MIXCH_URL);
    assert.equal(entry.ctaLabel, "Mixchで見る");
    assert.equal(entry.media, mixch15xDayMovie);
    assert.equal(entry.media.kind, "mixch");
    assert.equal(entry.media.mixchUrl, MIXCH_URL);
    assert.equal(typeof entry.media.src, "undefined");
    assert.deepEqual(verifyNews(news), []);
  });

  it("summarizes the caption without inventing a trip, location, or schedule slot", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}`;

    assert.match(entry.title, /1\.5倍デー/);
    assert.match(entry.body, /8月26日/);
    assert.match(entry.body, /Mixch/);
    assert.match(entry.body, /1\.5倍デー/);
    assert.match(entry.body, /絶景を見に行く/);
    assert.match(entry.body, /CAMPUS GIRLS/);

    for (const phrase of [
      "行った",
      "行ってきた",
      "場所",
      "箱根",
      "江の島",
      "10:00",
      "SHOWROOM",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("keeps the X announcement verbatim with Mixch-page emoji code points", async () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃのX投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.message.text.split("\n").length, 2);
    assert.match(entry.message.text, /^おすすめの動画を見つけたよ！ #ミクチャ\n/u);
    assert.match(
      entry.message.text,
      /\n今日は1\.5倍デーだってよ？！\u{1F633}\u{1FAF6}\u{1F3FB}\u{2763}\u{FE0F}私はみんなと絶景見に行くよ。絶対にね。/u,
    );

    const line2 = entry.message.text.split("\n")[1];
    const clusterStart = line2.indexOf("？！") + "？！".length;
    assert.deepEqual(
      [...line2.slice(clusterStart)].slice(0, 5).map((char) => char.codePointAt(0)),
      [0x1f633, 0x1faf6, 0x1f3fb, 0x2763, 0xfe0f],
    );
    assert.equal(entry.message.text.includes("\u{2764}"), false);
    assert.equal(entry.message.text.includes("\u{1FAF6}\u{FE0F}"), false);
    assert.equal(entry.source.includes("?s="), false);
    assert.equal(entry.source.includes("instagram.com"), false);

    const newsSource = await readFile(path.join(root, "src/data/news.ts"), "utf8");
    assert.match(
      newsSource,
      /\\u\{1F633\}\\u\{1FAF6\}\\u\{1F3FB\}\\u\{2763\}\\u\{FE0F\}/,
    );
  });

  it("leads 2026-08-26 NEWS above the 10:00 stream item via source-array order", () => {
    const ordered = sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-28-paton-vote-day-3").filter((entry) => entry.id !== "2026-08-27-mixch-expressive").filter((entry) => entry.id !== "2026-08-27-paton-vote-how-to").filter((entry) => entry.id !== "2026-08-27-x-followers-100").filter((entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "2026-08-27-miss-circle-showroom-story").filter((entry) => entry.id !== "2026-08-27-movie-night"));
    assert.equal(ordered[0]?.id, "2026-08-26-girlsaward-showroom-6th");
    assert.equal(ordered[1]?.id, "2026-08-26-paton-vote-stories");
    assert.equal(ordered[2]?.id, "2026-08-26-instagram-followers-400");
    assert.equal(ordered[3]?.id, "2026-08-26-morning-stream-thanks");
    assert.equal(ordered[4]?.id, "2026-08-26-girl-award-event-fanroom");
    assert.equal(ordered[5]?.id, NEWS_ID);
    assert.equal(ordered[6]?.id, "2026-08-26-stream-1000");
    assert.deepEqual(
      ordered.filter(({ date }) => date === "2026-08-26").map(({ id }) => id),
      [
        "2026-08-26-girlsaward-showroom-6th",
        "2026-08-26-paton-vote-stories",
        "2026-08-26-instagram-followers-400",
        "2026-08-26-morning-stream-thanks",
        "2026-08-26-girl-award-event-fanroom",
        NEWS_ID,
        "2026-08-26-stream-1000",
      ],
    );
  });

  it("appears on CAMPUS GIRLS and is derived into the Portal Feed without a local image", () => {
    const selected = selectActivityNews("campus-girls");
    const feed = createPortalFeed();
    const feedItem = feed.items.find(
      (candidate) => candidate.id === `mily:news:${NEWS_ID}`,
    );

    assert.equal(selected[0]?.id, "2026-08-28-paton-vote-day-3");
    assert.equal(selected[1]?.id, "2026-08-27-paton-vote-how-to");
    assert.equal(selected[2]?.id, "2026-08-27-mixch-expressive");
    assert.equal(
      selectActivityNews("campus-girls", news, news.length)[3]?.id,
      "2026-08-26-paton-vote-stories",
    );
    assert.equal(
      selectActivityNews("campus-girls", news, news.length)[4]?.id,
      NEWS_ID,
    );
    assert.ok(feedItem);
    assert.equal(feedItem.publishedAt, "2026-08-26T00:00:00+09:00");
    assert.equal(feedItem.sourceUrl, X_SOURCE);
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
    assert.equal(gallery[0]?.item, mixchExpressiveMovie);
    assert.equal(gallery[1]?.item, mixch15xDayMovie);
    assert.equal(gallery[2]?.item, mixchConfidenceMessageMovie);

    const initial = selectGalleryEntries().slice(0, GALLERY_ARCHIVE_INITIAL);
    const preview = selectGalleryPreview(HOME_GALLERY_LIMIT);
    assert.equal(initial.filter((entry) => entry.kind === "mixch").length, 0);
    assert.equal(preview.filter((entry) => entry.kind === "mixch").length, 0);
    assert.equal(preview.every((entry) => entry.kind !== "mixch"), true);

    const activityMedia = selectActivityMedia("campus-girls");
    assert.equal(activityMedia.includes(mixchExpressiveMovie), false);
    assert.equal(activityMedia.includes(mixch15xDayMovie), false);
    assert.equal(activityMedia.includes(mixchConfidenceMessageMovie), false);
    assert.equal(
      activityMedia.some((media) => media.kind === "mixch"),
      false,
    );
    assert.equal(selectActivityNews("campus-girls")[0]?.id, "2026-08-28-paton-vote-day-3");
    assert.equal(selectActivityNews("campus-girls")[1]?.id, "2026-08-27-paton-vote-how-to");
    assert.equal(selectActivityNews("campus-girls")[2]?.id, "2026-08-27-mixch-expressive");
    assert.equal(
      selectActivityNews("campus-girls", news, news.length)[3]?.id,
      "2026-08-26-paton-vote-stories",
    );
    assert.equal(
      selectActivityNews("campus-girls", news, news.length)[4]?.id,
      NEWS_ID,
    );
    assert.equal(
      selectActivityNews("campus-girls", news, news.length)[5]?.id,
      "2026-08-25-mixch-confidence-message",
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
    assert.doesNotMatch(card, /<video[\s>/]/);
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
    assert.match(latest, /media\.published/);
    assert.match(latest, /newsDisplayMedia\(item\)/);

    const gallerySource = sources[2];
    assert.match(
      gallerySource,
      /typeof limit === "number" \? visible : capped/,
    );
    assert.ok(
      gallerySource.indexOf("photos.map") <
        gallerySource.indexOf("mixchCards.map"),
      "photo grid must render before the Mixch / video block",
    );
    assert.match(card, /Mixchが新しいタブで開きます/);

    const activitiesPage = sources[3];
    assert.doesNotMatch(activitiesPage, /MixchOutboundCard/);
    assert.doesNotMatch(activitiesPage, /kind === "mixch"/);
  });

  it("keeps Mixch in Gallery after portraits, not in the HOME / initial photo window", () => {
    const extras = Array.from({ length: 15 }, (_, index) => ({
      kind: "mixch",
      key: `extra-mixch-${index}`,
      item: mixch15xDayMovie,
    }));
    const archive = [...selectGalleryEntries(), ...extras];
    const visible = archive.slice(0, GALLERY_ARCHIVE_INITIAL);
    const mixchInVisible = visible.filter((entry) => entry.kind === "mixch");
    const mixchInArchive = archive.filter((entry) => entry.kind === "mixch");

    assert.ok(mixchInArchive.length > GALLERY_ARCHIVE_INITIAL);
    assert.equal(mixchInVisible.length, 0);
    assert.equal(
      mixchInVisible.length < mixchInArchive.length,
      true,
      "initial photo window must not be Mixch-led",
    );
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
      assert.equal(file.includes("VDojsMY5"), false, file);
      assert.equal(file.includes("mixch-15x"), false, file);
      assert.equal(file.includes("mixch-confidence"), false, file);
      assert.equal(file.includes("mixch-expressive"), false, file);
    }

    assert.equal(mixchExpressiveMovie.poster.startsWith("/media/"), false);
    assert.equal(mixch15xDayMovie.poster.startsWith("/media/"), false);
    assert.equal(mixchConfidenceMessageMovie.poster.startsWith("/media/"), false);
    assert.match(mixchExpressiveMovie.poster, /thumb_normal/);
    assert.match(mixch15xDayMovie.poster, /thumb_normal/);
    assert.match(mixchConfidenceMessageMovie.poster, /thumb_normal/);
  });

  it("does not render unpublished Mixch cards on NEWS or Gallery", () => {
    const unpublished = { ...mixch15xDayMovie, published: false };
    const newsItem = item();

    assert.deepEqual(newsDisplayMedia({ ...newsItem, media: unpublished }), []);
    assert.deepEqual(
      newsDisplayMedia({
        ...newsItem,
        media: unpublished,
        additionalMedia: [unpublished],
      }),
      [],
    );
    assert.equal(newsDisplayMedia(newsItem).includes(mixch15xDayMovie), true);
    assert.deepEqual(visibleGalleryVideos([unpublished]), []);
    assert.equal(
      selectGalleryEntries().some(
        (entry) => entry.kind === "mixch" && entry.item.published === false,
      ),
      false,
    );
  });
});
