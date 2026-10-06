"use client";

import { Option } from "@/app/types/Options";
import { Button, Input, InputNumber, Select, Switch, Table, Tag } from "antd";
import {
	Day,
	Defaults,
	isChanged,
	isNew,
	newRow,
	removeRow,
	Row,
	slotAfter,
	sortRows,
	clearFree,
	MAX_SLOTS_PER_DAY,
} from "../dayPlan";

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function statusTag(row: Row) {
	if (row.booked) {
		const names = row.bookings.map((b) => b.patientName || `#${b.appointmentId}`).join(", ");
		return <Tag color="red">booked{names ? ` – ${names}` : ""}</Tag>;
	}
	if (isNew(row)) return <Tag color="blue">new</Tag>;
	if (!row.isActive) return <Tag>disabled</Tag>;
	if (isChanged(row)) return <Tag color="orange">edited</Tag>;
	return <Tag color="green">available</Tag>;
}

interface Props {
	day: Day;
	weekday: number;
	readOnly: boolean;
	dayStart: string;
	session: number;
	breakMinutes: number;
	defaults: Defaults;
	slotTypes: Option[];
	highlighted: Set<string>;
	onChange: (day: Day) => void;
}

export default function DayEditor({
	day,
	weekday,
	readOnly,
	dayStart,
	session,
	breakMinutes,
	defaults,
	slotTypes,
	highlighted,
	onChange,
}: Props) {
	const rows = sortRows(day.rows);
	const newCount = rows.filter(isNew).length;
	const full = rows.length >= MAX_SLOTS_PER_DAY;

	const update = (key: string, patch: Partial<Row>) =>
		onChange({ ...day, rows: day.rows.map((r) => (r.key === key ? { ...r, ...patch } : r)) });

	const addAfter = (afterEnd?: string) =>
		onChange({ ...day, rows: [...day.rows, newRow(slotAfter(afterEnd, dayStart, session, breakMinutes), defaults)] });

	const columns = [
		{ title: "#", key: "n", width: 70, render: (_: any, __: Row, i: number) => `Slot ${i + 1}` },
		{
			title: "Start",
			key: "startTime",
			render: (_: any, row: Row) => (
				<input
					type="time"
					className="border rounded px-1 py-0.5"
					value={row.startTime}
					disabled={readOnly || row.booked}
					onChange={(e) => e.target.value && update(row.key, { startTime: e.target.value })}
				/>
			),
		},
		{
			title: "End",
			key: "endTime",
			render: (_: any, row: Row) => (
				<input
					type="time"
					className="border rounded px-1 py-0.5"
					value={row.endTime}
					disabled={readOnly || row.booked}
					onChange={(e) => e.target.value && update(row.key, { endTime: e.target.value })}
				/>
			),
		},
		{
			title: "Patients",
			key: "maxPatients",
			render: (_: any, row: Row) => (
				<InputNumber
					size="small"
					min={Math.max(1, row.bookedPatients)}
					precision={0}
					value={row.maxPatients}
					disabled={readOnly}
					onChange={(v) => v && update(row.key, { maxPatients: v })}
				/>
			),
		},
		{
			title: "Fee",
			key: "doctorFee",
			render: (_: any, row: Row) => (
				<InputNumber
					size="small"
					min={0}
					value={row.doctorFee}
					disabled={readOnly || row.booked}
					onChange={(v) => v !== null && update(row.key, { doctorFee: v })}
				/>
			),
		},
		{
			title: "Type",
			key: "slotType",
			render: (_: any, row: Row) => (
				<Select
					size="small"
					className="min-w-[130px]"
					allowClear={isNew(row)}
					placeholder="Type"
					value={row.slotType ?? undefined}
					options={slotTypes}
					disabled={readOnly || row.booked}
					onChange={(v) => update(row.key, { slotType: v ?? null })}
				/>
			),
		},
		{
			title: "Note",
			key: "notes",
			render: (_: any, row: Row) => (
				<Input
					size="small"
					maxLength={1000}
					value={row.notes}
					disabled={readOnly}
					onChange={(e) => update(row.key, { notes: e.target.value })}
				/>
			),
		},
		{
			title: "Active",
			key: "isActive",
			render: (_: any, row: Row) => (
				<Switch
					size="small"
					checked={row.isActive}
					disabled={readOnly || row.booked}
					onChange={(v) => update(row.key, { isActive: v })}
				/>
			),
		},
		{ title: "Status", key: "status", render: (_: any, row: Row) => statusTag(row) },
		{
			title: "",
			key: "actions",
			render: (_: any, row: Row) =>
				readOnly ? null : (
					<div className="flex gap-1">
						<Button size="small" type="link" disabled={full} onClick={() => addAfter(row.endTime)}>
							Add after
						</Button>
						<Button size="small" type="link" danger disabled={row.booked} onClick={() => onChange(removeRow(day, row.key))}>
							Delete
						</Button>
					</div>
				),
		},
	];

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<h2 className="font-semibold text-gray-700">
					{day.date} ({WEEKDAY_NAMES[weekday]}) · {rows.length} slots
					{newCount > 0 && <span className="text-blue-600"> · {newCount} new (not saved)</span>}
					{readOnly && <span className="text-gray-500"> · past day, read-only</span>}
				</h2>
				{!readOnly && (
					<div className="flex gap-2">
						<Button size="small" disabled={full} onClick={() => addAfter(rows[rows.length - 1]?.endTime)}>
							+ Add slot
						</Button>
						<Button size="small" onClick={() => onChange(clearFree(day))}>
							Clear free slots
						</Button>
					</div>
				)}
			</div>
			<Table
				size="small"
				rowKey="key"
				dataSource={rows}
				columns={columns}
				pagination={false}
				scroll={{ x: true }}
				rowClassName={(row: Row) =>
					highlighted.has(row.key) ? "bg-orange-50" : isNew(row) ? "bg-blue-50" : ""
				}
				locale={{ emptyText: "No slots. Generate or add one." }}
			/>
		</div>
	);
}
