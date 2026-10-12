import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const landing = read("data-lab/index.html");
const page = read("public/data-lab/reports/20261012-final-night/index.html");

test("the existing MILY SIGNAL page links to the October 12 final night report", () => {
  assert.match(landing, /id="final-night"/);
  assert.match(landing, /href="reports\/20261012-final-night\/"/);
  assert.match(landing, /id="now"/);
  assert.match(landing, /noindex,nofollow,noarchive/);
});

test("the final-night report keeps the cutoff, timestamps and provisional nature of counts", () => {
  assert.match(page, /MILY SIGNAL/);
  assert.match(page, /noindex,nofollow,noarchive/);
  for (const literal of ["22:00", "21:59:23", "22:00:42", "23:19:30", "6,140", "6,150", "7,271",
                        "1,121〜1,131", "579〜650", "712,986", "21:37", "8,938", "11,880"]) {
    assert.ok(page.includes(literal), `missing evidence: ${literal}`);
  }
  assert.match(page, /<svg[^>]+role="img"/);
  assert.match(page, /配信中の参考カウンター/);
  assert.match(page, /nao\.qa\/ap\/comment\.php\?id=573253/);
  assert.match(page, /22:00時点の公式最終順位・確定ポイントではありません/);
  assert.match(page, /href="\.\.\/\.\.\/"[^>]*>データラボへ戻る/);
});

test("public final-night report excludes people-specific and private analytics content", () => {
  const joined = landing + page;
  assert.doesNotMatch(joined, /chatgpt\.site|drive\.google\.com|@gmail\.com|recording[_-]?id|viewer[_-]?id|user[_-]?id|contributor[_-]?id|個別の支援者名|私的DM|https?:\/\/[^\s"']*private/i);
  assert.doesNotMatch(page, /"display_name"|"user_id"|"viewer_id"|"individual_gift_log"/i);
  const evidence = JSON.parse(read("public/data-lab/data/final-night-sources-20261012.json"));
  assert.equal(evidence.counter_observations.length, 3);
  assert.deepEqual(evidence.counter_observations.map(x => x.stars), [6140, 6150, 7271]);
  assert.deepEqual(evidence.uncertainty.post_cutoff_stars_range, [1121, 1131]);
  assert.equal(evidence.uncertainty.official_final_event_point, null);
  const previous = evidence.cross_day_anonymized_inputs.filter(x => x.date === "2026-10-11");
  const finalDay = evidence.cross_day_anonymized_inputs.filter(x => x.date === "2026-10-12");
  assert.equal(previous.reduce((sum,x) => sum+x.stars,0),8938);
  assert.equal(finalDay.reduce((sum,x) => sum+x.stars,0),11880);
  assert.equal(evidence.cross_day_comparison.change_percent_rounded_one_decimal,32.9);
  assert.ok(evidence.cross_day_anonymized_inputs.every(x => x.observed_at_jst && x.complete_capture === false));
  assert.ok(!JSON.stringify(evidence).includes("recording_ended_at_jst"));
  assert.ok(!JSON.stringify(evidence).includes("counter_last_valid_is_after_recording_end"));
  assert.ok(!JSON.stringify(evidence).includes("display_name"));
  assert.ok(!page.includes("<script"), "the report must remain a non-scripted aggregate page");
});
