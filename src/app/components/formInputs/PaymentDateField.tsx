"use client";

// A money form's date is not a choice, it is "when this happened", and that is almost
// always now. So the field shows the time read-only and only an explicit Edit press
// hands over a picker — which is also what stops a stray click producing a silent 00:00.
import { dhakaNow, toDhakaWallClock } from "@/helper/DhakaTime";
import { Button, Modal } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import DateTimeInputField from "./DateTimeInputField";
import InputLabel from "./InputLabel";

const WALL_CLOCK = "YYYY-MM-DD HH:mm:ss";
const DISPLAY = "DD MMM YYYY, hh:mm A";
const CLOCK = "hh:mm A";

// `value` is already Dhaka wall-clock, so it is parsed and formatted as-is: running it
// through formatDhaka would convert it a second time and shift the digits for anyone
// whose browser is not on Dhaka time.
const formatWallClock = (value: string, pattern: string) => dayjs(value).format(pattern);

// Night = 23:00–05:59 Dhaka; future = more than 5 minutes ahead. Both are the shapes a
// mistyped or default-00:00 entry takes.
export const isUnusualPaymentTime = (value: string): { unusual: boolean; reason: "night" | "future" | null } => {
	const picked = dayjs(value);
	if (!value || !picked.isValid()) return { unusual: false, reason: null };

	const hour = picked.hour();
	if (hour >= 23 || hour < 6) return { unusual: true, reason: "night" };

	// Both sides are Dhaka wall-clock in a format that sorts chronologically as text,
	// so no timezone maths is needed to compare them.
	if (value > dhakaNow().add(5, "minute").format(WALL_CLOCK)) return { unusual: true, reason: "future" };

	return { unusual: false, reason: null };
};

// Keep proceeds, Edit just closes this dialog — the picker is still open behind it.
export const confirmUnusualTime = (label: string, value: string, onKeep: () => void) => {
	Modal.confirm({
		title: `${label} looks unusual`,
		content: `${label} ${formatWallClock(value, CLOCK)} looks unusual. Keep it or edit?`,
		okText: "Keep",
		cancelText: "Edit",
		onOk: onKeep,
		// Above the form modal it is asked from, the way the duplicate-transaction one is.
		zIndex: 1050,
	});
};

export default function PaymentDateField({
	value,
	onChange,
	label = "Payment time",
	labelWhenNow = "Now (set when you confirm)",
}: {
	value: string | null;
	onChange: (value: string | null) => void;
	label?: string;
	labelWhenNow?: string;
}) {
	// Non-null once Edit is pressed: the time the picker starts from, captured then so a
	// later re-render does not move it under the staff member's cursor.
	const [seed, setSeed] = useState<string | null>(null);
	const [open, setOpen] = useState(false);
	const [clock, setClock] = useState(() => dhakaNow().format(CLOCK));

	const editing = seed !== null;

	useEffect(() => {
		if (editing || value !== null) return;
		const id = setInterval(() => setClock(dhakaNow().format(CLOCK)), 1000);
		return () => clearInterval(id);
	}, [editing, value]);

	if (editing) {
		return (
			<DateTimeInputField
				labelText={label}
				dateTimeValue={value ?? seed}
				// Without a defaultValue the picker writes 00:00 the moment a day is clicked.
				showTimeDefaultValue={seed}
				showNow={false}
				open={open}
				onOpenChange={setOpen}
				autoFocus
				onDateTimeChange={(date: any) => onChange(date ? date.format(WALL_CLOCK) : null)}
			/>
		);
	}

	return (
		<div className="flex flex-col w-full gap-1">
			<InputLabel labelText={label} />
			<div className="flex items-center gap-2">
				<span className="text-sm text-gray-800">{value ? formatWallClock(value, DISPLAY) : `Now — ${clock}`}</span>
				<Button
					size="small"
					onClick={() => {
						setSeed(value ?? toDhakaWallClock(dhakaNow().toDate()));
						setOpen(true);
					}}
				>
					Edit
				</Button>
			</div>
			{!value && <span className="text-xs text-gray-500">{labelWhenNow}</span>}
		</div>
	);
}
