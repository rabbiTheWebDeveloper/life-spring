const requirements = [
	{ regex: /.{8,}/, message: "Password must be at least 8 characters" }, // Min 8 char
	{ regex: /[0-9]/, message: "Password must contain at least one number" }, // 1 number
	{ regex: /[A-Z]/, message: "Password must contain at least one uppercase letter。" }, // 1 uppercase
];

export default function checkPasswordStrength(password: string) {
	let error = undefined;

	requirements.every((item) => {
		const isValid = item.regex.test(password);
		if (!isValid) error = item.message;
		return isValid;
	});

	return error;
}
