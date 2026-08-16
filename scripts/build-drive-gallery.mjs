/**
 * Turns owner-provided batch b02 originals into sanitized static assets.
 *
 *   media/drive-b02-original/   gitignored local input (never committed)
 *        -> sanitize            sharp / ffmpeg, all metadata dropped
 *        -> public/media/drive-gallery/
 *        -> src/data/driveGalleryManifest.json   (what the client renders)
 *
 * There is no network access and no Drive identifier anywhere in this
 * repository. The browser never talks to Google, and neither does the build:
 * the receiving Drive folder is Restricted, so the identifiers in this branch's
 * earlier commits no longer resolve. Originals are carried to the machine
 * running this script by hand.
 *
 * Gate behaviour:
 * - publication "review"    -> reads nothing, writes an empty manifest
 * - publication "published" -> sanitizes contentVerified + approved entries only
 *
 * Fail closed. A missing input, an unreadable file, a metadata leak or a
 * partial output set stops the run with a non-zero exit.
 *
 * Run deliberately (`pnpm drive-gallery:build`), not from `pnpm build`:
 * derivatives are committed like public/media/gallery, so deploys stay
 * reproducible and need neither the originals nor ffmpeg.
 */
import { mkdir, readdir, readFile, writeFile, access, open } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import sharp from "sharp";
import {
  driveGalleryPublication,
  driveGallerySource,
  outputSlug,
  publishableSource,
} from "./drive-gallery-source.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const INPUT_DIR = path.join(root, "media/drive-b02-original");
export const OUTPUT_DIR = path.join(root, "public/media/drive-gallery");
export const MANIFEST_PATH = path.join(root, "src/data/driveGalleryManifest.json");
export const PUBLIC_PREFIX = "/media/drive-gallery";
export const PHOTO_WIDTHS = [480, 960, 1600];
/** Portrait clips stay at most 720 wide; never upscale. */
export const VIDEO_MAX_WIDTH = 720;
/** Optional gitignored map of entry id -> original file name. */
export const SOURCE_MAP_NAME = "sources.json";

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

/**
 * Resolve an entry to a local input file, either through the private
 * `sources.json` map or by its slug. Never reads anything outside the input
 * directory, and never records the resolved name anywhere public.
 */
export function resolveInputName(entry, availableNames, sourceMap) {
  const mapped = sourceMap?.[entry.id];
  if (mapped) {
    if (path.basename(mapped) !== mapped) {
      throw new Error(`${entry.id}: sources.json entry must be a bare file name`);
    }
    if (!availableNames.includes(mapped)) {
      throw new Error(`${entry.id}: sources.json points at a missing file`);
    }
    return mapped;
  }
  const slug = outputSlug(entry.id);
  const matches = availableNames.filter((name) => path.parse(name).name === slug);
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    throw new Error(`${entry.id}: ${matches.length} input files match "${slug}"`);
  }
  return null;
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


/* ------------------------------------------------------------------ *
 * Derivative contract
 *
 * The same two validators run in both directions: right after a fresh
 * sanitize, and again before an already-built derivative set is reused on an
 * incremental run. A file that was sanitized once is never trusted on that
 * basis alone — if it is swapped out later, the reuse path rejects it exactly
 * as the first pass would have.
 * ------------------------------------------------------------------ */

/**
 * Validate a complete photo derivative set and read its real dimensions.
 * @returns {Promise<{width: number, height: number}>}
 */
export async function validatePhotoDerivatives(entry, outputDir) {
  const slug = outputSlug(entry.id);
  const measured = new Map();

  for (const width of PHOTO_WIDTHS) {
    for (const format of ["jpg", "webp"]) {
      const name = `${slug}-${width}.${format}`;
      const file = path.join(outputDir, name);
      if (!(await exists(file))) {
        throw new Error(`${entry.id}: missing derivative ${name}`);
      }

      let meta;
      try {
        meta = await sharp(file).metadata();
      } catch (error) {
        throw new Error(`${entry.id}: ${name} does not decode (${error.message})`);
      }
      if (!meta.width || !meta.height) {
        throw new Error(`${entry.id}: ${name} has no readable dimensions`);
      }
      if (meta.exif || meta.iptc || meta.xmp) {
        throw new Error(`${entry.id}: ${name} carries EXIF/IPTC/XMP metadata`);
      }
      if (meta.width > width) {
        throw new Error(
          `${entry.id}: ${name} is ${meta.width}px wide, wider than its ${width}px slot`,
        );
      }
      measured.set(name, { width: meta.width, height: meta.height });
    }
  }

  // withoutEnlargement means every derivative is min(slot, original). Anything
  // else is an upscaled or mismatched file that did not come from this pipeline.
  const cap = Math.max(...[...measured.values()].map((m) => m.width));
  for (const width of PHOTO_WIDTHS) {
    const expected = Math.min(width, cap);
    for (const format of ["jpg", "webp"]) {
      const name = `${slug}-${width}.${format}`;
      const actual = measured.get(name);
      if (actual.width !== expected) {
        throw new Error(
          `${entry.id}: ${name} is ${actual.width}px wide, expected ${expected}px ` +
            "(upscaled or inconsistent derivative)",
        );
      }
    }
    const jpg = measured.get(`${slug}-${width}.jpg`);
    const webp = measured.get(`${slug}-${width}.webp`);
    if (jpg.width !== webp.width || jpg.height !== webp.height) {
      throw new Error(`${entry.id}: jpg and webp disagree at ${width}px`);
    }
  }

  const largestName = `${slug}-${PHOTO_WIDTHS[PHOTO_WIDTHS.length - 1]}.jpg`;
  return measured.get(largestName);
}

