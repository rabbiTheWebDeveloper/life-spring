import { Input } from "antd";
import InputLabel from "./InputLabel";
import ValidationErrorMessage from "./validationErrorMessage/ValidationErrorMessage";

export default function InputField({
	labelText,
	inputName,
	onInputChange,
	inputValue,
	inputMaxLength = 75,
	error,
	isRequired = true,
	isReadOnly = false,
	inputType = "text",
	inputSize = "large",
	inputPlaceholder = "Placeholder",
	customErrorMessage = "",
}: any) {
	return (
		<div className="flex w-full flex-col gap-1">
			{labelText && <InputLabel labelText={labelText} isRequired={isRequired} />}

			{inputType === "text" && (
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
			)}

			{inputType === "number" && (
				<Input
					className="w-full"
					type="number"
					name={inputName}
					onKeyDown={(e) => {
						if (["-", "e", "."].includes(e.key)) {
							e.preventDefault();
						}
					}}
					value={inputValue}
					onChange={onInputChange}
					size={inputSize}
					placeholder={inputPlaceholder}
					step="1"
					min={0}
					status={isRequired && error ? "error" : undefined}
					disabled={isReadOnly}
				/>
			)}

			{isRequired && error && <ValidationErrorMessage errorText={customErrorMessage || `${labelText} is required.`} />}
		</div>
	);
}
