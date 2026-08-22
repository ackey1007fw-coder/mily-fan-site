import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = (relative) => readFileSync(path.join(root, relative), "utf8");

describe("Support Calendar agenda UI", () => {
  it("renders one semantic vertical agenda grouped by JST date", () => {
    const page = source("src/SupportPage.tsx");
    assert.match(page, /function SupportCalendarAgenda/);
    assert.match(page, /title="Support Calendar"/);
    assert.match(page, /timeZone: "Asia\/Tokyo"/);
    assert.match(page, /<ol[^>]+aria-label="確認済み予定の日付別一覧"/);
    assert.match(page, /<h3[\s\S]*?<time dateTime=\{day\.date\}>/);
    assert.match(page, /day\.items\.map/);
    assert.match(page, /min-w-0/);
    assert.match(page, /break-words/);
    assert.doesNotMatch(page, /grid-cols-7|月間Calendar|monthly/i);
  });

  it("uses the derived calendar result for all five sources and pending", () => {
    const page = source("src/SupportPage.tsx");
    assert.match(page, /buildSupportCalendar\(\{/);
    assert.match(page, /contest,/);
    assert.match(page, /supportEvents,/);
    assert.match(page, /fanEvents: events/);
    assert.match(page, /streamSlots: slots/);
    assert.match(page, /includeRadio: true/);
    assert.match(page, /const pendingItems = calendar\.pending/);
    assert.doesNotMatch(page, /selectSupportPending/);
  });

  it("distinguishes loading, unavailable, and ok with zero SHOWROOM rows", () => {
    const page = source("src/SupportPage.tsx");
    assert.match(page, /showroomSchedule === "loading"/);
    assert.match(page, /SHOWROOMの配信予定を確認しています/);
    assert.match(page, /showroomSchedule === "unavailable"/);
    assert.match(page, /SHOWROOMの配信予定を取得できませんでした/);
    assert.doesNotMatch(page, /今日は配信なし|今後配信予定なし|予定なし/);
  });

  it("shows only confirmed times, safe links, and the radio disclaimer", () => {
    const page = source("src/SupportPage.tsx");
    const calendar = source("src/lib/supportCalendar.ts");
    assert.match(page, /item\.endTime === null[\s\S]*?`\$\{item\.startTime\} 開始`/);
    assert.match(page, /<ActionLink action=\{item\.cta\}/);
    assert.match(page, /<ExternalLink href=\{item\.source\}/);
    assert.match(calendar, /番組枠です。みりぃ本人の出演時間とは限りません。/);
    assert.doesNotMatch(page, /みりぃ出演中|みりぃの出演時間/);
  });

  it("keeps P4 NOW accessibility and P6 top integration out of scope", () => {
    const page = source("src/SupportPage.tsx");
    assert.match(page, /role="status" aria-live="polite" aria-atomic="true"/);
    assert.doesNotMatch(source("src/App.tsx"), /SupportPage|\/support\//);
    assert.doesNotMatch(source("src/components/TodayDashboard.tsx"), /Support Calendar/);
  });
});
