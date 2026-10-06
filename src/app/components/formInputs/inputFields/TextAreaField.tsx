import { Input } from "antd";
import InputLabel from "../InputLabel";
import ValidationErrorMessage from "../validationErrorMessage/ValidationErrorMessage";
const { TextArea } = Input;

export default function TextAreaField({
	labelText,
	inputName,
	onInputChange,
	inputValue,
	inputMaxLength = 30,
	inputRows = 2,
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
			<TextArea
				size={inputSize}
				rows={inputRows}
				name={inputName}
				value={inputValue}
				placeholder={inputPlaceholder}
				onChange={onInputChange}
				maxLength={inputMaxLength}
				disabled={isReadOnly}
				status={error && "error"}
			/>

			{isRequired && error && <ValidationErrorMessage errorText={customErrorMessage || `${labelText} is required.`} />}
		</div>
	);
}
