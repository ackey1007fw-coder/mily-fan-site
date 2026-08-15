import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { radioProgram } from "../src/data/radio.ts";
import {
  appearanceState,
  deriveBannerState,
  nextTodaySlot,
  programState,
  radioStartMs,
  tokyoToday,
} from "../src/lib/bannerState.ts";
import {
  createPollStore,
  isObservationStale,
  toLiveView,
  LIVE_STALE_MS,
} from "../src/lib/realtimeStore.ts";
import {
  normalizeEpochToIso,
  pickUniqueRoom,
  readLiveState,
  readNextLive,
  roomNameMatchesMily,
} from "../server/mily-showroom.js";
import { buildLivePayload } from "../api/mily-live.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFile(path.join(root, relative), "utf8");

const ROOM_URL = "https://www.showroom-live.com/r/circle2026_0734";
const SUNDAY_NOON = Date.parse("2026-08-16T12:00:00+09:00");
const TODAY = tokyoToday(SUNDAY_NOON);

const liveOn = { state: "live", roomUrl: ROOM_URL };
const liveOff = { state: "offline", roomUrl: ROOM_URL };
const liveUnknown = { state: "unknown", roomUrl: null };

function radio(overrides = {}) {
  return {
    ok: true,
    programName: radioProgram.programName,
    todayScheduled: false,
    scheduledStart: radioProgram.scheduledStart,
    scheduledEnd: radioProgram.scheduledEnd,
    inScheduledWindow: false,
    onAirConfirmed: null,
    milyAppearanceConfirmed: null,
    listenUrl: radioProgram.listenUrl,
    sourceUrl: radioProgram.nowOnAirSourceUrl,
    updatedAt: "2026-08-16T03:00:00.000Z",
    ...overrides,
  };
}

describe("showroom room resolution safety", () => {
  it("adopts a room only when exactly one candidate is verified", () => {
    const mily = { roomId: 573253, roomName: "🔥2次最終日🩵三橋莉子✨", roomUrlKey: "k" };
    assert.equal(pickUniqueRoom([mily]).roomId, 573253);
    // 候補0
    assert.equal(pickUniqueRoom([]), null);
    // 別人のみ
    assert.equal(pickUniqueRoom([{ roomId: 1, roomName: "別人のルーム" }]), null);
    // 本人が複数 → 曖昧なので不採用
    assert.equal(
      pickUniqueRoom([mily, { roomId: 999, roomName: "みりぃ 別room" }]),
      null,
    );
    // 同じ room が key 経由と id 経由で重複しても1件
    assert.equal(pickUniqueRoom([mily, { ...mily }]).roomId, 573253);
  });

  it("keeps someone else's room out even via env fallback", () => {
    assert.equal(roomNameMatchesMily("別人のルーム"), false);
    assert.equal(pickUniqueRoom([{ roomId: 42, roomName: "別人のルーム" }]), null);
  });

  it("does not cache failures and hardcodes no room id", async () => {
    const source = await read("server/mily-showroom.js");
    assert.match(source, /未解決・失敗はキャッシュしない/);
    assert.doesNotMatch(source, /roomCache = \{ at: Date\.now\(\), value: null \}/);
    assert.doesNotMatch(source, /573253|circle2026_0734/);
  });
});

