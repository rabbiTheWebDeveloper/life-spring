"use client";

import { getOptions } from "@/app/actions/getOptions";
import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";
import { emptyOptions, Options } from "@/app/types/Options";
import { Alert, Button, Checkbox, InputNumber, Modal, Select, Spin, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { getDoctorDetails } from "../../actions/getDoctorDetails";
import { setDoctorFee } from "../../actions/setDoctorFee";
import { getDayPlan, saveDayPlan } from "./actions/dayPlan";
import DayEditor from "./components/DayEditor";
import WeekGrid from "./components/WeekGrid";
import {
	addDays,
	clearFree,
	datesInRange,
	Day,
	dhakaToday,
	fromServer,
	generateTimes,
	isDirty,
	isFree,
	MAX_DAYS,
	mergeGenerated,
	toPayload,
	weekdayOf,
} from "./dayPlan";

const WEEKDAY_OPTIONS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label, value) => ({ label, value }));

interface Props {
	params: { id: string };
	searchParams: { [key: string]: string | undefined };
}

export default function DayPlannerPage({ params, searchParams }: Props) {
	const doctorId = params.id;
	const today = dhakaToday();
	const initialDate = searchParams.date ?? today;

	const [doctor, setDoctor] = useState<any>(null);
	const [options, setOptions] = useState<Options>(emptyOptions);
	const [branchId, setBranchId] = useState<number | null>(searchParams.branchId ? Number(searchParams.branchId) : null);
	const [range, setRange] = useState({
		start: initialDate,
		end: searchParams.date ? initialDate : addDays(initialDate, 6),
	});
	const [weekdays, setWeekdays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
	const [settings, setSettings] = useState({
		dayStart: "09:00",
		dayEnd: "17:00",
		sessionMinutes: 50,
		breakMinutes: 10,
		doctorFee: 0,
		maxPatients: 1,
		slotType: null as string | null,
	});
	const [days, setDays] = useState<Record<string, Day>>({});
	const [focusDate, setFocusDate] = useState(initialDate);
	const [highlighted, setHighlighted] = useState<Set<string>>(new Set());
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [makeDefaultFee, setMakeDefaultFee] = useState(false);
	const settingsBranch = useRef<number | null>(null);

	const profileFee = Number(doctor?.fee) || 0;
	const feeDiffers = !!doctor && settings.doctorFee !== profileFee;
	const allDates = datesInRange(range.start, range.end);
	const shownDates = allDates.filter((date) => weekdays.includes(weekdayOf(date)));
	const shown = new Set(shownDates);
	const focus = shown.has(focusDate) ? focusDate : shownDates[0];
	const dirty = Object.values(days).some(isDirty);

	useEffect(() => {
		getOptions().then(setOptions);
		getDoctorDetails(doctorId)
			.then((res: any) => {
				if (!res?.success) throw new Error(res?.message);
				setDoctor(res.data);
				setSettings((s) => ({ ...s, doctorFee: Number(res.data?.fee) || 0 }));
				setBranchId((id) => id ?? res.data?.branches?.[0]?.id ?? null);
			})
			.catch(() => setError("Failed to load the professional's details"));
	}, [doctorId]);

	const load = async () => {
		if (!branchId || !range.start || !range.end) return;
		setLoading(true);
		setError(null);
		setHighlighted(new Set());
		const res = await getDayPlan(doctorId, branchId, range.start, range.end);
		setLoading(false);
		if (!res.success) {
			setDays({});
			setError(res.message);
			return;
		}
		const byDate: Record<string, any[]> = Object.fromEntries(res.data.days.map((d: any) => [d.date, d.slots]));
		setDays(
			Object.fromEntries(
				datesInRange(range.start, range.end).map((date) => [
					date,
					{ date, rows: (byDate[date] ?? []).map(fromServer), deleteIds: [] },
				])
			)
		);
		const last = res.data.lastUsed;
		if (last && settingsBranch.current !== branchId) {
			settingsBranch.current = branchId;
			setSettings((s) => ({
				...s,
				dayStart: last.dayStart ?? s.dayStart,
				dayEnd: last.dayEnd ?? s.dayEnd,
				sessionMinutes: last.sessionMinutes || s.sessionMinutes,
				breakMinutes: last.breakMinutes ?? s.breakMinutes,
			}));
		}
	};

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [branchId, range.start, range.end]);

	const confirmDiscard = (apply: () => void) => {
		if (!dirty) return apply();
		Modal.confirm({ title: "Discard unsaved changes?", okText: "Discard", onOk: apply });
	};

	const changeRange = (next: { start: string; end: string }) => {
		if (!next.start || !next.end) return;
		if (next.end < next.start) return message.error("End date must be on or after start date");
		if (datesInRange(next.start, next.end).length > MAX_DAYS) {
			return message.error(`Pick at most ${MAX_DAYS} days`);
		}
		confirmDiscard(() => setRange(next));
	};

	const setDay = (day: Day) => setDays((prev) => ({ ...prev, [day.date]: day }));

	const defaults = { maxPatients: settings.maxPatients, doctorFee: settings.doctorFee, slotType: settings.slotType };
	const editableDates = shownDates.filter((date) => date >= today && days[date]);

	const generate = () => {
		const times = generateTimes(settings.dayStart, settings.dayEnd, settings.sessionMinutes, settings.breakMinutes);
		if (!times.length) return message.error("Day start, day end and session length give no slots");
		let added = 0;
		let truncated = 0;
		const next = { ...days };
		for (const date of editableDates) {
			const result = mergeGenerated(next[date], times, defaults);
			next[date] = result.day;
			added += result.added;
			truncated += result.truncated;
		}
		setDays(next);
		if (truncated) message.warning(`${truncated} slots left out: a day holds at most 96 slots`);
		message.info(`${added} new slots in the preview. Nothing is saved until you press Save.`);
	};

	const clearAll = () => {
		const count = editableDates.reduce((n, date) => n + days[date].rows.filter(isFree).length, 0);
		if (!count) return message.info("No free slots to clear");
		Modal.confirm({
			title: `Clear ${count} free slots on ${editableDates.length} days?`,
			content: "Booked and disabled slots stay. Nothing is saved until you press Save.",
			okText: "Clear",
			onOk: () => {
				const next = { ...days };
				editableDates.forEach((date) => (next[date] = clearFree(next[date])));
				setDays(next);
			},
		});
	};

	const save = async (confirmWarnings = false) => {
		const payload = toPayload(Object.values(days), dhakaToday());
		if (payload.skippedPast.length) message.warning(`Past days not saved: ${payload.skippedPast.join(", ")}`);
		if (!payload.days.length) return message.info("Nothing to save");
		if (payload.invalid.length) {
			setHighlighted(new Set(payload.invalid));
			return message.error(`${payload.invalid.length} slots end at or before they start. Fix the highlighted rows.`);
		}
		setSaving(true);
		setError(null);
		const res = await saveDayPlan(doctorId, {
			branchId,
			sessionMinutes: settings.sessionMinutes,
			breakMinutes: settings.breakMinutes,
			confirmWarnings,
			days: payload.days,
		});
		setSaving(false);
		if (!res.success) {
			if (res.status === 409) {
				Modal.confirm({
					title: "The schedule changed",
					content: `${res.message} Unsaved changes on all days will be lost.`,
					okText: "Reload",
					onOk: load,
				});
			} else {
				setError(res.message);
			}
			return;
		}
		if (!res.data.saved) {
			const warnings: any[] = res.data.warnings ?? [];
			setHighlighted(
				new Set(warnings.flatMap((w) => w.refs.map((ref: any) => payload.refMap[String(ref)]).filter(Boolean)))
			);
			Modal.confirm({
				title: "Are you sure you want to save with these warnings?",
				width: 600,
				content: (
					<ul className="list-disc pl-4">
						{warnings.map((w, i) => (
							<li key={i}>{w.message}</li>
						))}
					</ul>
				),
				okText: "Save anyway",
				onOk: () => save(true),
			});
			return;
		}
		const byDate: Record<string, any[]> = Object.fromEntries(res.data.days.map((d: any) => [d.date, d.slots]));
		setDays((prev) => {
			const next = { ...prev };
			payload.days.forEach(({ date }) => {
				next[date] = { date, rows: (byDate[date] ?? []).map(fromServer), deleteIds: [] };
			});
			return next;
		});
		setHighlighted(new Set());
		message.success("Schedule saved");
		if (feeDiffers && makeDefaultFee) {
			const fee = settings.doctorFee;
			const feeRes = await setDoctorFee(doctorId, fee);
			if (feeRes.success) {
				setDoctor((d: any) => ({ ...d, fee }));
				setMakeDefaultFee(false);
				message.success("Default fee updated");
			} else {
				setError(`Schedule saved, but the default fee was not updated: ${feeRes.message}`);
			}
		}
	};

	return (
		<ContentWrapper>
			<div className="flex flex-col gap-4">
				<h1 className="text-xl font-semibold">Day planner{doctor?.name ? ` – ${doctor.name}` : ""}</h1>

				<div className="flex flex-wrap items-end gap-3">
					<Field label="Branch">
						<Select
							className="min-w-[200px]"
							placeholder="Select branch"
							value={branchId ?? undefined}
							options={(doctor?.branches ?? []).map((b: any) => ({ value: b.id, label: b.name }))}
							onChange={(v) => confirmDiscard(() => setBranchId(v))}
						/>
					</Field>
					<Field label="From">
						<input
							type="date"
							className="border rounded p-1"
							value={range.start}
							onChange={(e) => changeRange({ ...range, start: e.target.value })}
						/>
					</Field>
					<Field label="To">
						<input
							type="date"
							className="border rounded p-1"
							value={range.end}
							onChange={(e) => changeRange({ ...range, end: e.target.value })}
						/>
					</Field>
					<Field label="Weekdays">
						<Checkbox.Group options={WEEKDAY_OPTIONS} value={weekdays} onChange={(v) => setWeekdays(v as number[])} />
					</Field>
				</div>

				<div className="flex flex-wrap items-end gap-3">
					<Field label="Day start">
						<input
							type="time"
							className="border rounded p-1"
							value={settings.dayStart}
							onChange={(e) => setSettings({ ...settings, dayStart: e.target.value })}
						/>
					</Field>
					<Field label="Day end">
						<input
							type="time"
							className="border rounded p-1"
							value={settings.dayEnd}
							onChange={(e) => setSettings({ ...settings, dayEnd: e.target.value })}
						/>
					</Field>
					<Field label="Session (min)">
						<InputNumber min={1} precision={0} value={settings.sessionMinutes} onChange={(v) => v && setSettings({ ...settings, sessionMinutes: v })} />
					</Field>
					<Field label="Break (min)">
						<InputNumber min={0} precision={0} value={settings.breakMinutes} onChange={(v) => v !== null && setSettings({ ...settings, breakMinutes: v })} />
					</Field>
					<Field label="Fee">
						<InputNumber min={0} precision={0} value={settings.doctorFee} onChange={(v) => v !== null && setSettings({ ...settings, doctorFee: v })} />
					</Field>
					{feeDiffers && (
						<Checkbox className="pb-1" checked={makeDefaultFee} onChange={(e) => setMakeDefaultFee(e.target.checked)}>
							Make ৳{settings.doctorFee} the default fee for {doctor?.name}
						</Checkbox>
					)}
					<Field label="Patients per slot">
						<InputNumber min={1} precision={0} value={settings.maxPatients} onChange={(v) => v && setSettings({ ...settings, maxPatients: v })} />
					</Field>
					<Field label="Type">
						<Select
							className="min-w-[150px]"
							allowClear
							placeholder="Type"
							value={settings.slotType ?? undefined}
							options={options.appointmentType}
							onChange={(v) => setSettings({ ...settings, slotType: v ?? null })}
						/>
					</Field>
					<Button onClick={generate} disabled={!editableDates.length}>
						Generate preview
					</Button>
					<Button onClick={clearAll} disabled={!editableDates.length}>
						Clear free slots
					</Button>
					<Button type="primary" loading={saving} disabled={!dirty} onClick={() => save()}>
						Save
					</Button>
				</div>

				{doctor && !doctor.branches?.length && (
					<Alert type="warning" showIcon message="Assign a branch to this professional first." />
				)}
				{error && <Alert type="error" showIcon message={error} closable onClose={() => setError(null)} />}
				{dirty && <Alert type="info" message="Preview: new and edited slots (blue) are not saved yet." />}

				<Spin spinning={loading}>
					<div className="flex flex-col gap-4">
						{allDates.length > 1 && (
							<WeekGrid dates={allDates} shown={shown} days={days} focusDate={focus} today={today} onFocus={setFocusDate} />
						)}
						{focus && days[focus] && (
							<DayEditor
								day={days[focus]}
								weekday={weekdayOf(focus)}
								readOnly={focus < today}
								dayStart={settings.dayStart}
								session={settings.sessionMinutes}
								breakMinutes={settings.breakMinutes}
								defaults={defaults}
								slotTypes={options.appointmentType}
								highlighted={highlighted}
								onChange={setDay}
							/>
						)}
					</div>
				</Spin>
			</div>
		</ContentWrapper>
	);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex flex-col gap-1">
			<label className="text-sm text-gray-700">{label}</label>
			{children}
		</div>
	);
}
