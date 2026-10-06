"use client";
import { DatePicker } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const SingleDateFilter = ({
	initialFromDate,
	initialToDate,
	fromDateParam,
	toDateParam,
	url,
	dateFormat = "YYYY-MM-DD",
	inputPlaceholder = "Select Date",
}: any) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [selectedDate, setSelectedDate] = useState<any>(null);

	// Optionally set default date
	// useEffect(() => {
	// 	if (initialFromDate) {
	// 		setSelectedDate(dayjs(initialFromDate));
	// 	}
	// }, [initialFromDate]);

	const updateURL = (date: string) => {
		const newURL = `${url}&${fromDateParam}=${date}&${toDateParam}=${date}`;
		router.push(newURL, { scroll: false });
	};

	const handleDateChange = (date: any | null) => {
		if (date) {
			const formattedDate = date.format(dateFormat);
			setSelectedDate(date);
			updateURL(formattedDate);
		} else {
			setSelectedDate(null);
			updateURL("");
		}
	};

	return (
		<DatePicker
			className="h-10 rounded-md"
			placeholder={inputPlaceholder}
			onChange={handleDateChange}
			format={dateFormat}
			value={selectedDate}
		/>
	);
};

export default SingleDateFilter;
