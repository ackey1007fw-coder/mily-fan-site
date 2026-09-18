import assert from "node:assert/strict";
import test from "node:test";
import { streamRecaps, streamRecap20260918Asa as morning, streamRecap20260918Day as day, streamRecap20260917Yoru } from "../src/data/streamRecaps.ts";
import { buildRankingNote, RANKING_NOTE_WITHOUT_RANGE } from "../src/data/streamRecapRules.ts";
import { withoutApprovedSongLinks } from "./approved-song-links.mjs";
const seconds = value => value.split(":").reduce((total, part) => total * 60 + Number(part), 0);

test("9/18は昼、朝、9/17夜の順で各回を一度だけ登録する", () => {
  const index = streamRecaps.indexOf(day);
  assert.ok(index >= 0);
  assert.deepEqual(streamRecaps.slice(index, index + 3), [day, morning, streamRecap20260917Yoru]);
  for (const recap of [day, morning]) {
    assert.equal(streamRecaps.filter(item => item.id === recap.id).length, 1);
    assert.equal(recap.dateLabel, "2026.09.18（金）");
    assert.equal(recap.verifiedAt, "2026-09-18");
  }
});

test("保存録画の範囲全体と手動聴取・完全収録を区別する", () => {
  for (const [recap, duration, count, label] of [[morning, 6467.158, 2401, "5:01頃〜 約108分"], [day, 8108.622, 282, "13:40頃〜 約135分"]]) {
    assert.equal(recap.broadcastLabel, label);
    assert.ok(recap.transcriptionNote.includes(`${duration}秒`));
    assert.ok(recap.transcriptionNote.includes(`${count}区間`));
    assert.match(recap.transcriptionNote, /保存録画範囲全体/);
    assert.match(recap.transcriptionNote, /全編の手動聴取は行っておらず/);
    assert.match(recap.transcriptionNote, /完全収録は保証しません/);
    assert.ok(recap.highlights.every(item => seconds(item.timestamp) < duration));
    assert.ok(recap.timeline.every(item => seconds(item.timestamp) < duration));
    assert.ok(seconds(recap.timeline.at(-1).timestamp) > duration - 120);
  }
});

test("朝の歌唱1曲を原曲関連動画と結び、昼の予告とは混同しない", () => {
  assert.equal(morning.songs?.length, 1);
  assert.equal(morning.songs[0].title, "ぼよよん行進曲");
  assert.equal(morning.songs[0].timestamp, "1:24:08");
  assert.equal(morning.songs[0].youtubeUrl, "https://www.youtube.com/watch?v=nAjJluQCSGE");
  assert.match(morning.songs[0].youtubeVersionNote, /企画動画.*原盤音源とは異なります/);
  assert.equal(morning.songs[0].clip, undefined);
  assert.equal(day.songs, undefined);
  assert.match(day.transcriptionNote, /夜の歌唱予告と区別/);
});

test("昼の連続記録、きっかけ終了、申請と配布を区別する", () => {
  assert.match(day.transcriptionNote, /修復済み記録/);
  assert.match(day.transcriptionNote, /短い重複録画との連結はしていません/);
  assert.ok(day.timeline.some(item => /きっかけ配信から通常配信へ/.test(item.label)));
  const avatar = day.highlights.find(item => /アバター/.test(item.title));
  assert.match(avatar.body, /申請.*通った/);
  assert.match(avatar.body, /いつ配布されるのかはまだ分からない/);
});

test("ランキングの確定範囲と配信時点の次枠を保持する", () => {
  assert.deepEqual(morning.ranking, [buildRankingNote(13, 1)]);
  assert.deepEqual(day.ranking, [RANKING_NOTE_WITHOUT_RANGE]);
  assert.match(morning.nextNote, /^配信時点では.*13:40.*14:40/);
  assert.match(day.nextNote, /^配信時点では.*時刻は決まり次第ファンルーム/);
  assert.doesNotMatch(day.nextNote, /23:00|22:00|必ず/);
});

test("実スクショのみを追加し、生成コラージュ・非公開素材を混ぜない", () => {
  for (const recap of [morning, day]) {
    assert.ok(recap.image);
    assert.equal(recap.gallery?.length, 12);
    assert.ok(recap.galleryZip);
    assert.match(recap.transcriptionNote, /静止画は録画の実フレーム12枚/);
    assert.doesNotMatch(withoutApprovedSongLinks(JSON.stringify(recap)), /https?:\/\/|drive\.google|docs\.google|room_id|live_id|\.mkv|\.flac|[\\/]Users[\\/]|承認待ち|準備中|各SNSでも公開中|あっきー|アッキー/i);
  }
});
