import { Select } from "antd";
import InputLabel from "./InputLabel";
import ValidationErrorMessage from "./validationErrorMessage/ValidationErrorMessage";

export default function TagsDropdown({
	error,
	labelText,
	selectionValue,
	onSelectChange,
	selectionOptions,
	isRequired = true,
	isReadOnly = false,
	inputSize = "large",
	customErrorMessage = "",
	inputPlaceholder = "Placeholder Here",
}: any) {
	return (
		<>
			<div className="flex flex-col w-full gap-1">
				{labelText && <InputLabel labelText={labelText} isRequired={isRequired} />}
				<Select
					mode="tags"
					size={inputSize}
					placeholder={inputPlaceholder}
					style={{ width: "100%" }}
					value={selectionValue}
					onChange={onSelectChange}
					options={selectionOptions}
					disabled={isReadOnly}
					status={error ? "error" : ""}
				/>
				{error && <ValidationErrorMessage errorText={customErrorMessage || `Selection of ${labelText} is required.`} />}
			</div>
		</>
	);
}
