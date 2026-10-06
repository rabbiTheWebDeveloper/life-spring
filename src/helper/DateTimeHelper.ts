//Formatting date DD-MM-YYYY in Bangladesh time (Asia/Dhaka)
export function formatDateOnly(isoString:any) {
	const date = new Date(isoString);
	const parts = new Intl.DateTimeFormat('en-GB', {
		timeZone: 'Asia/Dhaka',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}).formatToParts(date);
	const day = parts.find((p) => p.type === 'day')?.value;
	const month = parts.find((p) => p.type === 'month')?.value;
	const year = parts.find((p) => p.type === 'year')?.value;
	return `${day}-${month}-${year}`;
}

//Formatting in Bangladesh time (Asia/Dhaka) (used for createdAt,updatedAt etc)
export function formatDateTime(isoString:any) {
	const date = new Date(isoString);
	const parts = new Intl.DateTimeFormat('en-GB', {
		timeZone: 'Asia/Dhaka',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	}).formatToParts(date);
	const day = parts.find((p) => p.type === 'day')?.value;
	const month = parts.find((p) => p.type === 'month')?.value;
	const year = parts.find((p) => p.type === 'year')?.value;
	const hour = parts.find((p) => p.type === 'hour')?.value;
	const minute = parts.find((p) => p.type === 'minute')?.value;
	const amPm = parts.find((p) => p.type === 'dayPeriod')?.value?.toUpperCase();

	return `${day}-${month}-${year} ${hour}:${minute} ${amPm}`;
}

//Formatting for UTC 0  (used for my own entry data  etc)
export const formatUTCDateTime = (isoString:any) => {
	const date = new Date(isoString);

	// Ensure the date is valid
	if (isNaN(date.getTime())) return "Invalid Date";

	// Extract UTC date components
	const day = date.getUTCDate().toString().padStart(2, '0'); // Two-digit day
	const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Two-digit month
	const year = date.getUTCFullYear();

	// Extract UTC time components
	const hours = date.getUTCHours() % 12 || 12; // Convert 24-hour format to 12-hour
	const minutes = date.getUTCMinutes().toString().padStart(2, '0'); // Two-digit minutes
	const ampm = date.getUTCHours() >= 12 ? 'PM' : 'AM';

	return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
};
