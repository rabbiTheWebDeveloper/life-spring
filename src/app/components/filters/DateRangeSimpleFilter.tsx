"use client";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const { RangePicker } = DatePicker;

interface DateRangeSimpleFilterProps {
	fromDateParam: string;
	toDateParam: string;
	url: string;
	dateRangeFormat?: string;
}

const DateRangeSimpleFilter = ({
	fromDateParam,
	toDateParam,
	url,
	dateRangeFormat = "YYYY-MM-DD",
}: DateRangeSimpleFilterProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

	useEffect(() => {
		const from = searchParams.get(fromDateParam);
		const to = searchParams.get(toDateParam);
		const fromValid = from && dayjs(from, dateRangeFormat, true).isValid();
		const toValid = to && dayjs(to, dateRangeFormat, true).isValid();

		setDateRange([fromValid ? dayjs(from, dateRangeFormat) : null, toValid ? dayjs(to, dateRangeFormat) : null]);
	}, [searchParams, fromDateParam, toDateParam, dateRangeFormat]);

	const updateURL: any = (startDate: string, endDate: string) => {
		const newURL = `${url}&${fromDateParam}=${startDate}&${toDateParam}=${endDate}`;
		router.push(newURL, { scroll: false });
	};

	const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
		if (!dates) {
			setDateRange([null, null]);
			updateURL(null, null);
			return;
		}

		const [startDate, endDate] = dates;
		setDateRange([startDate, endDate]);

		const formattedStartDate = startDate ? startDate.format(dateRangeFormat) : null;
		const formattedEndDate = endDate ? endDate.format(dateRangeFormat) : null;

		updateURL(formattedStartDate, formattedEndDate);
	};

	return (
		<RangePicker
			className="h-10 rounded-md"
			placeholder={["From Date", "To Date"]}
			onChange={handleDateRangeChange}
			format={dateRangeFormat}
			value={dateRange}
			allowClear
		/>
	);
};

export default DateRangeSimpleFilter;
