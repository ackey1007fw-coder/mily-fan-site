import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { news } from "../src/data/news.ts";
import {
  countNewsByCategory,
  filterNewsByCategory,
  NEWS_CATEGORY_LABELS,
  NEWS_CATEGORY_ORDER,
  newsCategoriesOf,
  readNewsCategoryFromSearch,
} from "../src/lib/newsCategories.ts";
import { verifyNews } from "./content-invariants.mjs";

const byId = (id) => news.find((item) => item.id === id);

describe("NEWS categories", () => {
  it("gives every NEWS item at least one known category in display order", () => {
    for (const item of news) {
      const categories = newsCategoriesOf(item);
      assert.ok(categories.length > 0, item.id);
      assert.deepEqual(
        categories,
        NEWS_CATEGORY_ORDER.filter((category) => categories.includes(category)),
        item.id,
      );
      for (const category of categories) assert.ok(NEWS_CATEGORY_LABELS[category], item.id);
    }
  });

  it("derives categories from Activity relations and falls back to 近況・SNS", () => {
    assert.deepEqual(newsCategoriesOf({ activityIds: ["miss-circle"] }), ["contest"]);
    assert.deepEqual(newsCategoriesOf({ activityIds: ["campus-girls"] }), ["contest"]);
    assert.deepEqual(newsCategoriesOf({ activityIds: ["radio", "live-stream"] }), ["stream", "radio"]);
    assert.deepEqual(newsCategoriesOf({}), ["sns"]);
    assert.deepEqual(newsCategoriesOf({ activityIds: ["radio"], categories: ["sns"] }), ["sns"]);
  });

  it("uses editorial overrides for unrelated items that are about contests, streams, or radio", () => {
    assert.deepEqual(newsCategoriesOf(byId("2026-09-12-ohayo-panda-selfie")), ["contest", "stream"]);
    assert.deepEqual(newsCategoriesOf(byId("2026-09-05-tiktok-radio-portrait")), ["radio"]);
    assert.deepEqual(newsCategoriesOf(byId("2026-11-26-instagram-yamaokaya-umihotaru")), ["sns"]);
    // Overrides never add Activity relations: propagation stays on activityIds only.
    assert.equal(byId("2026-09-12-ohayo-panda-selfie").activityIds, undefined);
  });

  it("filters and counts consistently", () => {
    const counts = countNewsByCategory(news);
    for (const category of NEWS_CATEGORY_ORDER) {
      assert.equal(filterNewsByCategory(news, category).length, counts[category], category);
      assert.ok(counts[category] > 0, category);
    }
    assert.equal(filterNewsByCategory(news, null).length, news.length);
  });

  it("reads only known categories from the URL", () => {
    assert.equal(readNewsCategoryFromSearch("?category=radio"), "radio");
    assert.equal(readNewsCategoryFromSearch("?category=unknown"), null);
    assert.equal(readNewsCategoryFromSearch(""), null);
  });
});

describe("NEWS verification notes", () => {
  it("keeps notes as trimmed sentences that are not repeated in the body", () => {
    const withNotes = news.filter((item) => item.notes);
    assert.ok(withNotes.length >= 20);
    for (const item of withNotes) {
      assert.ok(item.notes.length > 0, item.id);
      for (const note of item.notes) {
        assert.equal(note, note.trim(), item.id);
        assert.ok(!item.body.includes(note), item.id);
      }
      assert.ok(item.body.trim().length > 0, item.id);
    }
    assert.deepEqual(verifyNews(news), []);
  });

  it("separates announced-schedule caveats from the body of the 11/7 schedule NEWS", () => {
    const item = byId("2026-11-07-x-showroom-sr-final-schedule");
    assert.deepEqual(item.notes, [
      "本人による告知予定です。",
      "実際の開始・終了を確認した配信記録ではありません。",
    ]);
    assert.match(item.body, /変更は本人の最新Xをご確認ください。$/);
  });

  it("renders categories and notes on the NEWS card and filters only on /news/", () => {
    const latest = readFileSync(new URL("../src/components/Latest.tsx", import.meta.url), "utf8");
    assert.match(latest, /aria-label="確認状況・注記"/);
    assert.match(latest, /data-news-category=/);
    assert.match(latest, /aria-pressed=\{active\}/);
    const page = readFileSync(new URL("../src/NewsPage.tsx", import.meta.url), "utf8");
    assert.match(page, /showCategoryFilter/);
    const home = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
    assert.doesNotMatch(home, /showCategoryFilter/);
  });

  it("rejects malformed notes and categories", () => {
    const base = news[0];
    const errors = verifyNews([
      { ...base, notes: [] },
      { ...base, id: "x2", notes: [" spaced "] },
      { ...base, id: "x3", categories: ["contest", "contest"] },
      { ...base, id: "x4", categories: ["unknown"] },
    ]);
    for (const id of [base.id, "x2", "x3", "x4"]) {
      assert.ok(errors.some((error) => error.includes(`"${id}"`)), id);
    }
  });
});
