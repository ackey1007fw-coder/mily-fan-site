import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DRIVE_PHOTO_SIZES,
  DRIVE_THUMBNAIL_WIDTHS,
  driveFileViewUrl,
  driveGallery,
  driveGalleryPublication,
  drivePreviewUrl,
  driveThumbnailSrcSet,
  driveThumbnailUrl,
  privacyHoldDriveGallery,
  unverifiedDriveGallery,
  visibleDriveGallery,
  DRIVE_VIDEO_SANDBOX,
  driveGallerySections,
  drivePhotoView,
  driveVideoView,
  isDriveGalleryPublished,
} from "../src/data/driveGallery.ts";
import * as driveGalleryModule from "../src/data/driveGallery.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** The received Drive folder is never addressed from this repository, so the
 *  tests assert on the shape of Drive URLs instead of on any folder id. */
const FOLDER_URL_PATTERN = /drive\.google\.com\/drive\/folders/;
const FOLDER_PATH_PATTERN = /\/drive\/folders\//;

const PHOTO_COUNT = 46;
const VIDEO_COUNT = 11;
const TOTAL_COUNT = PHOTO_COUNT + VIDEO_COUNT;

/** p01 shows a readable private chat transcript on the laptop screen, so it is
 *  registered but never rendered. Registered 57, publishable 56. */
const PRIVACY_HOLD_IDS = ["mily-drive-b02-p01"];
const PUBLISHABLE_PHOTO_COUNT = PHOTO_COUNT - PRIVACY_HOLD_IDS.length;
const PUBLISHABLE_COUNT = PUBLISHABLE_PHOTO_COUNT + VIDEO_COUNT;

/** Second Drive copy of 582B7A70…: identical SHA256, collapsed to one entry.
 *  Recorded in docs/DRIVE-GALLERY.md. */
const COLLAPSED_DUPLICATE_FILE_ID = "1rPoGch2NtW7CpXOEQq80aTUC0hU9AlxK";
const RADIO_ANNOUNCEMENT_FILE_ID = "1h6d2n47nJX1isjQFyzoFngNk1gzS3kOl";

const published = { state: "published" };
const photos = driveGallery.filter((item) => item.kind === "photo");
const videos = driveGallery.filter((item) => item.kind === "video");

async function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

describe("Drive gallery registry", () => {
  it("holds 46 photos and 11 unique videos", () => {
    assert.equal(photos.length, PHOTO_COUNT);
    assert.equal(videos.length, VIDEO_COUNT);
    assert.equal(driveGallery.length, TOTAL_COUNT);
  });

  it("has no duplicate id and no duplicate fileId", () => {
    assert.equal(new Set(driveGallery.map((item) => item.id)).size, TOTAL_COUNT);
    assert.equal(
      new Set(driveGallery.map((item) => item.fileId)).size,
      TOTAL_COUNT,
    );
  });

  it("keeps only one entry for the byte-identical duplicate video", () => {
    const fileIds = new Set(driveGallery.map((item) => item.fileId));
    assert.equal(fileIds.has("11cYNJfbBBrNFHxh3m_Ap0ZeUNgtoQvZd"), true);
    assert.equal(fileIds.has(COLLAPSED_DUPLICATE_FILE_ID), false);
  });

  it("registers the previously missing radio announcement video", () => {
    const entry = driveGallery.find(
      (item) => item.fileId === RADIO_ANNOUNCEMENT_FILE_ID,
    );
    assert.ok(entry, "radio announcement video must be registered");
    assert.equal(entry.kind, "video");
    assert.match(entry.alt, /湘南シーサイドサークル/);
    assert.match(entry.alt, /10:00/);
  });

  it("does not keep Drive file names in the client registry", () => {
    for (const item of driveGallery) {
      assert.equal("sourceName" in item, false, `${item.id} still has sourceName`);
      assert.equal("folderId" in item, false, `${item.id} still has folderId`);
      assert.equal("folderUrl" in item, false, `${item.id} still has folderUrl`);
      assert.equal(/\.(jpg|jpeg|png|mp4|mov|heic)/i.test(item.alt), false);
    }
  });

  it("gives every entry its own non-numbered alt text", () => {
    for (const item of driveGallery) {
      assert.equal(typeof item.alt, "string");
      assert.ok(item.alt.trim().length > 0, `${item.id} has empty alt`);
      assert.equal(
        /(写真|動画)\s*\d+$/.test(item.alt),
        false,
        `${item.id} still uses a numbered alt`,
      );
    }
    const verifiedAlts = driveGallery
      .filter((item) => item.contentVerified)
      .map((item) => item.alt);
    assert.equal(
      new Set(verifiedAlts).size,
      verifiedAlts.length,
      "verified alt texts must be individual",
    );
  });

  it("has no entry left waiting for an owner-confirmed description", () => {
    assert.deepEqual(unverifiedDriveGallery(), []);
    assert.deepEqual(unverifiedDriveGallery(driveGallery), []);
    for (const item of driveGallery) {
      assert.equal(item.contentVerified, true, `${item.id} is still unverified`);
      assert.equal(/確認待ち/.test(item.alt), false, `${item.id} keeps a placeholder alt`);
    }
  });

  it("does not transcribe screen contents or personal names into alt text", () => {
    const hold = driveGallery.find((item) => item.id === "mily-drive-b02-p01");
    assert.ok(hold);
    assert.equal(/ChatGPT|会話/.test(hold.alt), false);
    assert.match(hold.alt, /ノートパソコン/);
  });
});

