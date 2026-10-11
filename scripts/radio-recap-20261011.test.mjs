import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { radioEpisode20261011 as recap } from "../src/data/radioEpisode20261011.ts";
import { radioEpisodes } from "../src/data/radioEpisodes.ts";
import { radioMusicEpisodes } from "../src/data/radioMusic.ts";
import { news } from "../src/data/news.ts";
import { radioOct11Stories } from "../src/data/radioOct11Stories.ts";

const toSeconds = (stamp) => stamp.split(":").reduce((n, part) => n * 60 + Number(part), 0);

describe("October 11 radio: tournament full-broadcast recap", () => {
  it("adds the October 11 broadcast first while retaining all previous reports", () => {
    assert.equal(radioEpisodes[0], recap);
    assert.ok(radioEpisodes.some(({ id }) => id === "2026-10-04-anniversary"));
    assert.ok(radioEpisodes.some(({ id }) => id === "2026-09-27-kawaii"));
    assert.deepEqual(radioEpisodes.map(({ date }) => date), radioEpisodes.map(({ date }) => date).toSorted().reverse());
    assert.equal(new Set(radioEpisodes.map(({ id }) => id)).size, radioEpisodes.length);
    assert.equal(recap.theme, "大会");
    assert.deepEqual(recap.presenters, ["みりぃ", "もこ（ディレクター）"]);
  });

  it("covers the entire program with detailed highlights and an aligned timeline", () => {
    assert.equal(recap.milyHighlights.length, 18);
    assert.equal(recap.listenerMessages.length, 5);
    assert.equal(recap.timeline.length, 18);
    assert.deepEqual(recap.timeline.map(({ timestamp }) => timestamp), recap.milyHighlights.map(({ timestamp }) => timestamp));
    for (const set of [recap.timeline, recap.milyHighlights, recap.listenerMessages]) {
      const stamps = set.map(({ timestamp }) => timestamp);
      assert.ok(stamps.every((value) => /^\d+:[0-5]\d:[0-5]\d$/.test(value)));
      assert.equal(new Set(stamps).size, stamps.length);
      assert.deepEqual(stamps.map(toSeconds), stamps.map(toSeconds).toSorted((a, b) => a - b));
      assert.ok(stamps.every((value) => toSeconds(value) >= 120 && toSeconds(value) <= 10700));
    }
    for (const topic of ["大会", "応援", "熱血ヒロイン", "アカペラ", "胸キュン", "海そば", "一句", "ネクスト"]) {
      const body = JSON.stringify(recap.milyHighlights) + recap.summary;
      assert.ok(body.includes(topic), topic);
    }
  });

  it("discloses source limits and does not publish recordings, DM, or personal identifiers", () => {
    assert.match(recap.transcriptionNote, /全編の手動聴取・逐語校正は未実施/);
    assert.match(recap.transcriptionNote, /楽曲名『明日も』はリスナーのリアルタイム聴取/);
    const quoted = recap.milyHighlights.filter((highlight) => highlight.quote !== undefined);
    assert.equal(quoted.length, 1);
    assert.match(quoted[0].quote, /認めよう.*幸せ噛みしめ.*ネクストへ/);
    assert.match(recap.transcriptionNote, /2種類の自動文字起こしで照合した暫定表記/);
    const publicText = JSON.stringify(recap);
    assert.doesNotMatch(publicText, /\.ogg|\.mp4|\.m4a|C:\\\\|Library|libfile_|private\.md|@ackey|school|DM|教頭|教師|担任/);
    assert.ok(recap.listenerMessages.every((message) => Object.keys(message).every((key) => ["timestamp", "title", "body"].includes(key))));
    assert.doesNotMatch(JSON.stringify(recap.listenerMessages), /ラジオネーム|投稿者名|学校の職業|住所|gmail|アドレス/);
  });

  it("keeps the radio on-air music integrated, without changing the curated playlist", () => {
    const music = radioMusicEpisodes.find(({ id }) => id === recap.id);
    assert.ok(music);
    assert.ok(music.songs.length >= 10);
    assert.equal(radioMusicEpisodes[0].id, "2026-10-11-taikai");
    assert.equal(music.songs[0].title, "好きすぎて滅！");
    const page = readFileSync("src/ActivitiesPage.tsx", "utf8");
    assert.match(page, /musicEpisode = radioMusicEpisodes\.find/);
    assert.match(page, /<RadioEpisodeRecapArticle/);
  });

  it("puts a discoverable NEWS link beside the approved October 11 promo videos", () => {
    assert.equal(news.some(({ id }) => id === "2026-10-11-radio-taikai-recap"), false);
    const promo = news.find(({ id }) => id === "2026-10-11-radio-tournament-stories");
    assert.ok(promo);
    assert.ok(promo.additionalCtas?.some((link) =>
      link.url === "https://mily-fan-site.vercel.app/activities/radio/#2026-10-11-taikai-mily-highlights"
    ));
    assert.ok(promo);
    assert.equal(promo.media?.id, radioOct11Stories[0].id);
    assert.equal(promo.additionalMedia?.length, 1);
    assert.equal(radioOct11Stories.every((story) => story.published), true);
  });
});
