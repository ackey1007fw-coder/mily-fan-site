import assert from "node:assert/strict";
import { it } from "node:test";
import { tiktokGoodVibesVideo } from "../src/data/tiktokGoodVibesVideo.ts";
import { news } from "../src/data/news.ts";
import { selectGalleryEntries } from "../src/lib/galleryItems.ts";

it("shares the verified TikTok post between NEWS and Gallery without rehosting its music", () => {
  const video = tiktokGoodVibesVideo;
  const post = news.find((item) => item.id === "2026-09-24-tiktok-good-vibes");
  const gallery = selectGalleryEntries().filter((entry) => entry.key === video.id);

  assert.equal(video.sourceDate, "2026-09-24");
  assert.equal(video.postId, "7689042883369880853");
  assert.equal(video.sourceUrl, "https://www.tiktok.com/@seasidecircle/video/7689042883369880853");
  assert.equal(post?.date, video.sourceDate);
  assert.equal(post?.source, video.sourceUrl);
  assert.equal(post?.media, video);
  assert.equal(gallery.length, 1);
  assert.equal(gallery[0]?.kind, "tiktok");
  assert.equal(gallery[0]?.item, video);
  assert.equal("src" in video, false);
});
