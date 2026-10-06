import React, { useEffect, useState } from "react";
import { TimePicker } from "antd";
import dayjs from "dayjs";

const TimeInputField = ({ name = "", setValueFun, errorMsg, time = "", reset, label, required = false }:any) => {
	const [timeValue, setTimeValue] = useState(null);

	useEffect(() => {
		if (reset) {
			setTimeValue(null);
		}
	}, [reset]);

	useEffect(() => {
		if (time && time.length > 1) {
			const parsedTime:any = dayjs(time, "HH:mm");
			if (parsedTime.isValid()) {
				setTimeValue(parsedTime);
			}
		}
	}, [time]);

	const formatTime = (value:any) => {
		if (value) {
			setTimeValue(value);
			const formattedTime = value.format("HH:mm");
			setValueFun({ target: { name, value: formattedTime } });
		} else {
			setTimeValue(null);
			setValueFun({ target: { name, value: "" } });
		}
	};

	return (
		<div>
			{label && <label className="block text-sm font-medium text-gray-700">{label} {required && <span className="font-bold text-red-500">*</span>}</label>}
			<div className="flex space-x-2">
				<div style={{ width: "100%" }}>
					<TimePicker
						use12Hours
						format="hh:mm A"
						value={timeValue}
						onChange={formatTime}
						className="w-full h-10"
						status={errorMsg ? "error" : ""}
						placeholder="Time"
						showSecond={false}
						allowClear
						inputReadOnly
						popupClassName="time-picker-popup"
					/>
				</div>
			</div>
			{errorMsg && <small className="text-red-500 text-sm">{errorMsg}</small>}
		</div>
	);
};

export default TimeInputField;
