"use client";
import dayjs from "dayjs";
import { useRef } from "react";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";

const AppointmentCalendar = ({
	workDays,
	setSelectedDays,
	selectedDates,
	setSelectedDates,
	startDate,
	endDate,
}: any) => {
	const scrollContainerRef: any = useRef(null);

	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: -150, behavior: "smooth" });
		}
	};
	const scrollRight = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: 150, behavior: "smooth" });
		}
	};

	return (
		<>
			<div className="flex items-center justify-between">
				<div className="">
					<h2 className="font-semibold text-[#1A1A1A] text-md">Appointment Date:</h2>
				</div>
				<div className="flex space-x-4">
					<IoIosArrowDropleft size={27} onClick={scrollLeft} />
					<IoIosArrowDropright size={27} onClick={scrollRight} />
				</div>
			</div>
			<div ref={scrollContainerRef} className="flex overflow-x-auto space-x-4 py-2 scrollbar-thin">
				{getDays(workDays, startDate, endDate)?.map(({ date, day, monthYear, fullDate, isDisabled }) => (
					<button
						disabled={isDisabled}
						key={fullDate}
						onClick={() => {
							setSelectedDates(fullDate);
							setSelectedDays(day);
						}}
						className={`${
							selectedDates === fullDate ? "bg-primary-400 text-white" : ""
						} border border-primary  rounded-lg flex items-center justify-center min-w-[6rem] h-[5.25rem] disabled:opacity-50 disabled:cursor-not-allowed`}
					>
						<div className="text-center">
							<p className="text-xs font-medium">{day}</p>
							<p className="text-md font-bold">{date}</p>
							<p className="text-xs font-medium">{monthYear}</p>
						</div>
					</button>
				))}
			</div>
		</>
	);
};

export default AppointmentCalendar;

// "today" in Bangladesh time (Asia/Dhaka), regardless of the server/browser's own timezone.
const getDhakaTodayString = () =>
	new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Dhaka",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date());

const getDays = (workDays: any, startDate: any, endDate: any) => {
	let arr = [];
	let start = dayjs(startDate);
	const end = dayjs(endDate).add(1, "day");
	const today = dayjs(getDhakaTodayString()).startOf("day");

	while (start.isBefore(end)) {
		const dayName = start.format("dddd");

		arr.push({
			day: dayName,
			date: start.format("D"),
			monthYear: start.format("MMM, YY"),
			fullDate: start.format("YYYY-MM-DD"),
			isDisabled:
				start.isBefore(today) || !workDays?.some((item: any) => item === dayName),
		});

		start = start.add(1, "day");
	}

	return arr;
};
