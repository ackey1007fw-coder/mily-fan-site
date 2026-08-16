import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { events } from "../src/data/events.ts";
import { links } from "../src/data/links.ts";
import { media } from "../src/data/media.ts";
import { profile } from "../src/data/profile.ts";
import { socials } from "../src/data/socials.ts";
import { visibleNavItems } from "../src/lib/navigation.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

describe("confirmed public identity", () => {
  it("keeps mily spelling and does not add unverified profile fields", () => {
    assert.equal(profile.displayName, "みりぃ");
    assert.equal(profile.legalName, "三橋莉子");
    assert.match(profile.summary, /推測はしません|未確認/);

    const factText = profile.facts
      .flatMap((fact) => [fact.label, fact.value])
      .join("\n");

    assert.equal(profile.facts.length, 2);
    assert.ok(profile.facts.every((fact) => /^https?:\/\//.test(fact.source)));
    assert.match(factText, /MISS CIRCLE CONTEST 2026/);
    assert.match(factText, /ENTRY 734/);
    assert.match(factText, /湘南シーサイドサークル/);
    assert.match(factText, /Mily（ミリー）/);
    assert.doesNotMatch(factText, /生年月日|日本大学|神奈川|身長|所属サークル/);
  });

  it("keeps only confirmed socials and contest/FM links separate", () => {
    assert.equal(socials.length, 4);
    const showroom = socials.find((item) => item.platform === "showroom");
    assert.equal(showroom?.url, "https://www.showroom-live.com/r/circle2026_0734");
    const instagram = socials.find((item) => item.platform === "instagram");
    assert.equal(instagram?.label, "@mily_chan36");
    assert.equal(instagram?.url, "https://www.instagram.com/mily_chan36");
    const x = socials.find((item) => item.platform === "x");
    assert.equal(x?.url, "https://x.com/Mily_chan36");
    const tiktok = socials.find((item) => item.platform === "tiktok");
    assert.equal(tiktok?.url, "https://www.tiktok.com/@mily_chan36");
    assert.ok(socials.every((item) => item.confirmed === true));

    assert.ok(
      links.some((item) => item.url === "https://2026.misscircle.jp/entry/734"),
    );
    assert.ok(links.some((item) => item.url === "https://fm-smw.jp/staff"));

    const linkInstagram = links.filter((item) => /instagram\.com/i.test(item.url));
    assert.equal(linkInstagram.length, 1);
    assert.equal(linkInstagram[0]?.id, "fm-smw-ssc-instagram");
    assert.equal(linkInstagram[0]?.url, "https://www.instagram.com/seasidecircle");
    assert.notEqual(linkInstagram[0]?.url, instagram?.url);

    assert.ok(media.length > 0);
  });
});

describe("support and empty schedule", () => {
  it("introduces a MISS CIRCLE support section without guessing contest rules", async () => {
    const support = await read("src/components/Support.tsx");
    const app = await read("src/App.tsx");

    assert.match(app, /<Support \/>/);
    assert.match(support, /id="support"/);
    assert.match(support, /MISS CIRCLE CONTEST 2026/);
    assert.match(support, /ENTRY 734/);
    assert.match(support, /投票ページを見る/);
    assert.match(support, /https:\/\/2026\.misscircle\.jp\/entry\/734/);
    assert.match(support, /投票方法や最新情報はリンク先でご確認ください/);
    assert.doesNotMatch(support, /順位|締切|投票期間/);
    assert.match(support, /非公式サイト/);
    assert.doesNotMatch(support, /このサイトは公式|公認|本人運営/);
  });

  it("hides the empty schedule section and its nav link until events exist", async () => {
    const schedule = await read("src/components/Schedule.tsx");
    const header = await read("src/components/Header.tsx");

    assert.equal(events.length, 0);
    assert.match(schedule, /if \(events\.length === 0\)/);
    assert.match(schedule, /return null/);
    assert.doesNotMatch(schedule, /いま掲載できる予定はありません/);
    assert.match(header, /flex-wrap/);
    assert.doesNotMatch(header, /overflow-x-auto/);
  });
});
