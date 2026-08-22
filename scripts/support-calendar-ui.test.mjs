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
    assert.match(page, /manualStreamSlots: manualSlots/);
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

  it("keeps the confirmed manual fallback independent of API availability", () => {
    const page = source("src/SupportPage.tsx");
    const calendar = source("src/lib/supportCalendar.ts");
    assert.match(page, /const \{ slots, manualSlots, roomUrl, availability \}/);
    // availability は warning 用にそのまま渡し、fallback の有無で成功へ偽装しない。
    assert.match(page, /streamAvailability: availability/);
    assert.doesNotMatch(page, /availability = "ok"/);
    assert.match(calendar, /function selectStreamSlots/);
    assert.match(
      calendar,
      /availability === "ok" \? streamSlots : manualStreamSlots/,
    );
    assert.match(calendar, /manualStreamSlots\?: StreamSlot\[\]/);
    assert.doesNotMatch(
      calendar,
      /streamAvailability === "ok" \? adaptStreamSlots/,
    );
  });

  it("announces the schedule availability change in a scoped polite status region", () => {
    const page = source("src/SupportPage.tsx");
    const region =
      /<div\s+role="status"\s+aria-live="polite"\s+aria-atomic="true"[\s\S]*?data-testid="schedule-availability-status"[\s\S]*?<\/div>/;
    assert.match(page, region);
    const [availabilityRegion] = page.match(region);
    assert.match(availabilityRegion, /SHOWROOMの配信予定を確認しています/);
    assert.match(availabilityRegion, /SHOWROOMの配信予定を取得できませんでした/);
    // agenda 本体・pending・NOW は live region に含めない。
    assert.doesNotMatch(availabilityRegion, /確認済み予定の日付別一覧/);
    assert.doesNotMatch(availabilityRegion, /CalendarItemCard/);
    assert.doesNotMatch(availabilityRegion, /showroomSchedule === "ok"/);

    // P4 の NOW live region は別に残っている。
    const liveRegions = page.match(/role="status"/g) ?? [];
    assert.equal(liveRegions.length, 2);
    assert.match(page, /role="status" aria-live="polite" aria-atomic="true">\s*\{nowItems/);
    assert.doesNotMatch(page, /role="alert"|aria-live="assertive"/);
    assert.doesNotMatch(
      page,
      /aria-live[\s\S]{0,80}<SupportCalendarAgenda/,
    );
  });

  it("shows the end date for cross-day timed items only when the end is confirmed", () => {
    const page = source("src/SupportPage.tsx");
    assert.match(page, /scheduleTimeLabel\(item\)/);
    assert.match(page, /isCrossDayTimedItem\(item\) && item\.endDate !== null/);
    assert.match(page, /formatShortTokyoDate\(item\.date\)/);
    assert.match(page, /formatShortTokyoDate\(item\.endDate\)/);
    assert.match(page, /日をまたぎます/);
    // 既存の all-day 期間表示は維持する。
    assert.match(page, /item\.allDay && item\.span && item\.span\.start !== item\.span\.end/);
  });

  it("shows only confirmed times, safe links, and the radio disclaimer", () => {
    const page = source("src/SupportPage.tsx");
    const calendar = source("src/lib/supportCalendar.ts");
    assert.match(calendar, /item\.endTime === null[\s\S]*?`\$\{item\.startTime\} 開始`/);
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
