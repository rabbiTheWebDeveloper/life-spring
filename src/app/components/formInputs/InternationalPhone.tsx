import { useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

export function validateBDPhone(input: string) {
	if (!input) return { valid: false, reason: "Phone number is required" };

	const cleaned = input.replace(/[^\d+]/g, "");

	// ✅ If starts with +880 → wait until FULL 10 digits are typed
	if (cleaned.startsWith("+880")) {
		const afterCountry = cleaned.replace("+880", "");

		// ✅ Do NOT validate yet if user is still typing
		if (afterCountry.length < 10) {
			return { valid: true, reason: "" }; // <-- no error yet
		}
	}

	// ✅ Strict final BD patterasgit
	const bdPattern = /^\+8801[3-9]\d{8}$/;

	if (cleaned.startsWith("+880") && !bdPattern.test(cleaned)) {
		return {
			valid: false,
			reason: "Invalid Bangladeshi mobile number",
		};
	}

	return {
		valid: true,
		reason: "",
	};
}

export default function InternationalPhone({ inputValue, onInputChange }: any) {
	const [error, setError] = useState("");

	const handleChange = (value: string) => {
		onInputChange(value);

		const { valid, reason } = validateBDPhone(value);

		if (!valid) {
			setError(reason);
		} else {
			setError("");
		}
	};

	return (
		<div className="mt-1 w-[250px]">
			<div className={`border rounded-md shadow-sm ${error ? "border-red-500" : "border-zinc-300"}`}>
				<PhoneInput defaultCountry="bd" value={inputValue} onChange={handleChange} />
			</div>

			{/* ✅ ERROR MESSAGE */}
			{error && <p className="text-xs text-red-600 mt-1">{error}</p>}
		</div>
	);
}