describe("live state comes only from status.is_live", () => {
  it("reads true / false / missing", () => {
    assert.equal(readLiveState({ is_live: true }).state, "live");
    assert.equal(readLiveState({ is_live: 1 }).state, "live");
    assert.equal(readLiveState({ is_live: false }).state, "offline");
    assert.equal(readLiveState({ is_live: 0 }).state, "offline");
    assert.equal(readLiveState({}).state, "unknown");
    assert.equal(readLiveState(null).state, "unknown");
    assert.equal(readLiveState("live").state, "unknown");
  });

  it("never infers live from profile-only fields", () => {
    for (const payload of [
      { is_onlive: true },
      { live_id: 12345 },
      { current_live_started_at: 1786000000 },
      { started_at: 1786000000 },
    ]) {
      assert.equal(readLiveState(payload).state, "unknown");
    }
  });

  it("normalizes second and millisecond epochs, rejects junk", () => {
    assert.equal(normalizeEpochToIso(1786000000), "2026-08-06T07:06:40.000Z");
    assert.equal(normalizeEpochToIso(1786000000000), "2026-08-06T07:06:40.000Z");
    assert.equal(normalizeEpochToIso("1786000000"), "2026-08-06T07:06:40.000Z");
    assert.equal(normalizeEpochToIso(0), null);
    assert.equal(normalizeEpochToIso(null), null);
    assert.equal(normalizeEpochToIso("soon"), null);
  });

  it("treats next_live as schedule only", () => {
    assert.equal(readNextLive({ epoch: 1786000000 }).state, "scheduled");
    assert.equal(readNextLive({ epoch: 1786000000000 }).state, "scheduled");
    assert.equal(readNextLive({}).state, "none");
    assert.equal(readNextLive(null).state, "unknown");
    assert.equal(readNextLive({ epoch: "???" }).state, "unknown");
  });

  it("reports unknown in the payload when the room is unresolved", () => {
    const payload = buildLivePayload({
      room: null,
      live: { state: "unknown" },
      next: { state: "unknown" },
      now: Date.parse("2026-08-16T03:00:00Z"),
    });
    assert.equal(payload.ok, false);
    assert.equal(payload.live.state, "unknown");
    assert.equal(payload.live.observedAt, "2026-08-16T03:00:00.000Z");
  });
});

describe("stale live observations expire", () => {
  it("expires after 90 seconds", () => {
    const observedAt = "2026-08-16T03:00:00.000Z";
    const base = Date.parse(observedAt);
    assert.equal(isObservationStale(observedAt, base + 60_000), false);
    assert.equal(isObservationStale(observedAt, base + LIVE_STALE_MS), true);
    assert.equal(isObservationStale(null, base), true);
    assert.equal(isObservationStale("not-a-date", base), true);
  });

  it("downgrades a stale live to unknown", () => {
    const payload = {
      roomUrl: ROOM_URL,
      live: { state: "live", observedAt: "2026-08-16T03:00:00.000Z" },
      next: { state: "none", at: null },
    };
    const fresh = toLiveView(payload, Date.parse("2026-08-16T03:00:30Z"));
    assert.equal(fresh.state, "live");
    const stale = toLiveView(payload, Date.parse("2026-08-16T03:05:00Z"));
    assert.equal(stale.state, "unknown");
  });
});

describe("poll store", () => {
  function fakeTimers() {
    const queue = [];
    return {
      timers: {
        setTimeout: (handler, ms) => queue.push({ handler, ms }),
        clearTimeout: () => {},
      },
      runNext: () => queue.shift()?.handler(),
      pending: () => queue.length,
    };
  }

  it("does not run overlapping fetches", async () => {
    let calls = 0;
    let release;
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    const { timers } = fakeTimers();
    const store = createPollStore(
      {
        fetcher: () => {
          calls += 1;
          return gate.then(() => calls);
        },
        intervalMs: 1000,
      },
      timers,
    );
    store.subscribe(() => {});
    const first = store.refresh();
    const second = store.refresh();
    assert.equal(calls, 1, "second refresh should join the in-flight one");
    release();
    await Promise.all([first, second]);
    assert.equal(calls, 1);
  });

  it("schedules the next run only after the previous finished", async () => {
    const { timers, pending, runNext } = fakeTimers();
    let calls = 0;
    const store = createPollStore(
      { fetcher: async () => ++calls, intervalMs: 1000 },
      timers,
    );
    store.subscribe(() => {});
    await store.refresh();
    assert.equal(pending(), 1, "exactly one timer queued");
    runNext();
    await Promise.resolve();
    assert.ok(calls >= 1);
  });

  it("drops the previous value on error when asked", async () => {
    const { timers } = fakeTimers();
    let shouldFail = false;
    const store = createPollStore(
      {
        fetcher: async () => {
          if (shouldFail) throw new Error("network");
          return "value";
        },
        intervalMs: 1000,
        clearOnError: true,
      },
      timers,
    );
    store.subscribe(() => {});
    await store.refresh();
    assert.equal(store.getSnapshot(), "value");
    shouldFail = true;
    await store.refresh();
    assert.equal(store.getSnapshot(), null, "stale live state must not linger");
  });

  it("wires visibility, focus and online wakeups", async () => {
    const source = await read("src/lib/realtimeStore.ts");
    assert.match(source, /visibilitychange/);
    assert.match(source, /"focus"/);
    assert.match(source, /"online"/);
    assert.match(source, /visibilityState === "hidden"/);
  });
});

