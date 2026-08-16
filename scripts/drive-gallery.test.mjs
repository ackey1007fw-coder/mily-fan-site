import assert from "node:assert/strict";
import { readFile, readdir, mkdir, mkdtemp, writeFile, rm, stat } from "node:fs/promises";
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
  ALLOWED_STREAM_TAGS,
  VIDEO_MAX_WIDTH,
  isFaststart,
  leftoverTags,
  manifestFromExisting,
  orientedSourceSize,
  streamTagViolations,
  photoDerivatives,
  photoManifestEntry,
  resolveInputName,
  sanitizePhoto,
  sanitizeVideo,
  validatePhotoDerivatives,
  validateVideoDerivatives,
  videoManifestEntry,
} from "./build-drive-gallery.mjs";

import {
  DRIVE_HOST_PATTERN,
  findDriveIds,
  isProbablyBinary,
  listTrackedFiles,
  looksLikeDriveId,
  readTrackedTextFiles,
  scanForDriveIdentifiers,
} from "./scan-tracked-text.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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
  it("scans every tracked text file, not an extension allowlist", async () => {
    const { scanned, skippedBinary, findings } = await scanForDriveIdentifiers(root);
    assert.ok(scanned > 80, `expected to scan the tracked tree, scanned ${scanned}`);
    assert.deepEqual(
      findings,
      [],
      `Drive identifiers found: ${JSON.stringify(findings.slice(0, 5))}`,
    );
    // Binary blobs are skipped by content, never by file name.
    for (const file of skippedBinary) {
      assert.ok(typeof file === "string");
    }
  });

  it("scans every tracked file that is not binary", async () => {
    const tracked = await listTrackedFiles(root);
    const { files, skippedBinary } = await readTrackedTextFiles(root);
    const scannedNames = new Set(files.map((f) => f.file));
    const skipped = new Set(skippedBinary);

    // Whatever the repository grows next is covered without editing this test:
    // membership is decided by content, not by extension.
    for (const file of tracked) {
      assert.ok(
        scannedNames.has(file) || skipped.has(file),
        `${file} was neither scanned nor classified as binary`,
      );
    }
    assert.equal(scannedNames.size + skipped.size, tracked.length);

    // The old allowlist would have skipped these extensions entirely.
    const covered = [...scannedNames].filter((f) =>
      /\.(svg|xml|webmanifest)$/i.test(f),
    );
    assert.ok(
      covered.length > 0,
      "expected the tree to contain a file the old extension allowlist missed",
    );
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

    const { item } = await sanitizePhoto(entry, withMeta, dir);

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

    const { item } = await sanitizePhoto(entry, small, dir);
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

describe("Existing derivatives are re-validated before reuse", () => {
  let dir;
  let ffmpeg;
  let ffprobe;

  /** Build a clean, contract-passing photo set for `id` in its own directory. */
  async function buildPhotoSet(id, { width = 2000, height = 1500 } = {}) {
    const out = path.join(dir, id);
    await mkdir(out, { recursive: true });
    const bytes = await sharp({
      create: { width, height, channels: 3, background: "#4a6" },
    })
      .jpeg()
      .toBuffer();
    const { attested } = await sanitizePhoto({ id, kind: "photo", alt: id }, bytes, out);
    return { out, attested, attestation: { entries: { [id]: attested } } };
  }

  /** Build a clean, contract-passing video set for `id` in its own directory. */
  async function buildVideoSet(id) {
    const out = path.join(dir, id);
    await mkdir(out, { recursive: true });
    const source = path.join(out, "source-input.mp4");
    await run(ffmpeg, [
      "-hide_banner", "-loglevel", "error", "-y",
      "-f", "lavfi", "-i", "testsrc=size=360x640:rate=15:duration=1",
      "-f", "lavfi", "-i", "sine=frequency=440:duration=1",
      "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac",
      source,
    ]);
    await sanitizeVideo({ id, kind: "video", alt: id }, source, out);
    await rm(source, { force: true });
    return out;
  }

  before(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "drive-reuse-"));
    const ffmpegMod = await import("ffmpeg-static");
    ffmpeg = ffmpegMod.default ?? ffmpegMod;
    const ffprobeMod = await import("ffprobe-static");
    const resolved = ffprobeMod.default ?? ffprobeMod;
    ffprobe = resolved.path ?? resolved;
  });

  after(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("reuses a clean existing photo set and reads its real dimensions", async () => {
    const id = "reuse-photo-ok";
    const { out, attestation } = await buildPhotoSet(id, { width: 2000, height: 1500 });
    const entry = { id, kind: "photo", alt: "reuse" };

    // The whole set is present, so the ingest would classify it as "skip".
    const names = new Set(await readdir(out));
    assert.equal(classifyOutputs(entry, names), "skip");

    const item = await manifestFromExisting(entry, out, attestation);
    assert.equal(item.width, 1600);
    assert.equal(item.height, 1200);
    assert.equal(item.src, `${PUBLIC_PREFIX}/${id}-960.jpg`);
  });

  it("rejects a complete photo set when one derivative regained metadata", async () => {
    const id = "reuse-photo-exif";
    const { out, attested, attestation } = await buildPhotoSet(id);
    const entry = { id, kind: "photo", alt: "reuse" };
    assert.equal(classifyOutputs(entry, new Set(await readdir(out))), "skip");

    // Swap the 960 jpg for a visually similar file that carries EXIF/GPS.
    const swapped = await sharp({
      create: { width: 960, height: 720, channels: 3, background: "#4a6" },
    })
      .withExifMerge({
        IFD0: { ImageDescription: "SWAPPED-IN" },
        GPS: { GPSLatitudeRef: "N" },
      })
      .withMetadata()
      .jpeg()
      .toBuffer();
    await writeFile(path.join(out, `${id}-960.jpg`), swapped);

    await assert.rejects(
      () => validatePhotoDerivatives(entry, out, attested),
      /carries EXIF\/IPTC\/XMP metadata/,
    );
    await assert.rejects(() => manifestFromExisting(entry, out, attestation));
  });

  it("rejects a photo derivative that was upscaled past its slot", async () => {
    const id = "reuse-photo-upscaled";
    const { out, attested } = await buildPhotoSet(id, { width: 800, height: 600 });
    const entry = { id, kind: "photo", alt: "reuse" };

    // The original was 800px, so every slot should cap at 800. Drop in a
    // genuinely larger 1600 derivative: an upscale that must not be trusted.
    const upscaled = await sharp({
      create: { width: 1600, height: 1200, channels: 3, background: "#4a6" },
    })
      .jpeg()
      .toBuffer();
    await writeFile(path.join(out, `${id}-1600.jpg`), upscaled);

    await assert.rejects(
      () => validatePhotoDerivatives(entry, out, attested),
      /upscaled or inconsistent derivative/,
    );
  });

  it("rejects a photo set with a corrupt or missing derivative", async () => {
    const id = "reuse-photo-corrupt";
    const { out, attested } = await buildPhotoSet(id);
    const entry = { id, kind: "photo", alt: "reuse" };

    await writeFile(path.join(out, `${id}-480.webp`), "not an image");
    await assert.rejects(
      () => validatePhotoDerivatives(entry, out, attested),
      /does not decode/,
    );

    await rm(path.join(out, `${id}-480.webp`));
    await assert.rejects(
      () => validatePhotoDerivatives(entry, out, attested),
      /missing derivative/,
    );
  });

  it("reuses a clean existing video set and reads its real dimensions", async () => {
    const id = "reuse-video-ok";
    const out = await buildVideoSet(id);
    const entry = { id, kind: "video", alt: "reuse" };
    assert.equal(classifyOutputs(entry, new Set(await readdir(out))), "skip");

    const item = await manifestFromExisting(entry, out);
    assert.equal(item.width, 360);
    assert.equal(item.height, 640);
    assert.ok(item.width <= VIDEO_MAX_WIDTH);
    assert.equal(item.poster, `${PUBLIC_PREFIX}/${id}-poster.jpg`);
  });

  it("rejects an existing MP4 that carries disallowed container metadata", async () => {
    const id = "reuse-video-metadata";
    const out = await buildVideoSet(id);
    const entry = { id, kind: "video", alt: "reuse" };
    assert.equal(classifyOutputs(entry, new Set(await readdir(out))), "skip");

    // Re-mux the sanitized MP4 with a geotag, as a careless swap would.
    const tagged = path.join(dir, `${id}-tagged.mp4`);
    await run(ffmpeg, [
      "-hide_banner", "-loglevel", "error", "-y",
      "-i", path.join(out, `${id}.mp4`),
      "-c", "copy",
      "-metadata", "location=+35.6+139.7",
      "-movflags", "+faststart",
      tagged,
    ]);
    await writeFile(path.join(out, `${id}.mp4`), await readFile(tagged));

    await assert.rejects(() => validateVideoDerivatives(entry, out), /carries metadata/);
    await assert.rejects(() => manifestFromExisting(entry, out));
  });

  it("rejects an existing MP4 that is not faststart", async () => {
    const id = "reuse-video-faststart";
    const out = await buildVideoSet(id);
    const entry = { id, kind: "video", alt: "reuse" };

    // Same streams, but moov written at the end.
    const slow = path.join(dir, `${id}-slow.mp4`);
    await run(ffmpeg, [
      "-hide_banner", "-loglevel", "error", "-y",
      "-i", path.join(out, `${id}.mp4`),
      "-c", "copy",
      "-movflags", "-faststart",
      slow,
    ]);
    assert.equal(await isFaststart(slow), false, "fixture must not be faststart");
    await writeFile(path.join(out, `${id}.mp4`), await readFile(slow));

    await assert.rejects(() => validateVideoDerivatives(entry, out), /not faststart/);
  });

  it("rejects an existing video set whose poster is broken", async () => {
    const id = "reuse-video-poster";
    const out = await buildVideoSet(id);
    const entry = { id, kind: "video", alt: "reuse" };

    await writeFile(path.join(out, `${id}-poster.jpg`), "not an image");
    await assert.rejects(() => validateVideoDerivatives(entry, out), /poster does not decode/);

    await rm(path.join(out, `${id}-poster.jpg`));
    await assert.rejects(() => validateVideoDerivatives(entry, out), /missing derivative/);
  });

  it("rejects an existing poster that carries metadata", async () => {
    const id = "reuse-video-poster-exif";
    const out = await buildVideoSet(id);
    const entry = { id, kind: "video", alt: "reuse" };

    const tainted = await sharp({
      create: { width: 360, height: 640, channels: 3, background: "#222" },
    })
      .withExifMerge({ IFD0: { ImageDescription: "SWAPPED-IN" } })
      .withMetadata()
      .jpeg()
      .toBuffer();
    await writeFile(path.join(out, `${id}-poster.jpg`), tainted);

    await assert.rejects(
      () => validateVideoDerivatives(entry, out),
      /poster carries EXIF\/IPTC\/XMP metadata/,
    );
  });

  it("still treats a half-written output set as partial, never as reusable", async () => {
    const id = "reuse-partial";
    const out = await buildVideoSet(id);
    const entry = { id, kind: "video", alt: "reuse" };

    await rm(path.join(out, `${id}-poster.jpg`));
    assert.equal(classifyOutputs(entry, new Set(await readdir(out))), "partial");
  });

  it("runs the same contract after a fresh sanitize and on reuse", async () => {
    // A freshly sanitized set must satisfy exactly what the reuse path checks.
    const id = "reuse-same-contract";
    const { out, attested, attestation } = await buildPhotoSet(id);
    const entry = { id, kind: "photo", alt: "reuse" };
    const fresh = await validatePhotoDerivatives(entry, out, attested);
    const reused = await manifestFromExisting(entry, out, attestation);
    assert.equal(reused.width, fresh.width);
    assert.equal(reused.height, fresh.height);
  });
});

