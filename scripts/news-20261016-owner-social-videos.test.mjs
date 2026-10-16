import assert from "node:assert/strict";
import { it } from "node:test";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { tiktokSeasideCircleSharedVideo } from "../src/data/tiktokSeasideCircleSharedVideo.ts";
import { selectGalleryEntries } from "../src/lib/galleryItems.ts";
import { verifyNews } from "./content-invariants.mjs";

it("adds the owner-specified X post exactly once via the official post embed", () => {
  const matches = news.filter(({ id }) => id === "2026-10-16-x-red-riding-hood-new-video");
  assert.equal(matches.length, 1);
  const post = matches[0];
  assert.equal(post.date, "2026-10-16");
  assert.equal(post.source, "https://x.com/mily_chan36/status/2110892605605363858");
  assert.equal(post.xEmbed?.postId, "2110892605605363858");
  assert.equal(post.xEmbed?.sourceUrl, post.source);
  assert.equal(post.media, undefined, "do not pretend the uploaded MP4 is self-hosted");
  assert.match(post.body, /完全な一致は未検証/);
  assert.deepEqual(verifyNews(matches), []);
});

it("publishes only the canonical TikTok link until the program video can be inspected", () => {
  const postUrl = "https://www.tiktok.com/@seasidecircle/video/7696465009018195221";
  const video = tiktokSeasideCircleSharedVideo;
  const matches = news.filter(({ id }) => id === "2026-10-16-tiktok-seasidecircle-shared");
  const gallery = selectGalleryEntries().filter(({ key }) => key === video.id);

  assert.equal(matches.length, 1);
  assert.equal(video.kind, "tiktok");
  assert.equal(video.postId, "7696465009018195221");
  assert.equal(video.sourceUrl, postUrl);
  assert.equal(video.sourceDate, null);
  assert.equal(video.published, false);
  assert.equal(matches[0].dateBasis, "confirmed-on");
  assert.match(matches[0].body, /投稿日は未確認/);
  assert.match(matches[0].body, /みりぃ本人の登場有無/);
  assert.match(matches[0].body, /リンクのみ/);
  assert.equal(matches[0].source, postUrl);
  assert.equal(matches[0].media, undefined, "do not embed unreviewed program content");
  assert.equal(matches[0].xEmbed, undefined);
  assert.equal(gallery.length, 0, "unreviewed media must not appear in Gallery");
  assert.equal("src" in video, false, "do not rehost TikTok audio or video");
  assert.equal("poster" in video, false, "do not hotlink an uninspected cover");
  assert.deepEqual(verifyNews(matches), []);

  const sorted = sortNewsByDateDesc(news).map(({ id }) => id);
  assert.ok(sorted.indexOf("2026-10-16-x-red-riding-hood-new-video")
    < sorted.indexOf("2026-10-16-tiktok-seasidecircle-shared"));
  assert.ok(sorted.indexOf("2026-10-16-tiktok-seasidecircle-shared")
    < sorted.indexOf("2026-10-15-miss-circle-semifinal-advance"));
});
