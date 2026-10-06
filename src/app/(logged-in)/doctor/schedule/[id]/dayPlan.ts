// Pure day-planner logic: no imports, so scripts/day-plan.check.mjs can run it under plain node.

export const MAX_DAYS = 62;
export const MAX_SLOTS_PER_DAY = 96;

export type Booking = { appointmentId: number; patientName: string | null; status: string };

export type Row = {
	key: string;
	id?: number;
	updatedAt?: string;
	startTime: string;
	endTime: string;
	maxPatients: number;
	doctorFee: number;
	slotType: string | null;
	notes: string;
	isActive: boolean;
	booked: boolean;
	bookedPatients: number;
	bookings: Booking[];
	orig?: string;
};

export type Day = { date: string; rows: Row[]; deleteIds: number[] };

export type Defaults = { maxPatients: number; doctorFee: number; slotType: string | null };

export type SlotTimes = { startTime: string; endTime: string };

export type SentSlot = {
	id?: number;
	updatedAt?: string;
	startTime: string;
	endTime: string;
	maxPatients: number;
	doctorFee: number;
	slotType?: string;
	notes: string;
	isActive: boolean;
};

export type SentDay = { date: string; upserts: SentSlot[]; deleteIds: number[] };

export const toMinutes = (time: string) => {
	const [hour, minute] = time.split(":").map(Number);
	return hour * 60 + minute;
};

export const toHHMM = (minutes: number) =>
	`${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

export function dhakaToday(now: Date = new Date()): string {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Dhaka",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(now);
}

const utcDay = (date: string) => new Date(`${date}T00:00:00Z`);

export const addDays = (date: string, days: number) =>
	new Date(utcDay(date).getTime() + days * 86400000).toISOString().slice(0, 10);

// 0 = Sunday.
export const weekdayOf = (date: string) => utcDay(date).getUTCDay();

export function datesInRange(start: string, end: string): string[] {
	const dates: string[] = [];
	for (let date = start; date <= end && dates.length <= MAX_DAYS; date = addDays(date, 1)) dates.push(date);
	return dates;
}

export function generateTimes(dayStart: string, dayEnd: string, session: number, breakMinutes: number): SlotTimes[] {
	if (!(session >= 1) || !(breakMinutes >= 0) || !dayStart || !dayEnd) return [];
	const times: SlotTimes[] = [];
	const end = toMinutes(dayEnd);
	for (let t = toMinutes(dayStart); t + session <= end; t += session + breakMinutes) {
		times.push({ startTime: toHHMM(t), endTime: toHHMM(t + session) });
	}
	return times;
}

let keySeq = 0;
const newKey = () => `new-${++keySeq}`;

export const editable = (row: Row) =>
	JSON.stringify([row.startTime, row.endTime, row.maxPatients, row.doctorFee, row.slotType, row.notes, row.isActive]);

export const isNew = (row: Row) => row.id === undefined;

export const isChanged = (row: Row) => !isNew(row) && row.orig !== editable(row);

export function fromServer(slot: any): Row {
	const row: Row = {
		key: `id-${slot.id}`,
		id: slot.id,
		updatedAt: slot.updatedAt,
		startTime: slot.startTime,
		endTime: slot.endTime,
		maxPatients: slot.maxPatients,
		doctorFee: Number(slot.doctorFee),
		slotType: slot.slotType ?? null,
		notes: slot.notes ?? "",
		isActive: slot.isActive,
		booked: slot.booked,
		bookedPatients: slot.bookedPatients ?? 0,
		bookings: slot.bookings ?? [],
	};
	row.orig = editable(row);
	return row;
}

export function newRow(times: SlotTimes, defaults: Defaults): Row {
	return {
		key: newKey(),
		...times,
		...defaults,
		notes: "",
		isActive: true,
		booked: false,
		bookedPatients: 0,
		bookings: [],
	};
}

// A new slot starting `breakMinutes` after `afterEnd` (or at `dayStart`), kept inside the day.
export function slotAfter(afterEnd: string | undefined, dayStart: string, session: number, breakMinutes: number): SlotTimes {
	const start = Math.min(afterEnd ? toMinutes(afterEnd) + breakMinutes : toMinutes(dayStart || "09:00"), 1438);
	return { startTime: toHHMM(start), endTime: toHHMM(Math.min(start + Math.max(session, 1), 1439)) };
}

export const sortRows = (rows: Row[]) =>
	[...rows].sort((a, b) => a.startTime.localeCompare(b.startTime) || a.key.localeCompare(b.key));

const overlaps = (a: SlotTimes, b: SlotTimes) =>
	toMinutes(a.startTime) < toMinutes(b.endTime) && toMinutes(b.startTime) < toMinutes(a.endTime);

// Fills gaps only: every existing row stays; a generated slot is added only where it overlaps nothing.
export function mergeGenerated(day: Day, times: SlotTimes[], defaults: Defaults) {
	const rows = [...day.rows];
	let added = 0;
	let truncated = 0;
	for (const time of times) {
		if (rows.some((row) => overlaps(row, time))) continue;
		if (rows.length >= MAX_SLOTS_PER_DAY) {
			truncated++;
			continue;
		}
		rows.push(newRow(time, defaults));
		added++;
	}
	return { day: { ...day, rows }, added, truncated };
}

// Free = not booked and not disabled; disabled rows keep their notes.
export const isFree = (row: Row) => !row.booked && row.isActive;

export function clearFree(day: Day): Day {
	const removed = day.rows.filter(isFree);
	return {
		...day,
		rows: day.rows.filter((row) => !isFree(row)),
		deleteIds: [...day.deleteIds, ...removed.filter((row) => !isNew(row)).map((row) => row.id as number)],
	};
}

export function removeRow(day: Day, key: string): Day {
	const row = day.rows.find((r) => r.key === key);
	if (!row || row.booked) return day;
	return {
		...day,
		rows: day.rows.filter((r) => r.key !== key),
		deleteIds: isNew(row) ? day.deleteIds : [...day.deleteIds, row.id as number],
	};
}

export const isDirty = (day: Day) => day.deleteIds.length > 0 || day.rows.some((row) => isNew(row) || isChanged(row));

// Only new/changed rows and deletes of days on or after Dhaka today; refMap maps backend warning refs to row keys.
// invalid lists keys of rows in sent days that end at or before they start.
export function toPayload(days: Day[], today: string = dhakaToday()) {
	const sent: SentDay[] = [];
	const refMap: Record<string, string> = {};
	const skippedPast: string[] = [];
	const invalid: string[] = [];
	for (const day of days) {
		if (!isDirty(day)) continue;
		if (day.date < today) {
			skippedPast.push(day.date);
			continue;
		}
		const i = sent.length;
		const upserts: SentSlot[] = [];
		for (const row of day.rows) {
			if (toMinutes(row.endTime) <= toMinutes(row.startTime)) invalid.push(row.key);
			if (!isNew(row)) refMap[String(row.id)] = row.key;
			if (!isNew(row) && !isChanged(row)) continue;
			if (isNew(row)) refMap[`days[${i}].upserts[${upserts.length}]`] = row.key;
			upserts.push({
				...(isNew(row) ? {} : { id: row.id, updatedAt: row.updatedAt }),
				startTime: row.startTime,
				endTime: row.endTime,
				maxPatients: row.maxPatients,
				doctorFee: row.doctorFee,
				...(row.slotType ? { slotType: row.slotType } : {}),
				notes: row.notes,
				isActive: row.isActive,
			});
		}
		sent.push({ date: day.date, upserts, deleteIds: day.deleteIds });
	}
	return { days: sent, refMap, skippedPast, invalid };
}
