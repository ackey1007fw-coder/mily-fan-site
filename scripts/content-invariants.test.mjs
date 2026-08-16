import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { events } from "../src/data/events.ts";
import { highlights } from "../src/data/highlights.ts";
import { links } from "../src/data/links.ts";
import { media } from "../src/data/media.ts";
import { news } from "../src/data/news.ts";
import { profile, profileSources } from "../src/data/profile.ts";
import { socials } from "../src/data/socials.ts";
import {
  verifyAllContent,
  verifyEvents,
  verifyMedia,
  verifyNews,
  verifyActivities,
  verifyCollections,
  verifyFacts,
  verifyProfileSources,
  verifySocials,
  verifyVision,
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
      profile,
      profileSources,
      media,
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
      profile: {
        facts: [
          {
            id: "public-name",
            section: "identity",
            label: "公開名",
            value: "みりぃ",
            sourceIds: ["example"],
            status: "confirmed",
          },
        ],
        vision: {
          id: "vision",
          title: "確認済みの目標",
          body: "公開プロフィールに記載されている目標。",
          sourceIds: ["example"],
          status: "time-sensitive",
          asOf: "2026-08-16",
        },
        activities: [],
        collections: [],
      },
      profileSources: {
        example: {
          id: "example",
          title: "確認済みプロフィール",
          publisher: "主催者",
          url: "https://example.com/profile",
          verifiedAt: "2026-08-14",
        },
      },
      media: [
        {
          id: "sample-photo",
          kind: "photo",
          basePath: "/media/gallery/mily-b01-01-sample",
          widths: [480, 960],
          width: 960,
          height: 720,
          alt: "確認済みの写真",
          provenance: "sns-post",
          sourceUrl: "https://example.com/photo-source",
          sourceDate: "2026-08-02",
          credit: null,
          featured: true,
          published: true,
        },
      ],
    });
    assert.deepEqual(errors, []);
  });

  it("rejects unsourced or stale-shaped profile facts", () => {
    const sources = {
      confirmed: {
        id: "confirmed-source",
        title: "確認済みプロフィール",
        publisher: "主催者",
        url: "https://example.com/profile",
        verifiedAt: "2026-08-16",
      },
    };
    assert.deepEqual(verifyProfileSources(sources), []);

    const errors = verifyFacts(
      [
        {
          id: "bad-fact",
          section: "unknown",
          label: "変動情報",
          value: "現在の値",
          sourceIds: ["missing"],
          status: "time-sensitive",
        },
      ],
      sources,
    );

    assert.ok(errors.some((error) => error.includes("invalid section")));
    assert.ok(errors.some((error) => error.includes("unknown sourceId")));
    assert.ok(errors.some((error) => error.includes("need a real asOf")));
  });

  it("enforces provenance, safety, and asOf across vision, activities, and collections", () => {
    const sources = {
      confirmed: {
        id: "confirmed-source",
        title: "確認済みプロフィール",
        publisher: "主催者",
        url: "https://example.com/profile",
        verifiedAt: "2026-08-16",
      },
    };
    const sharedBadContent = {
      sourceIds: ["missing"],
      status: "time-sensitive",
      body: "このサイトは公式です。吉井優花子さんの情報です。",
    };

    const visionErrors = verifyVision(
      { id: "bad-vision", title: "変動する目標", ...sharedBadContent },
      sources,
    );
    const activityErrors = verifyActivities(
      [
        {
          id: "bad-activity",
          eyebrow: "ACTIVITY",
          title: "変動する活動",
          points: ["確認前の情報"],
          ...sharedBadContent,
        },
      ],
      sources,
    );
    const collectionErrors = verifyCollections(
      [
        {
          id: "bad-collection",
          title: "変動する好み",
          note: "このサイトは公式です。吉井優花子さんの情報です。",
          items: ["確認前の情報"],
          sourceIds: [],
          status: "time-sensitive",
        },
      ],
      sources,
    );

    for (const errors of [visionErrors, activityErrors, collectionErrors]) {
      assert.ok(errors.some((error) => error.includes("sourceId")));
      assert.ok(errors.some((error) => error.includes("asOf")));
      assert.ok(errors.some((error) => error.includes("another person")));
      assert.ok(errors.some((error) => error.includes("must not claim this site is official")));
    }
  });

  it("rejects FM-derived profile content without the cross-source identity evidence set", () => {
    const errors = verifyCollections(
      [
        {
          id: "fm-only",
          title: "FM掲載内容",
          note: "FMプロフィールに掲載された内容。",
          items: ["公開情報"],
          sourceIds: ["fmProfile"],
          status: "time-sensitive",
          asOf: "2026-08-16",
        },
      ],
      {
        fmProfile: {},
        missCircle: {},
        instagramProfile: {},
        fmProgramInstagram: {},
      },
    );

    assert.ok(errors.some((error) => error.includes("cross-source identity evidence")));
  });

  it("rejects incomplete media and filenames off the mily- scheme", () => {
    const kindErrors = verifyMedia([
      {
        id: "bad-kind",
        kind: "clip",
        basePath: "/media/gallery/mily-b01-01-sample",
        widths: [480],
        width: 480,
        height: 360,
        alt: "確認済みの写真",
        provenance: "owner-provided",
        sourceUrl: null,
        sourceDate: null,
        credit: null,
        published: true,
      },
    ]);
    const fileErrors = verifyMedia([
      {
        id: "bad-filename",
        kind: "photo",
        basePath: "/media/gallery/birthday",
        widths: [480],
        width: 480,
        height: 360,
        alt: "吉井優花子さんの写真",
        provenance: "sns-post",
        sourceUrl: null,
        sourceDate: null,
        credit: null,
        published: true,
      },
    ]);
    assert.ok(kindErrors.some((error) => error.includes("invalid kind")));
    assert.ok(fileErrors.some((error) => error.includes("mily-bNN-NN")));
    assert.ok(fileErrors.some((error) => error.includes("sourceUrl")));
    assert.ok(fileErrors.some((error) => error.includes("another person")));
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
    assert.equal(claimsThisSiteIsOfficial("当サイトは公式です"), true);
    assert.equal(claimsThisSiteIsOfficial("このファンサイトは公式です"), true);
    assert.equal(claimsThisSiteIsOfficial("当ファンサイトは公認です"), true);
    assert.equal(claimsThisSiteIsOfficial("このページは本人運営です"), true);
    assert.equal(claimsThisSiteIsOfficial("このサイトは公式サイトである"), true);
    assert.equal(claimsThisSiteIsOfficial("当サイトは公式サイトです"), true);
    assert.equal(claimsThisSiteIsOfficial("当サイトは公式サイトではあります"), true);
    assert.equal(claimsThisSiteIsOfficial("このファンサイトは公式サイトです"), true);
    assert.equal(claimsThisSiteIsOfficial("当ファンサイトは公認サイトです"), true);
    assert.equal(claimsThisSiteIsOfficial("主催者公式サイトはこちら"), false);
    assert.equal(claimsThisSiteIsOfficial("本人公式サイトを参照"), false);
    assert.equal(claimsThisSiteIsOfficial("イベント公式サイト"), false);
    assert.equal(claimsThisSiteIsOfficial("イベント公式サイトはこちら"), false);
    assert.equal(claimsThisSiteIsOfficial("主催者公式サイトで確認した"), false);
    assert.equal(claimsThisSiteIsOfficial("公式サイトで確認した"), false);
    assert.equal(claimsThisSiteIsOfficial("公式サイトでの発表を確認した"), false);
    assert.equal(claimsThisSiteIsOfficial("当サイトは本人公式サイトです"), true);
    assert.equal(claimsThisSiteIsOfficial("このサイトはイベント公式サイトです"), true);
    assert.equal(claimsThisSiteIsOfficial("本サイトは本人公式サイトです"), true);
    assert.equal(claimsThisSiteIsOfficial("このファンサイトはイベント公式サイトです"), true);
  });

  it("rejects self-referential official-site claims without stripping 公式サイト", () => {
    const asNews = (title) =>
      verifyNews([
        {
          ...validNews,
          id: "self-official-site",
          title,
        },
      ]);

    for (const title of [
      "このサイトは公式サイトである",
      "当サイトは公式サイトです",
      "このファンサイトは公式サイトです",
      "当ファンサイトは公認サイトです",
      "当サイトは本人公式サイトです",
      "このサイトはイベント公式サイトです",
      "本サイトは本人公式サイトです",
      "このファンサイトはイベント公式サイトです",
    ]) {
      assert.ok(
        asNews(title).some((error) => error.includes("this site is official")),
        `should reject: ${title}`,
      );
    }

    for (const title of [
      "主催者公式サイトはこちら",
      "本人公式サイトを参照",
      "イベント公式サイトの案内",
      "イベント公式サイトはこちら",
      "主催者公式サイトで確認した",
    ]) {
      assert.equal(
        asNews(title).filter((error) => error.includes("this site is official"))
          .length,
        0,
        `should allow: ${title}`,
      );
    }
  });

  it("rejects event ranges whose end precedes the start", () => {
    const dateOnly = verifyEvents([
      {
        ...validEvent,
        id: "end-before-start-date",
        startAt: "2027-01-10",
        endAt: "2027-01-09",
      },
    ]);
    const datetime = verifyEvents([
      {
        ...validEvent,
        id: "end-before-start-datetime",
        startAt: "2027-01-10T20:00:00+09:00",
        endAt: "2027-01-10T19:00:00+09:00",
      },
    ]);
    const mixed = verifyEvents([
      {
        ...validEvent,
        id: "end-before-start-mixed",
        startAt: "2027-01-10T00:00:00+09:00",
        endAt: "2027-01-09",
      },
    ]);

    assert.ok(dateOnly.some((error) => error.includes("endAt must not precede startAt")));
    assert.ok(datetime.some((error) => error.includes("endAt must not precede startAt")));
    assert.ok(mixed.some((error) => error.includes("endAt must not precede startAt")));
    assert.equal(
      verifyEvents([
        { ...validEvent, id: "same-day", startAt: "2027-01-10", endAt: "2027-01-10" },
      ]).length,
      0,
    );
    assert.equal(
      verifyEvents([
        {
          ...validEvent,
          id: "same-instant",
          startAt: "2027-01-10T20:00:00+09:00",
          endAt: "2027-01-10T20:00:00+09:00",
        },
      ]).length,
      0,
    );
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
