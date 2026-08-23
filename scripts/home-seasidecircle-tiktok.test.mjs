import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { links } from "../src/data/links.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFile(path.join(root, relative), "utf8");

describe("Seaside Circle TikTok home route", () => {
  it("keeps the canonical program TikTok URL in links.ts", () => {
    const tiktok = links.find((link) => link.id === "fm-smw-ssc-tiktok");

    assert.ok(tiktok);
    assert.equal(tiktok.url, "https://www.tiktok.com/@seasidecircle");
    assert.equal(tiktok.label, "湘南シーサイドサークル TikTok");
    assert.equal(tiktok.note, "湘南シーサイドサークル @seasidecircle");
    assert.doesNotMatch(tiktok.url, /[?_](?:r|t)=|\?/);
  });

  it("surfaces the program TikTok directly from the home hero", async () => {
    const hero = await read("src/components/Hero.tsx");

    assert.match(hero, /import \{ links \} from "\.\.\/data\/links"/);
    assert.match(hero, /link\.id === "fm-smw-ssc-tiktok"/);
    assert.match(hero, /href=\{seasideCircleTikTok\.url\}/);
    assert.match(hero, /\{seasideCircleTikTok\.label\}/);
    assert.match(hero, /aria-label="湘南シーサイドサークル 番組SNS"/);
    assert.ok(
      hero.indexOf("<Socials />") < hero.indexOf("{seasideCircleTikTok ?"),
      "program TikTok must sit after the personal Follow / radio block",
    );
  });

  it("does not reclassify the program account as Mily's personal TikTok", async () => {
    const socials = await read("src/components/Socials.tsx");

    assert.doesNotMatch(socials, /from "\.\.\/data\/links"/);
    assert.doesNotMatch(socials, /@seasidecircle|fm-smw-ssc-tiktok/);
    assert.match(socials, /aria-label="本人SNS"/);
  });
});
