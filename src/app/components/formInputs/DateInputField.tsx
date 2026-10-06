"use client";

import { DatePicker } from "antd";
import dayjs from "dayjs";
import InputLabel from "./InputLabel";
import ValidationErrorMessage from "./validationErrorMessage/ValidationErrorMessage";

export default function DateInputField({
	error,
	labelText,
	dateValue,
	onDateChange,
	isRequired = false,
	isReadOnly = false,
	inputSize = "large",
	customErrorMessage = "",
	inputPlaceholder = "Select a date",
	dateFormat = "YYYY-MM-DD",
}: any) {
	return (
		<div className="flex flex-col w-full gap-1">
			{labelText && <InputLabel labelText={labelText} isRequired={isRequired} />}
			<DatePicker
				size={inputSize}
				value={dateValue ? dayjs(dateValue) : null}
				onChange={onDateChange}
				format={dateFormat}
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
