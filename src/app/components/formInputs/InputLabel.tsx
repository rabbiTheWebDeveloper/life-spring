export default function InputLabel({ labelText, isRequired }: any) {
	return (
		<label className="block text-sm text-gray-700">
			{labelText} {isRequired && <span className="text-red-500">*</span>}
		</label>
	);
}
