import React, {useEffect, useMemo, useState} from "react";
import {Select} from "antd";

const {Option} = Select;

const DOBComponent = ({name = "dob",setValueFun, errorMsg, date = "",reset}: any) => {
	const currentYear = new Date().getFullYear();
	const [dateValue, setDateValue] = useState({day: "", month: "", year: ""});
	const days = Array.from({length: 31}, (_, i) => i + 1);
	const months = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];
	const years = Array.from({length: currentYear - 1899}, (_, i) => 1900 + i);
	const [currentDate, setCurrentDate] = useState({
		day: new Date().getDay(),
		month: new Date().getMonth() + 1,
		year: new Date().getFullYear()
	});
	useEffect(() => {
		if(reset){
			setCurrentDate({day: new Date().getDate(), month: new Date().getMonth() + 1, year: new Date().getFullYear()})
			setDateValue({day: "", month: "", year: ""})
		}

	}, [reset])

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


	const formatDOB = (type: any, value: any) => {
		let year: any = dateValue?.year;
		let month: any = dateValue?.month || currentDate?.month;
		let day = dateValue?.day || currentDate?.day;
		if (type === "year") {
			year = value;
			setDateValue({day: "", month: "", year: value});
		} else if (type === "month") {
			month = value;
			setDateValue({...dateValue, day: "", month: value});
		} else if (type === "day") {
			day = value
			setDateValue({...dateValue, day: value});
		}

		let returnDate = new Date(`${month}-${day}-${year}`)
		setValueFun({target: {name: name, value: returnDate}})
	};

	function getDaysInMonth(month: any) {
		const year = new Date().getFullYear();
		return new Date(year, month, 0).getDate();
	}

	return (
		<div>
			<label className="font-medium">Date of birth <span
				className="text-red-500 font-bold">*</span></label>
			<div className="mt-1 flex space-x-2">
				<div style={{width: "30%"}}>
					<Select
						showSearch
						className={`w-full h-10 ${errorMsg ? "border border-red-500 rounded" : ""} `}
						value={dateValue?.year || undefined}
						placeholder="Year"
						onChange={(value) => formatDOB("year", value)}
					>
						{years.map((year) => (
							<Option key={year} value={year}>{year}</Option>
						))}
					</Select>
				</div>

				<div style={{width: "40%"}}>
					<Select
						disabled={!dateValue?.year}
						showSearch
						className="w-full h-10"
						value={dateValue?.month ? months[+dateValue?.month - 1] : undefined}
						placeholder="Month"
						optionFilterProp="children"
						onChange={(value) => formatDOB("month", months.indexOf(value) + 1)}
						filterOption={(input, option: any) =>
							option?.children.toLowerCase().includes(input.toLowerCase())
						}
					>
						{months?.slice(0, (+currentDate?.year == +dateValue?.year ? currentDate?.month : 12))?.map((month, index) => (
							<Option key={month} value={month}>{month}</Option>
						))}
					</Select>
				</div>

				<div style={{width: "30%"}}>
					<Select
						disabled={!dateValue?.month}
						showSearch
						className="w-full h-10"
						value={dateValue?.day || undefined}
						placeholder="Day"
						onChange={(value) => formatDOB("day", value)}
					>
						{days?.slice(0, ((+currentDate?.year == +dateValue?.year && +currentDate?.month == +dateValue?.month) ? +currentDate?.day : getDaysInMonth(dateValue?.month)))?.map((day) => (
							<Option key={day} value={day}>{day}</Option>
						))}
					</Select>
				</div>
			</div>
			{errorMsg && <small className="text-red-500 text-sm ">{errorMsg}</small>}
		</div>
	);
};

export default DOBComponent;
