import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { events } from "../src/data/events.ts";
import { highlights } from "../src/data/highlights.ts";
import { links } from "../src/data/links.ts";
import { news } from "../src/data/news.ts";
import { profile } from "../src/data/profile.ts";
import { socials } from "../src/data/socials.ts";
import {
  verifyAllContent,
  verifyEvents,
  verifyNews,
  verifySocials,
  claimsThisSiteIsOfficial,
} from "./content-invariants.mjs";

const validNews = {
  id: "sample-news",
  date: "2026-08-14",
  title: "確認済みのお知らせ",
  body: "出典がある公開情報だけを載せる。",
  source: "https://example.com/source",
  url: "https://example.com/post",
};

const validEvent = {
  id: "sample-event",
  title: "確認済みの出演",
  startAt: "2026-08-14T20:00:00+09:00",
  timezone: "Asia/Tokyo",
  kind: "appearance",
  source: "https://example.com/event-source",
  url: "https://example.com/event",
};

const validSocial = {
  id: "sample-x",
  platform: "x",
  label: "X",
  url: "https://x.com/example",
  confirmed: true,
};

describe("content verification invariants", () => {
  it("accepts the live collections, including when they later have items", () => {
    const errors = verifyAllContent({
      news,
      events,
      socials,
      links,
      highlights,
      facts: profile.facts,
    });
    assert.deepEqual(errors, []);
  });

  it("accepts confirmed items so adding real data does not fail CI", () => {
    const errors = verifyAllContent({
      news: [validNews],
      events: [validEvent],
      socials: [validSocial],
      links: [
        {
          id: "sample-link",
          label: "ファンサイト案内",
          url: "https://example.com/about",
        },
      ],
      highlights: [
        {
          id: "sample-highlight",
          year: 2026,
          title: "確認済みの記録",
          source: "https://example.com/highlight",
        },
      ],
      facts: [
        {
          label: "公開名",
          value: "みりぃ",
          source: "https://example.com/profile",
        },
      ],
    });
    assert.deepEqual(errors, []);
  });

  it("rejects unverified or incomplete news", () => {
    const errors = verifyNews([
      {
        id: "bad-news",
        date: "8/14",
        title: "公式サイトです",
        body: "吉井優花子さんの情報",
      },
    ]);
    assert.ok(errors.some((error) => error.includes("real YYYY-MM-DD")));
    assert.ok(errors.some((error) => error.includes("confirmed http(s) URL")));
    assert.ok(errors.some((error) => error.includes("another person")));
    assert.ok(errors.some((error) => error.includes("this site is official")));
  });

  it("allows truthful references to external official sources", () => {
    const errors = verifyNews([
      {
        id: "external-official",
        date: "2026-08-14",
        title: "主催者公式サイトと本人公式アカウントの案内",
        body: "公式チケットページと公式発表を確認した。",
        source: "https://example.com/organizer",
      },
    ]);
    assert.deepEqual(errors, []);
    assert.equal(claimsThisSiteIsOfficial("主催者公式サイト"), false);
    assert.equal(claimsThisSiteIsOfficial("本人公式アカウント"), false);
    assert.equal(claimsThisSiteIsOfficial("公式チケットページ"), false);
    assert.equal(claimsThisSiteIsOfficial("公式サイトです"), true);
    assert.equal(claimsThisSiteIsOfficial("このサイトは公式です"), true);
    assert.equal(claimsThisSiteIsOfficial("公式ファンサイト"), true);
  });

  it("rejects semantically invalid timestamps even when the regex shape matches", () => {
    const impossibleDate = verifyEvents([
      {
        ...validEvent,
        id: "feb-31",
        startAt: "2026-02-31",
      },
    ]);
    const impossibleTime = verifyEvents([
      {
        ...validEvent,
        id: "hour-99",
        startAt: "2026-08-14T99:00:00+09:00",
      },
    ]);

    assert.ok(
      impossibleDate.some((error) => error.includes("real date-only or datetime")),
    );
    assert.ok(
      impossibleTime.some((error) => error.includes("real date-only or datetime")),
    );
    assert.equal(
      verifyEvents([{ ...validEvent, startAt: "2026-08-14" }]).length,
      0,
    );
    assert.equal(
      verifyEvents([{ ...validEvent, startAt: "2026-08-14T20:00:00+09:00" }]).length,
      0,
    );
  });

  it("rejects unconfirmed socials and invalid event timestamps", () => {
    const socialErrors = verifySocials([
      {
        id: "bad-social",
        platform: "x",
        label: "X",
        url: "javascript:alert(1)",
        confirmed: false,
      },
    ]);
    assert.ok(socialErrors.some((error) => error.includes("must be confirmed")));
    assert.ok(socialErrors.some((error) => error.includes("http(s) URL")));

    const eventErrors = verifyEvents([
      {
        id: "bad-event",
        title: "未確認",
        startAt: "tomorrow",
        timezone: "UTC",
        kind: "party",
        source: "not-a-url",
      },
    ]);
    assert.ok(eventErrors.some((error) => error.includes("real date-only or datetime")));
    assert.ok(eventErrors.some((error) => error.includes("Asia/Tokyo")));
  });
});
