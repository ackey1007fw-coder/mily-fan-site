import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, readdir, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { driveGallerySections, driveVideoView, visibleDriveGallery } from "../src/data/driveGallery.ts";
import {
  galleryVideos,
  morningStoryVideo,
  visibleGalleryVideos,
} from "../src/data/galleryVideos.ts";
import { media } from "../src/data/media.ts";
import { news } from "../src/data/news.ts";
import { stories } from "../src/data/stories.ts";
import { validateVideoDerivatives } from "./build-drive-gallery.mjs";
import { verifyNews } from "./content-invariants.mjs";
import {
  DRIVE_HOST_PATTERN,
  findDriveIds,
  isProbablyBinary,
} from "./scan-tracked-text.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetDirectory = path.join(root, "public/media/gallery");
const expectedMessage = "8/17（月）今日からお仕事が始まる皆さん応援して…";

async function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

describe("2026-08-17 morning Instagram Story", () => {
  it("keeps the approved Latest copy and only the visible message range", () => {
    const item = news.find((entry) => entry.id === "2026-08-17-morning-story");

    assert.ok(item);
    assert.equal(item.date, "2026-08-17");
    assert.equal(item.title, "おはよう☀️ 朝のストーリー");
    assert.equal(
      item.body,
      "猫耳フィルターで「OHAYO!!」。みりぃから届いた朝のひとコマ。",
    );
    assert.equal(item.message?.label, "みりぃのメッセージ");
    assert.equal(item.message?.text, expectedMessage);
    assert.equal(item.message?.text.endsWith("…"), true);
  });

  it("uses a non-link source label when no permanent Story URL exists", async () => {
    const item = news.find((entry) => entry.id === "2026-08-17-morning-story");
    const latest = await read("src/components/Latest.tsx");

    assert.ok(item);
    assert.equal(item.source, undefined);
    assert.equal(item.sourceLabel, "Instagram Story");
    assert.deepEqual(verifyNews([item]), []);
    assert.match(latest, /item\.source \? \(/);
    assert.match(latest, /: item\.sourceLabel \? \(/);
    assert.match(latest, /<span className=/);
    assert.doesNotMatch(latest, /href=""|href="#"|href=\{item\.source \?\? ""\}/);
  });

  it("keeps the birthday source link and CTA intact", async () => {
    const birthday = news.find((entry) => entry.id === "2026-08-02-21st-birthday");
    const latest = await read("src/components/Latest.tsx");

    assert.ok(birthday);
    assert.equal(birthday.source, "https://www.instagram.com/p/DbiY3PHk1c8/");
    assert.equal(birthday.ctaLabel, "Instagramの投稿を見る");
    assert.match(latest, /href=\{item\.source\}/);
    assert.match(latest, /href=\{ctaHref\}/);
  });
});

describe("shared morning Story assets", () => {
  it("uses one MP4 and one poster object in both Latest and Gallery", () => {
    const item = news.find((entry) => entry.id === "2026-08-17-morning-story");

    assert.ok(item?.media);
    assert.equal(item.media, morningStoryVideo);
    assert.equal(galleryVideos[0], morningStoryVideo);
    assert.equal(item.media.src, morningStoryVideo.src);
    assert.equal(item.media.poster, morningStoryVideo.poster);
    assert.equal(item.media.src, "/media/gallery/mily-b03-01-morning-ohayo.mp4");
    assert.equal(
      item.media.poster,
      "/media/gallery/mily-b03-01-morning-ohayo-poster.jpg",
    );
  });

  it("ships the sanitized MP4 and real-frame poster", async () => {
    const mp4 = path.join(root, "public", morningStoryVideo.src);
    const poster = path.join(root, "public", morningStoryVideo.poster);

    assert.equal(existsSync(mp4), true);
    assert.equal(existsSync(poster), true);
    assert.ok((await stat(mp4)).size > 0);
    assert.ok((await stat(mp4)).size < 5 * 1024 * 1024);
    assert.ok((await stat(poster)).size > 0);
    assert.deepEqual(
      await validateVideoDerivatives(morningStoryVideo, assetDirectory),
      { width: 720, height: 1280 },
    );
  });

  it("does not publish a second purpose-specific copy or the UI screenshot", async () => {
    const files = await readdir(path.join(root, "public"), { recursive: true });
    const morningAssets = files
      .map((file) => String(file).replaceAll("\\", "/"))
      .filter((file) => file.includes("mily-b03-01-morning-ohayo"));

    assert.deepEqual(morningAssets.sort(), [
      "media/gallery/mily-b03-01-morning-ohayo-poster.jpg",
      "media/gallery/mily-b03-01-morning-ohayo.mp4",
    ]);
    assert.equal(
      files.some((file) => /写真1|screenshot|story-screen/i.test(String(file))),
      false,
    );
  });

  it("keeps Drive handoff details out of frontend text and public text assets", async () => {
    const frontendFiles = [
      "src/data/news.ts",
      "src/data/galleryVideos.ts",
      "src/data/morningStoryVideo.json",
      "src/components/Latest.tsx",
      "src/components/Gallery.tsx",
    ];

    for (const relative of frontendFiles) {
      const source = await read(relative);
      assert.equal(DRIVE_HOST_PATTERN.test(source), false, relative);
      assert.deepEqual(findDriveIds(source), [], relative);
    }

    const publicFiles = await readdir(path.join(root, "public"), { recursive: true });
    for (const relative of publicFiles) {
      const file = path.join(root, "public", relative);
      if (!(await stat(file)).isFile()) continue;
      const bytes = await readFile(file);
      if (isProbablyBinary(bytes)) continue;
      const source = bytes.toString("utf8");
      assert.equal(DRIVE_HOST_PATTERN.test(source), false, String(relative));
      assert.deepEqual(findDriveIds(source), [], String(relative));
    }
  });
});

describe("Latest and Gallery video contracts", () => {
  it("renders the Latest video with controls and inline non-autoplay playback", async () => {
    const latest = await read("src/components/Latest.tsx");

    assert.match(latest, /<video/);
    assert.match(latest, /poster=\{item\.media\.poster\}/);
    assert.match(latest, /controls/);
    assert.match(latest, /playsInline/);
    assert.match(latest, /preload="none"/);
    assert.doesNotMatch(latest, /autoPlay|autoplay|\bloop\b/);
    assert.match(latest, /aspect-\[9\/16\]/);
  });

  it("renders the new Gallery entry through the real local video contract", async () => {
    const gallery = await read("src/components/Gallery.tsx");
    const visible = visibleGalleryVideos();
    const view = driveVideoView(visible[0]);

    assert.equal(visible.length, 1);
    assert.equal(view.video.label, "8月17日 朝の「OHAYO!!」ストーリー");
    assert.equal(view.video.controls, true);
    assert.equal(view.video.playsInline, true);
    assert.equal(view.video.preload, "none");
    assert.equal("autoPlay" in view.video, false);
    assert.equal("loop" in view.video, false);
    assert.match(gallery, /visibleGalleryVideos\(\)\.map\(driveVideoView\)/);
    assert.match(gallery, /videos\.map\(\(video\) =>/);
    assert.match(gallery, /src=\{video\.video\.src\}/);
  });

  it("preserves the existing photo and Drive-video archives", () => {
    const drive = driveGallerySections(visibleDriveGallery());

    assert.equal(media.filter((item) => item.kind === "photo").length, 6);
    assert.equal(drive.photos.length, 45);
    assert.equal(drive.videos.length, 11);
    assert.equal(visibleGalleryVideos().length + drive.videos.length, 12);
  });
});

describe("STORIES boundary", () => {
  it("does not add the morning post to the article collection", async () => {
    const source = await read("src/data/stories.ts");

    assert.equal(stories.length, 1);
    assert.equal(stories.some((story) => story.date === "2026-08-17"), false);
    assert.equal(stories.some((story) => /morning|ohayo/i.test(story.slug)), false);
    assert.doesNotMatch(source, /2026-08-17-morning-story|mily-b03-01-morning-ohayo/);
  });
});
