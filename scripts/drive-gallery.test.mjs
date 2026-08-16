import assert from "node:assert/strict";
import { readFile, readdir, mkdtemp, writeFile, rm } from "node:fs/promises";
import { describe, it } from "node:test";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DRIVE_PHOTO_SIZES,
  driveGalleryManifest,
  driveGallerySections,
  drivePhotoView,
  driveVideoView,
  isDriveGalleryPublished,
  visibleDriveGallery,
} from "../src/data/driveGallery.ts";
import * as clientModule from "../src/data/driveGallery.ts";
import {
  driveGalleryPublication,
  driveGallerySource,
  outputSlug,
  privacyHoldSource,
  publishableSource,
  unverifiedSource,
} from "./drive-gallery-source.mjs";
import {
  DriveFetchError,
  downloadDriveFile,
  parseConfirmToken,
} from "./drive-gallery-fetch.mjs";
import {
  PHOTO_WIDTHS,
  PUBLIC_PREFIX,
  classifyOutputs,
  derivativesFor,
  leftoverTags,
  photoManifestEntry,
  videoManifestEntry,
} from "./build-drive-gallery.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Nothing in this repository may address the receiving folder. */
const FOLDER_URL_PATTERN = /drive\.google\.com\/drive\/folders/;
/** The browser must never be pointed at Google for media. */
const DRIVE_HOST_PATTERN = /drive\.(google|usercontent\.google)\.com/;

const PHOTO_COUNT = 46;
const VIDEO_COUNT = 11;
const TOTAL_COUNT = PHOTO_COUNT + VIDEO_COUNT;

/** p01 shows a readable private chat transcript on the laptop screen, so it is
 *  registered but never downloaded and never rendered. 57 registered, 56 publishable. */
const PRIVACY_HOLD_IDS = ["mily-drive-b02-p01"];
const PUBLISHABLE_PHOTO_COUNT = PHOTO_COUNT - PRIVACY_HOLD_IDS.length;
const PUBLISHABLE_COUNT = PUBLISHABLE_PHOTO_COUNT + VIDEO_COUNT;

/** Second Drive copy of 582B7A70…: identical SHA256, collapsed to one entry.
 *  Recorded in docs/DRIVE-GALLERY.md. */
const COLLAPSED_DUPLICATE_FILE_ID = "1rPoGch2NtW7CpXOEQq80aTUC0hU9AlxK";
const RADIO_ANNOUNCEMENT_FILE_ID = "1h6d2n47nJX1isjQFyzoFngNk1gzS3kOl";

const sourcePhotos = driveGallerySource.filter((item) => item.kind === "photo");
const sourceVideos = driveGallerySource.filter((item) => item.kind === "video");

async function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

/** A published manifest built from the registry, without touching the network. */
function publishedFixture() {
  return {
    publicationState: "published",
    items: publishableSource(driveGallerySource).map((entry) =>
      entry.kind === "photo"
        ? photoManifestEntry(entry, 1600, 2000)
        : videoManifestEntry(entry, 720, 1280),
    ),
  };
}

