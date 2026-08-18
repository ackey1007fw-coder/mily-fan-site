import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { news } from "../src/data/news.ts";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(
  root,
  "public/media/gallery/mily-b04-01-morning-showroom-ios.mp4",
);
const expectedSha = "a9c0eaf05b6725ef9045f502668655c2a7e5d4107ab9542a9a09c14e1c62720f";

async function ffprobeExe() {
  const mod = await import("ffprobe-static");
  const resolved = mod.default ?? mod;
  return resolved.path ?? resolved;
}

describe("2026-08-18 iOS in-app video compatibility", () => {
  it("uses a new cache-busted media URL", () => {
    const item = news.find((entry) => entry.id === "2026-08-18-morning-update");
    assert.ok(item?.media);
    assert.equal(
      item.media.src,
      "/media/gallery/mily-b04-01-morning-showroom-ios.mp4",
    );
    assert.notEqual(
      item.media.src,
      "/media/gallery/mily-b04-01-morning-showroom.mp4",
    );
    assert.equal(item.media.width, 160);
    assert.equal(item.media.height, 284);
  });

  it("reconstructs an intact H.264 Baseline faststart MP4", async () => {
    await run(process.execPath, ["scripts/build-ios-video.mjs"], { cwd: root });

    assert.equal((await stat(output)).size, 16872);
    const bytes = await readFile(output);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), expectedSha);
    assert.ok(bytes.indexOf(Buffer.from("moov")) < bytes.indexOf(Buffer.from("mdat")));

    const ffprobe = await ffprobeExe();
    const { stdout } = await run(ffprobe, [
      "-v",
      "error",
      "-show_streams",
      "-of",
      "json",
      output,
    ]);
    const info = JSON.parse(stdout);
    const video = info.streams.find((stream) => stream.codec_type === "video");

    assert.ok(video);
    assert.equal(video.codec_name, "h264");
    assert.match(video.profile, /Baseline/);
    assert.equal(video.pix_fmt, "yuv420p");
    assert.equal(video.width, 160);
    assert.equal(video.height, 284);
    assert.equal(video.avg_frame_rate, "15/1");
  });
});
