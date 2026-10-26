// Published anonymous snapshots only. No private dashboard, live API, or inferred values.
export const DAILY_STREAM_ENTRIES = Object.freeze([
  { date: "2026-10-26", slot: "night", file: "mily-night-20261026-aggregate.json", section: "night-20261026", report: "/data-lab/reports/20261026-night/" },
  { date: "2026-10-25", slot: "morning", file: "mily-morning-20261025-aggregate.json", section: "morning-20261025", report: "/data-lab/reports/20261025-morning/" },
  { date: "2026-10-24", slot: "noon", file: "mily-noon-20261024-aggregate.json", section: "noon-20261024", report: "/data-lab/reports/20261024-noon/" },
  { date: "2026-10-24", slot: "morning", file: "mily-morning-20261024-aggregate.json", section: "morning-20261024", report: "/data-lab/reports/20261024-morning/" },
  { date: "2026-10-23", slot: "morning", file: "mily-morning-20261023-aggregate.json", section: "morning-20261023", report: "/data-lab/reports/20261023-morning/" },
  { date: "2026-10-22", slot: "night", file: "mily-night-20261022-aggregate.json", section: "night-20261022", report: "/data-lab/reports/20261022-night/" },
  { date: "2026-10-22", slot: "morning", file: "mily-morning-20261022-aggregate.json", section: "morning-20261022", report: "/data-lab/reports/20261022-morning/" },
  { date: "2026-10-21", slot: "morning", file: "mily-morning-20261021-aggregate.json", section: "morning-20261021", report: "/data-lab/reports/20261021-morning/" },
  { date: "2026-10-20", slot: "night", file: "mily-night-20261020-aggregate.json", section: "night-20261020", report: "/data-lab/reports/20261020-night/" },
  { date: "2026-10-20", slot: "morning", file: "mily-morning-20261020-aggregate.json", section: "morning-20261020", report: "/data-lab/reports/20261020-morning/" },
  { date: "2026-10-19", slot: "morning", file: "mily-morning-20261019-aggregate.json", section: "morning-20261019", report: "/data-lab/reports/20261019-morning/" },
  { date: "2026-10-18", slot: "night", file: "mily-night-20261018-aggregate.json", section: "night-20261018", report: "/data-lab/reports/20261018-night/" },
  { date: "2026-10-18", slot: "morning", file: "mily-morning-20261018-aggregate.json", section: "morning-20261018", report: "/data-lab/reports/20261018-morning/" },
  { date: "2026-10-17", slot: "night", file: "mily-night-20261017-aggregate.json", section: "night-20261017", report: "/data-lab/reports/20261017-night/" },
  { date: "2026-10-17", slot: "morning", file: "mily-morning-20261017-aggregate.json", section: "morning-20261017", report: "/data-lab/reports/20261017-morning/" },
  { date: "2026-10-16", slot: "night", file: "mily-night-20261016-aggregate.json", section: "night-20261016", report: "/data-lab/#night-20261016" },
  { date: "2026-10-16", slot: "morning", file: "mily-morning-20261016-aggregate.json", section: "morning-20261016", report: "/data-lab/#morning-20261016" },
  { date: "2026-10-15", slot: "night", file: "mily-night-20261015-aggregate.json", section: "night-20261015", report: "/data-lab/#night-20261015" },
  { date: "2026-10-15", slot: "morning", file: "mily-morning-20261015-aggregate.json", section: "morning-20261015", report: "/data-lab/#morning-20261015" },
  { date: "2026-10-14", slot: "night", file: "mily-night-20261014-aggregate.json", section: "night-20261014", report: "/data-lab/#night-20261014" },
  { date: "2026-10-14", slot: "noon", file: "mily-noon-20261014-aggregate.json", section: "noon-20261014", report: "/data-lab/#noon-20261014" },
  { date: "2026-10-14", slot: "morning", file: "mily-morning-20261014-aggregate.json", section: "morning-20261014", report: "/data-lab/#morning-20261014" },
]);

export const METRICS = Object.freeze({
  stars: "きら星",
  visits: "総訪問表示",
  comments: "コメント表示",
});
export const SLOT_LABELS = Object.freeze({ morning: "朝", noon: "昼", night: "夜" });
const slotOrder = Object.freeze({ night: 0, noon: 1, morning: 2 });

export function groupByBroadcastDate(entries = DAILY_STREAM_ENTRIES) {
  const sorted = [...entries].sort((a, b) =>
    b.date.localeCompare(a.date) ||
    (slotOrder[a.slot] ?? 99) - (slotOrder[b.slot] ?? 99)
  );
  const groups = [];
  for (const entry of sorted) {
    let group = groups.at(-1);
    if (!group || group.date !== entry.date) {
      group = { date: entry.date, entries: [] };
      groups.push(group);
    }
    group.entries.push(entry);
  }
  return groups;
}

function metricValue(source, metric) {
  if (!source || typeof source !== "object") return null;
  const keys = metric === "visits" ? ["visits", "total_visits"] : [metric];
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
  }
  return null;
}

function timestamp(value, date) {
  if (typeof value !== "string") return null;
  const full = /^\d{4}-\d{2}-\d{2}T/.test(value)
    ? value
    : /^\d{2}:\d{2}:\d{2}(?:\.\d+)?$/.test(value)
      ? date + "T" + value + "+09:00"
      : null;
  if (!full) return null;
  const time = Date.parse(full);
  return Number.isFinite(time) ? time : null;
}

export function observationPoints(data, metric, date) {
  if (!(metric in METRICS)) return [];
  const rows = Array.isArray(data?.observations) && data.observations.length
    ? data.observations
    : Array.isArray(data?.counters?.observations) && data.counters.observations.length
      ? data.counters.observations
      : Array.isArray(data?.segments)
        ? data.segments.flatMap((segment) => segment.five_minute_window_endpoints ?? [])
        : Array.isArray(data?.five_minute_window_endpoints)
          ? data.five_minute_window_endpoints
          : Array.isArray(data?.observed_points) ? data.observed_points : [];
  const valid = [];
  for (const row of rows) {
    // Do not misrepresent the start of a time window as an observed endpoint.
    const time = timestamp(row.atJst ?? row.observed_at_jst ?? row.window_end_observed_at_jst, date);
    const value = metricValue(row, metric);
    if (time !== null && value !== null) valid.push({ time, value });
  }
  valid.sort((a, b) => a.time - b.time);
  return valid.filter((point, index) => index === 0 || point.time !== valid[index - 1].time);
}

export function lastObservedValue(data, metric, date) {
  if (!(metric in METRICS)) return null;
  // "earlyPartialObservation" must never be promoted to a last valid result.
  const last = data?.lastValidOnline ?? data?.observed_screen;
  const value = metricValue(last, metric);
  if (value !== null) return value;
  const points = observationPoints(data, metric, date);
  return points.length ? points.at(-1).value : null;
}
