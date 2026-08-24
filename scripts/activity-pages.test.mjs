import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { activities } from "../src/data/activities.ts";
import { news } from "../src/data/news.ts";
import { activitiesUrl, activityUrl, sitemapXml } from "../src/data/site.ts";
import { tiktokRadioVideo } from "../src/data/tiktokRadioVideo.ts";
import {
  selectActivityNews,
  selectActivityPageContent,
  selectActivityResources,
} from "../src/lib/activityContent.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import {
  activityPageMetadata,
  activityPageStructuredData,
} from "../src/lib/activityMetadata.ts";
import {
  ACTIVITIES_HUB_ROUTE,
  activityByRoute,
} from "../src/lib/activityRoute.ts";
import { selectLiveActivityStatus } from "../src/lib/activityStatus.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = (relative) => readFileSync(path.join(root, relative), "utf8");

const activityIds = new Set(activities.map(({ id }) => id));
const activityPages = [
  { route: ACTIVITIES_HUB_ROUTE, file: "activities/index.html" },
  ...activities.map((activity) => ({
    route: activity.route,
    file: `${activity.route.slice(1)}index.html`,
  })),
];

const expectedNewsRelations = {
  "2026-08-24-campus-girls-final-stage-guide": ["campus-girls"],
  "2026-08-24-night-thanks-morning-stream": ["live-stream", "radio"],
  "2026-08-23-seaside-circle-musical-special": ["radio"],
  "2026-08-23-morning-showroom-fanroom": ["live-stream", "radio"],
  "2026-08-23-early-showroom-fanroom": ["live-stream", "radio"],
  "2026-08-22-night-showroom-thanks": ["live-stream"],
  "2026-08-22-night-showroom-fanroom": ["live-stream"],
  "2026-08-22-evening-showroom-fanroom": ["live-stream"],
  "2026-08-22-campus-girls-second-stage-jury-award": ["campus-girls"],
  "2026-08-21-tiktok-radio-misscircle": ["radio", "miss-circle"],
  "2026-08-21-after-afternoon-ganda": ["live-stream"],
  "2026-08-21-afternoon-showroom-fanroom": ["live-stream"],
  "2026-08-21-event-story-next-slot": ["live-stream"],
  "2026-08-21-morning-showroom-runway": ["live-stream"],
  "2026-08-19-second-round-result": ["miss-circle"],
  "2026-08-18-evening-radio": ["radio", "live-stream"],
  "2026-08-18-morning-update": ["live-stream"],
};

describe("Activities MPA routes and metadata", () => {
  it("keeps all five physical routes in the Vite build inputs", () => {
    const viteConfig = source("vite.config.ts");
    for (const { file } of activityPages) {
      assert.ok(viteConfig.includes(`\"${file}\"`), file);
      assert.doesNotThrow(() => source(file));
    }
  });

  it("maps every Activity route to its central Activity record", () => {
    for (const activity of activities) {
      assert.equal(activityByRoute(activity.route), activity);
      assert.equal(selectActivityPageContent(activity.id).activity, activity);
    }
  });

  it("has one canonical per route and includes every route in the sitemap", () => {
    const metadata = activityPages.map(({ route }) => activityPageMetadata(route));
    assert.equal(new Set(metadata.map(({ canonical }) => canonical)).size, 5);
    assert.equal(metadata[0].canonical, activitiesUrl());
    for (const activity of activities) {
      assert.equal(activityPageMetadata(activity.route).canonical, activityUrl(activity.route));
    }
    for (const { canonical } of metadata) {
      assert.match(sitemapXml(), new RegExp(`<loc>${canonical}</loc>`));
    }
  });

  it("keeps all route metadata visibly fan-made and unofficial", () => {
    for (const { route, file } of activityPages) {
      const html = source(file);
      const metadata = activityPageMetadata(route);
      const structured = JSON.stringify(activityPageStructuredData(route));
      assert.match(metadata.title, /非公式/);
      assert.match(metadata.description, /ファン制作.*非公式/);
      assert.match(html, /みりぃ ファンサイト（非公式）/);
      assert.match(structured, /非公式/);
      assert.doesNotMatch(structured, /(?<!非)公式活動ページ|(?<!非)公式プロフィール/);
    }
  });
});

