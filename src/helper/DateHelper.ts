
interface WorkingHours {
	start: string;
	end: string;
}

export const convertToAMPM = (timeString: string) => {
	const [hours, minutes] = timeString.split(":");
	const date = new Date();
	date.setHours(Number(hours), Number(minutes));
	const ampmTime = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
	return ampmTime;
};

const formatTime = (hours: number, minutes: number): string => {
	const ampm = hours >= 12 ? "PM" : "AM";
	const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
	return `${formattedHours}:${formattedMinutes}${ampm}`;
};



export function addDurationToNow(d: Duration<number>): Date {
	return new Date(Date.now() + convertDurationToMillisecond(d));
}



export const formatTimeFromDate = (date: Date) => {
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	return `${hours}:${minutes}`;
};

export const getAge = (dob: string | undefined) => {
	if (!dob) return "";
	const birthDate = new Date(dob);
	if (isNaN(birthDate.getTime())) return "";
	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDifference = today.getMonth() - birthDate.getMonth();

	if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}

	return `${age} ${age === 1 ? "Year" : "Years"}`;
};

// Only a handful of patient rows carry a dob; the rest have the imported `age`
// text ("25", "22Y", "_21Y_flw", "10 months"). Reads the first source that has
// either, so a list or detail shows an age instead of a blank cell.
const AGE_TEXT = /^\s*_?(\d{1,3})\s*[yY]?\s*(?:[^0-9A-Za-z.\s].*)?$/;

export const patientAge = (...sources: ({ dob?: string; age?: string } | null | undefined)[]) => {
	for (const source of sources) {
		const fromDob = getAge(source?.dob);
		if (fromDob) return fromDob;
		const text = (source?.age ?? "").trim();
		if (!text) continue;
		const years = Number(AGE_TEXT.exec(text)?.[1]);
		return years >= 0 && years <= 120 ? `${years} ${years === 1 ? "Year" : "Years"}` : text;
	}
	return "-";
};

export function formateDate(dateString: string | undefined) {
	if (!dateString) {
		return "-";
	}
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const getSuffix = (day: number) => {
		if (day >= 11 && day <= 13) {
			return "th";
		}
		switch (day % 10) {
			case 1:
				return "st";
			case 2:
				return "nd";
			case 3:
				return "rd";
			default:
				return "th";
		}
	};

	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = months[date.getMonth()];
	const day = date.getDate();
	const suffix = getSuffix(day);

	return `${day}${suffix} ${month}, ${year}`;
}

export const convertDurationToMillisecond = (d: Duration<number>) => {
	let s = 0;
	if ("second" in d && d.second) s += d.second;
	if ("minute" in d && d.minute) s += d.minute * 60;
	return s * 1000;
};

export interface Duration<T extends number | string> {
	minute?: T;
	second?: T;
}

export function ageToDob(age: any) {
	const today = new Date();
	const years = Math.floor(age);
	const months = Math.round((age - years) * 12);
	let birthYear: any = today.getFullYear() - years;
	let birthMonth: any = today.getMonth() + 1 - months;
	if (birthMonth <= 0) {
		birthYear -= 1;
		birthMonth += 12;
	}

	const birthDate = today.getDate();
	const dob = `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(
		birthDate
	).padStart(2, "0")}`;
	return dob;
}


