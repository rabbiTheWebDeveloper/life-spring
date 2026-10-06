import { Select } from "antd";
import InputLabel from "./InputLabel";
import ValidationErrorMessage from "./validationErrorMessage/ValidationErrorMessage";

export default function DropdownWithSearch({
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
	// Optional server-side search. Pass `onSearch` and the Select stops filtering
	// the options itself and just renders whatever the caller hands it. Left
	// undefined (every other caller) the behaviour is unchanged: local filtering
	// on the option label.
	onSearch,
	isLoading = false,
	notFoundContent,
}: any) {
	return (
		<>
			<div className="flex flex-col w-full gap-1">
				{labelText && <InputLabel labelText={labelText} isRequired={isRequired} />}
				<Select
					size={inputSize}
					value={selectionValue}
					placeholder={inputPlaceholder}
					className="w-full"
					options={selectionOptions}
					onChange={onSelectChange}
					showSearch
					optionFilterProp="label"
					onSearch={onSearch}
					filterOption={onSearch ? false : undefined}
					loading={isLoading}
					notFoundContent={notFoundContent}
					status={error ? "error" : undefined}
					disabled={isReadOnly}
				/>
				{isRequired && error && (
					<ValidationErrorMessage errorText={customErrorMessage || `Selection of ${labelText} is required.`} />
				)}
			</div>
		</>
	);
}
