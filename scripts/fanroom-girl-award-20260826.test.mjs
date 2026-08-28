import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { open, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { describe, it } from "node:test";
import { events } from "../src/data/events.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { girlAwardEventVoice } from "../src/data/girlAwardEventVoice.ts";
import { news, newsDisplayMedia, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { contest } from "../src/data/contest.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import { selectGalleryEntries } from "../src/lib/galleryItems.ts";
import { verifyNews } from "./content-invariants.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_ID = "2026-08-26-girl-award-event-fanroom";
const ROOM_URL = "https://www.showroom-live.com/r/circle2026_0734";
const PUBLIC_RELATIVE = "public/media/news/mily-b27-01-girl-award-event-voice.m4a";
const PUBLIC_FILE = path.join(root, PUBLIC_RELATIVE);
const PUBLIC_SHA256 =
  "22d00d249e252f3d8da76cbfe1017bd1717954a904c589829174263b94c94468";
const PUBLIC_SIZE = 89_084;
const MESSAGE =
  "ガルアワイベ最終日、\n" +
  "なんと【6位】で終わることができました😭\n" +
  "🙏❤️✨\n" +
  "\n" +
  "まさか最後に逆転できるとは〜！！！！！\n" +
  "これもみんなの応援の賜物すぎるよ😱❤️‍🔥\n" +
  "\n" +
  "一緒に走り切ってくれたみんな、本当にありがとう。\n" +
  "心から感謝です🥺💙\n" +
  "\n" +
  "とってもとっても楽しかった！！\n" +
  "\n" +
  "これからもどうぞ、\n" +
  "不器用なみりぃをよろしくお願いいたします‼️";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
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

describe("2026-08-26 Girl Award Fan Room — Latest / NEWS + audio", () => {
  it("adds one Fan Room NEWS item with verbatim text, unlinked source, and SHOWROOM CTA", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(entry.date, "2026-08-26");
    assert.equal(entry.sameDayOrder, 1);
    assert.deepEqual(entry.activityIds, ["live-stream"]);
    assert.equal(entry.source, undefined);
    assert.equal(entry.sourceLabel, "SHOWROOMファンルーム");
    assert.equal(entry.url, ROOM_URL);
    assert.equal(entry.ctaLabel, "SHOWROOMで応援する");
    assert.equal(entry.media, girlAwardEventVoice);
    assert.equal(entry.media.kind, "audio");
    assert.equal(entry.message?.label, "みりぃからの連絡💌 · 22:32");
    assert.equal(entry.message?.text, MESSAGE);
    assert.match(entry.title, /ガルアワイベ最終日/);
    assert.match(entry.title, /6位/);
    assert.match(entry.body, /8月26日/);
    assert.match(entry.body, /SHOWROOMファンルーム/);
    assert.match(entry.body, /6位/);
    assert.match(entry.body, /音声メッセージ/);
    assert.doesNotMatch(entry.body, /公式|公認|本人運営/);
    assert.doesNotMatch(JSON.stringify(entry), /fan_club\?room_id=/);
    assert.doesNotMatch(JSON.stringify(entry), /static\.showroom-live\.com/);
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("leads 2026-08-26 NEWS above Mixch 1.5x day via sameDayOrder", () => {
    const ordered = sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-28-paton-vote-day-3").filter((entry) => entry.id !== "2026-08-27-mixch-expressive").filter((entry) => entry.id !== "2026-08-27-paton-vote-how-to").filter((entry) => entry.id !== "2026-08-27-x-followers-100").filter((entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "2026-08-27-miss-circle-showroom-story").filter((entry) => entry.id !== "2026-08-27-movie-night"));

    assert.equal(ordered[0]?.id, "2026-08-26-girlsaward-showroom-6th");
    assert.equal(ordered[1]?.id, "2026-08-26-paton-vote-stories");
    assert.equal(ordered[2]?.id, "2026-08-26-instagram-followers-400");
    assert.equal(ordered[3]?.id, "2026-08-26-morning-stream-thanks");
    assert.equal(ordered[4]?.id, NEWS_ID);
    assert.equal(ordered[5]?.id, "2026-08-26-mixch-15x-day");
    assert.equal(ordered[6]?.id, "2026-08-26-stream-1000");
    assert.deepEqual(
      ordered.filter(({ date }) => date === "2026-08-26").map(({ id }) => id),
      [
        "2026-08-26-girlsaward-showroom-6th",
        "2026-08-26-paton-vote-stories",
        "2026-08-26-instagram-followers-400",
        "2026-08-26-morning-stream-thanks",
        NEWS_ID,
        "2026-08-26-mixch-15x-day",
        "2026-08-26-stream-1000",
      ],
    );
    assert.equal(news.length, 48);
  });

  it("keeps the voice memo on Latest / NEWS only", () => {
    const entry = item();
    const displayed = newsDisplayMedia(entry);
    const gallery = selectGalleryEntries();
    const liveMedia = selectActivityMedia("live-stream");
    const liveNews = selectActivityNews("live-stream");

    assert.deepEqual(displayed, [girlAwardEventVoice]);
    assert.equal(liveNews[0]?.id, "2026-08-26-girlsaward-showroom-6th");
    assert.equal(liveNews[1]?.id, "2026-08-26-morning-stream-thanks");
    assert.equal(liveNews[2]?.id, NEWS_ID);
    assert.equal(liveMedia.includes(girlAwardEventVoice), false);
    assert.equal(
      liveMedia.some((candidate) => candidate.kind === "audio"),
      false,
    );
    assert.equal(
      gallery.some(
        (candidate) =>
          ("src" in candidate.item && candidate.item.src === girlAwardEventVoice.src) ||
          candidate.item.id === girlAwardEventVoice.id,
      ),
      false,
    );
    assert.equal(
      media.some((candidate) =>
        String(candidate.basePath ?? candidate.id).includes("girl-award-event-voice"),
      ),
      false,
    );
    assert.equal(
      galleryVideos.some((candidate) => candidate.id.includes("girl-award-event-voice")),
      false,
    );
    assert.equal(
      stories.some((story) => JSON.stringify(story).includes("b27")),
      false,
    );
  });

  it("does not promote the Fan Room 6th-place claim into highlights, contest, events, or schedule", () => {
    assert.deepEqual(events, []);
    assert.deepEqual(streamSchedule, []);
    assert.equal(JSON.stringify(highlights).includes("6位"), false);
    assert.equal(JSON.stringify(contest).includes("6位"), false);
    assert.equal(JSON.stringify(events).includes(NEWS_ID), false);
    assert.equal(JSON.stringify(streamSchedule).includes(NEWS_ID), false);
  });

  it("flows through Portal Feed without treating the m4a as an image", () => {
    const feed = createPortalFeed();
    const feedItem = feed.items.find(
      (candidate) => candidate.id === `mily:news:${NEWS_ID}`,
    );

    assert.ok(feedItem);
    assert.equal(feedItem.publishedAt, "2026-08-26T00:00:00+09:00");
    assert.equal(feedItem.sourceUrl, ROOM_URL);
    assert.equal(feedItem.image, undefined);
    assert.equal(feedItem.title, item().title);
    assert.equal(feedItem.summary, item().body);
  });

  it("self-hosts a metadata-free AAC-LC m4a and never hotlinks SHOWROOM", async () => {
    assert.equal(existsSync(PUBLIC_FILE), true);
    const bytes = await readFile(PUBLIC_FILE);
    assert.equal(bytes.length, PUBLIC_SIZE);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), PUBLIC_SHA256);

    const handle = await open(PUBLIC_FILE, "r");
    try {
      const head = Buffer.alloc(64 * 1024);
      const { bytesRead } = await handle.read(head, 0, head.length, 0);
      const window = head.subarray(0, bytesRead);
      const moov = window.indexOf("moov", 0, "latin1");
      const mdat = window.indexOf("mdat", 0, "latin1");
      assert.ok(moov >= 0 && mdat >= 0 && moov < mdat);
    } finally {
      await handle.close();
    }

    const info = await probe(PUBLIC_FILE);
    const audio = info.streams.find((stream) => stream.codec_type === "audio");
    assert.ok(audio);
    assert.equal(info.streams.length, 1);
    assert.equal(audio.codec_name, "aac");
    assert.equal(String(audio.sample_rate), "12000");
    assert.equal(Number(audio.channels), 1);
    assert.ok(Math.abs(Number(info.format.duration) - 20.82) < 0.05);
    assert.equal("creation_time" in (info.format.tags ?? {}), false);
    assert.equal("creation_time" in (audio.tags ?? {}), false);
    assert.equal((info.chapters ?? []).length, 0);

    const dataFiles = [
      "src/data/news.ts",
      "src/data/girlAwardEventVoice.ts",
      "src/components/NewsAudioCard.tsx",
      "src/components/Latest.tsx",
    ];
    const sources = await Promise.all(
      dataFiles.map((relative) => readFile(path.join(root, relative), "utf8")),
    );
    for (const source of sources) {
      assert.doesNotMatch(source, /static\.showroom-live\.com/);
      assert.doesNotMatch(source, /<iframe/);
    }

    const latest = sources[3];
    assert.match(latest, /kind === "audio"/);
    assert.match(latest, /NewsAudioCard/);

    const card = sources[2];
    assert.match(card, /<audio/);
    assert.match(card, /preload="none"/);
    assert.match(card, /type=\{media\.mimeType\}/);
    assert.doesNotMatch(card, /<iframe/);
    assert.doesNotMatch(card, /showroom-live\.com/);

    const { stdout: tracked } = await run("git", ["ls-files"], { cwd: root });
    assert.equal(tracked.includes("media/original/mily-b27"), false);
    assert.equal(tracked.includes("girl-award-event-voice.aac"), false);

    const publicNews = await readdir(path.join(root, "public/media/news"));
    assert.equal(
      publicNews.some((file) => file.endsWith(".jpg") && file.includes("girl-award")),
      false,
    );
    assert.equal(
      publicNews.includes("mily-b27-01-girl-award-event-voice.m4a"),
      true,
    );
  });

  it("does not invent a transcript of the voice memo", () => {
    const entry = item();

    assert.match(entry.body, /音声メッセージも届いています/);
    assert.equal(entry.body.includes("聞き取れ"), false);
    assert.equal(entry.body.includes("まさか最後に逆転できるとは〜"), false);
    assert.equal(entry.message.text.includes("まさか最後に逆転できるとは〜"), true);
  });

  it("documents the audio batch and Fan Room listen path", async () => {
    const [ops, mediaGuide] = await Promise.all([
      readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8"),
      readFile(path.join(root, "docs/MEDIA.md"), "utf8"),
    ]);

    assert.match(ops, /48件/);
    assert.match(ops, /ガルアワイベ最終日【6位】/);
    assert.match(ops, /kind: "audio"/);
    assert.match(ops, /自己ホストの `\.m4a`/);
    assert.match(ops, /SHOWROOM CDN の aac \/ m4a を hotlink しない/);
    assert.match(mediaGuide, /batch b27/);
    assert.match(mediaGuide, /mily-b27-01-girl-award-event-voice\.m4a/);
    assert.equal(mediaGuide.includes(PUBLIC_SHA256), true);
    assert.match(mediaGuide, /Fan Roomの生スクリーンショット/);
  });
});
