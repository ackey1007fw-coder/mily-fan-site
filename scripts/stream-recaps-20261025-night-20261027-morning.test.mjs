import test from "node:test";
import assert from "node:assert/strict";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";

const expected = [
  { id: "2026-10-25-night-showroom", label: "2026.10.25（日）", duration: 8032.742, stamps: ["0:03:01", "0:22:15", "0:37:40", "1:54:10", "1:55:48", "2:09:49"] },
  { id: "2026-10-27-morning-showroom", label: "2026.10.27（火）", duration: 2663.289, stamps: ["0:03:20", "0:10:40", "0:15:47", "0:29:05", "0:37:12", "0:44:03"] },
];
for (const item of expected) {
  test(`${item.id}: single source-qualified entry without invented media, songs or clock times`, () => {
    const matches = streamRecaps.filter(recap => recap.id === item.id);
    assert.equal(matches.length, 1);
    const recap = matches[0];
    assert.equal(recap.dateLabel, item.label);
    assert.match(recap.broadcastLabel, /^録画開始/);
    assert.equal(recap.timestampBasis, undefined);
    assert.deepEqual(recap.highlights.map(h => h.timestamp), item.stamps);
    for (const h of recap.highlights) {
      const [hour, minute, second] = h.timestamp.split(":").map(Number);
      assert.ok(hour * 3600 + minute * 60 + second < item.duration);
      assert.ok(!h.quote && !h.clip && !h.socialClip);
    }
    if (item.id === "2026-10-25-night-showroom") {
      assert.equal(recap.image.src, "/media/live/mily-b239-01-night-thanks-face-safe.jpg");
      assert.equal(recap.image.width, 130); assert.equal(recap.image.height, 200);
    } else assert.equal(recap.image, undefined);
    assert.equal(recap.gallery, undefined);
    assert.equal(recap.songs, undefined);
    assert.deepEqual(recap.ranking, []);
    assert.equal(recap.nextNote, "");
    const disclosure = recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote);
    assert.match(disclosure.material, /自動文字起こし/);
    assert.match(disclosure.verification.join(""), /非逐語の暫定/);
    assert.match(disclosure.verification.join(""), /映像PTSとの同期は未検証/);
    assert.match(disclosure.verification.join(""), /手動聴取・逐語校正は未実施/);
    assert.match(disclosure.verification.join(""), /全編の無欠落を確認したものではありません/);
    assert.match(disclosure.verification.join(""), /歌唱の有無・曲名は未確定/);
    assert.doesNotMatch(JSON.stringify(recap), /drive\.google|@gmail|\.mkv|C:\\Users|\.jsonl|chatgpt\.site/);
  });
}

test("the new dates preserve the existing October 26 memo and October 25 morning", () => {
  const ids = streamRecaps.map(recap => recap.id);
  assert.ok(ids.indexOf(expected[1].id) < ids.indexOf("2026-10-26-night-showroom"));
  assert.ok(ids.indexOf("2026-10-26-night-showroom") < ids.indexOf(expected[0].id));
  const morning25 = streamRecaps.findIndex(recap => recap.date === "2026-10-25" && recap.id !== expected[0].id);
  assert.ok(morning25 > ids.indexOf(expected[0].id));
});
