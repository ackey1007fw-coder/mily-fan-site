import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import ffprobe from "ffprobe-static";
import sharp from "sharp";
import { media } from "../src/data/media.ts";
import { news, newsDisplayMedia } from "../src/data/news.ts";
import {
  september23FanroomImage,
  september23FanroomPhoto,
  fanroomVoice1027,
  fanroomVoice1032,
} from "../src/data/september23Fanroom.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const item = news.find(({ id }) => id === "2026-09-23-fanroom-selfie-voices");
const voices = [fanroomVoice1027, fanroomVoice1032];

describe("September 23 Fan Room post", () => {
  it("connects the original selfie and both independent audio controls to one dated NEWS item", () => {
    assert.ok(item);
    assert.equal(item.date, "2026-09-23");
    assert.deepEqual(newsDisplayMedia(item), [september23FanroomImage, ...voices]);
    assert.equal(media.find(({ id }) => id === september23FanroomPhoto.id), september23FanroomPhoto);
    assert.equal(item.source, undefined);
    assert.equal(item.url, "https://www.showroom-live.com/room/fan_club?room_id=573253");
    assert.doesNotMatch(JSON.stringify(item), /static\.showroom-live\.com|makoto@cra/);
  });

  it("serves distinct, valid AAC audio files with the reviewed duration and bytes", async () => {
    const expected = [
      { duration: 17.237333, size: 46057, hash: "84028202164054cc93ffbdc0b28d72cc817a2cd880b9977153e99c44df893e34" },
      { duration: 8.789333, size: 23475, hash: "b00805a6b0ae6a9e4db23bca3cd0518f4cda48dea0acf06e03ac56e8731a91a9" },
    ];
    for (const [index, voice] of voices.entries()) {
      const file = path.join(root, "public", voice.src);
      const bytes = await readFile(file);
      assert.equal(bytes.length, expected[index].size);
      assert.equal(createHash("sha256").update(bytes).digest("hex"), expected[index].hash);
      const probe = JSON.parse(execFileSync(ffprobe.path, ["-v", "error", "-show_format", "-show_streams", "-of", "json", file]));
      assert.equal(probe.streams.length, 1);
      assert.equal(probe.streams[0].codec_name, "aac");
      assert.equal(probe.streams[0].channels, 1);
      assert.ok(Math.abs(Number(probe.format.duration) - expected[index].duration) < 0.01);
      assert.equal(bytes.toString("ascii", 4, 8), "ftyp");
      assert.ok(bytes.indexOf("moov") < bytes.indexOf("mdat"));
      assert.doesNotMatch(JSON.stringify(probe), /creation_time|location/);
    }
  });

  it("uses EXIF-free gallery derivatives without upscaling the supplied photo", async () => {
    for (const width of [480, 960, 1600]) {
      const file = path.join(root, "public", `${september23FanroomPhoto.basePath}-${width}.jpg`);
      const image = sharp(file);
      const info = await image.metadata();
      assert.equal(info.width, Math.min(width, 1206));
      assert.equal(info.exif, undefined);
      assert.equal(info.icc, undefined);
    }
  });
});
