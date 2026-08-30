import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { radioEpisode20260830 } from "../src/data/radioEpisodes.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("2026-08-30 湘南シーサイドサークル映画特集", () => {
  it("stores the verified episode summary separately from weekly schedule state", () => {
    const episode = radioEpisode20260830;

    assert.equal(episode.date, "2026-08-30");
    assert.equal(episode.theme, "映画特集");
    assert.equal(episode.broadcastLabel, "10:00〜13:00 生放送");
    assert.deepEqual(episode.presenters, ["師匠", "みりぃ", "かず坊"]);
    assert.equal(episode.verifiedAt, "2026-08-30");
    assert.match(episode.sourceLabel, /オーナー提供/);
    assert.match(episode.summary, /天女と五頭龍/);
    assert.match(episode.transcriptionNote, /録音音声と全文文字起こしは掲載していません/);
  });

  it("captures Mily highlights, listener messages, and an ordered timeline", () => {
    const episode = radioEpisode20260830;

    assert.equal(episode.milyHighlights.length, 6);
    assert.equal(episode.listenerMessages.length, 2);
    assert.equal(episode.timeline.length, 14);
    assert.ok(episode.milyHighlights.some(({ title }) => /君の名は/.test(title)));
    assert.ok(episode.milyHighlights.some(({ quote }) => /街の吐息や/.test(quote ?? "")));
    assert.ok(episode.listenerMessages.some(({ title }) => /ズートピア/.test(title)));
    assert.ok(episode.listenerMessages.some(({ title }) => /永遠の0/.test(title)));

    const seconds = episode.timeline.map(({ timestamp }) => {
      const [hour, minute, second] = timestamp.split(":").map(Number);
      return hour * 3600 + minute * 60 + second;
    });
    assert.deepEqual(seconds, [...seconds].sort((left, right) => left - right));
  });

  it("renders only on the Radio Activity without publishing private archive files", async () => {
    const page = await readFile(path.join(root, "src/ActivitiesPage.tsx"), "utf8");
    const data = await readFile(path.join(root, "src/data/radioEpisodes.ts"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");

    assert.match(page, /function RadioEpisodeRecap/);
    assert.match(page, /activityId !== "radio"/);
    assert.match(page, /みりぃの見どころ/);
    assert.match(page, /番組で紹介されたリスナーメッセージ/);
    assert.match(page, /主なコーナーとタイムスタンプを見る/);
    assert.match(page, /<RadioEpisodeRecap activityId=\{content\.activity\.id\} \/>/);

    for (const source of [data, ops]) {
      assert.doesNotMatch(source, /drive\.google\.com|docs\.google\.com\/document/);
    }
    assert.doesNotMatch(data, /\.ogg|_16x9\.mp4|_thumb\.jpg/);
  });
});
