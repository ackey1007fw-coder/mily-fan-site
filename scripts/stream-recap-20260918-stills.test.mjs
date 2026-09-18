import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { streamRecap20260918Asa as morning, streamRecap20260918Day as day } from "../src/data/streamRecaps.ts";
const hash = data => createHash("sha256").update(data).digest("hex");
const read = src => readFileSync(new URL(`../public${src}`, import.meta.url));
const expected = [
  {
    "slot": "morning",
    "batch": 130,
    "representative": 4,
    "hashes": [
      "df3923df488622d2d6a9b3378389c7a068c8ba3159425d000bd7d728e26110e7",
      "feb6da40fb683c45c9c8a0eacfd45a2140926402fb111d2a429e9913be1f54ee",
      "2986b3cc11e5e47e0eaa34988b25e4e6426ec8f2c1ace449e87f8e3f947b829f",
      "b1e14cab200330fe224c332b354751051b4429ff4f43eaddce2fca7e1c08be51",
      "7483bc9c754c32b02e923943d3e0673da08cc59303c6def3a833657c7c51d5ee",
      "b08ccfc1d7bae47e53ab9daba2d8266b1a087cf4029e40d114041528a7a07aaa",
      "0906d605841e4d7ea17b42174fb90cc5e381bc760d25c4c0f54035fa7eeaaea3",
      "2f31e8389bb6a389ea1831d802f82775ede525f38bde01d5fd55b18eee61ac28",
      "6ff0c03809f12dfda4201bc97dedf1d3a433254245c8789dbbaa3de212f6b35f",
      "b29c27c39e160afe675b875831c27bca43f12061feb10e05bd4e0ed78879d21c",
      "da0cc1e019b85700fc3f22bff48c728a6293bc23b1a040560e2b4d9f05f59a50",
      "d94c6de42f38b5fb2296852644a6c1e9f7282c528a048e498fbc449ee10df23a"
    ],
    "zip": {
      "src": "/media/live/mily-b130-morning-stills.zip",
      "bytes": 296330,
      "sha256": "6fb2c591576db49ede11292acda9346032e0795d7d47eb467d2df9f53b831955"
    }
  },
  {
    "slot": "day",
    "batch": 131,
    "representative": 3,
    "hashes": [
      "34e41d2a2f82f23fac32620b2e0794049906b04d4b610a9bbc703dd27ffcfa76",
      "4bb3fcca92a01b2562b5712aaeb7652d59c1e21fb2efaf14394415f13e6b91dc",
      "ceaba251b6993ceacb8807888adbcda3fe56382170d7663e3d7dec92fe26238d",
      "9bd5f624dae0a134491d5d374f8734bf9590de1ccd962a3d93fd7e7f79c74492",
      "16864a1c3b53ef8e3471542d4d61674c39f61cf2ba369e5b32eacdad33fc1e6e",
      "d38b3f2bba12916f734a40eb1dbed1eba9e49bf4e001fd548f0bab0fa0b53741",
      "3dcddb321d6211b1acaea23189955d8d9c73cd711f40cdb86440792c73408886",
      "a4432593aadc7b0df2e945657aac65a4423fb2a2021bbd7bf68d7c00c234db85",
      "14f84a775fdcfb9c360929b201c6988846292616cc7ec4c3b3e901e65a155675",
      "0eab39f9365c5a248ad88a5d8f25a4592557c09de7e60246dfae5a0b6f67c68e",
      "3cb0669f8135a646208d89da89adbd7eb28baeb532b2bdfe2dd1eaee4f3fa53a",
      "5489c5f98a2eb1ed0e3388c8a8961be6ec162d5867d4fcb7fd281a6f52842133"
    ],
    "zip": {
      "src": "/media/live/mily-b131-day-stills.zip",
      "bytes": 215408,
      "sha256": "943b74eb54dbc7633d7292311b0530ce63c57d5dcaf00e58b63597a0e745e841"
    }
  }
];
for (const [index, recap] of [morning, day].entries()) {
  const spec = expected[index];
  test(`9/18 ${spec.slot}: 実スクショ12枚と代表・保存リンクを保持する`, () => {
    assert.equal(recap.gallery?.length, 12);
    assert.equal(recap.image, recap.gallery[spec.representative - 1]);
    const actual = recap.gallery.map((image, i) => {
      assert.equal(image.src, `/media/live/mily-b${spec.batch}-${String(i + 1).padStart(2, "0")}-${spec.slot}.jpg`);
      assert.deepEqual([image.width, image.height], [640, 360]);
      assert.match(image.alt, /みりぃ/);
      assert.match(image.caption, /^\d+:\d{2}:\d{2} /);
      assert.match(image.downloadName, /20260918.+\.jpg$/);
      return hash(read(image.src));
    });
    assert.deepEqual(actual, spec.hashes);
    assert.equal(new Set(actual).size, 12);
    assert.match(recap.transcriptionNote, /実フレーム12枚/);
    assert.doesNotMatch(recap.transcriptionNote, /静止画は掲載していません/);
    assert.equal(recap.galleryZip.src, spec.zip.src);
    assert.equal(recap.galleryZip.label, "12枚まとめて保存");
    const zip = read(recap.galleryZip.src);
    assert.equal(zip.length, spec.zip.bytes);
    assert.equal(hash(zip), spec.zip.sha256);
  });
}
test("朝・昼の24枚がすべて固有で、別回の素材を混ぜない", () => {
  assert.equal(new Set(expected.flatMap(x => x.hashes)).size, 24);
  assert.equal(morning.songs?.[0].clip, undefined);
  assert.equal(day.songs, undefined);
});
