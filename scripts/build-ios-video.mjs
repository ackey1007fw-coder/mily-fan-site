import { execFile } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mediaDir = path.join(root, "public/media/gallery");
const source = path.join(mediaDir, "mily-b04-01-morning-showroom.mp4");
const output = path.join(mediaDir, "mily-b04-01-morning-showroom-ios.mp4");

async function ffmpegExe() {
  const mod = await import("ffmpeg-static");
  const exe = mod.default ?? mod;
  if (typeof exe !== "string") {
    throw new Error("ffmpeg-static did not resolve to an executable path");
  }
  return exe;
}

await mkdir(mediaDir, { recursive: true });
const ffmpeg = await ffmpegExe();

// The first 8/18 derivative was intentionally tiny (8 fps, video-only), which
// some iOS in-app browsers reject. Build a compatibility derivative instead:
// H.264 Baseline + yuv420p + a conventional 30 fps timeline + AAC-LC audio.
// A new URL is used so the immutable /media cache cannot retain the old file.
await run(
  ffmpeg,
  [
    "-y",
    "-i",
    source,
    "-f",
    "lavfi",
    "-i",
    "anullsrc=channel_layout=mono:sample_rate=44100",
    "-map",
    "0:v:0",
    "-map",
    "1:a:0",
    "-vf",
    "fps=30",
    "-c:v",
    "libx264",
    "-profile:v",
    "baseline",
    "-level:v",
    "3.0",
    "-pix_fmt",
    "yuv420p",
    "-preset",
    "medium",
    "-crf",
    "27",
    "-c:a",
    "aac",
    "-profile:a",
    "aac_low",
    "-b:a",
    "32k",
    "-ar",
    "44100",
    "-ac",
    "1",
    "-shortest",
    "-map_metadata",
    "-1",
    "-map_chapters",
    "-1",
    "-movflags",
    "+faststart",
    output,
  ],
  { maxBuffer: 16 * 1024 * 1024 },
);

console.log(`Built iOS-compatible video: ${path.relative(root, output)}`);
