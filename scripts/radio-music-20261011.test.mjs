import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { radioMusicEpisodes, radioMusicPlaylist } from "../src/data/radioMusic.ts";

describe("2026-10-11 radio on-air music incremental archive", () => {
  const episode = radioMusicEpisodes.find((item) => item.id === "2026-10-11-taikai");

  it("preserves the exact dated episode and describes its provisional coverage", () => {
    assert.ok(episode);
    assert.equal(episode.date, "2026-10-11");
    assert.equal(episode.theme, "大会");
    assert.equal(episode.songs.length, 10);
    assert.match(episode.note ?? "", /全曲網羅ではありません/);
    assert.match(episode.note ?? "", /曲紹介時点/);
    assert.equal(radioMusicEpisodes.filter((item) => item.date === "2026-10-11").length, 1);
  });

  it("stores official links in announced order without removing older episodes", () => {
    assert.ok(episode);
    const pairs = episode.songs.map(({ artist, title }) => `${artist}:${title}`);
    assert.deepEqual(pairs, [
      "M!LK:好きすぎて滅！",
      "Mrs. GREEN APPLE:アポロドロス",
      "SEKAI NO OWARI:RPG",
      "星野源:Family Song",
      "Panic! At The Disco:High Hopes",
      "YOASOBI:アドベンチャー",
      "Mariah Carey:Vision of Love",
      "aiko:ボーイフレンド",
      "FUNKY MONKEY BABYS:ヒーロー",
      "Charlie Puth:Changes",
    ]);
    assert.ok(radioMusicEpisodes.some((item) => item.id === "2026-09-27-kawaii"));
    assert.ok(radioMusicEpisodes.some((item) => item.id === "2026-09-13-solo-theme"));
    assert.equal(radioMusicPlaylist.url, "https://www.youtube.com/playlist?list=PLD69UVBfxh5g");
    const videoIds = episode.songs.map((song) => new URL(song.youtubeUrl).searchParams.get("v"));
    assert.equal(new Set(videoIds).size, 10);
    assert.deepEqual(videoIds, [
      "ZVUxJsPfoX8", "dOR5-Y80CUA", "Mi9uNu35Gmk",
      "Ucbp-Ej5RpI", "IPXIgEAGe4U", "Av3xaZkVpJs",
      "tov22NtCMC4", "9Jh-FBYGaU4", "uJ8ViGoaV6k", "Jrf8N1EMUhg",
    ]);
  });
});
