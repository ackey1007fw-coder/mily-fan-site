import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { radioProgram } from "../shared/radio-program.js";
import { activities } from "../src/data/activities.ts";
import { contest } from "../src/data/contest.ts";
import { supportEvents } from "../src/data/supportEvents.ts";
import { deriveBannerState } from "../src/lib/bannerState.ts";
import { selectHomeToday } from "../src/lib/homeToday.ts";
import {
  hubNavigation,
  sectionNavigation,
  visibleNavItems,
} from "../src/lib/navigation.ts";
import { SUPPORT_HUB_ROUTE } from "../src/lib/supportHub.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = (relative) => readFileSync(path.join(root, relative), "utf8");

/**
 * コメントを外したソース。ルールを説明する日本語コメント自身が
 * 「その語を含まないこと」のassertionに引っかからないようにする。
 */
const code = (relative) =>
  source(relative)
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

const ACTIVITIES_HUB_ROUTE = "/activities/";

const NONE_BANNER = { kind: "NONE", stateLabel: "", title: "" };

const unknownLive = {
  state: "unknown",
  startedAt: null,
  observedAt: null,
  roomUrl: null,
  next: { state: "unknown", at: null },
};

function homeToday(overrides = {}) {
  const input = {
    contest,
    supportEvents: [],
    streamSlots: [],
    streamRoomUrl: null,
    live: unknownLive,
    radio: null,
    radioPhase: "idle",
    now: Date.parse("2026-08-22T12:00:00+09:00"),
    ...overrides,
  };
  return selectHomeToday({
    ...input,
    banner:
      overrides.banner ??
      deriveBannerState(
        { live: input.live, radio: input.radio, slots: input.streamSlots },
        input.now,
      ),
  });
}

describe("P6 home information architecture", () => {
  it("orders the home as Hero → TodayDashboard → Support → Activities gateway", () => {
    const app = source("src/App.tsx");
    const at = (tag) => app.indexOf(tag);
    for (const tag of [
      "<Hero />",
      "<TodayDashboard />",
      "<Support />",
      "<ActivitiesGateway />",
      "<StreamSchedule />",
      "<Latest />",
    ]) {
      assert.ok(at(tag) >= 0, `${tag} must render on the home page`);
    }
    assert.ok(at("<Hero />") < at("<TodayDashboard />"));
    assert.ok(at("<TodayDashboard />") < at("<Support />"));
    assert.ok(at("<Support />") < at("<ActivitiesGateway />"));
    assert.ok(at("<ActivitiesGateway />") < at("<StreamSchedule />"));
    assert.ok(at("<StreamSchedule />") < at("<Latest />"));
  });

  it("puts a /support/ CTA on the home page", () => {
    const support = source("src/components/Support.tsx");
    assert.equal(SUPPORT_HUB_ROUTE, "/support/");
    assert.match(support, /SUPPORT_HUB_ROUTE/);
    assert.match(support, /Support Hubを見る/);
    // ルート文字列はSupport domainの正本から読む（ホームで再保存しない）
    assert.doesNotMatch(support, /href="\/support\/"/);
  });

  it("puts an /activities/ CTA on the home page", () => {
    const gateway = source("src/components/ActivitiesGateway.tsx");
    assert.match(gateway, /ACTIVITIES_HUB_ROUTE/);
    assert.match(gateway, /Activities Hubを見る/);
    assert.doesNotMatch(gateway, /href="\/activities\/"/);
  });
});

