import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const landing = read("public/data-lab/index.html");
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
  assert.match(page, /22:00時点の公式最終順位・確定ポイントではありません/);
  assert.match(page, /href="\.\.\/\.\.\/"[^>]*>データラボへ戻る/);
});

test("public final-night report excludes people-specific and private analytics content", () => {
  const joined = landing + page;
  assert.doesNotMatch(joined, /chatgpt\.site|drive\.google\.com|@gmail\.com|recording[_-]?id|viewer[_-]?id|user[_-]?id|contributor[_-]?id|個別の支援者名|私的DM|https?:\/\/[^\s"']*private/i);
  assert.doesNotMatch(page, /👹|@優花子|akihisa\.takahashi|ackey1007fw|5161613/);
  assert.ok(!page.includes("<script"), "the report must remain a non-scripted aggregate page");
});
