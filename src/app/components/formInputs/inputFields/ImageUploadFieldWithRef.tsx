import InputLabel from "../InputLabel";

export default function ImageUploadFieldWithRef({
	labelText,
	isRequired = true,
	inputName,
	inputRef,
	acceptedInputType = "image/*",
	onFileChange,
	isReadOnly,
}: any) {
	return (
		<div className="flex flex-col gap-1">
			{labelText && <InputLabel labelText={labelText} isRequired={isRequired} />}
			<div className="border p-2 rounded-md">
				<input
					name={inputName}
					ref={inputRef}
					type="file"
					accept={acceptedInputType}
					onChange={onFileChange}
					disabled={isReadOnly}
				/>
			</div>
		</div>
	);
}
