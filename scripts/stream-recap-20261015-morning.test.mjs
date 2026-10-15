import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { streamRecap20261015Asa } from "../src/data/streamRecap20261015Asa.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const read=(path)=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const lab=JSON.parse(read("public/data-lab/data/mily-morning-20261015-aggregate.json"));
const ledger=JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));
const recap=streamRecap20261015Asa;

test("2026-10-15 morning is latest in existing LIVE STREAM without replacing older recaps",()=>{
  assert.equal(recap.id,"2026-10-15-morning-showroom");
  assert.equal(recap.dateLabel,"2026.10.15（木）");
  assert.equal(recap.platformLabel,"SHOWROOM");
  assert.match(recap.broadcastLabel,/録画開始6:02頃〜 約31分/);
  assert.equal(streamRecaps[0],recap);
  assert.deepEqual(streamRecaps.slice(1,5).map(x=>x.id),[
    "2026-10-14-night-showroom","2026-10-14-noon-showroom",
    "2026-10-14-morning-showroom","2026-10-13-night-showroom"
  ]);
  assert.equal(new Set(streamRecaps.map(x=>x.id)).size,streamRecaps.length);
});

test("editorial scenes and timestamps follow saved ASR but never imply human-verbatim confirmation",()=>{
  assert.equal(recap.highlights.length,8);
  assert.ok(recap.timeline.length>=10&&recap.timeline.length<=16);
  const toSec=x=>{const a=x.split(":").map(Number);return a[0]*3600+a[1]*60+a[2];};
  for(const field of ["highlights","timeline"]){
    const times=recap[field].map(x=>toSec(x.timestamp));
    assert.deepEqual(times,[...times].sort((a,b)=>a-b));
    assert.ok(times.every(x=>x>=0&&x<31*60),field);
  }
  assert.match(recap.summary,/発表資料|AI活用/);
  assert.match(recap.summary,/ファイナル/);
  assert.match(recap.highlights.map(x=>x.title).join(" " ),/自信|比べ/);
  assert.match(recap.highlights.map(x=>x.body).join(" "),/応援/);
  assert.deepEqual(recap.goals,[]);
  assert.equal(recap.ranking.length,1);
  assert.match(recap.ranking[0],/配信中にランキングを読み上げました。個人名は掲載していません。/);
  assert.match(recap.nextNote,/現在の確定予定としては掲載しません/);
  assert.match(recap.transcriptionNote,/全編の手動聴取は行っておらず/);
});

test("morning UI observations are reference snapshots, isolated from fourth-round score",()=>{
  assert.equal(lab.live_id,23555653);
  assert.deepEqual(
   [lab.observed_screen.stars,lab.observed_screen.total_visits,lab.observed_screen.comments],
   [2755,187,195]);
  assert.equal(lab.observed_screen.confirmed_final,false);
  assert.equal(lab.data_quality.stream_end_confirmed,false);
  assert.equal(lab.event_partition.this_broadcast_excluded_from_fourth_round_total,true);
  for(const count of ["2,755","187","195"])assert.ok(recap.transcriptionNote.includes(count),count);
  assert.match(recap.transcriptionNote,/配信終了時の確定/);
  assert.match(recap.transcriptionNote,/四次審査集計には加えません/);
  assert.ok(recap.highlights.some(x=>x.relatedLinks?.some(l=>l.url==="/data-lab/#morning-20261015")));
});

test("new report withholds unapproved imagery and sensitive audience data",()=>{
  assert.equal(recap.image,undefined);
  assert.equal(recap.gallery,undefined);
  assert.equal(recap.galleryZip,undefined);
  assert.match(recap.transcriptionNote,/静止画は掲載していません/);
  const packet=JSON.stringify(recap);
  for(const pattern of [/chatgpt\.site/i,/drive\.google/i,/@gmail/i,/\.mkv/i,/viewer[_-]?id/i,/comment[_-]?text/i,/raw[_-]?log/i,/\bhttps?:\/\//i])assert.doesNotMatch(packet,pattern);
  assert.doesNotMatch(packet,/個人名を挙げて/);
  assert.ok(recap.sourceLabel.includes("速報自動文字起こし"));
});

test("new ledger faithfully records the report source, caution and order",()=>{
  assert.equal(ledger[0].id,recap.id);
  assert.equal(ledger[0].source,recap.sourceLabel);
  assert.equal(ledger[0].originalNote,recap.transcriptionNote);
  assert.equal(ledger[1].id,"2026-10-14-night-showroom");
  assert.equal(ledger.filter(x=>x.id===recap.id).length,1);
  assert.match(ledger[0].display.material,/自動文字起こし/);
  assert.equal(ledger[0].verifiedAt,recap.verifiedAt);
});
