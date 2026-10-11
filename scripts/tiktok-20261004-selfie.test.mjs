import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { it } from "node:test";
import { tiktokOct04SelfieVideo } from "../src/data/tiktokOct04SelfieVideo.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { selectGalleryEntries } from "../src/lib/galleryItems.ts";
import { verifyNews } from "./content-invariants.mjs";

const sourceUrl = "https://www.tiktok.com/@seasidecircle/video/7692539548055751957";

it("shares the verified October 4 TikTok post between NEWS and Gallery", () => {
  const video = tiktokOct04SelfieVideo;
  const posts = news.filter((item) => item.id === "2026-10-04-tiktok-selfie");
  const entries = selectGalleryEntries().filter((entry) => entry.key === video.id);

  assert.equal(posts.length, 1);
  assert.equal(video.postId, "7692539548055751957");
  assert.equal(video.sourceUrl, sourceUrl);
  assert.equal(video.sourceDate, "2026-10-04");
  assert.equal(video.published, true);
  assert.equal(posts[0].source, sourceUrl);
  assert.equal(posts[0].date, video.sourceDate);
  assert.equal(posts[0].media, video);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].kind, "tiktok");
  assert.equal(entries[0].item, video);
  assert.equal("src" in video, false, "TikTok audio/video must not be self-hosted");

  const sorted = sortNewsByDateDesc(news);
  assert.ok(
    sorted.findIndex((item) => item.id === posts[0].id) <
      sorted.findIndex((item) => item.id === "2026-10-03-confirmed-tiktok-campus-makeup"),
    "the October 4 post must precede older October 3 NEWS",
  );
  assert.deepEqual(verifyNews(posts), []);
});

it("uses the existing lazy TikTok official player and preserves the original link", async () => {
  const component = await readFile(
    new URL("../src/components/TikTokEmbedCard.tsx", import.meta.url),
    "utf8",
  );
  assert.match(component, /tiktok\.com\/player\/v1\/\$\{video\.postId\}/);
  assert.match(component, /loading="lazy"/);
  assert.match(component, /href=\{video\.sourceUrl\}/);
  assert.doesNotMatch(tiktokOct04SelfieVideo.sourceUrl, /vt\.tiktok\.com/);
});
