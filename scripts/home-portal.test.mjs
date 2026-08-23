import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { visibleStories } from "../src/data/stories.ts";
import {
  selectGalleryEntries,
  selectGalleryPreview,
} from "../src/lib/galleryItems.ts";
import {
  ACTIVITIES_HUB_ROUTE,
  GALLERY_ARCHIVE_INITIAL,
  GALLERY_ARCHIVE_ROUTE,
  HOME_GALLERY_ARCHIVE_CTA,
  HOME_GALLERY_LIMIT,
  HOME_NEWS_ARCHIVE_CTA,
  HOME_NEWS_LIMIT,
  HOME_STORY_ARCHIVE_CTA,
  HOME_STORY_LIMIT,
  NEWS_ARCHIVE_INITIAL,
  NEWS_ARCHIVE_ROUTE,
  STORIES_ARCHIVE_ROUTE,
  SUPPORT_GATEWAY_CTA,
  SUPPORT_HUB_ROUTE,
} from "../src/lib/homePortal.ts";
import { visibleNavItems } from "../src/lib/navigation.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = (relative) => readFileSync(path.join(root, relative), "utf8");
const code = (relative) =>
  source(relative)
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

describe("home portal information architecture", () => {
  it("keeps home as a compact portal: hero follow → now → support → activities → latest → archives", () => {
    const app = source("src/App.tsx");
    const hero = source("src/components/Hero.tsx");
    const at = (tag) => app.indexOf(tag);
    for (const tag of [
      "<Hero />",
      "<TodayDashboard />",
      "<Support />",
      "<ActivitiesGateway />",
      "<Latest",
      "<Stories",
      "<Gallery",
    ]) {
      assert.ok(at(tag) >= 0, `${tag} must render on the home page`);
    }
    assert.match(hero, /<Socials \/>/);
    assert.doesNotMatch(app, /<Socials/);
    assert.ok(at("<Hero />") < at("<TodayDashboard />"));
    assert.ok(at("<TodayDashboard />") < at("<Support />"));
    assert.ok(at("<Support />") < at("<ActivitiesGateway />"));
    assert.ok(at("<ActivitiesGateway />") < at("<Latest"));
    assert.ok(at("<Latest") < at("<Stories"));
    assert.ok(at("<Stories") < at("<Gallery"));
    assert.doesNotMatch(app, /<StreamSchedule/);
    assert.doesNotMatch(app, /<About/);
    assert.doesNotMatch(app, /<Schedule/);
  });

  it("limits home Latest / STORY / Gallery and leaves archive routes as the full lists", () => {
    const app = source("src/App.tsx");
    assert.match(app, /HOME_NEWS_LIMIT/);
    assert.match(app, /HOME_STORY_LIMIT/);
    assert.match(app, /HOME_GALLERY_LIMIT/);
    assert.equal(HOME_NEWS_LIMIT, 3);
    assert.equal(HOME_STORY_LIMIT, 3);
    assert.equal(HOME_GALLERY_LIMIT, 6);
    assert.ok(sortNewsByDateDesc(news).length > HOME_NEWS_LIMIT);
    assert.ok(visibleStories().length > HOME_STORY_LIMIT);
    assert.ok(selectGalleryEntries().length > HOME_GALLERY_LIMIT);
    assert.equal(selectGalleryPreview(HOME_GALLERY_LIMIT).length, HOME_GALLERY_LIMIT);
  });

  it("puts archive CTAs on home without copying NEWS / stories / media", () => {
    const latest = source("src/components/Latest.tsx");
    const stories = source("src/components/Stories.tsx");
    const gallery = source("src/components/Gallery.tsx");
    assert.match(latest, /HOME_NEWS_ARCHIVE_CTA/);
    assert.match(stories, /HOME_STORY_ARCHIVE_CTA/);
    assert.match(gallery, /HOME_GALLERY_ARCHIVE_CTA/);
    assert.equal(HOME_NEWS_ARCHIVE_CTA, "最新情報をすべて見る");
    assert.equal(HOME_STORY_ARCHIVE_CTA, "STORYをもっと見る");
    assert.equal(HOME_GALLERY_ARCHIVE_CTA, "ギャラリーをすべて見る");
    assert.doesNotMatch(code("src/lib/homePortal.ts"), /const news = \[/);
    assert.doesNotMatch(code("src/lib/galleryItems.ts"), /basePath: "\/media\//);
  });

  it("keeps Support and Activities gateways as route CTAs", () => {
    const support = source("src/components/Support.tsx");
    const gateway = source("src/components/ActivitiesGateway.tsx");
    assert.equal(SUPPORT_HUB_ROUTE, "/support/");
    assert.equal(ACTIVITIES_HUB_ROUTE, "/activities/");
    assert.match(support, /SUPPORT_HUB_ROUTE/);
    assert.match(support, new RegExp(SUPPORT_GATEWAY_CTA));
    assert.match(gateway, /ACTIVITIES_HUB_ROUTE/);
    assert.match(gateway, /Activities Hubを見る/);
  });
});

describe("archive pages stay complete", () => {
  it("uses the existing NEWS / STORY / Gallery selectors on archive pages", () => {
    const newsPage = source("src/NewsPage.tsx");
    const storiesPage = source("src/StoriesIndexPage.tsx");
    const galleryPage = source("src/GalleryPage.tsx");
    assert.match(newsPage, /NEWS_ARCHIVE_INITIAL/);
    assert.match(newsPage, /showArchiveCta=\{false\}/);
    assert.match(storiesPage, /<Stories showArchiveCta=\{false\} \/>/);
    assert.match(galleryPage, /GALLERY_ARCHIVE_INITIAL/);
    assert.equal(NEWS_ARCHIVE_INITIAL, 10);
    assert.equal(GALLERY_ARCHIVE_INITIAL, 12);
    assert.match(source("src/components/Latest.tsx"), /sortNewsByDateDesc\(news\)/);
    assert.match(source("src/components/Stories.tsx"), /visibleStories\(\)/);
    assert.match(source("src/components/Gallery.tsx"), /selectGalleryEntries\(\)/);
  });

  it("ships physical MPA routes for the three archives", () => {
    const vite = source("vite.config.ts");
    assert.match(vite, /news: "news\/index.html"/);
    assert.match(vite, /storiesIndex: "stories\/index.html"/);
    assert.match(vite, /gallery: "gallery\/index.html"/);
    assert.match(source("news/index.html"), /src\/news-main\.tsx/);
    assert.match(source("stories/index.html"), /src\/stories-index-main\.tsx/);
    assert.match(source("gallery/index.html"), /src\/gallery-main\.tsx/);
    assert.match(source("news/index.html"), /非公式/);
    assert.match(source("stories/index.html"), /非公式/);
    assert.match(source("gallery/index.html"), /非公式/);
    assert.equal(NEWS_ARCHIVE_ROUTE, "/news/");
    assert.equal(STORIES_ARCHIVE_ROUTE, "/stories/");
    assert.equal(GALLERY_ARCHIVE_ROUTE, "/gallery/");
  });
});

describe("home portal navigation", () => {
  it("uses route navigation instead of a wrapping home-anchor pill list", () => {
    const items = visibleNavItems();
    assert.deepEqual(
      items.map(({ href }) => href),
      [
        "/",
        "/activities/",
        "/support/",
        "/news/",
        "/stories/",
        "/gallery/",
        "/profile/",
      ],
    );
    assert.ok(items.every((item) => item.kind === "route"));
    const header = source("src/components/Header.tsx");
    assert.match(header, /aria-expanded=\{open\}/);
    assert.match(header, /aria-controls=\{menuId\}/);
    assert.match(header, /メニュー/);
    assert.match(header, /min-h-11/);
    assert.doesNotMatch(header, /overflow-x-auto/);
    assert.doesNotMatch(header, /compactHubLink|compactSectionLink/);
    assert.doesNotMatch(header, /sectionNavigation\(events\.length\)/);
  });
});

describe("home portal data safety", () => {
  it("does not hardcode the contest entry URL on the new portal files", () => {
    for (const relative of [
      "src/App.tsx",
      "src/lib/homePortal.ts",
      "src/lib/galleryItems.ts",
      "src/components/Latest.tsx",
      "src/components/Stories.tsx",
      "src/components/Gallery.tsx",
      "src/components/Socials.tsx",
      "src/components/Header.tsx",
    ]) {
      assert.doesNotMatch(
        code(relative),
        /2026\.misscircle\.jp\/entry\/734/,
        relative,
      );
    }
  });

  it("keeps Follow compact to personal socials and the radio activity route", () => {
    const socials = source("src/components/Socials.tsx");
    assert.match(socials, /Follow Mily/);
    assert.match(socials, /socials\.find/);
    assert.match(socials, /activities\.find/);
    assert.match(socials, /activity\.id === "radio"/);
    assert.match(socials, /radioActivity\.route/);
    assert.doesNotMatch(code("src/components/Socials.tsx"), /from "\.\.\/data\/links"/);
    assert.doesNotMatch(code("src/components/Socials.tsx"), /from "\.\.\/data\/radio"/);
    assert.doesNotMatch(socials, /FM湘南マジックウェイブ|エントリーページへ|seasidecircle/);
    assert.doesNotMatch(code("src/components/Socials.tsx"), /fm-smw\.jp/);
  });
});
