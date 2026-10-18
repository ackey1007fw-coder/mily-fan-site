import assert from "node:assert/strict";
import test from "node:test";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const current = streamRecaps.slice(0, 3);
const latest = current.slice(0, 2);
const ids = [
  "2026-10-18-morning-showroom",
  "2026-10-17-night-showroom",
  "2026-10-17-morning-showroom",
];

test("10/18 morning and 10/17 night are exactly once, newer than the existing 10/17 morning", () => {
  assert.deepEqual(current.map((x) => x.id), ids);
  assert.ok(latest.every((x) => x.platformLabel === "SHOWROOM"));
  assert.equal(streamRecaps.filter((x) => x.id === ids[0]).length, 1);
  assert.equal(streamRecaps.filter((x) => x.id === ids[1]).length, 1);
  assert.equal(latest[0].dateLabel, "2026.10.18（日）");
  assert.equal(latest[1].dateLabel, "2026.10.17（土）");
});

test("each item uses actual ASR limitations and the corresponding data lab link", () => {
  const expectations = [
    { id: ids[0], chunks: "339処理チャンク", recording: "約113分06秒", url: "/data-lab/reports/20261018-morning/" },
    { id: ids[1], chunks: "147処理チャンク", recording: "約49分08秒", url: "/data-lab/reports/20261017-night/" },
  ];
  expectations.forEach(({ id, chunks, recording, url }, index) => {
    const x = latest[index];
    assert.equal(x.id, id);
    assert.match(x.sourceLabel, /保存録画の速報自動文字起こし/);
    assert.ok(x.transcriptionNote.includes(chunks));
    assert.ok(x.transcriptionNote.includes(recording));
    assert.ok(x.transcriptionNote.includes("全編の手動聴取"));
    assert.ok(x.transcriptionNote.includes("静止画は掲載していません"));
    assert.ok(x.transcriptionNote.includes("配信終了時の確定値"));
    assert.ok(x.highlights.some((h) => h.relatedLinks?.some((link) => link.url === url)));
    assert.equal(x.nextNote, "");
    assert.deepEqual(x.ranking, []);
    assert.deepEqual(x.goals, []);
  });
});

test("timestamps stay within saved duration and text remains grounded", () => {
  const seconds = (s) => s.split(":").map(Number).reduce((total, n) => total * 60 + n, 0);
  [6785.92, 2947.513].forEach((max, index) => {
    const x = latest[index];
    assert.ok(x.highlights.length >= 4 && x.highlights.length <= 8);
    assert.ok(x.timeline.length >= x.highlights.length && x.timeline.length <= 16);
    for (const group of [x.highlights, x.timeline]) {
      let previous = -1;
      for (const h of group) {
        assert.match(h.timestamp, /^\d:[0-5]\d:[0-5]\d$/);
        const next = seconds(h.timestamp);
        assert.ok(next > previous, x.id + " " + h.timestamp);
        assert.ok(next < max, "past recorder duration: " + next);
        previous = next;
      }
    }
  });
});

test("no viewer details, private records, unapproved stills, or invented song IDs leak publicly", () => {
  for (const r of latest) {
    assert.equal(r.image, undefined);
    assert.equal(r.gallery, undefined);
    assert.equal(r.songs, undefined);
    assert.equal(r.approvedSongClips, undefined);
    const publicText = JSON.stringify(r);
    assert.doesNotMatch(publicText, /drive\\.google|chatgpt\\.site|@gmail\\.com|viewer[_-]?id|個人別ランキング|[A-Z]:\\\\Users\\\\|transcript\\.jsonl|live23568|live23567/);
    assert.doesNotMatch(publicText, /歌詞全文|病名|私的DM|友人の氏名/);
    assert.ok(r.summary.length <= 140);
    assert.ok(r.highlights.every((x) => x.body.length <= 100 && x.title.length <= 20));
  }
});
