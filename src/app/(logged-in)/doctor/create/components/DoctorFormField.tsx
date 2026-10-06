interface Props {
	label: string;
	name: string;
	type: "text" | "email" | "date" | "number";
	placeholder: string;
	maxLength?: number;
	min?: number;
	required: boolean;
	defaultValue?: string;
}

const DoctorFormField = ({ label, name, type, placeholder, min, maxLength, required, defaultValue }: any) => (
	<div className="flex flex-col gap-1 justify-start">
		<label className="text-gr text-medium text-sm">
			{label} {required && <span className="text-red-500 font-bold">*</span>}
		</label>
		<input
			className="border-2 rounded-md p-2 text-gr focus:outline-none"
			name={name}
			type={type}
			min={min}
			placeholder={placeholder}
			maxLength={maxLength}
			required={required}
			defaultValue={defaultValue} // Added defaultValue
		/>
	</div>
);

export default DoctorFormField;