describe("MP4 stream-level metadata", () => {
  let dir;
  let ffmpeg;
  let ffprobe;

  const SECRETS = [
    "SECRET_VIDEO_TITLE",
    "SECRET_VIDEO_COMMENT",
    "SECRET_AUDIO_TITLE",
    "SECRET_AUDIO_COMMENT",
    "SECRET_GLOBAL_COMMENT",
    "SECRET_DEVICE_HANDLER",
  ];

  async function probe(file) {
    const { stdout } = await run(ffprobe, [
      "-hide_banner", "-loglevel", "error",
      "-show_format", "-show_streams", "-print_format", "json", file,
    ]);
    return JSON.parse(stdout);
  }

  /** Matroska keeps arbitrary per-stream tags, so it can carry the leak we are
   *  defending against into the pipeline. */
  async function makeLeakySource(name) {
    const src = path.join(dir, name);
    await run(ffmpeg, [
      "-hide_banner", "-loglevel", "error", "-y",
      "-f", "lavfi", "-i", "testsrc=size=360x640:rate=15:duration=1",
      "-f", "lavfi", "-i", "sine=frequency=440:duration=1",
      "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac",
      "-metadata", "comment=SECRET_GLOBAL_COMMENT",
      "-metadata:s:v:0", "title=SECRET_VIDEO_TITLE",
      "-metadata:s:v:0", "comment=SECRET_VIDEO_COMMENT",
      "-metadata:s:a:0", "title=SECRET_AUDIO_TITLE",
      "-metadata:s:a:0", "comment=SECRET_AUDIO_COMMENT",
      src,
    ]);
    return src;
  }

  before(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "drive-streams-"));
    const ffmpegMod = await import("ffmpeg-static");
    ffmpeg = ffmpegMod.default ?? ffmpegMod;
    const ffprobeMod = await import("ffprobe-static");
    const resolved = ffprobeMod.default ?? ffprobeMod;
    ffprobe = resolved.path ?? resolved;
  });

  after(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("allowlists only the tags this muxer writes itself", () => {
    assert.deepEqual([...ALLOWED_STREAM_TAGS].sort(), ["encoder", "handler_name", "language"]);

    // Unknown keys fail: allowlist, not denylist.
    assert.deepEqual(streamTagViolations({ language: "und" }), []);
    assert.deepEqual(streamTagViolations({ handler_name: "VideoHandler" }), []);
    assert.deepEqual(streamTagViolations({ encoder: "Lavc61.3.100 libx264" }), []);
    assert.deepEqual(streamTagViolations({}), []);
    assert.deepEqual(streamTagViolations(undefined), []);

    assert.deepEqual(streamTagViolations({ title: "x" }), ["unexpected tag title"]);
    assert.deepEqual(streamTagViolations({ creation_time: "2020" }), [
      "unexpected tag creation_time",
    ]);
    assert.deepEqual(streamTagViolations({ some_future_tag: "x" }), [
      "unexpected tag some_future_tag",
    ]);
    // Allowed key, source-derived value.
    assert.deepEqual(streamTagViolations({ handler_name: "Core Media Video" }), [
      'handler_name is "Core Media Video"',
    ]);
    assert.deepEqual(streamTagViolations({ encoder: "MyPhone 1.0" }), [
      'encoder is "MyPhone 1.0"',
    ]);
  });

  it("strips video and audio stream metadata during sanitize", async () => {
    const src = await makeLeakySource("leaky.mkv");
    const sourceInfo = await probe(src);
    const sourceBlob = JSON.stringify(sourceInfo);
    // The fixture must actually carry the leak, or the test proves nothing.
    assert.ok(sourceBlob.includes("SECRET_VIDEO_TITLE"), "fixture lost its video tag");
    assert.ok(sourceBlob.includes("SECRET_AUDIO_TITLE"), "fixture lost its audio tag");

    const out = path.join(dir, "sanitized");
    await mkdir(out, { recursive: true });
    const entry = { id: "stream-clean", kind: "video", alt: "clean" };
    await sanitizeVideo(entry, src, out);

    const info = await probe(path.join(out, "stream-clean.mp4"));
    const blob = JSON.stringify(info);
    for (const secret of SECRETS) {
      assert.equal(blob.includes(secret), false, `${secret} survived sanitize`);
    }
    assert.deepEqual(leftoverTags(info.format.tags), []);
    for (const stream of info.streams) {
      assert.deepEqual(
        streamTagViolations(stream.tags),
        [],
        `${stream.codec_type} stream kept metadata`,
      );
    }
    // C. clean sanitized output passes the validator.
    await validateVideoDerivatives(entry, out);
  });

  it("rejects an existing MP4 whose video stream carries metadata", async () => {
    const src = await makeLeakySource("leaky-v.mkv");
    const out = path.join(dir, "video-leak");
    await mkdir(out, { recursive: true });
    const entry = { id: "video-leak", kind: "video", alt: "leak" };
    await sanitizeVideo(entry, src, out);

    // Re-mux the clean output, injecting a video stream tag as a careless
    // hand-edit or a different toolchain would.
    const mp4 = path.join(out, "video-leak.mp4");
    const tampered = path.join(dir, "video-leak-tampered.mp4");
    await run(ffmpeg, [
      "-hide_banner", "-loglevel", "error", "-y",
      "-i", mp4, "-c", "copy",
      "-metadata:s:v:0", "handler_name=SECRET_DEVICE_HANDLER",
      "-movflags", "+faststart", tampered,
    ]);
    await writeFile(mp4, await readFile(tampered));

    const info = await probe(mp4);
    const video = info.streams.find((s) => s.codec_type === "video");
    assert.ok(streamTagViolations(video.tags).length > 0, "fixture must be tainted");

    await assert.rejects(
      () => validateVideoDerivatives(entry, out),
      /video stream carries metadata/,
    );
  });

  it("rejects an existing MP4 whose audio stream carries metadata", async () => {
    const src = await makeLeakySource("leaky-a.mkv");
    const out = path.join(dir, "audio-leak");
    await mkdir(out, { recursive: true });
    const entry = { id: "audio-leak", kind: "video", alt: "leak" };
    await sanitizeVideo(entry, src, out);

    const mp4 = path.join(out, "audio-leak.mp4");
    const tampered = path.join(dir, "audio-leak-tampered.mp4");
    await run(ffmpeg, [
      "-hide_banner", "-loglevel", "error", "-y",
      "-i", mp4, "-c", "copy",
      "-metadata:s:a:0", "handler_name=SECRET_DEVICE_HANDLER",
      "-movflags", "+faststart", tampered,
    ]);
    await writeFile(mp4, await readFile(tampered));

    await assert.rejects(
      () => validateVideoDerivatives(entry, out),
      /audio stream carries metadata/,
    );
  });
});

