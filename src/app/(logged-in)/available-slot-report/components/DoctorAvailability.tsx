"use client";
import Link from "next/link";
import { useState } from "react";
import AppointmentBookingModal from "./AppointmentBookingModal";
import SlotUpdateModal from "./SlotUpdateModal";
import TimeSlotTable from "./TimeSlotTable";

export default function DoctorAvailability({
	availability,
	doctor,
	branchId,
	loading,
	fetchAppointmentTimeSlot,
	fetchParams,
	options,
}: any) {
	const [showModal, setShowModal] = useState(false);
	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [slotDetails, setSlotDetails] = useState(null);
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedBranchId, setSelectedBranchId] = useState(null);
	const [doctorInfo, setDoctorInfo] = useState({
		label: "",
		value: "",
	});

	// console.log("Doctor Availability", doctorsId, doctorsName);

	function handleAppointment(data: any) {
		setShowModal(true);
		setSlotDetails(data);
	}
	function handleSlotUpdate(data: any) {
		console.log("DART", data);
		setShowUpdateModal(true);
		setSlotDetails(data);
	}
	function handleCloseModal(data: any) {
		setShowModal(false);
		setShowUpdateModal(false);
		setSlotDetails(null);
	}

	return (
		<>
			{loading ? (
				<div className="animate-pulse">
					{Array.from({ length: 2 }).map((_, index) => (
						<div key={index} className="mb-10">
							<div className="mb-4 text-center">
								<div className="h-7 bg-gray-200 rounded w-64 mx-auto mb-2"></div>
								<div className="h-5 bg-gray-200 rounded w-80 mx-auto mb-2"></div>
								<div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
							</div>
							<TimeSlotTable data={[]} handleAppointment={() => {}} handleUpdateSlot={() => {}} loading={true} />
						</div>
					))}
				</div>
			) : (
				<div>
					{availability.map((available: any) => (
						<div className="mb-10" key={`${available.doctorId}-${available.branchId}-${available.date}`}>
							{/* {JSON.stringify(available)} */}
							<div className="mb-4 text-center">
								<h1 className="text-xl font-semibold text-red-700">{available.doctorName}</h1>
								<h1 className="text-md font-semibold">
									{available?.branchName} - {available.date} ({available.dayOfWeek})
								</h1>
								<Link
									className="text-xs text-blue-500 hover:underline mx-2"
									href={`/doctor/schedule/${available.doctorId}?branchId=${available.branchId}&date=${available.date}`}
								>
									Edit day
								</Link>
								{/* <h2 className="text-xl font-semibold"></h2>
						<h1 className="text-xl font-semibold">{branchId?.name}</h1> */}
							</div>
							<TimeSlotTable
								data={available.slots}
								date={available.date}
								handleAppointment={(data: any) => {
									setSelectedDate(available.date);
									setDoctorInfo({
										label: available?.doctorName,
										value: available?.doctorId,
									});
									setSelectedBranchId(available.branchId);
									handleAppointment(data);
								}}
								handleUpdateSlot={handleSlotUpdate}
								loading={false}
							/>
							{/* {JSON.stringify(available)} */}
						</div>
					))}
					{showModal && (
						<AppointmentBookingModal
							slotInfo={slotDetails}
							doctor={doctorInfo}
							showModal={showModal}
							branchId={selectedBranchId}
							onCloseModal={handleCloseModal}
							selectedDate={selectedDate}
							options={options}
						/>
					)}
					<SlotUpdateModal
						slotInfo={slotDetails}
						showModal={showUpdateModal}
						onCloseModal={handleCloseModal}
						fetchAppointmentTimeSlot={fetchAppointmentTimeSlot}
						fetchParams={fetchParams}
						options={options}
					/>
				</div>
			)}
		</>
	);
}
