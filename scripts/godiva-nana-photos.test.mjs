import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
test("GODIVA × NANA: all 3 approved images have 6 web derivatives each", () => {
  const slugs = ["smile", "two-drinks", "eyes-closed"];
  for (const [index, slug] of slugs.entries()) {
    const stem = "mily-b198-" + String(index + 1).padStart(2, "0") + "-godiva-nana-" + slug;
    for (const width of [480, 960, 1600]) {
      for (const format of ["jpg", "webp"]) {
        assert.ok(existsSync(path.join(root, "public", "media", "gallery", stem + "-" + width + "." + format)));
      }
    }
  }
});
test("GODIVA × NANA: source link and receipt-date basis are explicit", () => {
  const news = readFileSync(path.join(root, "src", "data", "news.ts"), "utf-8");
  const entry = news.slice(news.indexOf('id: "2026-10-09-godiva-nana-instagram-archive"'), news.indexOf('id: "2026-10-08-fanroom-voice-message"'));
  assert.match(entry, /dateBasis: "confirmed-on"/);
  assert.match(entry, /instagram\.com\/p\/DeRQGExEyoX\//);
  assert.match(entry, /additionalMedia: godivaNanaNewsImages\.slice\(1\)/);
});
