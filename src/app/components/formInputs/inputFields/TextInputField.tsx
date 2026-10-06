import { Input } from "antd";
import InputLabel from "../InputLabel";
import ValidationErrorMessage from "../validationErrorMessage/ValidationErrorMessage";

export default function TextInputField({
	labelText,
	inputName,
	onInputChange,
	inputValue,
	inputMaxLength = 75,
	error,
	isRequired = true,
	isReadOnly = false,
	inputSize = "large",
	inputPlaceholder = "Placeholder",
	customErrorMessage = "",
}: any) {
	return (
		<div className="flex w-full flex-col gap-1">
			{labelText && <InputLabel labelText={labelText} isRequired={isRequired} />}
			<Input
				className="w-full"
				size={inputSize}
				name={inputName}
				value={inputValue}
				placeholder={inputPlaceholder}
				onChange={onInputChange}
				maxLength={inputMaxLength}
				status={isRequired && error ? "error" : undefined}
				disabled={isReadOnly}
			/>

			{error && <ValidationErrorMessage errorText={customErrorMessage || `${labelText} is required.`} />}
		</div>
	);
}