describe("Drive gallery source registry (build-only)", () => {
  it("holds 46 photos and 11 unique videos", () => {
    assert.equal(sourcePhotos.length, PHOTO_COUNT);
    assert.equal(sourceVideos.length, VIDEO_COUNT);
    assert.equal(driveGallerySource.length, TOTAL_COUNT);
  });

  it("has no duplicate id and no duplicate fileId", () => {
    assert.equal(new Set(driveGallerySource.map((i) => i.id)).size, TOTAL_COUNT);
    assert.equal(new Set(driveGallerySource.map((i) => i.fileId)).size, TOTAL_COUNT);
  });

  it("keeps only one entry for the byte-identical duplicate video", () => {
    const fileIds = new Set(driveGallerySource.map((i) => i.fileId));
    assert.equal(fileIds.has("11cYNJfbBBrNFHxh3m_Ap0ZeUNgtoQvZd"), true);
    assert.equal(fileIds.has(COLLAPSED_DUPLICATE_FILE_ID), false);
  });

  it("registers the previously missing radio announcement video", () => {
    const entry = driveGallerySource.find((i) => i.fileId === RADIO_ANNOUNCEMENT_FILE_ID);
    assert.ok(entry, "radio announcement video must be registered");
    assert.equal(entry.kind, "video");
    assert.match(entry.alt, /湘南シーサイドサークル/);
    assert.match(entry.alt, /10:00/);
  });

  it("carries no file names, folder ids or folder URLs", () => {
    for (const item of driveGallerySource) {
      assert.equal("sourceName" in item, false, `${item.id} still has sourceName`);
      assert.equal("folderId" in item, false, `${item.id} still has folderId`);
      assert.equal("folderUrl" in item, false, `${item.id} still has folderUrl`);
      assert.match(item.fileId, /^[A-Za-z0-9_-]{10,}$/);
      assert.equal(/\.(jpg|jpeg|png|mp4|mov|heic)/i.test(item.alt), false);
    }
  });

  it("gives every entry its own non-numbered alt text", () => {
    const alts = driveGallerySource.map((item) => item.alt);
    for (const item of driveGallerySource) {
      assert.ok(item.alt.trim().length > 0, `${item.id} has empty alt`);
      assert.equal(/(写真|動画)\s*\d+$/.test(item.alt), false, `${item.id} numbered alt`);
    }
    assert.equal(new Set(alts).size, alts.length, "alt texts must be individual");
  });

  it("has no entry left waiting for an owner-confirmed description", () => {
    assert.deepEqual(unverifiedSource(), []);
    for (const item of driveGallerySource) {
      assert.equal(item.contentVerified, true, `${item.id} is unverified`);
      assert.equal(/確認待ち/.test(item.alt), false, `${item.id} placeholder alt`);
    }
  });

  it("holds p01 back from download and publication", () => {
    const held = privacyHoldSource();
    assert.deepEqual(held.map((i) => i.id), PRIVACY_HOLD_IDS);
    const publishable = publishableSource();
    assert.equal(publishable.length, PUBLISHABLE_COUNT);
    for (const id of PRIVACY_HOLD_IDS) {
      assert.equal(publishable.some((i) => i.id === id), false, `${id} must not publish`);
    }
    const hold = driveGallerySource.find((i) => i.id === "mily-drive-b02-p01");
    assert.equal(/ChatGPT|会話/.test(hold.alt), false);
  });

  it("is never imported from the client bundle", async () => {
    // Match real module specifiers only: doc comments may name these scripts.
    const buildOnly = /(?:from|import|require)\s*\(?\s*["'][^"']*(?:drive-gallery-source|drive-gallery-fetch|build-drive-gallery)[^"']*["']/;
    const files = await readdir(path.join(root, "src"), { recursive: true });
    let scanned = 0;
    for (const file of files) {
      if (!/\.(ts|tsx)$/.test(file)) continue;
      scanned += 1;
      const source = await read(path.join("src", file));
      assert.equal(
        buildOnly.test(source),
        false,
        `src/${file} must not import the build-only registry`,
      );
    }
    assert.ok(scanned > 10, "expected to scan the client source tree");
  });
});

describe("Drive gallery publication gate", () => {
  it("stays in review in both the source registry and the generated manifest", () => {
    assert.equal(driveGalleryPublication.state, "review");
    assert.equal(driveGalleryManifest.publicationState, "review");
    assert.equal(isDriveGalleryPublished(), false);
  });

  it("ships an empty manifest while unpublished", () => {
    assert.deepEqual(driveGalleryManifest.items, []);
    assert.deepEqual(visibleDriveGallery(), []);
    assert.equal(driveGallerySections(visibleDriveGallery()).hasAny, false);
  });

  it("ships no derivative files while unpublished", async () => {
    const entries = await readdir(path.join(root, "public/media/drive-gallery"));
    assert.deepEqual(entries.filter((n) => !n.startsWith(".")), []);
  });

  it("renders 45 photos and 11 videos from a published fixture", () => {
    const visible = visibleDriveGallery(publishedFixture());
    assert.equal(visible.length, PUBLISHABLE_COUNT);
    const sections = driveGallerySections(visible);
    assert.equal(sections.photos.length, PUBLISHABLE_PHOTO_COUNT);
    assert.equal(sections.videos.length, VIDEO_COUNT);
    assert.equal(sections.hasAny, true);
  });

  it("keeps p01 out of a published fixture", () => {
    const ids = visibleDriveGallery(publishedFixture()).map((i) => i.id);
    for (const id of PRIVACY_HOLD_IDS) {
      assert.equal(ids.includes(id), false, `${id} must never render`);
    }
  });

  it("renders nothing when a manifest carries items but is not published", () => {
    const stuck = { ...publishedFixture(), publicationState: "review" };
    assert.deepEqual(visibleDriveGallery(stuck), []);
  });
});

describe("Drive gallery client payload", () => {
  it("keeps Drive file ids out of the generated manifest", async () => {
    const raw = await read("src/data/driveGalleryManifest.json");
    for (const entry of driveGallerySource) {
      assert.equal(raw.includes(entry.fileId), false, `${entry.id} fileId leaked`);
    }
    for (const item of publishedFixture().items) {
      assert.equal("fileId" in item, false, `${item.id} carries a fileId`);
      assert.equal("sourceName" in item, false, `${item.id} carries a sourceName`);
    }
  });

  it("keeps Drive hosts out of every client-facing module", async () => {
    for (const relative of [
      "src/components/Gallery.tsx",
      "src/data/driveGallery.ts",
      "src/data/driveGalleryManifest.json",
    ]) {
      const source = await read(relative);
      assert.equal(
        DRIVE_HOST_PATTERN.test(source),
        false,
        `${relative} must not reference a Drive host`,
      );
    }
  });

  it("never builds a Drive folder URL anywhere in the repository", async () => {
    for (const relative of [
      "src/components/Gallery.tsx",
      "src/data/driveGallery.ts",
      "scripts/drive-gallery-source.mjs",
      "scripts/drive-gallery-fetch.mjs",
      "scripts/build-drive-gallery.mjs",
      "scripts/probe-drive-gallery.mjs",
      "scripts/drive-gallery.test.mjs",
      "docs/DRIVE-GALLERY.md",
      "README.md",
    ]) {
      const source = await read(relative);
      assert.equal(FOLDER_URL_PATTERN.test(source), false, `${relative} builds a folder URL`);
    }
  });

  it("exposes no Drive URL helper to the client", () => {
    for (const name of Object.keys(clientModule)) {
      assert.equal(/thumbnail|preview|fileview|folder/i.test(name), false, `${name} leaked`);
    }
  });
});

describe("Drive gallery render model", () => {
  const sections = driveGallerySections(visibleDriveGallery(publishedFixture()));

  it("serves local responsive photo derivatives", () => {
    for (const photo of sections.photos) {
      assert.equal(photo.img.sizes, DRIVE_PHOTO_SIZES);
      assert.equal(photo.img.loading, "lazy");
      assert.equal(photo.img.decoding, "async");
      assert.ok(photo.img.alt.length > 0);
      assert.match(photo.img.src, new RegExp(`^${PUBLIC_PREFIX}/`));
      assert.equal(DRIVE_HOST_PATTERN.test(photo.img.srcSet), false);
      assert.equal(photo.img.srcSet.split(", ").length, PHOTO_WIDTHS.length);
      assert.equal(photo.img.webpSrcSet.split(", ").length, PHOTO_WIDTHS.length);
      for (const width of PHOTO_WIDTHS) {
        assert.ok(photo.img.srcSet.includes(`-${width}.jpg ${width}w`));
        assert.ok(photo.img.webpSrcSet.includes(`-${width}.webp ${width}w`));
      }
    }
    assert.equal(DRIVE_PHOTO_SIZES.includes("45vw"), true);
    assert.equal(DRIVE_PHOTO_SIZES.includes("90vw"), true);
  });

  it("serves local MP4 with a local poster and never autoplays", () => {
    for (const video of sections.videos) {
      assert.match(video.video.src, new RegExp(`^${PUBLIC_PREFIX}/.+\\.mp4$`));
      assert.match(video.video.poster, new RegExp(`^${PUBLIC_PREFIX}/.+-poster\\.jpg$`));
      assert.equal(DRIVE_HOST_PATTERN.test(video.video.src), false);
      assert.equal(DRIVE_HOST_PATTERN.test(video.video.poster), false);
      assert.equal(video.video.preload, "none");
      assert.equal(video.video.controls, true);
      assert.equal(video.video.playsInline, true);
      assert.equal("autoPlay" in video.video, false);
      assert.ok(video.video.label.length > 0, "video needs a screen-reader label");
    }
  });

  it("keeps ids and asset paths unique across the rendered sections", () => {
    const keys = [...sections.photos, ...sections.videos].map((v) => v.key);
    assert.equal(new Set(keys).size, PUBLISHABLE_COUNT);
    const srcs = [
      ...sections.photos.map((p) => p.img.src),
      ...sections.videos.map((v) => v.video.src),
    ];
    assert.equal(new Set(srcs).size, PUBLISHABLE_COUNT);
  });

  it("keeps distinct assets for the first, middle and last publishable entries", () => {
    const publishable = publishableSource(driveGallerySource);
    const sampled = [
      publishable[0],
      publishable[Math.floor(publishable.length / 2)],
      publishable[publishable.length - 1],
    ];
    const paths = sampled.map((entry) =>
      entry.kind === "photo"
        ? drivePhotoView(photoManifestEntry(entry, 1600, 2000)).img.src
        : driveVideoView(videoManifestEntry(entry, 720, 1280)).video.src,
    );
    assert.equal(new Set(paths).size, sampled.length);
    for (const p of paths) assert.match(p, new RegExp(`^${PUBLIC_PREFIX}/mily-b02-`));
  });
});

describe("Drive gallery ingest", () => {
  it("names one complete derivative set per entry", () => {
    const photo = driveGallerySource.find((i) => i.kind === "photo");
    const video = driveGallerySource.find((i) => i.kind === "video");
    assert.equal(derivativesFor(photo).length, PHOTO_WIDTHS.length * 2);
    assert.deepEqual(derivativesFor(video), [
      `${outputSlug(video.id)}.mp4`,
      `${outputSlug(video.id)}-poster.jpg`,
    ]);
    assert.equal(outputSlug("mily-drive-b02-p02"), "mily-b02-p02");
  });

  it("treats a half-written output set as a failure, not as done", () => {
    const video = driveGallerySource.find((i) => i.kind === "video");
    const all = new Set(derivativesFor(video));
    assert.equal(classifyOutputs(video, new Set()), "build");
    assert.equal(classifyOutputs(video, all), "skip");
    assert.equal(classifyOutputs(video, new Set([`${outputSlug(video.id)}.mp4`])), "partial");
  });

  it("flags carried-over container metadata but allows ffmpeg's own brand tags", () => {
    assert.deepEqual(leftoverTags({ major_brand: "isom", encoder: "Lavf" }), []);
    assert.deepEqual(leftoverTags({ location: "+35.6+139.7" }), ["location"]);
    assert.deepEqual(leftoverTags(undefined), []);
  });

  it("makes no network request while the batch is unpublished", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "drive-gate-"));
    const manifestPath = path.join(dir, "manifest.json");
    let calls = 0;
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (...args) => {
      calls += 1;
      return originalFetch(...args);
    };
    try {
      const { execFile } = await import("node:child_process");
      const { promisify } = await import("node:util");
      await promisify(execFile)(process.execPath, ["scripts/build-drive-gallery.mjs"], {
        cwd: root,
        env: {
          ...process.env,
          DRIVE_GALLERY_OUTPUT_DIR: path.join(dir, "out"),
          DRIVE_GALLERY_MANIFEST: manifestPath,
        },
      });
      const written = JSON.parse(await readFile(manifestPath, "utf8"));
      assert.equal(written.publicationState, "review");
      assert.deepEqual(written.items, []);
      assert.equal(calls, 0, "review must not touch the network");
    } finally {
      globalThis.fetch = originalFetch;
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe("Drive download safety", () => {
  function response(body, { status = 200, contentType = "image/jpeg" } = {}) {
    return {
      ok: status >= 200 && status < 300,
      status,
      statusText: `status ${status}`,
      headers: { get: () => contentType },
      arrayBuffer: async () => body,
    };
  }

  const jpeg = new Uint8Array(8192).fill(7).buffer;

  it("rejects an unsafe file id before making a request", async () => {
    await assert.rejects(
      () => downloadDriveFile("../etc", "photo", { fetchImpl: async () => response(jpeg) }),
      DriveFetchError,
    );
  });

  it("fails closed on an HTTP error", async () => {
    await assert.rejects(
      () =>
        downloadDriveFile("abcdefghij", "photo", {
          fetchImpl: async () => response(jpeg, { status: 404 }),
        }),
      /HTTP 404/,
    );
  });

  it("fails closed when the MIME type does not match the kind", async () => {
    await assert.rejects(
      () =>
        downloadDriveFile("abcdefghij", "video", {
          fetchImpl: async () => response(jpeg, { contentType: "image/jpeg" }),
        }),
      /expected video\/\*/,
    );
  });

  it("fails closed on a truncated payload", async () => {
    await assert.rejects(
      () =>
        downloadDriveFile("abcdefghij", "photo", {
          fetchImpl: async () => response(new Uint8Array(16).buffer),
        }),
      /only 16 bytes/,
    );
  });

  it("retries the virus-scan interstitial with its confirm token", async () => {
    const html = new TextEncoder().encode(
      '<!DOCTYPE html><form><input type="hidden" name="confirm" value="t123"></form>',
    ).buffer;
    const seen = [];
    const bytes = await downloadDriveFile("abcdefghij", "video", {
      fetchImpl: async (url) => {
        seen.push(url);
        return seen.length === 1
          ? response(html, { contentType: "text/html; charset=utf-8" })
          : response(jpeg, { contentType: "video/mp4" });
      },
    });
    assert.equal(bytes.usedConfirm, true);
    assert.equal(seen.length, 2);
    assert.match(seen[1], /confirm=t123/);
    assert.equal(seen.every((u) => !FOLDER_URL_PATTERN.test(u)), true);
  });

  it("fails closed when the interstitial carries no token", async () => {
    const html = new TextEncoder().encode("<html>quota exceeded</html>").buffer;
    await assert.rejects(
      () =>
        downloadDriveFile("abcdefghij", "photo", {
          fetchImpl: async () => response(html, { contentType: "text/html" }),
        }),
      /no confirm token/,
    );
  });

  it("parses both interstitial token shapes", () => {
    assert.equal(parseConfirmToken('name="confirm" value="abc"'), "abc");
    assert.equal(parseConfirmToken("href='/download?id=x&confirm=zzz'"), "zzz");
    assert.equal(parseConfirmToken("<html>nothing</html>"), null);
  });
});

describe("Gallery UI contract", () => {
  it("renders local assets and no Drive iframe", async () => {
    const gallery = await read("src/components/Gallery.tsx");
    assert.equal(/iframe/i.test(gallery), false, "no Drive iframe may remain");
    assert.equal(/sandbox/i.test(gallery), false);
    assert.equal(/autoplay/i.test(gallery), false);
    assert.equal(DRIVE_HOST_PATTERN.test(gallery), false);
    assert.match(gallery, /<video/);
    assert.match(gallery, /poster=\{video\.video\.poster\}/);
    assert.match(gallery, /preload=\{video\.video\.preload\}/);
    assert.match(gallery, /playsInline=\{video\.video\.playsInline\}/);
    assert.match(gallery, /srcSet=\{photo\.img\.srcSet\}/);
    assert.match(gallery, /sizes=\{photo\.img\.sizes\}/);
    assert.match(gallery, /loading=\{photo\.img\.loading\}/);
    assert.match(gallery, /decoding=\{photo\.img\.decoding\}/);
    assert.match(gallery, /focus-visible:ring-2/);
    assert.match(gallery, /rel="noopener noreferrer"/);
  });

  it("drops to a single photo column on 320px screens", async () => {
    const gallery = await read("src/components/Gallery.tsx");
    assert.match(gallery, /grid-cols-1 gap-3 min-\[360px\]:grid-cols-2 sm:grid-cols-3/);
  });
});
