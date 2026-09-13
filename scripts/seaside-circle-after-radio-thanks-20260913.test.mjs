import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { news } from "../src/data/news.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ID = "2026-09-13-seaside-circle-after-radio-thanks";
const VIDEO = "/media/news/mily-b114-01-seaside-circle-after-radio-thanks.mp4";
const POSTER = "/media/news/mily-b114-01-seaside-circle-after-radio-thanks-poster.jpg";

function item() {
  return news.find((entry) => entry.id === ID);
}

describe("2026-09-13 seaside circle post-radio thanks", () => {
  it("publishes one source-bounded radio NEWS item ahead of the pre-show announcement", () => {
    const entry = item();
    assert.ok(entry);
    assert.equal(entry.date, "2026-09-13");
    assert.deepEqual(entry.activityIds, ["radio"]);
    assert.equal(entry.source, undefined);
    assert.equal(entry.sourceLabel, "放送後の動画");
    assert.match(entry.body, /たくさんのメールをありがとう/);
    assert.match(entry.body, /楽しく3時間放送できました/);
    assert.ok(news.indexOf(entry) < news.findIndex((x) => x.id === "2026-09-13-seaside-circle-solo-theme"));
  });
  it("uses the approved self-hosted video and real-frame poster only in NEWS", () => {
    const entry = item();
    assert.equal(entry?.media?.kind, "video");
    assert.equal(entry?.media?.src, VIDEO);
    assert.equal(entry?.media?.poster, POSTER);
    assert.equal(entry?.media?.width, 512);
    assert.equal(entry?.media?.height, 910);
    assert.ok(existsSync(path.join(root, "public", VIDEO)));
    assert.ok(existsSync(path.join(root, "public", POSTER)));
  });

  it("appears in radio-related NEWS without duplicating the media", () => {
    const related = selectActivityNews("radio", news, 20);
    assert.equal(related.filter((entry) => entry.id === ID).length, 1);
    const allSources = news.flatMap((entry) => [
      entry.media?.kind === "video" ? entry.media.src : null,
      ...(entry.additionalMedia ?? []).map((media) =>
        media.kind === "video" ? media.src : null,
      ),
    ]).filter(Boolean);
    assert.equal(allSources.filter((src) => src === VIDEO).length, 1);
  });
});
