import test from "node:test";
import assert from "node:assert/strict";
import { patonExTwoDayTwo as guide } from "../src/data/patonExTwoDayTwo.ts";
import { news } from "../src/data/news.ts";
import { supportEvents } from "../src/data/supportEvents.ts";
import { links } from "../src/data/links.ts";

test("October 5 Paton uses its own confirmed participant and event", () => {
  assert.equal(guide.entrantUrl, "https://paton.jp/event/entrant/12600");
  assert.equal(guide.eventUrl, "https://paton.jp/event/detail/551");
  assert.equal(guide.freeGift.coins, 0);
  assert.equal(guide.paidGift.coins, 50);
});

test("unknown timezone does not introduce a confirmed calendar or voting action", () => {
  assert.equal(guide.timezone, null);
  assert.equal(guide.resetTime, null);
  assert.equal(supportEvents.some(event => event.source === guide.eventUrl), false);
  assert.equal(links.some(link => link.url === guide.entrantUrl), false);
});

test("dated NEWS leads to the guide and preserves the existing October 5 X item", () => {
  const item = news.find(item => item.id === "2026-10-05-paton-ex2-day2-guide");
  assert.ok(item);
  assert.equal(item.date, guide.date);
  assert.equal(item.source, guide.eventUrl);
  assert.match(item.relatedUrl, /\/support\/#paton-ex2-day2-guide$/);
  assert.equal(item.additionalCtas, undefined);
  assert.ok(news.find(item => item.id === "2026-10-05-car-vote-day-four-x"));
});
