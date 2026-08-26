import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { media } from "../src/data/media.ts";
import { earthquakeSafetyStoryVideo, galleryVideos } from "../src/data/galleryVideos.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { verifyNews } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const EVENING_ID = "2026-08-22-evening-showroom-fanroom";
const NIGHT_ID = "2026-08-22-night-showroom-fanroom";
const EARTHQUAKE_ID = "2026-08-23-earthquake-showroom-fanroom";
const EARLY_ID = "2026-08-23-early-showroom-fanroom";
const MORNING_ID = "2026-08-23-morning-showroom-fanroom";
const CAMPUS_ID = "2026-08-22-campus-girls-second-stage-jury-award";
const X_NIGHT_ID = "2026-08-22-night-showroom-thanks";

const EVENING_MESSAGE =
  "ただいま〜✨\n皆さんゲリラ豪雨大丈夫？？私はポツポツ降ってきたなぁぁぁくらいで家に着いてギリギリセーフだったよ🏠帰宅時間の皆さんお気をつけて〜😭🙌🏻\n\n今からご飯作って食べて、お風呂に入ってその後配信したいからぁ、、、🤔💭\n\n20:30〜\nできるように頑張ろうかなっ！\n\n明日の朝はめちゃくちゃ早いから、流石に早めに寝るように努める🥱";

const NIGHT_MESSAGE =
  "夜枠ありがとうございました！！\n\n等身大の自分でいることができるのは、ルームにいる皆様全員が暖かく、リラックスできる空間を作ってくれているからです😭✨\n\nこれからもみんなと一緒にいろんな景色を見ていきたいよ🥺✊🏻🩵\n\n明日⬇️\n朝☀️5:40〜\n夜🌙22:30〜\n\nよろしくお願いします！";

const EARLY_MESSAGE = "FMラジオ前にラジオ配信して行っていいかしらね？笑";

const MORNING_MESSAGE =
  "朝配信遅れてごめんなさいー！！！\n\nきてくれたみんなありがとう😌🙏🏻✨\nそして、フォローしてくださった皆様もありがとう🤭✨\n\n改めて、みりぃです！\n\nまた次も来てくれたら嬉しいよ〜♪\n\n次は22:30〜ねー！絶対にメイクしてます😊いつもきてくれている方からすると久しぶりのメイクみりぃ💄だね！\n\n始めてくる方も大歓迎〜！\n\nでは、ラジオ行ってきますー！";

const EARTHQUAKE_MESSAGE = [
  "みりぃ · 02:02",
  "地震だね、落ち着いて！！まずは身の安全を確保✊🏻😌",
  "",
  "みりぃ · 02:18",
  "皆さん無事かな？？",
  "",
  "みりぃ · 02:19",
  "みりぃは無事です、ありがとう🙌🏻🙌🏻",
].join("\n");

const EARTHQUAKE_BODY =
  "8月23日未明の地震直後、SHOWROOMファンルームでみりぃが「まずは身の安全を確保」と呼びかけました。その後も「皆さん無事かな？？」とファンを気遣い、自身も無事だと報告しています。Instagram Storyでも関東圏の皆さんの無事を気遣い、「まずは落ち着いて」「自分の身の安全の確保‼」と呼びかけています。";

const FANROOM_SPEAKER_LINE = /^(.+?) · \d{1,2}:\d{2}$/u;

const THIRD_PARTY_LEAKS = [
  "キサラギ",
  "震度4",
  "津波",
];

function fanRoomNews() {
  return news.filter((entry) =>
    (entry.sourceLabel ?? "").includes("SHOWROOMファンルーム"),
  );
}

function conversationSpeakers(text) {
  return (text ?? "")
    .split("\n")
    .map((line) => line.trim().match(FANROOM_SPEAKER_LINE)?.[1])
    .filter(Boolean);
}

function findNews(id) {
  return news.find((entry) => entry.id === id);
}