describe("radio program vs appearance", () => {
  it("separates program state from appearance state", () => {
    assert.equal(programState(radio({ inScheduledWindow: true })), "PROGRAM_WINDOW");
    assert.equal(programState(radio({ todayScheduled: true })), "PROGRAM_TODAY");
    assert.equal(programState(radio()), "IDLE");
    assert.equal(programState(null), "UNKNOWN");
    // milyAppearanceConfirmed は現状 null なので断定しない
    assert.equal(appearanceState(radio()), "LISTED_PERSONALITY");
    assert.equal(
      appearanceState(radio({ milyAppearanceConfirmed: true })),
      "APPEARANCE_CONFIRMED",
    );
  });

  it("says 放送中 only when NOW ON AIR is confirmed", () => {
    const confirmed = deriveBannerState(
      {
        live: liveOff,
        radio: radio({ todayScheduled: true, inScheduledWindow: true, onAirConfirmed: true }),
        slots: [],
      },
      SUNDAY_NOON,
    );
    assert.equal(confirmed.kind, "RADIO_PROGRAM_WINDOW");
    assert.match(confirmed.title, /放送中/);

    const windowOnly = deriveBannerState(
      {
        live: liveOff,
        radio: radio({ todayScheduled: true, inScheduledWindow: true }),
        slots: [],
      },
      SUNDAY_NOON,
    );
    assert.equal(windowOnly.kind, "RADIO_PROGRAM_WINDOW");
    assert.match(windowOnly.title, /放送時間です/);
    assert.doesNotMatch(windowOnly.title, /放送中/);
  });

  it("never claims a personal appearance", async () => {
    const source = await read("src/lib/bannerState.ts");
    assert.doesNotMatch(source, /title: `[^`]*出演中/);
    for (const state of [
      { todayScheduled: true, inScheduledWindow: true, onAirConfirmed: true },
      { todayScheduled: true, inScheduledWindow: true },
      { todayScheduled: true },
    ]) {
      const banner = deriveBannerState(
        { live: liveOff, radio: radio(state), slots: [] },
        SUNDAY_NOON,
      );
      assert.doesNotMatch(`${banner.title}${banner.detail ?? ""}`, /出演中/);
    }
  });

  it("hides on non-broadcast days and on fetch failure", () => {
    assert.equal(
      deriveBannerState({ live: liveOff, radio: radio(), slots: [] }, SUNDAY_NOON).kind,
      "NONE",
    );
    assert.equal(
      deriveBannerState({ live: liveOff, radio: null, slots: [] }, SUNDAY_NOON).kind,
      "NONE",
    );
  });
});

