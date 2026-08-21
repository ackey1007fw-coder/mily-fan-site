import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sortNewsByDateDesc } from "../src/data/news.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("latest news ordering", () => {
  it("sorts a copy by descending date without mutating the input", () => {
    const input = [
      {
        id: "older",
        date: "2026-01-01",
        title: "古い",
        body: "old",
        source: "https://example.com/old",
      },
      {
        id: "newer",
        date: "2026-08-14",
        title: "新しい",
        body: "new",
        source: "https://example.com/new",
      },
      {
        id: "middle",
        date: "2026-05-01",
        title: "中間",
        body: "mid",
        source: "https://example.com/mid",
      },
    ];
    const originalOrder = input.map((item) => item.id);

    const sorted = sortNewsByDateDesc(input);

    assert.deepEqual(
      sorted.map((item) => item.id),
      ["newer", "middle", "older"],
    );
    assert.deepEqual(
      input.map((item) => item.id),
      originalOrder,
    );
    assert.notEqual(sorted, input);
  });
});

describe("birthday news item", () => {
  it("keeps the 21st birthday update sourced to the Instagram post", async () => {
    const source = await readFile(path.join(root, "src/data/news.ts"), "utf8");
    const { news } = await import("../src/data/news.ts");
    const birthday = news.find((item) => item.id === "2026-08-02-21st-birthday");

    assert.ok(birthday);
    assert.equal(birthday.date, "2026-08-02");
    assert.match(birthday.title, /21歳/);
    assert.match(birthday.body, /21歳の誕生日/);
    assert.match(birthday.body, /感謝/);
    assert.match(birthday.body, /考えていることを脳内に留めず行動に移す。/);
    assert.equal(birthday.source, "https://www.instagram.com/p/DbiY3PHk1c8/");
    assert.equal(birthday.ctaLabel, "Instagramの投稿を見る");
    assert.match(source, /mily-fan-site|みりぃ|21歳/);
  });
});

describe("8/18 radio news item", () => {
  it("points Latest to the radio story without replacing the morning update", async () => {
    const { news } = await import("../src/data/news.ts");
    const radio = news.find((item) => item.id === "2026-08-18-evening-radio");
    const morning = news.find((item) => item.id === "2026-08-18-morning-update");

    assert.ok(radio);
    assert.ok(morning);
    assert.equal(radio.date, "2026-08-18");
    assert.equal(radio.source, "https://x.com/Mily_chan36/status/2089721650522820667");
    assert.equal(radio.sourceLabel, "Xの投稿を見る");
    assert.equal(radio.url, "/stories/2026-08-18-radio/");
    assert.equal(radio.ctaLabel, "配信の記録を読む");
    assert.match(radio.body, /体は本調子ではないなかでもラジオ配信/);
    assert.match(radio.body, /夜になる予定/);
    assert.equal(radio.body.includes("体調不良"), false);
    assert.equal(radio.body.includes("病気"), false);
    assert.equal(morning.title, "おはよう〜☀️ 10:50〜11:30配信予定");
  });
});

describe("8/19 second-round result news item", () => {
  it("leads Latest with the confirmed 2次審査通過 report", async () => {
    const { news, sortNewsByDateDesc } = await import("../src/data/news.ts");
    const result = news.find(
      (item) => item.id === "2026-08-19-second-round-result",
    );

    assert.ok(result);
    // 8/21の新着と8/20の3件のあとも、8/19の中では結果報告が先頭に立つ。
    const ordered = sortNewsByDateDesc(news).map((item) => item.id);
    assert.equal(ordered[0], "2026-08-21-after-afternoon-ganda");
    assert.equal(ordered[1], "2026-08-21-afternoon-showroom-fanroom");
    assert.equal(ordered[2], "2026-08-21-event-story-next-slot");
    assert.equal(ordered[3], "2026-08-21-morning-ohayo-story");
    assert.equal(ordered[4], "2026-08-21-morning-showroom-runway");
    assert.equal(ordered[5], "2026-08-20-mango-kakigori");
    assert.equal(ordered[6], "2026-08-20-morning-message");
    assert.equal(ordered[7], "2026-08-20-morning-story");
    assert.equal(ordered[8], "2026-08-19-second-round-result");
    assert.equal(result.date, "2026-08-19");
    assert.equal(
      result.source,
      "https://x.com/Mily_chan36/status/2089996508691390948",
    );
    assert.equal(result.sourceLabel, "Xの投稿を見る");
    assert.equal(result.url, "/stories/second-round-result-2026/");
    assert.match(result.title, /2次審査通過/);
    assert.match(result.body, /三次審査/);

    // 未公表の内容を推測して書かない
    for (const phrase of ["順位", "得票", "票数", "ファイナル", "グランプリ"]) {
      assert.equal(result.body.includes(phrase), false, phrase);
      assert.equal(result.title.includes(phrase), false, phrase);
    }

    // 既存のお知らせを置き換えていない
    assert.ok(news.some((item) => item.id === "2026-08-18-evening-radio"));
    assert.ok(news.some((item) => item.id === "2026-08-18-morning-update"));
    assert.ok(news.some((item) => item.id === "2026-08-17-morning-story"));
    assert.ok(news.some((item) => item.id === "2026-08-02-21st-birthday"));
  });
});

