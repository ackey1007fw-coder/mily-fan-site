import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { activities } from "../src/data/activities.ts";
import { links } from "../src/data/links.ts";
import { news } from "../src/data/news.ts";
import { socials } from "../src/data/socials.ts";
import { selectActivityResources } from "../src/lib/activityContent.ts";

const PROFILE_URL = "https://www.tiktok.com/@seasidecircle";
const PERSONAL_URL = "https://www.tiktok.com/@mily_chan36";
const POST_URL =
  "https://www.tiktok.com/@seasidecircle/video/7676407054466174229";

const read = (relative) =>
  readFile(new URL(`../${relative}`, import.meta.url), "utf8");

describe("Seaside Circle TikTok profile ownership", () => {
  it("stores the canonical program profile in the central links registry", () => {
    const link = links.find(({ id }) => id === "fm-smw-ssc-tiktok");

    assert.deepEqual(link, {
      id: "fm-smw-ssc-tiktok",
      label: "湘南シーサイドサークル TikTok",
      url: PROFILE_URL,
      note: "湘南シーサイドサークル @seasidecircle",
    });
    assert.equal(new URL(link.url).search, "");
    assert.doesNotMatch(link.url, /[?&]_(?:r|t)=/);
  });

  it("keeps the program profile out of Mily's personal socials", () => {
    assert.equal(socials.some(({ url }) => url.includes("@seasidecircle")), false);
    assert.ok(
      socials.some(
        ({ id, platform, url }) =>
          id === "tiktok-mily-chan36" &&
          platform === "tiktok" &&
          url === PERSONAL_URL,
      ),
    );
  });

  it("does not replace PR #49's individual post source", () => {
    const item = news.find(
      ({ id }) => id === "2026-08-21-tiktok-radio-misscircle",
    );

    assert.ok(item);
    assert.equal(item.source, POST_URL);
    assert.notEqual(item.source, PROFILE_URL);
    assert.equal(item.media?.sourceUrl, POST_URL);
  });
});

describe("Seaside Circle TikTok surfaces", () => {
  it("keeps the program profile off the compact home Follow section", async () => {
    const source = await read("src/components/Socials.tsx");

    assert.match(source, /HOME_FOLLOW_HEADING/);
    assert.doesNotMatch(source, /FM_LINK_IDS/);
    assert.doesNotMatch(source, /fm-smw-ssc-tiktok/);
    assert.doesNotMatch(source, /seasidecircle/);
    assert.doesNotMatch(source, /from "\.\.\/data\/links"/);
  });

  it("resolves it from links.ts only inside the Profile RADIO card", async () => {
    const source = await read("src/ProfilePage.tsx");

    assert.match(source, /import \{ links \} from "\.\/data\/links"/);
    assert.match(source, /link\.id === "fm-smw-ssc-tiktok"/);
    assert.match(source, /activity\.id === "radio" && radioProgramTikTok/);
    assert.match(source, /番組側TikTok/);
    assert.match(source, /radioProgramTikTok\.url/);
    assert.match(source, /radioProgramTikTok\.label/);
    assert.doesNotMatch(source, /https:\/\/www\.tiktok\.com\/@seasidecircle/);
  });

  it("resolves it as a RADIO related link and nowhere else", () => {
    const radio = activities.find(({ id }) => id === "radio");
    assert.ok(radio?.relatedLinkIds.includes("fm-smw-ssc-tiktok"));

    const radioResources = selectActivityResources("radio");
    assert.ok(
      radioResources.some(
        ({ id, kind, url }) =>
          id === "fm-smw-ssc-tiktok" &&
          kind === "related-link" &&
          url === PROFILE_URL,
      ),
    );

    for (const activity of activities.filter(({ id }) => id !== "radio")) {
      assert.equal(
        activity.relatedLinkIds.includes("fm-smw-ssc-tiktok"),
        false,
        activity.id,
      );
      assert.equal(
        selectActivityResources(activity.id).some(
          ({ id }) => id === "fm-smw-ssc-tiktok",
        ),
        false,
        activity.id,
      );
    }
  });

  it("preserves the MISS CIRCLE Profile contest selector", async () => {
    const source = await read("src/ProfilePage.tsx");

    assert.match(
      source,
      /activity\.id === "miss-circle" && contest\.currentPhase/,
    );
    assert.match(source, /contest\.currentPhase\.name/);
    assert.match(source, /contest\.lastVerifiedAt/);
    assert.match(source, /contest\.currentPhase\.source/);
  });
});