describe("Drive gallery publication gate", () => {
  it("stays in review while the owner has not approved publication", () => {
    assert.equal(driveGalleryPublication.state, "review");
    assert.equal(isDriveGalleryPublished(driveGalleryPublication), false);
  });

  it("renders nothing while the batch is in review", () => {
    assert.deepEqual(visibleDriveGallery(driveGallery, { state: "review" }), []);
    assert.deepEqual(visibleDriveGallery(), []);
    assert.equal(
      driveGallerySections(visibleDriveGallery(driveGallery)).hasAny,
      false,
    );
  });

  it("renders every publishable entry once the batch is published", () => {
    const visible = visibleDriveGallery(driveGallery, published);
    assert.equal(visible.length, PUBLISHABLE_COUNT);
    const sections = driveGallerySections(visible);
    assert.equal(sections.photos.length, PUBLISHABLE_PHOTO_COUNT);
    assert.equal(sections.videos.length, VIDEO_COUNT);
    assert.equal(sections.hasAny, true);
  });
});

describe("Drive gallery privacy gate", () => {
  it("lists exactly the entries held back by privacy review", () => {
    const held = privacyHoldDriveGallery();
    assert.deepEqual(held.map((item) => item.id), PRIVACY_HOLD_IDS);
    for (const item of held) {
      assert.equal(item.privacyState, "hold");
      assert.equal(item.contentVerified, true, "a hold is still content-verified");
    }
  });

  it("keeps p01 out of the gallery even when the batch is published", () => {
    const visibleIds = visibleDriveGallery(driveGallery, published).map(
      (item) => item.id,
    );
    for (const id of PRIVACY_HOLD_IDS) {
      assert.equal(visibleIds.includes(id), false, `${id} must never render`);
    }
    assert.equal(visibleIds.includes("mily-drive-b02-p01"), false);
  });

  it("renders an approved entry and hides a held one from the same list", () => {
    const approved = driveGallery.find(
      (item) => item.id === "mily-drive-b02-p02",
    );
    const held = driveGallery.find((item) => item.id === "mily-drive-b02-p01");
    assert.deepEqual(
      visibleDriveGallery([approved, held], published).map((item) => item.id),
      [approved.id],
    );
  });

  it("hides an entry that is verified and approved but not published", () => {
    const approved = driveGallery.find(
      (item) => item.id === "mily-drive-b02-p02",
    );
    assert.deepEqual(visibleDriveGallery([approved], { state: "review" }), []);
  });

  it("hides an unverified entry even when published and approved", () => {
    const pending = {
      id: "pending-fixture",
      kind: "photo",
      fileId: "0123456789abc",
      alt: "内容未確認のフィクスチャ",
      contentVerified: false,
      privacyState: "approved",
    };
    assert.deepEqual(visibleDriveGallery([pending], published), []);
  });

  it("publishes 56 of the 57 registered entries", () => {
    const visible = visibleDriveGallery(driveGallery, published);
    assert.equal(driveGallery.length, TOTAL_COUNT);
    assert.equal(visible.length, PUBLISHABLE_COUNT);
    assert.equal(TOTAL_COUNT - visible.length, PRIVACY_HOLD_IDS.length);
  });
});

