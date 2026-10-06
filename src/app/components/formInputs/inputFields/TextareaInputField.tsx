import { Input } from "antd";
import InputLabel from "../InputLabel";
import ValidationErrorMessage from "../validationErrorMessage/ValidationErrorMessage";

const { TextArea } = Input;

const TextareaInputField = ({
	name,
	value,
	onChange,
	placeholder,
	error,
	label,
	required = false,
	customErrorMessage = "",
}: any) => {
	return (
		<div className="flex w-full flex-col gap-1">
			{label && <InputLabel labelText={label} isRequired={required} />}
			<TextArea
				name={name}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				rows={2}
				status={error ? "error" : ""}
			/>
			{error && <ValidationErrorMessage errorText={customErrorMessage || `${label} is required.`} />}
		</div>
	);
};

export default TextareaInputField;
