import assert from "node:assert/strict";
import { it } from "node:test";
import { tiktokGoodVibesVideo } from "../src/data/tiktokGoodVibesVideo.ts";
import { news } from "../src/data/news.ts";
import { selectGalleryEntries } from "../src/lib/galleryItems.ts";
import { verifyNews } from "./content-invariants.mjs";

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

it("validates canonical TikTok media and rejects rehosted or mismatched posts", () => {
  const item = news.find((entry) => entry.id === "2026-09-24-tiktok-good-vibes");
  assert.ok(item);
  assert.deepEqual(verifyNews([item]), []);
  assert.ok(verifyNews([{ ...item, media: { ...tiktokGoodVibesVideo, src: "/media/copied.mp4" } }])
    .some((error) => error.includes("official TikTok player")));
  assert.ok(verifyNews([{ ...item, media: { ...tiktokGoodVibesVideo, postId: "123" } }])
    .some((error) => error.includes("confirmed TikTok post URL")));
  assert.ok(verifyNews([{ ...item, media: { ...tiktokGoodVibesVideo, sourceDate: "2026-09-23" } }])
    .some((error) => error.includes("matching sourceDate")));
});