/**
 * Validate a complete video derivative set and read its real dimensions.
 * @returns {Promise<{width: number, height: number}>}
 */
export async function validateVideoDerivatives(entry, outputDir) {
  const slug = outputSlug(entry.id);
  const mp4 = path.join(outputDir, `${slug}.mp4`);
  const poster = path.join(outputDir, `${slug}-poster.jpg`);

  for (const [name, file] of [[`${slug}.mp4`, mp4], [`${slug}-poster.jpg`, poster]]) {
    if (!(await exists(file))) {
      throw new Error(`${entry.id}: missing derivative ${name}`);
    }
  }

  const ffprobe = await ffprobeExe();
  let info;
  try {
    const { stdout } = await run(ffprobe, [
      "-hide_banner", "-loglevel", "error",
      "-show_format", "-show_streams", "-print_format", "json", mp4,
    ]);
    info = JSON.parse(stdout);
  } catch (error) {
    throw new Error(`${entry.id}: ${slug}.mp4 does not probe (${error.message})`);
  }

  const video = info.streams?.find((s) => s.codec_type === "video");
  const audio = info.streams?.find((s) => s.codec_type === "audio");
  if (!video) throw new Error(`${entry.id}: no video stream in ${slug}.mp4`);
  if (video.codec_name !== "h264") {
    throw new Error(`${entry.id}: ${slug}.mp4 is ${video.codec_name}, not H.264`);
  }
  if (audio && audio.codec_name !== "aac") {
    throw new Error(`${entry.id}: ${slug}.mp4 audio is ${audio.codec_name}, not AAC`);
  }
  const stray = leftoverTags(info.format?.tags);
  if (stray.length > 0) {
    throw new Error(`${entry.id}: ${slug}.mp4 carries metadata ${stray.join(", ")}`);
  }
  if (!video.width || video.width > VIDEO_MAX_WIDTH) {
    throw new Error(
      `${entry.id}: ${slug}.mp4 is ${video.width}px wide, over the ${VIDEO_MAX_WIDTH}px cap`,
    );
  }
  if (!(await isFaststart(mp4))) {
    throw new Error(`${entry.id}: ${slug}.mp4 is not faststart (moov after mdat)`);
  }

  let posterMeta;
  try {
    posterMeta = await sharp(poster).metadata();
  } catch (error) {
    throw new Error(`${entry.id}: poster does not decode (${error.message})`);
  }
  if (!posterMeta.width) throw new Error(`${entry.id}: poster has no readable dimensions`);
  if (posterMeta.exif || posterMeta.iptc || posterMeta.xmp) {
    throw new Error(`${entry.id}: poster carries EXIF/IPTC/XMP metadata`);
  }

  return { width: video.width, height: video.height };
}

/** Sharp drops EXIF / GPS / IPTC / XMP unless withMetadata() is called.
 *  This never calls it, and validates the result against the shared contract. */
export async function sanitizePhoto(entry, bytes, outputDir) {
  const slug = outputSlug(entry.id);

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
      await encoded.toFile(out);
    }
  }

  const { width, height } = await validatePhotoDerivatives(entry, outputDir);
  return photoManifestEntry(entry, width, height);
}