describe("Activities Hub and explicit NEWS relations", () => {
  it("renders the four Hub cards from the Activity registry", () => {
    const pageSource = source("src/ActivitiesPage.tsx");
    assert.equal(activities.length, 4);
    assert.match(pageSource, /activities\.map\(\(activity\)/);
    assert.match(pageSource, /<ActivityHubCard key=\{activity\.id\} activity=\{activity\} \/>/);
    assert.doesNotMatch(pageSource, /const\s+activityCards\s*=/);
  });

  it("keeps activityIds optional, typed, explicit, and limited to ActivityId", () => {
    const newsSource = source("src/data/news.ts");
    assert.match(newsSource, /activityIds\?: ActivityId\[\]/);
    const tagged = Object.fromEntries(
      news.filter(({ activityIds }) => activityIds).map(({ id, activityIds }) => [id, activityIds]),
    );
    assert.deepEqual(tagged, expectedNewsRelations);
    for (const item of news) {
      for (const id of item.activityIds ?? []) assert.ok(activityIds.has(id), `${item.id}: ${id}`);
    }
  });

  it("uses the one NEWS sorter and only explicit ids, without keyword or host inference", () => {
    const selectorSource = source("src/lib/activityContent.ts");
    assert.match(selectorSource, /sortNewsByDateDesc\(items\)/);
    assert.match(selectorSource, /item\.activityIds\?\.includes\(activityId\)/);
    assert.doesNotMatch(selectorSource, /title\.includes|body\.includes|new URL|hostname|keyword/i);

    const selected = selectActivityNews("live-stream", news, news.length);
    assert.ok(selected.length > 0);
    assert.ok(selected.every(({ activityIds }) => activityIds?.includes("live-stream")));
  });

  it("does not move current state into Activity identity", () => {
    const forbidden = [
      "currentPhase",
      "currentRank",
      "currentEvent",
      "statusLabel",
      "start",
      "end",
      "deadline",
    ];
    for (const activity of activities) {
      for (const field of forbidden) assert.equal(field in activity, false, `${activity.id}.${field}`);
    }
  });
});

describe("Activity domain adapters and relations", () => {
  it("derives radio copy from the shared program and never claims personal appearance", () => {
    const statusSource = source("src/lib/activityStatus.ts");
    const pageSource = source("src/ActivitiesPage.tsx");
    assert.match(statusSource, /radioProgram\.scheduledStart/);
    assert.match(statusSource, /radioProgram\.scheduledEnd/);
    assert.match(statusSource, /本人の出演時間を示すものではありません/);
    assert.doesNotMatch(statusSource, /本人出演中|みりぃ出演中/);
    assert.match(pageSource, /番組のNOW ON AIRを確認/);
  });

  it("hides unknown empty stream state without saying that there are no plans", () => {
    assert.equal(
      selectLiveActivityStatus({ state: "unknown", roomUrl: null }, [], null),
      null,
    );
    const sources = [source("src/ActivitiesPage.tsx"), source("src/lib/activityStatus.ts")];
    for (const value of sources) assert.doesNotMatch(value, /予定なし/);
    assert.equal(selectActivityPageContent("miss-circle").activity.id, "miss-circle");
  });

  it("resolves highlights and STORY records through Activity relations", () => {
    for (const activity of activities) {
      const content = selectActivityPageContent(activity.id);
      assert.deepEqual(
        content.highlights.map(({ id }) => id),
        activity.relatedHighlightIds,
      );
      assert.deepEqual(
        content.stories.map(({ slug }) => slug),
        activity.relatedStorySlugs,
      );
    }
  });

  it("reuses canonical media manifests and deduplicates them by id", () => {
    const media = selectActivityMedia("radio");
    assert.equal(media.filter(({ id }) => id === tiktokRadioVideo.id).length, 1);
    assert.equal(media.find(({ id }) => id === tiktokRadioVideo.id), tiktokRadioVideo);
  });

  it("keeps personal socials and program links as different resource kinds", () => {
    const radioResources = selectActivityResources("radio");
    assert.ok(radioResources.some(({ id, kind }) => id === "fm-smw-ssc-instagram" && kind === "related-link"));
    assert.equal(radioResources.some(({ kind }) => kind === "personal-social"), false);

    const liveResources = selectActivityResources("live-stream");
    assert.ok(liveResources.some(({ id, kind }) => id === "showroom-circle2026-0734" && kind === "personal-social"));
  });
});
