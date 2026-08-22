import assert from "node:assert/strict";
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
      fetcher: async () => response({ slots: [], source: { roomUrl: null } }),
    });

    assert.deepEqual(await load(), {
      slots: [],
      roomUrl: null,
      availability: "ok",
    });
  });

  it("maps HTTP, network, and response-processing failures to unavailable", async () => {
    const failures = [
      async () => response({ slots: [] }, { ok: false, status: 503 }),
      async () => {
        throw new Error("network failure");
      },
      async () => response(null),
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
        return response({ slots: [], source: { roomUrl: null } });
      },
      now: () => Date.parse("2026-08-22T12:00:00+09:00"),
    });

    assert.equal((await load()).availability, "unavailable");
    assert.equal((await load()).availability, "ok");
    assert.equal((await load()).availability, "ok");
    assert.equal(calls, 2);
  });
});