export async function sanitizeVideo(entry, inputPath, outputDir) {
  const slug = outputSlug(entry.id);
  const mp4 = path.join(outputDir, `${slug}.mp4`);
  const poster = path.join(outputDir, `${slug}-poster.jpg`);
  const ffmpeg = await ffmpegExe();

  await run(
    ffmpeg,
    [
      "-hide_banner", "-loglevel", "error", "-y",
      "-i", inputPath,
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

  const { width, height } = await validateVideoDerivatives(entry, outputDir);
  return videoManifestEntry(entry, width, height);
}

/** True when the MP4 moov atom precedes mdat, i.e. it can start streaming.
 *  Only the head of the file is read; mdat may be far larger than memory. */
export async function isFaststart(mp4Path) {
  const handle = await open(mp4Path, "r");
  try {
    const head = Buffer.alloc(64 * 1024);
    const { bytesRead } = await handle.read(head, 0, head.length, 0);
    const window = head.subarray(0, bytesRead);
    const moov = window.indexOf("moov", 0, "latin1");
    const mdat = window.indexOf("mdat", 0, "latin1");
    return moov !== -1 && (mdat === -1 || moov < mdat);
  } finally {
    await handle.close();
  }
}

async function readSourceMap(inputDir) {
  try {
    const raw = await readFile(path.join(inputDir, SOURCE_MAP_NAME), "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw new Error(`${SOURCE_MAP_NAME} is not readable JSON: ${error.message}`);
  }
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

function config() {
  const only = process.env.DRIVE_GALLERY_ONLY;
  return {
    state: process.env.DRIVE_GALLERY_STATE ?? driveGalleryPublication.state,
    inputDir: process.env.DRIVE_GALLERY_INPUT_DIR
      ? path.resolve(process.env.DRIVE_GALLERY_INPUT_DIR)
      : INPUT_DIR,
    outputDir: process.env.DRIVE_GALLERY_OUTPUT_DIR
      ? path.resolve(process.env.DRIVE_GALLERY_OUTPUT_DIR)
      : OUTPUT_DIR,
    manifestPath: process.env.DRIVE_GALLERY_MANIFEST
      ? path.resolve(process.env.DRIVE_GALLERY_MANIFEST)
      : MANIFEST_PATH,
    only: only ? new Set(only.split(",").map((s) => s.trim())) : null,
  };
}

async function main() {
  const { state, inputDir, outputDir, manifestPath, only } = config();
  await mkdir(outputDir, { recursive: true });

  if (state !== "published") {
    const leftovers = (await readdir(outputDir)).filter((n) => !n.startsWith("."));
    await writeManifest(manifestPath, state, []);
    console.log(
      `drive-gallery:build — publication is "${state}". ` +
        "No original was read; manifest is empty.",
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

  const available = (await readdir(inputDir)).filter(
    (name) => !name.startsWith(".") && name !== "README.md" && name !== SOURCE_MAP_NAME,
  );
  const sourceMap = await readSourceMap(inputDir);
  console.log(
    `drive-gallery:build — publication is "published". ` +
      `${entries.length} entr${entries.length === 1 ? "y" : "ies"} to sanitize ` +
      `from ${path.relative(root, inputDir)} (${available.length} input files).`,
  );

  const existing = new Set(await readdir(outputDir));
  const partial = entries.filter((e) => classifyOutputs(e, existing) === "partial");
  if (partial.length > 0) {
    console.error("drive-gallery:build — partial output for:");
    for (const e of partial) console.error(`  - ${e.id}`);
    process.exit(1);
  }

  // Resolve every input before writing anything, so a missing original fails
  // the run instead of producing a half-built gallery.
  const resolved = [];
  const missing = [];
  for (const entry of entries) {
    if (classifyOutputs(entry, existing) === "skip") {
      resolved.push({ entry, inputName: null });
      continue;
    }
    const inputName = resolveInputName(entry, available, sourceMap);
    if (!inputName) missing.push(entry.id);
    else resolved.push({ entry, inputName });
  }
  if (missing.length > 0) {
    console.error(
      `drive-gallery:build — no input found for ${missing.length} entr` +
        `${missing.length === 1 ? "y" : "ies"} in ${path.relative(root, inputDir)}:`,
    );
    for (const id of missing) console.error(`  - ${id}`);
    console.error("See media/drive-b02-original/README.md for the naming rules.");
    process.exit(1);
  }

  const items = [];
  for (const { entry, inputName } of resolved) {
    if (!inputName) {
      console.log(`  = ${entry.id} (derivatives already built)`);
      items.push(await manifestFromExisting(entry, outputDir));
      continue;
    }
    const started = Date.now();
    const inputPath = path.join(inputDir, inputName);
    const item =
      entry.kind === "photo"
        ? await sanitizePhoto(entry, await readFile(inputPath), outputDir)
        : await sanitizeVideo(entry, inputPath, outputDir);
    items.push(item);
    // The original file name is never logged: it is private operations data.
    console.log(
      `  + ${entry.id} -> ${item.width}x${item.height} in ${Date.now() - started}ms`,
    );
  }

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

/** Reuse an already-built derivative set — but only after it passes the same
 *  contract a freshly sanitized set must pass. Being on disk is not evidence. */
export async function manifestFromExisting(entry, outputDir) {
  if (entry.kind === "photo") {
    const { width, height } = await validatePhotoDerivatives(entry, outputDir);
    return photoManifestEntry(entry, width, height);
  }
  const { width, height } = await validateVideoDerivatives(entry, outputDir);
  return videoManifestEntry(entry, width, height);
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
