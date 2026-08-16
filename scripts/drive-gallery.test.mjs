import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  driveFileViewUrl,
  driveGallery,
  drivePreviewUrl,
  driveThumbnailUrl,
  visibleDriveGallery,
} from "../src/data/driveGallery.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RECEIVED_FOLDER_ID = "1pM0FoE8xPj7gw8qVYV-Q55vmmlyzaYfN";

async function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

describe("Drive gallery batch b02", () => {
  it("registers all received unique media entries", () => {
    const photos = driveGallery.filter((item) => item.kind === "photo");
    const videos = driveGallery.filter((item) => item.kind === "video");
    assert.equal(photos.length, 46);
    assert.equal(videos.length, 10, "Drive上の完全重複動画1件は1件に畳む");
    assert.equal(driveGallery.length, 56);
    assert.equal(new Set(driveGallery.map((item) => item.id)).size, 56);
    assert.equal(new Set(driveGallery.map((item) => item.fileId)).size, 56);
  });

  it("surfaces only published items", () => {
    assert.equal(visibleDriveGallery().length, 56);
    const hidden = { ...driveGallery[0], id: "hidden-copy", published: false };
    assert.equal(visibleDriveGallery([hidden]).length, 0);
  });

  it("builds individual-file URLs without exposing the received folder URL", () => {
    const first = driveGallery[0];
    const thumb = driveThumbnailUrl(first.fileId, 1200);
    const preview = drivePreviewUrl(first.fileId);
    const view = driveFileViewUrl(first.fileId);
    assert.match(thumb, /^https:\/\/drive\.google\.com\/thumbnail\?/);
    assert.match(preview, /^https:\/\/drive\.google\.com\/file\/d\/.+\/preview$/);
    assert.match(view, /^https:\/\/drive\.google\.com\/file\/d\/.+\/view$/);
    assert.equal(thumb.includes(RECEIVED_FOLDER_ID), false);
    assert.equal(preview.includes(RECEIVED_FOLDER_ID), false);
    assert.equal(view.includes(RECEIVED_FOLDER_ID), false);
  });

  it("keeps the folder id out of the public Gallery component", async () => {
    const gallery = await read("src/components/Gallery.tsx");
    assert.equal(gallery.includes(RECEIVED_FOLDER_ID), false);
    assert.match(gallery, /loading="lazy"/);
    assert.match(gallery, /drivePreviewUrl/);
    assert.match(gallery, /allowFullScreen/);
    assert.match(gallery, /rel="noopener noreferrer"/);
    assert.match(gallery, /referrerPolicy="no-referrer"/);
  });
});
