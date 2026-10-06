
import React, { useEffect, useMemo, useState } from "react";
import { Select, TimePicker } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const FutureDateTimeInputField = ({ name = "dob", setValueFun, errorMsg, date = "", reset, label, required = false }:any) => {
	const currentYear = new Date().getFullYear();
	const currentMonth = dayjs().month() + 1;
	const currentDay = dayjs().date();
	const [dateValue, setDateValue] = useState<any>({ day: "", month: "", year: "", time: null }); // Set time to null by default
	const days = Array.from({ length: 31 }, (_, i) => i + 1);
	const months = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];
	const years = Array.from({ length: 51 }, (_, i) => currentYear + i);

	useEffect(() => {
		if (reset) {
			setDateValue({ day: "", month: "", year: "", time: null });
		}
	}, [reset]);

	useMemo(() => {
		if (date && date.length > 1) {
			const [datePart, timePart] = date.split("T");
			const dateParts = datePart.split("-");
			if (dateParts.length === 3) {
				setDateValue({
					day: dateParts[2],
					month: dateParts[1],
					year: dateParts[0],
					time: timePart ? dayjs(`2000-01-01T${timePart}`) : null,
				});
			}
		}
	}, [date]);

	const formatDOB = (type:any, value:any) => {
		let { year, month, day, time } = dateValue;

		if (type === "year") {
			year = value;
			setDateValue({ day: "", month: "", year: value, time });
		} else if (type === "month") {
			month = value;
			setDateValue({ ...dateValue, day: "", month: value });
		} else if (type === "day") {
			day = value;
			setDateValue({ ...dateValue, day: value });
		} else if (type === "time") {
			time = value;
			setDateValue({ ...dateValue, time });
		}

		// Format with proper zero-padding for month and day
		const formattedMonth = month ? month.toString().padStart(2, '0') : "";
		const formattedDay = day ? day.toString().padStart(2, '0') : "";

		// Format time to HH:mm (without seconds)
		const formattedTime = time ? time.format("HH:mm") : "";

		// Build the formatted date string
		let returnDate = "";
		if (year && formattedMonth && formattedDay) {
			returnDate = `${year}-${formattedMonth}-${formattedDay}`;
			if (formattedTime) {
				returnDate += `T${formattedTime}`;
			}
		}

		setValueFun({ target: { name, value: returnDate } });
	};

	function getDaysInMonth(month:any, year:any) {
		return new Date(year, month, 0).getDate();
	}

	const getDaysForSelection = () => {
		if (!dateValue.year || !dateValue.month) return [];

		const selectedYear = parseInt(dateValue.year);
		const selectedMonth = parseInt(dateValue.month);
		const totalDaysInMonth = getDaysInMonth(selectedMonth, selectedYear);
		if (selectedYear === currentYear && selectedMonth === currentMonth) {
			return Array.from({ length: totalDaysInMonth - currentDay + 1 }, (_, i) => i + currentDay);
		}
		else {
			return Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
		}
	};

	const getMonthsForSelection = () => {
		if (!dateValue.year) return [];

		const selectedYear = parseInt(dateValue.year);
		if (selectedYear === currentYear) {
			return months.slice(currentMonth - 1);
		}
		else {
			return months;
		}
	};

	return (
		<div>
			{label && <label className="block text-sm font-medium text-gray-700">{label} {required && <span className="font-bold text-red-500">*</span>}</label>}
			<div className="flex space-x-2">
				<div style={{ width: "20%" }}>
					<Select
						showSearch
						className={`w-full h-10`}
						status={errorMsg ? "error" : ""}
						value={dateValue?.year || undefined}
						placeholder="Year"
						onChange={(value) => formatDOB("year", value)}
					>
						{years.map((year) => (
							<Option key={year} value={year}>{year}</Option>
						))}
					</Select>
				</div>

				<div style={{ width: "25%" }}>
					<Select
						disabled={!dateValue?.year}
						showSearch
						className={`w-full h-10`}
						status={errorMsg ? "error" : ""}
						value={dateValue?.month ? months[+dateValue?.month - 1] : undefined}
						placeholder="Month"
						onChange={(value) => formatDOB("month", months.indexOf(value) + 1)}
					>
						{getMonthsForSelection().map((month) => (
							<Option key={month} value={month}>{month}</Option>
						))}
					</Select>
				</div>

				<div style={{ width: "20%" }}>
					<Select
						disabled={!dateValue?.month}
						showSearch
						className={`w-full h-10`}
						status={errorMsg ? "error" : ""}
						value={dateValue?.day || undefined}
						placeholder="Day"
						onChange={(value) => formatDOB("day", value)}
					>
						{getDaysForSelection().map((day) => (
							<Option key={day} value={day}>{day}</Option>
						))}
					</Select>
				</div>

				<div style={{ width: "30%" }}>
					<TimePicker
						use12Hours={true}
						disabled={!dateValue?.day}
						format="h:mm A"
						value={dateValue?.time}
						onChange={(value) => formatDOB("time", value)}
						className={`w-full h-10`}
						status={errorMsg ? "error" : ""}
						placeholder="Time"
						showSecond={false}
						allowClear={true}
						popupClassName="time-picker-popup"
						inputReadOnly={false}
					/>
				</div>
			</div>

			{errorMsg && <small className="text-red-500 text-sm">{errorMsg}</small>}
		</div>
	);
};

export default FutureDateTimeInputField;
