import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";

const root = new URL("../", import.meta.url);
const text = fs.readFileSync(new URL("src/data/news.ts", root), "utf8");
const marker = "export const news: NewsItem[] = [\n";
const idPosition = text.indexOf('"id": "2026-10-31-stream-thanks-instagram-story"');
const start = text.lastIndexOf("\n  {", idPosition) + 1;
const end = text.indexOf("\n  },", start) + 5;
const item = JSON.parse(text.slice(start, end).trim().replace(/,$/, ""));
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");

test("Story is a single confirmed-on NEWS item with a non-link source label", () => {
  assert.equal(item.id, "2026-10-31-stream-thanks-instagram-story");
  assert.equal(item.date, "2026-10-31");
  assert.equal(item.dateBasis, "confirmed-on");
  assert.equal(item.source, undefined);
  assert.equal(item.sourceLabel, "Instagram Story（10月31日確認・投稿日未確認）");
  assert.equal(item.url, "https://www.instagram.com/mily_chan36");
  assert.equal(item.ctaLabel, "Instagramプロフィールを見る");
  assert.equal(text.split(`\"id\": \"${item.id}\"`).length - 1, 1);
  assert.match(item.body, /音声なし/);
  assert.match(item.body, /投稿日・撮影日・配信日時は未確認/);
  assert.match(item.body, /現在の投票案内や確定成績ではありません/);
  assert.equal(item.additionalCtas, undefined);
  assert.equal(item.activityIds, undefined);
});
test("video and real-frame poster use the reviewed local bytes and original portrait ratio", () => {
  assert.equal(item.media.kind, "video");
  assert.equal(item.media.width, 480);
  assert.equal(item.media.height, 854);
  for (const [path, expected] of [
    [item.media.src, "5af048f4a1231156f518ddf8a34d20fd177c620ce1502fa810aa82a61d1c16bd"],
    [item.media.poster, "46d4a81f62564cc5c74a793f0fd159fecb01cf75ecfb1bc50cd683c03a4bd1c2"],
  ]) assert.equal(hash(fs.readFileSync(new URL(`public${path}`, root))), expected);
});
function boxes(buffer, from = 0, to = buffer.length) {
  const output = [];
  for (let i = from; i + 8 <= to;) {
    const size = buffer.readUInt32BE(i), type = buffer.toString("ascii", i + 4, i + 8);
    assert.ok(size >= 8 && i + size <= to, `valid ${type} box`);
    output.push({ type, offset: i });
    if (["moov", "trak", "mdia"].includes(type)) output.push(...boxes(buffer, i + 8, i + size));
    if (type === "hdlr") output.at(-1).handler = buffer.toString("ascii", i + 16, i + 20);
    i += size;
  }
  return output;
}
test("public MP4 has one video handler, no audio handler, and faststart", () => {
  const b = boxes(fs.readFileSync(new URL(`public${item.media.src}`, root)));
  assert.deepEqual(b.filter(x => x.type === "hdlr").map(x => x.handler), ["vide"]);
  assert.ok(b.find(x => x.type === "moov").offset < b.find(x => x.type === "mdat").offset);
});