describe("2026-08-22〜08-23 SHOWROOM FanRoom — Latest / NEWS", () => {
  it("adds five non-link FanRoom News items with confirmed archive wording", () => {
    const evening = findNews(EVENING_ID);
    const night = findNews(NIGHT_ID);
    const earthquake = findNews(EARTHQUAKE_ID);
    const early = findNews(EARLY_ID);
    const morning = findNews(MORNING_ID);

    assert.ok(evening);
    assert.ok(night);
    assert.ok(earthquake);
    assert.ok(early);
    assert.ok(morning);

    for (const id of [EVENING_ID, NIGHT_ID, EARTHQUAKE_ID, EARLY_ID, MORNING_ID]) {
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

    assert.equal(earthquake.date, "2026-08-23");
    assert.equal(earthquake.sameDayOrder, 1);
    assert.equal(earthquake.activityIds, undefined);
    assert.equal(earthquake.source, undefined);
    assert.equal(earthquake.url, undefined);
    assert.equal(earthquake.ctaLabel, undefined);
    assert.equal(earthquake.sourceLabel, "SHOWROOMファンルーム / Instagram Story");
    assert.equal(earthquake.message?.label, "みりぃからの連絡💌 · 02:02〜02:19");
    assert.equal(earthquake.message?.text, EARTHQUAKE_MESSAGE);
    assert.equal(earthquake.media, earthquakeSafetyStoryVideo);
    assert.match(earthquake.title, /地震直後、みんなの安全を気遣うみりぃ/);
    assert.equal(earthquake.body, EARTHQUAKE_BODY);
    assert.match(earthquake.body, /まずは身の安全を確保/);
    assert.match(earthquake.body, /皆さん無事かな？？/);
    assert.doesNotMatch(earthquake.body, /あっきー/);

    assert.equal(early.date, "2026-08-23");
    assert.equal(early.sameDayOrder, 2);
    assert.equal(early.message?.label, "みりぃからの連絡💌 · 05:53");
    assert.equal(early.message?.text, EARLY_MESSAGE);

    assert.equal(morning.date, "2026-08-23");
    assert.equal(morning.sameDayOrder, 3);
    assert.equal(morning.message?.label, "みりぃからの連絡💌 · 06:25");
    assert.equal(morning.message?.text, MORNING_MESSAGE);

    assert.deepEqual(verifyNews([evening, night, earthquake, early, morning]), []);
  });

  it("keeps chronological same-day order in the Latest sort", () => {
    const ordered = sortNewsByDateDesc(news).map((entry) => entry.id);
    assert.deepEqual(ordered.slice(0, 17), [
      "2026-08-26-mixch-15x-day",
      "2026-08-26-stream-1000",
      "2026-08-25-mixch-confidence-message",
      "2026-08-25-motivation",
      "2026-08-24-seasidecircle-yes-tokyo",
      "2026-08-24-campus-girls-final-stage-guide",
      "2026-08-24-makeup-stream",
      "2026-08-24-night-thanks-morning-stream",
      "2026-08-23-dragon-cloud",
      "2026-08-23-seaside-circle-musical-special",
      MORNING_ID,
      EARLY_ID,
      EARTHQUAKE_ID,
      X_NIGHT_ID,
      NIGHT_ID,
      EVENING_ID,
      CAMPUS_ID,
    ]);
    assert.equal(news.length, 32);
  });

  it("does not add FanRoom screenshots to Gallery surfaces or public news crops", async () => {
    assert.equal(media.some((entry) => entry.id.includes("b17")), false);
    assert.equal(galleryVideos.some((entry) => entry.id.includes("b17")), false);
    assert.equal(existsSync(path.join(root, "public/media/news/mily-b18-01-earthquake-showroom-fanroom.jpg")), false);

    const publicNews = await readdir(path.join(root, "public/media/news"));
    assert.equal(
      publicNews.some((file) => file.includes("earthquake") || file.includes("fanroom-earth")),
      false,
    );

    for (const relative of [
      "src/data/media.ts",
      "src/data/galleryVideos.ts",
      "src/data/driveGalleryManifest.json",
      "src/data/stories.ts",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      for (const id of [EVENING_ID, NIGHT_ID, EARTHQUAKE_ID, EARLY_ID, MORNING_ID]) {
        assert.equal(source.includes(id), false, relative);
      }
      assert.equal(source.includes("earthquake-showroom-fanroom"), false, relative);
    }
  });

  it("keeps the earthquake Fan Room archive to Mily's three confirmed remarks", () => {
    const earthquake = findNews(EARTHQUAKE_ID);
    assert.ok(earthquake);
    assert.equal(earthquake.id, EARTHQUAKE_ID);
    assert.equal(earthquake.message?.text, EARTHQUAKE_MESSAGE);
    assert.deepEqual(conversationSpeakers(earthquake.message?.text), [
      "みりぃ",
      "みりぃ",
      "みりぃ",
    ]);
    assert.match(earthquake.message?.text ?? "", /地震だね、落ち着いて！！まずは身の安全を確保✊🏻😌/);
    assert.match(earthquake.message?.text ?? "", /皆さん無事かな？？/);
    assert.match(earthquake.message?.text ?? "", /みりぃは無事です、ありがとう🙌🏻🙌🏻/);
    assert.equal(earthquake.body, EARTHQUAKE_BODY);
    assert.doesNotMatch(earthquake.body, /あっきー|びっくりしたー|余震に気をつけましょう/);
    assert.doesNotMatch(earthquake.body, /[^\s。、]+もみりぃの無事を喜び/);
  });

  it("publishes only Mily as a Fan Room conversation speaker", () => {
    const entries = fanRoomNews();
    assert.ok(entries.some((entry) => entry.id === EARTHQUAKE_ID));
    assert.ok(entries.length >= 6);

    for (const entry of entries) {
      const speakers = conversationSpeakers(entry.message?.text);
      for (const speaker of speakers) {
        assert.equal(speaker, "みりぃ", `${entry.id} speaker ${speaker}`);
      }
    }
  });

  it("keeps third-party Fan Room comments out of published NEWS text", () => {
    const earthquake = findNews(EARTHQUAKE_ID);
    const published = JSON.stringify(earthquake);

    for (const leak of THIRD_PARTY_LEAKS) {
      assert.equal(published.includes(leak), false, leak);
    }
  });

  it("documents the Mily-only Fan Room publication rule", async () => {
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");

    assert.match(ops, /Fan Room公開時の原則/);
    assert.match(ops, /原則としてみりぃ本人の発言だけ/);
    assert.match(ops, /オーナー自身の発言についても同様に公開しない/);
    assert.match(ops, /個人を特定しない一般表現/);
    assert.match(ops, /privacy-safe cropを確定できない限り公開しない/);
    assert.match(ops, /第三者の文章をテキストへ転記してよいことにはしない/);
    assert.match(ops, /本人の言葉に存在しない内容を補完・創作しない/);
  });

  it("does not copy archived Fan Room posts into the manual schedule fallback", async () => {
    const fanroomIds = [EVENING_ID, NIGHT_ID, EARTHQUAKE_ID, EARLY_ID, MORNING_ID];
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
      ["2026-08-23-dragon-cloud", "2026-08-23-seaside-circle-musical-special", MORNING_ID, EARLY_ID, EARTHQUAKE_ID],
    );
    assert.deepEqual(
      feedNewsIds.filter((id) => id.startsWith("2026-08-23")),
      ["2026-08-23-dragon-cloud", "2026-08-23-seaside-circle-musical-special", MORNING_ID, EARLY_ID, EARTHQUAKE_ID],
    );
    assert.deepEqual(
      latestIds.filter((id) => id.startsWith("2026-08-22")),
      [X_NIGHT_ID, NIGHT_ID, EVENING_ID, CAMPUS_ID],
    );
    assert.deepEqual(
      feedNewsIds.filter((id) => id.startsWith("2026-08-22")),
      [X_NIGHT_ID, NIGHT_ID, EVENING_ID, CAMPUS_ID],
    );

    const morning = feed.items.find((item) => item.id === `mily:news:${MORNING_ID}`);
    const early = feed.items.find((item) => item.id === `mily:news:${EARLY_ID}`);
    const earthquake = feed.items.find((item) => item.id === `mily:news:${EARTHQUAKE_ID}`);
    assert.equal(morning?.publishedAt, "2026-08-23T00:00:00+09:00");
    assert.equal(early?.publishedAt, "2026-08-23T00:00:00+09:00");
    assert.equal(earthquake?.publishedAt, "2026-08-23T00:00:00+09:00");
    assert.equal(morning?.sourceUrl, undefined);
    assert.equal(morning?.image, undefined);
    assert.equal(earthquake?.sourceUrl, undefined);
    assert.ok(earthquake?.image?.endsWith(earthquakeSafetyStoryVideo.poster));
  });
});
