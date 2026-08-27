import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { open, readFile, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { campusGirlsPatonVoteLink } from "../src/data/links.ts";
import { patonVoteDay3StoryVideo } from "../src/data/patonVoteDay3StoryVideo.ts";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentPath = path.join(root, "src/components/PatonVoteGuide.tsx");
const mp4 = path.join(root, "public", patonVoteDay3StoryVideo.src.slice(1));
const poster = path.join(root, "public", patonVoteDay3StoryVideo.poster.slice(1));

const VIDEO_BYTES = 86_843;
const VIDEO_SHA256 =
  "d808b91f9b59a2cab14beae1d797a0bb99ec6a84c82a09ec6f7b4fadc5102e19";
const POSTER_BYTES = 31_464;
const POSTER_SHA256 =
  "f6771c8ec93470d4c3036b77e66472d01151a91f421f9816642c159fa1802e38";
const PATON_URL = "https://paton.jp/event/entrant/11380";

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

async function ffprobeExe() {
  const mod = await import("ffprobe-static");
  const resolved = mod.default ?? mod;
  return resolved.path ?? resolved;
}

async function probe(file) {
  const ffprobe = await ffprobeExe();
  const { stdout } = await run(ffprobe, [
    "-hide_banner",
    "-v",
    "error",
    "-show_format",
    "-show_streams",
    "-show_chapters",
    "-print_format",
    "json",
    file,
  ]);
  return JSON.parse(stdout);
}

async function hasFaststart(file) {
  const handle = await open(file, "r");
  try {
    const head = Buffer.alloc(64 * 1024);
    const { bytesRead } = await handle.read(head, 0, head.length, 0);
    const window = head.subarray(0, bytesRead);
    const moov = window.indexOf("moov", 0, "latin1");
    const mdat = window.indexOf("mdat", 0, "latin1");
    return moov >= 0 && mdat >= 0 && moov < mdat;
  } finally {
    await handle.close();
  }
}

describe("2026-08-28 Paton投票3日目 Instagram Story — manifest and guide", () => {
  it("keeps the confirmed Story metadata and direct Paton destination", () => {
    assert.equal(patonVoteDay3StoryVideo.id, "mily-b39-01-paton-vote-day-3-story");
    assert.equal(patonVoteDay3StoryVideo.kind, "video");
    assert.equal(patonVoteDay3StoryVideo.sourceDate, "2026-08-28");
    assert.equal(patonVoteDay3StoryVideo.sourceLabel, "Instagram Story");
    assert.equal(patonVoteDay3StoryVideo.provenance, "owner-provided");
    assert.equal(patonVoteDay3StoryVideo.published, true);
    assert.equal(patonVoteDay3StoryVideo.width, 512);
    assert.equal(patonVoteDay3StoryVideo.height, 910);
    assert.equal("sourceUrl" in patonVoteDay3StoryVideo, false);
    assert.equal(campusGirlsPatonVoteLink.url, PATON_URL);
    assert.match(patonVoteDay3StoryVideo.alt, /パトン投票3日目はここから/);
  });

  it("shows the Story in the active vote guide and keeps the direct CTA", async () => {
    const source = await readFile(componentPath, "utf8");

    assert.match(source, /patonVoteDay3StoryVideo/);
    assert.match(source, /8\/28のInstagram Story/);
    assert.match(source, /パトン投票3日目はここから❣️/);
    assert.match(source, /Story内のリンクはサイト上では押せないため/);
    assert.match(source, /campusGirlsPatonVoteLink\.url/);
    assert.match(source, /controls/);
    assert.match(source, /playsInline/);
    assert.match(source, /preload="none"/);
    assert.match(source, /poster=\{patonVoteDay3StoryVideo\.poster\}/);
    assert.match(source, /src=\{patonVoteDay3StoryVideo\.src\}/);
    assert.doesNotMatch(source, /autoPlay|autoplay|\bloop\b/);
  });
});

describe("2026-08-28 Paton投票3日目 Instagram Story — public media", () => {
  it("publishes exactly the verified MP4 and poster bytes", async () => {
    assert.equal((await stat(mp4)).size, VIDEO_BYTES);
    assert.equal(await sha256(mp4), VIDEO_SHA256);
    assert.equal((await stat(poster)).size, POSTER_BYTES);
    assert.equal(await sha256(poster), POSTER_SHA256);
  });

  it("keeps the full vertical video while removing unconfirmed audio and source metadata", async () => {
    const info = await probe(mp4);
    const video = info.streams.find((stream) => stream.codec_type === "video");
    const audio = info.streams.find((stream) => stream.codec_type === "audio");

    assert.ok(video);
    assert.equal(video.codec_name, "h264");
    assert.match(video.profile, /Baseline/);
    assert.equal(video.has_b_frames, 0);
    assert.equal(video.pix_fmt, "yuv420p");
    assert.equal(video.width, 512);
    assert.equal(video.height, 910);
    assert.equal(video.avg_frame_rate, "30/1");
    assert.equal(video.nb_frames, "600");
    assert.ok(Math.abs(Number(info.format.duration) - 20) < 0.001);
    assert.equal(audio, undefined);
    assert.equal(await hasFaststart(mp4), true);
    assert.equal("creation_time" in (info.format.tags ?? {}), false);
    assert.deepEqual(info.chapters, []);

    for (const stream of info.streams) {
      assert.equal("creation_time" in (stream.tags ?? {}), false);
      assert.notEqual(stream.tags?.handler_name, "Core Media Video");
      assert.notEqual(stream.tags?.handler_name, "Core Media Audio");
    }
  });

  it("uses a metadata-free vertical poster", async () => {
    const metadata = await sharp(poster).metadata();

    assert.equal(metadata.width, 512);
    assert.equal(metadata.height, 910);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);
  });
});

describe("2026-08-28 Paton投票3日目 Instagram Story — scope and cleanup", () => {
  it("does not duplicate the guide-only Story into NEWS, Gallery, STORY, or schedules", async () => {
    const forbiddenFiles = [
      "src/data/news.ts",
      "src/data/galleryVideos.ts",
      "src/data/stories.ts",
      "src/data/highlights.ts",
      "src/data/events.ts",
      "src/data/streamSchedule.ts",
      "src/data/media.ts",
    ];

    for (const relative of forbiddenFiles) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(patonVoteDay3StoryVideo.id), false, relative);
      assert.equal(source.includes("patonVoteDay3StoryVideo"), false, relative);
    }
  });

  it("leaves no transfer chunks, temporary workflow, or tracked original", async () => {
    assert.equal(existsSync(path.join(root, ".tmp/b39")), false);
    assert.equal(
      existsSync(path.join(root, ".github/workflows/materialize-b39-media.yml")),
      false,
    );
    assert.equal(
      existsSync(
        path.join(root, "media/original/mily-b39-01-paton-vote-day-3-story.mp4"),
      ),
      false,
    );

    const { stdout } = await run("git", ["ls-files"], { cwd: root });
    assert.equal(stdout.includes(".tmp/b39"), false);
    assert.equal(stdout.includes("materialize-b39-media.yml"), false);
    assert.equal(stdout.includes("media/original/mily-b39"), false);
  });
});