describe("banner priority", () => {
  it("puts a real SHOWROOM live above the radio window", () => {
    const state = deriveBannerState(
      {
        live: liveOn,
        radio: radio({ todayScheduled: true, inScheduledWindow: true, onAirConfirmed: true }),
        slots: [{ date: TODAY, time: "22:30" }],
      },
      SUNDAY_NOON,
    );
    assert.equal(state.kind, "SHOWROOM_LIVE");
    assert.equal(state.href, ROOM_URL);
  });

  it("puts the radio window above a future stream", () => {
    const state = deriveBannerState(
      {
        live: liveOff,
        radio: radio({ todayScheduled: true, inScheduledWindow: true }),
        slots: [{ date: TODAY, time: "22:30" }],
      },
      SUNDAY_NOON,
    );
    assert.equal(state.kind, "RADIO_PROGRAM_WINDOW");
  });

  it("prefers the earlier start when both are future plans", () => {
    const morning = Date.parse("2026-08-16T08:00:00+09:00");
    // ラジオ 10:00 のほうが早い
    const radioFirst = deriveBannerState(
      {
        live: liveOff,
        radio: radio({ todayScheduled: true }),
        slots: [{ date: TODAY, time: "22:30" }],
      },
      morning,
    );
    assert.equal(radioFirst.kind, "RADIO_PROGRAM_TODAY");

    // SHOWROOM 09:00 のほうが早い
    const streamFirst = deriveBannerState(
      {
        live: liveOff,
        radio: radio({ todayScheduled: true }),
        slots: [{ date: TODAY, time: "09:00" }],
      },
      morning,
    );
    assert.equal(streamFirst.kind, "SHOWROOM_TODAY");

    // 同時刻は SHOWROOM を優先
    const tie = deriveBannerState(
      {
        live: liveOff,
        radio: radio({ todayScheduled: true }),
        slots: [{ date: TODAY, time: "10:00" }],
      },
      morning,
    );
    assert.equal(tie.kind, "SHOWROOM_TODAY");
  });

  it("never promotes an unknown live to 配信中", () => {
    const state = deriveBannerState(
      {
        live: liveUnknown,
        radio: radio({ todayScheduled: true }),
        slots: [{ date: TODAY, time: "22:30" }],
      },
      Date.parse("2026-08-16T08:00:00+09:00"),
    );
    assert.notEqual(state.kind, "SHOWROOM_LIVE");
    assert.equal(state.kind, "RADIO_PROGRAM_TODAY");
  });

  it("does not promote a passed start time to 配信中", () => {
    // 22:30 の枠を 23:00 に見ても、実ライブが取れなければ配信中にしない
    const state = deriveBannerState(
      {
        live: liveUnknown,
        radio: radio(),
        slots: [{ date: TODAY, time: "22:30" }],
      },
      Date.parse("2026-08-16T23:00:00+09:00"),
    );
    assert.equal(state.kind, "NONE");
  });
});

describe("JST edge cases", () => {
  it("uses the Tokyo day across UTC midnight and new year", () => {
    // UTC では 8/15 だが JST では 8/16
    assert.equal(tokyoToday(Date.parse("2026-08-15T23:00:00Z")), "2026-08-16");
    // 年越し: JST 2027-01-01 00:30
    assert.equal(tokyoToday(Date.parse("2026-12-31T15:30:00Z")), "2027-01-01");
  });

  it("only offers today's future slots", () => {
    const newYear = Date.parse("2027-01-01T00:30:00+09:00");
    assert.equal(
      nextTodaySlot([{ date: "2027-01-01", time: "23:00" }], newYear).time,
      "23:00",
    );
    assert.equal(nextTodaySlot([{ date: "2026-12-31", time: "23:00" }], newYear), null);
  });

  it("computes the radio start in Tokyo time", () => {
    const start = radioStartMs(radio({ todayScheduled: true }), SUNDAY_NOON);
    assert.equal(new Date(start).toISOString(), "2026-08-16T01:00:00.000Z");
    assert.equal(radioStartMs(radio(), SUNDAY_NOON), null);
  });
});

