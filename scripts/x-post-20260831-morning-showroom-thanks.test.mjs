import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { events } from "../src/data/events.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { siteOrigin } from "../src/data/site.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { contest } from "../src/data/contest.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { verifyNews } from "./content-invariants.mjs";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-08-31-morning-showroom-thanks";
const SOURCE = "https://x.com/Mily_chan36/status/2094192106105659650";
const SHOWROOM = "https://www.showroom-live.com/r/circle2026_0734";
const PHOTO = "/media/news/mily-b44-01-morning-showroom-thanks.jpg";
const PHOTO_FILE = path.join(root, "public", PHOTO.slice(1));
const ORIGINAL = path.join(
  root,
  "media/original/mily-b44-01-morning-showroom-thanks.jpg",
);
const PLEADING = "\u{1F979}";
const FOLDED_HANDS = "\u{1F64F}\u{1F3FB}";
const SPARKLES = "\u{2728}";
const FACEPALM = "\u{1F926}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}";
const HEART_EXCLAMATION = "\u{2763}\u{FE0F}";
const MESSAGE =
  `朝から私を起こしに来てくれたみんな、ありがとう${PLEADING}${FOLDED_HANDS}${SPARKLES}なんだか勇気ももらえて、朝から配信した甲斐があったなぁぁぁぁ〜\n` +
  `これからの頑張る糧になるね、確実に${FACEPALM}${HEART_EXCLAMATION}\n` +
  "#ミスサー #ミスサークル #ミスサークルコンテスト #ミスサー2026 #ミスサークル2026 #ミスサークルコンテスト2026";
