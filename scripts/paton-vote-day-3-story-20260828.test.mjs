import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "src/data/patonVoteDay3StoryVideo.json");
const componentPath = join(root, "src/components/PatonVoteGuide.tsx");
const videoPath = join(
  root,
  "public/media/gallery/mily-b39-01-paton-vote-day-3-story.mp4",
);
const posterPath = join(
  root,
  "public/media/gallery/mily-b39-01-paton-vote-day-3-story-poster.jpg",
);
const docsPath = join(root, "docs/MEDIA-B39-PATON-VOTE-DAY-3-STORY.md");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const componentSource = readFileSync(componentPath, "utf8");
const batchId = "mily-b39-01-paton-vote-day-3-story";

const sha256 = (path) =>
  createHash("sha256").update(readFileSync(path)).digest("hex");

const ffprobeJson = (path) => {
  const result = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_streams",
      "-show_format",
      "-show_chapters",
      "-of",
      "json",
      path,
    ],
    { encoding: "utf8" },
  );

  assert.equal(
    result.status,
    0,
    `ffprobe failed for ${path}: ${result.stderr || "unknown error"}`,
  );
  return JSON.parse(result.stdout);
};

test("b39 manifest keeps the owner-provided Story metadata stable", () => {
  assert.deepEqual(manifest, {
    id: batchId,
    kind: "video",
    alt: "フィルターを使ったみりぃが「パトン投票3日目はここから」と案内するInstagram Story動画",
    src: `/media/gallery/${batchId}.mp4`,
    poster: `/media/gallery/${batchId}-poster.jpg`,
    width: 512,
    height: 910,
    provenance: "owner-provided",
    sourceLabel: "Instagram Story",
    sourceDate: "2026-08-28",
    published: true,
  });
  assert.equal(Object.hasOwn(manifest, "sourceUrl"), false);
});

test("PatonVoteGuide embeds the Story with an accessible manual player", () => {
  assert.match(
    componentSource,
    /import\s+\{\s*patonVoteDay3StoryVideo\s*\}\s+from\s+["']\.\.\/data\/patonVoteDay3StoryVideo\.ts["']/,
  );
  assert.match(componentSource, /<video[\s\S]*?controls[\s\S]*?playsInline/);
  assert.match(componentSource, /preload="none"/);
  assert.match(componentSource, /poster=\{patonVoteDay3StoryVideo\.poster\}/);
  assert.match(componentSource, /src=\{patonVoteDay3StoryVideo\.src\}/);
  assert.match(componentSource, /type="video\/mp4"/);
  assert.match(componentSource, /8\/28のInstagram Story/);
  assert.match(componentSource, /パトン投票3日目はここから❣️/);
  assert.match(
    componentSource,
    /Story内のリンクはサイト上では押せないため、下の投票ボタンから直接みりぃのページへ進めます。/,
  );
  assert.doesNotMatch(componentSource, /autoPlay/);
  assert.doesNotMatch(componentSource, /\bloop\b/);
});

test("b39 is not duplicated into NEWS, Gallery, Story, Highlight, or schedule data", () => {
  const candidates = [
    "src/data/news.ts",
    "src/data/galleryVideos.ts",
    "src/data/stories.ts",
    "src/data/highlights.ts",
    "src/data/events.ts",
    "src/data/streamSchedule.ts",
    "src/data/media.ts",
  ];

  for (const relativePath of candidates) {
    const path = join(root, relativePath);
    if (!existsSync(path)) continue;
    assert.doesNotMatch(
      readFileSync(path, "utf8"),
      new RegExp(batchId),
      `${relativePath} must not duplicate the Paton guide media`,
    );
  }
});

test("the public video is the validated 20-second silent mobile derivative", () => {
  assert.equal(existsSync(videoPath), true);
  assert.equal(statSync(videoPath).size, 86_843);
  assert.equal(
    sha256(videoPath),
    "947eb0d8ae47eb14342239ebd1b5df325fb878a10c6587e0a284e40a2ac04313",
  );

  const probe = ffprobeJson(videoPath);
  const videoStreams = probe.streams.filter((stream) => stream.codec_type === "video");
  const audioStreams = probe.streams.filter((stream) => stream.codec_type === "audio");

  assert.equal(videoStreams.length, 1);
  assert.equal(audioStreams.length, 0);
  assert.equal(videoStreams[0].codec_name, "h264");
  assert.equal(videoStreams[0].profile, "Constrained Baseline");
  assert.equal(videoStreams[0].width, 512);
  assert.equal(videoStreams[0].height, 910);
  assert.equal(videoStreams[0].pix_fmt, "yuv420p");
  assert.equal(videoStreams[0].r_frame_rate, "30/1");
  assert.equal(videoStreams[0].nb_frames, "600");
  assert.equal(videoStreams[0].has_b_frames, 0);
  assert.equal(Number(probe.format.duration), 20);
  assert.deepEqual(probe.chapters, []);

  const bytes = readFileSync(videoPath);
  const moov = bytes.indexOf(Buffer.from("moov"));
  const mdat = bytes.indexOf(Buffer.from("mdat"));
  assert.ok(moov >= 0 && mdat >= 0 && moov < mdat, "MP4 must be faststart");
  assert.equal(bytes.includes(Buffer.from("creation_time")), false);
});

test("the poster is the validated metadata-clean real-frame JPEG", () => {
  assert.equal(existsSync(posterPath), true);
  assert.equal(statSync(posterPath).size, 31_531);
  assert.equal(
    sha256(posterPath),
    "bf182e028c3205f78675751970f65c686fc3281012fc2cac0d857cdc01349304",
  );

  const probe = ffprobeJson(posterPath);
  const stream = probe.streams.find((candidate) => candidate.codec_type === "video");
  assert.ok(stream);
  assert.equal(stream.codec_name, "mjpeg");
  assert.equal(stream.width, 512);
  assert.equal(stream.height, 910);

  const bytes = readFileSync(posterPath);
  assert.equal(bytes.includes(Buffer.from("Exif\0\0")), false);
  assert.equal(bytes.includes(Buffer.from("Comment")), false);
});

test("the media operations record fixes placement, privacy, and integrity", () => {
  const docs = readFileSync(docsPath, "utf8");
  assert.match(docs, /batch b39/);
  assert.match(docs, /HOME \/ Support/);
  assert.match(docs, /NEWS、Gallery動画一覧/);
  assert.match(docs, /音声と受け渡し時メタデータを除去/);
  assert.match(docs, /Story内のリンクスタンプは自己ホスト後に押せない/);
  assert.match(docs, /947eb0d8ae47eb14342239ebd1b5df325fb878a10c6587e0a284e40a2ac04313/);
  assert.match(docs, /bf182e028c3205f78675751970f65c686fc3281012fc2cac0d857cdc01349304/);
});