describe("Drive URL helpers", () => {
  it("builds individual-file URLs for every registered entry", () => {
    for (const item of driveGallery) {
      assert.match(
        item.fileId,
        /^[A-Za-z0-9_-]{10,}$/,
        `${item.id} has an unsafe file id`,
      );

      const view = driveFileViewUrl(item.fileId);
      const preview = drivePreviewUrl(item.fileId);
      const thumb = driveThumbnailUrl(item.fileId, 640);

      assert.equal(
        view,
        `https://drive.google.com/file/d/${item.fileId}/view`,
      );
      assert.equal(
        preview,
        `https://drive.google.com/file/d/${item.fileId}/preview`,
      );
      assert.equal(
        thumb,
        `https://drive.google.com/thumbnail?id=${item.fileId}&sz=w640`,
      );

      for (const url of [view, preview, thumb]) {
        assert.equal(FOLDER_PATH_PATTERN.test(url), false);
        assert.equal(/autoplay/i.test(url), false);
      }
    }
  });

  it("exposes no helper that can build a folder URL", () => {
    for (const [name, value] of Object.entries(driveGalleryModule)) {
      assert.equal(
        /folder/i.test(name),
        false,
        `${name} must not exist in the Drive gallery module`,
      );
      if (typeof value === "function" && value.length >= 1) {
        continue;
      }
      if (typeof value === "string") {
        assert.equal(FOLDER_PATH_PATTERN.test(value), false);
      }
    }
  });

  it("clamps thumbnail widths and builds an ascending srcSet", () => {
    assert.match(driveThumbnailUrl("abcdefghij", 10), /sz=w160$/);
    assert.match(driveThumbnailUrl("abcdefghij", 99999), /sz=w1600$/);

    const srcSet = driveThumbnailSrcSet("abcdefghij");
    const descriptors = srcSet.split(", ").map((entry) => entry.split(" "));
    assert.deepEqual(
      descriptors.map(([, descriptor]) => descriptor),
      DRIVE_THUMBNAIL_WIDTHS.map((width) => `${width}w`),
    );
    for (const [url] of descriptors) {
      assert.match(url, /^https:\/\/drive\.google\.com\/thumbnail\?id=abcdefghij&sz=w\d+$/);
    }
    assert.equal(srcSet.includes("sz=w1200"), false, "no fixed 1200px request");
  });
});

