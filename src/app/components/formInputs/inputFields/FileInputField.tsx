import InputLabel from "../InputLabel";
import ValidationErrorMessage from "../validationErrorMessage/ValidationErrorMessage";

export default function FileInputField({
	labelText,
	fileValue,
	onFileChange,
	isRequired = true,
	error,
	customErrorMessage = "",
	acceptedFileType,
}: any) {
	return (
		<div className="flex flex-col w-full gap-1">
			{labelText && <InputLabel labelText={labelText} isRequired={isRequired} />}
			<input
				type="file"
				accept={acceptedFileType}
				value={fileValue}
				onChange={onFileChange}
				className={`block w-full px-3 py-2 ${
					error ? "border-red-500" : "border-gray-300"
				} border border-gray-300 rounded-md`}
			/>
			{error && <ValidationErrorMessage errorText={customErrorMessage || `${labelText} is required.`} />}
		</div>
	);
}
