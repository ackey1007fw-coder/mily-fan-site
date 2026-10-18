import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const raw = read("public/data-lab/data/mily-comment-velocity-history-20261010-16.json");
const d = JSON.parse(raw);
const latest = JSON.parse(read("public/data-lab/data/mily-night-20261016-aggregate.json"));
const page = read("data-lab/comment-velocity/index.html");
const homeLab = read("data-lab/index.html");
const script = read("public/data-lab/assets/velocity.js");
const css = read("public/data-lab/assets/velocity.css");

test("historical archive includes the observed dates, keeps unknown broadcasts unknown", () => {
  assert.equal(d.schema, 1);
  assert.equal(d.sessions.length, 12);
  assert.equal(d.capture_full_confirmed, false);
  assert.deepEqual(d.sessions.map(s => s.live_id), [
    23534612, 23536776, 23538599, 23540963, 23542891, 23545277,
    23547116, 23550160, 23551572, 23552113, 23555653, 23559940
  ]);
  assert.deepEqual(d.unavailable.map(x => [x.date_jst,x.slot]),[
    ["2026-10-14","night"],["2026-10-15","night"]
  ]);
  assert.ok(d.unavailable.every(x => x.reason && !("comments" in x)));
  assert.equal(latest.live_id,23562541);
  assert.equal(latest.comment_velocity.windows.length,8);
  assert.ok(!d.sessions.some(x => x.live_id === latest.live_id),"night data is kept as one separate primary source");
});

test("historical five-minute windows come from valid online counter differences, not invented minutes", () => {
  assert.equal(d.sessions.reduce((total,s) => total+s.observed_windows.length,0),136);
  for(const session of d.sessions){
    assert.ok(session.valid_rows>=10 && session.valid_rows<=session.stored_rows,session.live_id);
    assert.equal(session.data_quality.capture_complete,false);
    assert.equal(session.data_quality.official_final_confirmed,false);
    assert.equal(session.data_quality.time_basis,"visible UI elapsed seconds");
    assert.ok(session.observed_windows.length>=3,session.live_id);
    assert.ok(session.observed_span.duration_seconds>0);
    assert.ok(session.observed_span.added_comments>=0);
    assert.equal(session.observed_span.per_minute,
      +(60*session.observed_span.added_comments/session.observed_span.duration_seconds).toFixed(2));
    let prevStart=-1;
    for(const w of session.observed_windows) {
      assert.equal(w.to_elapsed_seconds-w.from_elapsed_seconds,w.duration_seconds);
      assert.ok(w.duration_seconds>=220 && w.duration_seconds<=380);
      assert.ok(w.added_comments>=0);
      assert.equal(w.per_minute,+(60*w.added_comments/w.duration_seconds).toFixed(2));
      assert.ok(w.from_elapsed_seconds>prevStart);
      assert.ok(Date.parse(w.from)<Date.parse(w.to));
      assert.match(w.from,/\+09:00$/);
      assert.match(w.to,/\+09:00$/);
      prevStart=w.from_elapsed_seconds;
    }
  }
});

test("contest boundary and known previously-published counter endpoints stay separated",()=>{
  for (const s of d.sessions) {
    const phase=s.date_jst<="2026-10-12" ? "fourth_round":"after_fourth_round";
    assert.equal(s.phase,phase,`${s.date_jst} ${s.slot}`);
  }
  assert.equal(d.sessions.find(x=>x.live_id===23552113).observed_last.comments,416);
  assert.equal(d.sessions.find(x=>x.live_id===23551572).observed_last.comments,370);
  assert.equal(d.sessions.find(x=>x.live_id===23555653).observed_last.comments,195);
  assert.equal(d.sessions.find(x=>x.live_id===23559940).observed_last.comments,338);
  assert.equal(latest.comment_velocity.overall.per_minute,7.35);
  assert.equal(latest.observed_screen.confirmed_final,false);
  assert.equal(latest.event_partition.this_broadcast_excluded_from_fourth_round_total,true);
});

test("new standalone archive page is built and linked without changing historical data lab",()=>{
  const vite = read("vite.config.ts");
  assert.match(vite,/dataLabVelocity:\s*"data-lab\/comment-velocity\/index\.html"/);
  assert.match(homeLab,/href="\/data-lab\/comment-velocity\/"/);
  assert.match(page,/href="\/data-lab\/assets\/velocity\.css"/);
  assert.match(page,/src="\/data-lab\/assets\/velocity\.js"/);
  assert.match(page,/noindex,nofollow,noarchive/);
  assert.match(page,/https:\/\/mily-fan-site\.vercel\.app\/data-lab\/comment-velocity\//);
  for(const id of ["velocity-run-picks","velocity-chart","velocity-panel","velocity-archive-body","velocity-table-body"]){
    assert.ok(page.includes('id="'+id+'"'),id);
  }
  assert.match(script,/data-velocity-phase/);
  assert.match(script,/after_fourth_round/);
  assert.match(script,/capture|観測|未取得/);
  assert.match(script,/Missing analysis source/);
  assert.match(css,/\.velocity-chart-scroll/);
  assert.match(css,/@media\(max-width:650px\)/);
});

test("published velocity archive is anonymous and avoids unsupported audience conclusions",()=>{
  for(const source of [raw,page,script]){
    assert.doesNotMatch(source,/\bviewer[_-]?id\b|\bcomment[_-]?text\b|\braw[_-]?logs?\b|\buser[_-]?id\b|[A-Z]:\\Users\\|@gmail\.com|chatgpt\.site/i);
  }
  assert.match(page,/分速の増減だけから/);
  assert.match(page,/欠測区間は0として補わず/);
  assert.match(page,/全員のユニーク投稿者数とも扱いません/);
});
