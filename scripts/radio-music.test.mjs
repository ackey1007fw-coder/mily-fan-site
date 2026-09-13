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
      for (const song of episode.songs) {
        assert.ok(song.title.trim(), `${episode.id}: missing title`);
        assert.ok(song.artist.trim(), `${episode.id}: missing artist`);
        assert.match(song.youtubeUrl, /^https:\/\/(www\.)?youtube\.com\/watch\?/);
      }
    }
  });
});