describe("P6 navigation", () => {
  it("makes Activities and Support first-class navigation", () => {
    const hubs = hubNavigation();
    assert.deepEqual(
      hubs.map(({ href }) => href),
      [ACTIVITIES_HUB_ROUTE, SUPPORT_HUB_ROUTE, "/profile/"],
    );
    for (const item of hubs) assert.equal(item.kind, "route");

    const items = visibleNavItems(0);
    assert.deepEqual(items.slice(0, 3), hubs);
    assert.equal(
      items.findIndex(({ href }) => href === ACTIVITIES_HUB_ROUTE),
      0,
    );
  });

  it("keeps the existing home anchors reachable and the header uncrowded", () => {
    const anchors = sectionNavigation(0).map(({ href }) => href);
    assert.deepEqual(anchors, ["#latest", "#stories", "#gallery", "#links"]);
    assert.ok(
      sectionNavigation(1).some(({ href }) => href === "#schedule"),
      "the schedule anchor comes back once events exist",
    );
    // Hub route を足しても desktop header を 8〜9 項目にしない
    assert.ok(visibleNavItems(0).length <= 7);
    assert.ok(visibleNavItems(1).length <= 8);
    for (const item of sectionNavigation(1)) assert.equal(item.kind, "anchor");
  });

  it("renders both nav groups with labelled navs and 44px touch targets", () => {
    const header = source("src/components/Header.tsx");
    assert.match(header, /hubNavigation\(\)/);
    assert.match(header, /sectionNavigation\(events\.length\)/);
    assert.match(header, /aria-label="サイトナビ"/);
    assert.match(header, /aria-label="サイトナビ（小さい画面用）"/);
    assert.match(header, /flex-wrap/);
    assert.doesNotMatch(header, /overflow-x-auto/);
    assert.doesNotMatch(header, /min-h-10\b/);
    // 小さい画面のpillは44px以上のtouch targetを保つ
    assert.match(header, /const compactHubLink =\n\s+"inline-flex min-h-11/);
    assert.match(header, /const compactSectionLink =\n\s+"inline-flex min-h-11/);
    // 1行に詰め込みすぎないよう、狭い幅では2段目のpill列へ送る
    assert.match(header, /hidden [^"]*md:flex/);
    assert.match(header, /md:hidden/);
  });
});

describe("P6 mobile action dock", () => {
  it("reaches the Support route and stays a single row", () => {
    const dock = source("src/components/MobileActionDock.tsx");
    assert.match(dock, /SUPPORT_HUB_ROUTE/);
    assert.match(dock, /応援・予定/);
    assert.match(dock, /fixed inset-x-0 bottom-0 z-30/);
    assert.match(dock, /safe-area-inset-bottom/);
    assert.match(dock, /sm:hidden/);
    assert.match(dock, /min-h-11/);
    // 2ボタン1段を維持する（3つに増やさない）
    assert.equal((dock.match(/<a\b/g) ?? []).length, 2);
    // 固定ドックの分だけ本文の下に余白を残す
    assert.match(source("src/App.tsx"), /pb-20/);
  });

  it("takes the ENTRY URL and number from contest.ts", () => {
    const dock = source("src/components/MobileActionDock.tsx");
    assert.match(dock, /contest\.entryUrl/);
    assert.match(dock, /contest\.entryNumber/);
    assert.doesNotMatch(dock, /2026\.misscircle\.jp/);
  });
});

describe("P6 SSOT reuse and duplication", () => {
  it("drops the old hardcoded VOTE_URL from the Support component", () => {
    const support = source("src/components/Support.tsx");
    assert.doesNotMatch(support, /VOTE_URL/);
    assert.doesNotMatch(support, /2026\.misscircle\.jp/);
    assert.match(support, /contest\.entryUrl/);
  });

  it("builds TodayDashboard from the Support domain selectors", () => {
    const dashboard = source("src/components/TodayDashboard.tsx");
    const home = source("src/lib/homeToday.ts");
    assert.match(dashboard, /selectHomeToday/);
    assert.match(home, /selectSupportToday\(\{/);
    assert.match(home, /selectSupportNow\(\{/);
    // ホーム側で今日/今の意味を作り直さない（selectorはhomeToday経由だけ）
    assert.doesNotMatch(code("src/components/TodayDashboard.tsx"), /supportHub/);
    assert.doesNotMatch(dashboard, /fetch\(|setInterval\(|createPollStore/);
    assert.match(dashboard, /useStreamSchedule/);
    assert.match(dashboard, /useMilyRealtimeStatus/);
  });

  it("uses activities.ts only for identity and navigation", () => {
    const gateway = source("src/components/ActivitiesGateway.tsx");
    assert.match(gateway, /activities\.map/);
    assert.match(gateway, /activity\.label/);
    assert.match(gateway, /activity\.route/);
    for (const label of activities.map(({ label }) => label)) {
      assert.doesNotMatch(
        gateway,
        new RegExp(`"${label}"`),
        `${label} must come from activities.ts, not a copy`,
      );
    }
    // 状態（rank / phase / 期間）をActivity導線へコピーしない
    const gatewayCode = code("src/components/ActivitiesGateway.tsx");
    assert.doesNotMatch(gatewayCode, /currentPhase|rank|順位|審査|期間|開催中/);
    assert.doesNotMatch(
      gatewayCode,
      /contest|useStreamSchedule|useMilyRealtimeStatus|activityStatus/,
    );
    assert.doesNotMatch(gatewayCode, /activity\.(sourceIds|related[A-Za-z]+)/);
  });

  it("does not copy the Support Calendar onto the home page", () => {
    const homeSources = [
      "src/App.tsx",
      "src/components/Support.tsx",
      "src/components/ActivitiesGateway.tsx",
      "src/components/TodayDashboard.tsx",
      "src/lib/homeToday.ts",
    ].map(code).join("\n");
    assert.doesNotMatch(homeSources, /buildSupportCalendar|SupportCalendarResult/);
    assert.doesNotMatch(homeSources, /Support Calendar/);
    // 日程発表待ちの一覧そのものは /support/ に残す（ホームは案内文だけ）
    assert.doesNotMatch(
      homeSources,
      /selectSupportPending|pendingItems|calendar\.days|CalendarItemCard/,
    );
    assert.doesNotMatch(homeSources, /SupportPage/);
  });

  it("keeps the Support Hub and Activities routes intact", () => {
    assert.match(source("src/SupportPage.tsx"), /buildSupportCalendar\(/);
    assert.match(source("src/SupportPage.tsx"), /Support Calendar/);
    assert.match(source("src/ActivitiesPage.tsx"), /isActivitiesHubRoute/);
    for (const activity of activities) {
      assert.match(source("src/data/activities.ts"), new RegExp(activity.route));
    }
    const vite = source("vite.config.ts");
    assert.match(vite, /support:\s*"support\/index\.html"/);
    assert.match(vite, /activities:\s*"activities\/index\.html"/);
  });
});

describe("P6 home Today semantics", () => {
  it("never turns an unavailable API into 予定なし", () => {
    const { todayItems, nowItems } = homeToday();
    assert.deepEqual(todayItems.map(({ key }) => key), ["today:contest"]);
    assert.deepEqual(nowItems, []);
    const homeSources = [
      "src/components/TodayDashboard.tsx",
      "src/lib/homeToday.ts",
    ].map(code).join("\n");
    assert.doesNotMatch(homeSources, /予定なし|配信なし|本日はありません|応援なし/);
  });

  it("shows a confirmed slot without guessing its end time", () => {
    const { todayItems } = homeToday({
      streamSlots: [{ date: "2026-08-22", time: "20:00" }],
      streamRoomUrl: "https://www.showroom-live.com/r/example",
      banner: NONE_BANNER,
    });
    const slot = todayItems.find(({ activityId }) => activityId === "live-stream");
    assert.ok(slot);
    assert.match(slot.value, /2026\.08\.22 20:00〜/);
    assert.match(slot.note, /終了時刻は確認できていません。/);
    assert.doesNotMatch(slot.value, /〜\s*\d{1,2}:\d{2}\s*$/);
    assert.equal(slot.cta.url, "https://www.showroom-live.com/r/example");
  });

  it("keeps the radio disclaimer and never asserts a personal appearance", () => {
    const { todayItems } = homeToday({
      radioPhase: "window",
      now: Date.parse("2026-08-23T10:30:00+09:00"),
      banner: NONE_BANNER,
    });
    const radio = todayItems.find(({ activityId }) => activityId === "radio");
    assert.ok(radio);
    assert.match(radio.value, new RegExp(radioProgram.programName));
    assert.match(radio.note, /みりぃ本人の出演時間を示すものではありません/);
    assert.doesNotMatch(
      JSON.stringify(todayItems),
      /みりぃ出演中|みりぃが出演|みりぃの出演時間/,
    );
  });

  it("suppresses what the ActivityBanner already shows", () => {
    const now = Date.parse("2026-08-22T12:00:00+09:00");
    const live = {
      ...unknownLive,
      state: "live",
      roomUrl: "https://www.showroom-live.com/r/example",
    };
    const streamSlots = [{ date: "2026-08-22", time: "20:00" }];

    // SHOWROOM 実ライブ: バナーが「配信中」と CTA を出しているので繰り返さない
    const duringLive = homeToday({ live, streamSlots, now });
    assert.equal(
      duringLive.nowItems.some(({ origin }) => origin === "showroom-live"),
      false,
    );
    assert.equal(
      duringLive.todayItems.some(({ activityId }) => activityId === "live-stream"),
      false,
    );

    // 今日の予定枠をバナーが出しているときも同じ枠を繰り返さない
    const beforeSlot = homeToday({
      streamSlots,
      now: Date.parse("2026-08-22T09:00:00+09:00"),
    });
    assert.equal(
      beforeSlot.todayItems.some(({ activityId }) => activityId === "live-stream"),
      false,
    );

    // バナーが出していない枠は残す（抑制しすぎない）
    const withoutBanner = homeToday({
      streamSlots,
      now,
      banner: { kind: "NONE", stateLabel: "", title: "" },
    });
    assert.equal(
      withoutBanner.todayItems.some(({ activityId }) => activityId === "live-stream"),
      true,
    );
    // コンテストの審査段階はバナーの担当ではないので常に残る
    assert.equal(
      duringLive.todayItems.some(({ key }) => key === "today:contest"),
      true,
    );
  });

  it("adds no new schedule data for the home page", () => {
    assert.equal(supportEvents.length, 0);
    const homeSources = [
      "src/components/TodayDashboard.tsx",
      "src/components/Support.tsx",
      "src/components/ActivitiesGateway.tsx",
      "src/lib/homeToday.ts",
      "src/lib/navigation.ts",
    ].map(code).join("\n");
    assert.doesNotMatch(homeSources, /\d{4}-\d{2}-\d{2}/);
    assert.doesNotMatch(homeSources, /\b\d{1,2}:\d{2}\b/);
    assert.doesNotMatch(homeSources, /showroom-live\.com|misscircle\.jp|fm-smw\.jp/);
    assert.doesNotMatch(homeSources, /\d{6}/);
  });
});
