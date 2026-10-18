import assert from "node:assert/strict";
import { test } from "node:test";
import { contest } from "../src/data/contest.ts";
import { links } from "../src/data/links.ts";
import { supportEvents, missCircleFourthRoundWebVote } from "../src/data/supportEvents.ts";
import { selectHomePrioritySupport } from "../src/lib/homePortal.ts";

const input = (time, events = supportEvents, extraLinks = []) => ({ contest, supportEvents: events, links: [...links, ...extraLinks], now: Date.parse(time) });
test("受付中の本人投票は配信イベントより先で、正しい投票先と締切を示す", () => {
  const result = selectHomePrioritySupport(input("2026-10-03T13:52:00+09:00"));
  assert.equal(result.kind, "vote");
  assert.equal(result.action.url, "https://liff.line.me/1656040756-GwmBkdPY/vote/misscircle2026/N/734");
  assert.match(result.title, /三橋莉子/);
  assert.match(result.note, /10\/12.*23:59/);
});
test("開始前は直接投票へ誘導せず、最終ミリ秒までは投票、その後は有効な応援へ切り替える", () => {
  assert.equal(selectHomePrioritySupport(input("2026-10-02T11:59:59.999+09:00")).action.url, contest.entryUrl);
  assert.equal(selectHomePrioritySupport(input("2026-10-02T12:00:00+09:00")).kind, "vote");
  const next = { ...missCircleFourthRoundWebVote, id: "next-approved-support", kind: "support-campaign", title: "次の応援", ctaLinkId: "next-approved-link", priority: 999,
    schedule: { ...missCircleFourthRoundWebVote.schedule, start: "2026-10-12T00:00:00+09:00", end: "2026-10-14T23:59:59+09:00" } };
  const events = [missCircleFourthRoundWebVote, next];
  const extra = [{ id: "next-approved-link", label: "次の応援へ", url: "https://example.com/approved" }];
  assert.equal(selectHomePrioritySupport(input("2026-10-12T23:59:59.999+09:00", events, extra)).kind, "vote");
  const result = selectHomePrioritySupport(input("2026-10-13T00:00:00+09:00", events, extra));
  assert.equal(result.kind, "support");
  assert.equal(result.action.url, extra[0].url);
  assert.equal(selectHomePrioritySupport(input("2026-10-15T00:00:00+09:00", events, extra)), null);
});
test("未確認日程・リンク欠落・終了した投票は次の応援として再表示しない", () => {
  const pending = { ...missCircleFourthRoundWebVote, schedule: { state: "date-pending" } };
  const missing = { ...missCircleFourthRoundWebVote, ctaLinkId: "missing" };
  assert.equal(selectHomePrioritySupport(input("2026-10-13T00:00:00+09:00", [missCircleFourthRoundWebVote, pending, missing])), null);
});
