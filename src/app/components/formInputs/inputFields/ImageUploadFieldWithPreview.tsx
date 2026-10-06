"use client";
import Image from "next/image";
import { useState } from "react";
import InputLabel from "../InputLabel";
import ValidationErrorMessage from "../validationErrorMessage/ValidationErrorMessage";

type ImageUploadProps = {
	labelText: string;
	InputName: string;
	initialImage?: string;
	onFileChange?: (file: File) => void;
	isRequired?: boolean;
	error?: boolean;
	customErrorMessage?: string;
};

const ImageUploadFieldWithPreview: React.FC<ImageUploadProps> = ({
	labelText = "lable should be here",
	InputName,
	initialImage,
	onFileChange,
	isRequired = true,
	error = "",
	customErrorMessage,
}) => {
	const [preview, setPreview] = useState<string>(initialImage || "");

	// useEffect(() => {
	// 	setPreview(initialImage || "");
	// }, [initialImage]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result as string);
				if (onFileChange) {
					onFileChange(file);
				}
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="flex flex-col w-full gap-1">
			{labelText && <InputLabel labelText={labelText} isRequired={isRequired} />}
			<div className="flex gap-2 items-center">
				<input
					type="file"
					accept="image/*"
					name={InputName}
					onChange={handleFileChange}
					className={`block w-full px-3 py-2 ${
						error ? "border-red-500" : "border-gray-300"
					} border border-gray-300 rounded-md`}
				/>
				{preview && (
					<>
						<Image
							src={preview}
							alt={`${labelText} Preview`}
							width={20}
							height={20}
							className="object-cover rounded-md w-14 h-14 border"
						/>
					</>
				)}
			</div>
			{error && <ValidationErrorMessage errorText={customErrorMessage || `${labelText} is required.`} />}
		</div>
	);
};

export default ImageUploadFieldWithPreview;
