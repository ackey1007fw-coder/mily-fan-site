import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { streamRecap20261012Night, streamRecaps } from "../src/data/streamRecaps.ts";
import { withoutApprovedSongLinks } from "./approved-song-links.mjs";
import { buildStreamSongCatalog } from "../src/lib/streamSongCatalog.ts";

const expected = [
  ["超最強", "超ときめき♡宣伝部", "0:24:20", "Yeahpo-0Ub4"],
  ["ヘビーローテーション", "AKB48", "0:32:20", "lkHlnWFnA0c"],
  ["とくべチュ、して", "＝LOVE", "0:40:00", "F3P8vcZkIh4"],
  ["Mela!", "緑黄色社会", "0:49:02", "aRDURmIYBZ4"],
  ["ファンサ", "mona（CV：夏川椎菜）", "0:56:21", "lzyDD8bMDKs"],
];

test("Oct 12 final-night set has five independently verified songs in singing order", () => {
  const recap = streamRecap20261012Night;
  assert.equal(recap.id, "2026-10-12-final-night-showroom");
  assert.equal(streamRecaps[0], recap, "The original published recap stays top of LIVE STREAM");
  assert.deepEqual(recap.songs.map(song => [
    song.title, song.artist, song.timestamp,
    new URL(song.youtubeUrl).searchParams.get("v"),
  ]), expected);
  assert.ok(recap.songs.every(song => {
    const u = new URL(song.youtubeUrl);
    return u.protocol === "https:" && u.hostname === "www.youtube.com"
      && u.pathname === "/watch" && u.searchParams.size === 1
      && withoutApprovedSongLinks(song.youtubeUrl) === "[approved song link]";
  }));
  assert.ok(recap.songs.every(song => !song.clip && !song.youtubeVersionNote));
  const historicalKaraoke = [
    ["超最強", "Wuyx1pDlDvg"],
    ["とくべチュ、して", "r6dpqf5CRjA"],
    ["Mela!", "W5ykal8c4rY"],
  ];
  for (const [title, videoId] of historicalKaraoke) {
    const song = recap.songs.find(s => s.title === title);
    assert.equal(new URL(song.karaoke.youtubeUrl).searchParams.get("v"), videoId);
    assert.equal(song.karaoke.channel, "カラオケ歌っちゃ王");
  }
  assert.ok(recap.songs.filter(song => song.karaoke).length === 3);
  assert.ok(recap.songs.every(song => song.timestamp.startsWith("0:")),
    "song offsets must be within the first hour of the 138-minute saved recording");
});

test("Existing song catalog automatically inherits the same five links and recap anchor", () => {
  const catalog = buildStreamSongCatalog(streamRecaps);
  for (const [title, artist, timestamp] of expected) {
    const entry = catalog.find(song => song.title === title && song.artist === artist);
    assert.ok(entry, `Missing song from global catalog: ${title}`);
    assert.ok(entry.performances.some(p => p.id === "2026-10-12-final-night-showroom" && p.timestamp === timestamp),
      `Missing final-night performance: ${title}`);
  }
  const ui = readFileSync(new URL("../src/ActivitiesPage.tsx", import.meta.url), "utf8");
  assert.match(ui, /title="この回に歌った曲"/);
  assert.match(ui, /href=\{song\.youtubeUrl\}/);
  assert.match(ui, /target="_blank"/);
  assert.match(ui, /rel="noopener noreferrer"/);
});

test("New public song metadata does not claim unheard song lyrics or fabricate original audio review", () => {
  const recap = streamRecap20261012Night;
  assert.match(recap.transcriptionNote, /全編の手動実聴・逐語校正は未実施/);
  assert.match(recap.transcriptionNote, /歌唱した5曲の曲名は自動文字起こしの歌唱区間と原曲の公表歌詞を照合/);
  assert.match(recap.transcriptionNote, /歌詞、個別のリスナー名、ギフトや順位の未確定数値は掲載していません/);
  assert.doesNotMatch(recap.transcriptionNote, /歌唱の曲名・歌詞.*掲載していません/);
  assert.equal(recap.songs.length, 5);
  assert.ok(recap.songs.every(song => !Object.hasOwn(song, "lyrics")));
  const previousDay = streamRecaps[1];
  assert.equal(previousDay.id, "2026-10-12-asa-showroom");
});
