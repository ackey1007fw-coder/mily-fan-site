import "./fixtures/as-of-20260922.mjs";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { open, readFile, readdir, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import {
  driveGallerySections,
  driveVideoView,
  visibleDriveGallery,
} from "../src/data/driveGallery.ts";
import { events } from "../src/data/events.ts";
import { amiMilyKoreaPromise } from "../src/data/challengeConnection.ts";
import {
  campusGirlsPatonFifteenXStoryVideo,
  coldUmbrellaStoryVideo,
  galleryVideos,
  streamThanksMorningSlotStoryVideo,
  tiktokAmiMeetStoryVideo,
  tiktokAmiMeetVideo,
  tiktokAmiTokyoVideo,
  tiktokAmiTwinCoordVideo,
  tiktokKossoriVideo,
  visibleGalleryVideos,
} from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { socials } from "../src/data/socials.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { selectGalleryEntries } from "../src/lib/galleryItems.ts";
import { resolveNewsLinks } from "../src/lib/newsLinks.ts";
import { isFaststart, validateVideoDerivatives } from "./build-drive-gallery.mjs";
import { verifyNews } from "./content-invariants.mjs";
import {
  DRIVE_HOST_PATTERN,
  findDriveIds,
  isProbablyBinary,
} from "./scan-tracked-text.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDirectory = path.join(root, "public/media/gallery");
const SEASIDE = "https://www.tiktok.com/@seasidecircle";
const MEET_SOURCE = "https://www.tiktok.com/@seasidecircle/video/7688281091748220180";
const TWIN_SOURCE = "https://www.tiktok.com/@amis2_m.h/video/7688279563113073938";
const MEET_X_SOURCE = "https://x.com/Mily_chan36/status/2102326348996137262";
const TWIN_X_SOURCE = "https://x.com/Mily_chan36/status/2102327155162267936";
const AMI_CTAS = [
  {
    label: amiMilyKoreaPromise.amiEntry.label,
    url: amiMilyKoreaPromise.amiEntry.url,
  },
  {
    label: amiMilyKoreaPromise.amiX.label,
    url: amiMilyKoreaPromise.amiX.url,
  },
  {
    label: amiMilyKoreaPromise.amiTikTok.label,
    url: amiMilyKoreaPromise.amiTikTok.url,
  },
];
const SOURCE_METADATA_FILE_PATTERN =
  /(?:https?:\/\/|drive\.(?:google|usercontent\.google)\.com|media[\\/]original[\\/]|\.(?:mp4|mov|m4v|zip)\b)/i;
const PRIVATE_HANDOFF_KEY_PATTERN =
  /^(?:handoff(?:Url|Id)?|driveFileId|original(?:File)?Name|sourceFileName)$/i;

const clips = [
  {
    newsId: "2026-09-22-tiktok-ami-meet",
    mediaId: "mily-b141-01-tiktok-ami-meet",
    item: tiktokAmiMeetVideo,
    slug: "mily-b141-01-tiktok-ami-meet",
    originalParts: ["oolvyAvbkUQjPEEqas", "FfBBg9KQaTL0IfRBDtEp.mp4"],
    originalBytes: 1_366_319,
    originalSha: "f0719ac66356de0d4dee7eb9d162973bdd7758e9459da70cdb6b5e75fdb64663",
    publicBytes: 2_217_117,
    publicSha: "9dd8d5dde66ecce46054b7e4320fb2bc442f9668f3703506e2e14dfbd6097cf9",
    posterBytes: 39_399,
    posterSha: "ee03d37be36cea61b323bddda1ca72e5d87568b1627d0c76acc3dae016316779",
    posterSeconds: "14.0",
    frames: "451",
    duration: "15.034",
  },
  {
    newsId: "2026-09-22-tiktok-ami-meet-story",
    mediaId: "mily-b141-02-tiktok-ami-meet-story",
    item: tiktokAmiMeetStoryVideo,
    slug: "mily-b141-02-tiktok-ami-meet-story",
    originalParts: ["ocABlAIaVrbiapNBCY", "QCb7q8EPBEyQitpMLJi.mp4"],
    originalBytes: 1_229_820,
    originalSha: "af9bc62dc94e057bf05afc229b809ab1e11d275e34e7ae78a1d1d54898184c05",
    publicBytes: 1_938_036,
    publicSha: "8c38bfda05efa9d33c7c798acece84b07d88893a3afbfec845b440c06f565965",
    posterBytes: 65_138,
    posterSha: "17677cae3d16b7f97568fc8786f035210d9d59ed9983cb1db5316af4e51d94a4",
    posterSeconds: "2.0",
    frames: "350",
    duration: "13.458",
  },
  {
    newsId: "2026-09-22-tiktok-ami-twin-coord",
    mediaId: "mily-b141-03-tiktok-ami-twin-coord",
    item: tiktokAmiTwinCoordVideo,
    slug: "mily-b141-03-tiktok-ami-twin-coord",
    originalParts: ["oI4ZEPcRTEikWODrBC", "gF0sZMIfQ0qAEBeQG4yA.mp4"],
    originalBytes: 2_411_775,
    originalSha: "203490a7c4bbf758a92bce18c2e200c2247525d67ab79637b132b6de00028733",
    publicBytes: 4_594_349,
    publicSha: "032a96bec71fcabdb5e833e9aace343bbabea39921bbf7b7521959d60ce6bcf3",
    posterBytes: 60_249,
    posterSha: "947e61ef4d5c2797d1f9329cb72d75eaeaf57ee0a5485bca65d80bf848dc2af4",
    posterSeconds: "9.0",
    frames: "295",
    duration: "13.424",
  },
];

function newsItem(id) {
  return news.find((entry) => entry.id === id);
}

async function ffprobeExe() {
  const mod = await import("ffprobe-static");
  const resolved = mod.default ?? mod;
  return resolved.path ?? resolved;
}

async function ffmpegExe() {
  const mod = await import("ffmpeg-static");
  return mod.default ?? mod;
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

async function repositoryFiles() {
  const { stdout } = await run(
    "git",
    ["ls-files", "-co", "--exclude-standard"],
    { cwd: root, maxBuffer: 1024 * 1024 * 16 },
  );
  return stdout.split("\n").filter(Boolean);
}

describe("2026-09-22 TikTok ami meet posts — Latest", () => {
  it("adds three dated News items and leads Latest with みりぃ's post", () => {
    const meet = newsItem("2026-09-22-tiktok-ami-meet");
    const story = newsItem("2026-09-22-tiktok-ami-meet-story");
    const twin = newsItem("2026-09-22-tiktok-ami-twin-coord");
    const ordered = sortNewsByDateDesc(news);

    assert.ok(meet && story && twin);
    assert.equal(news[0], meet);
    assert.equal(news[1], story);
    assert.equal(news[2], twin);
    assert.equal(ordered[0], meet);
    assert.equal(ordered[1], story);
    assert.equal(ordered[2], twin);
    assert.equal(ordered[3]?.id, "2026-09-21-agestock-yokohama");
    for (const entry of [meet, story, twin]) {
      assert.equal(entry.date, "2026-09-22");
      assert.equal(entry.sameDayOrder, undefined);
      assert.equal(entry.activityIds, undefined);
      assert.deepEqual(entry.additionalCtas, AMI_CTAS);
      assert.deepEqual(verifyNews([entry]), []);
    }
  });

  it("keeps みりぃ's standing post as the canonical TikTok source", () => {
    const entry = newsItem("2026-09-22-tiktok-ami-meet");
    const now = Date.parse("2026-09-22T19:00:00+09:00");

    assert.equal(entry.title, "「あみちゃんに会ってきたの〜」TikTok");
    assert.equal(
      entry.body,
      "9月22日、ラジオDJネキみりぃのTikTokに、フレキャン2026出場中のあみちゃんに会ったときの動画が投稿されました。屋内の階段前で、黒い水玉のトップスのみりぃと白い水玉のトップスの天宮あみさんが並び、ピンクのハートのフィルターを付けて手を動かしたりポーズを取ったりしている短い縦型動画です。投稿では、終始お話ししすぎて音楽を聞くお店だったのに語りまくったことと、今度はお話しし放題のところで会おうと伝えています。",
    );
    assert.equal(entry.source, MEET_SOURCE);
    assert.equal(entry.sourceLabel, "ラジオDJネキみりぃのTikTok投稿を見る");
    assert.deepEqual(entry.additionalSources, [
      { label: "みりぃのX投稿を見る", url: MEET_X_SOURCE },
    ]);
    assert.equal(entry.url, undefined);
    assert.equal(entry.relatedUrl, undefined);
    assert.equal(entry.ctaLabel, undefined);
    assert.equal(entry.message?.label, "ラジオDJネキみりぃの投稿");
    assert.equal(
      entry.message?.text,
      "フレキャン2026出場中のあみちゃん@Ami に会ってきたの〜🫦🩵✨終始お話ししすぎて、音楽聞くお店だったのに語りまくるという。今度はお話しし放題のところで会おうねっ✌🏻🎀#ミスサー #フレキャン #ミスコン",
    );
    assert.doesNotMatch(entry.body, /妹分|AGESTOCK|横アリ|歌詞|チューリング|GACHI/);
    assert.doesNotMatch(entry.message.text, /\u202a/);
    assert.deepEqual(resolveNewsLinks(entry, now), {
      additionalCtas: AMI_CTAS,
    });
  });

  it("keeps the overlay clip as a non-link TikTok with profile CTA", () => {
    const entry = newsItem("2026-09-22-tiktok-ami-meet-story");
    const now = Date.parse("2026-09-22T19:00:00+09:00");

    assert.equal(entry.title, "「あみちゃんに会ってきたのよ〜」TikTok");
    assert.equal(entry.source, undefined);
    assert.equal(entry.sourceLabel, "TikTok");
    assert.equal(entry.relatedUrl, SEASIDE);
    assert.equal(entry.ctaLabel, "ラジオDJネキみりぃのTikTokを見る");
    assert.equal(entry.url, undefined);
    assert.equal(entry.message?.label, "画面の文字");
    assert.equal(
      entry.message?.text,
      "フレキャン出場中のあみちゃんに会ってきたのよ〜💋🩵✨",
    );
    assert.doesNotMatch(entry.body, /いいね必須|保存＆再投稿|妹分|歌詞/);
    assert.doesNotMatch(entry.message.text, /いいね|コメント|保存|再投稿/);
    assert.doesNotMatch(JSON.stringify(entry), /vt\.tiktok\.com/);
    assert.deepEqual(resolveNewsLinks(entry, now), {
      relatedUrl: SEASIDE,
      cta: { label: "ラジオDJネキみりぃのTikTokを見る", url: SEASIDE },
      additionalCtas: AMI_CTAS,
    });
  });

  it("keeps Ami's twin-coord post as the third source", () => {
    const entry = newsItem("2026-09-22-tiktok-ami-twin-coord");
    const now = Date.parse("2026-09-22T19:00:00+09:00");

    assert.equal(entry.title, "「水玉で双子コーデにしたんだよぉ」TikTok");
    assert.equal(entry.source, TWIN_SOURCE);
    assert.equal(entry.sourceLabel, "天宮あみさんのTikTok投稿を見る");
    assert.deepEqual(entry.additionalSources, [
      { label: "みりぃのX投稿を見る", url: TWIN_X_SOURCE },
    ]);
    assert.equal(entry.url, undefined);
    assert.equal(entry.relatedUrl, undefined);
    assert.equal(entry.ctaLabel, undefined);
    assert.equal(entry.message?.label, "天宮あみさんの投稿");
    assert.equal(
      entry.message?.text,
      "水玉で双子コーデにしたんだよぉ@ラジオDJネキみりぃ🛜  #フレキャン2026 #ミスサー2026 #ミスコン  #大学生 #双子コーデ",
    );
    assert.doesNotMatch(entry.body, /妹分|AGESTOCK|歌詞|チューリング/);
    assert.deepEqual(resolveNewsLinks(entry, now), {
      additionalCtas: AMI_CTAS,
    });
  });
});

describe("2026-09-22 TikTok videos — shared Latest / Gallery assets", () => {
  it("shares one manifest object per clip and leads Gallery with the three new videos", () => {
    assert.equal(newsItem("2026-09-22-tiktok-ami-meet").media, tiktokAmiMeetVideo);
    assert.equal(
      newsItem("2026-09-22-tiktok-ami-meet-story").media,
      tiktokAmiMeetStoryVideo,
    );
    assert.equal(
      newsItem("2026-09-22-tiktok-ami-twin-coord").media,
      tiktokAmiTwinCoordVideo,
    );
    assert.equal(galleryVideos[0], tiktokAmiMeetVideo);
    assert.equal(galleryVideos[1], tiktokAmiMeetStoryVideo);
    assert.equal(galleryVideos[2], tiktokAmiTwinCoordVideo);
    assert.equal(galleryVideos[3], tiktokAmiTokyoVideo);
    assert.equal(galleryVideos[4], coldUmbrellaStoryVideo);
    assert.equal(galleryVideos[5], campusGirlsPatonFifteenXStoryVideo);
    assert.equal(galleryVideos[6], tiktokKossoriVideo);
    assert.equal(galleryVideos[7], streamThanksMorningSlotStoryVideo);

    assert.equal(tiktokAmiMeetVideo.sourceUrl, MEET_SOURCE);
    assert.equal(tiktokAmiMeetVideo.sourceDate, "2026-09-22");
    assert.equal("sourceLabel" in tiktokAmiMeetVideo, false);
    assert.equal(tiktokAmiMeetStoryVideo.sourceLabel, "TikTok");
    assert.equal("sourceUrl" in tiktokAmiMeetStoryVideo, false);
    assert.equal(tiktokAmiMeetStoryVideo.sourceDate, "2026-09-22");
    assert.equal(tiktokAmiTwinCoordVideo.sourceUrl, TWIN_SOURCE);
    assert.equal(tiktokAmiTwinCoordVideo.sourceDate, "2026-09-22");

    for (const clip of clips) {
      const matches = galleryVideos.filter((entry) => entry.id === clip.mediaId);
      const entries = selectGalleryEntries().filter(({ key }) => key === clip.mediaId);
      assert.deepEqual(matches, [clip.item]);
      assert.equal(
        visibleGalleryVideos().find(({ id }) => id === clip.mediaId),
        clip.item,
      );
      assert.equal(clip.item.provenance, "owner-provided");
      assert.equal(clip.item.published, true);
      assert.equal(clip.item.kind, "video");
      assert.equal(entries.length, 1);
      assert.equal(entries[0].kind, "video");
      assert.equal(entries[0].item.video.controls, true);
      assert.equal(entries[0].item.video.playsInline, true);
      assert.equal(entries[0].item.video.preload, "none");
    }
  });

  it("publishes exactly one local MP4 and one local poster per clip", async () => {
    const assets = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"))
      .filter((file) => file.includes("mily-b141-"));

    assert.deepEqual(assets.sort(), [
      "media/gallery/mily-b141-01-tiktok-ami-meet-poster.jpg",
      "media/gallery/mily-b141-01-tiktok-ami-meet.mp4",
      "media/gallery/mily-b141-02-tiktok-ami-meet-story-poster.jpg",
      "media/gallery/mily-b141-02-tiktok-ami-meet-story.mp4",
      "media/gallery/mily-b141-03-tiktok-ami-twin-coord-poster.jpg",
      "media/gallery/mily-b141-03-tiktok-ami-twin-coord.mp4",
    ]);
    for (const clip of clips) {
      const mp4 = path.join(galleryDirectory, `${clip.slug}.mp4`);
      const poster = path.join(galleryDirectory, `${clip.slug}-poster.jpg`);
      assert.match(clip.item.src, /^\/media\/gallery\//);
      assert.match(clip.item.poster, /^\/media\/gallery\//);
      assert.equal(existsSync(mp4), true);
      assert.equal(existsSync(poster), true);
      assert.ok((await stat(mp4)).size > 0);
      assert.ok((await stat(poster)).size > 0);
    }
  });

  it("does not add the clips to Drive Gallery, media.ts, Stories, Activities, or socials", () => {
    const drive = driveGallerySections(visibleDriveGallery());
    const serializedSocials = JSON.stringify(socials);

    assert.equal(
      drive.videos.some((entry) => String(entry.id ?? "").includes("b141")),
      false,
    );
    assert.equal(
      media.some((entry) => String(entry.id ?? "").includes("b141")),
      false,
    );
    assert.equal(
      stories.some((entry) => JSON.stringify(entry).includes("b141")),
      false,
    );
    assert.equal(events.length, 0);
    assert.equal(serializedSocials.includes("b141"), false);
    assert.equal(serializedSocials.includes("amis2_m.h"), false);
    for (const clip of clips) {
      assert.equal(
        highlights.some((entry) => JSON.stringify(entry).includes(clip.newsId)),
        false,
      );
      assert.equal(
        streamSchedule.some((entry) => JSON.stringify(entry).includes(clip.newsId)),
        false,
      );
      assert.equal(
        selectActivityNews("radio").some((entry) => entry.id === clip.newsId),
        false,
      );
      assert.equal(
        selectActivityNews("miss-circle").some((entry) => entry.id === clip.newsId),
        false,
      );
      assert.equal(
        selectActivityMedia("radio").some((entry) => entry.id === clip.mediaId),
        false,
      );
    }
  });
});

describe("2026-09-22 TikTok videos — published derivatives", () => {
  for (const clip of clips) {
    const mp4 = path.join(galleryDirectory, `${clip.slug}.mp4`);
    const poster = path.join(galleryDirectory, `${clip.slug}-poster.jpg`);
    const original = path.join(root, "media/original", clip.originalParts.join(""));

    it(`${clip.slug} matches the manifest and is H.264 Baseline / yuv420p / video-only`, async () => {
      const info = await probe(mp4);
      const video = info.streams.find((stream) => stream.codec_type === "video");
      const audioStreams = info.streams.filter((stream) => stream.codec_type === "audio");
      const bytes = await readFile(mp4);

      assert.ok(video);
      assert.equal(video.codec_name, "h264");
      assert.match(video.profile, /Baseline/);
      assert.equal(video.has_b_frames, 0);
      assert.equal(video.pix_fmt, "yuv420p");
      assert.equal(video.width, clip.item.width);
      assert.equal(video.height, clip.item.height);
      assert.equal(video.width, 720);
      assert.equal(video.height, 1280);
      assert.equal(video.nb_frames, clip.frames);
      assert.equal(Number(info.format.duration).toFixed(3), clip.duration);
      assert.equal(audioStreams.length, 0);
      assert.equal(createHash("sha256").update(bytes).digest("hex"), clip.publicSha);
      assert.equal(bytes.length, clip.publicBytes);

      if (existsSync(original)) {
        const source = await probe(original);
        const sourceVideo = source.streams.find((stream) => stream.codec_type === "video");
        const sourceBytes = await readFile(original);

        assert.equal(sourceBytes.length, clip.originalBytes);
        assert.equal(
          createHash("sha256").update(sourceBytes).digest("hex"),
          clip.originalSha,
        );
        assert.equal(sourceVideo.width, video.width);
        assert.equal(sourceVideo.height, video.height);
        assert.equal(sourceVideo.nb_frames, video.nb_frames);
        assert.equal(sourceVideo.profile, "High");
      }
    });

    it(`${clip.slug} uses faststart and removes source-specific metadata`, async () => {
      assert.equal(await isFaststart(mp4), true);
      assert.deepEqual(
        await validateVideoDerivatives(clip.item, galleryDirectory),
        { width: 720, height: 1280 },
      );

      const handle = await open(mp4, "r");
      try {
        const head = Buffer.alloc(64 * 1024);
        const { bytesRead } = await handle.read(head, 0, head.length, 0);
        const window = head.subarray(0, bytesRead);
        assert.ok(window.indexOf("moov", 0, "latin1") < window.indexOf("mdat", 0, "latin1"));
      } finally {
        await handle.close();
      }

      const info = await probe(mp4);
      const serialized = JSON.stringify(info);
      assert.equal(info.chapters.length, 0);
      assert.doesNotMatch(serialized, /aigc_info|vid_md5/);
      const metadata = [
        info.format.tags ?? {},
        ...info.streams.map((stream) => stream.tags ?? {}),
      ];
      assert.deepEqual(Object.keys(metadata[0]).sort(), [
        "compatible_brands",
        "encoder",
        "major_brand",
        "minor_version",
      ]);
      const streamMetadataKeys = Object.keys(metadata[1]).sort();
      const allowedStreamMetadataKeys = new Set([
        "encoder",
        "handler_name",
        "language",
        "vendor_id",
      ]);
      assert.deepEqual(
        streamMetadataKeys.filter((key) => !allowedStreamMetadataKeys.has(key)),
        [],
      );
      for (const key of ["encoder", "handler_name", "language"]) {
        assert.equal(streamMetadataKeys.includes(key), true, key);
      }
      assert.doesNotMatch(JSON.stringify(metadata), SOURCE_METADATA_FILE_PATTERN);
    });

    it(`${clip.slug} uses the selected real frame as a metadata-free poster`, async () => {
      const meta = await sharp(poster).metadata();
      const posterBytes = await readFile(poster);
      assert.equal(meta.width, 720);
      assert.equal(meta.height, 1280);
      assert.equal(meta.exif, undefined);
      assert.equal(meta.iptc, undefined);
      assert.equal(meta.xmp, undefined);
      assert.equal(createHash("sha256").update(posterBytes).digest("hex"), clip.posterSha);
      assert.equal(posterBytes.length, clip.posterBytes);

      const ffmpeg = await ffmpegExe();
      const { stdout } = await run(
        ffmpeg,
        [
          "-hide_banner",
          "-loglevel",
          "error",
          "-ss",
          clip.posterSeconds,
          "-i",
          mp4,
          "-frames:v",
          "1",
          "-f",
          "rawvideo",
          "-pix_fmt",
          "gray",
          "-",
        ],
        { encoding: "buffer", maxBuffer: 1024 * 1024 * 64 },
      );
      const posterGray = await sharp(poster).greyscale().raw().toBuffer();

      assert.equal(stdout.length, posterGray.length);
      let total = 0;
      for (let index = 0; index < posterGray.length; index += 1) {
        total += Math.abs(posterGray[index] - stdout[index]);
      }
      assert.ok(total / posterGray.length < 3);
    });
  }

  it("retains the existing uncropped playback contract", async () => {
    const view = driveVideoView(tiktokAmiMeetVideo);
    const latest = await readFile(path.join(root, "src/components/Latest.tsx"), "utf8");
    const gallery = await readFile(path.join(root, "src/components/Gallery.tsx"), "utf8");

    assert.equal(view.video.controls, true);
    assert.equal(view.video.playsInline, true);
    assert.equal(view.video.preload, "none");
    assert.equal("autoPlay" in view.video, false);
    assert.equal("loop" in view.video, false);
    for (const source of [latest, gallery]) {
      assert.match(source, /controls/);
      assert.match(source, /playsInline/);
      assert.match(source, /preload/);
      assert.match(source, /object-contain/);
      assert.doesNotMatch(source, /autoPlay|autoplay|\bloop\b/);
    }
  });
});

describe("2026-09-22 TikTok posts — privacy, identity and scope boundaries", () => {
  it("keeps private handoff fields, Drive ids and raw originals out of tracked/public files", async () => {
    const files = await repositoryFiles();
    const taskFiles = [
      "src/data/tiktokAmiMeetVideo.json",
      "src/data/tiktokAmiMeetVideo.ts",
      "src/data/tiktokAmiMeetStoryVideo.json",
      "src/data/tiktokAmiMeetStoryVideo.ts",
      "src/data/tiktokAmiTwinCoordVideo.json",
      "src/data/tiktokAmiTwinCoordVideo.ts",
      "src/data/news.ts",
      "src/data/galleryVideos.ts",
      "src/data/challengeConnection.ts",
      "src/data/socials.ts",
      "docs/MEDIA.md",
      "docs/CONTENT-OPS.md",
    ];

    for (const clip of clips) {
      const original = path.join(root, "media/original", clip.originalParts.join(""));
      assert.equal(files.includes(path.relative(root, original).replaceAll("\\", "/")), false);
    }
    assert.equal(
      files.some(
        (relative) =>
          relative.startsWith("media/original/") &&
          relative.includes("mily-b141"),
      ),
      false,
    );

    for (const relative of taskFiles) {
      const bytes = await readFile(path.join(root, relative));
      if (isProbablyBinary(bytes)) continue;
      const source = bytes.toString("utf8");
      assert.equal(DRIVE_HOST_PATTERN.test(source), false, relative);
      assert.deepEqual(findDriveIds(source), [], relative);
      assert.doesNotMatch(source, PRIVATE_HANDOFF_KEY_PATTERN);
      assert.doesNotMatch(source, /IMG_7915|IMG_7918/);
    }
    for (const relative of [
      "src/data/tiktokAmiMeetVideo.json",
      "src/data/tiktokAmiMeetVideo.ts",
      "src/data/tiktokAmiMeetStoryVideo.json",
      "src/data/tiktokAmiMeetStoryVideo.ts",
      "src/data/tiktokAmiTwinCoordVideo.json",
      "src/data/tiktokAmiTwinCoordVideo.ts",
      "src/data/news.ts",
      "src/data/galleryVideos.ts",
      "src/data/challengeConnection.ts",
      "src/data/socials.ts",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.doesNotMatch(source, /妹分/);
    }
  });
});
