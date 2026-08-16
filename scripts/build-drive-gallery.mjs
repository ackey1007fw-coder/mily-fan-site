/**
 * Ingests owner-provided Drive media into sanitized static assets.
 *
 *   Drive individual file ids  (build input only)
 *        -> download            scripts/drive-gallery-fetch.mjs
 *        -> sanitize            sharp / ffmpeg, all metadata dropped
 *        -> public/media/drive-gallery/
 *        -> src/data/driveGalleryManifest.json   (what the client renders)
 *
 * The browser never talks to Google: no Drive iframe, no Drive thumbnail and no
 * Drive file id in the client bundle.
 *
 * Gate behaviour:
 * - publication "review"    -> no network request at all, empty manifest
 * - publication "published" -> download only contentVerified + approved entries
 *
 * Fail closed. Any HTTP error, HTML interstitial, MIME mismatch, empty payload
 * or partial output stops the run with a non-zero exit.
 *
 * Run deliberately (`pnpm drive-gallery:build`), not from `pnpm build`:
 * derivatives are committed like public/media/gallery, so deploys stay
 * reproducible and never re-download hundreds of MB.
 *
 * The DRIVE_GALLERY_* environment variables exist so CI can rehearse a
 * published run into a throwaway directory. They cannot publish anything: the
 * client only reads the committed manifest, and it renders nothing unless that
 * manifest's own publicationState is "published".
 */
