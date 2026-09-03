import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  streamRecap20260902,
  streamRecap20260902Night,
  streamRecaps,
} from "../src/data/streamRecaps.ts";
import { events } from "../src/data/events.ts";
import { news } from "../src/data/news.ts";
import { highlights } from "../src/data/highlights.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("2026-09-02 SHOWROOM夜ラジオ配信メモ", () => {
  it("stores the verified night summary separately from the morning recap", () => {
    const recap = streamRecap20260902Night;

    assert.equal(recap.date, "2026-09-02");
    assert.equal(recap.dateLabel, "2026.09.02（水）");
    assert.equal(recap.theme, "夜ラジオ配信");
    assert.equal(recap.broadcastLabel, "21:13頃〜 約74分");
    assert.equal(recap.platformLabel, "SHOWROOM");
    assert.equal(recap.verifiedAt, "2026-09-03");
    assert.match(recap.sourceLabel, /オーナー提供/);
    assert.match(recap.sourceLabel, /夜配信/);
    assert.match(recap.summary, /三次審査前日/);
    assert.match(recap.transcriptionNote, /録音音声・画面録画・全文文字起こしは掲載していません/);
    assert.equal(streamRecaps[0], recap);
    assert.equal(streamRecaps[1], streamRecap20260902);
  });

  it("captures highlights, third-round goals, ranking, and an ordered timeline", () => {
    const recap = streamRecap20260902Night;

    assert.equal(recap.highlights.length, 7);
    assert.equal(recap.goals.length, 5);
    assert.equal(recap.ranking.length, 13);
    assert.equal(recap.timeline.length, 11);
    assert.ok(recap.highlights.some(({ title }) => /通過/.test(title)));
    assert.ok(recap.highlights.some(({ body }) => /スーツ謝罪会見/.test(body)));
    assert.ok(recap.highlights.some(({ body }) => /海くん/.test(body)));
    assert.ok(recap.goals.some(({ item }) => item === "三次通過"));
    assert.ok(recap.ranking.some((entry) => /高速の神さん/.test(entry)));

    const seconds = recap.timeline.map(({ timestamp }) => {
      const [hour, minute, second] = timestamp.split(":").map(Number);
      return hour * 3600 + minute * 60 + second;
    });
    assert.deepEqual(seconds, [...seconds].sort((left, right) => left - right));
  });

  it("does not promote tentative slots, other contest names, or private archive files", async () => {
    const recap = streamRecap20260902Night;
    const page = await readFile(path.join(root, "src/ActivitiesPage.tsx"), "utf8");
    const data = await readFile(path.join(root, "src/data/streamRecaps.ts"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");

    assert.match(page, /function StreamRecap/);
    assert.match(page, /activityId !== "live-stream"/);
    assert.match(page, /streamRecaps\.map/);
    assert.match(page, /みりぃの見どころ/);
    assert.match(page, /9月の目標（配信時点）/);
    assert.match(page, /読み上げたランキング/);
    assert.match(page, /主なコーナーとタイムスタンプを見る/);
    assert.match(page, /<StreamRecap activityId=\{content\.activity\.id\} \/>/);

    assert.match(recap.nextNote, /7:30/);
    assert.match(recap.nextNote, /14:40/);
    assert.match(recap.nextNote, /21:00/);
    assert.doesNotMatch(data, /いくちゃん|ゆめちゃん/);
    assert.doesNotMatch(recap.summary, /フレキャン/);
    assert.equal(
      streamSchedule.some((slot) => slot.date === "2026-09-05" && slot.time === "05:30"),
      false,
    );
    assert.equal(
      events.some((item) => item.id === "2026-09-02-night-showroom"),
      false,
    );
    assert.equal(
      news.some((item) => item.id === "2026-09-02-night-showroom"),
      false,
    );
    assert.equal(
      highlights.some((item) => item.id === "2026-09-02-night-showroom"),
      false,
    );

    for (const source of [data, ops]) {
      assert.doesNotMatch(source, /drive\.google\.com|docs\.google\.com\/document/);
    }
    assert.doesNotMatch(data, /\.mp3|\.aac|stream\.ts|stt_raw/);
    assert.doesNotMatch(data, /公式|公認|本人運営/);
  });
});
