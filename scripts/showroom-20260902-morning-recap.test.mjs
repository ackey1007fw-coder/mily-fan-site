import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { rankingByPlace, streamRecap20260902 } from "../src/data/streamRecaps.ts";
import { events } from "../src/data/events.ts";
import { news } from "../src/data/news.ts";
import { highlights } from "../src/data/highlights.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("2026-09-02 SHOWROOM朝ラジオ配信メモ", () => {
  it("stores the verified stream summary separately from schedule state", () => {
    const recap = streamRecap20260902;

    assert.equal(recap.date, "2026-09-02");
    assert.equal(recap.dateLabel, "2026.09.02（水）");
    assert.equal(recap.theme, "朝ラジオ配信");
    assert.equal(recap.broadcastLabel, "9:02頃〜 約62分");
    assert.equal(recap.platformLabel, "SHOWROOM");
    assert.equal(recap.verifiedAt, "2026-09-02");
    assert.match(recap.sourceLabel, /オーナー提供/);
    assert.match(recap.summary, /みんなの太陽/);
    assert.match(recap.transcriptionNote, /録音音声・画面録画・全文文字起こしは掲載していません/);
  });

  it("keeps a short recap and withholds ranking names", () => {
    const recap = streamRecap20260902;

    assert.equal(recap.highlights.length, 3);
    assert.equal(recap.goals.length, 4);
    assert.equal(recap.ranking.length, 0);
    assert.equal(rankingByPlace(recap.ranking).length, 0);
    assert.equal(recap.timeline.length, 9);
    assert.ok(recap.highlights.some(({ title }) => /太陽/.test(title)));
    assert.ok(recap.highlights.some(({ title }) => /未完成の作品/.test(title)));
    assert.ok(recap.highlights.some(({ body }) => /朝の通学は混雑/.test(body)));
    assert.ok(recap.goals.some(({ item }) => item === "フォロワー"));
    assert.match(recap.rankingNote, /個人名は掲載していません/);

    const highlightSeconds = recap.highlights.map(({ timestamp }) => {
      const [hour, minute, second] = timestamp.split(":").map(Number);
      return hour * 3600 + minute * 60 + second;
    });
    assert.deepEqual(
      highlightSeconds,
      [...highlightSeconds].sort((left, right) => left - right),
    );

    const seconds = recap.timeline.map(({ timestamp }) => {
      const [hour, minute, second] = timestamp.split(":").map(Number);
      return hour * 3600 + minute * 60 + second;
    });
    assert.deepEqual(seconds, [...seconds].sort((left, right) => left - right));
  });

  it("does not promote same-day slots, profile numbers, or private archive files", async () => {
    const recap = streamRecap20260902;
    const page = await readFile(path.join(root, "src/ActivitiesPage.tsx"), "utf8");
    const data = await readFile(path.join(root, "src/data/streamRecaps.ts"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const morningText = [
      recap.summary,
      ...recap.highlights.flatMap(({ title, body, quote }) => [title, body, quote ?? ""]),
      ...recap.goals.flatMap(({ item, target, statusThen }) => [item, target, statusThen]),
      recap.rankingNote,
      ...recap.ranking.flatMap(({ name, note }) => [name, note ?? ""]),
      ...recap.timeline.flatMap(({ timestamp, label }) => [timestamp, label]),
      recap.nextNote,
      recap.sourceLabel,
      recap.transcriptionNote,
    ].join("\n");

    assert.match(page, /function StreamRecap/);
    assert.match(page, /activityId !== "live-stream"/);
    assert.match(page, /defaultOpen/);
    assert.match(page, /この回の見どころ/);
    assert.match(page, /この回の目標/);
    assert.match(page, /タイムスタンプと次枠/);
    assert.match(page, /<StreamRecap activityId=\{content\.activity\.id\} \/>/);

    assert.match(recap.nextNote, /14:40/);
    assert.doesNotMatch(data, /帰宅ラッシュ/);
    assert.doesNotMatch(morningText, /ハルルン|ヒロさん|まこちゃん|あっきーさん|ひげおやじさん/);
    assert.doesNotMatch(
      morningText,
      /湘南新宿ライン|東海道線|横浜から東京方面|日大まで片道約2時間|仕事中に来てくれた人|通勤ラッシュ/,
    );
    assert.equal(
      streamSchedule.some((slot) => slot.date === "2026-09-02" && slot.time === "14:40"),
      false,
    );
    assert.equal(
      streamSchedule.some((slot) => slot.date === "2026-09-02"),
      false,
    );
    assert.equal(
      events.some((item) => item.id === "2026-09-02-morning-showroom"),
      false,
    );
    assert.equal(
      news.some((item) => item.id === "2026-09-02-morning-showroom"),
      false,
    );
    assert.equal(
      highlights.some((item) => item.id === "2026-09-02-morning-showroom"),
      false,
    );

    for (const source of [data, ops]) {
      assert.doesNotMatch(source, /drive\.google\.com|docs\.google\.com\/document/);
    }
    assert.doesNotMatch(data, /\.mp3|\.aac|stream\.ts|stt_raw/);
    assert.doesNotMatch(data, /公式|公認|本人運営/);
  });
});
