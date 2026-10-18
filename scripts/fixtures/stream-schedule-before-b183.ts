export * from "../../src/data/streamSchedule.ts";
import { streamSchedule as currentSchedule } from "../../src/data/streamSchedule.ts";

/** Earlier content-scope assertions predate the October 2 five-day poster. */
export const streamSchedule = currentSchedule.filter(slot => slot.date < "2026-10-03");