describe("Drive gallery render model", () => {
  const sections = driveGallerySections(
    visibleDriveGallery(driveGallery, published),
  );

  it("serves responsive photo thumbnails instead of one large width", () => {
    for (const photo of sections.photos) {
      assert.equal(photo.img.sizes, DRIVE_PHOTO_SIZES);
      assert.equal(photo.img.loading, "lazy");
      assert.equal(photo.img.decoding, "async");
      assert.equal(photo.img.referrerPolicy, "no-referrer");
      assert.ok(photo.img.alt.length > 0);
      assert.equal(photo.img.srcSet.split(", ").length, DRIVE_THUMBNAIL_WIDTHS.length);
      assert.match(photo.img.src, /sz=w640$/);
      assert.equal(photo.img.srcSet.includes("sz=w1200"), false);
      assert.match(photo.linkHref, /^https:\/\/drive\.google\.com\/file\/d\/[^/]+\/view$/);
    }
    assert.equal(DRIVE_PHOTO_SIZES.includes("45vw"), true);
    assert.equal(DRIVE_PHOTO_SIZES.includes("90vw"), true);
  });

  it("sandboxes the video player and never asks for autoplay", () => {
    assert.equal(DRIVE_VIDEO_SANDBOX, "allow-scripts allow-same-origin allow-presentation");
    for (const video of sections.videos) {
      assert.equal(video.frame.sandbox, DRIVE_VIDEO_SANDBOX);
      assert.equal(video.frame.sandbox.includes("allow-popups"), false);
      assert.equal(video.frame.sandbox.includes("allow-downloads"), false);
      assert.equal(video.frame.loading, "lazy");
      assert.equal(video.frame.referrerPolicy, "no-referrer");
      assert.ok(video.frame.title.length > 0, "iframe needs a title");
      assert.equal(/autoplay/i.test(video.frame.src), false);
      assert.match(video.frame.src, /^https:\/\/drive\.google\.com\/file\/d\/[^/]+\/preview$/);
    }
  });

  it("gives every video a Drive fallback link", () => {
    for (const video of sections.videos) {
      assert.equal(video.fallback.label, "Google Driveで動画を開く");
      assert.match(
        video.fallback.href,
        /^https:\/\/drive\.google\.com\/file\/d\/[^/]+\/view$/,
      );
      assert.equal(FOLDER_PATH_PATTERN.test(video.fallback.href), false);
    }
  });

  it("keeps ids and URLs unique across the rendered sections", () => {
    const keys = [...sections.photos, ...sections.videos].map((view) => view.key);
    assert.equal(new Set(keys).size, PUBLISHABLE_COUNT);
    const srcs = [
      ...sections.photos.map((photo) => photo.img.src),
      ...sections.videos.map((video) => video.frame.src),
    ];
    assert.equal(new Set(srcs).size, PUBLISHABLE_COUNT);
  });

  it("keeps distinct entries for the first, middle and last registrations", () => {
    const sampled = [
      driveGallery[0],
      driveGallery[Math.floor(driveGallery.length / 2)],
      driveGallery[driveGallery.length - 1],
    ];
    const previews = sampled.map((item) => drivePreviewUrl(item.fileId));
    assert.equal(new Set(previews).size, sampled.length);
    for (const item of sampled) {
      const view = item.kind === "photo" ? drivePhotoView(item) : driveVideoView(item);
      assert.equal(view.key, item.id);
    }
  });
});

describe("Gallery UI contract", () => {
  it("never links to a Drive folder", async () => {
    for (const relative of [
      "src/components/Gallery.tsx",
      "src/data/driveGallery.ts",
      "scripts/drive-gallery.test.mjs",
      "docs/DRIVE-GALLERY.md",
      "README.md",
    ]) {
      const source = await read(relative);
      assert.equal(
        FOLDER_URL_PATTERN.test(source),
        false,
        `${relative} must not build a Drive folder URL`,
      );
    }
  });

  it("keeps the safety attributes on the rendered markup", async () => {
    const gallery = await read("src/components/Gallery.tsx");
    assert.match(gallery, /loading=\{photo\.img\.loading\}/);
    assert.match(gallery, /decoding=\{photo\.img\.decoding\}/);
    assert.match(gallery, /referrerPolicy=\{photo\.img\.referrerPolicy\}/);
    assert.match(gallery, /srcSet=\{photo\.img\.srcSet\}/);
    assert.match(gallery, /sizes=\{photo\.img\.sizes\}/);
    assert.match(gallery, /sandbox=\{video\.frame\.sandbox\}/);
    assert.match(gallery, /title=\{video\.frame\.title\}/);
    assert.match(gallery, /rel="noopener noreferrer"/);
    assert.match(gallery, /focus-visible:ring-2/);
    assert.match(gallery, /ExternalLink/);
    assert.equal(/autoplay/i.test(gallery), false);
    assert.equal(gallery.includes("sz=w1200"), false);
  });

  it("drops to a single photo column on 320px screens", async () => {
    const gallery = await read("src/components/Gallery.tsx");
    assert.match(gallery, /grid-cols-1 gap-3 min-\[360px\]:grid-cols-2 sm:grid-cols-3/);
  });
});
