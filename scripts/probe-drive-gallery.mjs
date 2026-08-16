/** Real-network probe for the Drive gallery ingest.
 *
 * Runs on GitHub Actions (open network) because the agent sandbox cannot reach
 * drive.google.com. Proves, before the ingest is widened to all 56 publishable
 * entries, that:
 *   - an individual public Drive file downloads without a folder listing
 *   - Google's virus-scan interstitial is handled for large files
 *   - sharp strips photo metadata
 *   - ffmpeg produces a faststart H.264 MP4 with no container metadata
 *
 * Probes the smallest and largest entry of each kind: the large video is the
 * real risk, since files over ~100MB always hit the interstitial.
 */
import { mkdtemp, writeFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import sharp from "sharp";
import { downloadDriveFile } from "./drive-gallery-fetch.mjs";
import { driveGallerySource } from "./drive-gallery-source.mjs";

const run = promisify(execFile);

function entry(id) {
  const found = driveGallerySource.find((item) => item.id === id);
  if (!found) throw new Error(`unknown probe entry ${id}`);
  return found;
}

/** smallest photo, largest publishable photo, smallest video, largest video */
const TARGETS = [
  { ...entry("mily-drive-b02-p46"), note: "smallest photo (~1.4MB)" },
  { ...entry("mily-drive-b02-p02"), note: "large photo (~7.5MB)" },
  { ...entry("mily-drive-b02-v06"), note: "small video (~0.96MB)" },
  { ...entry("mily-drive-b02-v01"), note: "largest video (~146MB, interstitial risk)" },
];

async function ffmpegExe() {
  const mod = await import("ffmpeg-static");
  const exe = mod.default ?? mod;
  if (typeof exe !== "string") throw new Error("ffmpeg-static did not resolve to a path");
  return exe;
}

async function ffprobeExe() {
  const mod = await import("ffprobe-static");
  const resolved = mod.default ?? mod;
  return resolved.path ?? resolved;
}

async function probePhoto(item, bytes, dir) {
  const out = path.join(dir, `${item.id}-960.jpg`);
  await sharp(bytes)
    .rotate()
    .resize({ width: 960, withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toFile(out);

  const meta = await sharp(out).metadata();
  const hasExif = Boolean(meta.exif);
  const hasIptc = Boolean(meta.iptc);
  const hasXmp = Boolean(meta.xmp);
  const size = (await stat(out)).size;
  console.log(
    `    derivative ${meta.width}x${meta.height} ${size} bytes ` +
      `exif=${hasExif} iptc=${hasIptc} xmp=${hasXmp}`,
  );
  if (hasExif || hasIptc || hasXmp) {
    throw new Error(`${item.id}: metadata survived sanitize`);
  }
  return { width: meta.width, height: meta.height, size };
}

async function probeVideo(item, bytes, dir) {
  const src = path.join(dir, `${item.id}.src`);
  await writeFile(src, bytes);
  const out = path.join(dir, `${item.id}.mp4`);
  const poster = path.join(dir, `${item.id}.jpg`);
  const ffmpeg = await ffmpegExe();
  const ffprobe = await ffprobeExe();

  await run(ffmpeg, [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", src,
    "-map_metadata", "-1",
    "-map_chapters", "-1",
    "-c:v", "libx264", "-profile:v", "high", "-crf", "24", "-preset", "medium",
    "-pix_fmt", "yuv420p",
    "-vf", "scale='min(720,iw)':-2",
    "-c:a", "aac", "-b:a", "128k",
    "-movflags", "+faststart",
    out,
  ]);

  // Poster comes from a real frame of the video, never generated.
  await run(ffmpeg, [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", out, "-frames:v", "1", "-q:v", "4", poster,
  ]);

  const { stdout } = await run(ffprobe, [
    "-hide_banner", "-loglevel", "error",
    "-show_format", "-show_streams", "-print_format", "json", out,
  ]);
  const info = JSON.parse(stdout);
  const video = info.streams.find((s) => s.codec_type === "video");
  const audio = info.streams.find((s) => s.codec_type === "audio");
  const tags = Object.keys(info.format.tags ?? {}).filter(
    (k) => k.toLowerCase() !== "major_brand" && k.toLowerCase() !== "minor_version" && k.toLowerCase() !== "compatible_brands" && k.toLowerCase() !== "encoder",
  );
  const size = (await stat(out)).size;
  const posterSize = (await stat(poster)).size;
  console.log(
    `    mp4 ${video.codec_name} ${video.width}x${video.height} ` +
      `audio=${audio ? audio.codec_name : "none"} ${size} bytes ` +
      `poster=${posterSize} bytes leftoverTags=${JSON.stringify(tags)}`,
  );
  if (video.codec_name !== "h264") throw new Error(`${item.id}: not H.264`);
  if (audio && audio.codec_name !== "aac") throw new Error(`${item.id}: audio not AAC`);
  if (tags.length > 0) throw new Error(`${item.id}: container metadata survived`);
  return { width: video.width, height: video.height, size, posterSize };
}

async function main() {
  const dir = await mkdtemp(path.join(tmpdir(), "drive-probe-"));
  let failures = 0;
  try {
    for (const item of TARGETS) {
      console.log(`\n== ${item.id} — ${item.note}`);
      const started = Date.now();
      try {
        const { bytes, contentType, usedConfirm } = await downloadDriveFile(
          item.fileId,
          item.kind,
        );
        console.log(
          `    downloaded ${bytes.length} bytes as ${contentType} ` +
            `interstitial=${usedConfirm} in ${Date.now() - started}ms`,
        );
        if (item.kind === "photo") await probePhoto(item, bytes, dir);
        else await probeVideo(item, bytes, dir);
        console.log("    OK");
      } catch (error) {
        failures += 1;
        console.error(`    FAILED: ${error.message}`);
      }
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }

  console.log(`\nprobe-drive-gallery: ${TARGETS.length - failures}/${TARGETS.length} passed`);
  if (failures > 0) process.exit(1);
}

await main();
