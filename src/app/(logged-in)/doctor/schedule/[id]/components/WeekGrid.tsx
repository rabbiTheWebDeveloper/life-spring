"use client";

import { Day, isChanged, isNew, Row, sortRows, weekdayOf } from "../dayPlan";

const HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const chipClass = (row: Row) =>
	row.booked
		? "bg-red-100 text-red-700"
		: isNew(row) || isChanged(row)
		? "bg-blue-100 text-blue-700"
		: !row.isActive
		? "bg-gray-200 text-gray-500"
		: "bg-green-100 text-green-700";

interface Props {
	dates: string[];
	shown: Set<string>;
	days: Record<string, Day>;
	focusDate: string;
	today: string;
	onFocus: (date: string) => void;
}

export default function WeekGrid({ dates, shown, days, focusDate, today, onFocus }: Props) {
	const padding = dates.length ? weekdayOf(dates[0]) : 0;
	return (
		<div className="overflow-x-auto">
			<div className="grid grid-cols-7 gap-1 min-w-[700px]">
				{HEADERS.map((h) => (
					<div key={h} className="text-xs font-semibold text-gray-600 text-center">
						{h}
					</div>
				))}
				{Array.from({ length: padding }).map((_, i) => (
					<div key={`pad-${i}`} />
				))}
				{dates.map((date) => {
					const rows = sortRows(days[date]?.rows ?? []);
					const newCount = rows.filter(isNew).length;
					if (!shown.has(date)) {
						return <div key={date} className="border rounded p-1 text-xs text-gray-300 min-h-[60px]">{date.slice(5)}</div>;
					}
					return (
						<button
							key={date}
							type="button"
							onClick={() => onFocus(date)}
							className={`border rounded p-1 text-left min-h-[60px] ${
								date === focusDate ? "border-blue-500 ring-1 ring-blue-500" : ""
							} ${date < today ? "bg-gray-50" : "bg-white"}`}
						>
							<div className="text-xs font-semibold">{date.slice(5)}</div>
							<div className="text-[11px] text-gray-600">
								{rows.length} slots{newCount > 0 && <span className="text-blue-600"> · {newCount} new</span>}
							</div>
							<div className="flex flex-wrap gap-0.5 mt-1">
								{rows.map((row) => (
									<span key={row.key} className={`text-[10px] px-1 rounded ${chipClass(row)}`}>
										{row.startTime}
									</span>
								))}
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
