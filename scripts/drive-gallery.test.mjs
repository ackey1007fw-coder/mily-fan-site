import assert from "node:assert/strict";
import { readFile, readdir, mkdtemp, writeFile, rm, stat } from "node:fs/promises";
import { describe, it, before, after } from "node:test";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
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
  PHOTO_WIDTHS,
  PUBLIC_PREFIX,
  SOURCE_MAP_NAME,
  classifyOutputs,
  derivativesFor,
  isFaststart,
  leftoverTags,
  photoDerivatives,
  photoManifestEntry,
  resolveInputName,
  sanitizePhoto,
  sanitizeVideo,
  videoManifestEntry,
} from "./build-drive-gallery.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** No Drive identifier or URL may appear anywhere in the public repository. */
const DRIVE_HOST_PATTERN = /drive\.(google|usercontent\.google)\.com/;
const FOLDER_URL_PATTERN = /drive\.google\.com\/drive\/folders/;
/** Drive ids are long, opaque and mixed-case with digits. Slugs, SCREAMING_CASE
 *  constants, header names and hex digests are none of those, so they do not
 *  trip this check. */
const ID_CANDIDATE = /[A-Za-z0-9_-]{25,}/g;
function looksLikeDriveId(token) {
  return (
    /[A-Z]/.test(token) && /[a-z]/.test(token) && /[0-9]/.test(token)
  );
}
function findDriveIds(text) {
  return (text.match(ID_CANDIDATE) ?? []).filter(looksLikeDriveId);
}

const PHOTO_COUNT = 46;
const VIDEO_COUNT = 11;
const TOTAL_COUNT = PHOTO_COUNT + VIDEO_COUNT;

/** p01 shows a readable private chat transcript on the laptop screen, so it is
 *  registered but never sanitized and never rendered. 57 registered, 56 publishable. */
const PRIVACY_HOLD_IDS = ["mily-drive-b02-p01"];
const PUBLISHABLE_PHOTO_COUNT = PHOTO_COUNT - PRIVACY_HOLD_IDS.length;
const PUBLISHABLE_COUNT = PUBLISHABLE_PHOTO_COUNT + VIDEO_COUNT;

/** Byte-identical duplicate collapsed to one entry; evidence lives in docs. */
const DUPLICATE_SHA256 =
  "2ddb087117106bba9f24535fa32bf07e03daf60a3153c74982c68d75a1dadd39";

const sourcePhotos = driveGallerySource.filter((item) => item.kind === "photo");
const sourceVideos = driveGallerySource.filter((item) => item.kind === "video");

async function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

/** A published manifest built from the registry, without any original. */
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

