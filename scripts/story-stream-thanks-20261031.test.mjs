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

test("Story is a single confirmed-on NEWS item with the owner-supplied source", () => {
  assert.equal(item.id, "2026-10-31-stream-thanks-instagram-story");
  assert.equal(item.date, "2026-10-31");
  assert.equal(item.dateBasis, "confirmed-on");
  assert.equal(item.source, "https://www.instagram.com/stories/mily_chan36/4018909648824563123/");
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
    [item.media.src, "a6d25e50d406cbb24d927934e1de0b828eeb7e45c21746452ddcee6aa11bb0b6"],
    [item.media.poster, "5a1a97ad26bf892f0c9db17361603be9bf10d8a60f8a4b2b59695ce40236ec83"],
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
