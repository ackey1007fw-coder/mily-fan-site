import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { activities } from "../src/data/activities.ts";
import { links } from "../src/data/links.ts";
import { radioMusicEpisodes } from "../src/data/radioMusic.ts";
import { radioMusicUrl, sitemapXml } from "../src/data/site.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = (relative) => readFileSync(path.join(root, relative), "utf8");

describe("radio on-air music archive", () => {
  it("builds the dedicated route and exposes it from the radio activity", () => {
    const viteConfig = source("vite.config.ts");
    assert.match(viteConfig, /activityRadioMusic:\s*"activities\/radio\/music\/index\.html"/);
    assert.doesNotThrow(() => source("activities/radio/music/index.html"));

    const radio = activities.find(({ id }) => id === "radio");
    assert.ok(radio?.relatedLinkIds.includes("mily-radio-on-air-music"));
    const archiveLink = links.find(({ id }) => id === "mily-radio-on-air-music");
    assert.equal(archiveLink?.url, radioMusicUrl());
  });

  it("keeps the archive discoverable in the sitemap", () => {
    assert.match(sitemapXml(), new RegExp(`<loc>${radioMusicUrl()}</loc>`));
  });

  it("only stores explicit public YouTube destinations for confirmed songs", () => {
    for (const episode of radioMusicEpisodes) {
      assert.ok(episode.songs.length > 0, `${episode.id} has no songs`);
      assert.equal(new Set(episode.songs.map(({ youtubeUrl }) => youtubeUrl)).size, episode.songs.length);
      const times = episode.songs.filter(({ timestamp }) => timestamp).map(({ timestamp }) => {
        assert.match(timestamp, /^\d+:[0-5]\d:[0-5]\d$/);
        return timestamp.split(":").reduce((total, part) => total * 60 + Number(part), 0);
      });
      assert.deepEqual(times, [...times].sort((a, b) => a - b));
      for (const song of episode.songs) {
        assert.ok(song.title.trim(), `${episode.id}: missing title`);
        assert.ok(song.artist.trim(), `${episode.id}: missing artist`);
        const destination = new URL(song.youtubeUrl);
        assert.equal(destination.protocol, "https:");
        assert.ok(["youtube.com", "www.youtube.com"].includes(destination.hostname));
        assert.equal(destination.pathname, "/watch");
        assert.match(destination.searchParams.get("v") ?? "", /^[A-Za-z0-9_-]{11}$/);
      }
    }
  });
});
