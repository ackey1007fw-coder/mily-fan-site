import assert from "node:assert/strict";
import { test } from "node:test";
import { fourthRoundDailyVote } from "../src/lib/fourthRoundDailyVote.ts";
import { selectHomePrioritySupport } from "../src/lib/homePortal.ts";
import { contest } from "../src/data/contest.ts";
import { links } from "../src/data/links.ts";
import { supportEvents, missCircleThirdRoundWebVote } from "../src/data/supportEvents.ts";

test("本人案内の日次投票と正式締切を区別し、本人の確認済みSNSへ案内する", () => {
  const guide=fourthRoundDailyVote(Date.parse("2026-10-03T15:00:00+09:00"));
  assert.match(guide.dailyLabel,/本人の案内.*毎日1日1回/);
  assert.match(guide.deadline,/2026年10月12日.*23:59.*日本時間/);
  assert.match(guide.benefitNote,/コンプリートありがとう動画.*1人ずつ別の動画/);
  assert.match(guide.benefitNote,/報告先は後日案内/);
  assert.equal(guide.announcement.url,"https://x.com/Mily_chan36/status/2105843753768612039");
  assert.equal(guide.dailySource.url,"https://x.com/Mily_chan36/status/2105854169433464969");
  assert.deepEqual(guide.contacts.map(x=>x.url),["https://x.com/Mily_chan36","https://www.instagram.com/mily_chan36"]);
  assert.ok(guide.contacts.every(x=>/確認/.test(x.label)));
  assert.doesNotMatch(JSON.stringify(guide),/スクショ|証拠画像|DMを送|申込期限|応募先|全11日|全10日/);
});
test("受付開始から最終ミリ秒まで表示し、期限後は特典・連絡案内ごと外す", () => {
  assert.equal(fourthRoundDailyVote(Date.parse("2026-10-02T11:59:59.999+09:00")),null);
  assert.ok(fourthRoundDailyVote(Date.parse("2026-10-02T12:00:00+09:00")));
  assert.ok(fourthRoundDailyVote(Date.parse("2026-10-12T23:59:59.999+09:00")));
  assert.equal(fourthRoundDailyVote(Date.parse("2026-10-13T00:00:00+09:00")),null);
});
test("優先カードの四次投票だけに特典案内を追加し三次履歴へ混ぜない", () => {
  const input={contest,links,supportEvents,now:Date.parse("2026-10-03T15:00:00+09:00")};
  assert.ok(selectHomePrioritySupport(input).dailyVote);
  assert.equal(selectHomePrioritySupport({...input,now:Date.parse("2026-09-03T15:00:00+09:00"),supportEvents:[missCircleThirdRoundWebVote]}).dailyVote,undefined);
  assert.equal(selectHomePrioritySupport({...input,now:Date.parse("2026-10-13T00:00:00+09:00")})?.dailyVote,undefined);
});
