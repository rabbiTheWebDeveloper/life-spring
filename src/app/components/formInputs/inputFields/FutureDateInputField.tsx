

import React, { useEffect, useMemo, useState } from "react";
import { Select } from "antd";

const { Option } = Select;

const FutureDateInputField = ({
															name = "dob",
															setValueFun,
															errorMsg,
															date = "",
															reset,
															label,
															required = false,
														}:any) => {
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1;
	const currentDay = new Date().getDate();

	const [dateValue, setDateValue] = useState<any>({ day: "", month: "", year: "" });

	const months = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December",
	];
	const years = Array.from({ length: 51 }, (_, i) => currentYear + i);

	useEffect(() => {
		if (reset) {
			setDateValue({ day: "", month: "", year: "" });
		}
	}, [reset]);

	useMemo(() => {
		if (date && date.length > 1) {
			const dateParts = date.slice(0, 10).split("T")[0].split("-");
			if (dateParts.length === 3) {
				setDateValue({
					day: dateParts[2],
					month: dateParts[1],
					year: dateParts[0],
				});
			}
		}
	}, [date]);

	const formatDOB = (type:any, value:any) => {
		let year = dateValue?.year;
		let month = dateValue?.month;
		let day = dateValue?.day;

		if (type === "year") {
			year = value;
			setDateValue({ day: "", month: "", year: value });
		} else if (type === "month") {
			month = value;
			setDateValue({ ...dateValue, day: "", month: value });
		} else if (type === "day") {
			day = value;
			setDateValue({ ...dateValue, day: value });
		}

		const formattedMonth = month ? String(month).padStart(2, "0") : "";
		const formattedDay = day ? String(day).padStart(2, "0") : "";

		// If both year, month, and day are available, format the date
		if (year && formattedMonth && formattedDay) {
			const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
			setValueFun({ target: { name: name, value: formattedDate } });
		}
	};

	function getDaysInMonth(year:any, month:any) {
		return new Date(year, month, 0).getDate();
	}

	return (
		<div>
			{label && (
				<label className="block text-sm font-medium text-gray-700">
					{label} {required && <span className="font-bold text-red-500">*</span>}
				</label>
			)}
			<div className="flex space-x-2">
				{/* Year selection */}
				<div style={{ width: "30%" }}>
					<Select
						showSearch
						className={`w-full h-10`}
						status={errorMsg ? "error" : ""}
						value={dateValue?.year || undefined}
						placeholder="Year"
						onChange={(value) => formatDOB("year", value)}
					>
						{years.map((year) => (
							<Option key={year} value={year}>
								{year}
							</Option>
						))}
					</Select>
				</div>

				{/* Month selection */}
				<div style={{ width: "40%" }}>
					<Select
						disabled={!dateValue?.year}
						showSearch
						className={`w-full h-10`}
						status={errorMsg ? "error" : ""}
						value={dateValue?.month ? months[+dateValue?.month - 1] : undefined}
						placeholder="Month"
						onChange={(value) => formatDOB("month", months.indexOf(value) + 1)}
					>
						{months?.slice(dateValue?.year === currentYear ? currentMonth - 1 : 0)
							.map((month) => (
								<Option key={month} value={month}>
									{month}
								</Option>
							))}
					</Select>
				</div>

				{/* Day selection */}
				<div style={{ width: "30%" }}>
					<Select
						disabled={!dateValue?.month}
						showSearch
						className={`w-full h-10`}
						status={errorMsg ? "error" : ""}
						value={dateValue?.day || undefined}
						placeholder="Day"
						onChange={(value) => formatDOB("day", value)}
					>
						{[...Array(getDaysInMonth(dateValue?.year, dateValue?.month))].map((_, i) => {
							const day = i + 1;
							if (
								dateValue?.year === currentYear &&
								dateValue?.month === currentMonth &&
								day < currentDay
							) {
								return null;
							}
							return (
								<Option key={day} value={day}>
									{day}
								</Option>
							);
						})}
					</Select>
				</div>
			</div>
			{errorMsg && <small className="text-red-500 text-sm">{errorMsg}</small>}
		</div>
	);
};

export default FutureDateInputField;