describe("Trusted photo source attestation", () => {
  let dir;

  before(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "drive-attest-"));
  });

  after(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("measures the oriented size of the original", async () => {
    const upright = await sharp({
      create: { width: 320, height: 426, channels: 3, background: "#357" },
    })
      .jpeg()
      .toBuffer();
    assert.deepEqual(await orientedSourceSize(upright), {
      sourceWidth: 320,
      sourceHeight: 426,
    });

    // EXIF orientation 6 means the pipeline will rotate it, swapping the axes.
    const rotated = await sharp({
      create: { width: 426, height: 320, channels: 3, background: "#357" },
    })
      .withMetadata({ orientation: 6 })
      .jpeg()
      .toBuffer();
    assert.equal((await sharp(rotated).metadata()).orientation, 6);
    assert.deepEqual(await orientedSourceSize(rotated), {
      sourceWidth: 320,
      sourceHeight: 426,
    });
  });

  it("passes a genuine 320px original whose derivatives never enlarge", async () => {
    const id = "attest-small";
    const out = path.join(dir, id);
    await mkdir(out, { recursive: true });
    const bytes = await sharp({
      create: { width: 320, height: 426, channels: 3, background: "#357" },
    })
      .jpeg()
      .toBuffer();

    const { item, attested } = await sanitizePhoto({ id, kind: "photo", alt: id }, bytes, out);
    assert.deepEqual(attested, { sourceWidth: 320, sourceHeight: 426 });
    assert.equal(item.width, 320);
    assert.equal(item.height, 426);

    // Every slot caps at the original width, and reuse agrees.
    const reused = await manifestFromExisting({ id, kind: "photo", alt: id }, out, {
      entries: { [id]: attested },
    });
    assert.equal(reused.width, 320);
    assert.equal(reused.height, 426);
  });

  it("rejects a fully self-consistent set of upscales", async () => {
    const id = "attest-upscaled";
    const out = path.join(dir, id);
    await mkdir(out, { recursive: true });

    // Six derivatives that agree with each other perfectly: 480/960/1600 at
    // exactly their slot widths, jpg and webp matching. Only the attestation
    // reveals that the original was 320px wide.
    for (const width of PHOTO_WIDTHS) {
      const height = Math.round((426 * width) / 320);
      const upscaled = sharp({
        create: { width, height, channels: 3, background: "#357" },
      });
      await upscaled.clone().jpeg().toFile(path.join(out, `${id}-${width}.jpg`));
      await upscaled.clone().webp().toFile(path.join(out, `${id}-${width}.webp`));
    }

    const entry = { id, kind: "photo", alt: id };
    const attested = { sourceWidth: 320, sourceHeight: 426 };

    // The set is complete, so the ingest would otherwise reuse it.
    assert.equal(classifyOutputs(entry, new Set(await readdir(out))), "skip");

    await assert.rejects(
      () => validatePhotoDerivatives(entry, out, attested),
      /upscaled or inconsistent derivative/,
    );
    await assert.rejects(
      () => manifestFromExisting(entry, out, { entries: { [id]: attested } }),
      /upscaled or inconsistent derivative/,
    );
  });

  it("refuses to trust existing derivatives with no attestation", async () => {
    const id = "attest-missing";
    const out = path.join(dir, id);
    await mkdir(out, { recursive: true });
    const bytes = await sharp({
      create: { width: 900, height: 600, channels: 3, background: "#357" },
    })
      .jpeg()
      .toBuffer();
    await sanitizePhoto({ id, kind: "photo", alt: id }, bytes, out);

    const entry = { id, kind: "photo", alt: id };
    await assert.rejects(
      () => manifestFromExisting(entry, out, { entries: {} }),
      /no trusted source attestation/,
    );
  });

  it("rejects a derivative whose aspect ratio was changed", async () => {
    const id = "attest-aspect";
    const out = path.join(dir, id);
    await mkdir(out, { recursive: true });
    const bytes = await sharp({
      create: { width: 800, height: 600, channels: 3, background: "#357" },
    })
      .jpeg()
      .toBuffer();
    const { attested } = await sanitizePhoto({ id, kind: "photo", alt: id }, bytes, out);

    // Correct width, wrong height: a crop rather than a resize.
    await sharp({ create: { width: 480, height: 480, channels: 3, background: "#357" } })
      .jpeg()
      .toFile(path.join(out, `${id}-480.jpg`));

    await assert.rejects(
      () => validatePhotoDerivatives({ id, kind: "photo", alt: id }, out, attested),
      /aspect ratio changed or cropped/,
    );
  });

  it("keeps the committed attestation non-identifying and empty while unpublished", async () => {
    const raw = await read("scripts/drive-gallery-attestation.json");
    const parsed = JSON.parse(raw);
    assert.deepEqual(parsed.entries, {});
    assert.equal(DRIVE_HOST_PATTERN.test(raw), false);
    assert.deepEqual(findDriveIds(raw), []);
  });
});

