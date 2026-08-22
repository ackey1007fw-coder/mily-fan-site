import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { media } from "../src/data/media.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { verifyNews } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const EVENING_ID = "2026-08-22-evening-showroom-fanroom";
const NIGHT_ID = "2026-08-22-night-showroom-fanroom";
const EARLY_ID = "2026-08-23-early-showroom-fanroom";
const MORNING_ID = "2026-08-23-morning-showroom-fanroom";
const CAMPUS_ID = "2026-08-22-campus-girls-second-stage-jury-award";

const EVENING_MESSAGE =
  "ただいま〜✨\n皆さんゲリラ豪雨大丈夫？？私はポツポツ降ってきたなぁぁぁくらいで家に着いてギリギリセーフだったよ🏠帰宅時間の皆さんお気をつけて〜😭🙌🏻\n\n今からご飯作って食べて、お風呂に入ってその後配信したいからぁ、、、🤔💭\n\n20:30〜\nできるように頑張ろうかなっ！\n\n明日の朝はめちゃくちゃ早いから、流石に早めに寝るように努める🥱";

const NIGHT_MESSAGE =
  "夜枠ありがとうございました！！\n\n等身大の自分でいることができるのは、ルームにいる皆様全員が暖かく、リラックスできる空間を作ってくれているからです😭✨\n\nこれからもみんなと一緒にいろんな景色を見ていきたいよ🥺✊🏻🩵\n\n明日⬇️\n朝☀️5:40〜\n夜🌙22:30〜\n\nよろしくお願いします！";

const EARLY_MESSAGE = "FMラジオ前にラジオ配信して行っていいかしらね？笑";

const MORNING_MESSAGE =
  "朝配信遅れてごめんなさいー！！！\n\nきてくれたみんなありがとう😌🙏🏻✨\nそして、フォローしてくださった皆様もありがとう🤭✨\n\n改めて、みりぃです！\n\nまた次も来てくれたら嬉しいよ〜♪\n\n次は22:30〜ねー！絶対にメイクしてます😊いつもきてくれている方からすると久しぶりのメイクみりぃ💄だね！\n\n始めてくる方も大歓迎〜！\n\nでは、ラジオ行ってきますー！";

function findNews(id) {
  return news.find((entry) => entry.id === id);
}

describe("2026-08-22〜08-23 SHOWROOM FanRoom — Latest / NEWS", () => {
  it("adds four non-link FanRoom News items with confirmed archive wording", () => {
    const evening = findNews(EVENING_ID);
    const night = findNews(NIGHT_ID);
    const early = findNews(EARLY_ID);
    const morning = findNews(MORNING_ID);

    assert.ok(evening);
    assert.ok(night);
    assert.ok(early);
    assert.ok(morning);

    for (const id of [EVENING_ID, NIGHT_ID, EARLY_ID, MORNING_ID]) {
      assert.equal(news.filter((entry) => entry.id === id).length, 1);
    }

    assert.equal(evening.date, "2026-08-22");
    assert.equal(evening.source, undefined);
    assert.equal(evening.url, undefined);
    assert.equal(evening.sourceLabel, "SHOWROOMファンルーム");
    assert.equal(evening.message?.label, "みりぃからの連絡💌 · 18:17");
    assert.equal(evening.message?.text, EVENING_MESSAGE);
    assert.equal(evening.media, undefined);

    assert.equal(night.date, "2026-08-22");
    assert.equal(night.sameDayOrder, 2);
    assert.equal(night.message?.label, "みりぃからの連絡💌 · 22:57");
    assert.equal(night.message?.text, NIGHT_MESSAGE);
    assert.equal(night.media, undefined);

    assert.equal(early.date, "2026-08-23");
    assert.equal(early.message?.label, "みりぃからの連絡💌 · 05:53");
    assert.equal(early.message?.text, EARLY_MESSAGE);

    assert.equal(morning.date, "2026-08-23");
    assert.equal(morning.sameDayOrder, 2);
    assert.equal(morning.message?.label, "みりぃからの連絡💌 · 06:25");
    assert.equal(morning.message?.text, MORNING_MESSAGE);

    assert.deepEqual(verifyNews([evening, night, early, morning]), []);
  });

  it("keeps chronological same-day order in the Latest sort", () => {
    const ordered = sortNewsByDateDesc(news).map((entry) => entry.id);

    assert.deepEqual(ordered.slice(0, 6), [
      MORNING_ID,
      EARLY_ID,
      NIGHT_ID,
      EVENING_ID,
      CAMPUS_ID,
      "2026-08-21-tiktok-radio-misscircle",
    ]);
    assert.equal(news.length, 20);
  });

  it("does not add FanRoom screenshots to Gallery surfaces", async () => {
    assert.equal(media.some((entry) => entry.id.includes("b17")), false);
    assert.equal(galleryVideos.some((entry) => entry.id.includes("b17")), false);

    for (const relative of [
      "src/data/media.ts",
      "src/data/galleryVideos.ts",
      "src/data/driveGalleryManifest.json",
      "src/data/stories.ts",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      for (const id of [EVENING_ID, NIGHT_ID, EARLY_ID, MORNING_ID]) {
        assert.equal(source.includes(id), false, relative);
      }
    }
  });

  it("does not copy archived Fan Room posts into the manual schedule fallback", async () => {
    const fanroomIds = [EVENING_ID, NIGHT_ID, EARLY_ID, MORNING_ID];
    const scheduleSource = await readFile(
      path.join(root, "src/data/streamSchedule.ts"),
      "utf8",
    );
    const eventsSource = await readFile(path.join(root, "src/data/events.ts"), "utf8");

    for (const id of fanroomIds) {
      assert.equal(scheduleSource.includes(id), false, id);
      assert.equal(eventsSource.includes(id), false, id);
      assert.equal(
        streamSchedule.some((slot) =>
          [slot.date, slot.time, slot.note].some((value) => value?.includes(id)),
        ),
        false,
        id,
      );
    }
  });

  it("keeps Portal Feed same-day NEWS chronology aligned with Latest", () => {
    const feed = createPortalFeed();
    const latestIds = sortNewsByDateDesc(news).map((entry) => entry.id);
    const feedNewsIds = feed.items
      .filter((item) => item.type === "news")
      .map((item) => item.id.replace(/^mily:news:/, ""));

    assert.deepEqual(
      latestIds.filter((id) => id.startsWith("2026-08-23")),
      [MORNING_ID, EARLY_ID],
    );
    assert.deepEqual(
      feedNewsIds.filter((id) => id.startsWith("2026-08-23")),
      [MORNING_ID, EARLY_ID],
    );
    assert.deepEqual(
      latestIds.filter((id) => id.startsWith("2026-08-22")),
      [NIGHT_ID, EVENING_ID, CAMPUS_ID],
    );
    assert.deepEqual(
      feedNewsIds.filter((id) => id.startsWith("2026-08-22")),
      [NIGHT_ID, EVENING_ID, CAMPUS_ID],
    );

    const morning = feed.items.find((item) => item.id === `mily:news:${MORNING_ID}`);
    const early = feed.items.find((item) => item.id === `mily:news:${EARLY_ID}`);
    assert.equal(morning?.publishedAt, "2026-08-23T00:00:00+09:00");
    assert.equal(early?.publishedAt, "2026-08-23T00:00:00+09:00");
    assert.equal(morning?.sourceUrl, undefined);
    assert.equal(morning?.image, undefined);
  });
});
