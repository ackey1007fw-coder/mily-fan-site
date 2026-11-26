import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { campusGirlsFinalsExFourPatonVoteLink, links } from "../src/data/links.ts";
import { campusGirlsEx4StoryVideo } from "../src/data/campusGirlsEx4StoryVideo.ts";
import { news } from "../src/data/news.ts";

test("Ex.4 NEWS, Story and Paton link share the confirmed details", () => {
  const item = news.find(({ id }) => id === "2026-11-23-campus-girls-ex4-paton-vote");
  assert.ok(item);
  assert.equal(news[3], item);
  assert.equal(item.date, "2026-11-23");
  assert.equal(item.title, "CAMPUS GIRLS 2027 本選Ex.4、今日限定のパトン投票スタート");
  assert.equal(item.media, campusGirlsEx4StoryVideo);
  assert.equal(item.source, campusGirlsFinalsExFourPatonVoteLink.url);
  assert.equal(item.ctaLabel, campusGirlsFinalsExFourPatonVoteLink.label);
  assert.ok(links.includes(campusGirlsFinalsExFourPatonVoteLink));
  assert.equal(item.source, "https://paton.jp/event/entrant/14940");
  assert.match(item.body, /無料拍手/);
  assert.match(item.body, /11月23日限定/);
  assert.deepEqual(campusGirlsEx4StoryVideo, {
    id: "mily-b277-01-campus-girls-ex4-story", kind: "video",
    alt: "タリーズコーヒーのカップを持つみりぃの自撮りに「今日限定パトン投票」と案内が載ったInstagram Story動画（音声なし）",
    src: "/media/gallery/mily-b277-01-campus-girls-ex4-story.mp4",
    poster: "/media/gallery/mily-b277-01-campus-girls-ex4-story-poster.jpg",
    width: 720, height: 1280, provenance: "owner-provided",
    sourceLabel: "Instagram Story", sourceDate: "2026-11-23", published: true,
  });
});

test("public media matches the provided files", async () => {
  for (const [src, bytes, hash] of [
    [campusGirlsEx4StoryVideo.src, 235752, "2685e6fb952ed107836c08d7bbf0049362ab4f59a75afc59e5ed4417b117084b"],
    [campusGirlsEx4StoryVideo.poster, 129473, "bb9e9b01fcbe90030041121d3d38fc45739e7abd7ce257428628a0d26cacc6d8"],
  ]) {
    const data = await readFile(new URL(`../public${src}`, import.meta.url));
    assert.equal(data.length, bytes);
    assert.equal(createHash("sha256").update(data).digest("hex"), hash);
  }
});