describe("Repository scan is extension-independent", () => {
  let dir;

  /** A Drive-shaped token assembled at runtime: embedding an id-shaped literal
   *  would (correctly) trip the repository scan of this very file. */
  const synthetic = ["Synthetic", "Example0123456789", "Token"].join("");

  async function git(args, cwd) {
    return run("git", args, { cwd });
  }

  before(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "drive-scan-"));
    await git(["init", "-q"], dir);
    await git(["config", "user.email", "test@example.com"], dir);
    await git(["config", "user.name", "test"], dir);
  });

  after(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("finds id-shaped tokens in files no extension allowlist would cover", async () => {
    await writeFile(path.join(dir, "sitemap.xml"), `<url><loc>${synthetic}</loc></url>`);
    await writeFile(path.join(dir, "icon.svg"), `<svg><desc>${synthetic}</desc></svg>`);
    await writeFile(
      path.join(dir, "site.webmanifest"),
      JSON.stringify({ name: synthetic }),
    );
    await git(["add", "-A"], dir);

    const { findings, scanned } = await scanForDriveIdentifiers(dir);
    const flagged = findings.filter((f) => f.kind === "id-shape").map((f) => f.file);
    assert.equal(scanned, 3);
    assert.deepEqual(flagged.sort(), ["icon.svg", "site.webmanifest", "sitemap.xml"]);
  });

  it("skips binary files instead of misreading them", async () => {
    const png = await sharp({
      create: { width: 8, height: 8, channels: 3, background: "#123" },
    })
      .png()
      .toBuffer();
    await writeFile(path.join(dir, "pixel.png"), png);
    await writeFile(path.join(dir, "raw.bin"), Buffer.from([0x00, 0x01, 0x02, 0x00]));
    await git(["add", "-A"], dir);

    const { findings, skippedBinary } = await scanForDriveIdentifiers(dir);
    assert.ok(skippedBinary.includes("pixel.png"));
    assert.ok(skippedBinary.includes("raw.bin"));
    for (const finding of findings) {
      assert.equal(finding.file.endsWith(".png"), false);
      assert.equal(finding.file.endsWith(".bin"), false);
    }
    assert.equal(isProbablyBinary(png), true);
    assert.equal(isProbablyBinary(Buffer.from("plain text")), false);
  });

  it("does not flag ordinary long identifiers", async () => {
    const clean = path.join(dir, "clean");
    await mkdir(clean, { recursive: true });
    await writeFile(
      path.join(clean, "headers.xml"),
      "<h>Access-Control-Allow-Origin</h><h>REPLACE_WITH_REAL_ANNOUNCEMENT</h>",
    );
    await writeFile(path.join(clean, "digest.txt"), DUPLICATE_SHA256);
    await writeFile(path.join(clean, "slug.svg"), "<desc>mily-b01-01-birthday-cake</desc>");
    await git(["add", "-A"], dir);

    const { findings } = await scanForDriveIdentifiers(dir);
    const inClean = findings.filter((f) => f.file.startsWith("clean/"));
    assert.deepEqual(inClean, [], "ordinary identifiers must not be flagged");
  });

  it("finds Drive hosts and folder paths regardless of extension", async () => {
    const hosts = path.join(dir, "hosts");
    await mkdir(hosts, { recursive: true });
    // Assembled at runtime for the same reason as the synthetic token.
    const host = ["drive", ".google", ".com"].join("");
    const folderPath = ["/drive", "/folders", "/x"].join("");
    await writeFile(path.join(hosts, "feed.xml"), `<link>https://${host}/file/d/x/view</link>`);
    await writeFile(
      path.join(hosts, "map.webmanifest"),
      JSON.stringify({ u: `https://${host}${folderPath}` }),
    );
    await git(["add", "-A"], dir);

    const { findings } = await scanForDriveIdentifiers(dir);
    const kinds = new Set(
      findings.filter((f) => f.file.startsWith("hosts/")).map((f) => f.kind),
    );
    assert.ok(kinds.has("drive-host"), "must flag the Drive host");
    assert.ok(kinds.has("drive-folder"), "must flag the folder path");
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
