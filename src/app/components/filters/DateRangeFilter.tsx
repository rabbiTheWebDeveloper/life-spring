"use client";
import { DatePicker } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const { RangePicker } = DatePicker;

const DateRangeFilter = ({
	initialFromDate,
	initialToDate,
	fromDateParam,
	toDateParam,
	url,
	dateRangeFormat = "YYYY-MM-DD",
	inputPlaceholder = ["From Date", "To Date"],
}: any) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [dateRange, setDateRange] = useState<any>(null);

	// useEffect(() => {
	// 	if (initialFromDate && initialToDate) {
	// 		setDateRange([dayjs(initialFromDate), dayjs(initialToDate)]);
	// 	} else {
	// 		const defaultStartDate = dayjs().subtract(30, "days");
	// 		const defaultEndDate = dayjs();
	// 		setDateRange([defaultStartDate, defaultEndDate]);
	// 	}
	// }, [initialFromDate, initialToDate]);

	const updateURL = (startDate: string, endDate: string) => {
		const newURL = `${url}&${fromDateParam}=${startDate}&${toDateParam}=${endDate}`;
		router.push(newURL, { scroll: false });
	};

	const handleDateRangeChange = (dates: any | null) => {
		if (dates && dates[0] && dates[1]) {
			const startDate = dates[0].format(dateRangeFormat);
			const endDate = dates[1].format(dateRangeFormat);
			setDateRange([dates[0], dates[1]]);
			updateURL(startDate, endDate);
		} else {
			setDateRange(null);
			updateURL("", "");
		}
	};

	return (
		<RangePicker
			className="h-9 rounded-md"
			size="middle"
			placeholder={inputPlaceholder}
			onChange={handleDateRangeChange}
			format={dateRangeFormat}
			value={dateRange}
		/>
	);
};

export default DateRangeFilter;