describe("ui contract", () => {
  it("sits after the skip link and before the header, non-sticky", async () => {
    const app = await read("src/App.tsx");
    const skip = app.indexOf("本文へスキップ");
    const banner = app.indexOf("<ActivityBanner />");
    const header = app.indexOf("<Header />");
    assert.ok(skip < banner && banner < header);
    const component = await read("src/components/ActivityBanner.tsx");
    // className に sticky / fixed を使っていないこと（コメント中の語は対象外）
    assert.doesNotMatch(component, /className="[^"]*\b(sticky|fixed)\b/);
    assert.doesNotMatch(component, /\$\{[^}]*\}[^"]*\b(sticky|fixed)\b/);
  });

  it("announces politely and does not rely on colour alone", async () => {
    const component = await read("src/components/ActivityBanner.tsx");
    assert.match(component, /role="status"/);
    assert.match(component, /aria-live="polite"/);
    assert.match(component, /aria-atomic="true"/);
    assert.match(component, /STATE_LABEL/);
    assert.match(component, /motion-safe:animate-pulse/);
    assert.match(component, /min-h-11/);
    assert.doesNotMatch(component, /573253|circle2026_0734/);
  });

  it("keeps the banner readable down to 320px", async () => {
    const component = await read("src/components/ActivityBanner.tsx");
    // 幅が足りなければリンクを次の行へ送る（本文と重ねない）
    assert.match(component, /flex-wrap/);
    assert.match(component, /sm:flex-nowrap/);
    // 本文には最低幅を持たせ、長い語でも枠外へはみ出させない
    assert.match(component, /basis-48/);
    assert.match(component, /\[overflow-wrap:anywhere\]/);
  });

  it("opens external links safely with a screen-reader hint", async () => {
    const external = await read("src/components/ExternalLink.tsx");
    assert.match(external, /rel="noopener noreferrer"/);
    assert.match(external, /新しいタブで開きます/);
  });

  it("shares one poll between the banner and the dashboard", async () => {
    const banner = await read("src/components/ActivityBanner.tsx");
    const dashboard = await read("src/components/TodayDashboard.tsx");
    assert.match(banner, /useMilyRealtimeStatus/);
    assert.match(dashboard, /useMilyRealtimeStatus/);
    const hook = await read("src/lib/useMilyRealtimeStatus.ts");
    // store はモジュールスコープで1つだけ作る
    assert.equal((hook.match(/createPollStore</g) ?? []).length, 2);
  });

  it("suppresses the duplicate stream line in TodayDashboard", async () => {
    const dashboard = await read("src/components/TodayDashboard.tsx");
    assert.match(dashboard, /deriveBannerState/);
    assert.match(dashboard, /showNextStream/);
  });

  it("keeps the schedule wording from reading like a real live", async () => {
    const dashboard = await read("src/components/TodayDashboard.tsx");
    const stream = await read("src/components/StreamSchedule.tsx");
    const banner = await read("src/lib/bannerState.ts");
    // 予定由来の表示は実ライブと読めない表現にする
    assert.match(dashboard, /開始時刻を過ぎています/);
    assert.match(stream, /開始時刻を過ぎています/);
    assert.doesNotMatch(dashboard, /配信中/);
    assert.doesNotMatch(stream, /配信中/);
    // 実ライブの文言は ActivityBanner 側だけ
    assert.match(banner, /ただいまSHOWROOMで配信中/);
  });

  it("keeps the existing schedule exports after the refactor", async () => {
    const schedule = await import("../api/mily-schedule.js");
    for (const name of [
      "looksLikeEntryPage",
      "extractShowroomKeys",
      "extractShowroomRoomIds",
      "extractSnsLinks",
      "filterMilyLinks",
      "roomNameMatchesMily",
      "normalizeSchedule",
      "resolveAndFetchSchedule",
    ]) {
      assert.equal(typeof schedule[name], "function", `${name} must stay exported`);
    }
  });

  it("keeps live out of the schedule endpoint", async () => {
    const schedule = await read("api/mily-schedule.js");
    assert.doesNotMatch(schedule, /is_live/);
    const live = await read("api/mily-live.js");
    assert.match(live, /s-maxage=12/);
    assert.match(live, /405/);
  });
});