describe("8/19 well-rested morning news item", () => {
  it("archives the morning X post with its self-hosted photo", async () => {
    const { news, sortNewsByDateDesc } = await import("../src/data/news.ts");
    const item = news.find((entry) => entry.id === "2026-08-19-well-rested-morning");

    assert.ok(item);
    assert.equal(item.date, "2026-08-19");
    assert.equal(
      item.source,
      "https://x.com/Mily_chan36/status/2089841199280742669",
    );
    assert.equal(item.sourceLabel, "Xの投稿を見る");
    assert.equal(item.url, undefined);
    assert.match(item.title, /体調回復/);
    assert.match(item.body, /体調が回復/);
    assert.match(item.body, /今日もみんなと一緒に頑張るぞぃ/);

    // 投稿本文は原文のまま、改行込みで残す
    assert.ok(item.message);
    assert.match(item.message.text, /^おはよう〜☀️\n体調回復/);
    assert.match(item.message.text, /しっかり寝ました！！！/);
    assert.match(item.message.text, /みんな心配ありがとう/);
    assert.match(item.message.text, /#ミスサー #ミスサークル/);
    assert.match(item.message.text, /#ミスコン$/);

    // 本人が書いていない心理状態を足さない
    for (const phrase of ["安堵", "確信", "自信満々", "順位", "得票", "いいね", "リポスト", "閲覧"]) {
      assert.equal(item.body.includes(phrase), false, phrase);
      assert.equal(item.title.includes(phrase), false, phrase);
      assert.equal(item.message.text.includes(phrase), false, phrase);
    }

    // 8/21の新着の後、8/20はマンゴーかき氷投稿 → X投稿 → 朝Story の順。
    // 8/19 は結果報告（あと）→ 朝の投稿（さき）の順で並ぶ。
    const order = sortNewsByDateDesc(news).map((entry) => entry.id);
    assert.deepEqual(order.slice(0, 11), [
      "2026-08-21-after-afternoon-ganda",
      "2026-08-21-afternoon-showroom-fanroom",
      "2026-08-21-event-story-next-slot",
      "2026-08-21-morning-ohayo-story",
      "2026-08-21-morning-showroom-runway",
      "2026-08-20-mango-kakigori",
      "2026-08-20-morning-message",
      "2026-08-20-morning-story",
      "2026-08-19-second-round-result",
      "2026-08-19-well-rested-morning",
      "2026-08-18-evening-radio",
    ]);

    // 既存のお知らせを置き換えていない
    for (const id of [
      "2026-08-20-mango-kakigori",
      "2026-08-20-morning-message",
      "2026-08-20-morning-story",
      "2026-08-18-morning-update",
      "2026-08-17-morning-story",
      "2026-08-02-21st-birthday",
    ]) {
      assert.ok(news.some((entry) => entry.id === id), id);
    }
  });

  it("ships the photo locally at its untouched 1162x2048 size", async () => {
    const { news } = await import("../src/data/news.ts");
    const item = news.find((entry) => entry.id === "2026-08-19-well-rested-morning");
    const media = item?.media;

    assert.ok(media);
    assert.equal(media.kind, "image");
    assert.equal(media.src, "/media/news/mily-b06-01-recovery-morning.jpg");
    assert.equal(media.width, 1162);
    assert.equal(media.height, 2048);
    assert.match(media.alt, /ウインク/);
    assert.match(media.alt, /ピース/);

    const file = path.join(root, "public", media.src.slice(1));
    const bytes = await readFile(file);
    assert.ok(bytes.length > 0);
    // JPEG SOI marker + real intrinsic size recorded above
    assert.equal(bytes[0], 0xff);
    assert.equal(bytes[1], 0xd8);
  });

  it("keeps the post out of Gallery and the article collection", async () => {
    const { media } = await import("../src/data/media.ts");
    const { stories } = await import("../src/data/stories.ts");
    const storiesSource = await readFile(
      path.join(root, "src/data/stories.ts"),
      "utf8",
    );

    assert.equal(
      media.some((entry) => entry.basePath.includes("recovery-morning")),
      false,
    );
    assert.equal(
      stories.some((story) => story.slug.includes("recovery")),
      false,
    );
    assert.doesNotMatch(storiesSource, /mily-b06-01-recovery-morning/);
  });

  it("renders a news photo without cropping it", async () => {
    const latest = await readFile(
      path.join(root, "src/components/Latest.tsx"),
      "utf8",
    );

    assert.match(latest, /item\.media\?\.kind === "image"/);
    assert.match(latest, /<img/);
    assert.match(latest, /object-contain/);
    assert.doesNotMatch(latest, /<img[\s\S]{0,400}object-cover/);
    assert.match(latest, /whitespace-pre-line/);
  });
});

describe("source and url are not mixed", () => {
  it("uses required source for 出典を見る in Latest and Schedule", async () => {
    const latest = await readFile(
      path.join(root, "src/components/Latest.tsx"),
      "utf8",
    );
    const schedule = await readFile(
      path.join(root, "src/components/Schedule.tsx"),
      "utf8",
    );

    assert.match(latest, /sortNewsByDateDesc\(news\)/);
    assert.match(latest, /href=\{item\.source\}/);
    assert.match(latest, /出典を見る/);
    assert.match(latest, /関連リンク/);
    assert.match(latest, /item\.ctaLabel/);
    assert.match(latest, /Instagramの投稿を見る|ctaLabel/);
    assert.doesNotMatch(latest, /href=\{item\.url\}[\s\S]{0,80}出典を見る/);

    assert.match(schedule, /href=\{item\.source\}/);
    assert.match(schedule, /出典を見る/);
    assert.match(schedule, /詳細/);
    assert.doesNotMatch(schedule, /詳細・出典/);
    assert.doesNotMatch(schedule, /href=\{item\.url\}[\s\S]{0,80}出典を見る/);
  });
});