describe("Drive gallery entry registry (build-only)", () => {
  it("holds 46 photos and 11 unique videos", () => {
    assert.equal(sourcePhotos.length, PHOTO_COUNT);
    assert.equal(sourceVideos.length, VIDEO_COUNT);
    assert.equal(driveGallerySource.length, TOTAL_COUNT);
    assert.equal(new Set(driveGallerySource.map((i) => i.id)).size, TOTAL_COUNT);
  });

  it("carries no Drive identifier, no folder id and no original file name", async () => {
    for (const item of driveGallerySource) {
      for (const key of ["fileId", "folderId", "folderUrl", "sourceName", "driveId"]) {
        assert.equal(key in item, false, `${item.id} still has ${key}`);
      }
      assert.deepEqual(
        Object.keys(item).sort(),
        ["alt", "contentVerified", "id", "kind", "privacyState"],
        `${item.id} has unexpected fields`,
      );
      assert.equal(/\.(jpg|jpeg|png|mp4|mov|heic)/i.test(item.alt), false);
    }
    const registry = await read("scripts/drive-gallery-source.mjs");
    assert.equal(DRIVE_HOST_PATTERN.test(registry), false);
    assert.deepEqual(findDriveIds(registry), [], "registry still contains a Drive id");
  });

  it("keeps the duplicate-video evidence in docs rather than in code", async () => {
    const docs = await read("docs/DRIVE-GALLERY.md");
    assert.ok(docs.includes(DUPLICATE_SHA256), "SHA256 evidence must stay documented");
    assert.equal(sourceVideos.length, VIDEO_COUNT, "duplicate collapsed to one entry");
  });

  it("keeps the radio announcement video registered", () => {
    const entry = driveGallerySource.find((i) => /湘南シーサイドサークル/.test(i.alt));
    assert.ok(entry, "radio announcement video must be registered");
    assert.equal(entry.kind, "video");
    assert.match(entry.alt, /10:00/);
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

  it("holds p01 back from sanitize and publication", () => {
    assert.deepEqual(privacyHoldSource().map((i) => i.id), PRIVACY_HOLD_IDS);
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
    const buildOnly = /(?:from|import|require)\s*\(?\s*["'][^"']*(?:drive-gallery-source|build-drive-gallery)[^"']*["']/;
    const files = await readdir(path.join(root, "src"), { recursive: true });
    let scanned = 0;
    for (const file of files) {
      if (!/\.(ts|tsx)$/.test(file)) continue;
      scanned += 1;
      const source = await read(path.join("src", file));
      assert.equal(buildOnly.test(source), false, `src/${file} imports build-only code`);
    }
    assert.ok(scanned > 10, "expected to scan the client source tree");
  });
});

describe("Public repository carries no Drive identifier", () => {
  it("has no Drive host, folder URL or id-shaped token in tracked sources", async () => {
    const { stdout } = await run("git", ["ls-files"], { cwd: root, maxBuffer: 1024 * 1024 * 8 });
    const tracked = stdout.split("\n").filter(Boolean);
    const scannable = tracked.filter((f) =>
      /\.(ts|tsx|js|mjs|cjs|json|md|yml|yaml|html|css|txt)$/.test(f),
    );
    assert.ok(scannable.length > 40, "expected to scan the tracked source tree");

    for (const file of scannable) {
      const source = await read(file);
      assert.equal(DRIVE_HOST_PATTERN.test(source), false, `${file} references a Drive host`);
      assert.equal(FOLDER_URL_PATTERN.test(source), false, `${file} builds a folder URL`);
      // pnpm-lock.yaml is full of base64 integrity digests, not Drive ids.
      if (file === "pnpm-lock.yaml") continue;
      assert.deepEqual(findDriveIds(source), [], `${file} contains a Drive-id-shaped token`);
    }
  });

  it("distinguishes Drive ids from ordinary long identifiers", () => {
    // Built at runtime from short fragments: embedding an id-shaped literal
    // here would (correctly) trip the repository-wide scan above.
    const synthetic = ["Synthetic", "Example0123456789", "Token"].join("");
    assert.ok(synthetic.length >= 25);
    assert.equal(looksLikeDriveId(synthetic), true);
    assert.equal(looksLikeDriveId("Access-Control-Allow-Origin"), false);
    assert.equal(looksLikeDriveId("mily-b01-01-birthday-cake"), false);
    assert.equal(looksLikeDriveId("REPLACE_WITH_REAL_ANNOUNCEMENT"), false);
    assert.equal(looksLikeDriveId(DUPLICATE_SHA256), false);
  });

  it("keeps the originals and their id mapping out of git", async () => {
    const ignore = await read(".gitignore");
    assert.match(ignore, /media\/drive-b02-original\/\*/);
    assert.match(ignore, /!media\/drive-b02-original\/README\.md/);

    const { stdout } = await run("git", ["ls-files", "media/drive-b02-original"], { cwd: root });
    assert.deepEqual(
      stdout.split("\n").filter(Boolean),
      ["media/drive-b02-original/README.md"],
      "only the README may be tracked in the input directory",
    );
  });

  it("no longer ships an anonymous Drive download path", async () => {
    const { stdout } = await run("git", ["ls-files"], { cwd: root, maxBuffer: 1024 * 1024 * 8 });
    const tracked = stdout.split("\n").filter(Boolean);
    for (const gone of [
      "scripts/drive-gallery-fetch.mjs",
      "scripts/probe-drive-gallery.mjs",
      ".github/workflows/probe-drive-gallery.yml",
    ]) {
      assert.equal(tracked.includes(gone), false, `${gone} must be removed`);
    }
  });
});

describe("Drive gallery publication gate", () => {
  it("stays in review in both the entry registry and the generated manifest", () => {
    assert.equal(driveGalleryPublication.state, "review");
    assert.equal(driveGalleryManifest.publicationState, "review");
    assert.equal(isDriveGalleryPublished(), false);
  });

  it("ships an empty manifest and no derivative while unpublished", async () => {
    assert.deepEqual(driveGalleryManifest.items, []);
    assert.deepEqual(visibleDriveGallery(), []);
    assert.equal(driveGallerySections(visibleDriveGallery()).hasAny, false);
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
    assert.deepEqual(
      visibleDriveGallery({ ...publishedFixture(), publicationState: "review" }),
      [],
    );
  });

  it("reads no original while unpublished", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "drive-gate-"));
    const manifestPath = path.join(dir, "manifest.json");
    try {
      await run(process.execPath, ["scripts/build-drive-gallery.mjs"], {
        cwd: root,
        env: {
          ...process.env,
          // Point the input at a directory that does not exist: a review run
          // must never touch it.
          DRIVE_GALLERY_INPUT_DIR: path.join(dir, "absent"),
          DRIVE_GALLERY_OUTPUT_DIR: path.join(dir, "out"),
          DRIVE_GALLERY_MANIFEST: manifestPath,
        },
      });
      const written = JSON.parse(await readFile(manifestPath, "utf8"));
      assert.equal(written.publicationState, "review");
      assert.deepEqual(written.items, []);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe("Drive gallery client payload", () => {
  it("keeps Drive identifiers out of the generated manifest", async () => {
    const raw = await read("src/data/driveGalleryManifest.json");
    assert.equal(DRIVE_HOST_PATTERN.test(raw), false);
    assert.deepEqual(findDriveIds(raw), []);
    for (const item of publishedFixture().items) {
      for (const key of ["fileId", "sourceName", "driveId"]) {
        assert.equal(key in item, false, `${item.id} carries ${key}`);
      }
    }
  });

  it("keeps Drive hosts out of every client-facing module", async () => {
    for (const relative of [
      "src/components/Gallery.tsx",
      "src/data/driveGallery.ts",
      "src/data/driveGalleryManifest.json",
    ]) {
      const source = await read(relative);
      assert.equal(DRIVE_HOST_PATTERN.test(source), false, `${relative} references Drive`);
    }
  });

  it("exposes no Drive URL helper to the client", () => {
    for (const name of Object.keys(clientModule)) {
      assert.equal(/thumbnail|preview|fileview|folder|fileid/i.test(name), false, `${name} leaked`);
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

describe("Drive gallery ingest bookkeeping", () => {
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

  it("resolves originals by private map or by slug, and reports a missing one", () => {
    const entry = { id: "mily-drive-b02-p02", kind: "photo" };
    assert.equal(
      resolveInputName(entry, ["ORIGINAL-NAME.jpg"], { "mily-drive-b02-p02": "ORIGINAL-NAME.jpg" }),
      "ORIGINAL-NAME.jpg",
    );
    assert.equal(resolveInputName(entry, ["mily-b02-p02.heic"], null), "mily-b02-p02.heic");
    assert.equal(resolveInputName(entry, ["something-else.jpg"], null), null);
    assert.throws(
      () => resolveInputName(entry, ["a.jpg"], { "mily-drive-b02-p02": "missing.jpg" }),
      /points at a missing file/,
    );
    assert.throws(
      () => resolveInputName(entry, ["a.jpg"], { "mily-drive-b02-p02": "../escape.jpg" }),
      /bare file name/,
    );
    assert.throws(
      () => resolveInputName(entry, ["mily-b02-p02.jpg", "mily-b02-p02.png"], null),
      /2 input files match/,
    );
    assert.equal(SOURCE_MAP_NAME, "sources.json");
  });
});

describe("Sanitize pipeline (local fixtures)", () => {
  let dir;
  let ffmpeg;
  let ffprobe;

  before(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "drive-sanitize-"));
    const ffmpegMod = await import("ffmpeg-static");
    ffmpeg = ffmpegMod.default ?? ffmpegMod;
    const ffprobeMod = await import("ffprobe-static");
    const resolved = ffprobeMod.default ?? ffprobeMod;
    ffprobe = resolved.path ?? resolved;
  });

  after(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("strips EXIF, GPS, IPTC and XMP from photos", async () => {
    const entry = { id: "fixture-photo", kind: "photo", alt: "fixture" };
    // A fixture that deliberately carries GPS and description metadata.
    const withMeta = await sharp({
      create: { width: 2000, height: 1500, channels: 3, background: "#8a8" },
    })
      .withExifMerge({
        IFD0: { ImageDescription: "SECRET-DESCRIPTION", Make: "FixtureCam" },
        GPS: { GPSLatitudeRef: "N", GPSLongitudeRef: "E" },
      })
      .withMetadata()
      .jpeg()
      .toBuffer();

    const before = await sharp(withMeta).metadata();
    assert.ok(before.exif, "fixture must actually carry EXIF");

    const item = await sanitizePhoto(entry, withMeta, dir);

    for (const name of photoDerivatives("fixture-photo")) {
      const meta = await sharp(path.join(dir, name)).metadata();
      assert.equal(Boolean(meta.exif), false, `${name} kept EXIF`);
      assert.equal(Boolean(meta.iptc), false, `${name} kept IPTC`);
      assert.equal(Boolean(meta.xmp), false, `${name} kept XMP`);
      const raw = await readFile(path.join(dir, name));
      assert.equal(
        raw.includes(Buffer.from("SECRET-DESCRIPTION")),
        false,
        `${name} still contains the description`,
      );
    }
    assert.equal(item.width, 1600, "largest derivative is capped at 1600");
    assert.equal(item.height, 1200, "aspect ratio is preserved");
  });

  it("never upscales a small original", async () => {
    const entry = { id: "fixture-small", kind: "photo", alt: "fixture" };
    const small = await sharp({
      create: { width: 320, height: 240, channels: 3, background: "#333" },
    })
      .jpeg()
      .toBuffer();

    const item = await sanitizePhoto(entry, small, dir);
    assert.equal(item.width, 320);
    assert.equal(item.height, 240);
    const largest = await sharp(path.join(dir, "fixture-small-1600.jpg")).metadata();
    assert.equal(largest.width, 320, "must not enlarge past the original");
  });

  it("produces faststart H.264/AAC with no carried-over metadata and a real poster", async () => {
    const entry = { id: "fixture-video", kind: "video", alt: "fixture" };
    const source = path.join(dir, "source.mp4");
    // A fixture that deliberately carries container metadata, plus audio.
    await run(ffmpeg, [
      "-hide_banner", "-loglevel", "error", "-y",
      "-f", "lavfi", "-i", "testsrc=size=360x640:rate=15:duration=1",
      "-f", "lavfi", "-i", "sine=frequency=440:duration=1",
      "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac",
      "-metadata", "location=+35.6+139.7",
      "-metadata", "comment=SECRET-COMMENT",
      source,
    ]);

    const item = await sanitizeVideo(entry, source, dir);
    const mp4 = path.join(dir, "fixture-video.mp4");
    const poster = path.join(dir, "fixture-video-poster.jpg");

    const { stdout } = await run(ffprobe, [
      "-hide_banner", "-loglevel", "error",
      "-show_format", "-show_streams", "-print_format", "json", mp4,
    ]);
    const info = JSON.parse(stdout);
    const video = info.streams.find((s) => s.codec_type === "video");
    const audio = info.streams.find((s) => s.codec_type === "audio");

    assert.equal(video.codec_name, "h264");
    assert.equal(audio.codec_name, "aac");
    assert.deepEqual(leftoverTags(info.format.tags), [], "container metadata survived");
    assert.equal(
      (await readFile(mp4)).includes(Buffer.from("SECRET-COMMENT")),
      false,
      "the source comment leaked into the output",
    );
    assert.equal(await isFaststart(mp4), true, "moov must precede mdat");

    // Aspect ratio preserved, no crop, no upscale past 720 wide.
    assert.equal(video.width, 360);
    assert.equal(video.height, 640);
    assert.equal(item.width, 360);

    const posterMeta = await sharp(poster).metadata();
    assert.ok((await stat(poster)).size > 0, "poster must be a real frame");
    assert.equal(posterMeta.width, 360);
    assert.equal(Boolean(posterMeta.exif), false);
  });

  it("fails closed when a photo fixture is unreadable", async () => {
    const entry = { id: "fixture-broken", kind: "photo", alt: "fixture" };
    await assert.rejects(() => sanitizePhoto(entry, Buffer.from("not an image"), dir));
  });

  it("fails closed when a video fixture is unreadable", async () => {
    const entry = { id: "fixture-broken-video", kind: "video", alt: "fixture" };
    const broken = path.join(dir, "broken.mp4");
    await writeFile(broken, "not a video");
    await assert.rejects(() => sanitizeVideo(entry, broken, dir));
  });
});

describe("Gallery UI contract", () => {
  it("renders local assets and no Drive iframe", async () => {
    const gallery = await read("src/components/Gallery.tsx");
    assert.equal(/iframe/i.test(gallery), false, "no Drive iframe may remain");
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
