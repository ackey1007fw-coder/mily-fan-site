import assert from "node:assert/strict";
import { it } from "node:test";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { tiktokSeasideCirclePoseVideo } from "../src/data/tiktokSeasideCirclePoseVideo.ts";
import { selectGalleryEntries } from "../src/lib/galleryItems.ts";
import { verifyNews } from "./content-invariants.mjs";

it("publishes only the specified second @seasidecircle TikTok once on NEWS and Gallery", () => {
  const canonicalUrl = "https://www.tiktok.com/@seasidecircle/video/7697054724977151253";
  const itemId = "2026-10-16-tiktok-seasidecircle-hand-poses";
  const video = tiktokSeasideCirclePoseVideo;
  const entries = news.filter((item) => item.id === itemId);
  const gallery = selectGalleryEntries().filter((entry) => entry.key === video.id);

  assert.equal(entries.length, 1);
  assert.equal(video.kind, "tiktok");
  assert.equal(video.postId, "7697054724977151253");
  assert.equal(video.sourceUrl, canonicalUrl);
  assert.equal(video.sourceDate, null);
  assert.equal(video.published, true);
  assert.equal(entries[0].date, "2026-10-16");
  assert.equal(entries[0].dateBasis, "confirmed-on");
  assert.equal(entries[0].source, canonicalUrl);
  assert.equal(entries[0].media, video);
  assert.match(entries[0].body, /完全な一致は未検証/);
  assert.match(entries[0].body, /投稿日.*未確認/);
  assert.equal(gallery.length, 1);
  assert.equal(gallery[0].kind, "tiktok");
  assert.equal(gallery[0].item, video);
  assert.equal("src" in video, false, "no copied audio/video or self-hosting");
  assert.equal("poster" in video, false, "do not hotlink TikTok thumbnails");
  assert.deepEqual(verifyNews(entries), []);

  const sorted = sortNewsByDateDesc(news).map(({ id }) => id);
  assert.ok(sorted.indexOf(itemId) < sorted.indexOf("2026-10-15-miss-circle-semifinal-advance"));
});

it("does not mistake the earlier shared TikTok for the owner-specified post", () => {
  const firstPostId = "7696465009018195221";
  const secondPostId = tiktokSeasideCirclePoseVideo.postId;
  assert.notEqual(secondPostId, firstPostId);
  assert.equal(
    selectGalleryEntries().filter((entry) => entry.key === tiktokSeasideCirclePoseVideo.id).length,
    1,
  );
});

it("preserves the separately shared earlier October 16 TikTok when integrated with main", () => {
  const prior = news.filter(({ id }) => id === "2026-10-16-tiktok-seasidecircle-shared");
  assert.equal(prior.length, 1);
  assert.equal(
    prior[0].source,
    "https://www.tiktok.com/@seasidecircle/video/7696465009018195221",
  );
  assert.notEqual(prior[0].source, tiktokSeasideCirclePoseVideo.sourceUrl);
});
