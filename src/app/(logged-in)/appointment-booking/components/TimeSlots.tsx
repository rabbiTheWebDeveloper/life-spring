"use client";
import { getDoctorSchedules } from "@/app/(logged-in)/appointment-booking/actions/services";
import { useEffect, useState } from "react";

function formatTime(timeString: string) {
	if (!timeString) return "";
	const [hour, minute] = timeString.split(":").map(Number);
	const ampm = hour >= 12 ? "PM" : "AM";
	const formattedHour = hour % 12 || 12; // convert 0 -> 12 and 13 -> 1, etc.
	return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

// "Now" in Bangladesh time (Asia/Dhaka), as { dateStr: "YYYY-MM-DD", minutesSinceMidnight }.
function getDhakaNow() {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Dhaka",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).formatToParts(new Date());
	const get = (type: string) => parts.find((p) => p.type === type)?.value;
	const dateStr = `${get("year")}-${get("month")}-${get("day")}`;
	const minutesSinceMidnight = Number(get("hour")) * 60 + Number(get("minute"));
	return { dateStr, minutesSinceMidnight };
}

function isSlotInPast(selectedDate: string, slotStart: string) {
	if (!selectedDate || !slotStart) return false;
	const { dateStr, minutesSinceMidnight } = getDhakaNow();
	if (selectedDate < dateStr) return true;
	if (selectedDate > dateStr) return false;
	const [hour, minute] = slotStart.split(":").map(Number);
	return hour * 60 + minute <= minutesSinceMidnight;
}

const DayPeriodSelector = ({
	selectedDate,
	schedules,
	selectedDays,
	doctorID,
	setSelectedInterval,
	selectedInterval,
	setSelectedSlot,
	selectedSlot,
	doctorSchedule,
	// selectedSlotInfo,
	setSelectedSlotInfo,
}: any) => {
	console.log("DOCTOR SCHEDULE", doctorSchedule);
	const [doctorBooked, setDoctorBooked] = useState<any>([]);

	const doctorScheduleData = async (date: any) => {
		let res = await getDoctorSchedules(doctorID, date);
		if (res?.statusCode == 200) {
			setDoctorBooked(res?.data);
		}
	};

	const filteredSchedule = schedules?.find((slot: any) => slot?.date === selectedDate) || [];

	const [selectedSlotDetails, setSelectedSlotDetails] = useState<any>({});

	useEffect(() => {
		const selectedSlotInfo = selectedSlot
			? filteredSchedule?.timeSlots?.find((slot: any) => slot?.uuid === selectedSlot)
			: {};
		if (JSON.stringify(selectedSlotDetails) !== JSON.stringify(selectedSlotInfo)) {
			setSelectedSlotDetails(selectedSlotInfo);
		}
	}, [selectedSlot, filteredSchedule]);

	useEffect(() => {
		if (selectedDate && doctorID) doctorScheduleData(selectedDate);
	}, [selectedDate, doctorID]);

	return (
		<div className="p-2">
			<div>
				{selectedDays && (
					<div>
						{doctorSchedule?.length > 0 ? (
							<div>
								<h2 className="font-semibold text-[#1A1A1A] text-md mb-2">Available Time:</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
									{doctorSchedule?.map((slot: any, i: any) => {
										const isPast = isSlotInPast(selectedDate, slot?.slotStart);
										const isDisabled = slot?.isBooked || !slot?.isActive || isPast;
										return (
										<div key={i}>
											<button
												className={`text-xs  text-center  border border-primary rounded-lg cursor-pointer py-2 px-4 ${
													selectedSlot === slot.appointmentSlotId
														? "bg-primary-400 text-white"
														: `${isDisabled ? "bg-gray-200" : ""}`
												}`}
												onClick={() => {
													setSelectedSlot(slot.appointmentSlotId);
													console.log("Slot", slot);
													setSelectedSlotDetails(slot);
													setSelectedSlotInfo(slot);
												}}
												disabled={isDisabled}
											>
												<div className="flex items-center justify-center gap-2 text-xs ">
													{/* <span>
														<TbClock
															className={`${selectedSlot === slot.uuid ? "text-white" : "text-primary"}`}
															size={16}
														/>
													</span> */}
													<span
														className={`text-xs font-semibold mt-1 ${
															selectedSlot === slot.appointmentSlotId
																? " text-white"
																: `${isDisabled ? "text-gray-400" : "text-black"}`
														}`}
													>
														{formatTime(slot?.slotStart)} - {formatTime(slot?.slotEnd)}
													</span>
												</div>
												<p className="text-xs font-semibold mt-1">
													<span
														className={`text-xs font-semibold mt-1 ${
															selectedSlot === slot.appointmentSlotId
																? " text-white"
																: `${isDisabled ? "text-gray-400" : "text-black"}`
														}`}
													>
														{slot?.doctorFee} BDT
													</span>
													<span
														className={`text-xs font-semibold mt-1 ${
															selectedSlot === slot.appointmentSlotId
																? " text-white"
																: `${slot?.isBooked || !slot?.isActive ? "text-gray-400" : "text-green-600"}`
														}`}
													>
														{slot?.isBooked && " (Booked)"}
													</span>
													<span
														className={`text-xs font-semibold mt-1 ${
															selectedSlot === slot.appointmentSlotId
																? " text-white"
																: `${slot?.isBooked || !slot?.isActive ? "text-gray-400" : "text-red-600"}`
														}`}
													>
														{!slot?.isActive && " (Blocked)"}
													</span>
													<span
														className={`text-xs font-semibold mt-1 ${
															selectedSlot === slot.appointmentSlotId ? " text-white" : "text-gray-400"
														}`}
													>
														{isPast && !slot?.isBooked && slot?.isActive && " (Past)"}
													</span>
												</p>
											</button>
										</div>
										);
									})}
								</div>
							</div>
						) : (
							<p className="flex items-center justify-center text-plum text-sm">Not Available Time for this day</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default DayPeriodSelector;
