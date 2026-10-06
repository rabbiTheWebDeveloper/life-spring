// The API returns UTC instants; the admin always renders them in Bangladesh time,
// never in the viewer's browser timezone. A date/time typed into a form is Dhaka
// wall-clock and is sent without an offset for the backend to convert.
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const DHAKA_TZ = "Asia/Dhaka";

// Formats a UTC instant in Dhaka time. "-" for an empty or unparseable value.
export const formatDhaka = (value: string | number | Date, pattern: string): string => {
	if (value === null || value === undefined || value === "") return "-";
	const d = dayjs(value);
	return d.isValid() ? d.tz(DHAKA_TZ).format(pattern) : "-";
};

// Dhaka wall-clock string for a date input, e.g. "2026-09-02 17:05:00". "" when empty/invalid.
export const toDhakaWallClock = (value: string | number | Date): string => {
	if (value === null || value === undefined || value === "") return "";
	const d = dayjs(value);
	return d.isValid() ? d.tz(DHAKA_TZ).format("YYYY-MM-DD HH:mm:ss") : "";
};

export const dhakaNow = (): dayjs.Dayjs => dayjs().tz(DHAKA_TZ);
