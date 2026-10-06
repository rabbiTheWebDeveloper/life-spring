"use client";

import { getDoctorSchedule } from "@/app/(logged-in)/appointment-booking/actions/services";
import DayPeriodSelector from "@/app/(logged-in)/appointment-booking/components/TimeSlots";
import moment from "moment/moment";
import { useEffect, useState } from "react";

import AppointmentCalendar from "@/app/(logged-in)/appointment-booking/components/AppointmentCalander";
import Loader from "@/app/(logged-in)/dashboard/components/Loader";
import DropdownWithSearch from "@/app/components/formInputs/DropdownWithSearch";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { getDoctorScheduleTimeSlot } from "../actions/action";
const { RangePicker } = DatePicker;

function formatToDesiredDate(inputDate: string): string {
	return moment(inputDate).format("YYYY-MM-DD HH:mm");
}

// Returns "today" as YYYY-MM-DD in Bangladesh time (Asia/Dhaka), regardless of
// the server/browser's own timezone (server containers may default to UTC).
function getDhakaTodayString(): string {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Dhaka",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date());
}

const BookingDateTimeSelection = ({
	doctor,
	setScheduleStart,
	setScheduleEnd,
	branchId,
	setBranchId,
	setSelectedSlot,
	selectedSlot,
	selectedSlotInfo,
	setSelectedSlotInfo,
}: any) => {
	const [selectedDays, setSelectedDays] = useState<any>(null);
	const [selectedDates, setSelectedDates] = useState<any>(null);
	const [selectedInterval, setSelectedInterval] = useState<any>(null);
	// const [selectedSlot, setSelectedSlot] = useState<any>("");
	const [docSchedule, setDocSchedule] = useState<any>([]);
	const [daysOfWeek, setDaysOfWeek] = useState<any>([]);
	const [doctorSchedule, setDoctorSchedule] = useState<any>([]);

	const [loading, setLoading] = useState<any>(false);

	const defaultStart = dayjs(getDhakaTodayString());
	const defaultEnd = dayjs(getDhakaTodayString()).add(7, "day");

	const [dateRange, setDateRange] = useState<any>([defaultStart, defaultEnd]);
	const [startDate, setStartDate] = useState<string>(defaultStart.format("YYYY-MM-DD"));
	const [endDate, setEndDate] = useState<string>(defaultEnd.format("YYYY-MM-DD"));

	const handleDateChange = (dates: any) => {
		if (dates && dates[0] && dates[1]) {
			setStartDate(dates[0].format("YYYY-MM-DD"));
			setEndDate(dates[1].format("YYYY-MM-DD"));
			setDateRange([dates[0], dates[1]]);
		} else {
			setStartDate("");
			setEndDate("");
			setDateRange(null);
		}
	};

	useEffect(() => {
		if (selectedInterval) {
			let time = convertTo24Hour(selectedInterval);
			const [startTime, endTime] = time?.split(" - ");
			if (startTime && endTime) {
				const start = moment(`${moment(selectedDates).format("YYYY-MM-DD")} ${startTime}`, "YYYY-MM-DD hh:mm");
				const end = moment(`${moment(selectedDates).format("YYYY-MM-DD")} ${endTime}`, "YYYY-MM-DD hh:mm");

				setScheduleStart(formatToDesiredDate(start?.format()));
				setScheduleEnd(formatToDesiredDate(end?.format()));
			} else {
				console.error("Invalid time format in selectedInterval.");
			}
		}
	}, [selectedDates, selectedInterval]);

	function convertTo24Hour(timeRange: any) {
		const [startTime, endTime] = timeRange.split(" - ");

		const convertTime = (time: any) => {
			let [hours, minutes] = time.split(/[:\s]/);
			const period = time.slice(-2);
			hours = parseInt(hours, 10);

			if (period === "PM" && hours !== 12) {
				hours += 12;
			} else if (period === "AM" && hours === 12) {
				hours = 0;
			}

			return `${hours.toString().padStart(2, "0")}:${minutes}`;
		};

		const start24Hour = convertTime(startTime);
		const end24Hour = convertTime(endTime);

		return `${start24Hour} - ${end24Hour}`;
	}

	const fetchInitialData = async (branchId: any, startDate: any, endDate: any) => {
		setLoading(true);
		try {
			const res = await getDoctorSchedule(doctor?.id, branchId, startDate, endDate);
			if (res?.statusCode === 200) {
				setDaysOfWeek(
					Array.from(
						new Set(
							(res?.data || []).map((item: any) => {
								const day = item?.dayOfWeek;
								return typeof day === "string" ? day.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) : "";
							}),
						),
					),
				);
				setDocSchedule(res?.data);
			}
		} catch (error) {
			console.error("Error fetching doctor schedule:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (branchId && endDate && doctor?.id && endDate) fetchInitialData(branchId, startDate, endDate);
	}, [doctor?.id, branchId, startDate, endDate]);

	useEffect(() => {
		if (doctor?.branches && doctor?.branches?.length > 0) {
			setBranchId(doctor?.branches[0]?.branch?.id);
		}
	}, [doctor?.branches]);

	const fetchDoctorSlots = async () => {
		// setLoading(true);
		try {
			const res = await getDoctorScheduleTimeSlot(doctor?.id, branchId, selectedDates);
			console.log("Doctor Slots Response:", res);
			if (res?.statusCode === 200) {
				if (res.data.availability.length === 0) {
					setDoctorSchedule([]);
					return;
				}
				// setDoctorSchedule(res.data.availability[0].slots);
				const allSlots = res.data.availability.flatMap((availability: any) => availability.slots);

				setDoctorSchedule(allSlots);
			}
		} catch (error) {
			console.error("Error fetching schedule:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (branchId && selectedDates && doctor?.id) fetchDoctorSlots();
	}, [doctor?.id, branchId, selectedDates]);

	return (
		<div className="mt-2">
			<div className="flex items-center justify-between mb-2">
				<div className="w-[300px]">
					<DropdownWithSearch
						labelText=""
						selectionValue={branchId}
						onSelectChange={setBranchId}
						selectionOptions={[
							{ value: "", label: "Select a branch" },
							...(doctor?.branches?.map((item: any) => ({
								value: item?.id,
								label: item?.name,
							})) || []),
						]}
						inputPlaceholder="Select a branch"
						isRequired={false}
					/>
				</div>
				<div className="">
					<RangePicker
						value={dateRange}
						format="YYYY-MM-DD"
						onChange={handleDateChange}
						className="h-10 "
						disabledDate={(current) =>
							current &&
							(current < dayjs(getDhakaTodayString()).startOf("day") ||
								current > dayjs(getDhakaTodayString()).add(3, "month"))
						}
					/>
				</div>
			</div>
			{loading ? (
				<Loader />
			) : (
				<div className="flex flex-col gap-3">
					<AppointmentCalendar
						workDays={daysOfWeek}
						setSelectedDays={setSelectedDays}
						setSelectedDates={setSelectedDates}
						selectedDates={selectedDates}
						endDate={endDate}
						startDate={startDate}
					/>

					<DayPeriodSelector
						selectedDate={selectedDates}
						schedules={docSchedule}
						selectedDays={selectedDays}
						doctorID={doctor?.id}
						selectedInterval={selectedInterval}
						setSelectedInterval={setSelectedInterval}
						selectedSlot={selectedSlot}
						setSelectedSlot={setSelectedSlot}
						doctorSchedule={doctorSchedule}
						selectedSlotInfo={selectedSlotInfo}
						setSelectedSlotInfo={setSelectedSlotInfo}
					/>
				</div>
			)}
		</div>
	);
};

export default BookingDateTimeSelection;
