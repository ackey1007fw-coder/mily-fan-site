import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import sharp from "sharp";
import { createHash } from "node:crypto";
import { streamRecap20260806Asa } from "../src/data/streamRecap20260806Asa.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const approvedImageDigests = {
  "mily-b116-01-bangs-touch.jpg": "3f8bddb183fb59be0cbfb3ae92a9fb5ba53e1035b0db6f8f30232133cc85971c",
  "mily-b116-02-finger-gesture.jpg": "7aa9d46a6f39900387dee3fe2e9fc06eea9f7b8c4e3a46161faa0e1739f77c41",
  "mily-b116-03-song-raised-finger.jpg": "4590898b8cc19402060bf6cd33277975a98af814ad79cc7ecc8b1f3922857d72",
  "mily-b116-04-song-clasped-hands.jpg": "c5501de8c077adc4a6fe4831219a09c104f606d806937575992bcb84adb266b3",
  "mily-b116-05-circle-gesture.jpg": "82cffd5cfed7b8ef50ae903941597d8838787b16948d195e01aac7462d8956b8",
  "mily-b116-06-chin-on-hand.jpg": "ec5e87c38493de7c4b15ebbd52d788a2c336b25cdbbc48a2ef3d78fb43575a5b",
  "mily-b116-07-bright-smile.jpg": "1c0d8a3d256e662e44535869736529b19c58de2b1a8ade4cb4afa342afb2f26c",
  "mily-b116-08-farewell.jpg": "dd41309be97f2a6a23c59960a78071b2e5da65ec82e403dc0c057624fe789d1b"
};
const recap = streamRecap20260806Asa;
const seconds = (value) => value.split(":").map(Number).reduce((n, v) => n * 60 + v, 0);

describe("2026-08-06 morning archive expansion", () => {
  it("keeps the existing recap id and expands the audited text record", () => {
    assert.equal(streamRecaps.filter(({ id }) => id === recap.id).length, 1);
    assert.equal(recap.dateLabel, "2026.08.06（木）");
    assert.equal(recap.broadcastLabel, "10:02頃〜 約180分");
    assert.equal(recap.highlights.length, 8);
    assert.equal(recap.timeline.length, 13);
    assert.equal(recap.goals.length, 0);
    assert.match(recap.summary, /リコピン/);
    assert.match(recap.nextNote, /ゲリラ配信/);
  });

  it("preserves the verified song and reference karaoke without publishing a clip", () => {
    assert.equal(recap.songs.length, 1);
    const [song] = recap.songs;
    assert.equal(song.title, "かわいいだけじゃだめですか？");
    assert.equal(song.artist, "CUTIE STREET");
    assert.equal(song.timestamp, "2:22:56");
    assert.equal(song.youtubeUrl, "https://www.youtube.com/watch?v=d0rOHgzCe6s");
    assert.equal(song.karaoke?.youtubeUrl, "https://www.youtube.com/watch?v=YYGsvfQcDIg");
    assert.equal(song.clip, undefined);
  });
  it("records ranking timing and timeline positions without claiming the readout ended the stream", () => {
    assert.deepEqual(recap.ranking, [
      "配信中に、13位から1位までランキングを読み上げました。個人名は掲載していません。",
    ]);
    assert.ok(recap.timeline.every((item, index, all) => index === 0 || seconds(item.timestamp) >= seconds(all[index - 1].timestamp)));
    assert.equal(recap.timeline.find(({ label }) => label.includes("ゲリラ配信"))?.timestamp, "2:54:21");
    assert.equal(recap.timeline.find(({ label }) => label.includes("ランキング"))?.timestamp, "2:55:55");
  });

  it("publishes the eight owner-approved real-frame stills and ZIP", async () => {
    assert.equal(recap.gallery.length, 8);
    assert.equal(recap.image, recap.gallery[6]);
    assert.equal(recap.galleryZip.label, "8枚まとめて保存");
    assert.equal(new Set(recap.gallery.map(({ src }) => src)).size, 8);
    for (const still of recap.gallery) {
      assert.match(still.src, /\/mily-b116-/);
      const file = new URL(`../public${still.src}`, import.meta.url);
      const bytes = await readFile(file);
      assert.equal(createHash("sha256").update(bytes).digest("hex"), approvedImageDigests[still.src.split("/").pop()]);
      const meta = await sharp(bytes).metadata();
      assert.equal(meta.width, 640);
      assert.equal(meta.height, 360);
      for (const field of ["exif", "xmp", "iptc"]) assert.equal(meta[field], undefined);
      assert.ok(still.alt?.includes("みりぃ"));
      assert.ok(still.caption && still.downloadName);
    }
    const zip = await readFile(new URL(`../public${recap.galleryZip.src}`, import.meta.url));
    assert.equal(zip.readUInt32LE(0), 0x04034b50);
    assert.equal(createHash("sha256").update(zip).digest("hex"), "b38c1d5ec2913f085569a5d57b3eb6e3b322f48642c5bcfe207879e215b8ba6f");
    for (const still of recap.gallery) assert.ok(zip.includes(Buffer.from(still.src.split("/").pop())));
    assert.match(recap.transcriptionNote, /実フレーム8枚/);
    assert.doesNotMatch(recap.gallery.map(s => s.alt + s.caption).join(" "), /ピース|胸元に手を添え/);
  });

  it("keeps private archive material out of the public recap", () => {
    assert.match(recap.transcriptionNote, /全編の手動聴取は実施していません/);
    assert.doesNotMatch(JSON.stringify(recap), /drive\.google|\.webm|approval-stills|transcript_chunks|C:\\/i);
  });
});