import { mkdir, readdir, writeFile, rm, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import sharp from "sharp";
import { downloadDriveFile } from "./drive-gallery-fetch.mjs";
import {
  driveGalleryPublication,
  driveGallerySource,
  outputSlug,
  publishableSource,
} from "./drive-gallery-source.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const OUTPUT_DIR = path.join(root, "public/media/drive-gallery");
export const MANIFEST_PATH = path.join(root, "src/data/driveGalleryManifest.json");
export const PUBLIC_PREFIX = "/media/drive-gallery";
export const PHOTO_WIDTHS = [480, 960, 1600];
/** Portrait clips stay at most 720 wide; never upscale. */
export const VIDEO_MAX_WIDTH = 720;

export function photoDerivatives(slug) {
  return PHOTO_WIDTHS.flatMap((width) =>
    ["jpg", "webp"].map((format) => `${slug}-${width}.${format}`),
  );
}

export function videoDerivatives(slug) {
  return [`${slug}.mp4`, `${slug}-poster.jpg`];
}

export function derivativesFor(entry) {
  const slug = outputSlug(entry.id);
  return entry.kind === "photo" ? photoDerivatives(slug) : videoDerivatives(slug);
}

/** @returns {"build" | "skip" | "partial"} */
export function classifyOutputs(entry, existingNames) {
  const expected = derivativesFor(entry);
  const present = expected.filter((name) => existingNames.has(name));
  if (present.length === 0) return "build";
  if (present.length === expected.length) return "skip";
  return "partial";
}

/** ffmpeg always writes the ISO brand tags and an encoder string; anything else
 *  would be carried-over source metadata. */
export function leftoverTags(tags) {
  const allowed = new Set([
    "major_brand",
    "minor_version",
    "compatible_brands",
    "encoder",
  ]);
  return Object.keys(tags ?? {}).filter((key) => !allowed.has(key.toLowerCase()));
}

export function photoManifestEntry(entry, width, height) {
  const slug = outputSlug(entry.id);
  return {
    id: entry.id,
    kind: "photo",
    alt: entry.alt,
    src: `${PUBLIC_PREFIX}/${slug}-${PHOTO_WIDTHS[1]}.jpg`,
    srcSet: {
      jpg: PHOTO_WIDTHS.map((w) => `${PUBLIC_PREFIX}/${slug}-${w}.jpg ${w}w`).join(", "),
      webp: PHOTO_WIDTHS.map((w) => `${PUBLIC_PREFIX}/${slug}-${w}.webp ${w}w`).join(", "),
    },
    width,
    height,
  };
}

export function videoManifestEntry(entry, width, height) {
  const slug = outputSlug(entry.id);
  return {
    id: entry.id,
    kind: "video",
    alt: entry.alt,
    src: `${PUBLIC_PREFIX}/${slug}.mp4`,
    poster: `${PUBLIC_PREFIX}/${slug}-poster.jpg`,
    width,
    height,
  };
}

function config() {
  const only = process.env.DRIVE_GALLERY_ONLY;
  return {
    state: process.env.DRIVE_GALLERY_STATE ?? driveGalleryPublication.state,
    outputDir: process.env.DRIVE_GALLERY_OUTPUT_DIR
      ? path.resolve(process.env.DRIVE_GALLERY_OUTPUT_DIR)
      : OUTPUT_DIR,
    manifestPath: process.env.DRIVE_GALLERY_MANIFEST
      ? path.resolve(process.env.DRIVE_GALLERY_MANIFEST)
      : MANIFEST_PATH,
    only: only ? new Set(only.split(",").map((s) => s.trim())) : null,
  };
}

async function ffmpegExe() {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;
  const mod = await import("ffmpeg-static");
  const exe = mod.default ?? mod;
  if (typeof exe !== "string") throw new Error("ffmpeg-static did not resolve to a path");
  return exe;
}

async function ffprobeExe() {
  if (process.env.FFPROBE_PATH) return process.env.FFPROBE_PATH;
  const mod = await import("ffprobe-static");
  const resolved = mod.default ?? mod;
  return resolved.path ?? resolved;
}

/** Sharp drops EXIF / GPS / IPTC / XMP unless withMetadata() is called.
 *  This never calls it, and verifies the result. */
async function sanitizePhoto(entry, bytes, outputDir) {
  const slug = outputSlug(entry.id);
  let largest = null;

  for (const width of PHOTO_WIDTHS) {
    for (const format of ["jpg", "webp"]) {
      const out = path.join(outputDir, `${slug}-${width}.${format}`);
      const pipeline = sharp(bytes, { failOn: "error" })
        .rotate()
        .resize({ width, withoutEnlargement: true });
      const encoded =
        format === "jpg"
          ? pipeline.jpeg({ quality: 82, mozjpeg: true })
          : pipeline.webp({ quality: 80 });
      const info = await encoded.toFile(out);
      if (format === "jpg" && (!largest || info.width > largest.width)) {
        largest = { width: info.width, height: info.height };
      }
    }
  }

  const check = await sharp(path.join(outputDir, `${slug}-${PHOTO_WIDTHS[1]}.jpg`)).metadata();
  if (check.exif || check.iptc || check.xmp) {
    throw new Error(`${entry.id}: metadata survived sanitize`);
  }

  return photoManifestEntry(entry, largest.width, largest.height);
}

async function sanitizeVideo(entry, bytes, outputDir, tmpDir) {
  const slug = outputSlug(entry.id);
  const src = path.join(tmpDir, `${slug}.src`);
  await writeFile(src, bytes);

  const mp4 = path.join(outputDir, `${slug}.mp4`);
  const poster = path.join(outputDir, `${slug}-poster.jpg`);
  const ffmpeg = await ffmpegExe();
  const ffprobe = await ffprobeExe();

  await run(
    ffmpeg,
    [
      "-hide_banner", "-loglevel", "error", "-y",
      "-i", src,
      // Drop every container/stream tag and chapter: no GPS, no device, no dates.
      "-map_metadata", "-1",
      "-map_chapters", "-1",
      "-c:v", "libx264", "-profile:v", "high", "-crf", "24", "-preset", "medium",
      "-pix_fmt", "yuv420p",
      // Never upscale; keep the aspect ratio; no crop.
      "-vf", `scale='min(${VIDEO_MAX_WIDTH},iw)':-2`,
      "-c:a", "aac", "-b:a", "128k",
      "-movflags", "+faststart",
      mp4,
    ],
    { maxBuffer: 1024 * 1024 * 32 },
  );

  // Poster is a real frame of the sanitized video. Never generated.
  await run(ffmpeg, [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", mp4, "-frames:v", "1", "-q:v", "4", poster,
  ]);

  const { stdout } = await run(ffprobe, [
    "-hide_banner", "-loglevel", "error",
    "-show_format", "-show_streams", "-print_format", "json", mp4,
  ]);
  const info = JSON.parse(stdout);
  const video = info.streams.find((s) => s.codec_type === "video");
  const audio = info.streams.find((s) => s.codec_type === "audio");
  if (!video) throw new Error(`${entry.id}: no video stream in output`);
  if (video.codec_name !== "h264") throw new Error(`${entry.id}: output is not H.264`);
  if (audio && audio.codec_name !== "aac") throw new Error(`${entry.id}: audio is not AAC`);
  if (leftoverTags(info.format.tags).length > 0) {
    throw new Error(`${entry.id}: container metadata survived sanitize`);
  }
  await rm(src, { force: true });

  return videoManifestEntry(entry, video.width, video.height);
}

async function writeManifest(manifestPath, state, items) {
  const manifest = {
    generatedBy: "scripts/build-drive-gallery.mjs",
    publicationState: state,
    items,
  };
  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

async function main() {
  const { state, outputDir, manifestPath, only } = config();
  await mkdir(outputDir, { recursive: true });

  if (state !== "published") {
    const leftovers = (await readdir(outputDir)).filter((n) => !n.startsWith("."));
    await writeManifest(manifestPath, state, []);
    console.log(
      `drive-gallery:build — publication is "${state}". ` +
        "No network request made; manifest is empty.",
    );
    if (leftovers.length > 0) {
      console.error(
        `drive-gallery:build — ${leftovers.length} stale file(s) in ` +
          `${path.relative(root, outputDir)} while unpublished.`,
      );
      process.exit(1);
    }
    return;
  }

  let entries = publishableSource(driveGallerySource);
  if (only) entries = entries.filter((entry) => only.has(entry.id));
  console.log(
    `drive-gallery:build — publication is "published". ` +
      `${entries.length} entr${entries.length === 1 ? "y" : "ies"} to ingest ` +
      `(${driveGallerySource.length} registered).`,
  );

  const existing = new Set(await readdir(outputDir));
  const partial = entries.filter((e) => classifyOutputs(e, existing) === "partial");
  if (partial.length > 0) {
    console.error("drive-gallery:build — partial output for:");
    for (const e of partial) console.error(`  - ${e.id}`);
    process.exit(1);
  }

  const tmpDir = path.join(root, "node_modules/.cache/drive-gallery");
  await mkdir(tmpDir, { recursive: true });

  const items = [];
  for (const entry of entries) {
    if (classifyOutputs(entry, existing) === "skip") {
      console.log(`  = ${entry.id} (derivatives already built)`);
      items.push(await manifestFromExisting(entry, outputDir));
      continue;
    }
    const started = Date.now();
    const { bytes, contentType, usedConfirm } = await downloadDriveFile(
      entry.fileId,
      entry.kind,
    );
    const item =
      entry.kind === "photo"
        ? await sanitizePhoto(entry, bytes, outputDir)
        : await sanitizeVideo(entry, bytes, outputDir, tmpDir);
    items.push(item);
    console.log(
      `  + ${entry.id} ${bytes.length}B ${contentType}` +
        `${usedConfirm ? " (confirmed)" : ""} -> ${item.width}x${item.height} ` +
        `in ${Date.now() - started}ms`,
    );
  }

  // Every requested entry must have produced a complete output set.
  const finalNames = new Set(await readdir(outputDir));
  const incomplete = entries.filter((e) => classifyOutputs(e, finalNames) !== "skip");
  if (incomplete.length > 0) {
    console.error("drive-gallery:build — incomplete output for:");
    for (const e of incomplete) console.error(`  - ${e.id}`);
    process.exit(1);
  }
  if (items.length !== entries.length) {
    console.error(
      `drive-gallery:build — built ${items.length} of ${entries.length} entries.`,
    );
    process.exit(1);
  }

  await writeManifest(manifestPath, state, items);
  console.log(`drive-gallery:build — wrote ${items.length} manifest entries.`);
}

async function manifestFromExisting(entry, outputDir) {
  const slug = outputSlug(entry.id);
  if (entry.kind === "photo") {
    const meta = await sharp(
      path.join(outputDir, `${slug}-${PHOTO_WIDTHS[PHOTO_WIDTHS.length - 1]}.jpg`),
    ).metadata();
    return photoManifestEntry(entry, meta.width, meta.height);
  }
  const ffprobe = await ffprobeExe();
  const { stdout } = await run(ffprobe, [
    "-hide_banner", "-loglevel", "error",
    "-show_streams", "-print_format", "json",
    path.join(outputDir, `${slug}.mp4`),
  ]);
  const video = JSON.parse(stdout).streams.find((s) => s.codec_type === "video");
  return videoManifestEntry(entry, video.width, video.height);
}

export async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  await main();
}
