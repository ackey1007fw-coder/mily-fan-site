import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  PUBLIC_SHORTS_ROUTE,
  PUBLIC_SHORTS_CHANNEL,
  UNLISTED_OR_UNAPPROVED_VIDEO_IDS,
  publicShorts,
  publicShortUrl,
  publicShortEmbedUrl,
  publicShortRecapUrl,
} from "../src/data/publicShorts.ts";
import { shortsPageMetadata } from "../src/lib/shortsMetadata.ts";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("curated 35 public Mily shorts are ordered newest recorded day first", () => {
  assert.equal(publicShorts.length, 35);
  assert.equal(new Set(publicShorts.map((v) => v.id)).size, publicShorts.length);
  assert.deepEqual(publicShorts.slice(0, 2).map((v) => v.id), ["0lEzZS76oik", "0BuivWfuQiY"]);
  for (const [index, short] of publicShorts.entries()) {
    assert.match(short.id, /^[A-Za-z0-9_-]{11}$/);
    assert.match(short.streamDate, /^20\d\d-\d\d-\d\d$/);
    assert.match(short.title, /.+/);
    assert.ok(["talk", "gesture", "audio"].includes(short.category));
    if (index) assert.ok(publicShorts[index - 1].streamDate >= short.streamDate);
    if (short.durationSeconds !== undefined) {
      assert.ok(short.durationSeconds > 0 && short.durationSeconds <= 60);
    }
    assert.equal(publicShortUrl(short), "https://www.youtube.com/shorts/" + short.id);
    assert.equal(publicShortEmbedUrl(short), "https://www.youtube-nocookie.com/embed/" + short.id + "?autoplay=1&playsinline=1");
    assert.ok(publicShortRecapUrl(short).startsWith("/activities/live/"));
  }
  assert.equal(PUBLIC_SHORTS_CHANNEL, "https://www.youtube.com/@ouen_archive/shorts");
});

test("no private archive, unlisted night clip, unrelated streamer or singing media leak to public hub", () => {
  const ids = new Set(publicShorts.map((v) => v.id));
  for (const id of [
    ...UNLISTED_OR_UNAPPROVED_VIDEO_IDS,
    "H0S4XkKDIl4",
    "DkEppfH5xog", "lNKsUxqK_c8", "LMZS1UqsPuo",
    "MVWH7CXkjEk", "_6f048RDIzw",
    "y-2MIOeTRdU",
  ]) assert.equal(ids.has(id), false, id);
  assert.doesNotMatch(JSON.stringify(publicShorts), /KOOyDO8MZuk|AcLkrNTC-Sw|8ZmCS8uIFzo|y-2MIOeTRdU/);
});

test("Oct 15 morning pair have exact owner-published X, Instagram, TikTok and PUBLIC YouTube IDs", () => {
  for (const v of publicShorts.slice(0, 2)) {
    assert.equal(v.streamDate, "2026-10-15");
    assert.equal(v.durationSeconds, 28);
    assert.equal(v.recapId, "2026-10-15-morning-showroom");
    assert.match(v.socialLinks.x, /^https:\/\/x\.com\/ackey_RiRi_supp\/status\/\d+$/);
    assert.match(v.socialLinks.instagram, /^https:\/\/www\.instagram\.com\/reel\/[A-Za-z0-9_-]+\/$/);
    assert.match(v.socialLinks.tiktok, /^https:\/\/www\.tiktok\.com\/@ackeytan_\/video\/\d+$/);
  }
  assert.equal(publicShorts[0].socialLinks.x.endsWith("2110698271211425854"), true);
  assert.equal(publicShorts[1].socialLinks.x.endsWith("2110698031213425048"), true);
});

test("public hub preserves old singing clip page and adds canonical links from HOME/LIVE/Gallery", () => {
  assert.equal(PUBLIC_SHORTS_ROUTE, "/activities/live/shorts/");
  assert.equal(shortsPageMetadata.canonical, "https://mily-fan-site.vercel.app/activities/live/shorts/");
  assert.match(shortsPageMetadata.title, /非公式/);
  assert.match(read("src/App.tsx"), /ShortsGateway/);
  assert.match(read("src/ActivitiesPage.tsx"), /ShortsGateway/);
  assert.match(read("src/components/Gallery.tsx"), /みりぃのショート動画/);
  assert.match(read("src/SongClipsPage.tsx"), /ショート動画/);
  assert.match(read("src/data/site.ts"), /shortsUrl\(\)/);
  assert.match(read("vite.config.ts"), /activityLiveShorts:/);
  assert.match(read("vite.config.ts"), /__SHORTS_CANONICAL__/);
  assert.match(read("activities/live/shorts/index.html"), /\/src\/shorts-main\.tsx/);
  assert.match(read("src/ShortsPage.tsx"), /youtube-nocookie|publicShortEmbedUrl/);
  assert.match(read("src/ShortsPage.tsx"), /もっと見る/);
  assert.match(read("src/ShortsPage.tsx"), /isPlaying \?/);
  assert.match(read("src/SongClipsPage.tsx"), /SongPostCollection/);
  assert.match(read("src/ActivitiesPage.tsx"), /StreamSongClipsEntry/);
});
