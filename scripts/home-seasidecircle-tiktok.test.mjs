import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { radioProgram } from "../shared/radio-program.js";
import { links } from "../src/data/links.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFile(path.join(root, relative), "utf8");

describe("Seaside Circle home routes", () => {
  it("keeps the official program page as a canonical related link", () => {
    const program = links.find((link) => link.id === "fm-smw-ssc-program");

    assert.ok(program);
    assert.equal(program.url, radioProgram.programUrl);
    assert.equal(program.label, "湘南シーサイドサークル 番組ページ");
    assert.doesNotMatch(program.url, /[?&](?:utm_|ref=)/);
  });

  it("keeps the canonical program TikTok URL in links.ts", () => {
    const tiktok = links.find((link) => link.id === "fm-smw-ssc-tiktok");

    assert.ok(tiktok);
    assert.equal(tiktok.url, "https://www.tiktok.com/@seasidecircle");
    assert.equal(tiktok.label, "湘南シーサイドサークル TikTok");
    assert.equal(tiktok.note, "湘南シーサイドサークル @seasidecircle");
    assert.doesNotMatch(tiktok.url, /[?_](?:r|t)=|\?/);
  });

  it("surfaces the program page and TikTok directly from the home hero", async () => {
    const hero = await read("src/components/Hero.tsx");

    assert.match(hero, /import \{ campusGirlsPatonVoteLink, links \} from "\.\.\/data\/links"/);
    assert.match(hero, /link\.id === "fm-smw-ssc-program"/);
    assert.match(hero, /link\.id === "fm-smw-ssc-tiktok"/);
    assert.match(hero, /href=\{link\.url\}/);
    assert.match(hero, /\{link\.label\}/);
    assert.match(hero, /aria-label="湘南シーサイドサークル 番組リンク"/);
    assert.ok(
      hero.indexOf("<Socials />") < hero.indexOf("{seasideCircleLinks.length > 0 ?"),
      "program links must sit after the personal Follow / radio block",
    );
  });

  it("promotes the official program page on the radio activity", async () => {
    const activityPage = await read("src/ActivitiesPage.tsx");

    assert.match(activityPage, /href=\{radioProgram\.programUrl\}/);
    assert.match(activityPage, /湘南シーサイドサークル 番組ページを見る/);
    assert.match(activityPage, /番組のNOW ON AIRを確認/);
  });

  it("does not reclassify the program account as Mily's personal TikTok", async () => {
    const socials = await read("src/components/Socials.tsx");

    assert.doesNotMatch(socials, /from "\.\.\/data\/links"/);
    assert.doesNotMatch(socials, /@seasidecircle|fm-smw-ssc-tiktok/);
    assert.match(socials, /aria-label="本人SNS"/);
  });
});
