// Run: node scripts/day-plan.check.mjs (Node >= 23, which strips TS types)
import assert from "node:assert/strict";
import * as p from "../src/app/(logged-in)/doctor/schedule/[id]/dayPlan.ts";

const defaults = { maxPatients: 1, doctorFee: 500, slotType: null };
const server = (id, startTime, endTime, extra = {}) =>
	p.fromServer({ id, updatedAt: "2026-10-01T00:00:00.000Z", startTime, endTime, maxPatients: 1, doctorFee: 500, isActive: true, booked: false, ...extra });

assert.deepEqual(
	p.generateTimes("09:00", "12:00", 50, 10).map((t) => t.startTime),
	["09:00", "10:00", "11:00"]
);
assert.deepEqual(p.generateTimes("09:00", "12:00", 0, 10), []);
assert.deepEqual(p.generateTimes("09:00", "12:00", 50, -1), []);

assert.equal(p.weekdayOf("2026-10-02"), 5);
assert.equal(p.datesInRange("2026-10-30", "2026-11-02").length, 4);
assert.equal(p.dhakaToday(new Date("2026-09-30T19:00:00Z")), "2026-10-01");

const day = {
	date: "2026-10-02",
	rows: [server(1, "09:00", "09:50", { booked: true }), server(2, "10:30", "11:00", { isActive: false, notes: "leave" })],
	deleteIds: [],
};
const times = p.generateTimes("09:00", "12:00", 50, 10);
const merged = p.mergeGenerated(day, times, defaults);
assert.deepEqual(p.sortRows(merged.day.rows).map((r) => r.startTime), ["09:00", "10:30", "11:00"]);
assert.equal(merged.added, 1);
assert.equal(p.mergeGenerated(merged.day, times, defaults).added, 0, "idempotent");

const full = { date: "2026-10-02", rows: [], deleteIds: [] };
const capped = p.mergeGenerated(full, p.generateTimes("00:00", "23:59", 10, 0), defaults);
assert.equal(capped.day.rows.length, p.MAX_SLOTS_PER_DAY);
assert.equal(capped.truncated, 143 - 96);

const withFree = { ...merged.day, rows: [...merged.day.rows, server(3, "13:00", "13:50")] };
const cleared = p.clearFree(withFree);
assert.deepEqual(cleared.rows.map((r) => r.id), [1, 2], "booked and disabled rows survive");
assert.deepEqual(cleared.deleteIds, [3]);

const edited = { ...withFree, rows: withFree.rows.map((r) => (r.id === 2 ? { ...r, notes: "x" } : r)) };
const past = { date: "2026-09-29", rows: [p.newRow(times[0], defaults)], deleteIds: [] };
const unchanged = { date: "2026-10-01", rows: [server(9, "09:00", "09:50")], deleteIds: [] };
const out = p.toPayload([past, unchanged, edited], "2026-09-30");
assert.deepEqual(out.skippedPast, ["2026-09-29"]);
assert.equal(out.days.length, 1);
assert.deepEqual(out.days[0].upserts.map((u) => u.id), [2, undefined]);
assert.equal(out.days[0].upserts[0].updatedAt, "2026-10-01T00:00:00.000Z");
assert.equal(out.refMap["days[0].upserts[1]"], merged.day.rows[2].key);
assert.equal(out.refMap["1"], "id-1");
assert.equal(out.refMap["3"], "id-3");

const bad = { date: "2026-10-02", rows: [p.newRow({ startTime: "10:00", endTime: "10:00" }, defaults)], deleteIds: [] };
assert.deepEqual(p.toPayload([bad], "2026-09-30").invalid, [bad.rows[0].key]);
assert.deepEqual(out.invalid, []);

console.log("day-plan checks passed");
