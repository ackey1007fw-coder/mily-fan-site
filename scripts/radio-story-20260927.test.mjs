import { media, srcSetFor } from "../src/data/media.ts";
import assert from "node:assert/strict";
import { it } from "node:test";
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import ffprobe from "ffprobe-static";
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { news, newsDisplayMedia } from "../src/data/news.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { kawaiiRadioStoryVideo as video, kawaiiRadioMessageImage as image, RADIO_KAWAII_MESSAGE_FORM_URL, kawaiiRadioAdditionalVideos, kawaiiRadioMessagePhoto } from "../src/data/kawaiiRadioStoryVideo.ts";
import { radioProgram } from "../src/data/radio.ts";
const item = news.find(item => item.id === "2026-09-27-radio-kawaii-story");
const file = src => new URL(`../public${src}`, import.meta.url);
it("keeps the 9/27 radio announcement source-bounded with all four approved media", () => {
  assert.ok(item);
  assert.equal(news.filter(n => n.id === item.id).length, 1);
  assert.equal(item.date, "2026-09-27");
  assert.deepEqual(item.activityIds, ["radio"]);
  assert.equal(item.source, undefined);
  assert.equal(item.sourceLabel, "Instagram Story");
  assert.match(item.body, /かわいい/);
  assert.match(item.body, /10:00〜13:00/);
  assert.match(item.body, /氏名・メールアドレス/);
  assert.match(item.body, /映像のみ/);
  assert.deepEqual(newsDisplayMedia(item), [video, image, ...kawaiiRadioAdditionalVideos]);
  for (const v of kawaiiRadioAdditionalVideos) {
    assert.equal(galleryVideos.filter(g => g.id === v.id).length, 1);
    assert.equal(galleryVideos.find(g => g.id === v.id), v);
  }
  assert.equal(media.find(m => m.id === kawaiiRadioMessagePhoto.id), kawaiiRadioMessagePhoto);
  assert.equal(srcSetFor(kawaiiRadioMessagePhoto, "jpg"), image.srcSet);
  assert.equal(galleryVideos.filter(v => v.id === video.id).length, 1);
  assert.equal(galleryVideos.find(v => v.id === video.id), video);
  assert.equal(item.relatedUrl, radioProgram.listenUrl);
  assert.equal(item.additionalCtas[0].url, RADIO_KAWAII_MESSAGE_FORM_URL);
  assert.equal(new URL(RADIO_KAWAII_MESSAGE_FORM_URL).hostname, "fm-smw.jp");
  assert.doesNotMatch(JSON.stringify(item), /drive\.google|media\/original|[A-Z]:\\|完全匿名/);
});
it("ships the full reviewed video without unverified music and with faststart", async () => {
  const bytes = await readFile(file(video.src));
  assert.equal(createHash("sha256").update(bytes).digest("hex"), "5ff59c66390d8ffde5c02f1ef8f0970d582f2fea7417bea28982ff214dda958a");
  const probe = JSON.parse(execFileSync(ffprobe.path, ["-v", "error", "-show_streams", "-show_format", "-of", "json", fileURLToPath(file(video.src))]));
  assert.equal(probe.streams.length, 1);
  assert.equal(probe.streams[0].codec_name, "h264");
  assert.equal(probe.streams[0].profile, "Constrained Baseline");
  assert.equal(probe.streams[0].width, 512);
  assert.equal(probe.streams[0].height, 910);
  assert.equal(probe.streams[0].nb_frames, "246");
  assert.ok(Math.abs(Number(probe.format.duration) - 8.2) < 0.02);
  assert.ok(bytes.indexOf("moov") > 0 && bytes.indexOf("moov") < bytes.indexOf("mdat"));
  const poster = await readFile(file(video.poster));
  assert.equal(createHash("sha256").update(poster).digest("hex"), "3f15c68e0b78326909f88640b819ca00e594ed671f58fbda603ee907840c343f");
});
it("uses real responsive widths, uncropped pictures, and no metadata", async () => {
  for (const set of [image.srcSet, image.webpSrcSet]) {
    for (const entry of set.split(", ")) {
      const [src, descriptor] = entry.split(" ");
      const m = await sharp(await readFile(file(src))).metadata();
      assert.equal(m.width, Number(descriptor.slice(0, -1)));
      assert.ok(Math.abs(m.width / m.height - 864 / 1536) < 0.001);
      assert.equal(m.exif, undefined);
      assert.equal(m.iptc, undefined);
      assert.equal(m.xmp, undefined);
    }
  }
  assert.equal(image.width, 864);
  assert.equal(image.height, 1536);
});

it("keeps both additional Story videos full-length and metadata-free", async () => {
  for (const [index, v] of kawaiiRadioAdditionalVideos.entries()) {
    const bytes = await readFile(file(v.src));
    const probe = JSON.parse(execFileSync(ffprobe.path, ["-v", "error", "-show_streams", "-show_format", "-of", "json", fileURLToPath(file(v.src))]));
    assert.equal(probe.streams.length, 1);
    assert.equal(probe.streams[0].codec_name, "h264");
    assert.equal(probe.streams[0].profile, "Constrained Baseline");
    assert.equal(probe.streams[0].width, 512);
    assert.equal(probe.streams[0].height, 910);
    assert.ok(Math.abs(Number(probe.format.duration) - [19.034, 5.6][index]) < 0.04);
    assert.ok(bytes.indexOf("moov") > 0 && bytes.indexOf("moov") < bytes.indexOf("mdat"));
    for (const key of ["creation_time", "location", "comment"]) assert.equal(probe.format.tags[key], undefined);
    const poster = await sharp(await readFile(file(v.poster))).metadata();
    assert.equal(poster.width, 512);
    assert.equal(poster.height, 910);
    assert.equal(poster.exif, undefined);
  }
});
