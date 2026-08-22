import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const linksSource = await readFile(new URL("../src/data/links.ts", import.meta.url), "utf8");
const socialsSource = await readFile(new URL("../src/data/socials.ts", import.meta.url), "utf8");
const socialsComponentSource = await readFile(
  new URL("../src/components/Socials.tsx", import.meta.url),
  "utf8",
);

test("Seaside Circle TikTok is stored as a program link with a canonical URL", () => {
  assert.match(linksSource, /id: "fm-smw-ssc-tiktok"/);
  assert.match(linksSource, /label: "湘南シーサイドサークル TikTok"/);
  assert.match(linksSource, /url: "https:\/\/www\.tiktok\.com\/@seasidecircle"/);
  assert.doesNotMatch(linksSource, /_r=1|_t=/);
});

test("Seaside Circle TikTok stays separate from Mily's personal socials", () => {
  assert.doesNotMatch(socialsSource, /@seasidecircle/);
  assert.match(socialsSource, /https:\/\/www\.tiktok\.com\/@mily_chan36/);
});

test("Seaside Circle TikTok is surfaced with the FM program links", () => {
  assert.match(socialsComponentSource, /"fm-smw-ssc-tiktok"/);
});
