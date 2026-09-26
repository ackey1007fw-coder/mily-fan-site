import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { showroomAdReward as guide } from "../src/data/showroomAdReward.ts";
import { socials } from "../src/data/socials.ts";
const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const component = read("../src/components/ShowroomAdRewardGuide.tsx");
test("approved ad-reward entry and official provenance remain exact", () => {
  assert.equal(guide.url, "https://www.showroom-live.com/lottery/ad_reward/2");
  assert.equal(guide.sourceUrl, "https://www.showroom-live.com/lottery/list");
  assert.equal(guide.verifiedAt, "2026-09-27");
});
test("beginner flow covers viewing, result and actual gifting in that order", () => {
  assert.deepEqual(guide.steps.map(s => s.title), ["公式ページで広告を見る", "抽選結果・アイテムを確認", "配信でギフトを贈る"]);
  assert.match(component, /自動でギフトは贈られません/);
  assert.match(guide.faqs.map(f => f.answer).join(""), /最大6回、計12回/);
  assert.match(guide.faqs.map(f => f.answer).join(""), /14:55/);
  assert.match(guide.faqs.map(f => f.answer).join(""), /翌02:55/);
});
test("home teaser resolves to the mounted support guide without calendar duplication", () => {
  assert.equal(guide.guidePath, "/support/#showroom-ad-reward");
  assert.match(read("../src/components/Support.tsx"), /<ShowroomAdRewardTeaser \/>/);
  assert.match(read("../src/SupportPage.tsx"), /<ShowroomAdRewardGuide \/>/);
  assert.match(component, /id="showroom-ad-reward"/);
});
test("room link uses the existing confirmed identity and fails closed when absent", () => {
  assert.equal(socials.find(s => s.platform === "showroom" && s.confirmed)?.url, "https://www.showroom-live.com/r/circle2026_0734");
  assert.match(component, /room \? <ExternalLink href=\{room.url\}/);
});
test("guide is passive, keyboard-readable and does not automate rewards", () => {
  assert.match(component, /<ol/); assert.match(component, /<details/); assert.match(component, /<summary/);
  assert.doesNotMatch(component, /fetch\(|<iframe|<script|setInterval\(|dangerouslySetInnerHTML/);
  assert.match(read("../src/components/ExternalLink.tsx"), /rel="noopener noreferrer"/);
});
