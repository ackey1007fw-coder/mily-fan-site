import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  createStreamScheduleLoader,
  INITIAL_STREAM_SCHEDULE_STATE,
} from "../src/lib/useStreamSchedule.ts";

function response(data, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    async json() {
      return data;
    },
  };
}

describe("SHOWROOM schedule availability", () => {
  it("starts in loading while preserving the existing slots and roomUrl shape", () => {
    assert.deepEqual(INITIAL_STREAM_SCHEDULE_STATE, {
      slots: [],
      roomUrl: null,
      availability: "loading",
    });
  });

  it("returns ok with confirmed slots and a validated roomUrl", async () => {
    const load = createStreamScheduleLoader({
      fetcher: async () =>
        response({
          ok: true,
          slots: [{ date: "2026-08-23", time: "20:00" }],
          source: { roomUrl: "https://www.showroom-live.com/r/confirmed" },
        }),
    });

    assert.deepEqual(await load(), {
      slots: [{ date: "2026-08-23", time: "20:00" }],
      roomUrl: "https://www.showroom-live.com/r/confirmed",
      availability: "ok",
    });
  });

  it("keeps a successful zero-slot response distinct from unavailable", async () => {
    const load = createStreamScheduleLoader({
      fetcher: async () =>
        response({ ok: true, slots: [], source: { roomUrl: null } }),
    });

    assert.deepEqual(await load(), {
      slots: [],
      roomUrl: null,
      availability: "ok",
    });
  });

  it("maps HTTP, network, and response-processing failures to unavailable", async () => {
    const failures = [
      async () => response({ ok: true, slots: [] }, { ok: false, status: 503 }),
      async () => {
        throw new Error("network failure");
      },
      async () => response(null),
      async () => response({ ok: true }),
      async () => {
        return {
          ok: true,
          status: 200,
          async json() {
            throw new Error("Unexpected token in JSON");
          },
        };
      },
    ];

    for (const fetcher of failures) {
      const load = createStreamScheduleLoader({ fetcher });
      assert.deepEqual(await load(), {
        slots: [],
        roomUrl: null,
        availability: "unavailable",
      });
    }
  });

  it("caches only success and retries after a failure", async () => {
    let calls = 0;
    const load = createStreamScheduleLoader({
      fetcher: async () => {
        calls += 1;
        if (calls === 1) throw new Error("temporary failure");
        return response({ ok: true, slots: [], source: { roomUrl: null } });
      },
      now: () => Date.parse("2026-08-22T12:00:00+09:00"),
    });

    assert.equal((await load()).availability, "unavailable");
    assert.equal((await load()).availability, "ok");
    assert.equal((await load()).availability, "ok");
    assert.equal(calls, 2);
  });

  it("treats an HTTP 200 payload with ok:false as unavailable", async () => {
    // /api/mily-schedule は room 解決や上流取得に失敗しても HTTP 200 のまま
    // { ok:false, slots: [] } を返す。これを成功と誤認しない。
    const load = createStreamScheduleLoader({
      fetcher: async () =>
        response({ ok: false, slots: [], reason: "room not resolved" }),
    });

    assert.deepEqual(await load(), {
      slots: [],
      roomUrl: null,
      availability: "unavailable",
    });
  });

  it("treats a missing payload ok flag as unavailable", async () => {
    const load = createStreamScheduleLoader({
      fetcher: async () =>
        response({ slots: [{ date: "2026-08-23", time: "20:00" }] }),
    });

    assert.deepEqual(await load(), {
      slots: [],
      roomUrl: null,
      availability: "unavailable",
    });
  });

  it("never caches an ok:false payload and retries on the next use", async () => {
    let calls = 0;
    const load = createStreamScheduleLoader({
      fetcher: async () => {
        calls += 1;
        if (calls <= 2) return response({ ok: false, slots: [] });
        return response({
          ok: true,
          slots: [{ date: "2026-08-24", time: "21:00" }],
          source: { roomUrl: null },
        });
      },
      now: () => Date.parse("2026-08-22T12:00:00+09:00"),
    });

    assert.equal((await load()).availability, "unavailable");
    assert.equal((await load()).availability, "unavailable");
    assert.equal(calls, 2);

    const recovered = await load();
    assert.equal(recovered.availability, "ok");
    assert.deepEqual(recovered.slots, [{ date: "2026-08-24", time: "21:00" }]);
    assert.equal(calls, 3);
  });

  it("caches a successful payload for five minutes and refetches after the TTL", async () => {
    let calls = 0;
    let now = Date.parse("2026-08-22T12:00:00+09:00");
    const load = createStreamScheduleLoader({
      fetcher: async () => {
        calls += 1;
        return response({ ok: true, slots: [], source: { roomUrl: null } });
      },
      now: () => now,
    });

    assert.equal((await load()).availability, "ok");
    now += 4 * 60 * 1000;
    assert.equal((await load()).availability, "ok");
    assert.equal(calls, 1);

    now += 2 * 60 * 1000;
    assert.equal((await load()).availability, "ok");
    assert.equal(calls, 2);
  });

  it("keeps the confirmed manual fallback separate from the fetched slots", async () => {
    // 手入力fallbackはAPIの成否と無関係に確認済みなので、hookは両方を返す。
    const hook = readFileSync(
      new URL("../src/lib/useStreamSchedule.ts", import.meta.url),
      "utf8",
    );
    assert.match(hook, /manualSlots: upcomingSlots\(streamSchedule, \[\]\)/);
    assert.match(hook, /slots: upcomingSlots\(streamSchedule, fetched\.slots\)/);
    assert.match(hook, /roomUrl: fetched\.roomUrl/);
    assert.match(hook, /ok\?: boolean/);
    assert.match(hook, /response\.ok !== true/);
  });

  it("matches the endpoint contract that reports failure with HTTP 200", () => {
    // 契約の正本は api/mily-schedule.js。失敗時も status 200 + ok:false を返す。
    const api = readFileSync(
      new URL("../api/mily-schedule.js", import.meta.url),
      "utf8",
    );
    assert.match(api, /return \{ ok: false, slots: \[\], reason: err\.message \}/);
    assert.match(api, /reason: "room not resolved"/);
    assert.match(api, /res\.status\(200\)\.json\(payload\)/);
  });
});
