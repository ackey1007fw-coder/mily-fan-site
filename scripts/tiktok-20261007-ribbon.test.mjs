import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { it } from "node:test";
import { tiktokOct04SelfieVideo } from "../src/data/tiktokOct04SelfieVideo.ts";
import { tiktokOct07RibbonVideo } from "../src/data/tiktokOct07RibbonVideo.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { selectGalleryEntries } from "../src/lib/galleryItems.ts";
import { verifyNews } from "./content-invariants.mjs";

const cases = [
  {
    video: tiktokOct07RibbonVideo,
    newsId: "2026-10-07-tiktok-ribbon",
    date: "2026-10-07",
    postId: "7693884484030123284",
  },
  {
    video: tiktokOct04SelfieVideo,
    newsId: "2026-10-04-tiktok-selfie",
    date: "2026-10-04",
    postId: "7692539548055751957",
  },
];

it("publishes each of the two verified owner-specified TikToks once in NEWS and Gallery", () => {
  const gallery = selectGalleryEntries();
  for (const { video, newsId, date, postId } of cases) {
    const source = `https://www.tiktok.com/@seasidecircle/video/${postId}`;
    const posts = news.filter((item) => item.id === newsId);
    const entries = gallery.filter((item) => item.key === video.id);
    assert.equal(posts.length, 1, newsId);
    assert.equal(entries.length, 1, video.id);
    assert.equal(entries[0].kind, "tiktok");
    assert.equal(entries[0].item, video, "NEWS and Gallery share the identical object");
    assert.equal(video.kind, "tiktok");
    assert.equal(video.postId, postId);
    assert.equal(video.sourceUrl, source);
    assert.equal(video.sourceDate, date);
    assert.equal(posts[0].date, date);
    assert.equal(posts[0].source, source);
    assert.equal(posts[0].media, video);
    assert.equal(video.published, true);
    assert.equal("src" in video, false, "never self-host a music-backed TikTok");
    assert.equal("poster" in video, false, "never hotlink a TikTok cover");
    assert.deepEqual(verifyNews(posts), []);
  }

  const positions = sortNewsByDateDesc(news).map((item) => item.id);
  assert.ok(positions.indexOf(cases[0].newsId) < positions.indexOf(cases[1].newsId));
  assert.ok(positions.indexOf(cases[1].newsId) < positions.indexOf("2026-10-03-confirmed-tiktok-campus-makeup"));
});

it("uses the official lazy-loaded TikTok player and retains the canonical post link", async () => {
  const source = await readFile(new URL("../src/components/TikTokEmbedCard.tsx", import.meta.url), "utf8");
  assert.match(source, /tiktok\.com\/player\/v1\/\$\{video\.postId\}/);
  assert.match(source, /loading="lazy"/);
  assert.match(source, /href=\{video\.sourceUrl\}/);
  assert.equal(new Set(cases.map(({ video }) => video.postId)).size, 2);
});
