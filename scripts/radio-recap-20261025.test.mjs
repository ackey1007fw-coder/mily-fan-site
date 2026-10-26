import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { describe, it } from "node:test";
import { radioEpisode20261025 as recap } from "../src/data/radioEpisode20261025.ts";
import { radioEpisodes } from "../src/data/radioEpisodes.ts";
import { radioMusicEpisodes } from "../src/data/radioMusic.ts";
import { news } from "../src/data/news.ts";

describe("October 25 radio: recap and talk video publication", () => {
  it("keeps this broadcast in date order and all times within the three-hour program", () => {
    assert.equal(radioEpisodes.filter(({ date }) => date <= recap.date)[0], recap);
    for (const rows of [recap.milyHighlights, recap.listenerMessages, recap.timeline]) {
      const times = rows.map(({ timestamp }) => {
        assert.match(timestamp, /^\d+:[0-5]\d:[0-5]\d$/);
        return timestamp.split(":").reduce((n, part) => n * 60 + Number(part), 0);
      });
      assert.equal(new Set(times).size, times.length);
      assert.deepEqual(times, times.toSorted((a, b) => a - b));
      assert.ok(times.every((time) => time >= 0 && time < 3 * 60 * 60));
    }
  });

  it("preserves the requested poem with its transcription context and source limits", () => {
    const poem = recap.milyHighlights.find(({ quote }) => quote);
    assert.equal(poem.quote, "空回り\n余裕も大事\n前を向け");
    assert.equal(poem.quoteNote, "音声の書き起こし");
    assert.match(recap.transcriptionNote, /自動文字起こし/);
    assert.match(recap.transcriptionNote, /全編の手動聴取・逐語校正は行っていません/);
    assert.match(recap.transcriptionNote, /編集動画の再生位置とは異なります/);
    assert.doesNotMatch(JSON.stringify(recap), /libfile_|drive\.google|C:\\|\.ogg|\.jsonl|\.part|@ackey|ナビ|高速|勤務先|住所/);
  });

  it("connects the episode to its confirmed music and the existing announcement", () => {
    const music = radioMusicEpisodes.find(({ id }) => id === recap.id);
    assert.equal(music?.songs.length, 13);
    assert.equal(music?.date, recap.date);
    assert.match(music.note, /確認できた13曲/);
    assert.match(music.note, /放送で使われた版・尺と異なる場合/);
    const announcement = news.find(({ id }) => id === "2026-10-25-radio-halloween-stories");
    assert.ok(announcement.additionalCtas.some(({ url }) => url.endsWith(`/activities/radio/#radio-${recap.id}`)));
  });

  it("publishes only the three approved excerpts with their existing local covers", () => {
    assert.equal(recap.talkVideos.length, 3);
    assert.deepEqual(recap.talkVideos.map(({ id }) => id), [
      "radio-20261025-haiku", "radio-20261025-kyun", "radio-20261025-actor",
    ]);
    assert.deepEqual(recap.talkVideos.map(({ youtubeUrl }) => new URL(youtubeUrl).searchParams.get("v")), [
      "U5MERfYNg_o", "zh-pSqs80wo", "K5XFOqYT4r8",
    ]);
    assert.equal(new Set(recap.talkVideos.map(({ id }) => id)).size, recap.talkVideos.length);
    assert.equal(new Set(recap.talkVideos.map(({ youtubeUrl }) => youtubeUrl)).size, recap.talkVideos.length);
    for (const video of recap.talkVideos) {
      const url = new URL(video.youtubeUrl);
      assert.equal(url.protocol, "https:");
      assert.equal(url.hostname, "www.youtube.com");
      assert.equal(url.pathname, "/watch");
      assert.match(url.searchParams.get("v"), /^[A-Za-z0-9_-]{11}$/);
      assert.ok(video.title && video.description && video.durationLabel && video.sourceTimeLabel);
      assert.ok(video.poster.src.startsWith("/media/"));
      assert.ok(existsSync(`public${video.poster.src}`));
      assert.ok(video.poster.width > 0 && video.poster.height > 0);
    }
    const titles = recap.talkVideos.map(({ title }) => title).join(" ");
    for (const topic of ["一句", "胸キュン", "ルシファー"]) assert.ok(titles.includes(topic), topic);
    assert.doesNotMatch(JSON.stringify(recap.talkVideos), /fulltalk|フル版|全体版/);
    assert.deepEqual(readdirSync("public/media/radio").filter((name) => name.includes("b239")).sort(),
      recap.talkVideos.map(({ poster }) => poster.src.split("/").at(-1)).sort(),
      "Public b239 assets contain only the approved excerpt covers");
  });
});
