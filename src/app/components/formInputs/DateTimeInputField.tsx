"use client";

import { DatePicker } from "antd";
import dayjs from "dayjs";
import InputLabel from "./InputLabel";
import ValidationErrorMessage from "./validationErrorMessage/ValidationErrorMessage";

export default function DateTimeInputField({
	error,
	labelText,
	dateTimeValue,
	dateValue, // ✅ backward compatibility
	onDateTimeChange,
	onDateChange, // ✅ backward compatibility
	isRequired = false,
	isReadOnly = false,
	inputSize = "large",
	customErrorMessage = "",
	inputPlaceholder = "Select date and time",
	dateTimeFormat = "YYYY-MM-DD HH:mm:ss",
	showTimeDefaultValue,
	showNow,
	open,
	onOpenChange,
	autoFocus,
}: any) {
	const value = dateTimeValue || dateValue || null;
	const handleChange = onDateTimeChange || onDateChange;

	return (
		<div className="flex flex-col w-full gap-1">
			{labelText && <InputLabel labelText={labelText} isRequired={isRequired} />}
			<DatePicker
				size={inputSize}
				value={value ? dayjs(value) : null}
				onChange={handleChange}
				// A defaultValue keeps the preselected time when only a day is clicked.
				showTime={showTimeDefaultValue ? { defaultValue: dayjs(showTimeDefaultValue) } : true}
				showNow={showNow}
				open={open}
				onOpenChange={onOpenChange}
				autoFocus={autoFocus}
				format={dateTimeFormat}
				placeholder={inputPlaceholder}
				className="w-full"
				status={error ? "error" : undefined}
				disabled={isReadOnly}
			/>
			{isRequired && error && (
				<ValidationErrorMessage errorText={customErrorMessage || `Selection of ${labelText} is required.`} />
			)}
		</div>
	);
}
